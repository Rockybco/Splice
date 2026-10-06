-- SPLICE patch 001 — app-managed profiles (no Supabase Auth dependency).
-- Our app uses its own JWT + OTP auth, so profiles must not require auth.users rows.
-- Run this in Supabase SQL Editor AFTER SCHEMA.sql.

alter table profiles drop constraint if exists profiles_id_fkey;
alter table brand_voices drop constraint if exists brand_voices_user_id_fkey;
alter table content_items drop constraint if exists content_items_author_id_fkey;
alter table content_items drop constraint if exists content_items_reviewer_id_fkey;
alter table content_versions drop constraint if exists content_versions_content_id_fkey;
alter table content_versions drop constraint if exists content_versions_editor_id_fkey;
alter table social_accounts drop constraint if exists social_accounts_user_id_fkey;
alter table publish_logs drop constraint if exists publish_logs_content_id_fkey;
alter table audit_logs drop constraint if exists audit_logs_actor_id_fkey;

-- Re-add same-column FKs WITHOUT the auth.users link (profiles.id stays uuid PK):
alter table brand_voices
  add constraint brand_voices_user_id_fkey foreign key (user_id) references profiles(id) on delete cascade;
alter table content_items
  add constraint content_items_author_id_fkey foreign key (author_id) references profiles(id) on delete cascade;
alter table content_items
  add constraint content_items_reviewer_id_fkey foreign key (reviewer_id) references profiles(id) on delete set null;
alter table content_versions
  add constraint content_versions_content_id_fkey foreign key (content_id) references content_items(id) on delete cascade;
alter table social_accounts
  add constraint social_accounts_user_id_fkey foreign key (user_id) references profiles(id) on delete cascade;
alter table publish_logs
  add constraint publish_logs_content_id_fkey foreign key (content_id) references content_items(id) on delete cascade;
