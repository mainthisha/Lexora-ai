import { useEffect, useState } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { api, ApiError } from "@/lib/api";
import type { Book, BorrowRecord, Student } from "@/types";

export default function Borrow() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueDays, setDueDays] = useState(14);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [active, setActive] = useState<BorrowRecord[]>([]);

  async function load() {
    const [b, s, r] = await Promise.all([api.listBooks(), api.listStudents(), api.listBorrowRecords("active")]);
    setBooks(b.filter((x) => x.available_copies > 0));
    setStudents(s);
    setActive(r);
  }

  useEffect(() => { load(); }, []);

  async function issue() {
    setMessage(null);
    if (!bookId || !studentId) {
      setMessage({ type: "err", text: "Select both a book and a student first." });
      return;
    }
    try {
      const record = await api.issueBook(Number(bookId), Number(studentId), dueDays);
      setMessage({ type: "ok", text: `Issued "${record.book_title}" to ${record.student_name}.` });
      setBookId("");
      setStudentId("");
      load();
    } catch (err) {
      setMessage({ type: "err", text: err instanceof ApiError ? err.message : "Could not issue this book." });
    }
  }

  return (
    <AppShell>
      <PageHeader title="Borrow" subtitle="Issue a book to a student." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard glow className="lg:col-span-1">
          <SectionTitle title="Issue a book" />
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Book</label>
              <Select value={bookId} onChange={(e) => setBookId(e.target.value)}>
                <option value="">Select a book…</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Student</label>
              <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">Select a student…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.department}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Loan period (days)</label>
              <Select value={dueDays} onChange={(e) => setDueDays(Number(e.target.value))}>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={30}>30 days</option>
              </Select>
            </div>

            {message && (
              <div className={`text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 ${message.type === "ok" ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-300 bg-rose-500/10 border border-rose-500/20"}`}>
                {message.type === "ok" && <Check className="size-3.5 shrink-0" />}
                {message.text}
              </div>
            )}

            <Button onClick={issue} className="w-full">
              <ArrowLeftRight className="size-4" /> Issue book
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Currently on loan" hint={`${active.length} active loans`} />
          {active.length === 0 ? (
            <EmptyState icon={ArrowLeftRight} title="No active loans" body="Issue a book above to see it appear here." />
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {active.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{r.book_title}</div>
                    <div className="text-[var(--text-faint)] truncate">{r.student_name}</div>
                  </div>
                  <Badge tone={r.status === "overdue" ? "danger" : "info"}>
                    {r.status === "overdue" ? "Overdue" : `Due ${new Date(r.due_at).toLocaleDateString()}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </AppShell>
  );
}
