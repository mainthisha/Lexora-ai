export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher?: string | null;
  published_year?: number | null;
  language: string;
  shelf_location?: string | null;
  total_copies: number;
  available_copies: number;
  cover_url?: string | null;
  popularity: number;
  ai_score: number;
  description?: string | null;
  added_at: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  photo_url?: string | null;
  joined_at: string;
  active_borrows: number;
  total_borrows: number;
  total_fines: number;
}

export interface BorrowRecord {
  id: number;
  book_id: number;
  student_id: number;
  issued_at: string;
  due_at: string;
  returned_at: string | null;
  fine: number;
  status: "active" | "returned" | "overdue";
  book_title?: string | null;
  student_name?: string | null;
}

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  kind: "overdue" | "arrival" | "demand" | "ai" | "fine" | "info";
  read: boolean;
  created_at: string;
}

export interface Stats {
  total_books: number;
  borrowed_books: number;
  available_books: number;
  overdue_books: number;
  active_students: number;
  new_arrivals: number;
  ai_score: number;
}

export interface MonthlyTrend {
  month: string;
  borrows: number;
  returns: number;
}

export interface DemandForecast {
  week: string;
  actual: number | null;
  forecast: number;
}

export interface CategoryUsage {
  category: string;
  value: number;
}

export interface StudentActivity {
  day: string;
  visits: number;
}

export interface Alert {
  tone: "danger" | "warning" | "ai" | "info";
  title: string;
  body: string;
}

export interface Recommendation {
  book_id: number;
  title: string;
  author: string;
  cover_url?: string | null;
  reason: string;
  match_score: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
}

export interface ChatResult {
  label: string;
  sublabel?: string | null;
  tone?: "default" | "ai" | "success" | "warning" | "danger" | "info" | null;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  results: ChatResult[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  results?: ChatResult[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
