"use client";

import { motion } from "framer-motion";

export default function LumeAvatar({ size = 120 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: h }}
      className="relative select-none"
    >
      <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={h}>

        {/* ── BODY / OUTFIT ── */}
        {/* Elegant off-shoulder dress - rose/blush pink */}
        <path d="M22 130 Q25 105 45 98 Q60 94 75 98 Q95 105 98 130 Q85 145 60 147 Q35 145 22 130Z" fill="#F48FB1" />
        {/* dress shimmer overlay */}
        <path d="M22 130 Q25 105 45 98 Q60 94 75 98 Q95 105 98 130 Q85 145 60 147 Q35 145 22 130Z"
          fill="url(#dressShimmer)" opacity="0.3" />
        {/* off-shoulder neckline */}
        <path d="M38 100 Q60 108 82 100" stroke="#f8bbd0" strokeWidth="2" fill="none" />
        {/* dress ruffle detail */}
        <path d="M30 118 Q60 124 90 118" stroke="#f8bbd0" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M26 128 Q60 135 94 128" stroke="#f8bbd0" strokeWidth="1" fill="none" opacity="0.5" />
        {/* sparkle on dress */}
        <circle cx="45" cy="112" r="1" fill="white" opacity="0.8" />
        <circle cx="75" cy="115" r="1" fill="white" opacity="0.8" />
        <circle cx="60" cy="108" r="0.8" fill="white" opacity="0.6" />

        {/* ── NECK ── */}
        <rect x="53" y="88" width="14" height="16" rx="6" fill="#FDDBB4" />

        {/* ── DELICATE NECKLACE ── */}
        <path d="M48 98 Q60 104 72 98" stroke="#d4af37" strokeWidth="1" fill="none" />
        <circle cx="60" cy="104" r="1.8" fill="#d4af37" />

        {/* ── HAIR — long blonde waves ── */}
        {/* back hair volume */}
        <ellipse cx="60" cy="48" rx="34" ry="37" fill="#D4A017" />
        {/* long flowing hair */}
        <path d="M26 56 Q14 95 20 128 Q30 120 36 104 Q40 82 37 60Z" fill="#C8960C" />
        <path d="M94 56 Q106 95 100 128 Q90 120 84 104 Q80 82 83 60Z" fill="#C8960C" />
        {/* hair highlight streaks */}
        <path d="M40 28 Q52 18 65 22 Q55 20 44 26Z" fill="#FFE066" opacity="0.6" />
        <path d="M55 18 Q62 15 70 20 Q64 17 57 19Z" fill="#FFE066" opacity="0.5" />
        {/* wavy hair texture lines */}
        <path d="M26 70 Q22 80 24 90" stroke="#b8860b" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M94 70 Q98 80 96 90" stroke="#b8860b" strokeWidth="1" fill="none" opacity="0.4" />

        {/* ── FACE ── */}
        <ellipse cx="60" cy="60" rx="26" ry="28" fill="#FDDBB4" />
        {/* face contour */}
        <path d="M36 62 Q34 72 38 80" stroke="#e8c49a" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M84 62 Q86 72 82 80" stroke="#e8c49a" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* ── BLUSH ── */}
        <ellipse cx="42" cy="68" rx="8" ry="4.5" fill="#F48FB1" opacity="0.35" />
        <ellipse cx="78" cy="68" rx="8" ry="4.5" fill="#F48FB1" opacity="0.35" />

        {/* ── EYESHADOW — smoky rose ── */}
        <ellipse cx="50" cy="56" rx="8" ry="4.5" fill="#C2185B" opacity="0.25" />
        <ellipse cx="70" cy="56" rx="8" ry="4.5" fill="#C2185B" opacity="0.25" />
        {/* shimmer inner corner */}
        <ellipse cx="46" cy="57" rx="3" ry="2" fill="#FFB6C1" opacity="0.4" />
        <ellipse cx="74" cy="57" rx="3" ry="2" fill="#FFB6C1" opacity="0.4" />

        {/* ── EYES — large green/hazel ── */}
        <ellipse cx="50" cy="59" rx="6" ry="5.5" fill="#2E7D32" />
        <ellipse cx="70" cy="59" rx="6" ry="5.5" fill="#2E7D32" />
        {/* iris detail */}
        <ellipse cx="50" cy="59" rx="4" ry="4" fill="#1B5E20" />
        <ellipse cx="70" cy="59" rx="4" ry="4" fill="#1B5E20" />
        {/* pupil */}
        <circle cx="50" cy="59" r="2" fill="#0a0a0a" />
        <circle cx="70" cy="59" r="2" fill="#0a0a0a" />
        {/* eye shine — multiple catchlights */}
        <circle cx="52.5" cy="57" r="1.8" fill="white" />
        <circle cx="72.5" cy="57" r="1.8" fill="white" />
        <circle cx="48.5" cy="61" r="0.8" fill="white" opacity="0.5" />
        <circle cx="68.5" cy="61" r="0.8" fill="white" opacity="0.5" />

        {/* ── EYELINER — cat eye ── */}
        <path d="M43 55 Q47 52 56 57" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* wing flick */}
        <path d="M56 57 Q59 54 62 51" stroke="#1a0a00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M64 55 Q68 52 77 57" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M64 57 Q61 54 58 51" stroke="#1a0a00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* lower lash subtle */}
        <path d="M44 63 Q50 65 56 63" stroke="#1a0a00" strokeWidth="0.7" fill="none" opacity="0.4" />
        <path d="M64 63 Q70 65 76 63" stroke="#1a0a00" strokeWidth="0.7" fill="none" opacity="0.4" />

        {/* ── LASHES — upper ── */}
        <path d="M44 55 L43 52" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M47 53 L46 50" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M50 52 L50 49" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M53 53 L54 50" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M56 55 L58 52" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M64 55 L62 52" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M67 53 L66 50" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M70 52 L70 49" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M73 53 L74 50" stroke="#0a0a0a" strokeWidth="0.8" />
        <path d="M76 55 L77 52" stroke="#0a0a0a" strokeWidth="0.8" />

        {/* ── EYEBROWS — defined arched ── */}
        <path d="M42 50 Q50 46 58 49" stroke="#8B6914" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M62 49 Q70 46 78 50" stroke="#8B6914" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* ── NOSE — subtle ── */}
        <path d="M57 67 Q60 72 63 67" stroke="#d4a070" strokeWidth="1" fill="none" strokeLinecap="round" />
        <ellipse cx="57.5" cy="69" rx="1.2" ry="0.8" fill="#d4a070" opacity="0.3" />
        <ellipse cx="62.5" cy="69" rx="1.2" ry="0.8" fill="#d4a070" opacity="0.3" />

        {/* ── LIPS — full glossy pink-red ── */}
        {/* lip base */}
        <path d="M50 77 Q55 73 60 74.5 Q65 73 70 77 Q66 84 60 85 Q54 84 50 77Z" fill="#E91E63" />
        {/* upper lip cupid bow */}
        <path d="M50 77 Q55 74.5 60 75.5 Q65 74.5 70 77" fill="#C2185B" />
        {/* lip gloss shine */}
        <ellipse cx="60" cy="78" rx="5" ry="2" fill="white" opacity="0.25" />
        <ellipse cx="57" cy="77" rx="2" ry="1" fill="white" opacity="0.2" />

        {/* ── EARRINGS — crystal drop ── */}
        <line x1="34" y1="65" x2="34" y2="72" stroke="#d4af37" strokeWidth="1.2" />
        <ellipse cx="34" cy="75" rx="3" ry="4" fill="#F48FB1" opacity="0.9" />
        <ellipse cx="34" cy="74" rx="1.5" ry="2" fill="white" opacity="0.4" />

        <line x1="86" y1="65" x2="86" y2="72" stroke="#d4af37" strokeWidth="1.2" />
        <ellipse cx="86" cy="75" rx="3" ry="4" fill="#F48FB1" opacity="0.9" />
        <ellipse cx="86" cy="74" rx="1.5" ry="2" fill="white" opacity="0.4" />

        {/* ── HAIR ACCESSORY — sparkle pins ── */}
        <circle cx="80" cy="34" r="2.5" fill="#FFE066" />
        <circle cx="80" cy="34" r="1.2" fill="white" opacity="0.8" />
        <circle cx="86" cy="40" r="1.5" fill="#FFE066" opacity="0.8" />
        <circle cx="76" cy="40" r="1" fill="#FFE066" opacity="0.6" />

        {/* ── SPARKLES around her ── */}
        <text x="8" y="45" fontSize="9" opacity="0.7">✨</text>
        <text x="100" y="55" fontSize="7" opacity="0.6">⭐</text>
        <text x="12" y="80" fontSize="6" opacity="0.5">💫</text>

        {/* gradient def */}
        <defs>
          <linearGradient id="dressShimmer" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

      </svg>
    </motion.div>
  );
}
