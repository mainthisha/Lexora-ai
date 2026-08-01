import { useEffect, useState } from "react";
import { Undo2, RotateCw, IndianRupee } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { BorrowRecord } from "@/types";

export default function Returns() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "overdue">("all");

  async function load() {
    setLoading(true);
    const all = await api.listBorrowRecords();
    setRecords(all.filter((r) => r.status !== "returned"));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function returnBook(id: number) {
    await api.returnBook(id);
    load();
  }

  async function renew(id: number) {
    await api.renewBook(id, 7);
    load();
  }

  const shown = filter === "overdue" ? records.filter((r) => r.status === "overdue") : records;

  return (
    <AppShell>
      <PageHeader
        title="Returns"
        subtitle="Process returns, renewals, and outstanding fines."
        actions={
          <div className="flex gap-1.5">
            <Button size="sm" variant={filter === "all" ? "primary" : "secondary"} onClick={() => setFilter("all")}>All</Button>
            <Button size="sm" variant={filter === "overdue" ? "primary" : "secondary"} onClick={() => setFilter("overdue")}>Overdue</Button>
          </div>
        }
      />

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/[0.06]">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : shown.length === 0 ? (
          <EmptyState icon={Undo2} title="Nothing due" body="All caught up — no active loans match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-[var(--text-faint)] border-b border-white/[0.06]">
                  <th className="font-medium px-4 py-3">Book</th>
                  <th className="font-medium px-4 py-3 hidden md:table-cell">Student</th>
                  <th className="font-medium px-4 py-3 hidden sm:table-cell">Due date</th>
                  <th className="font-medium px-4 py-3">Status</th>
                  <th className="font-medium px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {shown.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5 font-medium truncate max-w-[200px]">{r.book_title}</td>
                    <td className="px-4 py-2.5 hidden md:table-cell text-[var(--text-muted)]">{r.student_name}</td>
                    <td className="px-4 py-2.5 hidden sm:table-cell text-[var(--text-muted)]">{formatDate(r.due_at)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Badge tone={r.status === "overdue" ? "danger" : "info"}>{r.status}</Badge>
                        {r.fine > 0 && (
                          <Badge tone="warning"><IndianRupee className="size-2.5" />{r.fine}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => renew(r.id)}>
                          <RotateCw className="size-3.5" /> Renew
                        </Button>
                        <Button size="sm" onClick={() => returnBook(r.id)}>
                          <Undo2 className="size-3.5" /> Return
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </AppShell>
  );
}
