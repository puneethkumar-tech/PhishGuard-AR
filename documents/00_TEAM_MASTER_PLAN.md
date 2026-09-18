# 🛡️ PhishGuard-AR — Team Master Plan

**Hackathon:** CodeCortex 3.0  
**Track:** Security  
**Duration:** 30 hours  
**Goal:** Build a demonstrable multilingual threat detector, deliberately attack it, harden it, explain its decisions, and present measurable results.

## 1. Team responsibilities

| Member | Role | Owns | Main handoff |
|---|---|---|---|
| Person A | ML/Data Engineer | Dataset inspection, preprocessing, baseline model, multilingual experiment, explainability support | Trained model bundle, clean train/test data, evaluation results |
| Person B | Adversarial Security Engineer | Attack functions, attack runner, hardening experiments, robustness metrics, MITRE mapping | Attack results, hardened model, security mapping |
| Person C | Backend & Integration Engineer | Flask API, authentication, database, scan/report endpoints, service integration | Stable API contract for the frontend |
| Person D | Frontend, Alerts & Pitch Engineer | Streamlit interface, user workflow, alert adapters, dashboard, demo and slides | Working end-to-end demo and presentation assets |

## 2. What must be built first

### Minimum viable demo (non-negotiable)

1. User pastes a message or email.
2. System returns a threat verdict: `phishing`, `spam`, or `safe`.
3. The same input is transformed by at least one reproducible attack.
4. The team measures clean versus attacked performance.
5. The hardened pipeline is evaluated on the same test cases.
6. The UI shows the original, attacked, and hardened results.
7. The system displays evidence/highlighted features with a clear disclaimer that highlights are model evidence, not proof of malicious intent.
8. The team presents a real measured chart. No placeholder or invented metrics.

### Stretch features (only after the MVP works)

- Multilingual embedding model
- Gmail OAuth monitoring
- SMS/WhatsApp alerts
- OTP-gated report download
- PDF analyst report
- Character/word ensemble
- LLM paraphrase attack
- Voice notification

## 3. Judging criteria coverage

| Criterion | Concrete proof to show | Primary owners |
|---|---|---|
| **Wow Factor** | “We attacked our own detector” live flow; multilingual sample; alert demonstration if reliable | A + B + D |
| **Build Quality** | Reproducible scripts, tests, clean API boundaries, source-aware metrics, no hardcoded secrets | A + B + C |
| **User Love** | Clear scan result, readable risk explanation, side-by-side comparison, simple interaction | C + D |
| **Real-World Ready** | Input normalization, rate limiting, authentication, audit trail, documented limitations, modular alert adapters | B + C + D |
| **Pitch Power** | Problem → baseline weakness → attack → hardening → measured recovery → user action | All |

## 4. Architecture and ownership

```text
User / Demo UI
      |
      v
Backend API (Person C)
      |
      +--> Input validation + normalization
      |
      +--> Model service (Person A)
      |       |
      |       +--> Threat prediction
      |       +--> language detection
      |       +--> evidence/highlights
      |
      +--> Security service (Person B)
      |       |
      |       +--> adversarial transformations
      |       +--> robustness evaluation
      |       +--> MITRE mapping where justified
      |
      +--> Alert/report adapters (Person D)
      |
      v
Database + results + dashboard
```

## 5. Shared contracts

### Model bundle contract

Person A must document the exact object saved in `models/`. Prefer a versioned bundle:

```python
{
    "model": trained_pipeline,
    "preprocess_version": "v1",
    "label_mapping": {0: "safe", 1: "threat"},
    "threat_scope": ["phishing", "spam"],
    "training_sources": [...],
    "metrics": {...}
}
```

Do not claim calibrated probability unless calibration was actually performed. If using a LinearSVC decision function, call it a **decision score**, not a probability.

### Prediction response contract

Person C and D should use one stable response shape:

```json
{
  "request_id": "uuid",
  "verdict": "phishing",
  "threat_type": "phishing",
  "score": 0.91,
  "score_type": "calibrated_probability",
  "language": "en",
  "severity": "high",
  "highlights": ["verify", "account", "click"],
  "mitre": [
    {"id": "T1566", "name": "Phishing", "confidence": "rule_based"}
  ],
  "recommendation": "Do not click links. Verify through an official channel.",
  "model_version": "baseline-v1"
}
```

The API must be allowed to return `score_type: "decision_score"` when probability calibration is unavailable.

## 6. Shared folder rules

```text
data/raw/          Original datasets; do not commit large/private files
data/processed/    Cleaned and split datasets
models/            Model artifacts; document how they were generated
results/           CSV metrics, charts, experiment logs
src/               Reusable application code
tests/             Automated tests
app/               Streamlit or frontend code
docs/              Design decisions and demo instructions
```

- Never commit `.env`, API keys, `credentials.json`, `token.json`, or private phone numbers.
- Use fixed random seeds for experiments.
- Every chart must identify its dataset split and attack configuration.
- Do not use placeholder hardened values in the final demo.
- If a dataset is incompatible, document it instead of forcing it into the text classifier.
- Malware metadata may need a separate signal/head; do not silently merge non-text malware features with email text.

## 7. Checkpoints

| Time | Required result |
|---|---|
| Hour 2 | All laptops cloned, virtual environments active, branches created |
| Hour 5 | Dataset schema report and working API skeleton |
| Hour 9 | Baseline model + login/API smoke test |
| Hour 16 | At least one attack evaluated with clean/attacked metrics |
| Hour 20 | Hardened approach evaluated on the same test set |
| Hour 24 | End-to-end UI flow working |
| Hour 27 | Slides, demo script, backup recording, security review |
| Hour 29 | Submission package and buffer |

## 8. Team communication

Every hour, each member reports:

```text
DONE:
BLOCKED:
NEED FROM:
NEXT 60 MINUTES:
```

If blocked for more than 20 minutes, ask the team immediately. Freeze new features after Hour 24; focus on testing, polish, and presentation.

## 9. Final demo story

1. Show a normal suspicious message.
2. Show the baseline prediction.
3. Apply an attack transformation.
4. Show whether the baseline changed—and report the actual result honestly.
5. Apply the hardening pipeline.
6. Show the hardened result and measured comparison.
7. Explain the evidence and recommended user action.
8. Trigger an alert only if the integration has been tested and consent/sandbox constraints are satisfied.

**One-line pitch:**

> We do not only test whether a threat detector works—we deliberately try to break it, measure the weakness, harden the pipeline, and explain the result.
