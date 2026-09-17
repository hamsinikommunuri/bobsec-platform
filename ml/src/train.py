"""Model Training Pipeline for BobSec Custom Multilayer Perceptron (MLP).

Performs strictly leak-proof training on the training partition, executes
hyperparameter and threshold tuning exclusively using the explicit validation set,
fits the baseline Logistic Regression, trains the primary 3-layer MLP neural network,
and exports synchronized artifacts for both standard and zero-dependency serverless runtimes.
"""
import json
import time
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.neural_network import MLPClassifier

from .model_config import (
    TRAIN_SPLIT_PATH,
    VAL_SPLIT_PATH,
    TEST_SPLIT_PATH,
    MODEL_PATH,
    BASELINE_PATH,
    PIPELINE_PATH,
    METADATA_PATH,
    THRESHOLD_PATH,
    WEIGHTS_PATH,
    NPZ_PATH,
    VOCAB_PATH,
    REPORTS_DIR,
    ARTIFACTS_DIR,
    DEFAULT_CONFIG,
    TrainingConfig
)
from .preprocess import build_feature_pipeline
from .prepare_dataset import prepare_and_save_dataset, split_dataset_group_aware

def export_serverless_artifacts(mlp: MLPClassifier, pipeline, artifacts_dir: Path) -> None:
    """Exports compact .npz weights and vocabulary for fast, zero-dependency serverless execution."""
    w0, w1, w2, w3 = mlp.coefs_
    b0, b1, b2, b3 = mlp.intercepts_
    w_vec = pipeline.named_steps["features"].transformer_list[0][1]
    c_vec = pipeline.named_steps["features"].transformer_list[1][1]
    
    np.savez_compressed(
        artifacts_dir / "mlp_model.npz",
        w0=w0.astype(np.float32), b0=b0.astype(np.float32),
        w1=w1.astype(np.float32), b1=b1.astype(np.float32),
        w2=w2.astype(np.float32), b2=b2.astype(np.float32),
        w3=w3.astype(np.float32), b3=b3.astype(np.float32),
        word_idf=w_vec.idf_.astype(np.float32),
        char_idf=c_vec.idf_.astype(np.float32)
    )
    vocab_data = {
        "word_vocab": {k: int(v) for k, v in w_vec.vocabulary_.items()},
        "char_vocab": {k: int(v) for k, v in c_vec.vocabulary_.items()},
        "classes": [int(c) for c in mlp.classes_]
    }
    with open(artifacts_dir / "vocab.json", "w", encoding="utf-8") as f:
        json.dump(vocab_data, f)
    print(f"Exported compact serverless artifacts to {artifacts_dir / 'mlp_model.npz'} and {artifacts_dir / 'vocab.json'}")

def export_weights_json(mlp: MLPClassifier, metadata: Dict[str, Any], filepath: Path) -> None:
    """Exports MLP parameters to standard JSON for cross-platform auditing."""
    weights_data = {
        "model_version": metadata.get("model_version", "bobsec-mlp-v2-academic"),
        "classes": [int(c) for c in mlp.classes_],
        "n_layers": int(mlp.n_layers_),
        "layer_sizes": [int(mlp.coefs_[0].shape[0])] + [int(c.shape[1]) for c in mlp.coefs_],
        "activation": mlp.activation,
        "intercepts": [b.tolist() for b in mlp.intercepts_],
        "coefs": [w.tolist() for w in mlp.coefs_],
        "decision_threshold": 0.50
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(weights_data, f)

def plot_training_curves(mlp: MLPClassifier, reports_dir: Path) -> None:
    """Plots training loss and validation convergence curves."""
    plt.figure(figsize=(7.5, 4.8), dpi=300)
    epochs = range(1, len(mlp.loss_curve_) + 1)
    plt.plot(epochs, mlp.loss_curve_, marker="o", markersize=3, color="#10b981", label="Training Cross-Entropy Loss")
    
    if hasattr(mlp, "validation_scores_") and mlp.validation_scores_ is not None and len(mlp.validation_scores_) > 0:
        val_epochs = range(1, len(mlp.validation_scores_) + 1)
        plt.plot(val_epochs, mlp.validation_scores_, marker="s", markersize=3, color="#3b82f6", label="Internal Validation Accuracy")
        
    plt.title("BobSec Custom MLP Neural Network Convergence Curve", fontsize=12, fontweight="bold")
    plt.xlabel("Training Iteration (Epoch)", fontsize=10)
    plt.ylabel("Loss / Validation Score", fontsize=10)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.legend(loc="best")
    plt.tight_layout()
    plt.savefig(reports_dir / "training_loss_curve.png")
    plt.close()
    print("Saved training loss curve to reports.")

def tune_hyperparameters_on_validation(
    X_train, y_train, X_val, y_val, config: TrainingConfig
) -> Tuple[float, float, float]:
    """Evaluates candidate L2 regularization alphas exclusively on the validation set."""
    print("Evaluating candidate hyperparameters on validation partition...")
    candidate_alphas = [0.0001, 0.0005, 0.001]
    best_alpha = config.mlp.alpha
    best_val_f1 = -1.0
    best_val_rec = -1.0
    
    for alpha in candidate_alphas:
        candidate_mlp = MLPClassifier(
            hidden_layer_sizes=config.mlp.hidden_layer_sizes,
            activation=config.mlp.activation,
            solver=config.mlp.solver,
            alpha=alpha,
            batch_size=config.mlp.batch_size,
            learning_rate_init=config.mlp.learning_rate_init,
            max_iter=config.mlp.max_iter,
            shuffle=config.mlp.shuffle,
            random_state=config.mlp.random_state,
            tol=config.mlp.tol,
            early_stopping=True,
            validation_fraction=0.1,
            n_iter_no_change=config.mlp.n_iter_no_change
        )
        candidate_mlp.fit(X_train, y_train)
        val_preds = candidate_mlp.predict(X_val)
        val_f1 = f1_score(y_val, val_preds, zero_division=0)
        val_rec = recall_score(y_val, val_preds, zero_division=0)
        print(f"Candidate alpha={alpha}: Val F1={val_f1:.4f}, Val Recall={val_rec:.4f}")
        
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            best_val_rec = val_rec
            best_alpha = alpha
            
    print(f"Selected optimal regularization alpha={best_alpha} (Validation F1: {best_val_f1:.4f})")
    return best_alpha, best_val_f1, best_val_rec

def calibrate_decision_threshold(
    model: MLPClassifier, X_val, y_val
) -> Tuple[float, float, float]:
    """Tunes decision threshold on the validation split to optimize F1 while prioritizing Recall."""
    val_probs = model.predict_proba(X_val)[:, 1]
    threshold_grid = np.linspace(0.35, 0.65, 31)
    
    best_thresh = 0.50
    best_f1 = -1.0
    best_rec = -1.0
    
    for thresh in threshold_grid:
        preds = (val_probs >= thresh).astype(int)
        f1 = f1_score(y_val, preds, zero_division=0)
        rec = recall_score(y_val, preds, zero_division=0)
        # In cybersecurity, we favor high Recall while maintaining strong F1
        score = 0.7 * f1 + 0.3 * rec
        if score > (0.7 * best_f1 + 0.3 * best_rec):
            best_f1 = f1
            best_rec = rec
            best_thresh = thresh
            
    print(f"Calibrated decision threshold: {best_thresh:.2f} (Val F1: {best_f1:.4f}, Val Recall: {best_rec:.4f})")
    return round(float(best_thresh), 2), best_f1, best_rec

def train_models(config: TrainingConfig = DEFAULT_CONFIG) -> Dict[str, Any]:
    """Main training routine."""
    start_time = time.time()
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Verify existence of splits; generate if missing
    if not (TRAIN_SPLIT_PATH.exists() and VAL_SPLIT_PATH.exists() and TEST_SPLIT_PATH.exists()):
        print("Dataset splits not found. Preparing fresh dataset...")
        prepare_and_save_dataset()
        
    train_df = pd.read_csv(TRAIN_SPLIT_PATH)
    val_df = pd.read_csv(VAL_SPLIT_PATH)
    test_df = pd.read_csv(TEST_SPLIT_PATH)
    
    print(f"Loaded training split: {len(train_df)} samples across {train_df['source_group'].nunique()} groups.")
    print(f"Loaded validation split: {len(val_df)} samples across {val_df['source_group'].nunique()} groups.")
    print(f"Held-out test split (untouched during training): {len(test_df)} samples across {test_df['source_group'].nunique()} groups.")
    
    # Assert zero group leakage before training begins
    train_groups = set(train_df["source_group"])
    val_groups = set(val_df["source_group"])
    test_groups = set(test_df["source_group"])
    assert len(train_groups.intersection(test_groups)) == 0, "Train-test leakage detected!"
    assert len(train_groups.intersection(val_groups)) == 0, "Train-val leakage detected!"
    assert len(val_groups.intersection(test_groups)) == 0, "Val-test leakage detected!"
    
    # 2. Fit Preprocessing FeatureUnion Pipeline strictly on Train partition
    pipeline = build_feature_pipeline(config.preprocessing)
    X_train = pipeline.fit_transform(train_df["text"])
    y_train = train_df["label"].to_numpy()
    
    X_val = pipeline.transform(val_df["text"])
    y_val = val_df["label"].to_numpy()
    
    n_features = X_train.shape[1]
    print(f"Feature extraction fitted: {n_features} Word+Char TF-IDF features.")
    
    # 3. Hyperparameter Tuning on Validation Split
    best_alpha, val_f1_score, val_recall_score = tune_hyperparameters_on_validation(
        X_train, y_train, X_val, y_val, config
    )
    
    # 4. Train Primary Multilayer Perceptron (MLP)
    print(f"Training primary custom MLP ({config.mlp.hidden_layer_sizes}) with alpha={best_alpha}...")
    mlp = MLPClassifier(
        hidden_layer_sizes=config.mlp.hidden_layer_sizes,
        activation=config.mlp.activation,
        solver=config.mlp.solver,
        alpha=best_alpha,
        batch_size=config.mlp.batch_size,
        learning_rate_init=config.mlp.learning_rate_init,
        max_iter=config.mlp.max_iter,
        shuffle=config.mlp.shuffle,
        random_state=config.mlp.random_state,
        tol=config.mlp.tol,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=config.mlp.n_iter_no_change
    )
    mlp.fit(X_train, y_train)
    training_duration_s = time.time() - start_time
    
    print(f"MLP training completed in {training_duration_s:.2f}s.")
    print(f"Iterations: {mlp.n_iter_}, Final training loss: {mlp.loss_:.6f}")
    
    # 5. Train Baseline Logistic Regression
    print("Training baseline Logistic Regression model on identical train partition...")
    baseline_lr = LogisticRegression(max_iter=1000, random_state=config.random_seed)
    baseline_lr.fit(X_train, y_train)
    
    # 6. Calibrate Decision Threshold on Validation Set
    calibrated_thresh, cal_f1, cal_rec = calibrate_decision_threshold(mlp, X_val, y_val)
    
    # 7. Save All Persisted Artifacts
    joblib.dump(mlp, MODEL_PATH, compress=3)
    joblib.dump(baseline_lr, BASELINE_PATH, compress=3)
    joblib.dump(pipeline, PIPELINE_PATH, compress=3)
    
    threshold_data = {
        "decision_threshold": calibrated_thresh,
        "high_confidence_scam_threshold": 0.85,
        "moderate_scam_threshold": 0.65,
        "uncertainty_margin": 0.15,
        "calibrated_on": "validation_split",
        "validation_f1": round(float(cal_f1), 4),
        "validation_recall": round(float(cal_rec), 4)
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
            "alpha_l2_regularization": float(best_alpha),
            "max_iter": config.mlp.max_iter,
            "early_stopping": config.mlp.early_stopping,
            "random_seed": config.mlp.random_state
        },
        "training_results": {
            "iterations_executed": int(mlp.n_iter_),
            "final_loss": float(mlp.loss_),
            "final_training_loss": float(mlp.loss_),
            "best_validation_score": float(mlp.best_validation_score_) if hasattr(mlp, "best_validation_score_") and mlp.best_validation_score_ is not None else None,
            "training_samples": int(len(train_df)),
            "validation_samples": int(len(val_df)),
            "held_out_test_samples": int(len(test_df)),
            "decision_threshold": calibrated_thresh,
            "training_duration_seconds": round(training_duration_s, 3)
        }
    }
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    # Export JSON weights
    export_weights_json(mlp, metadata, WEIGHTS_PATH)
    
    # Export compact serverless artifacts (.npz and vocab.json)
    export_serverless_artifacts(mlp, pipeline, ARTIFACTS_DIR)
    
    # Save model configuration report
    with open(REPORTS_DIR / "model_configuration.json", "w", encoding="utf-8") as f:
        json.dump(metadata["architecture"], f, indent=2)
        
    # Generate training curves
    plot_training_curves(mlp, REPORTS_DIR)
    
    print(f"All model training artifacts successfully saved to {ARTIFACTS_DIR}")
    return metadata

if __name__ == "__main__":
    train_models()
