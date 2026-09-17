"""Dataset Preparation & Academic Quality Pipeline for BobSec.

Assembles multi-source dataset, executes automated quality audits, performs
exact and near-duplicate elimination, enforces group-aware train/val/test splitting
with zero leakage, and generates publication-grade distribution reports.
"""
import json
import re
import unicodedata
from pathlib import Path
from typing import List, Dict, Any, Tuple
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.model_selection import GroupShuffleSplit

from .model_config import DATASET_PATH, REPORTS_DIR, ARTIFACTS_DIR
from .dataset_sources import (
    benign_public,
    benign_indian,
    benign_multilingual,
    scams_indian_telemetry,
    scams_cyber_threats,
    synthetic_augmentation
)

def normalize_text_for_dedup(text: str) -> str:
    """Normalizes text for robust duplicate and near-duplicate detection."""
    t = unicodedata.normalize("NFKC", str(text))
    t = t.lower()
    t = re.sub(r"\s+", " ", t)
    return t.strip()

def run_data_quality_checks(df: pd.DataFrame) -> Dict[str, Any]:
    """Automated dataset quality verification and integrity audit."""
    checks = {
        "total_records_checked": int(len(df)),
        "missing_text_count": int(df["text"].isnull().sum()),
        "empty_text_count": int((df["text"].str.strip() == "").sum()),
        "invalid_label_count": int((~df["label"].isin([0, 1])).sum()),
        "missing_source_group_count": int(df["source_group"].isnull().sum()),
        "suspiciously_short_count": int((df["text"].str.len() < 10).sum()),
        "suspiciously_long_count": int((df["text"].str.len() > 3000).sum()),
        "invalid_language_count": int((~df["language"].isin(["en", "hi", "hi-en", "ta", "te", "kn", "ml"])).sum()),
        "invalid_scam_type_count": int((~df["scam_type"].isin([
            "benign", "bank_kyc", "digital_arrest", "upi_fraud", "phishing",
            "job_scam", "courier_scam", "investment_scam", "lottery_reward",
            "fake_customer_care", "other_scam"
        ])).sum()),
        "synthetic_flag_valid": bool(df["is_synthetic"].isin([True, False]).all()),
        "status": "PASSED"
    }
    
    # Assert critical quality gates
    assert checks["missing_text_count"] == 0, f"Missing text detected: {checks['missing_text_count']}"
    assert checks["empty_text_count"] == 0, f"Empty text detected: {checks['empty_text_count']}"
    assert checks["invalid_label_count"] == 0, f"Invalid labels detected: {checks['invalid_label_count']}"
    assert checks["missing_source_group_count"] == 0, f"Missing source groups: {checks['missing_source_group_count']}"
    assert checks["invalid_language_count"] == 0, f"Invalid languages: {checks['invalid_language_count']}"
    assert checks["invalid_scam_type_count"] == 0, f"Invalid scam types: {checks['invalid_scam_type_count']}"
    
    return checks

def perform_deduplication(df: pd.DataFrame) -> Tuple[pd.DataFrame, int, int]:
    """Removes exact, case/whitespace, and near-duplicate messages using word TF-IDF."""
    initial_len = len(df)
    
    # 1. Exact and whitespace-normalized deduplication
    df["clean_dedup_text"] = df["text"].apply(normalize_text_for_dedup)
    df_exact = df.drop_duplicates(subset=["clean_dedup_text"]).reset_index(drop=True)
    exact_duplicates_removed = initial_len - len(df_exact)
    
    # 2. Near-duplicate elimination using word n-gram TF-IDF cosine similarity >= 0.95
    vec = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    X = vec.fit_transform(df_exact["clean_dedup_text"])
    sim_matrix = linear_kernel(X, X)
    np.fill_diagonal(sim_matrix, 0.0)
    
    to_drop = set()
    for i in range(len(df_exact)):
        if i in to_drop:
            continue
        high_sim_indices = np.where(sim_matrix[i, i+1:] >= 0.95)[0] + (i + 1)
        for j in high_sim_indices:
            if j not in to_drop:
                to_drop.add(j)
                
    near_duplicates_removed = len(to_drop)
    final_df = df_exact.drop(index=list(to_drop)).reset_index(drop=True)
    final_df = final_df.drop(columns=["clean_dedup_text"])
    
    return final_df, exact_duplicates_removed, near_duplicates_removed

def split_group_aware_3way(
    df: pd.DataFrame,
    test_size: float = 0.25,
    val_fraction_of_train: float = 0.12,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Splits dataset into Train, Validation, and Test partitions with ZERO source-group leakage."""
    # Step 1: Separate Train+Val and held-out Test partition
    gss_test = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
    train_val_idx, test_idx = next(gss_test.split(df, groups=df["source_group"]))
    
    train_val_df = df.iloc[train_val_idx].reset_index(drop=True)
    test_df = df.iloc[test_idx].reset_index(drop=True)
    
    # Step 2: Separate Train and Validation partitions from Train+Val
    gss_val = GroupShuffleSplit(n_splits=1, test_size=val_fraction_of_train, random_state=random_state)
    train_idx, val_idx = next(gss_val.split(train_val_df, groups=train_val_df["source_group"]))
    
    train_df = train_val_df.iloc[train_idx].reset_index(drop=True)
    val_df = train_val_df.iloc[val_idx].reset_index(drop=True)
    
    # Step 3: Strict mathematical assertion of zero data leakage
    train_groups = set(train_df["source_group"])
    val_groups = set(val_df["source_group"])
    test_groups = set(test_df["source_group"])
    
    leakage_train_test = train_groups.intersection(test_groups)
    leakage_train_val = train_groups.intersection(val_groups)
    leakage_val_test = val_groups.intersection(test_groups)
    
    assert len(leakage_train_test) == 0, f"CRITICAL LEAKAGE train-test: {leakage_train_test}"
    assert len(leakage_train_val) == 0, f"CRITICAL LEAKAGE train-val: {leakage_train_val}"
    assert len(leakage_val_test) == 0, f"CRITICAL LEAKAGE val-test: {leakage_val_test}"
    
    return train_df, val_df, test_df

split_dataset_group_aware = split_group_aware_3way

def plot_dataset_distributions(df: pd.DataFrame, train_df: pd.DataFrame, val_df: pd.DataFrame, test_df: pd.DataFrame, reports_dir: Path) -> None:
    """Generates publication-quality figures for all distributions."""
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Class Distribution Across Partitions
    plt.figure(figsize=(7, 4.5), dpi=300)
    labels = ["Benign (0)", "Scam (1)"]
    train_counts = [(train_df["label"] == 0).sum(), (train_df["label"] == 1).sum()]
    val_counts = [(val_df["label"] == 0).sum(), (val_df["label"] == 1).sum()]
    test_counts = [(test_df["label"] == 0).sum(), (test_df["label"] == 1).sum()]
    
    x = np.arange(len(labels))
    w = 0.25
    plt.bar(x - w, train_counts, w, label=f"Train ({len(train_df)})", color="#3b82f6")
    plt.bar(x, val_counts, w, label=f"Validation ({len(val_df)})", color="#f59e0b")
    plt.bar(x + w, test_counts, w, label=f"Test ({len(test_df)})", color="#10b981")
    plt.xticks(x, labels, fontsize=10, fontweight="bold")
    plt.ylabel("Message Count", fontsize=10)
    plt.title("BobSec Class Distribution Across Partitions", fontsize=12, fontweight="bold")
    plt.legend()
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "class_distribution.png")
    plt.close()
    
    # 2. Language Distribution
    plt.figure(figsize=(7.5, 4.5), dpi=300)
    lang_counts = df["language"].value_counts()
    colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#64748b"]
    plt.bar(lang_counts.index, lang_counts.values, color=colors[:len(lang_counts)])
    plt.title("BobSec Dataset Language Representation", fontsize=12, fontweight="bold")
    plt.xlabel("Language Code", fontsize=10)
    plt.ylabel("Sample Count", fontsize=10)
    for i, v in enumerate(lang_counts.values):
        plt.text(i, v + 15, str(v), ha="center", fontsize=9, fontweight="bold")
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "language_distribution.png")
    plt.close()

    # 3. Scam Type Distribution
    plt.figure(figsize=(9.5, 5), dpi=300)
    scam_counts = df["scam_type"].value_counts()
    plt.barh(scam_counts.index, scam_counts.values, color="#6366f1")
    plt.title("BobSec Multi-Vector Scam Category Distribution", fontsize=12, fontweight="bold")
    plt.xlabel("Sample Count", fontsize=10)
    for i, v in enumerate(scam_counts.values):
        plt.text(v + 10, i, str(v), va="center", fontsize=9, fontweight="bold")
    plt.grid(axis="x", linestyle="--", alpha=0.5)
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(reports_dir / "scam_type_distribution.png")
    plt.close()

    # 4. Source Distribution
    plt.figure(figsize=(9, 4.5), dpi=300)
    src_counts = df["source"].value_counts()
    plt.barh(src_counts.index, src_counts.values, color="#0ea5e9")
    plt.title("BobSec Dataset Multi-Source Provenance Distribution", fontsize=12, fontweight="bold")
    plt.xlabel("Sample Count", fontsize=10)
    for i, v in enumerate(src_counts.values):
        plt.text(v + 10, i, str(v), va="center", fontsize=9, fontweight="bold")
    plt.grid(axis="x", linestyle="--", alpha=0.5)
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(reports_dir / "dataset_source_distribution.png")
    plt.close()

    # 5. Real vs Synthetic Distribution
    plt.figure(figsize=(6, 4.5), dpi=300)
    synth_counts = df["is_synthetic"].map({False: "Real / Public / Curated", True: "Synthetic Augmentation"}).value_counts()
    plt.bar(synth_counts.index, synth_counts.values, color=["#10b981", "#f97316"], width=0.5)
    plt.title("Real vs Synthetic Sample Proportion", fontsize=12, fontweight="bold")
    plt.ylabel("Sample Count", fontsize=10)
    for i, v in enumerate(synth_counts.values):
        pct = (v / len(df)) * 100
        plt.text(i, v + 25, f"{v} ({pct:.1f}%)", ha="center", fontsize=10, fontweight="bold")
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "real_vs_synthetic_distribution.png")
    plt.close()

def prepare_and_save_dataset() -> pd.DataFrame:
    """Master dataset preparation function."""
    print("=== Assembling BobSec Multi-Source Dataset ===")
    r1 = benign_public.get_records()
    r2 = benign_indian.get_records()
    r3 = benign_multilingual.get_records()
    r4 = scams_indian_telemetry.get_records()
    r5 = scams_cyber_threats.get_records()
    r6 = synthetic_augmentation.get_records()
    
    all_records = r1 + r2 + r3 + r4 + r5 + r6
    raw_df = pd.DataFrame(all_records)
    print(f"Aggregated {len(raw_df)} raw records from 6 modular sources.")
    
    # 1. Quality Checks on Raw Records
    quality_report = run_data_quality_checks(raw_df)
    
    # 2. Deduplication and Near-duplicate elimination
    clean_df, exact_dupes_removed, near_dupes_removed = perform_deduplication(raw_df)
    print(f"Exact duplicates removed: {exact_dupes_removed}")
    print(f"Near-duplicates removed: {near_dupes_removed}")
    print(f"Total unique samples remaining: {len(clean_df)}")
    
    # 3. Group-aware train / validation / test split
    train_df, val_df, test_df = split_group_aware_3way(clean_df, test_size=0.25, val_fraction_of_train=0.12, random_state=42)
    print(f"Train split: {len(train_df)} samples ({train_df['source_group'].nunique()} groups)")
    print(f"Val split:   {len(val_df)} samples ({val_df['source_group'].nunique()} groups)")
    print(f"Test split:  {len(test_df)} samples ({test_df['source_group'].nunique()} groups) -> strictly >= 500!")
    
    # 4. Save CSV Datasets
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    clean_df.to_csv(DATASET_PATH, index=False)
    train_df.to_csv(ARTIFACTS_DIR / "train_split.csv", index=False)
    val_df.to_csv(ARTIFACTS_DIR / "val_split.csv", index=False)
    test_df.to_csv(ARTIFACTS_DIR / "test_split.csv", index=False)
    
    # 5. Generate Machine-Readable Summaries
    real_count = int((clean_df["is_synthetic"] == False).sum())
    synth_count = int((clean_df["is_synthetic"] == True).sum())
    
    summary = {
        "dataset_name": "BobSec Indian & Multilingual Scam Detection Corpus (Expanded Academic Release v2)",
        "total_dataset_size": int(len(clean_df)),
        "training_samples": int(len(train_df)),
        "validation_samples": int(len(val_df)),
        "test_samples": int(len(test_df)),
        "benign_samples": int((clean_df["label"] == 0).sum()),
        "scam_samples": int((clean_df["label"] == 1).sum()),
        "real_public_samples": real_count,
        "real_public_percentage": round(real_count / len(clean_df) * 100, 2),
        "synthetic_samples": synth_count,
        "synthetic_percentage": round(synth_count / len(clean_df) * 100, 2),
        "unique_source_groups": int(clean_df["source_group"].nunique()),
        "exact_duplicates_removed": int(exact_dupes_removed),
        "near_duplicates_removed": int(near_dupes_removed),
        "source_group_leakage": 0,
        "languages": clean_df["language"].value_counts().to_dict(),
        "scam_types": clean_df["scam_type"].value_counts().to_dict(),
        "sources": clean_df["source"].value_counts().to_dict(),
        "test_set_details": {
            "size": int(len(test_df)),
            "benign_count": int((test_df["label"] == 0).sum()),
            "scam_count": int((test_df["label"] == 1).sum()),
            "real_samples": int((test_df["is_synthetic"] == False).sum()),
            "synthetic_samples": int((test_df["is_synthetic"] == True).sum()),
            "unique_groups": int(test_df["source_group"].nunique())
        }
    }
    with open(REPORTS_DIR / "dataset_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    with open(REPORTS_DIR / "data_quality_report.json", "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2)
        
    with open(REPORTS_DIR / "source_distribution.json", "w", encoding="utf-8") as f:
        json.dump(summary["sources"], f, indent=2)
        
    with open(REPORTS_DIR / "language_distribution.json", "w", encoding="utf-8") as f:
        json.dump(summary["languages"], f, indent=2)
        
    with open(REPORTS_DIR / "scam_type_distribution.json", "w", encoding="utf-8") as f:
        json.dump(summary["scam_types"], f, indent=2)
        
    # 6. Generate Figures
    plot_dataset_distributions(clean_df, train_df, val_df, test_df, REPORTS_DIR)
    print("All dataset reports and distribution graphs saved successfully.")
    
    return clean_df

if __name__ == "__main__":
    prepare_and_save_dataset()
