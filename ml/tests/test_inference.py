"""Unit tests for BobSec online inference service."""
import pytest
from ml.src.inference import predict_scam

def test_inference_output_schema():
    res = predict_scam("Urgent KYC update required on your bank account.")
    required_keys = {"predicted_label", "scam_probability", "confidence", "model_version", "source"}
    assert required_keys.issubset(res.keys())
    assert res["predicted_label"] in ["scam", "benign"]
    assert 0.0 <= res["scam_probability"] <= 1.0
    assert 0.50 <= res["confidence"] <= 1.0
    assert res["model_version"] == "bobsec-mlp-v1"
    assert res["source"] == "bobsec_custom_mlp"

def test_obvious_scam_prediction():
    scam_text = "Dear SBI customer, your account is suspended. Click http://sbi-kyc-verify.cc to avoid permanent block."
    res = predict_scam(scam_text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.80

def test_obvious_benign_prediction():
    benign_text = "Hey, are you coming home for dinner tonight? Mom made paneer."
    res = predict_scam(benign_text)
    assert res["predicted_label"] == "benign"
    assert res["scam_probability"] < 0.40

def test_empty_and_whitespace_input():
    res_empty = predict_scam("")
    assert res_empty["predicted_label"] == "benign"
    assert res_empty["scam_probability"] == 0.0
    
    res_spaces = predict_scam("   \n\t  ")
    assert res_spaces["predicted_label"] == "benign"
    assert res_spaces["scam_probability"] == 0.0

def test_malformed_and_oversized_input():
    huge_text = "Free gift! " * 2000  # > 20,000 chars
    res = predict_scam(huge_text)
    assert res["predicted_label"] in ["scam", "benign"]
    assert 0.0 <= res["scam_probability"] <= 1.0
