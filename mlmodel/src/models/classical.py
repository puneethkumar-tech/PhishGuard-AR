"""
Classical Baseline Model: Calibrated TF-IDF + LinearSVC Pipeline
"""
import os
import sys
import logging
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Setup path for running as module or script
current_dir = Path(__file__).resolve().parent
mlmodel_dir = current_dir.parent.parent
if str(mlmodel_dir) not in sys.path:
    sys.path.insert(0, str(mlmodel_dir))

from config import (
    PROCESSED_DATA_DIR,
    MODELS_DIR,
    RESULTS_DIR,
    RANDOM_SEED,
    TFIDF_CONFIG,
    CLASSICAL_MODEL_CONFIG,
    PREPROCESS_VERSION
)
from src.data.preprocess import clean_text
from src.data.language import identify_language_details
from src.explainability.evidence import extract_feature_attribution, get_highlights, format_evidence_report

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Global singleton for cached model loading
_CACHED_CLASSICAL_BUNDLE = None


def select_best_threshold_cv(X_train_tfidf, y_train, cv_folds=5) -> float:
    """
    Finds the optimal decision threshold via Cross-Validation on the TRAINING SET ONLY.
    The final test set is strictly untouched during threshold tuning.
    """
    logger.info("Running CV-based threshold selection on training data only...")
    skf = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=RANDOM_SEED)
    candidate_thresholds = np.linspace(0.30, 0.70, 9)
    threshold_f1_scores = {t: [] for t in candidate_thresholds}
    
    for train_idx, val_idx in skf.split(X_train_tfidf, y_train):
        X_tr, X_val = X_train_tfidf[train_idx], X_train_tfidf[val_idx]
        y_tr, y_val = y_train.iloc[train_idx], y_train.iloc[val_idx]
        
        base_clf = LinearSVC(
            C=CLASSICAL_MODEL_CONFIG["C"],
            max_iter=CLASSICAL_MODEL_CONFIG["max_iter"],
            random_state=RANDOM_SEED
        )
        calibrated = CalibratedClassifierCV(estimator=base_clf, cv=3, method=CLASSICAL_MODEL_CONFIG["calibration_method"])
        calibrated.fit(X_tr, y_tr)
        
        val_probs = calibrated.predict_proba(X_val)[:, 1]
        for t in candidate_thresholds:
            preds = (val_probs >= t).astype(int)
            threshold_f1_scores[t].append(f1_score(y_val, preds, zero_division=0))
            
    mean_f1_per_t = {t: np.mean(scores) for t, scores in threshold_f1_scores.items()}
    best_threshold = max(mean_f1_per_t, key=mean_f1_per_t.get)
    logger.info(f"CV F1 by threshold: { {round(k, 2): round(v, 4) for k, v in mean_f1_per_t.items()} }")
    logger.info(f"Selected CV optimal threshold on training data: {best_threshold:.2f} (CV Mean F1: {mean_f1_per_t[best_threshold]:.4f})")
    return float(best_threshold)


def train_classical_model() -> Dict[str, Any]:
    """
    Trains the TF-IDF + Calibrated LinearSVC pipeline on train.csv and evaluates on test.csv.
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(f"Processed train/test data not found in {PROCESSED_DATA_DIR}. Run pipeline.py first.")
        
    logger.info("Loading processed datasets...")
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    # Fill missing text safely
    train_df["text"] = train_df["text"].fillna("")
    test_df["text"] = test_df["text"].fillna("")
    
    logger.info(f"Fitting TfidfVectorizer (max_features={TFIDF_CONFIG['max_features']}, ngram_range={TFIDF_CONFIG['ngram_range']})...")
    vectorizer = TfidfVectorizer(
        ngram_range=TFIDF_CONFIG["ngram_range"],
        sublinear_tf=TFIDF_CONFIG["sublinear_tf"],
        max_features=TFIDF_CONFIG["max_features"],
        min_df=TFIDF_CONFIG["min_df"],
        max_df=TFIDF_CONFIG["max_df"]
    )
    
    X_train = vectorizer.fit_transform(train_df["text"])
    y_train = train_df["label"]
    
    X_test = vectorizer.transform(test_df["text"])
    y_test = test_df["label"]
    
    # Find optimal threshold using CV on train set only (test set held out)
    best_threshold = select_best_threshold_cv(X_train, y_train, cv_folds=CLASSICAL_MODEL_CONFIG["cv_folds"])
    
    # Train final calibrated model on entire train set
    logger.info("Training full CalibratedClassifierCV on all training data...")
    base_clf = LinearSVC(
        C=CLASSICAL_MODEL_CONFIG["C"],
        max_iter=CLASSICAL_MODEL_CONFIG["max_iter"],
        random_state=RANDOM_SEED
    )
    calibrated_clf = CalibratedClassifierCV(
        estimator=base_clf,
        cv=CLASSICAL_MODEL_CONFIG["cv_folds"],
        method=CLASSICAL_MODEL_CONFIG["calibration_method"]
    )
    calibrated_clf.fit(X_train, y_train)
    
    # Evaluate strictly on held-out test set
    logger.info("Evaluating on held-out test set (Zero Leakage)...")
    test_probs = calibrated_clf.predict_proba(X_test)[:, 1]
    test_preds = (test_probs >= best_threshold).astype(int)
    
    acc = accuracy_score(y_test, test_preds)
    prec = precision_score(y_test, test_preds, zero_division=0)
    rec = recall_score(y_test, test_preds, zero_division=0)
    f1 = f1_score(y_test, test_preds, zero_division=0)
    macro_f1 = f1_score(y_test, test_preds, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_test, test_preds, average="weighted", zero_division=0)
    roc_auc = roc_auc_score(y_test, test_probs)
    cm = confusion_matrix(y_test, test_preds)
    
    metrics = {
        "model_name": "TF-IDF + Calibrated LinearSVC",
        "train_samples": len(train_df),
        "test_samples": len(test_df),
        "threshold": best_threshold,
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
    
    logger.info("=== HELD-OUT TEST EVALUATION METRICS ===")
    for k, v in metrics.items():
        logger.info(f"  {k}: {v}")
    logger.info("\nConfusion Matrix:\n" + str(cm))
    logger.info("\nClassification Report:\n" + classification_report(y_test, test_preds, target_names=["Benign", "Threat"]))
    
    # Save baseline results CSV
    results_df = pd.DataFrame([metrics])
    baseline_csv = RESULTS_DIR / "baseline_results.csv"
    results_df.to_csv(baseline_csv, index=False)
    logger.info(f"Saved baseline metrics to {baseline_csv}")
    
    # Save model bundle
    bundle = {
        "model_version": "classical-baseline-v1",
        "vectorizer": vectorizer,
        "classifier": calibrated_clf,
        "threshold": best_threshold,
        "preprocess_version": PREPROCESS_VERSION,
        "score_type": "calibrated_probability",
        "label_mapping": {0: "safe", 1: "threat"},
        "threat_scope": ["phishing", "spam"],
        "training_sources": list(train_df["source"].unique()),
        "metrics": metrics,
        "random_seed": RANDOM_SEED
    }
    
    bundle_path = MODELS_DIR / "classical_model.pkl"
    joblib.dump(bundle, bundle_path, compress=3)
    logger.info(f"Serialized model bundle to {bundle_path} ({os.path.getsize(bundle_path) / 1024:.1f} KB)")
    
    return bundle


def load_classical_model() -> dict:
    """
    Loads and caches the trained classical model bundle.
    """
    global _CACHED_CLASSICAL_BUNDLE
    if _CACHED_CLASSICAL_BUNDLE is None:
        bundle_path = MODELS_DIR / "classical_model.pkl"
        if not bundle_path.exists():
            raise FileNotFoundError(f"Classical model artifact not found at {bundle_path}. Run training first.")
        _CACHED_CLASSICAL_BUNDLE = joblib.load(bundle_path)
    return _CACHED_CLASSICAL_BUNDLE


def predict(text: str) -> Dict[str, Any]:
    """
    Production inference function adhering to PhishGuard-AR Backend API Contract.
    
    Args:
        text: Raw email / message string.
        
    Returns:
        Structured JSON-serializable dictionary with prediction, calibrated probability,
        evidence, and language info.
    """
    bundle = load_classical_model()
    vectorizer = bundle["vectorizer"]
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
            "highlights": [],
            "evidence": [],
            "recommendation": "Empty message provided. No threats detected.",
            "model_version": bundle["model_version"]
        }
        
    # Vectorize and compute probability
    tfidf_vec = vectorizer.transform([cleaned])
    probs = classifier.predict_proba(tfidf_vec)[0]
    threat_prob = float(probs[1])
    
    is_threat = threat_prob >= threshold
    verdict = "phishing" if is_threat else "safe"
    threat_type = "phishing" if is_threat else "benign"
    
    # Severity mapping
    if not is_threat:
        severity = "none"
    elif threat_prob >= 0.85:
        severity = "high"
    elif threat_prob >= 0.65:
        severity = "medium"
    else:
        severity = "low"
        
    # Recommendations
    if severity == "high":
        recommendation = "High risk email threat. Do not click links, download attachments, or provide credentials."
    elif severity == "medium":
        recommendation = "Suspicious email. Verify sender identity through an official external channel before interacting."
    elif severity == "low":
        recommendation = "Low confidence anomaly detected. Exercise caution."
    else:
        recommendation = "No security threat patterns identified. Message appears legitimate."
        
    # Explainability & Evidence
    evidence_list = extract_feature_attribution(cleaned, vectorizer, classifier, top_k=6)
    highlights = get_highlights(cleaned, vectorizer, classifier, top_k=5)
    
    return {
        "verdict": verdict,
        "threat_type": threat_type,
        "score": round(threat_prob, 4),
        "score_type": "calibrated_probability",
        "threshold_used": threshold,
        "language": lang_code,
        "language_name": lang_name,
        "severity": severity,
        "highlights": highlights,
        "evidence": evidence_list,
        "recommendation": recommendation,
        "model_version": bundle["model_version"]
    }


if __name__ == "__main__":
    train_classical_model()
