"""Online Inference Engine for BobSec Custom MLP Neural Network.

Loads persisted TF-IDF pipeline and MLPClassifier artifacts once,
validates incoming input, and computes scam probabilities with confidence scoring.
"""
import json
import threading
from typing import Dict, Any, Optional
import joblib

from .model_config import MODEL_PATH, PIPELINE_PATH, METADATA_PATH, THRESHOLD_PATH

_model = None
_pipeline = None
_metadata = None
_thresholds = None
_lock = threading.Lock()

def load_inference_artifacts():
    """Thread-safe singleton loader for trained model artifacts."""
    global _model, _pipeline, _metadata, _thresholds
    if _model is not None and _pipeline is not None:
        return _model, _pipeline, _metadata, _thresholds
        
    with _lock:
        if _model is None:
            if not MODEL_PATH.exists() or not PIPELINE_PATH.exists():
                raise FileNotFoundError(f"Model artifacts missing at {MODEL_PATH} or {PIPELINE_PATH}")
            _model = joblib.load(MODEL_PATH)
            _pipeline = joblib.load(PIPELINE_PATH)
            
            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    _metadata = json.load(f)
            else:
                _metadata = {"model_version": "bobsec-mlp-v1"}
                
            if THRESHOLD_PATH.exists():
                with open(THRESHOLD_PATH, "r", encoding="utf-8") as f:
                    _thresholds = json.load(f)
            else:
                _thresholds = {"decision_threshold": 0.50}
                
    return _model, _pipeline, _metadata, _thresholds

def predict_scam(text: str, custom_threshold: Optional[float] = None) -> Dict[str, Any]:
    """Runs probability-based neural inference on input text.
    
    Returns:
        Dict containing predicted_label, scam_probability, confidence,
        model_version, and source identifier.
    """
    if not isinstance(text, str) or not text.strip():
        return {
            "predicted_label": "benign",
            "scam_probability": 0.0,
            "confidence": 1.0,
            "model_version": "bobsec-mlp-v1",
            "source": "bobsec_custom_mlp",
            "warning": "Empty or non-string input supplied"
        }
        
    # Enforce safe maximum input length
    max_chars = 5000
    if len(text) > max_chars:
        text = text[:max_chars]
        
    model, pipeline, metadata, thresholds = load_inference_artifacts()
    threshold = custom_threshold if custom_threshold is not None else thresholds.get("decision_threshold", 0.50)
    
    # 1. Feature extraction
    features = pipeline.transform([text])
    
    # 2. Probability inference from MLP
    probabilities = model.predict_proba(features)[0]
    
    # Probability of class 1 (scam)
    scam_prob = float(probabilities[1])
    scam_prob = max(0.0, min(1.0, scam_prob))
    
    is_scam = scam_prob >= threshold
    predicted_label = "scam" if is_scam else "benign"
    
    # Confidence represents certainty distance from neutral decision boundary (0.5)
    confidence = float(probabilities[1] if is_scam else probabilities[0])
    confidence = max(0.50, min(1.0, confidence))
    
    return {
        "predicted_label": predicted_label,
        "scam_probability": round(scam_prob, 4),
        "confidence": round(confidence, 4),
        "model_version": metadata.get("model_version", "bobsec-mlp-v1"),
        "source": "bobsec_custom_mlp"
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == "--stdin":
            raw_input_text = sys.stdin.read()
            print(json.dumps(predict_scam(raw_input_text)))
            sys.exit(0)
        else:
            print(json.dumps(predict_scam(sys.argv[1])))
            sys.exit(0)

    test_samples = [
        "Your SBI account is blocked! Update KYC immediately at http://sbi-fake.cc",
        "Hi mom, I will reach home by 8 PM for dinner.",
        "Scan this QR code and enter UPI PIN to receive payment of Rs 15,000 from buyer."
    ]
    for sample in test_samples:
        res = predict_scam(sample)
        print(f"\nText: {sample}")
        print(f"Prediction: {res['predicted_label']} (Scam Prob: {res['scam_probability']:.4f}, Conf: {res['confidence']:.4f})")
