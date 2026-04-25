"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const features = [
  { icon: "👗", label: "Outfit & Style Advice" },
  { icon: "💄", label: "Makeup Tips" },
  { icon: "🧴", label: "Skincare Routines" },
  { icon: "💇", label: "Haircare Guidance" },
  { icon: "🎨", label: "Color Analysis" },
  { icon: "🛍️", label: "Budget Shopping" },
];

const steps = [
  { step: "01", title: "Sign Up Free", desc: "Create your account in seconds — no credit card needed.", emoji: "✨" },
  { step: "02", title: "Fill Your Profile", desc: "Tell LUMÉ your skin type, tone, hair type and budget.", emoji: "💕" },
  { step: "03", title: "Get Glowing", desc: "Ask anything — get real, personalized beauty advice instantly.", emoji: "🌸" },
];

export default function HomePage() {
  return (
    <main style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #f5e6d8 40%, #e8d5c4 100%)" }}
      className="min-h-screen flex flex-col items-center px-4 py-16">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto w-full"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #fde8d8, #f5c6a0)" }}>
            💄
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8" style={{ color: "#C9956A" }} />
          <h1 style={{ color: "#1a0a00", fontFamily: "Georgia, serif" }}
            className="text-5xl font-bold tracking-tight">
            LUMÉ
          </h1>
        </div>

        <p style={{ color: "#3d1a00", fontFamily: "Georgia, serif" }}
          className="text-xl font-light mb-3 italic">
          Your personal glow-up starts here ✨
        </p>

        <p style={{ color: "#2c1500" }} className="text-base mb-8 max-w-md mx-auto">
          Meet LUMÉ — your AI beauty bestie who gives real, personalized advice
          on skincare, style, makeup, and everything in between.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {features.map((f) => (
            <span key={f.label}
              style={{ color: "#2c1500", border: "1px solid #C9956A", background: "rgba(255,255,255,0.8)" }}
              className="px-3 py-1.5 rounded-full text-sm font-medium">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        <div className="flex justify-center mb-16">
          <Link href="/auth/signup"
            style={{ background: "#C9956A", color: "#fff" }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity shadow-lg">
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* How it works */}
        <div className="w-full mb-12">
          <p style={{ color: "#a07050" }} className="text-xs font-semibold uppercase tracking-widest mb-6">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="rounded-2xl p-5 text-left"
                style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #E8D5C4" }}>
                <div className="text-2xl mb-2">{s.emoji}</div>
                <p style={{ color: "#C9956A" }} className="text-xs font-bold uppercase tracking-wider mb-1">Step {s.step}</p>
                <p style={{ color: "#1a0a00" }} className="font-semibold mb-1">{s.title}</p>
                <p style={{ color: "#5a3020" }} className="text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sample chat preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="w-full max-w-md mb-4">
          <p style={{ color: "#a07050" }} className="text-xs font-semibold uppercase tracking-widest mb-4">See it in action</p>
          <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: "1px solid #E8D5C4", background: "white" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#fdf8f5", borderBottom: "1px solid #E8D5C4" }}>
              <span className="text-sm">💄</span>
              <span style={{ color: "#1a0a00", fontFamily: "Georgia, serif" }} className="font-bold text-sm">LUMÉ</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-end">
                <div className="px-3 py-2 rounded-2xl rounded-br-sm text-sm text-white max-w-[80%]" style={{ background: "#C9956A" }}>
                  What skincare routine suits wheatish oily skin?
                </div>
              </div>
              <div className="flex justify-start gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f5e6d8", border: "1px solid #E8D5C4" }}>
                  <span className="text-xs">💄</span>
                </div>
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm text-sm max-w-[80%]" style={{ background: "#fdf8f5", border: "1px solid #E8D5C4", color: "#2c1500" }}>
                  For wheatish oily skin, here&apos;s your AM routine: <strong>Foaming cleanser</strong> → <strong>Niacinamide serum</strong> → light gel moisturizer → SPF 50. At night swap SPF for a <strong>salicylic acid toner</strong> ✨
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ color: "#5a3020" }} className="mt-12 text-sm">
        Powered by AI · Built for Indian beauty lovers 🌸
      </motion.p>
    </main>
  );
}
