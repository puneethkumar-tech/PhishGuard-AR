class ModelUnavailableError(RuntimeError):
    """Raised when the ML model artifact is not available yet."""

class ModelService:
    def __init__(self):
        self.model = None
        self.model_version = "not-loaded"

    def load(self):
        # Person A will provide the real model bundle.
        # Keep this explicit; never fabricate a prediction.
        raise ModelUnavailableError(
            "ML model is not available. Wait for Person A's model bundle."
        )

    def predict(self, text: str) -> dict:
        if self.model is None:
            self.load()
        return self.model.predict(text)
