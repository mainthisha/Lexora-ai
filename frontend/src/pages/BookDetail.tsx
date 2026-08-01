import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Languages, Building2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard, SectionTitle } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Book } from "@/types";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (id) api.getBook(Number(id)).then(setBook).catch(() => {});
  }, [id]);

  if (!book) {
    return (
      <AppShell>
        <div className="h-48 flex items-center justify-center text-[var(--text-faint)] text-sm">Loading book…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] hover:text-[var(--text)] mb-1">
        <ArrowLeft className="size-3.5" /> Back to books
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-1">
          <img src={book.cover_url ?? undefined} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-xl bg-white/5" />
          <div className="mt-4 space-y-2">
            <Badge tone={book.available_copies === 0 ? "danger" : "success"}>
              {book.available_copies} of {book.total_copies} available
            </Badge>
            <Badge tone="ai" className="ml-2"><Sparkles className="size-3" /> AI score {book.ai_score}%</Badge>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge>{book.category}</Badge>
                <h1 className="text-xl font-semibold mt-2">{book.title}</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{book.author}</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4 leading-relaxed">{book.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/[0.07]">
              <Meta icon={Building2} label="Publisher" value={book.publisher ?? "—"} />
              <Meta icon={Calendar} label="Published" value={String(book.published_year ?? "—")} />
              <Meta icon={Languages} label="Language" value={book.language} />
              <Meta icon={MapPin} label="Shelf" value={book.shelf_location ?? "—"} />
            </div>
          </GlassCard>

          <GlassCard>
            <SectionTitle title="ISBN" />
            <p className="text-sm font-mono text-[var(--text-muted)]">{book.isbn}</p>
          </GlassCard>

          <div className="flex gap-2">
            <Button disabled={book.available_copies === 0} onClick={() => navigate(`/borrow?bookId=${book.id}`)}>
              Issue this book
            </Button>
            <Button variant="secondary" onClick={() => navigate("/books")}>Back to catalog</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-faint)] mb-1">
        <Icon className="size-3" /> {label}
      </div>
      <div className="text-xs font-medium text-[var(--text)]">{value}</div>
    </div>
  );
}