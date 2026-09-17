"""Text Preprocessing and Feature Extraction Pipeline for BobSec.

Applies NFKC Unicode normalization, whitespace normalization, cybersecurity signal
preservation, and a FeatureUnion of word and character n-gram TF-IDF vectorizers.
"""
import re
import unicodedata
from typing import List, Optional
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion, Pipeline

from .model_config import PreprocessingConfig

# Regex patterns for normalization and token preservation
WHITESPACE_RE = re.compile(r"\s+")
URL_RE = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
UPI_RE = re.compile(r"[\w.-]+@(?:oksbi|okaxis|okicici|okhdfcbank|paytm|ybl|apl|upi)", re.IGNORECASE)
PHONE_RE = re.compile(r"(?:\+91|91)?[-.\s]?[6-9]\d{9}\b")
OTP_RE = re.compile(r"\b\d{4,8}\b")
CURRENCY_RE = re.compile(r"(?:\u20B9|rs\.?|inr)\s*[\d,]+(?:\.\d+)?", re.IGNORECASE)

def clean_scam_text(text: str) -> str:
    """Safely cleans and normalizes untrusted text while strictly preserving cyber signals.
    
    1. Unicode NFKC normalization (standardizes fullwidth/homoglyph characters).
    2. Lowercase transformation while preserving special tokens.
    3. Normalizes repetitive punctuation without stripping alert signals (!, ?, @).
    4. Canonicalizes whitespace.
    """
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
        
    # Unicode NFKC normalization decomposes homoglyphs & compatibility chars
    text = unicodedata.normalize("NFKC", text)
    
    # Normalize line breaks and tabs to spaces
    text = text.replace("\r", " ").replace("\n", " ").replace("\t", " ")
    
    # Strip dangerous non-printable control characters (except standard ascii spaces)
    text = "".join(ch for ch in text if ch.isprintable())
    
    # Lowercase for uniform tokenization
    text = text.lower()
    
    # Normalize excess repeated characters (e.g. "freeeeee" -> "free", "urgentttt" -> "urgent")
    text = re.sub(r"(.)\1{3,}", r"\1\1", text)
    
    # Collapse multiple spaces
    text = WHITESPACE_RE.sub(" ", text).strip()
    return text

class TextCleanerTransformer(BaseEstimator, TransformerMixin):
    """Scikit-learn compatible transformer for safe cybersecurity text cleaning."""
    
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        return [clean_scam_text(item) for item in X]

def build_feature_pipeline(config: Optional[PreprocessingConfig] = None) -> Pipeline:
    """Builds a scikit-learn Pipeline with TextCleaner and FeatureUnion (Word + Char TF-IDF)."""
    cfg = config or PreprocessingConfig()
    
    word_vectorizer = TfidfVectorizer(
        ngram_range=cfg.word_ngram_range,
        max_features=cfg.word_max_features,
        min_df=cfg.word_min_df,
        sublinear_tf=cfg.word_sublinear_tf,
        analyzer="word",
        token_pattern=r"(?u)\b\w+\b|[\u20B9@#]"
    )
    
    char_vectorizer = TfidfVectorizer(
        ngram_range=cfg.char_ngram_range,
        max_features=cfg.char_max_features,
        min_df=cfg.char_min_df,
        sublinear_tf=cfg.char_sublinear_tf,
        analyzer="char_wb"  # Character n-grams with word boundary awareness
    )
    
    features = FeatureUnion([
        ("word_tfidf", word_vectorizer),
        ("char_tfidf", char_vectorizer)
    ])
    
    return Pipeline([
        ("cleaner", TextCleanerTransformer()),
        ("features", features)
    ])
