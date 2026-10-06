# SPLICE — 35 Screens Route Map (scaffold only, no code yet)

## USER (18)
| # | Screen | Route folder | URL |
|---|--------|--------------|-----|
| 1 | Landing | `frontend/app/(landing)` | `/` |
| 2 | Sign Up | `frontend/app/auth/signup` | `/auth/signup` |
| 3 | OTP Verify | `frontend/app/auth/verify-otp` | `/auth/verify-otp` |
| 4 | Onboarding 1 Name | `frontend/app/onboarding/step-1` | `/onboarding/step-1` |
| 5 | Onboarding 2 Pillar | `frontend/app/onboarding/step-2` | `/onboarding/step-2` |
| 6 | Onboarding 3 Tone | `frontend/app/onboarding/step-3` | `/onboarding/step-3` |
| 7 | Onboarding 4 Words-use | `frontend/app/onboarding/step-4` | `/onboarding/step-4` |
| 8 | Onboarding 5 Words-avoid | `frontend/app/onboarding/step-5` | `/onboarding/step-5` |
| 9 | Onboarding 6 Rules | `frontend/app/onboarding/step-6` | `/onboarding/step-6` |
| 10 | LinkedIn OAuth | `frontend/app/auth/linkedin` | `/auth/linkedin` |
| 11 | Dashboard | `frontend/app/dashboard` | `/dashboard` |
| 12 | Generate | `frontend/app/generate` | `/generate` |
| 13 | Content LinkedIn | `frontend/app/content/[content_id]` tab=linkedin | `/content/[content_id]` |
| 14 | Content Instagram | same — tab=instagram | `/content/[content_id]` |
| 15 | Content X | same — tab=x | `/content/[content_id]` |
| 16 | Success Modal | `frontend/components/modals/SuccessModal.*` (pending UI) | modal overlay |
| 17 | Settings | `frontend/app/settings` | `/settings` |
| 18 | History | `frontend/app/history` | `/history` |

## OYIN (7) — Oyin = real person, Content Reviewer
| # | Screen | Route folder | URL |
|---|--------|--------------|-----|
| 19 | Oyin Dashboard | `frontend/app/dashboard/oyin` | `/dashboard/oyin` |
| 20 | Oyin My Content | `frontend/app/dashboard/oyin/my-content` | `/dashboard/oyin/my-content` |
| 21 | Review Queue | `frontend/app/dashboard/oyin/review-queue` | `/dashboard/oyin/review-queue` |
| 22 | Review Interface | `frontend/app/dashboard/oyin/review/[post_id]` | `/dashboard/oyin/review/[post_id]` |
| 23 | Approve Modal | `frontend/components/modals/OyinApproveModal.*` | modal |
| 24 | Request Changes Modal | `frontend/components/modals/OyinRequestChangesModal.*` | modal |
| 25 | Oyin Settings | `frontend/app/settings/oyin` | `/settings/oyin` |

## ADMIN (10) — Oversight only, non-blocking (Revised V1)
| # | Screen | Route folder | URL |
|---|--------|--------------|-----|
| 26 | Overview | `frontend/app/admin/dashboard` | `/admin/dashboard` |
| 27 | Users | `frontend/app/admin/users` | `/admin/users` |
| 28 | Team Activity | `frontend/app/admin/team-activity` | `/admin/team-activity` |
| 29 | Content Activity | `frontend/app/admin/content-activity` | `/admin/content-activity` |
| 30 | Publishing Monitor | `frontend/app/admin/publishing-monitor` | `/admin/publishing-monitor` |
| 31 | Social Accounts | `frontend/app/admin/social-accounts` | `/admin/social-accounts` |
| 32 | Analytics | `frontend/app/admin/analytics` | `/admin/analytics` |
| 33 | Audit Log | `frontend/app/admin/audit-log` | `/admin/audit-log` |
| 34 | System Settings | `frontend/app/admin/settings` | `/admin/settings` |
| 35 | Advanced | `frontend/app/admin/settings/advanced` | `/admin/settings/advanced` |

All folders exist as empty placeholders. No page.js built yet — waiting for UI drop.
