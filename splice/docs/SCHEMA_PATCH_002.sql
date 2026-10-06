-- SPLICE patch 002 — Supabase-first storage (app-managed auth, no Supabase Auth).
-- Run in Supabase SQL Editor AFTER SCHEMA.sql (and 001 if you ran it — safe either way).

-- 1. Drop the auth.users link if 001 wasn't applied (no-op if it was).
alter table profiles drop constraint if exists profiles_id_fkey;

-- 2. App-auth columns on profiles.
alter table profiles add column if not exists password_hash text;
alter table profiles add column if not exists verified boolean default false;

-- 3. OTP store (signup + password reset codes; replaces local JSON otps).
create table if not exists otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  kind text not null default 'signup',
  exp timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists otps_email_idx on otps(email);
alter table otps enable row level security;
-- NOTE: server uses service_role (bypasses RLS). No public policies = anon blocked. Good.
