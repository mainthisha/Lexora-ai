import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AppShell>
      <PageHeader title="Admin Profile" subtitle="Your account details and recent activity." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-1 text-center">
          <img src={user.avatar_url ?? undefined} alt={user.name} className="size-20 rounded-2xl bg-white/5 mx-auto" />
          <div className="text-sm font-semibold mt-3">{user.name}</div>
          <div className="text-xs text-[var(--text-faint)]">{user.email}</div>
          <Badge tone="ai" className="mt-3 capitalize">{user.role}</Badge>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Recent activity" />
          <div className="space-y-3 text-xs text-[var(--text-muted)]">
            <div>Issued <span className="text-[var(--text-foreground)] text-[var(--text)]">Deep Learning</span> to Karthikeyan S · 2h ago</div>
            <div>Approved a renewal request for Praveen Raj · 5h ago</div>
            <div>Added 3 new titles to the Data Science shelf · 1d ago</div>
            <div>Resolved an overdue fine for Hariharan M · 2d ago</div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
