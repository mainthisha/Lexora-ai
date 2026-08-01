import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Library, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-[var(--violet)] to-[var(--sky)] flex items-center justify-center mb-3">
            <Library className="size-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Create your admin account</h1>
          <p className="text-xs text-[var(--text-faint)] mt-1">Set up Lexora AI for your library</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Karthikeyan S" required />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" required />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Create account"}
            {!loading && <ArrowRight className="size-4" />}
          </Button>

          <p className="text-[11px] text-center text-[var(--text-faint)]">
            Already have an account? <Link to="/login" className="text-[var(--violet-soft)] hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
