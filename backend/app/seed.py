"""
Seeds the database with a realistic, self-consistent dataset:
books with real covers (Open Library CDN), Tamil Nadu student names,
borrow/return activity, notifications, and hand-tuned analytics series
with natural peaks and dips (never a straight line).
"""

from datetime import datetime, timedelta, timezone

from app.database import Base, engine, SessionLocal
from app.models import (
    Book, Student, BorrowRecord, NotificationItem,
    MonthlyTrend, DemandForecastWeek, CategoryUsage, StudentActivityDay,
)


def cover(isbn: str) -> str:
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"


def days_ago(n: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=n)


def days_ahead(n: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=n)


BOOKS = [
    dict(title="Deep Learning", author="Ian Goodfellow, Yoshua Bengio, Aaron Courville",
         isbn="9780262035613", category="AI / ML", publisher="MIT Press", published_year=2016,
         shelf_location="A-12", total_copies=8, available_copies=3, popularity=96, ai_score=92,
         description="The definitive textbook on deep learning theory, architectures, and modern practice."),
    dict(title="Python Crash Course", author="Eric Matthes",
         isbn="9781593279288", category="Programming", publisher="No Starch Press", published_year=2019,
         shelf_location="B-04", total_copies=12, available_copies=5, popularity=88, ai_score=84,
         description="Hands-on, project-based introduction to Python programming."),
    dict(title="Hands-On Machine Learning", author="Aurelien Geron",
         isbn="9781492032649", category="AI / ML", publisher="O'Reilly", published_year=2019,
         shelf_location="A-08", total_copies=10, available_copies=2, popularity=94, ai_score=90,
         description="Concepts and tools for building intelligent systems with Scikit-Learn, Keras and TensorFlow."),
    dict(title="Clean Code", author="Robert C. Martin",
         isbn="9780132350884", category="Software Engineering", publisher="Prentice Hall", published_year=2008,
         shelf_location="C-01", total_copies=6, available_copies=1, popularity=91, ai_score=78,
         description="A handbook of agile software craftsmanship."),
    dict(title="Design Patterns", author="Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
         isbn="9780201633610", category="Software Engineering", publisher="Addison-Wesley", published_year=1994,
         shelf_location="C-03", total_copies=5, available_copies=4, popularity=74, ai_score=70,
         description="Elements of reusable object-oriented software."),
    dict(title="Artificial Intelligence: A Modern Approach", author="Stuart Russell, Peter Norvig",
         isbn="9780134610993", category="AI / ML", publisher="Pearson", published_year=2020,
         shelf_location="A-01", total_copies=7, available_copies=0, popularity=98, ai_score=95,
         description="The leading textbook in AI, used in 1500+ universities worldwide."),
    dict(title="Data Science from Scratch", author="Joel Grus",
         isbn="9781492041139", category="Data Science", publisher="O'Reilly", published_year=2019,
         shelf_location="D-02", total_copies=9, available_copies=6, popularity=82, ai_score=81,
         description="First principles with Python for data science."),
    dict(title="The Pragmatic Programmer", author="Andrew Hunt, David Thomas",
         isbn="9780135957059", category="Software Engineering", publisher="Addison-Wesley", published_year=2019,
         shelf_location="C-05", total_copies=6, available_copies=3, popularity=87, ai_score=79,
         description="Your journey to mastery, 20th anniversary edition."),
    dict(title="Introduction to Algorithms", author="Cormen, Leiserson, Rivest, Stein",
         isbn="9780262046305", category="Computer Science", publisher="MIT Press", published_year=2022,
         shelf_location="E-01", total_copies=8, available_copies=4, popularity=89, ai_score=86,
         description="The comprehensive algorithms reference, known as CLRS."),
    dict(title="You Don't Know JS Yet", author="Kyle Simpson",
         isbn="9781091210095", category="Programming", publisher="Independently Published", published_year=2020,
         shelf_location="B-08", total_copies=5, available_copies=2, popularity=76, ai_score=72,
         description="A deep dive into the core mechanisms of JavaScript."),
    dict(title="The Hundred-Page Machine Learning Book", author="Andriy Burkov",
         isbn="9781999579500", category="AI / ML", publisher="Andriy Burkov", published_year=2019,
         shelf_location="A-14", total_copies=6, available_copies=3, popularity=84, ai_score=82,
         description="All you really need to know about ML in 100 pages."),
    dict(title="Refactoring", author="Martin Fowler",
         isbn="9780134757599", category="Software Engineering", publisher="Addison-Wesley", published_year=2018,
         shelf_location="C-07", total_copies=4, available_copies=2, popularity=79, ai_score=74,
         description="Improving the design of existing code."),
    dict(title="Database System Concepts", author="Silberschatz, Korth, Sudarshan",
         isbn="9780078022159", category="Computer Science", publisher="McGraw-Hill", published_year=2019,
         shelf_location="E-05", total_copies=7, available_copies=3, popularity=80, ai_score=75,
         description="The standard reference on database systems."),
    dict(title="Computer Networking: A Top-Down Approach", author="Kurose, Ross",
         isbn="9780133594140", category="Computer Science", publisher="Pearson", published_year=2016,
         shelf_location="E-09", total_copies=6, available_copies=2, popularity=77, ai_score=73,
         description="A top-down, internet-centric approach to networking."),
    dict(title="Storytelling with Data", author="Cole Nussbaumer Knaflic",
         isbn="9781119002253", category="Data Science", publisher="Wiley", published_year=2015,
         shelf_location="D-06", total_copies=5, available_copies=3, popularity=71, ai_score=68,
         description="A data visualization guide for business professionals."),
]

STUDENTS = [
    ("Karthikeyan S", "CSE"), ("Aravind Kumar", "AI & DS"), ("Vigneshwaran R", "ECE"),
    ("Surya Prakash", "IT"), ("Naveen Kumar", "Mech"), ("Hariharan M", "CSE"),
    ("Keerthana S", "AI & DS"), ("Nandhini R", "IT"), ("Janani P", "ECE"),
    ("Akshaya M", "CSE"), ("Divya Bharathi", "AI & DS"), ("Ramya K", "Civil"),
    ("Monisha V", "IT"), ("Dharshini S", "CSE"), ("Praveen Raj", "Mech"),
    ("Gokul Raj", "ECE"), ("Muthukumar", "AI & DS"), ("Abinaya R", "CSE"),
    ("Santhosh Kumar", "IT"), ("Deepika R", "Civil"),
]


def avatar(seed: str) -> str:
    return f"https://api.dicebear.com/9.x/notionists/svg?seed={seed.replace(' ', '+')}&backgroundColor=6d28d9,4f46e5,7c3aed"


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Book).count() > 0:
            print("Database already seeded — skipping.")
            return

        books = []
        for b in BOOKS:
            book = Book(cover_url=cover(b["isbn"]), added_at=days_ago(20 + len(books) * 3), **b)
            db.add(book)
            books.append(book)
        db.flush()

        students = []
        for i, (name, dept) in enumerate(STUDENTS):
            student = Student(
                name=name,
                email=f"{name.lower().replace(' ', '.')}@smartshelf.edu",
                department=dept,
                year=(i % 4) + 1,
                photo_url=avatar(name),
                joined_at=days_ago(200 + i * 5),
            )
            db.add(student)
            students.append(student)
        db.flush()

        borrow_seed = [
            (0, 0, 6, -8, None, 0, "active"),
            (2, 1, 20, -6, None, 30, "overdue"),
            (5, 2, 3, -11, None, 0, "active"),
            (3, 3, 30, -16, -14, 20, "returned"),
            (8, 4, 2, -12, None, 0, "active"),
            (1, 5, 10, -4, None, 0, "active"),
            (6, 6, 25, -11, None, 55, "overdue"),
            (10, 7, 1, -13, None, 0, "active"),
            (7, 8, 40, -26, -24, 10, "returned"),
            (9, 9, 5, -9, None, 0, "active"),
            (11, 10, 18, -4, None, 20, "overdue"),
            (4, 11, 7, -7, None, 0, "active"),
            (0, 12, 45, -31, -29, 15, "returned"),
            (2, 13, 4, -10, None, 0, "active"),
            (13, 14, 22, -8, None, 25, "overdue"),
            (12, 15, 9, -5, None, 0, "active"),
        ]
        for book_i, student_i, issued_days_ago, due_offset, returned_offset, fine, status in borrow_seed:
            db.add(BorrowRecord(
                book_id=books[book_i].id,
                student_id=students[student_i].id,
                issued_at=days_ago(issued_days_ago),
                due_at=days_ago(-due_offset) if due_offset < 0 else days_ahead(due_offset),
                returned_at=days_ago(-returned_offset) if returned_offset else None,
                fine=fine,
                status=status,
            ))

        notifications = [
            ("Overdue: Hands-On Machine Learning", "Vigneshwaran R is 6 days overdue on their loan.", "overdue"),
            ("AI: Demand spike detected", "'Artificial Intelligence: A Modern Approach' demand is up 38% this week.", "ai"),
            ("New arrivals", "12 new titles were added to the Data Science shelf.", "arrival"),
            ("Low stock alert", "'Deep Learning' has only 3 copies left in circulation.", "demand"),
            ("AI Recommendation", "Muthukumar is likely to enjoy 'Refactoring' based on reading history.", "ai"),
            ("Fine alert", "Hariharan M has an outstanding fine of ₹55.", "fine"),
        ]
        for title, body, kind in notifications:
            db.add(NotificationItem(title=title, body=body, kind=kind))

        # ---- Analytics series: hand-tuned for natural peaks/dips, never linear ----
        monthly = [
            ("Jan", 128, 112), ("Feb", 162, 148), ("Mar", 145, 130), ("Apr", 198, 180),
            ("May", 174, 158), ("Jun", 235, 212), ("Jul", 208, 189), ("Aug", 262, 240),
        ]
        for i, (month, borrows, returns) in enumerate(monthly):
            db.add(MonthlyTrend(month=month, borrows=borrows, returns=returns, order_index=i))

        forecast = [
            ("W1", 176, 184), ("W2", 225, 204), ("W3", 208, 236), ("W4", 252, 246),
            ("W5", None, 275), ("W6", None, 261), ("W7", None, 298),
        ]
        for i, (week, actual, fc) in enumerate(forecast):
            db.add(DemandForecastWeek(week=week, actual=actual, forecast=fc, order_index=i))

        categories = [
            ("AI / ML", 34), ("Programming", 22), ("Software Eng.", 18),
            ("Data Science", 14), ("Computer Science", 12),
        ]
        for category, value in categories:
            db.add(CategoryUsage(category=category, value=value))

        activity = [
            ("Mon", 52), ("Tue", 74), ("Wed", 61), ("Thu", 88),
            ("Fri", 69), ("Sat", 45), ("Sun", 33),
        ]
        for i, (day, visits) in enumerate(activity):
            db.add(StudentActivityDay(day=day, visits=visits, order_index=i))

        db.commit()
        print(f"Seeded {len(books)} books, {len(students)} students, "
              f"{len(borrow_seed)} borrow records, {len(notifications)} notifications.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
