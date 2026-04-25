"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Send, Plus, MessageSquare, User, LogOut, Trash2, X, Copy, ThumbsUp, ThumbsDown, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatSession } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down" | null;
}

const DAILY_TIPS = [
  { tip: "Apply SPF 30+ every morning — even indoors. UV rays pass through windows!", emoji: "☀️" },
  { tip: "Double cleanse at night: oil cleanser first, then face wash. Your skin will thank you.", emoji: "🧴" },
  { tip: "Silk pillowcases reduce hair breakage and skin creases while you sleep.", emoji: "🛏️" },
  { tip: "Drink 8 glasses of water daily — the cheapest glow serum exists.", emoji: "💧" },
  { tip: "Niacinamide + Zinc is the best combo for oily, acne-prone skin.", emoji: "✨" },
  { tip: "Massage your scalp for 5 mins before washing — it boosts hair growth.", emoji: "💇" },
  { tip: "Always apply skincare on a damp face — it absorbs 40% better.", emoji: "🌊" },
  { tip: "Vitamin C serum in the morning + Retinol at night = the ultimate anti-aging duo.", emoji: "🍊" },
  { tip: "Coconut oil as a hair mask overnight works better than most expensive treatments.", emoji: "🥥" },
  { tip: "Patch test every new product on your inner wrist before applying to your face.", emoji: "🔬" },
  { tip: "Exfoliate only 2-3 times a week. Over-exfoliating damages your skin barrier.", emoji: "🌸" },
  { tip: "Green tea bags cooled in the fridge reduce under-eye puffiness instantly.", emoji: "🍵" },
  { tip: "Aloe vera gel is the best free moisturizer — great for all skin types.", emoji: "🌿" },
  { tip: "Wear sunscreen on your neck and hands too — they age faster than your face.", emoji: "🤲" },
];

function getDailyTip() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const MAX_MSGS = 20;

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      loadSessions();
    }
    init();
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleScroll() {
    const el = chatContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  }

  async function loadSessions() {
    const res = await fetch("/api/sessions");
    if (res.ok) setSessions(await res.json());
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed && !imageBase64) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setSidebarOpen(false);
    setMsgCount(c => c + 1);

    let sessionId = currentSessionId;
    if (!sessionId) {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed.slice(0, 40) || "New Chat" }),
      });
      const session = await res.json();
      sessionId = session.id;
      setCurrentSessionId(session.id);
      loadSessions();
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId, imageBase64, imageMimeType,
        }),
      });

      setImageBase64(null); setImageMimeType(null); setImagePreview(null);

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantText } : m));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `Oops! ${msg} 💕` }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function selectSession(id: string) {
    setCurrentSessionId(id);
    setSidebarOpen(false);
    const res = await fetch(`/api/sessions/${id}`);
    if (res.ok) {
      const msgs = await res.json();
      setMessages(msgs.map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
        id: m.id, role: m.role, content: m.content,
      })));
    }
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    if (currentSessionId === id) { setCurrentSessionId(null); setMessages([]); }
    loadSessions();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result.split(",")[1]);
      setImageMimeType(file.type);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function copyMessage(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function sendFeedback(msgId: string, type: "up" | "down") {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: type } : m));
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: msgId, type: type === "up" ? "thumbs_up" : "thumbs_down" }),
    }).catch(() => {});
  }

  function SidebarContent() {
    return (
      <>
        <div className="p-4 border-b border-[#E8D5C4] dark:border-[#3a2e28]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#C9956A]" />
            <span className="font-playfair text-xl font-bold text-[#2C2C2C] dark:text-[#f0e8e0]">LUMÉ</span>
          </div>
          <button onClick={() => { setCurrentSessionId(null); setMessages([]); setSidebarOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#C9956A] text-white rounded-xl text-sm font-medium hover:bg-[#b07d54] transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((s) => (
            <div key={s.id} onClick={() => selectSession(s.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-sm transition-colors ${
                currentSessionId === s.id
                  ? "bg-[#C9956A]/15 text-[#C9956A]"
                  : "text-[#2C2C2C] dark:text-[#f0e8e0] hover:bg-[#E8D5C4]/40 dark:hover:bg-[#3a2e28]"
              }`}>
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate">{s.title}</span>
              <button onClick={(e) => deleteSession(s.id, e)} aria-label="Delete"
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#E8D5C4] dark:border-[#3a2e28] space-y-1">
          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#2C2C2C] dark:text-[#f0e8e0] hover:bg-[#E8D5C4]/40 dark:hover:bg-[#3a2e28] transition-colors">
            <User className="w-4 h-4" /> Beauty Profile
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#2C2C2C] dark:text-[#f0e8e0] hover:bg-[#E8D5C4]/40 dark:hover:bg-[#3a2e28] transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDF8F5] dark:bg-[#121212] overflow-hidden relative">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 z-30 md:hidden bg-white dark:bg-[#1e1510] border-r border-[#E8D5C4] dark:border-[#3a2e28] flex flex-col">
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 bg-white dark:bg-[#1e1510] border-r border-[#E8D5C4] dark:border-[#3a2e28] flex-col">
        <SidebarContent />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#E8D5C4] dark:border-[#3a2e28] bg-white dark:bg-[#1e1510]">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-[#E8D5C4]/40 cursor-pointer">
            <Menu className="w-5 h-5 text-[#2C2C2C] dark:text-[#f0e8e0]" />
          </button>
          <Sparkles className="w-4 h-4 text-[#C9956A]" />
          <span className="font-playfair font-bold text-[#2C2C2C] dark:text-[#f0e8e0]">LUMÉ</span>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 shadow-md"
              style={{ background: "linear-gradient(135deg, #fde8d8, #f5c6a0)" }}>
              💄
            </div>
            <h2 className="font-playfair text-2xl font-bold text-[#2C2C2C] dark:text-[#f0e8e0] mb-2">Hi, I&apos;m LUMÉ ✨</h2>
            <p className="text-[#4a3728] dark:text-[#f0e8e0]/70 max-w-sm mb-6 text-sm">
              Your personal beauty & style AI. Ask me anything — skincare, outfits, makeup, haircare, and more!
            </p>

            {(() => { const t = getDailyTip(); return (
              <div className="w-full max-w-md mb-5 px-4 py-3 rounded-2xl text-left"
                style={{ background: "linear-gradient(135deg, #fff5ee, #fde8d8)", border: "1px solid #E8D5C4" }}>
                <p className="text-xs font-semibold text-[#C9956A] uppercase tracking-wide mb-1">Today&apos;s Glow Tip</p>
                <p className="text-sm text-[#2c1500]">{t.emoji} {t.tip}</p>
              </div>
            ); })()}

            <div className="mb-5 w-full max-w-md">
              <p className="text-xs font-medium text-[#a07050] mb-2 uppercase tracking-wide">What&apos;s the occasion?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "College", emoji: "🎒" },
                  { label: "Office", emoji: "💼" },
                  { label: "Date Night", emoji: "🌙" },
                  { label: "Wedding", emoji: "💍" },
                  { label: "Festival", emoji: "🪔" },
                  { label: "Casual", emoji: "☀️" },
                ].map((o) => (
                  <button key={o.label}
                    onClick={() => setInput(`Suggest a complete look for a ${o.label.toLowerCase()} occasion — outfit, makeup, and hair`)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border hover:border-[#C9956A] hover:bg-[#C9956A]/10 transition-all cursor-pointer"
                    style={{ borderColor: "#E8D5C4", color: "#2c1500", background: "rgba(255,255,255,0.8)" }}>
                    {o.emoji} {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full max-w-md">
              <p className="text-xs font-medium text-[#a07050] mb-2 uppercase tracking-wide">Quick asks</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🧴", text: "Build my skincare routine" },
                  { icon: "💄", text: "Makeup for my skin tone" },
                  { icon: "💇", text: "Haircare tips for my hair type" },
                  { icon: "🛍️", text: "Find a dupe for a product" },
                  { icon: "🌿", text: "DIY home remedy for glowing skin" },
                  { icon: "🔍", text: "Check if an ingredient is safe for me" },
                ].map((chip) => (
                  <button key={chip.text} onClick={() => setInput(chip.text)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-left hover:border-[#C9956A] hover:bg-[#C9956A]/10 transition-all cursor-pointer"
                    style={{ borderColor: "#E8D5C4", color: "#2c1500", background: "rgba(255,255,255,0.8)" }}>
                    <span>{chip.icon}</span>
                    <span className="text-xs">{chip.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={chatContainerRef} onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group`}>
                {m.role === "assistant" && (
                  <div className="flex-shrink-0 mr-2 mt-1 w-8 h-8 rounded-full bg-[#f5e6d8] flex items-center justify-center border border-[#E8D5C4]">
                    <span className="text-base">💄</span>
                  </div>
                )}
                <div className="flex flex-col max-w-[75%]">
                  <div className={`rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-[#C9956A] text-white rounded-br-sm"
                      : "bg-white dark:bg-[#1e1510] text-[#2C2C2C] dark:text-[#f0e8e0] border border-[#E8D5C4] dark:border-[#3a2e28] rounded-bl-sm"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose-lume">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  {m.role === "assistant" && m.content && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => copyMessage(m.id, m.content)}
                        className="p-1.5 rounded-lg hover:bg-[#E8D5C4]/50 cursor-pointer" title="Copy">
                        <Copy className="w-3.5 h-3.5 text-[#a07050]" />
                      </button>
                      {copiedId === m.id && <span className="text-xs text-[#C9956A]">Copied!</span>}
                      <button onClick={() => sendFeedback(m.id, "up")}
                        className={`p-1.5 rounded-lg hover:bg-[#E8D5C4]/50 cursor-pointer ${m.feedback === "up" ? "text-green-500" : "text-[#a07050]"}`}>
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => sendFeedback(m.id, "down")}
                        className={`p-1.5 rounded-lg hover:bg-[#E8D5C4]/50 cursor-pointer ${m.feedback === "down" ? "text-red-400" : "text-[#a07050]"}`}>
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-2 mt-1 w-8 h-8 rounded-full bg-[#f5e6d8] flex items-center justify-center border border-[#E8D5C4]">
                  <span className="text-base">💄</span>
                </div>
                <div className="bg-white dark:bg-[#1e1510] border border-[#E8D5C4] dark:border-[#3a2e28] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#C9956A] typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Scroll to bottom */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="absolute bottom-24 right-6 p-2 rounded-full shadow-lg bg-white dark:bg-[#1e1510] border border-[#E8D5C4] dark:border-[#3a2e28] cursor-pointer z-10">
              <ChevronDown className="w-4 h-4 text-[#C9956A]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-4 border-t border-[#E8D5C4] dark:border-[#3a2e28] bg-white dark:bg-[#1e1510]">
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[#E8D5C4]" />
              <button onClick={() => { setImagePreview(null); setImageBase64(null); setImageMimeType(null); }}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-2 items-end">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
            <div className="flex-1 relative">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e as unknown as React.FormEvent); } }}
                placeholder="Ask LUMÉ anything about beauty & style..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] dark:border-[#3a2e28] bg-[#FDF8F5] dark:bg-[#2a1f1a] text-[#2C2C2C] dark:text-[#f0e8e0] placeholder:text-[#9a7060] dark:placeholder:text-[#f0e8e0]/40 focus:outline-none focus:ring-2 focus:ring-[#C9956A]/40 text-sm pr-20" />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${msgCount >= MAX_MSGS ? "text-red-400" : "text-[#a07050]"}`}>
                {msgCount}/{MAX_MSGS}
              </span>
            </div>
            <button type="submit" disabled={isLoading || (!input.trim() && !imageBase64) || msgCount >= MAX_MSGS}
              aria-label="Send message"
              className="p-2.5 bg-[#C9956A] text-white rounded-xl hover:bg-[#b07d54] transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
