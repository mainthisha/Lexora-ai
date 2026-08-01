from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, BorrowRecord, CategoryUsage, MonthlyTrend, Student, StudentActivityDay
from app.schemas import CategoryUsageOut, MonthlyTrendOut, StatsOut, StudentActivityOut

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    total_books = sum(b.total_copies for b in db.query(Book).all())
    available = sum(b.available_copies for b in db.query(Book).all())
    borrowed = total_books - available
    overdue = db.query(BorrowRecord).filter(BorrowRecord.status == "overdue").count()
    total_students = db.query(Student).count()

    return StatsOut(
        total_books=total_books,
        borrowed_books=borrowed,
        available_books=available,
        overdue_books=overdue,
        active_students=total_students,
        new_arrivals=12,
        ai_score=92,
    )


@router.get("/monthly-trend", response_model=list[MonthlyTrendOut])
def monthly_trend(db: Session = Depends(get_db)):
    rows = db.query(MonthlyTrend).order_by(MonthlyTrend.order_index.asc()).all()
    return [MonthlyTrendOut(month=r.month, borrows=r.borrows, returns=r.returns) for r in rows]


@router.get("/category-usage", response_model=list[CategoryUsageOut])
def category_usage(db: Session = Depends(get_db)):
    rows = db.query(CategoryUsage).all()
    return [CategoryUsageOut(category=r.category, value=r.value) for r in rows]


@router.get("/student-activity", response_model=list[StudentActivityOut])
def student_activity(db: Session = Depends(get_db)):
    rows = db.query(StudentActivityDay).order_by(StudentActivityDay.order_index.asc()).all()
    return [StudentActivityOut(day=r.day, visits=r.visits) for r in rows]
