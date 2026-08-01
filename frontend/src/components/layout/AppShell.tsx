import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ChatWidgetProvider } from "@/hooks/useChatWidget";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ChatWidgetProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1 px-4 lg:px-6 py-6 space-y-4 max-w-[1400px] w-full mx-auto"
          >
            {children}
          </motion.main>
        </div>
        <ChatWidget />
      </div>
    </ChatWidgetProvider>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text)]">{title}</h1>
        {subtitle && <p className="text-xs text-[var(--text-faint)] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
