from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, BorrowRecord, Student
from app.schemas import BorrowCreate, BorrowRecordOut

router = APIRouter(prefix="/api/borrow", tags=["borrow"])

FINE_PER_DAY = 5  # currency units per day overdue


def _to_out(r: BorrowRecord) -> BorrowRecordOut:
    return BorrowRecordOut(
        id=r.id, book_id=r.book_id, student_id=r.student_id,
        issued_at=r.issued_at, due_at=r.due_at, returned_at=r.returned_at,
        fine=r.fine, status=r.status,
        book_title=r.book.title if r.book else None,
        student_name=r.student.name if r.student else None,
    )


def _refresh_overdue_status(db: Session):
    """Flip active loans past their due date to 'overdue' and accrue fines."""
    now = datetime.now(timezone.utc)
    active = db.query(BorrowRecord).filter(BorrowRecord.status == "active").all()
    for r in active:
        due = r.due_at if r.due_at.tzinfo else r.due_at.replace(tzinfo=timezone.utc)
        if due < now:
            days_late = (now - due).days
            r.status = "overdue"
            r.fine = days_late * FINE_PER_DAY
    db.commit()


@router.get("", response_model=list[BorrowRecordOut])
def list_borrow_records(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    _refresh_overdue_status(db)
    query = db.query(BorrowRecord)
    if status:
        query = query.filter(BorrowRecord.status == status)
    records = query.order_by(BorrowRecord.issued_at.desc()).all()
    return [_to_out(r) for r in records]


@router.post("/issue", response_model=BorrowRecordOut, status_code=201)
def issue_book(payload: BorrowCreate, db: Session = Depends(get_db)):
    book = db.query(Book).get(payload.book_id)
    student = db.query(Student).get(payload.student_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available to issue.")

    now = datetime.now(timezone.utc)
    record = BorrowRecord(
        book_id=book.id,
        student_id=student.id,
        issued_at=now,
        due_at=now + timedelta(days=payload.due_in_days),
        status="active",
        fine=0,
    )
    book.available_copies -= 1
    db.add(record)
    db.commit()
    db.refresh(record)
    return _to_out(record)


@router.post("/{record_id}/return", response_model=BorrowRecordOut)
def return_book(record_id: int, db: Session = Depends(get_db)):
    record = db.query(BorrowRecord).get(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Borrow record not found.")
    if record.status == "returned":
        raise HTTPException(status_code=400, detail="This book has already been returned.")

    now = datetime.now(timezone.utc)
    due = record.due_at if record.due_at.tzinfo else record.due_at.replace(tzinfo=timezone.utc)
    if now > due:
        days_late = (now - due).days
        record.fine = days_late * FINE_PER_DAY

    record.returned_at = now
    record.status = "returned"

    book = db.query(Book).get(record.book_id)
    if book:
        book.available_copies = min(book.available_copies + 1, book.total_copies)

    db.commit()
    db.refresh(record)
    return _to_out(record)


@router.post("/{record_id}/renew", response_model=BorrowRecordOut)
def renew_book(record_id: int, days: int = 7, db: Session = Depends(get_db)):
    record = db.query(BorrowRecord).get(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Borrow record not found.")
    if record.status == "returned":
        raise HTTPException(status_code=400, detail="Cannot renew a returned book.")

    record.due_at = record.due_at + timedelta(days=days)
    record.status = "active"
    record.fine = 0
    db.commit()
    db.refresh(record)
    return _to_out(record)
