"""
Model Feature Attribution & Explainability Module for Threat Detection
"""
import re
import numpy as np
from typing import List, Dict, Any, Optional

# Unicode-aware word token pattern (supports all multilingual scripts)
UNICODE_TOKEN_PATTERN = re.compile(r'\b\w+\b', re.UNICODE)

EXPLAINABILITY_DISCLAIMER = (
    "Model feature attribution indicates which terms statistically influenced the classifier decision. "
    "These highlights represent model evidence and are not conclusive proof of malicious intent."
)


def extract_feature_attribution(
    text: str,
    vectorizer,
    classifier,
    top_k: int = 10,
    method_name: str = "model feature attribution"
) -> List[Dict[str, Any]]:
    """
    Computes token-level feature attribution scores for an input text.
    
    Uses exact TF-IDF weight x Classifier coefficient attribution.
    When a CalibratedClassifierCV is used, coefficients are averaged across calibrated estimators.
    
    Args:
        text: Input string.
        vectorizer: Fitted TfidfVectorizer.
        classifier: Fitted Linear model (LinearSVC, LogisticRegression, or CalibratedClassifierCV).
        top_k: Number of most significant tokens to return.
        method_name: Naming for the attribution method.
        
    Returns:
        List of dicts: [{"token": str, "weight": float, "direction": "threat"|"safe"}]
    """
    if not text or not isinstance(text, str):
        return []
        
    # Extract coefficients
    coefs = None
    if hasattr(classifier, "coef_"):
        coefs = classifier.coef_[0]
    elif hasattr(classifier, "calibrated_classifiers_"):
        # CalibratedClassifierCV with base estimators
        raw_coefs = []
        for cc in classifier.calibrated_classifiers_:
            base = getattr(cc, "estimator", getattr(cc, "base_estimator", None))
            if base is not None and hasattr(base, "coef_"):
                raw_coefs.append(base.coef_[0])
        if raw_coefs:
            coefs = np.mean(raw_coefs, axis=0)
            
    if coefs is None or vectorizer is None:
        return []
        
    # Transform text to TF-IDF sparse vector
    tfidf_vec = vectorizer.transform([text])
    feature_names = vectorizer.get_feature_names_out()
    
    # Calculate non-zero feature contributions: tfidf_val * coef
    non_zero_indices = tfidf_vec.nonzero()[1]
    if len(non_zero_indices) == 0:
        return []
        
    attributions = []
    for idx in non_zero_indices:
        token = feature_names[idx]
        val = tfidf_vec[0, idx]
        weight = float(val * coefs[idx])
        direction = "threat" if weight > 0 else "safe"
        attributions.append({
            "token": str(token),
            "weight": round(weight, 4),
            "direction": direction,
            "absolute_weight": abs(weight)
        })
        
    # Sort by absolute contribution descending
    attributions.sort(key=lambda x: x["absolute_weight"], reverse=True)
    
    # Return top_k without the temporary sorting key
    results = [
        {
            "token": item["token"],
            "weight": item["weight"],
            "direction": item["direction"]
        }
        for item in attributions[:top_k]
    ]
    return results


def get_highlights(
    text: str,
    vectorizer,
    classifier,
    top_k: int = 5
) -> List[str]:
    """
    Convenience function returning a simple list of top threat-inducing token strings for frontend highlighting.
    """
    attributions = extract_feature_attribution(text, vectorizer, classifier, top_k=top_k * 2)
    threat_tokens = [
        item["token"] for item in attributions
        if item["direction"] == "threat" and item["weight"] > 0
    ]
    return threat_tokens[:top_k]


def format_evidence_report(
    text: str,
    vectorizer,
    classifier,
    top_k: int = 8
) -> Dict[str, Any]:
    """
    Returns a complete structured explainability report for backend and analyst UI.
    """
    attributions = extract_feature_attribution(text, vectorizer, classifier, top_k=top_k)
    threat_indicators = [item for item in attributions if item["direction"] == "threat"]
    safe_indicators = [item for item in attributions if item["direction"] == "safe"]
    
    return {
        "method": "model feature attribution",
        "disclaimer": EXPLAINABILITY_DISCLAIMER,
        "threat_evidence": threat_indicators,
        "safe_evidence": safe_indicators,
        "all_attributions": attributions
    }
