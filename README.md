# LUMÉ — Your Personal Beauty & Style AI ✨

**Live Demo → [lume-beauty.vercel.app](https://lume-beauty.vercel.app)**

LUMÉ is an AI-powered beauty and style assistant built specifically for Indian beauty lovers. It gives real, personalized advice on skincare, makeup, outfits, haircare, and more — all tailored to your unique profile.

---

## Features

- 💄 Personalized skincare, makeup & haircare routines
- 👗 Outfit suggestions by occasion — college, office, date night, wedding, festival
- 🛍️ Budget-aware product recommendations in ₹ with Indian & international brands
- 🔍 Ingredient checker — paste any product's ingredient list and get a safety analysis
- 🛒 Dupe finder — find affordable Indian alternatives to expensive products
- 🌸 Daily rotating glow tips
- 🎨 Color analysis based on skin tone
- 🌍 Climate-aware advice (humid Mumbai vs dry Delhi vs cold Himachal)
- 💬 Persistent chat history with named sessions
- 👍 Feedback buttons on every AI response
- 📋 Copy response button
- 📱 Fully mobile responsive with slide-in sidebar
- 🔐 Email/password auth + Google Sign-In via Supabase
- 👤 Beauty profile — skin type, skin tone, hair type, style vibe, budget, age range, climate zone
- 📊 Profile completion tracker

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| AI Provider | OpenRouter |
| AI Model | `openrouter/auto` (free tier) |
| AI SDK | Vercel AI SDK (`ai` package) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Icons | Lucide React |
| Markdown | react-markdown + remark-gfm |

---

## AI Model

LUMÉ uses **OpenRouter's free routing** (`openrouter/auto`) which automatically selects from available free models including:
- Meta Llama 3
- Mistral 7B
- Google Gemma

The system prompt is heavily customized for Indian beauty context — skin tones, Indian brands (Nykaa, Lakmé, Mamaearth, Minimalist, Dot & Key, Sugar Cosmetics etc.), INR pricing, and Indian climate zones.

---

## Database Schema

```sql
-- Beauty profiles
profiles (user_id, skin_type, skin_tone, hair_type, style_vibe, budget, age_range, climate_zone)

-- Chat sessions
chat_sessions (id, user_id, title, created_at, updated_at)

-- Messages
messages (id, session_id, role, content, image_url, created_at)

-- Feedback
feedback (id, message_id, user_id, type, created_at)
```

---

## Getting Started Locally

```bash
git clone https://github.com/shreya-rgb/Lume.git
cd Lume/lume-beauty-chatbot
npm install
npm run dev
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Then run the SQL from `supabase-schema.sql` in your Supabase SQL editor.

---

## Project Structure

```
lume-beauty-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/          # AI streaming endpoint
│   │   ├── feedback/      # Thumbs up/down
│   │   └── sessions/      # Chat session CRUD
│   ├── auth/
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── chat/              # Main chat UI
│   ├── profile/           # Beauty profile page
│   └── page.tsx           # Landing page
├── components/
│   └── Sidebar.tsx
├── lib/
│   ├── system-prompt.ts   # AI personality & context
│   ├── rate-limit.ts
│   └── supabase/
└── types/
```

---

Built with ❤️ for Indian beauty lovers 🌸
