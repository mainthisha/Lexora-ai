import { useEffect, useState } from "react";
import { Bell, AlertTriangle, PackagePlus, TrendingUp, Sparkles, IndianRupee, CheckCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const kindMeta: Record<NotificationItem["kind"], { icon: typeof Bell; tone: "danger" | "warning" | "ai" | "info" | "default" }> = {
  overdue: { icon: AlertTriangle, tone: "danger" },
  arrival: { icon: PackagePlus, tone: "info" },
  demand: { icon: TrendingUp, tone: "warning" },
  ai: { icon: Sparkles, tone: "ai" },
  fine: { icon: IndianRupee, tone: "danger" },
  info: { icon: Bell, tone: "default" },
};

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  function load() {
    api.listNotifications().then(setItems).catch(() => {});
  }

  useEffect(load, []);

  async function markRead(id: number) {
    await api.markNotificationRead(id);
    load();
  }

  async function markAll() {
    await api.markAllRead();
    load();
  }

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        actions={
          unreadCount > 0 ? (
            <Button size="sm" variant="secondary" onClick={markAll}>
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      <GlassCard className="p-0 overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" body="Overdue reminders, fine alerts, and AI insights will show up here." />
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {items.map((n) => {
              const meta = kindMeta[n.kind] ?? kindMeta.info;
              const Icon = meta.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={cn("w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]", !n.read && "bg-[var(--violet)]/[0.04]")}
                >
                  <div className="size-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate">{n.title}</span>
                      <Badge tone={meta.tone}>{n.kind}</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-faint)] mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-[var(--text-faint)]">{timeAgo(n.created_at)}</span>
                    {!n.read && <span className="size-1.5 rounded-full bg-[var(--violet)]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </GlassCard>
    </AppShell>
  );
}
