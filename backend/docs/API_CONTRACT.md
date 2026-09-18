# API Contract — PhishGuard-AR Backend

## 1. System Health

### `GET /health`
Public health status check.

**Response (200 OK):**
```json
{
  "service": "phishguard-api",
  "status": "ok"
}
```

---

## 2. Authentication

### `POST /api/auth/register`
Register a new analyst account.

**Request:**
```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "minimum-8-chars"
}
```

**Response (201 Created):**
```json
{
  "message": "registered successfully",
  "user_id": 1
}
```

### `POST /api/auth/login`
Authenticate with email and password.

**Request:**
```json
{
  "email": "demo@example.com",
  "password": "minimum-8-chars"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci..."
}
```

### `POST /api/auth/refresh`
Exchange a valid refresh token for a fresh access token.

**Headers:**
```text
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGci..."
}
```

---

## 3. Threat Scanning & History

### `POST /api/scan`
Submit text for phishing analysis.

**Headers:**
```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "text": "Urgent: verify your account security credentials immediately."
}
```

**Response (Until Person A integrates model bundle — 503 Service Unavailable):**
```json
{
  "error": "model_unavailable",
  "message": "ML model is not available. Wait for Person A's model bundle."
}
```

**Response (When model is active — 200 OK):**
```json
{
  "scan_id": 1,
  "verdict": "malicious",
  "threat_type": "phishing",
  "score": 0.94,
  "score_type": "confidence",
  "model_version": "v1.0",
  "indicators": [
    "urgent_action",
    "suspicious_link"
  ],
  "metadata": {
    "tokens_analyzed": 14,
    "confidence_calibrated": false
  }
}
```

### `GET /api/scans`
List scan records submitted by the authenticated user (newest first).

**Headers:**
```text
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (default: 50, max: 100)
- `offset` (default: 0)

**Response (200 OK):**
```json
{
  "scans": [
    {
      "id": 1,
      "user_id": 1,
      "text": "Sample text",
      "verdict": "malicious",
      "threat_type": "phishing",
      "score": 0.94,
      "score_type": "probability",
      "model_version": "v1.0",
      "created_at": "2026-09-18T08:30:00+00:00"
    }
  ],
  "count": 1
}
```

### `GET /api/scans/<scan_id>`
Retrieve a specific scan record owned by the authenticated user.

**Headers:**
```text
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "text": "Sample text",
  "verdict": "malicious",
  "threat_type": "phishing",
  "score": 0.94,
  "score_type": "probability",
  "model_version": "v1.0",
  "created_at": "2026-09-18T08:30:00+00:00"
}
```

**Error (404 Not Found):**
```json
{
  "error": "not_found",
  "message": "Scan 1 was not found or access is denied."
}
```
