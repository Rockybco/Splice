# SPLICE — Scaffold (WAITING FOR UI — DO NOT BUILD YET)

Status: folders + placeholders only. No code implemented.
Waiting for user to drop Stitchify UIs into `splice/ui-drop/`, then give go-ahead.

## Specs understood
- `SPLICE_COMPLETE_35_SCREENS.md` — 35 screens: 18 User + 7 Oyin + 10 Admin, colors, logo animation 2.5s, Stitchify prompt.
- `AI_Content_Platform_V1_and_Revised_V1.md` — Revised V1 supersedes V1: separate Admin Oversight Workspace (non-blocking), Creator workspaces, Oyin = designated reviewer/approver, Creator schedules after approval, scheduler auto-publishes. Google Docs import/backup. V2/V3 = analytics, comments (deferred).

## Locked decisions (2026-10-05, see `docs/DECISIONS.md`)
1. Auth = V1 (Name/Email/Password + OTP + Email/Password login).
2. Stack = SPLICE (Next.js+TS / Supabase / Resend / Gemini / Vercel, no FastAPI).
3. 4 users: all Creator; Oyin = sole reviewer (Owner + 2 creators need approval, Oyin own = no approval); Owner = monitor-only Admin via switcher, single login.
4. LinkedIn = both auto-post + composer fallback.
5. IG/X = best MVP: copy-paste + Canva/Typefully (LinkedIn only auto-publishes).
6. Onboarding = SPLICE 6 steps only.
7. Google Docs + calendar still in MVP.
8. Statuses = simplified 7 LOCKED (Draft/In Review/Changes Requested/Approved/Scheduled/Published/Failed).

## Structure
```
splice/
  frontend/app/...        # 35 Next.js App Router route folders (empty, waiting for UI)
  frontend/components/... # ui / layout / branding / modals / toasts (empty)
  frontend/lib/           # auth, db, ai, email, linkedin helpers (empty)
  frontend/styles/        # tokens.css only (color/typography tokens, no styling built)
  backend/...             # FastAPI placeholder structure (empty)
  docs/ROUTES.md          # 35-screen route map
  ui-drop/                # DROP STITCHIFY ZIP + mockups HERE
    stitchify-zip/
    mockups/
```

## Colors (from spec — tokens only, not applied yet)
- Primary Teal #0D7377, Cream #F4E8DC, Amber #D4A574, Dark #0F1419
- Error #E63946, Success #2A9D8F, White #FFFFFF, Light Gray #F8F6F2
- Font: Inter. H1 32 Bold, H2 24 Bold, Body 16, Label 14.
- Buttons 6px, Cards 8px, spacing 12/24/48. Light theme only.

## Next step (blocked)
1. User drops UI ZIP + mockups into `splice/ui-drop/`
2. User says "go ahead"
3. Then: init Next.js + Tailwind tokens, wire 35 routes, backend, Supabase/Postgres, Resend, Gemini, LinkedIn OAuth.

Existing `app/` (apex-housing-mvp) left untouched.
