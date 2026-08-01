from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BorrowRecord, Student
from app.schemas import BorrowRecordOut, StudentOut

router = APIRouter(prefix="/api/students", tags=["students"])


def _to_out(student: Student, db: Session) -> StudentOut:
    records = db.query(BorrowRecord).filter(BorrowRecord.student_id == student.id).all()
    return StudentOut(
        id=student.id,
        name=student.name,
        email=student.email,
        department=student.department,
        year=student.year,
        photo_url=student.photo_url,
        joined_at=student.joined_at,
        active_borrows=sum(1 for r in records if r.status in ("active", "overdue")),
        total_borrows=len(records),
        total_fines=sum(r.fine for r in records),
    )


@router.get("", response_model=list[StudentOut])
def list_students(
    q: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Student)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Student.name.ilike(like), Student.email.ilike(like)))
    if department and department != "All":
        query = query.filter(Student.department == department)
    return [_to_out(s, db) for s in query.order_by(Student.name.asc()).all()]


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return _to_out(student, db)


@router.get("/{student_id}/history", response_model=list[BorrowRecordOut])
def student_history(student_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(BorrowRecord)
        .filter(BorrowRecord.student_id == student_id)
        .order_by(BorrowRecord.issued_at.desc())
        .all()
    )
    out = []
    for r in records:
        out.append(BorrowRecordOut(
            id=r.id, book_id=r.book_id, student_id=r.student_id,
            issued_at=r.issued_at, due_at=r.due_at, returned_at=r.returned_at,
            fine=r.fine, status=r.status,
            book_title=r.book.title if r.book else None,
            student_name=r.student.name if r.student else None,
        ))
    return out
