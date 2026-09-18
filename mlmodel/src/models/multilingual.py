"""
Multilingual Threat Detection Model: Multilingual Sentence Transformer + Calibrated Classifier Head
"""
import os
import sys
import logging
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional

from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Setup path
current_dir = Path(__file__).resolve().parent
mlmodel_dir = current_dir.parent.parent
if str(mlmodel_dir) not in sys.path:
    sys.path.insert(0, str(mlmodel_dir))

from config import (
    PROCESSED_DATA_DIR,
    MODELS_DIR,
    RESULTS_DIR,
    RANDOM_SEED,
    MULTILINGUAL_CONFIG,
    PREPROCESS_VERSION
)
from src.data.preprocess import clean_text
from src.data.language import identify_language_details

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Global singleton cache
_CACHED_MULTILINGUAL_BUNDLE = None
_CACHED_ENCODER = None


def get_encoder(model_name: str = MULTILINGUAL_CONFIG["model_name"]) -> SentenceTransformer:
    """
    Loads and caches the pretrained SentenceTransformer encoder.
    """
    global _CACHED_ENCODER
    if _CACHED_ENCODER is None:
        logger.info(f"Loading multilingual sentence encoder: {model_name}...")
        _CACHED_ENCODER = SentenceTransformer(model_name)
    return _CACHED_ENCODER


def train_multilingual_model(
    max_train_samples: int = 15000,
    max_test_samples: int = 5000
) -> Dict[str, Any]:
    """
    Trains the multilingual sentence-transformer classifier.
    Uses a stratified sample of the training set to maintain fast, reproducible training.
    Evaluates on a held-out test set and saves the model artifact.
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(f"Processed train/test data not found in {PROCESSED_DATA_DIR}. Run pipeline.py first.")
        
    logger.info("Loading processed datasets for multilingual modeling...")
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    train_df["text"] = train_df["text"].fillna("")
    test_df["text"] = test_df["text"].fillna("")
    
    # Controlled stratified sampling for embeddings using train_test_split
    if len(train_df) > max_train_samples:
        logger.info(f"Sampling {max_train_samples:,} stratified training examples (from {len(train_df):,})...")
        train_sample, _ = train_test_split(
            train_df,
            train_size=max_train_samples,
            stratify=train_df["label"],
            random_state=RANDOM_SEED
        )
        train_sample = train_sample.reset_index(drop=True)
    else:
        train_sample = train_df
        
    if len(test_df) > max_test_samples:
        logger.info(f"Sampling {max_test_samples:,} stratified test examples (from {len(test_df):,})...")
        test_sample, _ = train_test_split(
            test_df,
            train_size=max_test_samples,
            stratify=test_df["label"],
            random_state=RANDOM_SEED
        )
        test_sample = test_sample.reset_index(drop=True)
    else:
        test_sample = test_df
        
    encoder = get_encoder()
    
    logger.info(f"Encoding {len(train_sample):,} training texts with multilingual embeddings...")
    X_train_emb = encoder.encode(
        train_sample["text"].tolist(),
        batch_size=MULTILINGUAL_CONFIG["batch_size"],
        show_progress_bar=True,
        normalize_embeddings=True
    )
    y_train = train_sample["label"].values
    
    logger.info(f"Encoding {len(test_sample):,} test texts with multilingual embeddings...")
    X_test_emb = encoder.encode(
        test_sample["text"].tolist(),
        batch_size=MULTILINGUAL_CONFIG["batch_size"],
        show_progress_bar=True,
        normalize_embeddings=True
    )
    y_test = test_sample["label"].values
    
    # Train Logistic Regression head with calibration
    logger.info("Training calibrated Logistic Regression classifier head on embeddings...")
    base_lr = LogisticRegression(
        C=MULTILINGUAL_CONFIG["C"],
        max_iter=MULTILINGUAL_CONFIG["max_iter"],
        random_state=RANDOM_SEED,
        class_weight="balanced"
    )
    calibrated_clf = CalibratedClassifierCV(
        estimator=base_lr,
        cv=3,
        method="sigmoid"
    )
    calibrated_clf.fit(X_train_emb, y_train)
    
    # Evaluate strictly on held-out test sample
    logger.info("Evaluating multilingual model on held-out test sample...")
    test_probs = calibrated_clf.predict_proba(X_test_emb)[:, 1]
    test_preds = (test_probs >= 0.50).astype(int)
    
    acc = accuracy_score(y_test, test_preds)
    prec = precision_score(y_test, test_preds, zero_division=0)
    rec = recall_score(y_test, test_preds, zero_division=0)
    f1 = f1_score(y_test, test_preds, zero_division=0)
    macro_f1 = f1_score(y_test, test_preds, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_test, test_preds, average="weighted", zero_division=0)
    roc_auc = roc_auc_score(y_test, test_probs)
    cm = confusion_matrix(y_test, test_preds)
    
    metrics = {
        "model_name": f"Multilingual Transformer ({MULTILINGUAL_CONFIG['model_name']})",
        "encoder": MULTILINGUAL_CONFIG["model_name"],
        "supported_languages_capability": MULTILINGUAL_CONFIG["supported_languages_count"],
        "train_samples": len(train_sample),
        "test_samples": len(test_sample),
        "threshold": 0.50,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "roc_auc": round(roc_auc, 4),
        "tn": int(cm[0, 0]),
        "fp": int(cm[0, 1]),
        "fn": int(cm[1, 0]),
        "tp": int(cm[1, 1])
    }
    
    logger.info("=== MULTILINGUAL MODEL TEST METRICS ===")
    for k, v in metrics.items():
        logger.info(f"  {k}: {v}")
    logger.info("\nConfusion Matrix:\n" + str(cm))
    logger.info("\nClassification Report:\n" + classification_report(y_test, test_preds, target_names=["Benign", "Threat"]))
    
    # Save multilingual results CSV
    results_df = pd.DataFrame([metrics])
    ml_csv = RESULTS_DIR / "multilingual_results.csv"
    results_df.to_csv(ml_csv, index=False)
    logger.info(f"Saved multilingual metrics to {ml_csv}")
    
    # Save model bundle
    bundle = {
        "model_version": "multilingual-v1",
        "encoder_name": MULTILINGUAL_CONFIG["model_name"],
        "classifier": calibrated_clf,
        "threshold": 0.50,
        "preprocess_version": PREPROCESS_VERSION,
        "score_type": "calibrated_probability",
        "label_mapping": {0: "safe", 1: "threat"},
        "threat_scope": ["phishing", "spam"],
        "metrics": metrics,
        "random_seed": RANDOM_SEED
    }
    
    bundle_path = MODELS_DIR / "multilingual_model.pkl"
    joblib.dump(bundle, bundle_path, compress=3)
    logger.info(f"Serialized multilingual model bundle to {bundle_path}")
    
    return bundle


def load_multilingual_model() -> dict:
    """
    Loads and caches the trained multilingual model bundle.
    """
    global _CACHED_MULTILINGUAL_BUNDLE
    if _CACHED_MULTILINGUAL_BUNDLE is None:
        bundle_path = MODELS_DIR / "multilingual_model.pkl"
        if not bundle_path.exists():
            raise FileNotFoundError(f"Multilingual model artifact not found at {bundle_path}. Run training first.")
        _CACHED_MULTILINGUAL_BUNDLE = joblib.load(bundle_path)
    return _CACHED_MULTILINGUAL_BUNDLE


def predict_multilingual(text: str) -> Dict[str, Any]:
    """
    Inference function for the multilingual embedding classifier.
    """
    bundle = load_multilingual_model()
    classifier = bundle["classifier"]
    threshold = bundle.get("threshold", 0.50)
    
    # Unicode-safe cleaning
    cleaned = clean_text(text)
    
    # Language identification
    lang_code, lang_name = identify_language_details(cleaned)
    
    if not cleaned or len(cleaned.strip()) == 0:
        return {
            "verdict": "safe",
            "threat_type": "benign",
            "score": 0.0,
            "score_type": "calibrated_probability",
            "threshold_used": threshold,
            "language": lang_code,
            "language_name": lang_name,
            "severity": "none",
            "recommendation": "Empty message provided. No threats detected.",
            "model_version": bundle["model_version"]
        }
        
    encoder = get_encoder(bundle["encoder_name"])
    emb = encoder.encode([cleaned], normalize_embeddings=True)
    probs = classifier.predict_proba(emb)[0]
    threat_prob = float(probs[1])
    
    is_threat = threat_prob >= threshold
    verdict = "phishing" if is_threat else "safe"
    threat_type = "phishing" if is_threat else "benign"
    
    if not is_threat:
        severity = "none"
    elif threat_prob >= 0.85:
        severity = "high"
    elif threat_prob >= 0.65:
        severity = "medium"
    else:
        severity = "low"
        
    if severity == "high":
        recommendation = "High risk email threat. Do not click links, download attachments, or provide credentials."
    elif severity == "medium":
        recommendation = "Suspicious email. Verify sender identity through an official external channel."
    elif severity == "low":
        recommendation = "Low confidence anomaly detected. Exercise caution."
    else:
        recommendation = "No security threat patterns identified. Message appears legitimate."
        
    return {
        "verdict": verdict,
        "threat_type": threat_type,
        "score": round(threat_prob, 4),
        "score_type": "calibrated_probability",
        "threshold_used": threshold,
        "language": lang_code,
        "language_name": lang_name,
        "severity": severity,
        "recommendation": recommendation,
        "model_version": bundle["model_version"]
    }


if __name__ == "__main__":
    train_multilingual_model()
