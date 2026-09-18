class ModelUnavailableError(RuntimeError):
    """Raised when the ML model artifact is not available yet."""

class ModelService:
    """Service wrapper for ML inference.

    Strictly adheres to project rules:
    - Never fabricates fake predictions or confidence scores.
    - Raises ModelUnavailableError until Person A provides the trained artifact.
    """
    def __init__(self):
        self.model = None
        self.model_version = "not-loaded"

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def load(self):
        # Person A will provide the real model bundle.
        # Keep this explicit; never fabricate a prediction.
        raise ModelUnavailableError(
            "ML model is not available. Wait for Person A's model bundle."
        )

    def predict(self, text: str) -> dict:
        if not self.is_loaded:
            self.load()
        return self.model.predict(text)
