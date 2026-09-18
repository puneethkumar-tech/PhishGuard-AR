"""
Language Detection & Identification Module
"""
import re
from typing import Tuple
from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException

# Seed langdetect for deterministic results
DetectorFactory.seed = 42

# Mapping ISO 639-1 language codes to human-readable names
LANGUAGE_NAMES = {
    "en": "English",
    "ta": "Tamil",
    "hi": "Hindi",
    "ar": "Arabic",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "pt": "Portuguese",
    "ru": "Russian",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "zh": "Chinese",
    "it": "Italian",
    "nl": "Dutch",
    "id": "Indonesian",
    "tr": "Turkish",
    "ja": "Japanese",
    "ko": "Korean",
    "te": "Telugu",
    "mr": "Marathi",
    "ur": "Urdu",
    "bn": "Bengali",
    "pa": "Punjabi",
    "gu": "Gujarati",
    "ml": "Malayalam",
    "kn": "Kannada",
    "vi": "Vietnamese",
    "th": "Thai",
    "pl": "Polish",
    "sv": "Swedish",
    "ro": "Romanian",
    "el": "Greek",
    "cs": "Czech",
    "hu": "Hungarian",
    "da": "Danish",
    "fi": "Finnish",
    "no": "Norwegian",
    "he": "Hebrew",
    "fa": "Persian",
    "ca": "Catalan",
    "uk": "Ukrainian",
    "unknown": "Unknown"
}

# Regex to detect Tamil Unicode block (\u0B80-\u0BFF)
TAMIL_REGEX = re.compile(r'[\u0B80-\u0BFF]')
# Regex to detect Devanagari Unicode block (\u0900-\u097F) - Hindi, Marathi, etc.
DEVANAGARI_REGEX = re.compile(r'[\u0900-\u097F]')
# Regex to detect Arabic Unicode block (\u0600-\u06FF)
ARABIC_REGEX = re.compile(r'[\u0600-\u06FF]')
# Regex to detect CJK unified ideographs (\u4E00-\u9FFF)
CJK_REGEX = re.compile(r'[\u4E00-\u9FFF]')


def detect_language(text: str) -> str:
    """
    Detects language of given text.
    Combines Unicode script heuristics with langdetect for maximum accuracy across multilingual scripts.
    
    Returns ISO 639-1 code (e.g. 'en', 'ta', 'hi', 'ar', 'es') or 'unknown'.
    """
    if not text or not isinstance(text, str) or len(text.strip()) == 0:
        return "unknown"
    
    # Fast script heuristics for non-Latin scripts (handles short texts reliably)
    tamil_chars = len(TAMIL_REGEX.findall(text))
    if tamil_chars >= 3:
        return "ta"
    
    devanagari_chars = len(DEVANAGARI_REGEX.findall(text))
    if devanagari_chars >= 3:
        return "hi"
    
    arabic_chars = len(ARABIC_REGEX.findall(text))
    if arabic_chars >= 3:
        return "ar"
        
    cjk_chars = len(CJK_REGEX.findall(text))
    if cjk_chars >= 3:
        return "zh"
    
    # Use langdetect for Latin / other scripts
    sample = text.strip()[:1000]
    try:
        lang = detect(sample)
        return lang
    except LangDetectException:
        return "unknown"
    except Exception:
        return "unknown"


def get_language_name(lang_code: str) -> str:
    """
    Returns the human-readable language name for an ISO 639-1 code.
    """
    return LANGUAGE_NAMES.get(lang_code.lower(), lang_code.upper())


def identify_language_details(text: str) -> Tuple[str, str]:
    """
    Returns (iso_code, full_name).
    """
    code = detect_language(text)
    name = get_language_name(code)
    return code, name
