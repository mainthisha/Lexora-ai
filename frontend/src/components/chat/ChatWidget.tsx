import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { useChatWidget } from "@/hooks/useChatWidget";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/types";

const SUGGESTIONS = ["Show overdue books", "Who has fines?", "Most popular books", "Available AI books"];

export function ChatWidget() {
  const { isOpen, toggle, close } = useChatWidget();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm the Lexora AI assistant. Ask me about overdue books, fines, popular titles, or search the catalog.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: res.reply, results: res.results },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: "Sorry, I couldn't reach the library data just now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-40 size-13 rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] shadow-[0_8px_30px_-6px_rgba(139,92,246,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="sparkle" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="size-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-22 right-5 z-40 w-[min(380px,calc(100vw-2.5rem))] h-[min(520px,calc(100vh-8rem))] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.07] shrink-0">
              <div className="size-8 rounded-lg bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] flex items-center justify-center">
                <Bot className="size-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold">Lexora AI Assistant</div>
                <div className="text-[10px] text-[var(--text-faint)]">Answers from your live library data</div>
              </div>
              <button onClick={close} className="text-[var(--text-faint)] hover:text-[var(--text)] p-1">
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-[var(--violet)] to-[var(--indigo)] text-white"
                        : "bg-white/[0.05] border border-white/[0.07] text-[var(--text)]"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.results && m.results.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {m.results.map((r, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 bg-black/20 rounded-lg px-2 py-1.5">
                            <span className="truncate text-[11px] font-medium">{r.label}</span>
                            {r.sublabel && (
                              <Badge tone={(r.tone as "default" | "ai" | "success" | "warning" | "danger" | "info") ?? "default"} className="shrink-0">
                                {r.sublabel}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.05] border border-white/[0.07] rounded-xl px-3 py-2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1.5 rounded-full bg-[var(--text-faint)] animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.08] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 p-3 border-t border-white/[0.07] shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about books, fines, students…"
                className="flex-1 rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-xs placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--violet)]/60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="size-8 rounded-lg bg-gradient-to-br from-[var(--violet)] to-[var(--indigo)] flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send className="size-3.5 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
