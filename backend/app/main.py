"""
Lexora AI — backend entrypoint.

Run with:  uvicorn app.main:app --reload --port 8000
Docs at:   http://localhost:8000/docs
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.seed import seed
from app.routers import analytics, auth, books, borrow, chatbot, insights, notifications, students


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed()
    yield


app = FastAPI(
    title="Lexora AI API",
    description="REST API for the Lexora AI library management platform.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(students.router)
app.include_router(borrow.router)
app.include_router(analytics.router)
app.include_router(insights.router)
app.include_router(notifications.router)
app.include_router(chatbot.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "lexora-ai-backend"}
