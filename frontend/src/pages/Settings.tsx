import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [fineRate, setFineRate] = useState(5);
  const [loanDays, setLoanDays] = useState(14);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [notifyArrivals, setNotifyArrivals] = useState(true);

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Manage your profile and library policies." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <SectionTitle title="Profile" />
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Email</label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <Button size="sm">Save profile</Button>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Library policy" />
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Default loan period (days)</label>
              <Input type="number" value={loanDays} onChange={(e) => setLoanDays(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">Fine per overdue day (₹)</label>
              <Input type="number" value={fineRate} onChange={(e) => setFineRate(Number(e.target.value))} />
            </div>
            <Button size="sm">Save policy</Button>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Notification preferences" />
          <div className="space-y-3">
            <Toggle label="Overdue reminders" checked={notifyOverdue} onChange={setNotifyOverdue} />
            <Toggle label="New arrival alerts" checked={notifyArrivals} onChange={setNotifyArrivals} />
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-[var(--violet)]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
