"""Unit tests for BobSec dataset validation and data leakage prevention."""
import pytest
import pandas as pd
from ml.src.model_config import DATASET_PATH
from ml.src.train import split_dataset_group_aware

def test_dataset_file_exists_and_valid():
    assert DATASET_PATH.exists(), f"Dataset file not found at {DATASET_PATH}"
    df = pd.read_csv(DATASET_PATH)
    assert len(df) >= 100, f"Expected at least 100 samples, got {len(df)}"
    
    required_cols = {"text", "label", "scam_type", "language", "source_group", "provenance"}
    assert required_cols.issubset(df.columns), f"Missing required columns in dataset"

def test_dataset_labels_binary():
    df = pd.read_csv(DATASET_PATH)
    labels = set(df["label"].unique())
    assert labels == {0, 1}, f"Labels must be strictly binary {0, 1}, got {labels}"
    assert not df["text"].isnull().any(), "Dataset has missing text values"

def test_no_data_leakage_across_splits():
    df = pd.read_csv(DATASET_PATH)
    train_df, test_df = split_dataset_group_aware(df, test_size=0.20, random_state=42)
    
    train_groups = set(train_df["source_group"].unique())
    test_groups = set(test_df["source_group"].unique())
    
    # Mathematical proof of zero leakage: intersection must be empty
    leakage = train_groups.intersection(test_groups)
    assert len(leakage) == 0, f"Critical data leakage! Overlapping groups: {leakage}"

def test_scam_categories_coverage():
    df = pd.read_csv(DATASET_PATH)
    scam_types = set(df["scam_type"].unique())
    expected_categories = {"benign", "bank_kyc", "digital_arrest", "upi_fraud", "job_scam"}
    assert expected_categories.issubset(scam_types), f"Missing essential Indian scam categories: {expected_categories - scam_types}"
