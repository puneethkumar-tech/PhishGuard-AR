# PhishGuard-AR: Dataset Audit & Schema Specification Report

**Author:** Person A (Senior AI/ML Engineer)  
**Project:** PhishGuard-AR | CodeCortex 3.0  
**Branch:** `mlmodel`  
**Date:** September 2026  

---

## 1. Executive Summary

This report provides the authoritative audit of all **8 datasets** provided in `datasets/` for the PhishGuard-AR threat detection system.

The datasets comprise **7 text/email corpora** totaling **162,512 deduplicated records** for Natural Language Processing, and **1 structural Portable Executable (PE) binary malware table** (138,047 records) which is maintained strictly separate from the text NLP pipeline.

---

## 2. Dataset Audit Breakdown

### Authoritative Datasets (8 Total)

| # | Dataset Name | Relative Path | Size | Raw Rows | Raw Columns | Schema / Candidate Text | Label Column & Values | Pipeline Handling |
|---|---|---|---|---|---|---|---|---|
| 1 | **emails** | `email spam/emails.csv` | 8.54 MB | 5,728 | 2 | `text` | `spam`: 0 (4,360), 1 (1,368) | Text NLP: Spam threat |
| 2 | **CEAS_08** | `phishing emails/archive (6)/CEAS_08.csv` | 64.76 MB | 39,154 | 7 | `subject` + `\n` + `body` | `label`: 0 (17,312), 1 (21,842) | Text NLP: Phishing threat |
| 3 | **Enron** | `phishing emails/archive (6)/Enron.csv` | 43.45 MB | 29,767 | 3 | `subject` + `\n` + `body` | `label`: 0 (15,791), 1 (13,976) | Text NLP: Spam threat |
| 4 | **Ling** | `phishing emails/archive (6)/Ling.csv` | 8.91 MB | 2,859 | 3 | `subject` + `\n` + `body` | `label`: 0 (2,401), 1 (458) | Text NLP: Spam threat |
| 5 | **Nigerian_Fraud** | `phishing emails/archive (6)/Nigerian_Fraud.csv` | 8.77 MB | 3,332 | 7 | `subject` + `\n` + `body` | `label`: 1 (3,332) [100% Threat] | Text NLP: Phishing threat |
| 6 | **phishing_email** | `phishing emails/archive (6)/phishing_email.csv` | 101.67 MB | 82,486 | 2 | `text_combined` | `label`: 0 (39,595), 1 (42,891) | Text NLP: Phishing threat |
| 7 | **SpamAssasin** | `phishing emails/archive (6)/SpamAssasin.csv` | 14.19 MB | 5,809 | 7 | `subject` + `\n` + `body` | `label`: 0 (4,091), 1 (1,718) | Text NLP: Spam threat |
| 8 | **malware** | `malware/malware.csv` | 48.32 MB | 138,047 | 57 | *None (PE Header Vectors)* | `legitimate`: 0 (96,724), 1 (41,323) | **Excluded from NLP** (PE binary metadata) |

---

## 3. Structural PE Malware Dataset Separation

> [!IMPORTANT]
> `malware/malware.csv` contains 57 numerical and hash features extracted from Windows Portable Executable (PE) headers:
> - Header fields: `Machine`, `SizeOfOptionalHeader`, `Characteristics`, `MajorLinkerVersion`, `ImageBase`, `SectionAlignment`, `CheckSum`, `Subsystem`, etc.
> - Statistical features: `SectionsMeanEntropy`, `SectionsMaxEntropy`, `ResourcesMeanEntropy`, `ImportsNbDLL`, etc.
> - Identification: `Name`, `md5`.
> - Ground truth: `legitimate` (0 = Malware [Threat], 1 = Legitimate [Benign]).
> 
> **Architectural Decision:** This file contains compiled executable metadata, NOT email message text. Forcing numeric PE features into a text classifier would corrupt NLP vocabulary and deceive analysts. In compliance with security best practices and our hackathon master plan, `malware.csv` is preserved as a distinct tabular artifact and excluded from the email text pipeline.

---

## 4. Text Pipeline Normalization & Deduplication

### Standardized Target Schema
Every text record is unified into the following 5 columns:
1. `text`: Unicode NFKC cleaned string (subject + body or body).
2. `label`: Binary integer (`0` = Benign/Safe, `1` = Threat/Phishing/Spam).
3. `source`: Dataset identifier (`CEAS_08`, `Enron`, `Ling`, `Nigerian_Fraud`, `SpamAssasin`, `emails`, `phishing_email`).
4. `threat_type`: Categorical indicator (`benign`, `phishing`, `spam`).
5. `language`: ISO 639-1 language code (e.g. `en`, `ta`, `hi`, `ar`, `es`, `fr`, etc.).

### Cross-Dataset Deduplication & Leakage Prevention
`phishing_email.csv` is an aggregated dataset containing overlap with earlier collections (Enron, Ling, SpamAssassin). Our pipeline performed global exact text deduplication before splitting:
- **Raw combined text records:** 169,135
- **Deduplicated records:** 162,512 (6,623 cross-corpus duplicates eliminated)
- **Train Split (80%):** 130,009 samples
- **Held-Out Test Split (20%):** 32,503 samples
- **Train/Test Overlap:** Exactly **0** overlapping texts (Strict zero data leakage).

---

## 5. Class Balance Summary

| Split | Total Samples | Benign Count | Benign % | Threat Count | Threat % |
|---|---|---|---|---|---|
| **Merged** | 162,512 | 78,579 | 48.35% | 83,933 | 51.65% |
| **Train (80%)** | 130,009 | 62,863 | 48.35% | 67,146 | 51.65% |
| **Test (20%)** | 32,503 | 15,716 | 48.35% | 16,787 | 51.65% |

---

## 6. Language Coverage & Honest Capability Distinction

- **Pretrained Encoder Language Capability:** The underlying multilingual transformer (`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`) natively supports **50+ languages** (including Tamil, Hindi, Arabic, Chinese, Spanish, French, German, Russian, etc.).
- **Historical Dataset Representation:** Historical email corpora (CEAS_08, Enron, SpamAssassin, Ling) are overwhelmingly in English (~98.2%), with minor European language presence (French, Catalan, Spanish, Dutch, Portuguese, German, Italian).
- **Multilingual Testing:** In addition to test-set evaluation, we explicitly test multilingual inputs across Tamil, Hindi, Arabic, and Spanish in automated test suites (`mlmodel/tests/test_models.py`).
