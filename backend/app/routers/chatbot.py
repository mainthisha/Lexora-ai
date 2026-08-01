"""
AI Assistant chatbot — rule-based intent matching over the live database.

This intentionally avoids calling out to an external LLM so the project stays
zero-dependency and fully offline-runnable. Swapping in a real model later is
a one-function change: replace `answer()` below with a call to your provider
of choice, still backed by the same DB lookups for grounding/RAG-style context.
"""
import re

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, BorrowRecord, Student
from app.schemas import ChatQuery, ChatResponse, ChatResult

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


def _overdue(db: Session) -> ChatResponse:
    records = (
        db.query(BorrowRecord)
        .filter(BorrowRecord.status == "overdue")
        .order_by(BorrowRecord.fine.desc())
        .limit(8)
        .all()
    )
    if not records:
        return ChatResponse(reply="No overdue books right now — the library is all caught up.", intent="overdue", results=[])
    results = [
        ChatResult(label=f"{r.book.title if r.book else 'Unknown'}", sublabel=f"{r.student.name if r.student else 'Unknown'} · ₹{r.fine} fine", tone="danger")
        for r in records
    ]
    return ChatResponse(reply=f"There are {len(records)} overdue books currently:", intent="overdue", results=results)


def _fines(db: Session) -> ChatResponse:
    rows = (
        db.query(Student, BorrowRecord)
        .join(BorrowRecord, BorrowRecord.student_id == Student.id)
        .filter(BorrowRecord.fine > 0)
        .all()
    )
    totals: dict[int, tuple[str, float]] = {}
    for student, record in rows:
        name, total = totals.get(student.id, (student.name, 0))
        totals[student.id] = (name, total + record.fine)

    if not totals:
        return ChatResponse(reply="No outstanding fines at the moment.", intent="fines", results=[])

    top = sorted(totals.values(), key=lambda t: -t[1])[:8]
    results = [ChatResult(label=name, sublabel=f"₹{amount} owed", tone="warning") for name, amount in top]
    grand_total = sum(a for _, a in totals.values())
    return ChatResponse(reply=f"₹{grand_total:.0f} in outstanding fines across {len(totals)} students:", intent="fines", results=results)


def _popular(db: Session) -> ChatResponse:
    books = db.query(Book).order_by(Book.popularity.desc()).limit(8).all()
    results = [ChatResult(label=b.title, sublabel=f"{b.category} · {b.popularity} popularity", tone="ai") for b in books]
    return ChatResponse(reply="Here are the most popular books right now:", intent="popular", results=results)


def _available(db: Session, category: str | None = None) -> ChatResponse:
    query = db.query(Book).filter(Book.available_copies > 0)
    if category:
        query = query.filter(Book.category.ilike(f"%{category}%"))
    books = query.order_by(Book.popularity.desc()).limit(8).all()
    if not books:
        scope = f" in {category}" if category else ""
        return ChatResponse(reply=f"No available copies{scope} right now.", intent="available", results=[])
    results = [ChatResult(label=b.title, sublabel=f"{b.available_copies} copies · {b.category}", tone="success") for b in books]
    scope = f" in {category}" if category else ""
    return ChatResponse(reply=f"Available books{scope}:", intent="available", results=results)


def _search_books(db: Session, term: str) -> ChatResponse:
    like = f"%{term}%"
    books = db.query(Book).filter((Book.title.ilike(like)) | (Book.category.ilike(like)) | (Book.author.ilike(like))).limit(8).all()
    if not books:
        return ChatResponse(reply=f"I couldn't find anything matching '{term}'. Try a different title, author, or category.", intent="search", results=[])
    results = [ChatResult(label=b.title, sublabel=f"{b.author} · {b.available_copies} available", tone="info") for b in books]
    return ChatResponse(reply=f"Found {len(books)} result(s) for '{term}':", intent="search", results=results)


def _stats(db: Session) -> ChatResponse:
    total_books = sum(b.total_copies for b in db.query(Book).all())
    available = sum(b.available_copies for b in db.query(Book).all())
    total_students = db.query(Student).count()
    overdue = db.query(BorrowRecord).filter(BorrowRecord.status == "overdue").count()
    results = [
        ChatResult(label="Total books", sublabel=str(total_books)),
        ChatResult(label="Available now", sublabel=str(available), tone="success"),
        ChatResult(label="Registered students", sublabel=str(total_students)),
        ChatResult(label="Overdue loans", sublabel=str(overdue), tone="danger" if overdue else "success"),
    ]
    return ChatResponse(reply="Here's the current library snapshot:", intent="stats", results=results)


def _student_history(db: Session, student_id: int) -> ChatResponse:
    student = db.query(Student).get(student_id)
    if not student:
        return ChatResponse(reply="I couldn't find that student.", intent="student_history", results=[])
    records = db.query(BorrowRecord).filter(BorrowRecord.student_id == student_id).order_by(BorrowRecord.issued_at.desc()).limit(8).all()
    if not records:
        return ChatResponse(reply=f"{student.name} hasn't borrowed any books yet.", intent="student_history", results=[])
    results = [ChatResult(label=r.book.title if r.book else "Unknown", sublabel=r.status, tone="danger" if r.status == "overdue" else "default") for r in records]
    return ChatResponse(reply=f"{student.name}'s recent borrowing activity:", intent="student_history", results=results)


def answer(message: str, student_id: int | None, db: Session) -> ChatResponse:
    text = message.lower().strip()

    if re.search(r"\boverdue\b", text):
        return _overdue(db)

    if re.search(r"\bfine|owe|owing|penalt", text):
        return _fines(db)

    if re.search(r"\bpopular|trending|top book", text):
        return _popular(db)

    if re.search(r"\bmy (books|history|loans|borrows)\b", text) and student_id:
        return _student_history(db, student_id)

    if re.search(r"\bavailable\b", text):
        category_match = re.search(r"available\s+(.+?)\s*books?\b", text) or re.search(r"\bin\s+([a-z &]+)$", text)
        category = category_match.group(1).strip() if category_match else None
        return _available(db, category)

    if re.search(r"\bhow many|stats|overview|snapshot|summary\b", text):
        return _stats(db)

    show_match = re.search(r"\bshow\s+(?:me\s+)?(.+?)\s*books?\b", text)
    if show_match:
        return _available(db, show_match.group(1).strip())

    search_match = re.search(r"\b(?:find|search|look up|do you have)\b\s*(.+)", text)
    if search_match:
        term = re.sub(r"\bbooks?\b", "", search_match.group(1)).strip()
        if term:
            return _search_books(db, term)

    if re.search(r"\b(hi|hello|hey)\b", text):
        return ChatResponse(
            reply="Hi! I can help with things like: \"show overdue books\", \"who has fines\", \"most popular books\", \"available AI books\", or \"find Clean Code\".",
            intent="greeting",
            results=[],
        )

    # Fallback: treat the whole message as a search term
    return _search_books(db, text)


@router.post("", response_model=ChatResponse)
def chat(payload: ChatQuery, db: Session = Depends(get_db)):
    return answer(payload.message, payload.student_id, db)
