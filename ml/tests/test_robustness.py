"""Adversarial and robustness unit tests for BobSec MLP neural network inference."""
import pytest
from ml.src.inference import predict_scam

def test_all_caps_adversarial():
    # Scammers frequently use ALL CAPS to create urgency
    text = "DEAR CUSTOMER YOUR SBI ACCOUNT WILL BE BLOCKED TODAY IMMEDIATELY UPDATE KYC AT HTTP://SBI-NETBANKING.CC"
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.85

def test_spaced_and_punctuated_keywords():
    # Adversarial obfuscation: spacing out trigger words
    text = "Urgent: Complete your K.Y.C verification now. Send money to U.P.I id or your bank card will be suspended."
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.70

def test_typos_and_character_perturbations():
    # Subtle perturbations and misspelling
    text = "Dear custoomer, your accoount is temperorily deactivaated due to pending verifcation. Click http://verify-sbi.xyz"
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.80

def test_indian_multilingual_and_hinglish_scam():
    # Hinglish digital arrest / extortion
    text = "Aapka parcel Customs ne seize kiya hai Mumbai airport par. Drugs mile hain. Turant CBI officer se video call par connect karein nahi toh arrest warrant issue hoga."
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.75

def test_pure_hindi_scam():
    # Pure Devanagari Hindi KYC scam
    text = "प्रिय ग्राहक, आपका एसबीआई बैंक खाता ब्लॉक कर दिया गया है। अपना पैन कार्ड और केवाईसी तुरंत अपडेट करें।"
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.75

def test_legitimate_financial_alert_resilience():
    # Legitimate Indian banking alerts often trigger false alarms if trained naively
    text = "Your a/c no. XX1234 is debited for Rs 1,450.00 on 17-Sep-26 at SWIGGY BANGALORE UPI/42318921021. Avl bal Rs 34,210.00 - HDFC Bank."
    res = predict_scam(text)
    assert res["predicted_label"] == "benign"
    assert res["scam_probability"] < 0.50

def test_legitimate_otp_notification_resilience():
    text = "128490 is your SECRET OTP for transaction of Rs 850.00 on ZOMATO. Do NOT share OTP with anyone including bank staff."
    res = predict_scam(text)
    assert res["predicted_label"] == "benign"
    assert res["scam_probability"] < 0.50

def test_adversarial_zero_length_and_whitespace():
    assert predict_scam("")["predicted_label"] == "benign"
    assert predict_scam("          \n\t   ")["predicted_label"] == "benign"
    assert predict_scam(None)["predicted_label"] == "benign"

@pytest.mark.parametrize("kyc_variant", ["KYC", "K.Y.C", "K-Y-C", "kyc", "KYC!!!"])
def test_kyc_and_punctuation_variants(kyc_variant):
    text = f"Dear SBI user, your {kyc_variant} has expired. Update immediately to prevent account lock: http://sbi-verify.cc"
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.60

@pytest.mark.parametrize("upi_variant", ["UPI", "U.P.I", "u.p.i"])
def test_upi_spelling_variants(upi_variant):
    text = f"Send Rs 500 via {upi_variant} to claim your reward of Rs 25,000 immediately."
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.60

def test_mixed_case_and_leetspeak():
    text = "DEAR user, vEr1fP your bAnk acct immediately: http://ver1fy-now.cc/bank"
    res = predict_scam(text)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.60

def test_shortened_scam_phrases():
    short_scam = "Electricity power cut tonight 9:30pm. Call officer 9876543210 immediately."
    res = predict_scam(short_scam)
    assert res["predicted_label"] == "scam"
    assert res["scam_probability"] > 0.60
