# 📚 Lexora AI

A standalone, production-quality AI-powered Library Management System designed to simplify library operations through intelligent analytics, recommendations, automated notifications, and a modern digital experience.

🌐 **Live Demo:** https://lexora-ai-three.vercel.app/login

- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Recharts + React Router
- **Backend:** FastAPI + SQLAlchemy + SQLite (swappable to PostgreSQL) + JWT authentication
- **Design:** Dark glassmorphism, neon violet/blue, premium SaaS-dashboard aesthetic

---

## ✨ Features

### 📊 Smart Dashboard

- Library statistics and overview
- Borrowing trends
- Category usage
- Demand forecasting
- Student engagement
- Popular books
- Recent activity

### 📚 Book Management

- Search and filter books
- Category-based filtering
- Add, edit, and delete books
- View detailed book information
- Track book availability

### 👨‍🎓 Student Management

- Student profiles
- Department-based filtering
- Borrowing history
- Fine tracking
- Student activity monitoring

### 🔄 Borrow & Return Management

- Issue books with configurable loan periods
- Track active loans
- Return and renew books
- Automatic fine calculation
- Overdue tracking

### 🧠 AI Insights

- Demand forecasting
- Book popularity analysis
- Smart library alerts
- Model confidence indicators
- Data-driven library insights

### 🎯 Smart Recommendations

- Category-affinity recommendations
- Student-specific recommendations
- Library-wide trending books
- Popularity-based recommendations

### 📈 Reports & Analytics

- Category usage analytics
- Monthly borrowing trends
- Student engagement analytics
- Interactive data visualizations
- CSV report export

### 🔔 Smart Notifications

- Overdue reminders
- Fine alerts
- AI and demand alerts
- Read/unread notification management

### 🔐 Authentication & Administration

- JWT-based authentication
- Secure password hashing
- Admin profile
- Application settings
- Help and support

---

## 🌐 Live Application

Experience Lexora AI:

**https://lexora-ai-three.vercel.app/login**

---

## 🏗️ Project Structure

```text
lexora-ai/
├── backend/           FastAPI REST API, SQLite database, seed data
│   └── app/
│       ├── main.py         App entrypoint, CORS, router wiring
│       ├── database.py     SQLAlchemy engine/session
│       ├── models.py       ORM models
│       ├── schemas.py      Pydantic request/response schemas
│       ├── auth.py         JWT + password hashing
│       ├── seed.py         Demo data and initial library records
│       └── routers/        auth, books, students, borrow, analytics,
│                           insights, notifications
│
└── frontend/          Vite + React + TypeScript SPA
    └── src/
        ├── pages/          Dashboard, Books, Students, Borrow, Returns,
        │                   Insights, Recommendations, Analytics,
        │                   Notifications, Settings, ...
        ├── components/     Layout, UI components, charts
        ├── lib/             Typed API client
        ├── hooks/           Authentication hooks
        └── types/           Shared TypeScript interfaces

---

## 📌 About

**Lexora AI** brings traditional library management and intelligent data-driven features together in one modern platform.

It helps manage books, students, borrowing, returns, fines, recommendations, analytics, notifications, and library insights through a unified digital experience.

### 📚 Manage Smarter. Discover Better. Learn More.
