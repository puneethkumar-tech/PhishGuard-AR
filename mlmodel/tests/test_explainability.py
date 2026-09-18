"""
Tests for Feature Attribution and Explainability Engine
"""
import pytest
from src.models.classical import load_classical_model
from src.explainability.evidence import extract_feature_attribution, get_highlights, format_evidence_report


def test_feature_attribution_extraction():
    bundle = load_classical_model()
    vectorizer = bundle["vectorizer"]
    classifier = bundle["classifier"]
    
    text = "URGENT ACTION REQUIRED: Verify your bank account password immediately or it will be suspended!"
    attributions = extract_feature_attribution(text, vectorizer, classifier, top_k=5)
    
    assert len(attributions) > 0
    for item in attributions:
        assert "token" in item
        assert "weight" in item
        assert "direction" in item
        assert item["direction"] in ["threat", "safe"]
        assert isinstance(item["weight"], float)


def test_highlights_output():
    bundle = load_classical_model()
    vectorizer = bundle["vectorizer"]
    classifier = bundle["classifier"]
    
    text = "URGENT ACTION REQUIRED: Verify your bank account password immediately or it will be suspended!"
    highlights = get_highlights(text, vectorizer, classifier, top_k=3)
    
    assert isinstance(highlights, list)
    assert len(highlights) <= 3
    for token in highlights:
        assert isinstance(token, str)


def test_evidence_report_disclaimer():
    bundle = load_classical_model()
    vectorizer = bundle["vectorizer"]
    classifier = bundle["classifier"]
    
    text = "Please verify your credentials"
    report = format_evidence_report(text, vectorizer, classifier)
    
    assert "method" in report
    assert report["method"] == "model feature attribution"
    assert "disclaimer" in report
    assert "model evidence" in report["disclaimer"].lower()
