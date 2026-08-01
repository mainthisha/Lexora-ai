import { useEffect, useState } from "react";
import { Wand2, Flame, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Book, Recommendation, Student } from "@/types";

export default function Recommendations() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);

  useEffect(() => {
    api.listStudents().then(setStudents).catch(() => {});
    api.popularBooks(6).then(setTrending).catch(() => {});
  }, []);

  useEffect(() => {
    api.recommendations(studentId ? Number(studentId) : undefined, 6).then(setRecs).catch(() => {});
  }, [studentId]);

  return (
    <AppShell>
      <PageHeader
        title="Recommendations"
        subtitle="Personalized book suggestions powered by reading-pattern analysis."
        actions={<Badge tone="ai"><Sparkles className="size-3" /> Recommendation engine</Badge>}
      />

      <GlassCard glow>
        <SectionTitle title="Personalize for a student" hint="Category-affinity + popularity model" />
        <Select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="max-w-xs">
          <option value="">Library-wide trending</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.department}</option>
          ))}
        </Select>
      </GlassCard>

      <GlassCard>
        <SectionTitle title={studentId ? "Suggested for this student" : "Trending across the library"} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recs.map((r) => (
            <div key={r.book_id} className="glass glass-hover rounded-xl p-2.5 group">
              <img src={r.cover_url ?? undefined} alt="" className="w-full aspect-[2/3] object-cover rounded-lg bg-white/5" />
              <div className="mt-2">
                <div className="text-[11px] font-medium truncate">{r.title}</div>
                <div className="text-[10px] text-[var(--text-faint)] truncate">{r.author}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <Badge tone="ai">{r.match_score}%</Badge>
                </div>
                <div className="text-[9px] text-[var(--text-faint)] mt-1 line-clamp-2">{r.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Trending this week" hint="Highest velocity across all readers" />
        <div className="space-y-2">
          {trending.map((b, i) => (
            <div key={b.id} className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-semibold text-[var(--text-faint)] shrink-0">
                {i + 1}
              </div>
              <img src={b.cover_url ?? undefined} alt="" className="w-7 h-10 object-cover rounded shrink-0 bg-white/5" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate">{b.title}</div>
                <div className="text-[10px] text-[var(--text-faint)] truncate">{b.category}</div>
              </div>
              <Badge tone="warning"><Flame className="size-2.5" /> {b.popularity}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
        <Wand2 className="size-3.5" /> Recommendations recompute automatically as new borrow activity comes in.
      </div>
    </AppShell>
  );
}
