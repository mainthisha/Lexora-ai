import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "section";
}

export function GlassCard({ children, className, hover, glow, as = "div" }: GlassCardProps) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-5 relative",
        hover && "glass-hover hover:-translate-y-0.5",
        glow && "gradient-border",
        className
      )}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h3 className="text-sm font-semibold text-[var(--text)] tracking-wide">{title}</h3>
      {hint && <span className="text-[11px] text-[var(--text-faint)]">{hint}</span>}
    </div>
  );
}
