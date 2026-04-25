"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Authentication failed. Please try again." : null
  );

  const supabase = createClient();

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/chat");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #f5e6d8 40%, #e8d5c4 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6" style={{ color: "#C9956A" }} />
            <span style={{ color: "#1a0a00", fontFamily: "Georgia, serif" }} className="text-3xl font-bold">LUMÉ</span>
          </div>
          <p style={{ color: "#5a3020" }}>Welcome back, gorgeous ✨</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: "#E8D5C4" }}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#2c1500" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                style={{ borderColor: "#E8D5C4", background: "#FDF8F5", color: "#2c1500" }}
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#2c1500" }}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 pr-12"
                  style={{ borderColor: "#E8D5C4", background: "#FDF8F5", color: "#2c1500" }}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#C9956A" }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#C9956A", color: "#fff" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "#E8D5C4" }} />
            <span className="text-xs" style={{ color: "#a07050" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#E8D5C4" }} />
          </div>

          <button onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl font-medium border flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#E8D5C4", color: "#2c1500", background: "#fff" }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-5" style={{ color: "#5a3020" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium hover:underline" style={{ color: "#C9956A" }}>
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
