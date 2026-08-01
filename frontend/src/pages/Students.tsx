import { useEffect, useState } from "react";
import { Search, Users, Mail, GraduationCap } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { BorrowRecord, Student } from "@/types";

const departments = ["All", "CSE", "AI & DS", "ECE", "IT", "Mech", "Civil"];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [selected, setSelected] = useState<Student | null>(null);
  const [history, setHistory] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api.listStudents({ q, department: dept }).then(setStudents).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, dept]);

  async function openStudent(s: Student) {
    setSelected(s);
    const h = await api.studentHistory(s.id);
    setHistory(h);
  }

  return (
    <AppShell>
      <PageHeader title="Students" subtitle={`${students.length} registered students`} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-faint)]" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="pl-9" />
        </div>
        <Select value={dept} onChange={(e) => setDept(e.target.value)} className="w-40">
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-white/[0.06]">{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : students.length === 0 ? (
            <EmptyState icon={Users} title="No students found" body="Try a different search term or department filter." />
          ) : (
            <div className="divide-y divide-white/[0.06] max-h-[560px] overflow-y-auto">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openStudent(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] ${selected?.id === s.id ? "bg-white/[0.04]" : ""}`}
                >
                  <img src={s.photo_url ?? undefined} alt="" className="size-9 rounded-full bg-white/5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate">{s.name}</div>
                    <div className="text-[10px] text-[var(--text-faint)] truncate">{s.department} · Year {s.year}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge tone={s.active_borrows > 0 ? "info" : "default"}>{s.active_borrows} active</Badge>
                    {s.total_fines > 0 && <Badge tone="danger">₹{s.total_fines}</Badge>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          {!selected ? (
            <EmptyState icon={GraduationCap} title="Select a student" body="Choose a student from the list to view their profile and borrowing history." />
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={selected.photo_url ?? undefined} alt="" className="size-14 rounded-2xl bg-white/5" />
                <div>
                  <div className="text-sm font-semibold">{selected.name}</div>
                  <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1"><Mail className="size-3" /> {selected.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <MiniStat label="Active" value={selected.active_borrows} />
                <MiniStat label="Total" value={selected.total_borrows} />
                <MiniStat label="Fines" value={`₹${selected.total_fines}`} />
              </div>

              <div className="text-[11px] font-medium text-[var(--text-muted)] mb-2">Borrow history</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 && <p className="text-xs text-[var(--text-faint)]">No borrow history yet.</p>}
                {history.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs">
                    <span className="truncate text-[var(--text)]">{r.book_title}</span>
                    <Badge tone={r.status === "overdue" ? "danger" : r.status === "returned" ? "success" : "info"}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[9px] text-[var(--text-faint)] mt-0.5">{label}</div>
    </div>
  );
}
