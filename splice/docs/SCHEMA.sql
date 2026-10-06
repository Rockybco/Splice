-- SPLICE Supabase schema (apply in Supabase SQL editor; RLS on)
-- Stack: Next.js + Supabase + Resend + Gemini + Vercel (locked).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  handle text,
  role text not null default 'creator' check (role in ('creator','reviewer','admin')),
  created_at timestamptz default now()
);

create table if not exists brand_voices (
  user_id uuid primary key references profiles(id) on delete cascade,
  pillar text default 'AI Automation & Growth',
  tone text default 'Direct, Practical',
  words_use text[] default '{practical,direct,authentic}',
  words_avoid text[] default '{corporate,clickbait}',
  rules text default '',
  updated_at timestamptz default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  original text not null,
  linkedin text,
  carousel_json jsonb default '[]',
  thread_json jsonb default '[]',
  status text not null default 'Draft'
    check (status in ('Draft','In Review','Changes Requested','Approved','Scheduled','Published','Failed')),
  reviewer_id uuid references profiles(id),
  feedback text,
  scheduled_for timestamptz,
  published_at timestamptz,
  impressions int default 0,
  created_at timestamptz default now()
);

create table if not exists content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content_items(id) on delete cascade,
  editor_id uuid references profiles(id),
  label text,
  diff jsonb,
  created_at timestamptz default now()
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  provider text not null, -- linkedin | instagram-helper | x-helper
  handle text,
  access_token_enc text,
  expires_at timestamptz,
  meta jsonb default '{}',
  created_at timestamptz default now(),
  unique(user_id, provider)
);

create table if not exists publish_logs (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content_items(id) on delete cascade,
  platform text not null,
  status text not null,
  response jsonb,
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  target text,
  detail text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table brand_voices enable row level security;
alter table content_items enable row level security;
alter table social_accounts enable row level security;
-- NOTE: add RLS policies per workspace isolation in Supabase dashboard.
