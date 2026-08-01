import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, BookOpen, Pencil, Trash2, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { Book } from "@/types";

const emptyForm = {
  title: "", author: "", isbn: "", category: "", publisher: "", published_year: new Date().getFullYear(),
  language: "English", shelf_location: "", total_copies: 1, available_copies: 1, cover_url: "", description: "",
  popularity: 50, ai_score: 50,
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([api.listBooks({ q, category }), api.categories()]);
      setBooks(b);
      setCategories(c);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(b: Book) {
    setEditing(b);
    setForm({
      title: b.title, author: b.author, isbn: b.isbn, category: b.category,
      publisher: b.publisher ?? "", published_year: b.published_year ?? new Date().getFullYear(),
      language: b.language, shelf_location: b.shelf_location ?? "", total_copies: b.total_copies,
      available_copies: b.available_copies, cover_url: b.cover_url ?? "", description: b.description ?? "",
      popularity: b.popularity, ai_score: b.ai_score,
    });
    setModalOpen(true);
  }

  async function save() {
    if (editing) {
      await api.updateBook(editing.id, form);
    } else {
      await api.createBook(form);
    }
    setModalOpen(false);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    await api.deleteBook(id);
    load();
  }

  return (
    <AppShell>
      <PageHeader
        title="Books"
        subtitle={`${books.length} titles in the catalog`}
        actions={
          <Button onClick={openAdd}>
            <Plus className="size-4" /> Add book
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-faint)]" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, author, or ISBN…" className="pl-9" />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/[0.06]">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <EmptyState icon={BookOpen} title="No books found" body="Try a different search term or category filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-[var(--text-faint)] border-b border-white/[0.06]">
                  <th className="font-medium px-4 py-3">Title</th>
                  <th className="font-medium px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="font-medium px-4 py-3 hidden lg:table-cell">Shelf</th>
                  <th className="font-medium px-4 py-3">Availability</th>
                  <th className="font-medium px-4 py-3 hidden sm:table-cell">AI Score</th>
                  <th className="font-medium px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <Link to={`/books/${b.id}`} className="flex items-center gap-3 min-w-0">
                        <img src={b.cover_url ?? undefined} alt="" className="w-8 h-11 object-cover rounded shrink-0 bg-white/5" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{b.title}</div>
                          <div className="text-[11px] text-[var(--text-faint)] truncate">{b.author}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <Badge>{b.category}</Badge>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell text-[var(--text-muted)]">{b.shelf_location}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={b.available_copies === 0 ? "danger" : b.available_copies <= 2 ? "warning" : "success"}>
                        {b.available_copies}/{b.total_copies}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <Badge tone="ai">{b.ai_score}%</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-white/5">
                          <Pencil className="size-3.5" />
                        </button>
                        <button onClick={() => remove(b.id)} className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-rose-300 hover:bg-rose-500/10">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{editing ? "Edit book" : "Add book"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-faint)] hover:text-[var(--text)]">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title" full><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Author" full><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
              <Field label="ISBN"><Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></Field>
              <Field label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
              <Field label="Publisher"><Input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} /></Field>
              <Field label="Year"><Input type="number" value={form.published_year} onChange={(e) => setForm({ ...form, published_year: Number(e.target.value) })} /></Field>
              <Field label="Shelf location"><Input value={form.shelf_location} onChange={(e) => setForm({ ...form, shelf_location: e.target.value })} /></Field>
              <Field label="Language"><Input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></Field>
              <Field label="Total copies"><Input type="number" value={form.total_copies} onChange={(e) => setForm({ ...form, total_copies: Number(e.target.value) })} /></Field>
              <Field label="Available copies"><Input type="number" value={form.available_copies} onChange={(e) => setForm({ ...form, available_copies: Number(e.target.value) })} /></Field>
              <Field label="Cover image URL" full><Input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://covers.openlibrary.org/…" /></Field>
              <Field label="Description" full><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={save}>{editing ? "Save changes" : "Add book"}</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1 block">{label}</label>
      {children}
    </div>
  );
}
