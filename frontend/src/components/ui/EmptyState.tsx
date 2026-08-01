import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="size-12 rounded-2xl bg-gradient-to-br from-[var(--violet)]/25 to-[var(--sky)]/15 flex items-center justify-center mb-4">
        <Icon className="size-5 text-[var(--violet-soft)]" />
      </div>
      <div className="text-sm font-medium text-[var(--text)]">{title}</div>
      <div className="text-xs text-[var(--text-faint)] mt-1 max-w-xs">{body}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
