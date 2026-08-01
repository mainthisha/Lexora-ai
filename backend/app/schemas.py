from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


# ---------- Auth ----------

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "admin"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    role: str
    avatar_url: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Chatbot ----------

class ChatQuery(BaseModel):
    message: str
    student_id: Optional[int] = None


class ChatResult(BaseModel):
    label: str
    sublabel: Optional[str] = None
    tone: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    intent: str
    results: list[ChatResult] = []


# ---------- Books ----------

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    category: str
    publisher: Optional[str] = None
    published_year: Optional[int] = None
    language: str = "English"
    shelf_location: Optional[str] = None
    total_copies: int = 1
    available_copies: int = 1
    cover_url: Optional[str] = None
    popularity: int = 0
    ai_score: int = 0
    description: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    category: Optional[str] = None
    publisher: Optional[str] = None
    published_year: Optional[int] = None
    language: Optional[str] = None
    shelf_location: Optional[str] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    cover_url: Optional[str] = None
    popularity: Optional[int] = None
    ai_score: Optional[int] = None
    description: Optional[str] = None


class BookOut(BookBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    added_at: datetime


# ---------- Students ----------

class StudentBase(BaseModel):
    name: str
    email: str
    department: str
    year: int
    photo_url: Optional[str] = None


class StudentOut(StudentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    joined_at: datetime
    active_borrows: int = 0
    total_borrows: int = 0
    total_fines: float = 0


# ---------- Borrow records ----------

class BorrowCreate(BaseModel):
    book_id: int
    student_id: int
    due_in_days: int = 14


class BorrowRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    book_id: int
    student_id: int
    issued_at: datetime
    due_at: datetime
    returned_at: Optional[datetime] = None
    fine: float
    status: str
    book_title: Optional[str] = None
    student_name: Optional[str] = None


# ---------- Notifications ----------

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    body: str
    kind: str
    read: bool
    created_at: datetime


# ---------- Analytics / Insights ----------

class StatsOut(BaseModel):
    total_books: int
    borrowed_books: int
    available_books: int
    overdue_books: int
    active_students: int
    new_arrivals: int
    ai_score: int


class MonthlyTrendOut(BaseModel):
    month: str
    borrows: int
    returns: int


class DemandForecastOut(BaseModel):
    week: str
    actual: Optional[int]
    forecast: int


class CategoryUsageOut(BaseModel):
    category: str
    value: int


class StudentActivityOut(BaseModel):
    day: str
    visits: int


class AlertOut(BaseModel):
    tone: str  # danger | warning | ai | info
    title: str
    body: str


class RecommendationOut(BaseModel):
    book_id: int
    title: str
    author: str
    cover_url: Optional[str]
    reason: str
    match_score: int
