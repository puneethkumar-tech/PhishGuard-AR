# PhishGuard-AR Backend Starter

## Windows setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
$env:FLASK_APP="src.app"
flask run --debug --port 5000
```

Test:

```powershell
pytest -q
```

Health endpoint:

```text
http://127.0.0.1:5000/health
```

The scan endpoint intentionally returns `503 model_unavailable` until Person A supplies a real model bundle.
