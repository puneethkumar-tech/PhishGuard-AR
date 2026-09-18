"""
Unicode-Safe Text Preprocessing for Multilingual Threat Detection
"""
import re
import unicodedata
from typing import Optional

# Regex for URL detection (preserves context by substituting with standard token)
URL_PATTERN = re.compile(
    r'(?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+',
    re.IGNORECASE
)

# Regex for Email address detection
EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
    re.IGNORECASE
)

# Regex for IP addresses
IP_PATTERN = re.compile(
    r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
)

# Whitespace normalization regex (matches tabs, multiple spaces, multiple newlines)
WHITESPACE_PATTERN = re.compile(r'[\r\n\t]+')
MULTI_SPACE_PATTERN = re.compile(r'\s{2,}')


def normalize_unicode(text: str) -> str:
    """
    Applies standard Unicode NFKC normalization.
    Preserves all multilingual scripts (Tamil, Devanagari/Hindi, Arabic, Chinese, Cyrillic, etc.)
    while standardizing compatibility characters and accents.
    """
    if not isinstance(text, str):
        return ""
    return unicodedata.normalize('NFKC', text)


def clean_text(
    text: Optional[str],
    replace_urls: bool = False,
    replace_emails: bool = False,
    replace_ips: bool = False,
    lowercase: bool = True
) -> str:
    """
    Safely normalizes email/message text for threat detection.
    
    CRITICAL SECURITY & MULTILINGUAL RULES:
    - Never uses ASCII-only regex filtering that would strip non-Latin scripts.
    - Preserves Unicode characters across all languages.
    - Normalizes strange control characters while preserving sentence structure.
    - Sanitizes malicious control characters / null bytes safely.
    
    Args:
        text: Raw input string.
        replace_urls: If True, replaces URLs with ' http_url '.
        replace_emails: If True, replaces email addresses with ' email_addr '.
        replace_ips: If True, replaces IPv4 addresses with ' ip_addr '.
        lowercase: If True, applies Unicode case folding / lowercasing.
        
    Returns:
        Cleaned, normalized string.
    """
    if text is None or not isinstance(text, str):
        return ""
    
    # Remove null bytes and non-printable control characters (except newline/tab)
    text = "".join(ch for ch in text if ch == '\n' or ch == '\t' or unicodedata.category(ch) != 'Cc')
    
    # Unicode NFKC normalization
    text = normalize_unicode(text)
    
    # Optionally normalize specific indicators
    if replace_urls:
        text = URL_PATTERN.sub(' http_url ', text)
    if replace_emails:
        text = EMAIL_PATTERN.sub(' email_addr ', text)
    if replace_ips:
        text = IP_PATTERN.sub(' ip_addr ', text)
        
    # Normalize whitespace
    text = WHITESPACE_PATTERN.sub(' ', text)
    text = MULTI_SPACE_PATTERN.sub(' ', text).strip()
    
    if lowercase:
        text = text.lower()
        
    return text
