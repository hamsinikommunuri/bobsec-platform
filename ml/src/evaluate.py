"""Rigorous Academic Evaluation Pipeline for BobSec Neural Network.

Computes comprehensive classification metrics on the held-out test set,
including Accuracy, Precision, Recall, F1, Macro/Weighted F1, ROC-AUC, PR-AUC,
Confusion Matrix, False Positive Rate (FPR), and False Negative Rate (FNR).
Generates publication-quality charts and machine-readable metric reports.
"""
import json
from pathlib import Path
from typing import Dict, Any
import joblib
import matplotlib
matplotlib.use("Agg")  # Headless rendering for server/CLI environments
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve,
    precision_recall_curve,
    average_precision_score
)

from .model_config import (
    MODEL_PATH,
    BASELINE_PATH,
    PIPELINE_PATH,
    ARTIFACTS_DIR,
    REPORTS_DIR,
    METADATA_PATH,
    THRESHOLD_PATH
)
def plot_loss_curve(mlp, reports_dir: Path) -> None:
    """Plots training loss curve across iterations."""
    plt.figure(figsize=(7, 4.5), dpi=300)
    plt.plot(range(1, len(mlp.loss_curve_) + 1), mlp.loss_curve_, marker="o", markersize=3, color="#10b981", label="Training Loss (Cross-Entropy)")
    if hasattr(mlp, "validation_scores_") and mlp.validation_scores_:
        plt.plot(range(1, len(mlp.validation_scores_) + 1), mlp.validation_scores_, marker="s", markersize=3, color="#3b82f6", label="Validation Accuracy")
    plt.title("BobSec MLP Neural Network Convergence Curve", fontsize=12, fontweight="bold")
    plt.xlabel("Iteration (Epoch)", fontsize=10)
    plt.ylabel("Loss / Score", fontsize=10)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.legend()
    plt.tight_layout()
    plt.savefig(reports_dir / "training_loss_curve.png")
    plt.close()

def plot_confusion_matrix(cm: np.ndarray, reports_dir: Path) -> None:
    """Plots formatted Confusion Matrix."""
    plt.figure(figsize=(5.5, 4.5), dpi=300)
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title("Held-Out Test Confusion Matrix", fontsize=12, fontweight="bold")
    plt.colorbar()
    classes = ["Benign (0)", "Scam (1)"]
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, fontsize=9)
    plt.yticks(tick_marks, classes, fontsize=9)
    
    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(j, i, format(cm[i, j], "d"),
                     horizontalalignment="center",
                     color="white" if cm[i, j] > thresh else "black",
                     fontsize=14, fontweight="bold")
    plt.ylabel("True Label", fontsize=10)
    plt.xlabel("Predicted Label", fontsize=10)
    plt.tight_layout()
    plt.savefig(reports_dir / "confusion_matrix.png")
    plt.close()

def plot_class_distribution(train_df: pd.DataFrame, test_df: pd.DataFrame, reports_dir: Path) -> None:
    """Plots class distribution across train and held-out test splits."""
    plt.figure(figsize=(6.5, 4.5), dpi=300)
    categories = ["Benign", "Scam"]
    train_counts = [(train_df["label"] == 0).sum(), (train_df["label"] == 1).sum()]
    test_counts = [(test_df["label"] == 0).sum(), (test_df["label"] == 1).sum()]
    
    x = np.arange(len(categories))
    width = 0.35
    plt.bar(x - width/2, train_counts, width, label=f"Train ({len(train_df)})", color="#3b82f6")
    plt.bar(x + width/2, test_counts, width, label=f"Test ({len(test_df)})", color="#10b981")
    
    plt.ylabel("Sample Count", fontsize=10)
    plt.title("Class Distribution by Partition", fontsize=12, fontweight="bold")
    plt.xticks(x, categories, fontsize=10)
    plt.legend()
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "class_distribution.png")
    plt.close()

def plot_roc_pr_curves(y_true: np.ndarray, y_prob: np.ndarray, reports_dir: Path) -> None:
    """Plots ROC Curve and Precision-Recall Curve."""
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc = roc_auc_score(y_true, y_prob)
    
    plt.figure(figsize=(6, 4.5), dpi=300)
    plt.plot(fpr, tpr, color="#ec4899", lw=2, label=f"MLP ROC (AUC = {roc_auc:.3f})")
    plt.plot([0, 1], [0, 1], color="gray", lw=1, linestyle="--")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate", fontsize=10)
    plt.ylabel("True Positive Rate (Scam Recall)", fontsize=10)
    plt.title("Receiver Operating Characteristic (ROC)", fontsize=12, fontweight="bold")
    plt.legend(loc="lower right")
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "roc_curve.png")
    plt.close()
    
    precision, recall, _ = precision_recall_curve(y_true, y_prob)
    pr_auc = average_precision_score(y_true, y_prob)
    
    plt.figure(figsize=(6, 4.5), dpi=300)
    plt.plot(recall, precision, color="#8b5cf6", lw=2, label=f"MLP PR (AP = {pr_auc:.3f})")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("Recall", fontsize=10)
    plt.ylabel("Precision", fontsize=10)
    plt.title("Precision-Recall Curve", fontsize=12, fontweight="bold")
    plt.legend(loc="lower left")
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(reports_dir / "precision_recall_curve.png")
    plt.close()
def run_evaluation() -> Dict[str, Any]:
    """Evaluates the primary MLP and baseline Logistic Regression on the test split."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Load trained models and test split
    mlp = joblib.load(MODEL_PATH)
    baseline_lr = joblib.load(BASELINE_PATH)
    pipeline = joblib.load(PIPELINE_PATH)
    
    train_df = pd.read_csv(ARTIFACTS_DIR / "train_split.csv")
    test_df = pd.read_csv(ARTIFACTS_DIR / "test_split.csv")
    
    X_test = pipeline.transform(test_df["text"])
    y_test = test_df["label"].to_numpy()
    
    # Predict with MLP
    y_pred = mlp.predict(X_test)
    y_prob = mlp.predict_proba(X_test)[:, 1]
    
    # Predict with Baseline Logistic Regression
    y_pred_base = baseline_lr.predict(X_test)
    y_prob_base = baseline_lr.predict_proba(X_test)[:, 1]
    
    # 2. Compute Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    macro_prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
    macro_rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
    macro_f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    
    roc_auc = roc_auc_score(y_test, y_prob)
    pr_auc = average_precision_score(y_test, y_prob)
    
    # Baseline comparison metrics
    base_acc = accuracy_score(y_test, y_pred_base)
    base_f1 = f1_score(y_test, y_pred_base, zero_division=0)
    base_roc = roc_auc_score(y_test, y_prob_base)
    
    # Classification report
    clf_report_dict = classification_report(y_test, y_pred, target_names=["Benign", "Scam"], output_dict=True)
    clf_report_df = pd.DataFrame(clf_report_dict).transpose()
    clf_report_df.to_csv(REPORTS_DIR / "classification_report.csv")
    
    metrics_summary = {
        "model_name": "BobSec Custom MLPClassifier",
        "held_out_test_samples": int(len(test_df)),
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "macro_precision": round(float(macro_prec), 4),
        "macro_recall": round(float(macro_rec), 4),
        "macro_f1": round(float(macro_f1), 4),
        "weighted_f1": round(float(weighted_f1), 4),
        "roc_auc": round(float(roc_auc), 4),
        "pr_auc": round(float(pr_auc), 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "false_positive_rate": round(float(fpr), 4),
        "false_negative_rate": round(float(fnr), 4),
        "baseline_comparison": {
            "model_name": "Baseline LogisticRegression",
            "accuracy": round(float(base_acc), 4),
            "f1_score": round(float(base_f1), 4),
            "roc_auc": round(float(base_roc), 4)
        },
        "cybersecurity_notes": {
            "scam_recall_importance": "In cybersecurity scam detection, high Recall is prioritized to minimize False Negatives (missed attacks).",
            "false_negative_count": int(fn),
            "false_positive_count": int(fp)
        }
    }
    
    with open(REPORTS_DIR / "metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)
        
    # 3. Generate Real Visual Graphs
    plot_loss_curve(mlp, REPORTS_DIR)
    plot_confusion_matrix(cm, REPORTS_DIR)
    plot_class_distribution(train_df, test_df, REPORTS_DIR)
    plot_roc_pr_curves(y_test, y_prob, REPORTS_DIR)
    
    print("=== BobSec Neural Network Evaluation Complete ===")
    print(f"Accuracy: {acc*100:.2f}% | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")
    print(f"ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")
    print(f"Confusion Matrix: TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    print(f"False Negative Rate: {fnr:.4f} | False Positive Rate: {fpr:.4f}")
    print(f"Baseline LR Accuracy: {base_acc*100:.2f}% | F1: {base_f1:.4f}")
    print(f"Reports and figures saved to {REPORTS_DIR}")
    return metrics_summary

if __name__ == "__main__":
    run_evaluation()
