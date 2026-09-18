"""
Models Package: Classical Baseline and Multilingual Classifier
"""
from .classical import predict, load_classical_model
from .multilingual import predict_multilingual, load_multilingual_model

__all__ = [
    "predict",
    "load_classical_model",
    "predict_multilingual",
    "load_multilingual_model"
]
