"""
Tests for Unicode-Safe Preprocessing and Language Detection
"""
import pytest
from src.data.preprocess import clean_text, normalize_unicode
from src.data.language import detect_language, get_language_name, identify_language_details


def test_unicode_normalization_preserves_scripts():
    # Tamil
    tamil_text = "உடனடி: உங்கள் கணக்கு இடைநிறுத்தப்பட்டுள்ளது. கடவுச்சொல்லை சரிபார்க்கவும்."
    cleaned_tamil = clean_text(tamil_text)
    assert "கணக்கு" in cleaned_tamil
    assert "கடவுச்சொல்லை" in cleaned_tamil

    # Hindi (Devanagari)
    hindi_text = "तत्काल: आपका खाता निलंबित कर दिया गया है। पासवर्ड सत्यापित करें।"
    cleaned_hindi = clean_text(hindi_text)
    assert "खाता" in cleaned_hindi
    assert "पासवर्ड" in cleaned_hindi

    # Arabic
    arabic_text = "عاجل: تم تعليق حسابك. يرجى التحقق من كلمة المرور الخاصة بك."
    cleaned_arabic = clean_text(arabic_text)
    assert "حسابك" in cleaned_arabic
    assert "المرور" in cleaned_arabic

    # Chinese
    chinese_text = "紧急提示：您的账户已被暂停。请立即验证您的密码。"
    cleaned_chinese = clean_text(chinese_text)
    assert "账户" in cleaned_chinese


def test_clean_text_edge_cases():
    # None input
    assert clean_text(None) == ""
    # Empty string
    assert clean_text("") == ""
    # Whitespace only
    assert clean_text("   \t\n  \r\n  ") == ""
    # Extreme length text (100k characters)
    huge_text = "Urgent action required! " * 5000
    cleaned_huge = clean_text(huge_text)
    assert len(cleaned_huge) > 50000
    assert "urgent action required!" in cleaned_huge


def test_language_detection():
    # English
    assert detect_language("Hi team, let's schedule our sync meeting tomorrow at 10 AM.") == "en"
    
    # Tamil
    tamil = "உங்கள் கணக்கு இடைநிறுத்தப்பட்டுள்ளது. கடவுச்சொல்லை உடனடியாக சரிபார்க்கவும்."
    assert detect_language(tamil) == "ta"
    assert get_language_name("ta") == "Tamil"
    
    # Hindi
    hindi = "तत्काल: आपका बैंक खाता बंद कर दिया गया है।"
    assert detect_language(hindi) == "hi"
    assert get_language_name("hi") == "Hindi"
    
    # Arabic
    arabic = "عاجل: تم تعليق حسابك البنكي يرجى التحقق فورا"
    assert detect_language(arabic) == "ar"
    assert get_language_name("ar") == "Arabic"
    
    # Spanish
    spanish = "Estimado cliente, por favor verifique los datos de su cuenta bancaria."
    assert detect_language(spanish) == "es"
    assert get_language_name("es") == "Spanish"
