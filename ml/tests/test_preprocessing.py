"""Unit tests for BobSec text preprocessing and feature extraction."""
import pytest
from ml.src.preprocess import clean_scam_text, build_feature_pipeline

def test_unicode_nfkc_normalization():
    # Fullwidth character representation of KYC
    fullwidth_text = "KYC update required"
    cleaned = clean_scam_text(fullwidth_text)
    assert "kyc update required" == cleaned

def test_whitespace_and_control_characters():
    dirty_text = "  Dear   Customer, \n\t  Your account   is blocked.  \x00\x08"
    cleaned = clean_scam_text(dirty_text)
    assert cleaned == "dear customer, your account is blocked."

def test_cybersecurity_signal_preservation():
    raw_text = "Send 5000 INR to scammer@okaxis via UPI or visit http://scam-site.top OTP is 9482."
    cleaned = clean_scam_text(raw_text)
    assert "scammer@okaxis" in cleaned
    assert "http://scam-site.top" in cleaned
    assert "9482" in cleaned

def test_repetition_collapse():
    text = "FREEeeee money URGENTTTT notice"
    cleaned = clean_scam_text(text)
    assert "freee" not in cleaned
    assert "urgent" in cleaned

def test_feature_pipeline_transformation():
    from ml.src.model_config import PreprocessingConfig
    cfg = PreprocessingConfig(word_min_df=1, char_min_df=1)
    pipeline = build_feature_pipeline(cfg)
    sample_corpus = [
        "Your bank account will be blocked. Update KYC immediately.",
        "Hi, are we meeting for coffee today at 4 PM?"
    ]
    features = pipeline.fit_transform(sample_corpus)
    assert features.shape[0] == 2
    assert features.shape[1] > 10
