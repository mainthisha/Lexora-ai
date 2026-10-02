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
