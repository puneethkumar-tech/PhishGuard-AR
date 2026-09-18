# 🤖 PhishGuard-AR — ML Engineer Handoff Checklist & Integration Guide

**Document Version:** 1.0  
**Target:** Person A (ML & Threat Intelligence Engineer)  
**Author:** Person C (Backend, Auth & Integration Engineer)  
**Branch:** `backend`  
**Repository:** `PhishGuard-AR`

---

## 📋 Executive Overview

The backend integration layer is fully implemented, verified with automated tests, and waiting for your machine learning model artifact. This guide outlines everything you need to package, configure, and verify your model with the Flask backend.

---

## 1. 📦 Required Artifact Format & Placement

You can provide your model artifact in any of the following standard formats:

| Format | Artifact Placement | Example Artifact File | Recommended Usage |
|---|---|---|---|
| **Scikit-learn / Joblib** | `backend/models/` | `backend/models/phishguard_pipeline.joblib` | TF-IDF + LogisticRegression / SGD / LightGBM |
| **ONNX Model** | `backend/models/` | `backend/models/phishguard_model.onnx` | Quantized transformer / fast CPU inference |
| **PyTorch / Transformers** | `backend/models/<dir>/` | `backend/models/distilbert_phishing/` | HuggingFace pretrained directory with config |
| **Pickle (.pkl)** | `backend/models/` | `backend/models/phishguard_model.pkl` | Standard Python ML object |

> [!IMPORTANT]
> The directory `backend/models/` is already created and ignored in `backend/.gitignore` (matching `*.pkl`, `*.joblib`, `*.onnx`, `*.pt`, `*.bin`). Large binary weights will never be accidentally committed to Git.

---

## 2. ⚙️ Configuration (`MODEL_PATH` & `MODEL_VERSION`)

Set the model path in your `backend/.env` file:

```env
# Path to your model artifact (relative to backend/ or absolute)
MODEL_PATH=models/phishguard_pipeline.joblib

# Release identifier for tracking model provenance in scan records
MODEL_VERSION=phishguard-distilbert-v1.0
```

---

## 3. 🔌 Runner `predict()` Interface Contract

Your inference runner must implement a single Python method:

```python
from typing import Any, Protocol, runtime_checkable

@runtime_checkable
class ModelRunner(Protocol):
    def predict(self, text: str) -> dict[str, Any]:
        """Execute threat detection on raw input text and return structured predictions."""
        ...
```

### Input Specification
- **Parameter:** `text: str`
- **Format:** Raw string (email body, SMS message, URL content, HTML text snippet).
- **Constraints:** Max 100,000 UTF-8 characters (enforced by backend validation before calling `predict`).

---

## 4. 📊 Expected Output Schema

Your `predict()` method must return a dictionary conforming to this schema:

```json
{
  "verdict": "phishing",
  "threat_type": "credential_harvesting",
  "score": 0.945,
  "score_type": "confidence",
  "model_version": "phishguard-distilbert-v1.0",
  "indicators": [
    "urgent_call_to_action",
    "suspicious_subdomain",
    "credential_harvesting_form"
  ],
  "metadata": {
    "tokens_analyzed": 42,
    "inference_latency_ms": 18.4
  }
}
```

### Field Definitions

| Field | Type | Required | Allowed / Standard Values | Description |
|---|---|---|---|---|
| `verdict` | `str` | **Yes** | `"phishing"`, `"suspicious"`, `"clean"`, `"malicious"`, `"benign"`, `"spam"` | High-level binary or multi-class verdict (casing is automatically normalized). |
| `threat_type` | `str` | **Yes** | `"phishing"`, `"credential_harvesting"`, `"malware_delivery"`, `"brand_impersonation"`, `"scam"`, `"spam"`, `"benign"`, `"unknown"` | Detailed threat classification category. |
| `score` | `float` or `None` | Optional | `0.0` to `1.0` (or raw numeric logit) | Prediction score. `NaN` and `Infinity` are automatically sanitized to `None`. |
| `score_type` | `str` | **Yes** | `"confidence"`, `"raw_score"`, `"probability"` | Semantics tag for the numerical score (see Section 6). |
| `model_version` | `str` | Optional | e.g. `"distilbert-phish-v1"` | Model version tag (falls back to configured `MODEL_VERSION` if omitted). |
| `indicators` | `list[str]` | Optional | e.g. `["urgent_action", "fake_url"]` | List of explainability indicators/markers detected in the input. |
| `metadata` | `dict` | Optional | e.g. `{"latency_ms": 12.5}` | Optional diagnostic or explainability metadata dictionary. |

---

## 5. 🏷️ Label Mapping Requirements

If your model produces numeric class IDs (e.g. `0` for benign, `1` for phishing), map them inside your runner before returning:

```python
# Example Label Mapping inside runner
CLASS_MAP = {
    0: {"verdict": "clean", "threat_type": "benign"},
    1: {"verdict": "phishing", "threat_type": "credential_harvesting"},
    2: {"verdict": "suspicious", "threat_type": "scam"},
}
```

---

## 6. 🎯 Score Semantics Guide

| `score_type` | When to Use | Rules & Validation |
|---|---|---|
| `"probability"` | **Only when verified calibrated.** | Must represent a calibrated posterior probability $P(\text{threat} \mid \text{text}) \in [0.0, 1.0]$. Use only if Platt scaling, Isotonic Regression, or temperature scaling was validated on a test set. |
| `"confidence"` | **Standard uncalibrated output.** | Default choice for softmax probabilities, normalized heuristic scores, or sigmoid outputs that have not undergone empirical calibration. |
| `"raw_score"` | **Unbounded logits or margins.** | Used for SVM decision function margins, raw unnormalized transformer logits, or scores outside $[0.0, 1.0]$. (Any score $< 0.0$ or $> 1.0$ is automatically converted to `"raw_score"` by the backend). |

---

## 7. 🧹 Preprocessing Responsibilities

The model runner / artifact pipeline is responsible for:
1. **Vectorization / Tokenization:**
   - For Scikit-learn: Package vectorizers inside an `sklearn.pipeline.Pipeline` or `ColumnTransformer`.
   - For HuggingFace / PyTorch: Load the tokenizer from the artifact directory and handle batch encoding.
2. **Feature Extraction:**
   - URL parsing, domain extraction, or regex-based indicator tagging should be computed inside the runner or preprocessing pipeline.
3. **Thread Safety:**
   - The runner instance is cached in memory and shared across incoming requests in the same worker process. Ensure `predict()` does not mutate shared state.

---

## 8. 🧪 Step-by-Step Testing & Verification Procedure

Once you place your model in `backend/models/`:

1. **Configure `.env` in `backend/`:**
   ```env
   MODEL_PATH=models/phishguard_pipeline.joblib
   MODEL_VERSION=phishguard-v1.0
   ```

2. **Dispatch Runner in [`backend/src/services/model_service.py`](file:///c:/Users/punee/Desktop/PhishGuard-AR/backend/src/services/model_service.py):**
   Implement `_instantiate_runner(self, path: Path) -> ModelRunner`:
   ```python
   def _instantiate_runner(self, path: Path) -> ModelRunner:
       import joblib
       loaded_obj = joblib.load(path)
       # return your custom wrapper or loaded pipeline implementing predict(text)
       return loaded_obj
   ```

3. **Run the Backend Test Suite:**
   ```powershell
   cd backend
   .\.venv\Scripts\python.exe -m pytest -v
   ```

4. **Verify Live Health & Readiness Probes:**
   - `GET /health` -> `200 OK` (Liveness)
   - `GET /ready` -> `200 OK` with `"model": "loaded"` and `"model_version": "phishguard-v1.0"` (Readiness)

5. **Test Live Threat Scan:**
   ```powershell
   # Submit a scan with your JWT token
   curl -X POST http://localhost:5000/api/scan `
     -H "Content-Type: application/json" `
     -H "Authorization: Bearer <TOKEN>" `
     -d '{"text": "Urgent: Your bank account is locked. Click http://secure-verify.phish.com to restore access."}'
   ```

---

## 9. ⚠️ Known Edge Cases Handled Automatically by Backend

- **Unloaded / Missing Model:** Returns `503 Service Unavailable: model_unavailable` without crashing or returning fake data.
- **NaN / Infinity Scores:** Replaced with `null` in JSON output to prevent client JSON parser crashes.
- **Out-of-Bounds Scores:** Automatically demoted to `score_type: "raw_score"`.
- **Casing & Whitespace:** `" PHISHING "` automatically normalized to `"phishing"`.
- **Internal Error Masking:** Model runtime errors or corrupt files log full diagnostic stack traces to server logs while returning generic error messages to avoid leaking filesystem paths or secrets.
- **Payload Limits:** Inputs larger than 100,000 characters receive `413 Payload Too Large`.
