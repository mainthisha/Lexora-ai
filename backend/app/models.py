from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="admin")  # admin | librarian | student
    avatar_url = Column(String)
    created_at = Column(DateTime, default=utcnow)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    publisher = Column(String)
    published_year = Column(Integer)
    language = Column(String, default="English")
    shelf_location = Column(String)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    cover_url = Column(String)
    popularity = Column(Integer, default=0)   # 0-100, drives recommendations/heatmap
    ai_score = Column(Integer, default=0)     # 0-100, AI confidence/relevance score
    description = Column(String)
    added_at = Column(DateTime, default=utcnow)

    borrow_records = relationship("BorrowRecord", back_populates="book")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, index=True)
    year = Column(Integer)
    photo_url = Column(String)
    joined_at = Column(DateTime, default=utcnow)

    borrow_records = relationship("BorrowRecord", back_populates="student")


class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    issued_at = Column(DateTime, default=utcnow)
    due_at = Column(DateTime, nullable=False)
    returned_at = Column(DateTime, nullable=True)
    fine = Column(Float, default=0)
    status = Column(String, default="active")  # active | returned | overdue

    book = relationship("Book", back_populates="borrow_records")
    student = relationship("Student", back_populates="borrow_records")


class NotificationItem(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    kind = Column(String, default="info")  # overdue | arrival | demand | ai | fine
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)


class MonthlyTrend(Base):
    """Precomputed monthly borrow/return volume for the analytics dashboard."""

    __tablename__ = "monthly_trend"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    borrows = Column(Integer, nullable=False)
    returns = Column(Integer, nullable=False)
    order_index = Column(Integer, nullable=False)


class DemandForecastWeek(Base):
    """Precomputed weekly actual-vs-forecast demand for AI insights."""

    __tablename__ = "demand_forecast"

    id = Column(Integer, primary_key=True, index=True)
    week = Column(String, nullable=False)
    actual = Column(Integer, nullable=True)
    forecast = Column(Integer, nullable=False)
    order_index = Column(Integer, nullable=False)


class CategoryUsage(Base):
    """Precomputed category share for pie/bar charts."""

    __tablename__ = "category_usage"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    value = Column(Integer, nullable=False)


class StudentActivityDay(Base):
    """Precomputed daily library footfall for engagement charts."""

    __tablename__ = "student_activity"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, nullable=False)
    visits = Column(Integer, nullable=False)
    order_index = Column(Integer, nullable=False)
