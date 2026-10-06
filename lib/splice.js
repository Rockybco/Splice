// SPLICE shared constants — matches docs/DECISIONS.md (locked).
export const ROLES = { CREATOR: "creator", REVIEWER: "reviewer", ADMIN: "admin" };
export const STATUSES = ["Draft", "In Review", "Changes Requested", "Approved", "Scheduled", "Published", "Failed"];

// Approval rules (locked 2026-10-05, updated: Oyin own = no approval)
export function needsApproval({ authorRole }) {
  // Owner + 2 creators need Oyin; Oyin's own posts skip approval.
  return authorRole !== ROLES.REVIEWER;
}

export const COLORS = {
  teal: "#0D7377",
  cream: "#F4E8DC",
  amber: "#D4A574",
  dark: "#0F1419",
  error: "#E63946",
  success: "#2A9D8F",
  white: "#FFFFFF",
  lightGray: "#F8F6F2",
};

export function canAccessAdmin(session) {
  return session?.role === ROLES.ADMIN;
}
export function canAccessReview(session) {
  return session?.role === ROLES.REVIEWER || session?.role === ROLES.ADMIN;
}
