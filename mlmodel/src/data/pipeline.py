"""
PhishGuard-AR Data Pipeline: Schema Normalization, Deduplication, and Stratified Splitting
"""
import os
import sys
import logging
import pandas as pd
import numpy as np
from pathlib import Path
from tqdm import tqdm
from sklearn.model_selection import train_test_split

# Add parent directory to sys.path to allow running as script or module
current_dir = Path(__file__).resolve().parent
mlmodel_dir = current_dir.parent.parent
if str(mlmodel_dir) not in sys.path:
    sys.path.insert(0, str(mlmodel_dir))

from config import (
    DATASETS_RAW_DIR,
    PROCESSED_DATA_DIR,
    RAW_DATASET_SPECS,
    RANDOM_SEED,
    TEST_SPLIT_RATIO,
    MIN_TEXT_LENGTH
)
from src.data.preprocess import clean_text
from src.data.language import detect_language

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def load_and_normalize_dataset(name: str, spec: dict) -> pd.DataFrame:
    """
    Loads a raw dataset, verifies its schema, applies verified label mappings,
    and returns a standardized DataFrame.
    """
    file_path = DATASETS_RAW_DIR / spec["rel_path"]
    logger.info(f"Loading {name} from {file_path}...")
    
    if not file_path.exists():
        raise FileNotFoundError(f"Authoritative dataset not found: {file_path}")
        
    sep = spec.get("sep", ",")
    df_raw = pd.read_csv(file_path, sep=sep, low_memory=False)
    logger.info(f"Raw {name}: {len(df_raw):,} rows, columns={list(df_raw.columns)}")
    
    # Handle PE malware metadata separately
    if spec["type"] == "pe_binary_metadata":
        logger.info(f"[PE MALWARE DATASET] {name} is a 57-feature PE binary executable table.")
        logger.info(f"[PE MALWARE DATASET] Kept separate from text email NLP pipeline.")
        return pd.DataFrame()
        
    # Text datasets
    text_cols = spec["text_cols"]
    label_col = spec["label_col"]
    label_map = spec["label_map"]
    threat_type_threat = spec["threat_type"]
    
    # Verify label column exists
    if label_col not in df_raw.columns:
        raise ValueError(f"Expected label column '{label_col}' missing in {name}. Found: {df_raw.columns.tolist()}")
    
    # Extract combined text
    if len(text_cols) == 1:
        col = text_cols[0]
        if col not in df_raw.columns:
            raise ValueError(f"Expected text column '{col}' missing in {name}")
        raw_texts = df_raw[col].fillna("").astype(str)
    elif len(text_cols) == 2:
        # e.g., subject and body
        subj_col, body_col = text_cols
        subj = df_raw[subj_col].fillna("").astype(str) if subj_col in df_raw.columns else ""
        body = df_raw[body_col].fillna("").astype(str) if body_col in df_raw.columns else ""
        raw_texts = subj.apply(lambda s: f"Subject: {s}\n" if s.strip() else "") + body
    else:
        raise ValueError(f"Unsupported text cols configuration: {text_cols}")
        
    # Map and validate labels
    raw_labels = df_raw[label_col]
    normalized_labels = []
    for val in raw_labels:
        # Check label mapping
        if pd.isna(val):
            normalized_labels.append(None)
        elif val in label_map:
            normalized_labels.append(label_map[val])
        elif str(val).strip().isdigit() and int(val) in label_map:
            normalized_labels.append(label_map[int(val)])
        else:
            raise ValueError(f"Ambiguous/unrecognized label '{val}' in {name}. Known map: {label_map}")
            
    df_clean = pd.DataFrame({
        "raw_text": raw_texts,
        "label": normalized_labels,
        "source": name
    })
    
    # Drop missing labels
    df_clean = df_clean.dropna(subset=["label"])
    df_clean["label"] = df_clean["label"].astype(int)
    
    # Preprocess text (Unicode-safe NFKC, whitespace normalize)
    df_clean["text"] = df_clean["raw_text"].apply(lambda t: clean_text(t, replace_urls=False, replace_emails=False))
    
    # Filter short / empty texts
    df_clean = df_clean[df_clean["text"].str.len() >= MIN_TEXT_LENGTH].copy()
    
    # Assign threat_type: 'benign' if label==0 else 'phishing'/'spam'
    df_clean["threat_type"] = df_clean["label"].apply(
        lambda lbl: "benign" if lbl == 0 else threat_type_threat
    )
    
    # Select standardized columns
    result = df_clean[["text", "label", "source", "threat_type"]].reset_index(drop=True)
    logger.info(f"Normalized {name}: {len(result):,} valid rows (Labels: {result['label'].value_counts().to_dict()})")
    return result


def build_pipeline() -> tuple:
    """
    Executes the full data pipeline across all authoritative datasets.
    """
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    dfs = []
    for name, spec in RAW_DATASET_SPECS.items():
        df_norm = load_and_normalize_dataset(name, spec)
        if len(df_norm) > 0:
            dfs.append(df_norm)
            
    # Combine all text datasets
    combined_df = pd.concat(dfs, ignore_index=True)
    total_raw_rows = len(combined_df)
    logger.info(f"Total merged records before deduplication: {total_raw_rows:,}")
    
    # Exact text deduplication across all sources to eliminate cross-corpus leakage
    # Keep first occurrence
    combined_df = combined_df.drop_duplicates(subset=["text"]).reset_index(drop=True)
    dedup_rows = len(combined_df)
    logger.info(f"Records after exact text deduplication: {dedup_rows:,} (Removed {total_raw_rows - dedup_rows:,} duplicates)")
    
    # Language detection
    logger.info("Performing language identification across deduplicated records...")
    tqdm.pandas(desc="Detecting language")
    combined_df["language"] = combined_df["text"].progress_apply(detect_language)
    
    logger.info(f"Language distribution (top 10):\n{combined_df['language'].value_counts().head(10)}")
    
    # Save merged dataset
    merged_path = PROCESSED_DATA_DIR / "merged.csv"
    combined_df.to_csv(merged_path, index=False, encoding="utf-8")
    logger.info(f"Saved merged dataset to {merged_path}")
    
    # Stratified Train/Test Split
    # Strategy: Stratify by a composite key (source + '_' + label) where count >= 2, else stratify by label
    combined_df["strat_key"] = combined_df["source"] + "_" + combined_df["label"].astype(str)
    strat_counts = combined_df["strat_key"].value_counts()
    
    # If any strat_key has < 2 samples, fallback to label stratification for those
    valid_strat_keys = strat_counts[strat_counts >= 2].index
    strat_col = combined_df["strat_key"].where(combined_df["strat_key"].isin(valid_strat_keys), combined_df["label"].astype(str))
    
    train_df, test_df = train_test_split(
        combined_df,
        test_size=TEST_SPLIT_RATIO,
        random_state=RANDOM_SEED,
        stratify=strat_col
    )
    
    # Drop helper column
    train_df = train_df.drop(columns=["strat_key"]).reset_index(drop=True)
    test_df = test_df.drop(columns=["strat_key"]).reset_index(drop=True)
    
    # Verify zero text overlap between train and test
    train_texts = set(train_df["text"])
    test_texts = set(test_df["text"])
    overlap = train_texts.intersection(test_texts)
    if len(overlap) > 0:
        raise RuntimeError(f"CRITICAL: Found {len(overlap)} overlapping texts between train and test set!")
        
    logger.info("Zero-leakage verification PASSED: 0 overlapping texts between train and test.")
    logger.info(f"Train set: {len(train_df):,} rows (Labels: {train_df['label'].value_counts().to_dict()})")
    logger.info(f"Test set:  {len(test_df):,} rows (Labels: {test_df['label'].value_counts().to_dict()})")
    
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    train_df.to_csv(train_path, index=False, encoding="utf-8")
    test_df.to_csv(test_path, index=False, encoding="utf-8")
    
    logger.info(f"Saved train dataset to {train_path}")
    logger.info(f"Saved test dataset to {test_path}")
    
    return train_df, test_df


if __name__ == "__main__":
    build_pipeline()
