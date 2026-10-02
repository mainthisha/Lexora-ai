# 📚 Lexora AI

A standalone, production-quality AI-powered Library Management System designed to simplify library operations through intelligent analytics, recommendations, automated notifications, and a modern digital experience.

🌐 **Live Demo:** https://lexora-ai-three.vercel.app/login

- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Recharts + React Router
- **Backend:** FastAPI + SQLAlchemy + SQLite (swappable to PostgreSQL) + JWT Authentication
- **Design:** Dark glassmorphism, neon violet/blue, premium SaaS-dashboard aesthetic

---

## ✨ Features

### 📊 Smart Dashboard

Lexora AI provides a centralized dashboard to monitor library activity and important insights.

- Library statistics and overview
- Borrowing trends
- Category usage
- Student engagement
- Popular books
- Recent activity
- Demand forecasting

### 📚 Book Management

Manage the complete library catalog through a simple and organized interface.

- Search and filter books
- Filter by category
- Add new books
- Edit book information
- Delete books
- View detailed book information
- Track book availability

### 👨‍🎓 Student Management

Manage student information and understand individual borrowing activity.

- Student profiles
- Department-based filtering
- Borrowing history
- Fine tracking
- Student activity monitoring

### 🔄 Borrow & Return Management

Handle the complete borrowing and return process digitally.

- Issue books
- Configure loan periods
- Track active loans
- Return books
- Renew books
- Automatically calculate fines
- Track overdue books

### 🧠 AI Insights

Lexora AI provides intelligent insights to help understand library usage and book demand.

- Demand forecasting
- Book popularity analysis
- Smart library alerts
- Model confidence indicators
- Data-driven library insights

### 🎯 Smart Recommendations

The recommendation system helps identify relevant and popular books.

- Category-based recommendations
- Student-specific recommendations
- Library-wide trending books
- Popularity-based recommendations

### 📈 Reports & Analytics

Visualize library data through interactive reports and analytics.

- Category usage analytics
- Monthly borrowing trends
- Student engagement analytics
- Interactive charts
- CSV report export

### 🔔 Smart Notifications

Stay updated with important library activities.

- Overdue reminders
- Fine alerts
- Demand alerts
- AI insight notifications
- Read/unread notification management

### 🔐 Authentication & Administration

Secure access and administration features for managing the platform.

- JWT-based authentication
- Password hashing
- Admin profile
- Application settings
- Help and support

---

## 🌐 Live Application

Explore the deployed Lexora AI application:

**https://lexora-ai-three.vercel.app/login**

---

## 🏗️ Project Structure

```text
lexora-ai/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── auth.py
│       ├── seed.py
│       └── routers/
│
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── lib/
        ├── hooks/
        └── types/
```

---

## 🤖 AI Features

The forecasting and recommendation logic is implemented using transparent and explainable heuristics rather than a trained machine-learning model.

Current intelligent features include:

- Category-affinity scoring
- Popularity analysis
- AI-score blending
- Rule-based alert thresholds
- Demand forecasting logic

This keeps the application lightweight and runnable without external AI dependencies while providing a clear foundation for integrating trained ML models in the future.

---

## 🎨 Design

Lexora AI follows a premium SaaS-dashboard aesthetic with:

- 🌑 Dark glassmorphism
- 💜 Neon violet and blue accents
- ✨ Smooth animations
- 📊 Interactive data visualizations
- 🧩 Modern dashboard cards
- 📱 Responsive layouts
- ⚡ Clean and intuitive navigation

---

## 🛡️ Architecture

Lexora AI follows a full-stack architecture where the frontend communicates with the backend through REST APIs.

```text
        ┌──────────────────────────┐
        │       Lexora AI          │
        │ React + TypeScript       │
        └────────────┬─────────────┘
                     │
                     │ REST API
                     ▼
        ┌──────────────────────────┐
        │      FastAPI Backend     │
        │         Python           │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │        Database          │
        │   SQLite / PostgreSQL    │
        └──────────────────────────┘
```

---

## 🎯 Conclusion

**Lexora AI** transforms traditional library management into a smarter and more connected digital experience.

By bringing management tools, analytics, recommendations, and intelligent insights together in one platform, it makes library operations more organized, efficient, and user-friendly.

### 🚀 Smarter Libraries. Better Experiences.
