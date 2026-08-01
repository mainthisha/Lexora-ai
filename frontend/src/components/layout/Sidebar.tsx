import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, Undo2, Sparkles,
  BarChart3, Wand2, Bell, Settings, HelpCircle, Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/books", icon: BookOpen, label: "Books" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/borrow", icon: ArrowLeftRight, label: "Borrow" },
  { to: "/returns", icon: Undo2, label: "Returns" },
  { to: "/insights", icon: Sparkles, label: "AI Insights" },
  { to: "/recommendations", icon: Wand2, label: "Recommendations" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
];

const bottomNav = [
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/help", icon: HelpCircle, label: "Help & Support" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-white/[0.07] px-3 py-5">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="size-9 rounded-xl bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] flex items-center justify-center shrink-0">
          <Library className="size-4.5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold font-[var(--font-display)] leading-tight">Lexora AI</div>
          <div className="text-[10px] text-[var(--text-faint)] leading-tight truncate">Library Intelligence</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="pt-3 mt-3 border-t border-white/[0.07] space-y-1">
        {bottomNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </aside>
  );
}

function NavItem({ to, icon: Icon, label, end }: { to: string; icon: typeof LayoutDashboard; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors relative",
          isActive
            ? "text-white bg-gradient-to-r from-[var(--violet)]/25 to-transparent"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gradient-to-b from-[var(--violet)] to-[var(--sky)]" />}
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}
