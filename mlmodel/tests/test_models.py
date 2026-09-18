"""
Tests for Model Inference, Calibration, Contract Adherence, and Multilingual Detection
"""
import pytest
from src.models.classical import predict, load_classical_model
from src.models.multilingual import predict_multilingual, load_multilingual_model


def test_classical_model_contract_structure():
    text = "URGENT! Your bank account has been suspended. Please click here to verify your credentials immediately."
    res = predict(text)
    
    # Check all required keys in API contract
    required_keys = [
        "verdict",
        "threat_type",
        "score",
        "score_type",
        "threshold_used",
        "language",
        "language_name",
        "severity",
        "highlights",
        "evidence",
        "recommendation",
        "model_version"
    ]
    for k in required_keys:
        assert k in res, f"Missing key in prediction response: {k}"
        
    assert res["verdict"] in ["phishing", "safe"]
    assert res["score_type"] == "calibrated_probability"
    assert 0.0 <= res["score"] <= 1.0
    assert res["language"] == "en"
    assert res["verdict"] == "phishing"  # Suspicious urgent verify email


def test_classical_benign_prediction():
    text = "Hi team, let's meet tomorrow at 10 AM in the conference room to review project updates."
    res = predict(text)
    
    assert res["verdict"] == "safe"
    assert res["severity"] == "none"
    assert res["score"] < 0.50


def test_multilingual_model_contract():
    text = "URGENT! Your security pin has expired. Reset immediately."
    res = predict_multilingual(text)
    
    assert "verdict" in res
    assert "score" in res
    assert "score_type" in res
    assert res["score_type"] == "calibrated_probability"
    assert 0.0 <= res["score"] <= 1.0


def test_multilingual_languages_inference():
    # Tamil Threat
    tamil_threat = "உடனடி எச்சரிக்கை: உங்கள் வங்கிக் கணக்கு முடக்கப்பட்டுள்ளது. கடவுச்சொல்லை உடனடியாக மாற்ற இங்கே கிளிக் செய்யவும்."
    res_ta = predict_multilingual(tamil_threat)
    assert res_ta["language"] == "ta"
    assert res_ta["language_name"] == "Tamil"
    assert res_ta["score"] > 0.50

    # Hindi Threat
    hindi_threat = "तत्काल सूचना: आपका बैंक खाता ब्लॉक कर दिया गया है। तुरंत पासवर्ड सत्यापित करें।"
    res_hi = predict_multilingual(hindi_threat)
    assert res_hi["language"] == "hi"
    assert res_hi["language_name"] == "Hindi"
    assert res_hi["score"] > 0.50

    # Arabic Threat
    arabic_threat = "تنبيه أمني عاجل: تم إيقاف حسابك المصرفي مؤقتا. انقر هنا للتحقق من هويتك وتحديث بياناتك الآن."
    res_ar = predict_multilingual(arabic_threat)
    assert res_ar["language"] == "ar"
    assert res_ar["language_name"] == "Arabic"
    assert res_ar["score"] > 0.50

    # Spanish Threat
    spanish_threat = "URGENTE: Su cuenta bancaria ha sido bloqueada. Haga clic aquí para verificar sus datos."
    res_es = predict_multilingual(spanish_threat)
    assert res_es["language"] == "es"
    assert res_es["language_name"] == "Spanish"
    assert res_es["score"] > 0.50


def test_empty_and_edge_inputs():
    res_empty = predict("")
    assert res_empty["verdict"] == "safe"
    assert res_empty["score"] == 0.0
    
    res_multi_empty = predict_multilingual("   ")
    assert res_multi_empty["verdict"] == "safe"
    assert res_multi_empty["score"] == 0.0
