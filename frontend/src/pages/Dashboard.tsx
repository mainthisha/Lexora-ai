import { useEffect, useState } from "react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { BookMarked, Users, TrendingUp, AlertTriangle, PackageCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { chartTooltipStyle, axisStyle, chartColors, pieColors } from "@/components/charts/chartTheme";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import type { Stats, MonthlyTrend, DemandForecast, CategoryUsage, StudentActivity, BorrowRecord, Book } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTrend[]>([]);
  const [forecast, setForecast] = useState<DemandForecast[]>([]);
  const [categories, setCategories] = useState<CategoryUsage[]>([]);
  const [activity, setActivity] = useState<StudentActivity[]>([]);
  const [recentBorrows, setRecentBorrows] = useState<BorrowRecord[]>([]);
  const [topBooks, setTopBooks] = useState<Book[]>([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
    api.monthlyTrend().then(setMonthly).catch(() => {});
    api.demandForecast().then(setForecast).catch(() => {});
    api.categoryUsage().then(setCategories).catch(() => {});
    api.studentActivity().then(setActivity).catch(() => {});
    api.listBorrowRecords().then((r) => setRecentBorrows(r.slice(0, 5))).catch(() => {});
    api.popularBooks(5).then(setTopBooks).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Total Books", value: stats.total_books, icon: BookMarked, tone: "ai" as const },
        { label: "Borrowed", value: stats.borrowed_books, icon: ArrowUpRight, tone: "info" as const },
        { label: "Active Students", value: stats.active_students, icon: Users, tone: "success" as const },
        { label: "Overdue", value: stats.overdue_books, icon: AlertTriangle, tone: "danger" as const },
        { label: "Available", value: stats.available_books, icon: PackageCheck, tone: "default" as const },
        { label: "AI Score", value: `${stats.ai_score}%`, icon: Sparkles, tone: "ai" as const },
      ]
    : [];

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your library's health and AI-driven activity."
        actions={<Badge tone="ai"><Sparkles className="size-3" /> Live insights</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {stats
          ? cards.map((c) => <StatCard key={c.label} {...c} />)
          : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Borrow trend" hint="Monthly borrows vs. returns" />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="borrowsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.violet} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartColors.violet} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="returnsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.sky} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartColors.sky} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="borrows" stroke={chartColors.violet} strokeWidth={2.5} fill="url(#borrowsFill)" />
                <Area type="monotone" dataKey="returns" stroke={chartColors.sky} strokeWidth={2} fill="url(#returnsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Category usage" hint="Share by category" />
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="category" innerRadius={48} outerRadius={82} paddingAngle={3}>
                  {categories.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-1">
            {categories.map((c, i) => (
              <div key={c.category} className="flex items-center gap-1.5 text-[10px] text-[var(--text-faint)]">
                <span className="size-1.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                {c.category}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard>
          <SectionTitle title="Demand forecast" hint="AI-predicted, weekly" />
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={forecast}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="actual" stroke={chartColors.emerald} strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke={chartColors.violetSoft} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Student engagement" hint="Weekly footfall" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={activity}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                  {activity.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? chartColors.violet : chartColors.indigo} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Popular books" hint="By AI popularity score" />
          <div className="space-y-3">
            {topBooks.map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <img src={b.cover_url ?? undefined} alt="" className="w-8 h-11 object-cover rounded shrink-0 bg-white/5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{b.title}</div>
                  <div className="text-[10px] text-[var(--text-faint)] truncate">{b.category}</div>
                </div>
                <Badge tone="ai">{b.popularity}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Recent activity" hint="Latest borrow & return events" />
        <div className="divide-y divide-white/[0.06]">
          {recentBorrows.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp className="size-3.5 text-[var(--violet-soft)] shrink-0" />
                <span className="truncate">
                  <span className="text-[var(--text)]">{r.student_name}</span>
                  <span className="text-[var(--text-faint)]"> {r.status === "returned" ? "returned" : "borrowed"} </span>
                  <span className="text-[var(--text)]">{r.book_title}</span>
                </span>
              </div>
              <span className="text-[var(--text-faint)] shrink-0 ml-3">{timeAgo(r.issued_at)}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string | number; icon: typeof BookMarked; tone: "ai" | "info" | "success" | "danger" | "default" }) {
  const iconBg: Record<string, string> = {
    ai: "from-[var(--violet)] to-[var(--sky)]",
    info: "from-sky-500 to-cyan-400",
    success: "from-emerald-500 to-teal-400",
    danger: "from-rose-500 to-orange-400",
    default: "from-slate-500 to-slate-400",
  };
  return (
    <GlassCard hover className="col-span-1">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] text-[var(--text-faint)]">{label}</div>
          <div className="text-2xl font-semibold mt-1 font-[var(--font-display)]">{value}</div>
        </div>
        <div className={`size-9 rounded-xl bg-gradient-to-br ${iconBg[tone]} flex items-center justify-center shrink-0`}>
          <Icon className="size-4 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
