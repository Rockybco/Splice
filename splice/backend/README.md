# Backend placeholder (no code yet — waiting for UI go-ahead)

Locked stack = SPLICE (see `docs/DECISIONS.md`): Next.js Route Handlers + Supabase + Resend + Gemini + Vercel Cron. This folder = service notes only, not a Python server.

Planned:
- `api/routes/` notes — auth (V1: password+OTP), onboarding (6 steps), content/generate, review/approve, schedule, publish, admin, webhooks
- `models/` — users, workspaces, brand_voice, content_items, versions, comments, approvals, scheduled_posts, publish_logs, audit_logs
- `services/ai/` — Gemini repurpose (LinkedIn -> IG carousel 6 slides + X thread 5 tweets)
- `services/email/` — Resend (OTP, approved, changes-requested, publish alerts)
- `services/oauth/` — LinkedIn OAuth v2 (60-day tokens, refresh/disconnect)
- `services/scheduler/` — Vercel Cron + Supabase queue (LinkedIn live, IG Canva copy, X copy-paste)
- `workers/` — cron handlers
- `tests/` — pending

Decided: Supabase Postgres+RLS, Resend OTP/notifications, Gemini repurpose, LinkedIn OAuth v2 60-day.
