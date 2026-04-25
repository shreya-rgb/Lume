-- Run this in Supabase Dashboard > SQL Editor

-- Profiles table
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  skin_type text check (skin_type in ('oily','dry','combination','sensitive')),
  skin_tone text check (skin_tone in ('fair','wheatish','medium','dusky','deep')),
  hair_type text check (hair_type in ('straight','wavy','curly','coily')),
  style_vibe text check (style_vibe in ('casual','elegant','streetwear','ethnic','mix')),
  budget text check (budget in ('under_500','500_2000','2000_5000','5000_plus')),
  created_at timestamptz default now()
);

-- Chat sessions table
create table if not exists chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

-- Feedback table
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  message_id uuid references messages(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('thumbs_up','thumbs_down')) not null,
  created_at timestamptz default now(),
  unique(message_id, user_id)
);

-- Row Level Security
alter table profiles enable row level security;
alter table chat_sessions enable row level security;
alter table messages enable row level security;
alter table feedback enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users own their profile" on profiles;
drop policy if exists "Users own their sessions" on chat_sessions;
drop policy if exists "Users own their messages" on messages;
drop policy if exists "Users own their feedback" on feedback;

-- Policies: users can only access their own data
create policy "Users own their profile" on profiles for all using (auth.uid() = user_id);
create policy "Users own their sessions" on chat_sessions for all using (auth.uid() = user_id);
create policy "Users own their messages" on messages for all using (
  session_id in (select id from chat_sessions where user_id = auth.uid())
);
create policy "Users own their feedback" on feedback for all using (auth.uid() = user_id);
