"""
Tests for Data Pipeline, Deduplication, and Leakage Prevention
"""
import pytest
import pandas as pd
from pathlib import Path
from config import PROCESSED_DATA_DIR, RAW_DATASET_SPECS, DATASETS_RAW_DIR


def test_processed_files_exist():
    merged_path = PROCESSED_DATA_DIR / "merged.csv"
    train_path = PROCESSED_DATA_DIR / "train.csv"
    test_path = PROCESSED_DATA_DIR / "test.csv"
    
    assert merged_path.exists(), "merged.csv does not exist"
    assert train_path.exists(), "train.csv does not exist"
    assert test_path.exists(), "test.csv does not exist"


def test_zero_leakage_between_train_and_test():
    train_df = pd.read_csv(PROCESSED_DATA_DIR / "train.csv")
    test_df = pd.read_csv(PROCESSED_DATA_DIR / "test.csv")
    
    train_texts = set(train_df["text"].dropna())
    test_texts = set(test_df["text"].dropna())
    
    overlap = train_texts.intersection(test_texts)
    assert len(overlap) == 0, f"Data leakage detected! Found {len(overlap)} identical texts in train and test splits."


def test_label_validity():
    train_df = pd.read_csv(PROCESSED_DATA_DIR / "train.csv")
    test_df = pd.read_csv(PROCESSED_DATA_DIR / "test.csv")
    
    assert set(train_df["label"].unique()).issubset({0, 1})
    assert set(test_df["label"].unique()).issubset({0, 1})
    assert train_df["label"].isnull().sum() == 0
    assert test_df["label"].isnull().sum() == 0


def test_source_representation():
    train_df = pd.read_csv(PROCESSED_DATA_DIR / "train.csv")
    test_df = pd.read_csv(PROCESSED_DATA_DIR / "test.csv")
    
    expected_sources = {"CEAS_08", "Enron", "Ling", "Nigerian_Fraud", "SpamAssasin", "emails", "phishing_email"}
    assert set(train_df["source"].unique()) == expected_sources
    assert set(test_df["source"].unique()) == expected_sources
