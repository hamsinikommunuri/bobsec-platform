"""Model Configuration for BobSec Neural Network Subsystem.

Defines hyperparameters, feature extraction specifications, layer architecture,
and path constants for training, evaluation, and inference.
"""
from dataclasses import dataclass, field
from pathlib import Path
from typing import Tuple

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
REPORTS_DIR = BASE_DIR / "reports"

DATASET_PATH = DATA_DIR / "dataset.csv"
TRAIN_SPLIT_PATH = ARTIFACTS_DIR / "train_split.csv"
VAL_SPLIT_PATH = ARTIFACTS_DIR / "val_split.csv"
TEST_SPLIT_PATH = ARTIFACTS_DIR / "test_split.csv"

MODEL_PATH = ARTIFACTS_DIR / "scam_mlp.joblib"
BASELINE_PATH = ARTIFACTS_DIR / "baseline_lr.joblib"
PIPELINE_PATH = ARTIFACTS_DIR / "tfidf_pipeline.joblib"
METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"
THRESHOLD_PATH = ARTIFACTS_DIR / "threshold.json"
WEIGHTS_PATH = ARTIFACTS_DIR / "model_weights.json"
NPZ_PATH = ARTIFACTS_DIR / "mlp_model.npz"
VOCAB_PATH = ARTIFACTS_DIR / "vocab.json"

@dataclass
class PreprocessingConfig:
    """TF-IDF and Text Preprocessing parameters."""
    word_ngram_range: Tuple[int, int] = (1, 2)
    word_max_features: int = 3000
    word_min_df: int = 1
    word_sublinear_tf: bool = True
    
    char_ngram_range: Tuple[int, int] = (3, 5)
    char_max_features: int = 3000
    char_min_df: int = 2
    char_sublinear_tf: bool = True

@dataclass
class MLPConfig:
    """Multilayer Perceptron Neural Network architecture hyperparameters."""
    hidden_layer_sizes: Tuple[int, ...] = (256, 128, 64)
    activation: str = "relu"
    solver: str = "adam"
    alpha: float = 0.0001
    batch_size: int = 64
    learning_rate_init: float = 0.001
    max_iter: int = 200
    shuffle: bool = True
    random_state: int = 42
    tol: float = 1e-4
    early_stopping: bool = True
    validation_fraction: float = 0.1
    n_iter_no_change: int = 15

@dataclass
class TrainingConfig:
    """High-level training pipeline settings."""
    model_version: str = "bobsec-mlp-v2-academic"
    test_size: float = 0.25
    val_size: float = 0.12
    random_seed: int = 42
    default_threshold: float = 0.50
    preprocessing: PreprocessingConfig = field(default_factory=PreprocessingConfig)
    mlp: MLPConfig = field(default_factory=MLPConfig)

DEFAULT_CONFIG = TrainingConfig()
