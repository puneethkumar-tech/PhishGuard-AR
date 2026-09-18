"""
Comprehensive Evaluation Suite: Per-Source, Per-Language, and Model Comparison Metrics
"""
import os
import sys
import logging
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Any

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

# Setup path
current_dir = Path(__file__).resolve().parent
mlmodel_dir = current_dir.parent.parent
if str(mlmodel_dir) not in sys.path:
    sys.path.insert(0, str(mlmodel_dir))

from config import (
    PROCESSED_DATA_DIR,
    RESULTS_DIR,
    MODELS_DIR
)
from src.models.classical import load_classical_model
from src.models.multilingual import load_multilingual_model, get_encoder

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def compute_metrics_dict(y_true, y_pred, y_prob=None) -> Dict[str, Any]:
    """
    Computes standard metrics safely even for single-class subsets.
    """
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    return {
        "count": len(y_true),
        "threat_count": int(np.sum(y_true == 1)),
        "benign_count": int(np.sum(y_true == 0)),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4)
    }


def evaluate_per_source(test_df: pd.DataFrame, vectorizer, classifier, threshold: float) -> pd.DataFrame:
    """
    Evaluates test performance broken down by original dataset source.
    """
    logger.info("Computing per-source evaluation metrics...")
    sources = sorted(test_df["source"].unique())
    rows = []
    
    for src in sources:
        sub_df = test_df[test_df["source"] == src]
        X_sub = vectorizer.transform(sub_df["text"].fillna(""))
        probs = classifier.predict_proba(X_sub)[:, 1]
        preds = (probs >= threshold).astype(int)
        y_true = sub_df["label"].values
        
        m = compute_metrics_dict(y_true, preds, probs)
        m["source"] = src
        rows.append(m)
        
    df_src = pd.DataFrame(rows)
    # Reorder columns
    cols = ["source", "count", "benign_count", "threat_count", "accuracy", "precision", "recall", "f1"]
    df_src = df_src[cols]
    
    out_path = RESULTS_DIR / "per_source_results.csv"
    df_src.to_csv(out_path, index=False)
    logger.info(f"Saved per-source metrics to {out_path}:\n{df_src.to_string(index=False)}")
    return df_src


def evaluate_per_language(test_df: pd.DataFrame, vectorizer, classifier, threshold: float, min_samples: int = 5) -> pd.DataFrame:
    """
    Evaluates test performance broken down by detected language (for languages with >= min_samples).
    """
    logger.info("Computing per-language evaluation metrics...")
    lang_counts = test_df["language"].value_counts()
    valid_langs = lang_counts[lang_counts >= min_samples].index.tolist()
    
    rows = []
    for lang in valid_langs:
        sub_df = test_df[test_df["language"] == lang]
        X_sub = vectorizer.transform(sub_df["text"].fillna(""))
        probs = classifier.predict_proba(X_sub)[:, 1]
        preds = (probs >= threshold).astype(int)
        y_true = sub_df["label"].values
        
        m = compute_metrics_dict(y_true, preds, probs)
        m["language"] = lang
        rows.append(m)
        
    df_lang = pd.DataFrame(rows)
    cols = ["language", "count", "benign_count", "threat_count", "accuracy", "precision", "recall", "f1"]
    df_lang = df_lang[cols]
    
    out_path = RESULTS_DIR / "per_language_results.csv"
    df_lang.to_csv(out_path, index=False)
    logger.info(f"Saved per-language metrics to {out_path}:\n{df_lang.to_string(index=False)}")
    return df_lang


def evaluate_class_distribution() -> pd.DataFrame:
    """
    Summarizes class distributions across merged, train, and test datasets.
    """
    logger.info("Computing class distribution summary...")
    merged_df = pd.read_csv(PROCESSED_DATA_DIR / "merged.csv")
    train_df = pd.read_csv(PROCESSED_DATA_DIR / "train.csv")
    test_df = pd.read_csv(PROCESSED_DATA_DIR / "test.csv")
    
    splits = [
        ("merged", merged_df),
        ("train", train_df),
        ("test", test_df)
    ]
    
    rows = []
    for split_name, df in splits:
        total = len(df)
        threats = int((df["label"] == 1).sum())
        benign = int((df["label"] == 0).sum())
        rows.append({
            "split": split_name,
            "total_samples": total,
            "benign_samples": benign,
            "benign_pct": round((benign / total) * 100, 2),
            "threat_samples": threats,
            "threat_pct": round((threats / total) * 100, 2)
        })
        
    df_dist = pd.DataFrame(rows)
    out_path = RESULTS_DIR / "class_distribution.csv"
    df_dist.to_csv(out_path, index=False)
    logger.info(f"Saved class distribution to {out_path}:\n{df_dist.to_string(index=False)}")
    return df_dist


def build_model_comparison() -> pd.DataFrame:
    """
    Constructs results/model_comparison.csv comparing Classical TF-IDF Baseline vs Multilingual Transformer.
    """
    logger.info("Building model comparison table...")
    base_csv = RESULTS_DIR / "baseline_results.csv"
    multi_csv = RESULTS_DIR / "multilingual_results.csv"
    
    if not base_csv.exists() or not multi_csv.exists():
        raise FileNotFoundError("Baseline or multilingual results CSV not found.")
        
    df_base = pd.read_csv(base_csv)
    df_multi = pd.read_csv(multi_csv)
    
    comp_rows = [
        {
            "model_architecture": "Classical TF-IDF + Calibrated LinearSVC",
            "feature_representation": "Word n-grams (1,2) with Sublinear TF (50k features)",
            "encoder_or_vectorizer": "TfidfVectorizer",
            "score_type": "calibrated_probability",
            "train_samples": int(df_base["train_samples"].iloc[0]),
            "test_samples": int(df_base["test_samples"].iloc[0]),
            "threshold": float(df_base["threshold"].iloc[0]),
            "accuracy": float(df_base["accuracy"].iloc[0]),
            "precision": float(df_base["precision"].iloc[0]),
            "recall": float(df_base["recall"].iloc[0]),
            "f1_score": float(df_base["f1"].iloc[0]),
            "roc_auc": float(df_base["roc_auc"].iloc[0]),
            "multilingual_support": "Preserves Unicode text; high accuracy on English and Latin scripts",
            "inference_speed": "Ultra-fast (< 1 ms per sample)"
        },
        {
            "model_architecture": "Multilingual Sentence Transformer + Calibrated Head",
            "feature_representation": "Dense Multilingual Embeddings (384-dimensional)",
            "encoder_or_vectorizer": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
            "score_type": "calibrated_probability",
            "train_samples": int(df_multi["train_samples"].iloc[0]),
            "test_samples": int(df_multi["test_samples"].iloc[0]),
            "threshold": float(df_multi["threshold"].iloc[0]),
            "accuracy": float(df_multi["accuracy"].iloc[0]),
            "precision": float(df_multi["precision"].iloc[0]),
            "recall": float(df_multi["recall"].iloc[0]),
            "f1_score": float(df_multi["f1"].iloc[0]),
            "roc_auc": float(df_multi["roc_auc"].iloc[0]),
            "multilingual_support": "50+ languages natively supported by pretrained encoder",
            "inference_speed": "Standard Transformer (~10-25 ms per sample on CPU)"
        }
    ]
    
    df_comp = pd.DataFrame(comp_rows)
    out_path = RESULTS_DIR / "model_comparison.csv"
    df_comp.to_csv(out_path, index=False)
    logger.info(f"Saved model comparison to {out_path}:\n{df_comp.to_string(index=False)}")
    return df_comp


def run_full_evaluation():
    """
    Executes the entire evaluation pipeline.
    """
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    
    test_df = pd.read_csv(PROCESSED_DATA_DIR / "test.csv")
    classical_bundle = load_classical_model()
    
    vectorizer = classical_bundle["vectorizer"]
    classifier = classical_bundle["classifier"]
    threshold = classical_bundle["threshold"]
    
    evaluate_per_source(test_df, vectorizer, classifier, threshold)
    evaluate_per_language(test_df, vectorizer, classifier, threshold)
    evaluate_class_distribution()
    build_model_comparison()
    logger.info("All evaluation artifacts successfully generated.")


if __name__ == "__main__":
    run_full_evaluation()
