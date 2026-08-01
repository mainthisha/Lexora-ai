# Lexora AI

A standalone, production-quality AI-powered Library Management System.
Built from scratch as an independent project — no Lovable-generated code,
no shared folder structure with any prior project.

- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Recharts + React Router
- **Backend:** FastAPI + SQLAlchemy + SQLite (swappable to PostgreSQL) + JWT auth
- **Design:** Dark glassmorphism, neon violet/blue, premium SaaS-dashboard aesthetic

## Project structure

```
smartshelf-ai/
├── backend/           FastAPI REST API, SQLite database, seed data
│   └── app/
│       ├── main.py         App entrypoint, CORS, router wiring
│       ├── database.py     SQLAlchemy engine/session
│       ├── models.py       ORM models (User, Book, Student, BorrowRecord, ...)
│       ├── schemas.py      Pydantic request/response schemas
│       ├── auth.py         JWT + password hashing
│       ├── seed.py         Demo data: books, Tamil Nadu student names, wavy analytics
│       └── routers/        auth, books, students, borrow, analytics, insights, notifications
└── frontend/          Vite + React + TypeScript SPA
    └── src/
        ├── pages/          Dashboard, Books, Students, Borrow, Returns, Insights,
        │                   Recommendations, Analytics, Notifications, Settings, ...
        ├── components/     layout (Sidebar/Navbar/AppShell), ui (GlassCard/Button/...), charts
        ├── lib/             typed API client (api.ts)
        ├── hooks/           useAuth
        └── types/           shared TS interfaces mirroring backend schemas
```

## Running the backend

```sh
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/docs`. On first boot it automatically creates
`smartshelf.db` (SQLite) and seeds it with:

- 15 books with real cover images
- 20 students with Tamil Nadu college-style names
- 16 borrow/return records (some overdue, to populate fines and alerts)
- 6 notifications
- Realistic, wavy (non-linear) analytics data for every chart

To use PostgreSQL instead, set an environment variable before starting the
server: `DATABASE_URL=postgresql+psycopg2://user:pass@host/dbname`.

## Running the frontend

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. On first load you'll land on **Register** —
create an admin account (this hits the live backend and returns a JWT that's
stored in `localStorage`). The seeded catalog, students, and analytics appear
immediately across every page.

By default the frontend talks to `http://localhost:8000`. To point it
elsewhere, copy `.env.example` to `.env` and set `VITE_API_URL`.

## Modules

1. **Dashboard** — stat cards, borrow trend, category usage, demand forecast, student engagement, popular books, recent activity
2. **Books** — search, category filter, add/edit/delete, book detail page
3. **Students** — profiles, department filter, borrow history, fines
4. **Borrow** — issue books with configurable loan period
5. **Returns** — return/renew active loans, automatic fine calculation
6. **AI Insights** — demand forecast, popularity heatmap, rule-based smart alerts, model confidence
7. **Recommendations** — category-affinity recommender, per-student or library-wide trending
8. **Reports & Analytics** — category usage, monthly trend, engagement charts, CSV export
9. **Notifications** — overdue reminders, fine alerts, AI/demand alerts, mark-as-read
10. **Settings / Admin Profile / Help & Support**

## Notes on the "AI" features

The forecasting and recommendation logic is implemented with transparent,
explainable heuristics (category-affinity scoring, popularity/AI-score
blending, rule-based alert thresholds) rather than a trained ML model — this
keeps the project runnable with zero external dependencies while remaining a
realistic slot to swap in a real forecasting/recommendation service later
(e.g. a scikit-learn or PyTorch model reading from the same `BorrowRecord`
table).
