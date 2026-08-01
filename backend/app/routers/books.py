from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Book, BorrowRecord
from app.schemas import BookCreate, BookOut, BookUpdate

router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("", response_model=list[BookOut])
def list_books(
    q: Optional[str] = Query(None, description="Search title, author, or ISBN"),
    category: Optional[str] = Query(None),
    sort: str = Query("popularity", pattern="^(popularity|title|added_at|ai_score)$"),
    db: Session = Depends(get_db),
):
    query = db.query(Book)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Book.title.ilike(like), Book.author.ilike(like), Book.isbn.ilike(like)))
    if category and category != "All":
        query = query.filter(Book.category == category)

    sort_column = getattr(Book, sort)
    query = query.order_by(sort_column.desc() if sort != "title" else sort_column.asc())
    return query.all()


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    rows = db.query(Book.category).distinct().all()
    return sorted({r[0] for r in rows})


@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    return book


@router.post("", response_model=BookOut, status_code=201)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    if db.query(Book).filter(Book.isbn == payload.isbn).first():
        raise HTTPException(status_code=400, detail="A book with this ISBN already exists.")
    book = Book(**payload.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/{book_id}", response_model=BookOut)
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db)):
    book = db.query(Book).get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    db.query(BorrowRecord).filter(BorrowRecord.book_id == book_id).delete()
    db.delete(book)
    db.commit()
    return None
