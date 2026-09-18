from ..extensions import db
from ..models import Scan

def save_scan(user_id: int, text: str, result: dict) -> Scan:
    """Persist a scan record for an authenticated user."""
    scan = Scan(
        user_id=user_id,
        text=text,
        verdict=result["verdict"],
        threat_type=result["threat_type"],
        score=result.get("score"),
        score_type=result.get("score_type"),
        model_version=result.get("model_version"),
    )
    db.session.add(scan)
    db.session.commit()
    return scan

def get_user_scans(user_id: int, limit: int = 50, offset: int = 0) -> list[Scan]:
    """Retrieve scan history for a given user, ordered newest first."""
    return (
        db.session.query(Scan)
        .filter(Scan.user_id == user_id)
        .order_by(Scan.created_at.desc())
        .offset(offset)
        .limit(min(limit, 100))
        .all()
    )

def get_scan_by_id(user_id: int, scan_id: int) -> Scan | None:
    """Retrieve a single scan ensuring the authenticated user owns it."""
    return (
        db.session.query(Scan)
        .filter(Scan.id == scan_id, Scan.user_id == user_id)
        .first()
    )
