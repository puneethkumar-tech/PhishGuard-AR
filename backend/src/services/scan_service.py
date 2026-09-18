from ..extensions import db
from ..models import Scan

def save_scan(user_id: int, text: str, result: dict) -> Scan:
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
