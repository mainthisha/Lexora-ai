import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChatWidget } from "@/hooks/useChatWidget";
import { api } from "@/lib/api";
import { initials } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { open: openChat } = useChatWidget();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.listNotifications().then((n) => setUnread(n.filter((x) => !x.read).length)).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 py-3.5 border-b border-white/[0.07] bg-[var(--bg)]/70 backdrop-blur-xl">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-faint)]" />
        <input
          placeholder="Search books, students, or ask AI…"
          className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-9 pr-3 py-2 text-sm placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--violet)]/50 focus:bg-white/[0.06] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={openChat} className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--violet-soft)] bg-[var(--violet)]/10 border border-[var(--violet)]/25 hover:bg-[var(--violet)]/15 transition-colors">
          <Sparkles className="size-3.5" /> Ask AI
        </button>

        <button
          onClick={() => navigate("/notifications")}
          className="relative size-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.05] transition-colors"
        >
          <Bell className="size-4.5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--bg)]" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-white/[0.05] transition-colors"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="size-7 rounded-full bg-white/10" />
            ) : (
              <div className="size-7 rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] flex items-center justify-center text-[10px] font-semibold text-white">
                {user ? initials(user.name) : "?"}
              </div>
            )}
            <span className="hidden md:block text-xs font-medium text-[var(--text-muted)]">{user?.name.split(" ")[0]}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 glass rounded-xl p-1.5 shadow-2xl">
              <button
                onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06]"
              >
                Admin profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06]"
              >
                Settings
              </button>
              <div className="my-1 border-t border-white/[0.07]" />
              <button
                onClick={() => { setMenuOpen(false); logout(); navigate("/login"); }}
                className="w-full flex items-center gap-1.5 text-left text-xs px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut className="size-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
