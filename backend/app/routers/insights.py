from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, BorrowRecord, DemandForecastWeek, Student
from app.schemas import AlertOut, BookOut, DemandForecastOut, RecommendationOut

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("/demand-forecast", response_model=list[DemandForecastOut])
def demand_forecast(db: Session = Depends(get_db)):
    rows = db.query(DemandForecastWeek).order_by(DemandForecastWeek.order_index.asc()).all()
    return [DemandForecastOut(week=r.week, actual=r.actual, forecast=r.forecast) for r in rows]


@router.get("/popular-books", response_model=list[BookOut])
def popular_books(limit: int = 8, db: Session = Depends(get_db)):
    return db.query(Book).order_by(Book.popularity.desc()).limit(limit).all()


@router.get("/alerts", response_model=list[AlertOut])
def smart_alerts(db: Session = Depends(get_db)):
    """
    Rule-based 'smart alert' engine: flags frequently-overdue titles, low
    stock against demand, under-promoted high-quality titles, and books
    that have gone dormant. Simple heuristics, framed as AI-driven insight —
    exactly the kind of lightweight logic a real recommendation service
    would layer richer models on top of later.
    """
    alerts: list[AlertOut] = []

    overdue_counts: dict[int, int] = {}
    for r in db.query(BorrowRecord).filter(BorrowRecord.status == "overdue").all():
        overdue_counts[r.book_id] = overdue_counts.get(r.book_id, 0) + 1
    for book_id, count in sorted(overdue_counts.items(), key=lambda kv: -kv[1])[:1]:
        book = db.query(Book).get(book_id)
        if book:
            alerts.append(AlertOut(
                tone="danger", title="Frequently overdue",
                body=f"'{book.title}' is overdue {count}x currently — consider adding copies.",
            ))

    low_stock = db.query(Book).filter(Book.available_copies <= 3, Book.popularity >= 80).order_by(Book.popularity.desc()).first()
    if low_stock:
        alerts.append(AlertOut(
            tone="warning", title="Low stock",
            body=f"'{low_stock.title}' has {low_stock.available_copies} copies left with high predicted demand.",
        ))

    hidden_gem = db.query(Book).filter(Book.popularity < 80, Book.ai_score >= 70).order_by(Book.ai_score.desc()).first()
    if hidden_gem:
        alerts.append(AlertOut(
            tone="ai", title="Hidden gem",
            body=f"'{hidden_gem.title}' has {hidden_gem.popularity} popularity but a {hidden_gem.ai_score}% AI relevance score. Promote it.",
        ))

    inactive_count = db.query(Book).filter(Book.popularity < 75).count()
    if inactive_count:
        alerts.append(AlertOut(
            tone="info", title="Inactive titles",
            body=f"{inactive_count} books show low recent engagement. Consider archiving or bundling promotions.",
        ))

    return alerts


@router.get("/recommendations", response_model=list[RecommendationOut])
def recommendations(student_id: int | None = None, limit: int = 6, db: Session = Depends(get_db)):
    """
    Category-affinity recommender: looks at what a student has already
    borrowed, scores every other book by category overlap plus a popularity
    and AI-score blend, and returns the top matches. Falls back to
    library-wide trending titles when no student is specified.
    """
    all_books = db.query(Book).all()

    if student_id:
        history = db.query(BorrowRecord).filter(BorrowRecord.student_id == student_id).all()
        borrowed_ids = {r.book_id for r in history}
        categories = {r.book.category for r in history if r.book}

        scored = []
        for b in all_books:
            if b.id in borrowed_ids:
                continue
            category_match = 25 if b.category in categories else 0
            score = min(99, category_match + int(b.popularity * 0.45) + int(b.ai_score * 0.35))
            reason = (
                f"Matches your interest in {b.category}"
                if category_match
                else "Trending across similar readers"
            )
            scored.append((score, b, reason))
        scored.sort(key=lambda t: -t[0])
        top = scored[:limit]
    else:
        top = [
            (min(99, int(b.popularity * 0.6 + b.ai_score * 0.4)), b, "Trending in the library right now")
            for b in sorted(all_books, key=lambda b: -b.popularity)[:limit]
        ]

    return [
        RecommendationOut(book_id=b.id, title=b.title, author=b.author, cover_url=b.cover_url,
                           reason=reason, match_score=score)
        for score, b, reason in top
    ]
