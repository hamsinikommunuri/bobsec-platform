"""Model Training Script for BobSec Multilayer Perceptron (MLP) Neural Network.

Performs group-aware train/test splitting to prevent data leakage,
fits the Word+Char TF-IDF FeatureUnion pipeline,
trains a baseline Logistic Regression model for comparison,
and trains the primary custom MLPClassifier neural network.
Persists all trained model artifacts and execution metadata.
"""
import json
import time
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupShuffleSplit
from sklearn.neural_network import MLPClassifier

from .model_config import (
    DATASET_PATH,
    MODEL_PATH,
    BASELINE_PATH,
    PIPELINE_PATH,
    METADATA_PATH,
    THRESHOLD_PATH,
    WEIGHTS_PATH,
    REPORTS_DIR,
    ARTIFACTS_DIR,
    DEFAULT_CONFIG,
    TrainingConfig
)
from .preprocess import build_feature_pipeline

def split_dataset_group_aware(
    df: pd.DataFrame,
    test_size: float = 0.20,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Splits dataset into train and held-out test sets using GroupShuffleSplit on source_group."""
    gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
    train_idx, test_idx = next(gss.split(df, groups=df["source_group"]))
    train_df = df.iloc[train_idx].reset_index(drop=True)
    test_df = df.iloc[test_idx].reset_index(drop=True)
    
    # Assert zero overlap between source_groups across splits
    train_groups = set(train_df["source_group"])
    test_groups = set(test_df["source_group"])
    overlap = train_groups.intersection(test_groups)
    assert len(overlap) == 0, f"Data leakage detected! Overlapping groups: {overlap}"
    
    return train_df, test_df
def export_weights_json(mlp: MLPClassifier, pipeline, metadata: Dict[str, Any], filepath: Path) -> None:
    """Exports MLP weights, biases, and vocabulary mapping to JSON for zero-dependency portability."""
    weights_data = {
        "model_version": metadata.get("model_version", "bobsec-mlp-v1"),
        "classes": [int(c) for c in mlp.classes_],
        "n_layers": int(mlp.n_layers_),
        "layer_sizes": [int(mlp.coefs_[0].shape[0])] + [int(c.shape[1]) for c in mlp.coefs_],
        "activation": mlp.activation,
        "intercepts": [b.tolist() for b in mlp.intercepts_],
        "coefs": [w.tolist() for w in mlp.coefs_],
        "threshold": 0.50
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(weights_data, f)

def train_models(config: TrainingConfig = DEFAULT_CONFIG) -> Dict[str, Any]:
    """Trains TF-IDF pipeline, baseline Logistic Regression, and primary MLPClassifier."""
    start_time = time.time()
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Load dataset
    df = pd.read_csv(DATASET_PATH)
    print(f"Loaded dataset: {len(df)} samples across {df['source_group'].nunique()} groups.")
    
    # 2. Group-aware train/test split
    train_df, test_df = split_dataset_group_aware(
        df, test_size=config.test_size, random_state=config.random_seed
    )
    # Save splits for evaluation and test integrity
    train_df.to_csv(ARTIFACTS_DIR / "train_split.csv", index=False)
    test_df.to_csv(ARTIFACTS_DIR / "test_split.csv", index=False)
    print(f"Train samples: {len(train_df)} (Groups: {train_df['source_group'].nunique()})")
    print(f"Test samples: {len(test_df)} (Groups: {test_df['source_group'].nunique()})")
    
    # 3. Fit Preprocessing Feature Pipeline
    pipeline = build_feature_pipeline(config.preprocessing)
    X_train = pipeline.fit_transform(train_df["text"])
    y_train = train_df["label"].to_numpy()
    
    n_features = X_train.shape[1]
    print(f"Feature extraction complete: {n_features} combined word + char TF-IDF features.")
    
    # 4. Train Baseline Logistic Regression
    print("Training baseline Logistic Regression...")
    baseline_lr = LogisticRegression(max_iter=1000, random_state=config.random_seed)
    baseline_lr.fit(X_train, y_train)
    
    # 5. Train Primary Multilayer Perceptron (MLP)
    print(f"Training primary custom MLP neural network with architecture: {config.mlp.hidden_layer_sizes}...")
    mlp = MLPClassifier(
        hidden_layer_sizes=config.mlp.hidden_layer_sizes,
        activation=config.mlp.activation,
        solver=config.mlp.solver,
        alpha=config.mlp.alpha,
        batch_size=config.mlp.batch_size,
        learning_rate_init=config.mlp.learning_rate_init,
        max_iter=config.mlp.max_iter,
        shuffle=config.mlp.shuffle,
        random_state=config.mlp.random_state,
        tol=config.mlp.tol,
        early_stopping=config.mlp.early_stopping,
        validation_fraction=config.mlp.validation_fraction,
        n_iter_no_change=config.mlp.n_iter_no_change
    )
    mlp.fit(X_train, y_train)
    training_duration_s = time.time() - start_time
    
    print(f"MLP training completed in {training_duration_s:.2f}s.")
    print(f"Iterations: {mlp.n_iter_}, Final training loss: {mlp.loss_:.6f}")
    
    # 6. Save Model Artifacts
    joblib.dump(mlp, MODEL_PATH, compress=3)
    joblib.dump(baseline_lr, BASELINE_PATH, compress=3)
    joblib.dump(pipeline, PIPELINE_PATH, compress=3)
    
    threshold_data = {
        "decision_threshold": config.default_threshold,
        "high_confidence_scam_threshold": 0.85,
        "moderate_scam_threshold": 0.65,
        "uncertainty_margin": 0.15
    }
    with open(THRESHOLD_PATH, "w", encoding="utf-8") as f:
        json.dump(threshold_data, f, indent=2)
        
    metadata = {
        "model_version": config.model_version,
        "model_type": "Multilayer Perceptron (MLPClassifier)",
        "framework": "scikit-learn",
        "training_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "architecture": {
            "input_features": int(n_features),
            "hidden_layer_sizes": list(config.mlp.hidden_layer_sizes),
            "output_neurons": 2,
            "activation": config.mlp.activation,
            "optimizer": config.mlp.solver,
            "learning_rate_init": config.mlp.learning_rate_init,
            "max_iter": config.mlp.max_iter,
            "early_stopping": config.mlp.early_stopping,
            "validation_fraction": config.mlp.validation_fraction,
            "random_seed": config.mlp.random_state
        },
        "training_results": {
            "iterations_executed": int(mlp.n_iter_),
            "final_loss": float(mlp.loss_),
            "best_validation_score": float(mlp.best_validation_score_) if hasattr(mlp, "best_validation_score_") and mlp.best_validation_score_ is not None else None,
            "training_samples": int(len(train_df)),
            "held_out_test_samples": int(len(test_df)),
            "training_duration_seconds": round(training_duration_s, 3)
        }
    }
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    # Export JSON weights
    export_weights_json(mlp, pipeline, metadata, WEIGHTS_PATH)
    
    # Save model configuration
    with open(REPORTS_DIR / "model_configuration.json", "w", encoding="utf-8") as f:
        json.dump(metadata["architecture"], f, indent=2)
        
    print(f"All artifacts saved to {ARTIFACTS_DIR}")
    return metadata

if __name__ == "__main__":
    train_models()
