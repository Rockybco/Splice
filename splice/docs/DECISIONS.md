# SPLICE — Locked Decisions (2026-10-05, pre-UI)

Still NO BUILD — waiting for UI drop in `splice/ui-drop/` + go-ahead.

## 1. Auth — Follow V1
- Signup fields: Name + Email + Password + Confirm Password
- Auto-send 6-digit OTP to email on signup
- Must verify OTP before onboarding (`/auth/verify-otp`)
- Later logins: Email + Password (+ Forgot Password / Create Account)
- OTP via Resend. Hash passwords (bcrypt). Secure sessions. Rate-limit OTP resend.

## 2. Stack — Follow SPLICE
- Frontend: Next.js + React + TypeScript (App Router, existing `splice/frontend/app/...` folders)
- DB/Auth/Storage: Supabase (Postgres + Auth + RLS for workspace isolation)
- Email: Resend
- AI: Gemini API (repurpose LinkedIn -> IG 6-slide + X 5-tweet, with brand voice)
- Deploy: Vercel. No separate FastAPI/Redis for MVP.
- Backend logic = Next.js Route Handlers + Supabase + Vercel Cron for scheduler.
- `splice/backend/` folder kept as service-notes only (ai/email/oauth/scheduler notes), not a Python server.
- Analytics AI (Claude) = V2, deferred.

## 3. Users/Roles — 4 users, single login + switcher (LOCKED 2026-10-05)
- 4 people total. EVERYONE is a Creator first (Screens 1-18: dashboard, generate, content, history, settings).
- Oyin = sole Reviewer + Editor (Screens 19-25). Owner + 2 creators need Oyin approval. Oyin's own posts = no approval.
- Owner (you/Rocky) = EXTRA monitor-only Admin Oversight (Screens 26-35). Admin does NOT approve content, only monitors team/content/publishing/users/audit.
- Other 2 creators = creator-only.
- Access: SINGLE login (V1 Email+Password, OTP-verified once), then in-app switcher:
  - All see Creator nav by default.
  - Oyin additionally sees "Switch to Review" -> `/dashboard/oyin/*`.
  - Owner additionally sees "Switch to Admin" -> `/admin/*`.
  - Guards: `/dashboard/oyin/*` requires reviewer role, `/admin/*` requires admin role. Creator routes require auth.
- Approval rules:
  - Owner + 2 creators: Approval YES, Reviewer Oyin, schedule after approval only.
  - Oyin own: Approval NO, schedule/publish direct.

## 4. LinkedIn — Both
- Primary: LinkedIn OAuth v2 auto-post ("Post to LinkedIn" when connected, 60-day token, refresh/disconnect, Screen 10/31).
- Fallback: "Share to LinkedIn Composer" / "Jump to Dashboard" when not connected.
- Store: encrypted tokens in Supabase, expiry tracking, publish logs with API response.

## 5. IG/X — Best option for MVP (locked)
- LinkedIn API = live auto-publish (only true auto-publish in MVP).
- Instagram = copy-paste + Canva helper (1080x1350, 6-slide blueprint, "Copy Carousel"), no Graph API for MVP. Schema ready to upgrade later.
- X = copy-paste + "Send to Typefully" + "Open in X" deep links, no X API (paid/rate-limited). Schema ready.
- Rationale: avoids FB Page review + X paid API, fastest to ship, matches SPLICE Screens 14/15/30.

## 6. Onboarding — SPLICE wins
- Only 6 steps (Screens 4-9): Name / Pillar / Tone (20-500) / Words-use tags / Words-avoid tags / Rules (0-1000).
- V1 Brand Values / AI rules merged INTO these 6 (values -> pillar/tone, rules -> step 6).
- No separate Welcome/Values/Calendar/Docs-import steps in onboarding flow.

## 7. Google Docs + Calendar — Still in MVP
- Monthly calendar (Day 1..N LinkedIn source) stays.
- Google Docs = import source + backup/export destination (DB is source of truth).
- Scope: import paste + Docs link, export finalized (original + IG + X + status/editor/approval/scheduled date).
- Lives under Dashboard/Generate/History, not onboarding.

## 8. Statuses — Simplified 7 (LOCKED)
- Use 7: Draft / In Review / Changes Requested / Approved / Scheduled / Published / Failed
- Dropped: "Ready for Approval" (merged into In Review — Oyin approves directly).
- Flow (Owner + 2 creators): Draft -> In Review (submit to Oyin) -> Approved OR Changes Requested -> Scheduled -> Published/Failed.
- Oyin's own content: NO approval needed — Draft -> Scheduled -> Published direct (LOCKED 2026-10-05).

## Blocked — waiting for
1. UI ZIP/mockups in `splice/ui-drop/`
2. "go ahead" to build
