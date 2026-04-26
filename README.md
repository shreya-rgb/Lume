# LUMÉ — Your Personal Beauty & Style AI ✨

**Live Demo → [lume-beauty.vercel.app](https://lume-beauty.vercel.app)**

LUMÉ is an AI-powered beauty and style assistant built for Indian beauty lovers. Get personalized skincare routines, makeup tips, outfit advice, haircare guidance, and more — all tailored to your skin type, tone, and budget.

## Features

- 💄 Personalized skincare, makeup & haircare advice
- 👗 Outfit suggestions by occasion (college, office, wedding, festival)
- 🛍️ Budget-aware product recommendations in ₹ (Indian brands + international)
- 🔍 Ingredient checker & product dupe finder
- 🌸 Daily glow tips
- 🔐 Auth with email/password + Google Sign-In
- 💬 Chat history with sessions
- 📱 Mobile responsive

## Tech Stack

- **Frontend** — Next.js 15, Tailwind CSS, Framer Motion
- **AI** — OpenRouter (free model)
- **Auth & DB** — Supabase
- **Deployment** — Vercel

## Getting Started

```bash
npm install
npm run dev
```

Add a `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
```
