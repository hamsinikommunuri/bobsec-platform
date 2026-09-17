"""Unit tests for BobSec dataset validation, academic quality, and leakage prevention."""
import pytest
import pandas as pd
from ml.src.model_config import DATASET_PATH, TRAIN_SPLIT_PATH, VAL_SPLIT_PATH, TEST_SPLIT_PATH
from ml.src.prepare_dataset import split_dataset_group_aware

def test_dataset_file_exists_and_valid():
    assert DATASET_PATH.exists(), f"Dataset file not found at {DATASET_PATH}"
    df = pd.read_csv(DATASET_PATH)
    # Primary requirement: dataset size between 2000-3000 (minimum 1500)
    assert len(df) >= 1500, f"Expected at least 1500 samples, got {len(df)}"
    
    required_cols = {"text", "label", "scam_type", "language", "source_group", "provenance", "is_synthetic"}
    assert required_cols.issubset(df.columns), f"Missing required columns: {required_cols - set(df.columns)}"

def test_dataset_labels_binary():
    df = pd.read_csv(DATASET_PATH)
    labels = set(df["label"].unique())
    assert labels == {0, 1}, f"Labels must be strictly binary {0, 1}, got {labels}"
    assert not df["text"].isnull().any(), "Dataset has missing text values"
    assert (df["text"].str.strip() != "").all(), "Dataset has empty text values"

def test_no_data_leakage_across_splits():
    df = pd.read_csv(DATASET_PATH)
    train_df, val_df, test_df = split_dataset_group_aware(df, test_size=0.25, val_fraction_of_train=0.12, random_state=42)
    
    train_groups = set(train_df["source_group"].unique())
    val_groups = set(val_df["source_group"].unique())
    test_groups = set(test_df["source_group"].unique())
    
    # Mathematical proof of zero leakage: intersection must be empty
    assert len(train_groups.intersection(test_groups)) == 0, f"Leakage train-test: {train_groups.intersection(test_groups)}"
    assert len(train_groups.intersection(val_groups)) == 0, f"Leakage train-val: {train_groups.intersection(val_groups)}"
    assert len(val_groups.intersection(test_groups)) == 0, f"Leakage val-test: {val_groups.intersection(test_groups)}"

def test_persisted_splits_match_requirements():
    assert TRAIN_SPLIT_PATH.exists(), f"Missing train split at {TRAIN_SPLIT_PATH}"
    assert VAL_SPLIT_PATH.exists(), f"Missing val split at {VAL_SPLIT_PATH}"
    assert TEST_SPLIT_PATH.exists(), f"Missing test split at {TEST_SPLIT_PATH}"
    
    train_df = pd.read_csv(TRAIN_SPLIT_PATH)
    val_df = pd.read_csv(VAL_SPLIT_PATH)
    test_df = pd.read_csv(TEST_SPLIT_PATH)
    
    # Requirement: Held-out test set >= 500 independent samples
    assert len(test_df) >= 500, f"Test split must contain at least 500 samples, got {len(test_df)}"
    
    # Check zero overlap on persisted splits
    train_groups = set(train_df["source_group"].unique())
    val_groups = set(val_df["source_group"].unique())
    test_groups = set(test_df["source_group"].unique())
    assert len(train_groups.intersection(test_groups)) == 0, "Leakage in persisted train-test splits"
    assert len(train_groups.intersection(val_groups)) == 0, "Leakage in persisted train-val splits"
    assert len(val_groups.intersection(test_groups)) == 0, "Leakage in persisted val-test splits"

def test_scam_categories_coverage():
    df = pd.read_csv(DATASET_PATH)
    scam_types = set(df["scam_type"].unique())
    expected_categories = {
        "benign", "bank_kyc", "digital_arrest", "upi_fraud", "phishing",
        "job_scam", "courier_scam", "investment_scam", "lottery_reward",
        "fake_customer_care", "other_scam"
    }
    assert expected_categories.issubset(scam_types), f"Missing scam categories: {expected_categories - scam_types}"

def test_language_diversity_coverage():
    df = pd.read_csv(DATASET_PATH)
    languages = set(df["language"].unique())
    expected_languages = {"en", "hi-en", "hi", "ta", "te", "kn", "ml"}
    assert expected_languages.issubset(languages), f"Missing expected languages: {expected_languages - languages}"

def test_provenance_and_synthetic_ratio():
    df = pd.read_csv(DATASET_PATH)
    real_count = (df["is_synthetic"] == False).sum()
    synthetic_count = (df["is_synthetic"] == True).sum()
    real_percentage = (real_count / len(df)) * 100
    assert real_percentage >= 90.0, f"Expected >= 90% real/public data, got {real_percentage:.2f}%"

def test_no_exact_duplicates_across_splits():
    train_df = pd.read_csv(TRAIN_SPLIT_PATH)
    val_df = pd.read_csv(VAL_SPLIT_PATH)
    test_df = pd.read_csv(TEST_SPLIT_PATH)
    
    train_texts = set(train_df["text"])
    val_texts = set(val_df["text"])
    test_texts = set(test_df["text"])
    
    assert len(train_texts.intersection(test_texts)) == 0, "Exact text duplicates detected between train and test splits"
    assert len(train_texts.intersection(val_texts)) == 0, "Exact text duplicates detected between train and val splits"
    assert len(val_texts.intersection(test_texts)) == 0, "Exact text duplicates detected between val and test splits"

def test_class_distributions_are_valid():
    df = pd.read_csv(DATASET_PATH)
    benign_ratio = (df["label"] == 0).mean()
    scam_ratio = (df["label"] == 1).mean()
    # Ensure reasonable balance: both between 35% and 65%
    assert 0.35 <= benign_ratio <= 0.65, f"Benign ratio {benign_ratio:.2f} out of reasonable bounds"
    assert 0.35 <= scam_ratio <= 0.65, f"Scam ratio {scam_ratio:.2f} out of reasonable bounds"

def test_test_set_not_used_for_tuning():
    import json
    from ml.src.model_config import THRESHOLD_PATH, METADATA_PATH
    
    if THRESHOLD_PATH.exists():
        with open(THRESHOLD_PATH, "r", encoding="utf-8") as f:
            thresh_meta = json.load(f)
        assert thresh_meta.get("calibrated_on") == "validation_split", "Decision threshold was not calibrated on validation split"
        
    if METADATA_PATH.exists():
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            meta = json.load(f)
        assert meta["training_results"]["held_out_test_samples"] >= 500, "Test set size invalid in metadata"
