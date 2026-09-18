# API Contract — Initial Backend

## Health

`GET /health`

Response:

```json
{"status": "ok", "service": "phishguard-api"}
```

## Register

`POST /api/auth/register`

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "minimum-8-chars"
}
```

## Login

`POST /api/auth/login`

Returns access and refresh tokens.

## Scan

`POST /api/scan`

Requires:

```text
Authorization: Bearer <access_token>
```

Request:

```json
{"text": "Suspicious message text"}
```

Until Person A supplies the model bundle, this endpoint returns `503 model_unavailable`.
