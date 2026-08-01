import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { chartTooltipStyle, axisStyle, chartColors } from "@/components/charts/chartTheme";
import { api } from "@/lib/api";
import type { CategoryUsage, MonthlyTrend, StudentActivity } from "@/types";

export default function Analytics() {
  const [monthly, setMonthly] = useState<MonthlyTrend[]>([]);
  const [categories, setCategories] = useState<CategoryUsage[]>([]);
  const [activity, setActivity] = useState<StudentActivity[]>([]);

  useEffect(() => {
    api.monthlyTrend().then(setMonthly).catch(() => {});
    api.categoryUsage().then(setCategories).catch(() => {});
    api.studentActivity().then(setActivity).catch(() => {});
  }, []);

  function exportCsv() {
    const rows = [["Month", "Borrows", "Returns"], ...monthly.map((m) => [m.month, String(m.borrows), String(m.returns)])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smartshelf-monthly-trend.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Category, borrow, and engagement analytics with export."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={exportCsv}><FileSpreadsheet className="size-3.5" /> CSV</Button>
            <Button size="sm" variant="secondary"><FileText className="size-3.5" /> PDF</Button>
            <Button size="sm"><Download className="size-3.5" /> Export all</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <SectionTitle title="Category usage" hint="Books borrowed by category" />
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={categories} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" {...axisStyle} />
                <YAxis type="category" dataKey="category" {...axisStyle} width={110} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {categories.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? chartColors.violet : chartColors.sky} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Monthly borrow trend" hint="Borrows vs. returns" />
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="reportBorrows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.violet} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartColors.violet} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="borrows" stroke={chartColors.violet} strokeWidth={2.5} fill="url(#reportBorrows)" />
                <Area type="monotone" dataKey="returns" stroke={chartColors.sky} strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Student engagement" hint="Weekly library footfall" />
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={activity}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="visits" fill={chartColors.indigo} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </AppShell>
  );
}
