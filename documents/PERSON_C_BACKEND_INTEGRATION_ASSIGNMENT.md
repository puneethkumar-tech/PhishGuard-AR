# 🔧 Person C — Backend, Auth & Integration Engineer Assignment

## Mission

Build the secure API that connects the model, security layer, database, alerts, and frontend.

## Your judging-criteria contribution

| Criterion | Your proof |
|---|---|
| Wow Factor | A security tool with protected analyst functionality |
| Build Quality | Clear API contracts, validation, tests, rate limiting |
| User Love | Fast and understandable responses |
| Real-World Ready | Authentication, audit trail, secret handling, modular integrations |
| Pitch Power | Smooth end-to-end flow without manual code changes |

## Priority order

1. Create a minimal Flask application factory.
2. Add health endpoint and structured error responses.
3. Add SQLite development database.
4. Implement registration/login with password hashing.
5. Add JWT access token expiry and refresh strategy.
6. Add protected scan endpoint.
7. Load the model through a service wrapper.
8. Add scan history and report endpoint.
9. Integrate optional OTP/alerts only after the core API works.

## Suggested API surface

```text
GET  /health
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/scan
GET  /api/scans
GET  /api/scans/<scan_id>
POST /api/reports/<scan_id>/verify
GET  /api/reports/<scan_id>
GET  /api/dashboard/summary
POST /api/alerts/test
```

## Required deliverables

```text
src/app.py
src/config.py
src/auth/
src/api/
src/services/model_service.py
src/services/scan_service.py
src/services/alert_service.py
tests/test_auth.py
tests/test_scan_api.py
docs/API_CONTRACT.md
```

## Security requirements

- Store secrets only in environment variables.
- Hash passwords using bcrypt or a vetted password-hashing library.
- Validate all JSON input.
- Use JWT expiry.
- Apply rate limiting to login and sensitive endpoints.
- Avoid returning passwords, tokens, or secret configuration in logs.
- Use generic login failure messages.
- Restrict report access to the authenticated owner unless the user has an explicitly authorized admin role.
- Add OTP lockout and expiry if OTP is implemented.
- Use test credentials and sandbox numbers only.
- CORS should be explicit, not `*` in production.
- Do not trust a client-provided severity or threat verdict.

## Model integration

The backend must not assume that every model returns calibrated probabilities. Accept the model bundle contract from Person A and expose:

- verdict
- threat type
- score
- score type
- model version
- language if available
- evidence/highlights if available

If a model artifact is unavailable, return a clear service error or a controlled demo status. Do not silently invent predictions.

## Handoffs

| Deliverable | Receiver | Deadline |
|---|---|---|
| API skeleton and health check | D | Hour 5 |
| Auth endpoints | D | Hour 9 |
| Model loading interface | A | Hour 9 |
| Scan endpoint | D | Hour 18 |
| Report/OTP endpoint | D | Hour 22 |
| Alert callback interface | D | Hour 22 |

## Acceptance checklist

- [ ] `GET /health` works.
- [ ] Invalid input returns structured 4xx errors.
- [ ] Auth tests cover success and failure.
- [ ] Protected routes reject missing/invalid tokens.
- [ ] Model loading is isolated from route code.
- [ ] Scan records are saved with timestamps and user ownership.
- [ ] Rate limits are tested or manually verified.
- [ ] `.env` and credentials are ignored by Git.
- [ ] API documentation includes request and response examples.

## Suggested commands

```powershell
flask --app src.app run --debug --port 5000
pytest -q
```
