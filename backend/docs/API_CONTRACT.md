# API Contract — PhishGuard-AR Backend

## 1. System Health & Readiness

### `GET /health`
Liveness probe: returns `200 OK` as long as the backend server process is alive.

- **Authentication:** None (Public)
- **Response (200 OK):**
```json
{
  "service": "phishguard-api",
  "status": "ok"
}
```

### `GET /ready`
Readiness probe: validates database connectivity and ML model availability.

- **Authentication:** None (Public)
- **Response (When DB connected & ML model active — 200 OK):**
```json
{
  "service": "phishguard-api",
  "ready": true,
  "status": "ready",
  "checks": {
    "database": "connected",
    "model": "loaded"
  },
  "model_version": "phishguard-v1.0"
}
```
- **Response (When model is missing/unloaded — 503 Service Unavailable):**
```json
{
  "service": "phishguard-api",
  "ready": false,
  "status": "model_unavailable",
  "checks": {
    "database": "connected",
    "model": "unavailable"
  },
  "model_version": "not-loaded"
}
```

---

## 2. Authentication

### `POST /api/auth/register`
Register a new analyst account.

- **Authentication:** None (Public)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "minimum-8-chars"
}
```
- **Response (201 Created):**
```json
{
  "message": "registered successfully",
  "user_id": 1
}
```
- **Error Responses:**
  - `400 Bad Request` (Validation Error):
    ```json
    {
      "error": "validation_error",
      "message": "Name (max 120 chars), a valid email (max 255 chars), and a password of at least 8 characters (max 128) are required."
    }
    ```
  - `409 Conflict` (Duplicate Email):
    ```json
    {
      "error": "conflict",
      "message": "registration failed"
    }
    ```

### `POST /api/auth/login`
Authenticate with email and password to obtain JWT tokens.

- **Authentication:** None (Public)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "demo@example.com",
  "password": "minimum-8-chars"
}
```
- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Error Responses:**
  - `401 Unauthorized` (Invalid credentials or missing fields):
    ```json
    {
      "error": "invalid_credentials",
      "message": "invalid email or password"
    }
    ```

### `POST /api/auth/refresh`
Exchange a valid refresh token for a fresh access token.

- **Authentication:** Bearer Refresh Token
- **Headers:**
  ```text
  Authorization: Bearer <refresh_token>
  ```
- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Error Responses:**
  - `401 Unauthorized` (Missing or invalid refresh token):
    ```json
    {
      "error": "unauthorized",
      "message": "Authorization token is missing or invalid."
    }
    ```

---

## 3. Threat Scanning & History

### `POST /api/scan`
Submit text for phishing and cyber threat analysis.

- **Authentication:** Bearer Access Token
- **Headers:**
  ```text
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
```json
{
  "text": "Urgent: verify your account security credentials immediately at https://bank-login.example"
}
```
- **Response (When model is active — 200 OK):**
```json
{
  "scan_id": 1,
  "verdict": "malicious",
  "threat_type": "phishing",
  "score": 0.94,
  "score_type": "confidence",
  "model_version": "phishguard-v1.0",
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
- **Error Responses:**
  - `400 Bad Request` (Empty text or missing text field):
    ```json
    {
      "error": "validation_error",
      "message": "text is required"
    }
    ```
  - `401 Unauthorized` (Missing or invalid access token):
    ```json
    {
      "error": "unauthorized",
      "message": "Authorization token is missing or invalid."
    }
    ```
  - `413 Payload Too Large` (Text exceeds 100,000 characters):
    ```json
    {
      "error": "payload_too_large",
      "message": "text is too long"
    }
    ```
  - `500 Internal Server Error` (Model inference or runtime failure):
    ```json
    {
      "error": "model_error",
      "message": "Threat analysis failed due to an internal model error."
    }
    ```
  - `503 Service Unavailable` (ML model bundle not yet loaded):
    ```json
    {
      "error": "model_unavailable",
      "message": "ML model is not available. Wait for Person A's model bundle."
    }
    ```

### `GET /api/scans`
List scan records submitted by the authenticated user (newest first).

- **Authentication:** Bearer Access Token
- **Headers:**
  ```text
  Authorization: Bearer <access_token>
  ```
- **Query Parameters:**
  - `limit` (optional, integer, default: 50, clamped: 1..100)
  - `offset` (optional, integer, default: 0, min: 0)
- **Response (200 OK):**
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
      "score_type": "confidence",
      "model_version": "v1.0",
      "created_at": "2026-09-18T08:30:00+00:00"
    }
  ],
  "count": 1
}
```
- **Error Responses:**
  - `401 Unauthorized`:
    ```json
    {
      "error": "unauthorized",
      "message": "Authorization token is missing or invalid."
    }
    ```

### `GET /api/scans/<scan_id>`
Retrieve a specific scan record owned by the authenticated user.

- **Authentication:** Bearer Access Token
- **Headers:**
  ```text
  Authorization: Bearer <access_token>
  ```
- **Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "text": "Sample text",
  "verdict": "malicious",
  "threat_type": "phishing",
  "score": 0.94,
  "score_type": "confidence",
  "model_version": "v1.0",
  "created_at": "2026-09-18T08:30:00+00:00"
}
```
- **Error Responses:**
  - `401 Unauthorized`:
    ```json
    {
      "error": "unauthorized",
      "message": "Authorization token is missing or invalid."
    }
    ```
  - `404 Not Found` (Scan non-existent or owned by a different user):
    ```json
    {
      "error": "not_found",
      "message": "Scan 1 was not found or access is denied."
    }
    ```
