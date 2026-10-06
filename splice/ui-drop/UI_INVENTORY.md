# UI Drop Inventory (2026-10-06)

## Sources
- `stitchify-zip/WhatsApp Unknown 2026-10-06 at 08.46.30.zip` (original, 3.5MB, 35 JPEGs)
- `mockups/whatsapp-2026-10-06/` — 35 JPEGs extracted (screens, timestamps 08:31:34–08:31:43, order != screen order)
- `splice_ui_kit.pdf` (3.3MB, 25 pages) — CANONICAL: all 35 screens labeled 🧵1–35 with routes, copy, and layout. Use this for build.

## PDF coverage (verified full text extract)
- User 1-12: Landing `/`, Signup `/auth/signup`, OTP `/auth/verify-otp`, Onboarding 1-6 `/onboarding/step-1..6`, LinkedIn `/auth/linkedin`, Dashboard `/dashboard`, Generate `/generate`
- User 13-15: Review tabs `/content/[id]` (LinkedIn/IG 6-slide/X 5-tweet), 16 Success modal, 17 Settings `/settings`, 18 History `/history`
- Oyin 19-25: Dashboard `/dashboard/oyin`, My Content, Queue, Review `[id]`, Approve modal, Request-changes modal, Settings `/settings/oyin`
- Admin 26-35: Overview, Users, Team Activity, Content Activity, Publishing Monitor, Social Accounts, Analytics, Audit Log, Settings, Advanced

## JPEGs (visual reference, filenames are timestamps)
35 files in `mockups/whatsapp-2026-10-06/`. Spot-checked:
- 08.31.34 = Generate/Splicing Studio, 08.31.38 = Admin Users, 08.31.41 = Oyin Settings, 08.31.43 = Onboarding Step 5 (Stop Shield)
- Style matches spec: Teal #0D7377 / Cream / Amber, Inter, 6px buttons / 8px cards.

## Build readiness
- Design source: `splice_ui_kit.pdf` (labels + copy) + JPEGs (pixel ref) + `docs/DECISIONS.md` (auth V1, Supabase stack, 4 users, Oyin-approves-except-own, 7 statuses).
- Still NO BUILD until explicit "go ahead".
