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
    assert mlp.coefs_[2].shape[1] == 64, "Third hidden layer must have 64 neurons"
    assert mlp.coefs_[3].shape[1] in [1, 2], "Output layer must have 1 (binary logistic) or 2 (softmax) units"

def test_metadata_schema():
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    assert meta["model_version"].startswith("bobsec-mlp")
    assert meta["architecture"]["activation"] == "relu"
    assert meta["architecture"]["optimizer"] == "adam"
    loss = meta["training_results"].get("final_loss", meta["training_results"].get("final_training_loss"))
    assert loss is not None and loss < 0.10

def test_model_probabilities_bounded():
    mlp = joblib.load(MODEL_PATH)
    pipeline = joblib.load(PIPELINE_PATH)
    sample_texts = [
        "Your bank KYC has expired. Update immediately at http://fake-sbi.cc",
        "Hey, can you pick up milk on the way home?",
        "URGENT: CBI officer digital arrest warrant issued. Transfer Rs 50,000 to verify.",
        "Your Swiggy order of Rs 420 has been delivered.",
        "FREE LOTTERY PRIZE of Rs 25,00,000 won! Call 9876543210 now."
    ]
    features = pipeline.transform(sample_texts)
    probs = mlp.predict_proba(features)
    assert probs.shape == (len(sample_texts), 2)
    assert (probs >= 0.0).all() and (probs <= 1.0).all(), "Model probabilities fall outside [0, 1] range"
    assert (probs.sum(axis=1) >= 0.999).all() and (probs.sum(axis=1) <= 1.001).all(), "Probabilities do not sum to 1.0"
