import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #f5e6d8 40%, #e8d5c4 100%)" }}>
      <Sparkles className="w-10 h-10 mb-4" style={{ color: "#C9956A" }} />
      <h2 style={{ color: "#1a0a00" }} className="text-2xl font-bold mb-2">Page not found</h2>
      <p style={{ color: "#4a3728" }} className="mb-6">This page doesn&apos;t exist — but your glow-up does ✨</p>
      <Link href="/" style={{ background: "#C9956A", color: "#fff" }}
        className="px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
        Go home
      </Link>
    </div>
  );
}
