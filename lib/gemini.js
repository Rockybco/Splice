// Gemini repurpose stub — real call wired when GOOGLE_AI_API_KEY is set.
// Input: { pillar, tone, wordsUse[], wordsAvoid[], rules, original }
// Output: { linkedin, carousel[6], thread[5] }
export async function repurpose({ pillar, tone, wordsUse = [], wordsAvoid = [], rules = "", original = "" }) {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    // Deterministic fallback so UI works without a key (clearly marked).
    const hook = original.slice(0, 90) || "Your hook here";
    return {
      linkedin: `${hook}\n\n[${pillar || "AI Automation & Growth"} · ${tone || "Direct, Practical"}]\n\n${original}\n\n— Spliced (configure GOOGLE_AI_API_KEY for live AI)`,
      carousel: ["Hook", "Problem", "Explanation", "Example", "Key Lesson", "CTA"].map((t, i) => `Slide ${i + 1} · ${t}\n${original.slice(0, 120)}`),
      thread: [1, 2, 3, 4, 5].map((n) => `${n}/5 ${original.slice(0, 200)}`.slice(0, 280)),
      provider: "fallback",
    };
  }
  // TODO: call Gemini 1.5 Pro with Stop Shield (wordsAvoid) + voice lock.
  // Keep stub return shape identical to avoid UI churn.
  return repurpose({ pillar, tone, wordsUse, wordsAvoid, rules, original: `[LIVE-KEY-SET-BUT-NOT-WIRED] ${original}` });
}
