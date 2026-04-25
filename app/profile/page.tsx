"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Check, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { BeautyProfile, SkinType, SkinTone, HairType, StyleVibe, Budget, AgeRange, ClimateZone } from "@/types";

const SKIN_TYPES: { value: SkinType; label: string; emoji: string }[] = [
  { value: "oily", label: "Oily", emoji: "💧" },
  { value: "dry", label: "Dry", emoji: "🌵" },
  { value: "combination", label: "Combination", emoji: "⚖️" },
  { value: "sensitive", label: "Sensitive", emoji: "🌸" },
];

const SKIN_TONES: { value: SkinTone; label: string; color: string }[] = [
  { value: "fair", label: "Fair", color: "#F5DEB3" },
  { value: "wheatish", label: "Wheatish", color: "#D2A679" },
  { value: "medium", label: "Medium", color: "#C68642" },
  { value: "dusky", label: "Dusky", color: "#8D5524" },
  { value: "deep", label: "Deep", color: "#4A2912" },
];

const HAIR_TYPES: { value: HairType; label: string; emoji: string }[] = [
  { value: "straight", label: "Straight", emoji: "〰️" },
  { value: "wavy", label: "Wavy", emoji: "〜" },
  { value: "curly", label: "Curly", emoji: "🌀" },
  { value: "coily", label: "Coily", emoji: "🔄" },
];

const STYLE_VIBES: { value: StyleVibe; label: string; emoji: string }[] = [
  { value: "casual", label: "Casual", emoji: "👟" },
  { value: "elegant", label: "Elegant", emoji: "✨" },
  { value: "streetwear", label: "Streetwear", emoji: "🧢" },
  { value: "ethnic", label: "Ethnic", emoji: "🪷" },
  { value: "mix", label: "Mix of everything", emoji: "🎨" },
];

const BUDGETS: { value: Budget; label: string }[] = [
  { value: "under_500", label: "Under ₹500" },
  { value: "500_2000", label: "₹500 – ₹2,000" },
  { value: "2000_5000", label: "₹2,000 – ₹5,000" },
  { value: "5000_plus", label: "₹5,000+" },
];

const AGE_RANGES: { value: AgeRange; label: string; emoji: string }[] = [
  { value: "under_18", label: "Under 18", emoji: "🌱" },
  { value: "18_24", label: "18 – 24", emoji: "✨" },
  { value: "25_34", label: "25 – 34", emoji: "💫" },
  { value: "35_44", label: "35 – 44", emoji: "🌸" },
  { value: "45_plus", label: "45+", emoji: "👑" },
];

const CLIMATE_ZONES: { value: ClimateZone; label: string; emoji: string }[] = [
  { value: "humid", label: "Humid (Mumbai, Chennai, Kolkata)", emoji: "💧" },
  { value: "dry", label: "Dry (Delhi, Rajasthan)", emoji: "🌵" },
  { value: "tropical", label: "Tropical (Kerala, Goa)", emoji: "🌴" },
  { value: "cold", label: "Cold (Himachal, J&K)", emoji: "❄️" },
  { value: "moderate", label: "Moderate (Bangalore, Pune)", emoji: "🌤️" },
];

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Partial<BeautyProfile>>({});
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      setUserName(user.user_metadata?.full_name || user.email || null);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert(
      { ...profile, user_id: user.id },
      { onConflict: "user_id" }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function select<T>(field: keyof BeautyProfile, value: T) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  const profileFields: (keyof BeautyProfile)[] = ["skin_type", "skin_tone", "hair_type", "style_vibe", "budget", "age_range", "climate_zone"];
  const completedFields = profileFields.filter(f => profile[f] != null).length;
  const completionPct = Math.round((completedFields / profileFields.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full bg-primary typing-dot`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chat" className="p-2 rounded-full hover:bg-secondary/40 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#2C2C2C] dark:text-[#f0e8e0]" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="font-playfair text-2xl font-bold" style={{ color: "#1a0a00" }}>
                Your Beauty Profile
              </h1>
            </div>
            {userName && (
              <p className="text-sm font-medium mt-0.5" style={{ color: "#C9956A" }}>
                👋 {userName}
              </p>
            )}
            <p className="text-sm mt-0.5" style={{ color: "#5a3020" }}>
              LUMÉ uses this to personalize every response for you 💕
            </p>
            {/* Completion bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "#a07050" }}>Profile {completionPct}% complete</span>
                {completionPct === 100 && <span className="text-xs text-green-600">✓ All done!</span>}
              </div>
              <div className="h-1.5 rounded-full bg-[#E8D5C4] overflow-hidden w-48">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%`, background: completionPct === 100 ? "#22c55e" : "#C9956A" }} />
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            style={{ color: "#c0392b", border: "1px solid #f5c6c6" }}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>

        <div className="space-y-6">
          {/* Skin Type */}
          <Section title="Skin Type" emoji="🧴">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKIN_TYPES.map((s) => (
                <OptionCard
                  key={s.value}
                  selected={profile.skin_type === s.value}
                  onClick={() => select("skin_type", s.value)}
                  emoji={s.emoji}
                  label={s.label}
                />
              ))}
            </div>
          </Section>

          {/* Skin Tone */}
          <Section title="Skin Tone" emoji="🎨">
            <div className="flex flex-wrap gap-3">
              {SKIN_TONES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => select("skin_tone", s.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                    profile.skin_tone === s.value
                      ? "border-primary bg-primary/10"
                      : "border-secondary/50 bg-white dark:bg-[#2a1f1a] hover:border-primary/50"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[#2C2C2C] dark:text-[#f0e8e0]">{s.label}</span>
                  {profile.skin_tone === s.value && (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </Section>

          {/* Hair Type */}
          <Section title="Hair Type" emoji="💇">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HAIR_TYPES.map((h) => (
                <OptionCard
                  key={h.value}
                  selected={profile.hair_type === h.value}
                  onClick={() => select("hair_type", h.value)}
                  emoji={h.emoji}
                  label={h.label}
                />
              ))}
            </div>
          </Section>

          {/* Style Vibe */}
          <Section title="Style Vibe" emoji="👗">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_VIBES.map((s) => (
                <OptionCard
                  key={s.value}
                  selected={profile.style_vibe === s.value}
                  onClick={() => select("style_vibe", s.value)}
                  emoji={s.emoji}
                  label={s.label}
                />
              ))}
            </div>
          </Section>

          {/* Budget */}
          <Section title="Monthly Beauty Budget" emoji="💰">
            <div className="grid grid-cols-2 gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => select("budget", b.value)}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                    profile.budget === b.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-secondary/50 bg-white dark:bg-[#2a1f1a] text-[#2C2C2C] dark:text-[#f0e8e0] hover:border-primary/50"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Age Range */}
          <Section title="Age Range" emoji="🎂">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AGE_RANGES.map((a) => (
                <OptionCard
                  key={a.value}
                  selected={profile.age_range === a.value}
                  onClick={() => select("age_range", a.value)}
                  emoji={a.emoji}
                  label={a.label}
                />
              ))}
            </div>
          </Section>

          {/* Climate Zone */}
          <Section title="Your Climate Zone" emoji="🌍">
            <div className="space-y-2">
              {CLIMATE_ZONES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => select("climate_zone", c.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                    profile.climate_zone === c.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-secondary/50 bg-white dark:bg-[#2a1f1a] text-[#2C2C2C] dark:text-[#f0e8e0] hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">{c.emoji}</span>
                  <span>{c.label}</span>
                  {profile.climate_zone === c.value && <Check className="w-4 h-4 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </Section>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium text-base hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" /> Saved!
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              "Save My Profile ✨"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1e1510] rounded-2xl p-5 border border-secondary/30 shadow-sm">
      <h2 className="font-playfair text-lg font-semibold mb-4 text-[#2C2C2C] dark:text-[#f0e8e0]">
        {emoji} {title}
      </h2>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  emoji,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-secondary/50 bg-[#FDF8F5] dark:bg-[#2a1f1a] text-[#2C2C2C] dark:text-[#f0e8e0] hover:border-primary/50"
      }`}
    >
      <span className="text-xl">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
