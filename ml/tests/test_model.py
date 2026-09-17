"""Unit tests for BobSec MLP neural network architecture and artifacts."""
import json
import joblib
import pytest
from ml.src.model_config import MODEL_PATH, PIPELINE_PATH, METADATA_PATH

def test_model_artifacts_exist():
    assert MODEL_PATH.exists(), f"Model artifact missing: {MODEL_PATH}"
    assert PIPELINE_PATH.exists(), f"Pipeline artifact missing: {PIPELINE_PATH}"
    assert METADATA_PATH.exists(), f"Metadata missing: {METADATA_PATH}"

def test_mlp_architecture_integrity():
    mlp = joblib.load(MODEL_PATH)
    assert hasattr(mlp, "coefs_"), "Model has not been trained"
    assert hasattr(mlp, "intercepts_"), "Model has no intercepts"
    
    # Verify 3 hidden layers: (256, 128, 64)
    # coefs_[0]: input -> 256
    # coefs_[1]: 256 -> 128
    # coefs_[2]: 128 -> 64
    # coefs_[3]: 64 -> 2 (output)
    assert len(mlp.coefs_) == 4, f"Expected 4 weight matrices (3 hidden layers + output), got {len(mlp.coefs_)}"
    assert mlp.coefs_[0].shape[1] == 256, "First hidden layer must have 256 neurons"
    assert mlp.coefs_[1].shape[1] == 128, "Second hidden layer must have 128 neurons"
    # In scikit-learn binary classification, output layer uses 1 unit with logistic activation
    assert mlp.coefs_[3].shape[1] in [1, 2], "Output layer must have 1 (binary logistic) or 2 (softmax) units"

def test_metadata_schema():
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    assert meta["model_version"].startswith("bobsec-mlp")
    assert meta["architecture"]["activation"] == "relu"
    assert meta["architecture"]["optimizer"] == "adam"
    loss = meta["training_results"].get("final_loss", meta["training_results"].get("final_training_loss"))
    assert loss is not None and loss < 0.10
