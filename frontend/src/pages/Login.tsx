import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Library, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@lexora.edu");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
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
          <h1 className="text-lg font-semibold">Lexora AI</h1>
          <p className="text-xs text-[var(--text-faint)] mt-1">AI-powered library intelligence platform</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" required />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight className="size-4" />}
          </Button>

          <p className="text-[11px] text-center text-[var(--text-faint)]">
            No account yet? <Link to="/register" className="text-[var(--violet-soft)] hover:underline">Create one</Link>
          </p>
        </form>

        <p className="text-[11px] text-center text-[var(--text-faint)] mt-4">
          First time here? Register to spin up your own admin account — the API seeds a full demo catalog automatically.
        </p>
      </motion.div>
    </div>
  );
}
