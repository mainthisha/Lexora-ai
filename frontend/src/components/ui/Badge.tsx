import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "ai" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<Tone, string> = {
  default: "bg-white/[0.06] text-[var(--text-muted)] border-white/10",
  ai: "bg-[var(--violet)]/15 text-[var(--violet-soft)] border-[var(--violet)]/30",
  success: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  warning: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  danger: "bg-rose-400/10 text-rose-300 border-rose-400/25",
  info: "bg-sky-400/10 text-sky-300 border-sky-400/25",
};

export function Badge({ tone = "default", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
