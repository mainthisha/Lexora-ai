import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Sparkles, TrendingUp, AlertTriangle, Flame } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { chartTooltipStyle, axisStyle, chartColors } from "@/components/charts/chartTheme";
import { api } from "@/lib/api";
import type { Alert, Book, DemandForecast } from "@/types";

export default function Insights() {
  const [forecast, setForecast] = useState<DemandForecast[]>([]);
  const [popular, setPopular] = useState<Book[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    api.demandForecast().then(setForecast).catch(() => {});
    api.popularBooks(8).then(setPopular).catch(() => {});
    api.alerts().then(setAlerts).catch(() => {});
  }, []);

  const confidence = 86;

  return (
    <AppShell>
      <PageHeader
        title="AI Insights"
        subtitle="Demand spikes, reading trends, and predictive intelligence."
        actions={<Badge tone="ai"><Sparkles className="size-3" /> Live model</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InsightCard icon={TrendingUp} title="Demand spike" value="+38%" hint="AI/ML category, last 7 days" tone="ai" />
        <InsightCard icon={Flame} title="Hottest title" value={popular[0]?.title ?? "—"} hint="Highest popularity score right now" tone="warning" />
        <InsightCard icon={AlertTriangle} title="At-risk stock" value={`${popular.filter((b) => b.available_copies <= 2).length} titles`} hint="Predicted stockouts this week" tone="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Demand forecast (weekly)" hint={`${confidence}% model confidence`} />
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={forecast}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="actual" stroke={chartColors.emerald} strokeWidth={2.5} dot={{ r: 4 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke={chartColors.violetSoft} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="AI confidence" />
          <div className="h-56 relative">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "conf", value: confidence, fill: chartColors.violetSoft }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-semibold">{confidence}%</div>
              <div className="text-xs text-[var(--text-faint)]">Model confidence</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-[var(--text-muted)]">
            <Row label="Training samples" value="24.3k" />
            <Row label="Last retrain" value="6h ago" />
            <Row label="MAPE" value="7.4%" />
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Popularity heatmap" hint="Top 8 titles · relative demand" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {popular.map((b) => (
            <div key={b.id} className="glass rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={b.cover_url ?? undefined}
                  alt={b.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{ background: `linear-gradient(135deg, rgba(139,92,246,${b.popularity / 100}), rgba(56,189,248,${b.popularity / 200}))` }}
                />
              </div>
              <div className="p-2">
                <div className="text-[10px] font-medium truncate">{b.title}</div>
                <div className="text-[10px] text-[var(--text-faint)]">{b.popularity}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Smart alerts" hint="Auto-detected patterns" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((a, i) => (
            <div key={i} className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={a.tone}>{a.tone === "ai" ? "AI" : a.tone}</Badge>
                <div className="text-sm font-medium">{a.title}</div>
              </div>
              <div className="text-xs text-[var(--text-faint)]">{a.body}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}

function InsightCard({ icon: Icon, title, value, hint, tone }: { icon: typeof TrendingUp; title: string; value: string; hint: string; tone: "ai" | "warning" | "danger" }) {
  return (
    <GlassCard hover>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs text-[var(--text-faint)]">{title}</div>
          <div className="text-xl font-semibold mt-1 truncate">{value}</div>
          <div className="text-[11px] text-[var(--text-faint)] mt-1">{hint}</div>
        </div>
        <div className="size-10 rounded-xl bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] flex items-center justify-center shrink-0">
          <Icon className="size-5 text-white" />
        </div>
      </div>
      <Badge tone={tone} className="mt-3">AI</Badge>
    </GlassCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-[var(--text)]">{value}</span>
    </div>
  );
}