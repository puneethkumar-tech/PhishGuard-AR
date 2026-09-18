"""ML Model Integration Service for PhishGuard-AR.

This module provides the integration layer between the Flask backend and the
Machine Learning model produced by the ML teammate (Person A).

Strict Project Principles:
- Never fabricates fake predictions, mock confidence scores, or fake metrics.
- Returns clear errors (ModelUnavailableError) when no model is available.
- Loads model artifacts once into memory rather than on every request.
- Supports flexible runners (PyTorch, ONNX, Scikit-learn, HuggingFace pipeline).
"""

from __future__ import annotations

import logging
import math
import os
from pathlib import Path
from typing import Any, Optional, Protocol, TypedDict, runtime_checkable

logger = logging.getLogger(__name__)


class ModelError(Exception):
    """Base exception for all ML model service errors."""


class ModelUnavailableError(ModelError):
    """Raised when no ML model is currently loaded or available."""


class ModelNotFoundError(ModelUnavailableError):
    """Raised when the specified model artifact file or directory does not exist."""


class InvalidModelArtifactError(ModelError):
    """Raised when the model artifact file is corrupted or fails to initialize."""


class PredictionResult(TypedDict, total=False):
    """Structured dictionary schema for threat prediction outputs.

    Attributes:
        verdict: High-level classification, e.g. "phishing", "suspicious", "clean", "benign".
        threat_type: Category of threat, e.g. "phishing", "credential_harvesting", "malware_delivery", "benign".
        score: Raw classification confidence or probability score (float between 0.0 and 1.0 or raw logit).
        score_type: Clarifies score semantics ("confidence", "raw_score", "probability").
                    NOTE: Must only be "probability" if the model output is properly calibrated.
        model_version: Identifier/tag of the model used for inference.
        indicators: Key linguistic or structural markers detected in the text.
        metadata: Optional dictionary with additional inference metadata / explainability tokens.
    """

    verdict: str
    threat_type: str
    score: Optional[float]
    score_type: str
    model_version: str
    indicators: list[str]
    metadata: dict[str, Any]


@runtime_checkable
class ModelRunner(Protocol):
    """Protocol for ML inference runners provided by Person A."""

    def predict(self, text: str) -> dict[str, Any] | PredictionResult:
        """Execute inference on the raw text and return a prediction dictionary."""
        ...


class ModelService:
    """Service wrapper managing model lifecycle and inference execution.

    Designed for safe lifecycle management:
    - Lazy loading on demand or explicit load on app initialization.
    - Caches loaded runner in-memory (never re-loads per request).
    - Refuses to fabricate predictions when no model is available.
    """

    def __init__(
        self,
        model_path: str | Path | None = None,
        model_version: str = "not-loaded",
    ) -> None:
        self._model_path: Optional[Path] = Path(model_path) if model_path else None
        self._model_version: str = model_version
        self._runner: Optional[ModelRunner] = None

    @property
    def is_loaded(self) -> bool:
        """Indicate whether an inference runner is loaded and ready."""
        return self._runner is not None

    @property
    def model_version(self) -> str:
        """Return the current active model version string."""
        return self._model_version

    @property
    def model_path(self) -> Optional[Path]:
        """Return the configured model artifact path."""
        return self._model_path

    def set_runner(self, runner: ModelRunner, version: str = "custom-runner") -> None:
        """Attach an initialized runner directly (used for tests or programmatic injection)."""
        self._runner = runner
        self._model_version = version

    def unload(self) -> None:
        """Unload the active model from memory."""
        self._runner = None
        self._model_version = "not-loaded"

    def load(
        self,
        model_path: str | Path | None = None,
        model_version: str | None = None,
    ) -> None:
        """Load the ML model artifact from disk into memory.

        Args:
            model_path: Path to model file/directory. If None, checks configured path or env.
            model_version: Optional version identifier.

        Raises:
            ModelUnavailableError: If no path is provided and none is configured.
            ModelNotFoundError: If the path does not exist on disk.
            InvalidModelArtifactError: If loading fails due to corrupted/unsupported artifact.
        """
        # Resolve target path
        target_path_str = model_path or (
            str(self._model_path) if self._model_path else os.getenv("MODEL_PATH", "")
        )

        if not target_path_str:
            raise ModelUnavailableError(
                "ML model is not available. Wait for Person A's model bundle."
            )

        resolved_path = Path(target_path_str).resolve()
        if not resolved_path.exists():
            raise ModelNotFoundError(
                f"Model artifact not found at '{resolved_path}'. "
                "Ensure Person A's model bundle is placed in the designated models directory."
            )

        # Update configured path
        self._model_path = resolved_path
        if model_version:
            self._model_version = model_version
        elif self._model_version == "not-loaded":
            self._model_version = os.getenv("MODEL_VERSION", resolved_path.stem)

        try:
            # Person A model loader entry point:
            # Here we provide standard dispatch for common Python ML model formats (.pkl, .joblib, .pt, .onnx, dir)
            logger.info("Loading model artifact from %s", resolved_path)
            self._runner = self._instantiate_runner(resolved_path)
            logger.info("Model loaded successfully (version: %s)", self._model_version)
        except ModelUnavailableError:
            self._runner = None
            raise
        except Exception as exc:
            self._runner = None
            raise InvalidModelArtifactError(
                f"Failed to load model artifact from '{resolved_path}': {exc}"
            ) from exc

    def _instantiate_runner(self, path: Path) -> ModelRunner:
        """Instantiate an inference runner for a verified artifact on disk.

        This loader will be completed when Person A delivers the trained model artifact.
        """
        # Placeholder for teammate artifact loading:
        # If Person A delivers a specific loader script or class, dispatch it here.
        raise ModelUnavailableError(
            "ML model is not available. Wait for Person A's model bundle."
        )

    def predict(self, text: str) -> PredictionResult:
        """Run phishing threat detection inference on input text.

        Args:
            text: Raw email, message, or URL text to analyze.

        Returns:
            PredictionResult conforming to the structured prediction schema.

        Raises:
            ModelUnavailableError: If no model is loaded.
            ModelError: If model prediction fails or returns invalid schema.
        """
        if not self.is_loaded:
            self.load()

        if self._runner is None:
            raise ModelUnavailableError(
                "ML model is not available. Wait for Person A's model bundle."
            )

        try:
            raw_output = self._runner.predict(text)
        except Exception as exc:
            raise ModelError(f"Model inference failed: {exc}") from exc

        return self._normalize_prediction(raw_output)

    def _normalize_prediction(self, raw: dict[str, Any] | PredictionResult) -> PredictionResult:
        """Validate and normalize raw model runner outputs into the standard schema."""
        if not isinstance(raw, dict):
            raise ModelError(f"Model returned invalid output type: {type(raw).__name__} (expected dict)")

        verdict = raw.get("verdict")
        threat_type = raw.get("threat_type")

        if not verdict or not threat_type or not str(verdict).strip() or not str(threat_type).strip():
            raise ModelError(
                f"Model output missing required fields ('verdict', 'threat_type'). Got: {list(raw.keys())}"
            )

        verdict_str = str(verdict).strip().lower()
        threat_type_str = str(threat_type).strip().lower()

        score = raw.get("score")
        if score is not None:
            try:
                score = float(score)
                if not math.isfinite(score):
                    score = None
            except (ValueError, TypeError):
                score = None

        raw_score_type = str(raw.get("score_type", "confidence")).strip().lower()
        if raw_score_type not in ("confidence", "probability", "raw_score"):
            score_type = "confidence"
        else:
            score_type = raw_score_type

        if score is not None and score_type in ("confidence", "probability"):
            if score < 0.0 or score > 1.0:
                score_type = "raw_score"

        raw_version = raw.get("model_version")
        version_str = str(raw_version).strip() if raw_version and str(raw_version).strip() else self._model_version

        result: PredictionResult = {
            "verdict": verdict_str,
            "threat_type": threat_type_str,
            "score": score,
            "score_type": score_type,
            "model_version": version_str,
        }

        if "indicators" in raw and isinstance(raw["indicators"], list):
            result["indicators"] = [
                str(i).strip() for i in raw["indicators"] if str(i).strip()
            ]

        if "metadata" in raw and isinstance(raw["metadata"], dict):
            result["metadata"] = raw["metadata"]

        return result
