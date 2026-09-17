"""Online Inference Engine for BobSec Custom MLP Neural Network.

Loads persisted model weights (.npz) and vocabulary for ultra-fast, lightweight
forward-pass inference using NumPy. Compatible with serverless runtimes.
"""
import json
import re
import threading
import unicodedata
from pathlib import Path
from typing import Dict, Any, Optional
import numpy as np

from .model_config import ARTIFACTS_DIR, MODEL_PATH, PIPELINE_PATH, METADATA_PATH, THRESHOLD_PATH

NPZ_PATH = ARTIFACTS_DIR / "mlp_model.npz"
VOCAB_PATH = ARTIFACTS_DIR / "vocab.json"

_weights = None
_vocab_data = None
_metadata = None
_thresholds = None
_lock = threading.Lock()

def _clean_text(text: str) -> str:
    t = unicodedata.normalize('NFKC', str(text))
    t = re.sub(r'[\r\n\t]+', ' ', t)
    t = re.sub(r'\s{2,}', ' ', t)
    return t.strip()

def _extract_features(text: str, word_vocab: dict, char_vocab: dict, word_idf: np.ndarray, char_idf: np.ndarray) -> np.ndarray:
    cleaned = _clean_text(text)
    
    # Word n-grams (1, 2)
    word_pat = re.compile(r'(?u)\b\w+\b|[\u20B9@#]')
    words = [w.lower() for w in word_pat.findall(cleaned)]
    word_counts = {}
    for i in range(len(words)):
        w1 = words[i]
        word_counts[w1] = word_counts.get(w1, 0) + 1
        if i + 1 < len(words):
            w2 = w1 + ' ' + words[i+1]
            word_counts[w2] = word_counts.get(w2, 0) + 1
            
    # Char wb n-grams (3, 5)
    char_counts = {}
    doc_lower = re.sub(r'\s+', ' ', cleaned.lower())
    for w in doc_lower.split():
        w_padded = ' ' + w + ' '
        w_len = len(w_padded)
        for n in range(3, 6):
            offset = 0
            ng = w_padded[offset : offset + n]
            char_counts[ng] = char_counts.get(ng, 0) + 1
            while offset + n < w_len:
                offset += 1
                ng = w_padded[offset : offset + n]
                char_counts[ng] = char_counts.get(ng, 0) + 1
            if offset == 0:
                break
                
    word_feat = np.zeros(len(word_vocab), dtype=np.float32)
    for term, cnt in word_counts.items():
        if term in word_vocab:
            idx = word_vocab[term]
            word_feat[idx] = (1.0 + np.log(cnt)) * word_idf[idx]
    wnorm = np.linalg.norm(word_feat)
    if wnorm > 0:
        word_feat /= wnorm
        
    char_feat = np.zeros(len(char_vocab), dtype=np.float32)
    for ng, cnt in char_counts.items():
        if ng in char_vocab:
            idx = char_vocab[ng]
            char_feat[idx] = (1.0 + np.log(cnt)) * char_idf[idx]
    cnorm = np.linalg.norm(char_feat)
    if cnorm > 0:
        char_feat /= cnorm
        
    return np.concatenate([word_feat, char_feat])

def load_inference_artifacts():
    """Thread-safe singleton loader for model weights and vocabulary."""
    global _weights, _vocab_data, _metadata, _thresholds
    if _weights is not None and _vocab_data is not None:
        return _weights, _vocab_data, _metadata, _thresholds
        
    with _lock:
        if _weights is None:
            if NPZ_PATH.exists() and VOCAB_PATH.exists():
                _weights = np.load(NPZ_PATH)
                with open(VOCAB_PATH, "r", encoding="utf-8") as f:
                    _vocab_data = json.load(f)
            else:
                try:
                    import joblib
                    if MODEL_PATH.exists() and PIPELINE_PATH.exists():
                        model = joblib.load(MODEL_PATH)
                        pipe = joblib.load(PIPELINE_PATH)
                        w0, w1, w2, w3 = model.coefs_
                        b0, b1, b2, b3 = model.intercepts_
                        w_vec = pipe.named_steps['features'].transformer_list[0][1]
                        c_vec = pipe.named_steps['features'].transformer_list[1][1]
                        _weights = {
                            "w0": w0.astype(np.float32), "b0": b0.astype(np.float32),
                            "w1": w1.astype(np.float32), "b1": b1.astype(np.float32),
                            "w2": w2.astype(np.float32), "b2": b2.astype(np.float32),
                            "w3": w3.astype(np.float32), "b3": b3.astype(np.float32),
                            "word_idf": w_vec.idf_.astype(np.float32),
                            "char_idf": c_vec.idf_.astype(np.float32)
                        }
                        _vocab_data = {
                            "word_vocab": {k: int(v) for k, v in w_vec.vocabulary_.items()},
                            "char_vocab": {k: int(v) for k, v in c_vec.vocabulary_.items()},
                            "classes": [int(c) for c in model.classes_]
                        }
                except Exception as e:
                    raise FileNotFoundError(f"Model artifacts missing or failed to load: {e}")
            
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
                
    return _weights, _vocab_data, _metadata, _thresholds

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
        
    weights, vocab_data, metadata, thresholds = load_inference_artifacts()
    threshold = custom_threshold if custom_threshold is not None else thresholds.get("decision_threshold", 0.50)
    
    # 1. Feature extraction
    features = _extract_features(
        text,
        vocab_data["word_vocab"],
        vocab_data["char_vocab"],
        weights["word_idf"],
        weights["char_idf"]
    )
    
    # 2. Forward pass through 3-layer MLP: (256, 128, 64) -> 1
    h1 = np.maximum(0, np.dot(features, weights["w0"]) + weights["b0"])
    h2 = np.maximum(0, np.dot(h1, weights["w1"]) + weights["b1"])
    h3 = np.maximum(0, np.dot(h2, weights["w2"]) + weights["b2"])
    out = np.dot(h3, weights["w3"]) + weights["b3"]
    
    # Sigmoid activation
    scam_prob = float(1.0 / (1.0 + np.exp(-out[0])))
    scam_prob = max(0.0, min(1.0, scam_prob))
    
    is_scam = scam_prob >= threshold
    predicted_label = "scam" if is_scam else "benign"
    
    confidence = scam_prob if is_scam else (1.0 - scam_prob)
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
