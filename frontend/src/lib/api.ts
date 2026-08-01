import type {
  Alert,
  AuthResponse,
  Book,
  BorrowRecord,
  CategoryUsage,
  ChatResponse,
  DemandForecast,
  MonthlyTrend,
  NotificationItem,
  Recommendation,
  Stats,
  Student,
  StudentActivity,
  User,
} from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("smartshelf_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // ---- auth ----
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/api/auth/me"),

  // ---- books ----
  listBooks: (params?: { q?: string; category?: string; sort?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Book[]>(`/api/books${qs ? `?${qs}` : ""}`);
  },
  categories: () => request<string[]>("/api/books/categories"),
  getBook: (id: number) => request<Book>(`/api/books/${id}`),
  createBook: (payload: Partial<Book>) => request<Book>("/api/books", { method: "POST", body: JSON.stringify(payload) }),
  updateBook: (id: number, payload: Partial<Book>) =>
    request<Book>(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteBook: (id: number) => request<void>(`/api/books/${id}`, { method: "DELETE" }),

  // ---- students ----
  listStudents: (params?: { q?: string; department?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Student[]>(`/api/students${qs ? `?${qs}` : ""}`);
  },
  getStudent: (id: number) => request<Student>(`/api/students/${id}`),
  createStudent: (payload: Partial<Student>) => request<Student>("/api/students", { method: "POST", body: JSON.stringify(payload) }),
  studentHistory: (id: number) => request<BorrowRecord[]>(`/api/students/${id}/history`),

  // ---- borrow / return ----
  listBorrowRecords: (status?: string) =>
    request<BorrowRecord[]>(`/api/borrow${status ? `?status=${status}` : ""}`),
  issueBook: (book_id: number, student_id: number, due_in_days = 14) =>
    request<BorrowRecord>("/api/borrow/issue", { method: "POST", body: JSON.stringify({ book_id, student_id, due_in_days }) }),
  returnBook: (recordId: number) => request<BorrowRecord>(`/api/borrow/${recordId}/return`, { method: "POST" }),
  renewBook: (recordId: number, days = 7) =>
    request<BorrowRecord>(`/api/borrow/${recordId}/renew?days=${days}`, { method: "POST" }),

  // ---- analytics ----
  stats: () => request<Stats>("/api/analytics/stats"),
  monthlyTrend: () => request<MonthlyTrend[]>("/api/analytics/monthly-trend"),
  categoryUsage: () => request<CategoryUsage[]>("/api/analytics/category-usage"),
  studentActivity: () => request<StudentActivity[]>("/api/analytics/student-activity"),

  // ---- AI insights ----
  demandForecast: () => request<DemandForecast[]>("/api/insights/demand-forecast"),
  popularBooks: (limit = 8) => request<Book[]>(`/api/insights/popular-books?limit=${limit}`),
  alerts: () => request<Alert[]>("/api/insights/alerts"),
  recommendations: (studentId?: number, limit = 6) =>
    request<Recommendation[]>(`/api/insights/recommendations?limit=${limit}${studentId ? `&student_id=${studentId}` : ""}`),

  // ---- notifications ----
  listNotifications: () => request<NotificationItem[]>("/api/notifications"),
  markNotificationRead: (id: number) => request<NotificationItem>(`/api/notifications/${id}/read`, { method: "POST" }),
  markAllRead: () => request<NotificationItem[]>("/api/notifications/read-all", { method: "POST" }),

  // ---- AI chatbot ----
  chat: (message: string, studentId?: number) =>
    request<ChatResponse>("/api/chatbot", { method: "POST", body: JSON.stringify({ message, student_id: studentId }) }),
};

export { ApiError };
