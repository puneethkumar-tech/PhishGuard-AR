"""
PhishGuard-AR ML Configuration & Reproducibility Parameters
"""
import os
from pathlib import Path

# Base Paths
MLMODEL_DIR = Path(__file__).resolve().parent
REPO_ROOT = MLMODEL_DIR.parent
DATASETS_RAW_DIR = REPO_ROOT / "datasets"
PROCESSED_DATA_DIR = MLMODEL_DIR / "data" / "processed"
MODELS_DIR = MLMODEL_DIR / "models"
RESULTS_DIR = MLMODEL_DIR / "results"
DOCS_DIR = MLMODEL_DIR / "docs"

# Reproducibility Config
RANDOM_SEED = 42
TEST_SPLIT_RATIO = 0.20
CV_FOLDS = 5

# Preprocessing Config
PREPROCESS_VERSION = "v1-unicode-safe"
MIN_TEXT_LENGTH = 10
MAX_TEXT_LENGTH = 100000

# Classical Model Hyperparameters
TFIDF_CONFIG = {
    "ngram_range": (1, 2),
    "sublinear_tf": True,
    "max_features": 50000,
    "min_df": 2,
    "max_df": 0.95
}

CLASSICAL_MODEL_CONFIG = {
    "classifier": "LinearSVC",
    "C": 1.0,
    "max_iter": 2000,
    "calibration_method": "sigmoid",  # Platt scaling via CalibratedClassifierCV
    "cv_folds": 5
}

# Multilingual Model Config
MULTILINGUAL_CONFIG = {
    "model_name": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "batch_size": 64,
    "max_seq_length": 256,
    "classifier": "LogisticRegression",
    "C": 1.0,
    "max_iter": 1000,
    "supported_languages_count": "50+ (pretrained encoder capability)",
    "training_sample_limit": 30000  # Balanced sample for efficient CPU/GPU inference in hackathon setting
}

# Verified Dataset Schemas
RAW_DATASET_SPECS = {
    "emails": {
        "rel_path": os.path.join("email spam", "emails.csv"),
        "type": "text",
        "text_cols": ["text"],
        "label_col": "spam",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: spam threat
        "threat_type": "spam",
        "sep": ","
    },
    "CEAS_08": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "CEAS_08.csv"),
        "type": "text",
        "text_cols": ["subject", "body"],
        "label_col": "label",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: phishing threat
        "threat_type": "phishing",
        "sep": ","
    },
    "Enron": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "Enron.csv"),
        "type": "text",
        "text_cols": ["subject", "body"],
        "label_col": "label",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: spam threat
        "threat_type": "spam",
        "sep": ","
    },
    "Ling": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "Ling.csv"),
        "type": "text",
        "text_cols": ["subject", "body"],
        "label_col": "label",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: spam threat
        "threat_type": "spam",
        "sep": ","
    },
    "Nigerian_Fraud": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "Nigerian_Fraud.csv"),
        "type": "text",
        "text_cols": ["subject", "body"],
        "label_col": "label",
        "label_map": {1: 1},  # 1: fraud/phishing threat
        "threat_type": "phishing",
        "sep": ","
    },
    "phishing_email": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "phishing_email.csv"),
        "type": "text",
        "text_cols": ["text_combined"],
        "label_col": "label",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: phishing threat
        "threat_type": "phishing",
        "sep": ","
    },
    "SpamAssasin": {
        "rel_path": os.path.join("phishing emails", "archive (6)", "SpamAssasin.csv"),
        "type": "text",
        "text_cols": ["subject", "body"],
        "label_col": "label",
        "label_map": {0: 0, 1: 1},  # 0: benign, 1: spam threat
        "threat_type": "spam",
        "sep": ","
    },
    "malware": {
        "rel_path": os.path.join("malware", "malware.csv"),
        "type": "pe_binary_metadata",
        "text_cols": [],
        "label_col": "legitimate",
        "label_map": {0: 1, 1: 0},  # In malware dataset: 0=malware (threat), 1=legitimate (benign)
        "threat_type": "malware",
        "sep": "|"
    }
}
