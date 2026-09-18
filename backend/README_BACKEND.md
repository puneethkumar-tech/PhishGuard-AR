# 🛡️ PhishGuard-AR — Backend Service

The API, authentication, database persistence, and model integration service for the PhishGuard-AR cyber threat detection platform.

---

## 📋 Architecture & Directory Structure

```text
backend/
├── .env.example              # Environment variables template
├── .gitignore                # Comprehensive ignore rules for env, db, and model artifacts
├── pytest.ini                # Pytest configuration (pythonpath = .)
├── requirements.txt          # Minimal production & testing dependencies
├── README_BACKEND.md         # This execution guide
├── docs/
│   ├── API_CONTRACT.md       # Complete endpoint specifications
│   ├── BACKEND_STATUS.md     # Audit report and architectural status
│   └── MODEL_INTEGRATION.md  # ML teammate model integration specification
├── src/
│   ├── __init__.py
│   ├── app.py                # Flask application factory (create_app)
│   ├── config.py             # Config classes (Development, Testing, Production)
│   ├── extensions.py         # SQLAlchemy, Bcrypt, JWTManager singletons
│   ├── models.py             # User and Scan ORM models with serialization
│   ├── api/
│   │   ├── auth.py           # Register, login, and refresh endpoints
│   │   ├── health.py         # /health endpoint
│   │   └── scans.py          # /api/scan, /api/scans, /api/scans/<id>
│   └── services/
│       ├── model_service.py  # Model inference wrapper (refuses unbacked predictions)
│       └── scan_service.py   # Scan persistence and querying queries
└── tests/
    ├── conftest.py           # Shared test fixtures (in-memory SQLite, auth client)
    ├── test_auth.py          # Registration, login, validation, and token refresh tests
    ├── test_config.py        # Config environments & production validation tests
    ├── test_health.py        # Health status, security headers & CORS tests
    ├── test_model_service.py # ModelService lifecycle, mock runner & validation tests
    └── test_scans.py         # Scan endpoints, model unavailable 503, history tests
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10 or higher
- PowerShell (Windows) or Bash (macOS / Linux)

### 2. Environment Setup

**Windows (PowerShell):**
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create local environment configuration
Copy-Item .env.example .env
```

**macOS / Linux (Bash):**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

---

## ⚙️ Environment Variables

Configure `.env` as needed:

| Variable | Default | Purpose |
|---|---|---|
| `FLASK_ENV` | `development` | Environment mode (`development`, `testing`, `production`) |
| `SECRET_KEY` | `dev-insecure-secret...` | Flask session secret (must be set to a secure string in production) |
| `JWT_SECRET_KEY` | `dev-insecure-jwt...` | JWT signing secret (must be set to a secure string in production) |
| `DATABASE_URL` | `sqlite:///phishguard.db` | SQLAlchemy database connection URI |
| `MODEL_PATH` | `""` | Path to ML model bundle/artifact (e.g. `models/phishguard_model.pkl`) |
| `MODEL_VERSION` | `"not-loaded"` | Version identifier for the active ML model |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173` | Allowed frontend domains (comma-separated allowlist) |
| `JWT_ACCESS_TOKEN_EXPIRES` | `900` | Access token lifespan in seconds (15 minutes) |
| `JWT_REFRESH_TOKEN_EXPIRES` | `604800` | Refresh token lifespan in seconds (7 days) |

> [!IMPORTANT]
> In `production` mode (`FLASK_ENV=production`), the application validates that `SECRET_KEY` and `JWT_SECRET_KEY` are explicitly provided and at least 24 characters long. It will fail fast on startup if default or insecure secrets are detected.

---

## 🧪 Running the Tests

The test suite runs entirely in-memory (`sqlite:///:memory:`) using isolated fixtures:

```powershell
pytest -v
```

All 36 automated unit and integration tests run across:
- `tests/test_auth.py`: Registration, duplicate detection, password length validation, login, and token refresh.
- `tests/test_config.py`: Environment classes and production secret validation.
- `tests/test_health.py`: Health check, defensive headers (`X-Content-Type-Options`, `X-Frame-Options`), and CORS allowlist enforcement.
- `tests/test_model_service.py`: ModelService initialization, lazy-loading, missing model path handling, PredictionResult schema normalization, and mock runner execution.
- `tests/test_scans.py`: Authorization enforcement, payload limits (100k chars), honest 503 `model_unavailable` handling, scan history listing, and record ownership isolation.

---

## 🏃 Running the Development Server

```powershell
flask --app src.app run --port 5000
```

Verify service health:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/health"
```
Output:
```json
{
  "service": "phishguard-api",
  "status": "ok"
}
```

---

## 🔒 Security Principles

1. **No Fake Metrics**: The threat scanning endpoint will safely respond with `503 Service Unavailable: model_unavailable` until the ML Engineer (Person A) delivers the trained model artifacts.
2. **CORS Allowlist**: Cross-Origin requests are checked against `CORS_ALLOWED_ORIGINS` to protect APIs from unauthorized browser domains.
3. **Defense in Depth**: Password hashes use Bcrypt; generic error messages prevent user enumeration; all tokens expire cleanly.
