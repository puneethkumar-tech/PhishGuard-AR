# 🧠 PhishGuard-AR — ML Model Integration Specification

**Document Version:** 1.0 (Phase 3 Backend Specification)  
**Target Audience:** Person A (ML & Threat Intelligence Engineer) & Person C (Backend Integration)  
**Status:** Interface Implemented & Ready for Artifact Delivery  

---

## 1. Overview & Architecture

The PhishGuard-AR backend integrates with the machine learning model through [`backend/src/services/model_service.py`](file:///c:/Users/punee/Desktop/PhishGuard-AR/backend/src/services/model_service.py).

```
   ┌───────────────────────────────────────────────────────────────┐
   │                      Flask API Endpoint                       │
   │               POST /api/scan (Auth Bearer JWT)                │
   └──────────────────────────────┬────────────────────────────────┘
                                  │ text: str
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                 ModelService (Singleton/Service)              │
   │           - Lazy load on startup or on first request          │
   │           - In-memory runner caching                          │
   │           - Safe validation & schema normalization            │
   └──────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                   ML Teammate Runner Bundle                   │
   │          (PyTorch / ONNX / Scikit-learn / HuggingFace)        │
   │                Artifact Path: Configured via MODEL_PATH       │
   └───────────────────────────────────────────────────────────────┘
```

---

## 2. Interface Contract

### A. Python Protocol (`ModelRunner`)

The ML teammate's model runner must implement a `predict(text: str) -> dict` interface:

```python
from typing import Any, Protocol, runtime_checkable

@runtime_checkable
class ModelRunner(Protocol):
    def predict(self, text: str) -> dict[str, Any]:
        """Execute inference on the raw text and return a prediction dictionary."""
        ...
```

### B. Input Specification

| Parameter | Type | Required | Description |
|---|---|---|---|
| `text` | `str` | Yes | Raw text of email, SMS message, URL content, or prompt to inspect (UTF-8, max 100,000 characters). |

---

## 3. Prediction Output Schema

The model runner must return a dictionary conforming to the `PredictionResult` structure:

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
    "inference_latency_ms": 18.4,
    "confidence_calibrated": false
  }
}
```

### Detailed Field Definitions

| Field | Type | Required | Allowed Values / Examples | Description |
|---|---|---|---|---|
| `verdict` | `str` | **Yes** | `"phishing"`, `"suspicious"`, `"clean"`, `"malicious"`, `"benign"` | High-level threat assessment decision. |
| `threat_type` | `str` | **Yes** | `"phishing"`, `"credential_harvesting"`, `"malware_delivery"`, `"brand_impersonation"`, `"scam"`, `"benign"` | Specific threat category classification. |
| `score` | `float` or `null` | Optional | `0.0` to `1.0` (or raw model logit) | Numerical classification score. |
| `score_type` | `str` | **Yes** | `"confidence"`, `"raw_score"`, `"probability"` | **Strict Semantics Rule**: Do NOT label as `"probability"` unless probability calibration (Platt scaling or isotonic regression) is applied and verified. Use `"confidence"` or `"raw_score"` otherwise. |
| `model_version` | `str` | **Yes** | e.g. `"phishguard-v1.0-distilbert"` | Version tag or model architecture name. |
| `indicators` | `list[str]` | Optional | `["urgent_action", "suspicious_url"]` | List of human-readable indicator tags. |
| `metadata` | `dict` | Optional | e.g. `{"tokens": 12, "explainability": {...}}` | Structured explainability or performance metadata. |

---

## 4. Configuration & Environment Variables

The backend locates and loads the model using standard environment variables:

| Variable | Default (Dev) | Testing | Production | Description |
|---|---|---|---|---|
| `MODEL_PATH` | `""` (disabled) | `None` | Path to artifact file | Relative or absolute path to the model bundle file (e.g. `models/model.pkl` or `models/onnx/`). |
| `MODEL_VERSION` | `"not-loaded"` | `"test-stub-v0"` | e.g. `"phishguard-v1.0"` | Identifies active model release in scan records. |

---

## 5. Artifact Placement & Delivery Options

Person A can deliver the model in any of the following standard formats:

### Option 1: Pickled / Joblib Scikit-Learn Pipeline (`.pkl` / `.joblib`)
- Place file in: `backend/models/phishguard_model.pkl`
- Configure in `.env`: `MODEL_PATH=models/phishguard_model.pkl`

### Option 2: ONNX Runtime Model (`.onnx`)
- Place file in: `backend/models/phishguard_model.onnx`
- Configure in `.env`: `MODEL_PATH=models/phishguard_model.onnx`

### Option 3: PyTorch / HuggingFace Transformers Directory (`.pt` or directory)
- Place directory in: `backend/models/distilbert/`
- Configure in `.env`: `MODEL_PATH=models/distilbert`

> [!IMPORTANT]
> Model artifact files (`*.pkl`, `*.onnx`, `*.pt`, `*.bin`, `*.joblib`) are excluded in `backend/.gitignore` to prevent committing massive binaries to Git.

---

## 6. How to Integrate the Model (Step-by-Step for Person A)

1. **Implement or export the trained model artifact.**
2. **Implement the runner dispatch in `backend/src/services/model_service.py`:**
   In `ModelService._instantiate_runner(self, path: Path) -> ModelRunner`, load the file (e.g., using `joblib.load(path)` or `onnxruntime.InferenceSession(str(path))`) and return an instance implementing `predict(text: str) -> dict`.
3. **Set `MODEL_PATH` in `backend/.env`:**
   ```env
   MODEL_PATH=models/phishguard_model.pkl
   MODEL_VERSION=phishguard-v1.0
   ```
4. **Run the backend tests to verify seamless integration:**
   ```powershell
   .\.venv\Scripts\python.exe -m pytest -v
   ```

---

## 7. Assumptions & Open Questions for the ML Teammate

- [ ] **Model Framework**: What ML framework will be delivered? (e.g. Scikit-learn TF-IDF + Classifier, ONNX Runtime, HuggingFace PyTorch?)
- [ ] **Preprocessing Pipeline**: Is tokenization/vectorization bundled directly within the artifact pipeline object (e.g. `sklearn.pipeline.Pipeline`), or is a separate tokenizer needed?
- [ ] **Multi-class vs Binary**: Does the model output specific `threat_type` categories (e.g., `"credential_harvesting"`), or a binary `"phishing"` vs `"benign"` label?
- [ ] **Score Calibration**: Has temperature scaling or isotonic regression been applied to ensure `score` represents a true calibrated posterior probability? If not, `score_type` will default to `"confidence"`.
- [ ] **Inference Latency Target**: Target p95 latency under 150ms per scan request.
