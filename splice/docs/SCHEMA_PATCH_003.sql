-- SPLICE patch 003 — invites + post images. Run in Supabase SQL Editor.

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null default 'creator' check (role in ('creator','reviewer')),
  token text unique not null,
  invited_by text default '',
  accepted boolean default false,
  created_at timestamptz default now()
);
create index if not exists invites_token_idx on invites(token);
alter table invites enable row level security;

alter table content_items add column if not exists image_urls text[] default '{}';
