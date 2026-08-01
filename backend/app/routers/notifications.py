from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import NotificationItem
from app.schemas import NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(db: Session = Depends(get_db)):
    return db.query(NotificationItem).order_by(NotificationItem.created_at.desc()).all()


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(NotificationItem).get(notification_id)
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found.")
    n.read = True
    db.commit()
    db.refresh(n)
    return n


@router.post("/read-all", response_model=list[NotificationOut])
def mark_all_read(db: Session = Depends(get_db)):
    rows = db.query(NotificationItem).all()
    for n in rows:
        n.read = True
    db.commit()
    return rows
