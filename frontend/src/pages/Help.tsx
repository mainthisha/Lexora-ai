import { useState } from "react";
import { LifeBuoy, Mail, MessageCircle, ChevronDown } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How do I issue a book to a student?", a: "Go to Borrow, pick a book and student from the dropdowns, choose a loan period, and click Issue book. The system checks copy availability automatically." },
  { q: "How are fines calculated?", a: "Fines accrue automatically once a loan passes its due date, based on the per-day rate set in Settings → Library policy." },
  { q: "Where do AI recommendations come from?", a: "The recommendation engine scores books by category overlap with a student's borrow history, blended with overall popularity and an AI relevance score." },
  { q: "Can I export analytics?", a: "Yes — the Reports & Analytics page supports CSV and PDF export for monthly trends and category usage." },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AppShell>
      <PageHeader title="Help & Support" subtitle="Guides, FAQs, and ways to reach the team." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Frequently asked questions" />
          <div className="divide-y divide-white/[0.06]">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-left text-sm font-medium"
                >
                  {f.q}
                  <ChevronDown className={cn("size-4 text-[var(--text-faint)] transition-transform", openIndex === i && "rotate-180")} />
                </button>
                {openIndex === i && <p className="text-xs text-[var(--text-faint)] pb-3 leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Contact support" />
          <div className="space-y-3">
            <Input placeholder="Subject" />
            <Textarea placeholder="Describe your issue…" rows={4} />
            <Button className="w-full"><MessageCircle className="size-4" /> Send message</Button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)] mt-4">
            <Mail className="size-3.5" /> support@lexora.ai
          </div>
        </GlassCard>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
        <LifeBuoy className="size-3.5" /> Most issues are resolved within one business day.
      </div>
    </AppShell>
  );
}
