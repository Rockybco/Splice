// Gemini repurpose — live call when GOOGLE_AI_API_KEY is set, deterministic fallback otherwise.
// Input: { pillar, tone, wordsUse[], wordsAvoid[], rules, original }
// Output: { linkedin, carousel[6], thread[5], provider }
function fallback({ pillar, tone, original }) {
  const hook = original.slice(0, 90) || "Your hook here";
  return {
    linkedin: `${hook}\n\n[${pillar || "AI Automation & Growth"} · ${tone || "Direct, Practical"}]\n\n${original}\n\n— Spliced (live AI unavailable, fallback used)`,
    carousel: ["Hook", "Problem", "Explanation", "Example", "Key Lesson", "CTA"].map((t, i) => `Slide ${i + 1} · ${t}\n${original.slice(0, 120)}`),
    thread: [1, 2, 3, 4, 5].map((n) => `${n}/5 ${original.slice(0, 200)}`.slice(0, 280)),
    provider: "fallback",
  };
}

export async function repurpose({ pillar, tone, wordsUse = [], wordsAvoid = [], rules = "", original = "" }) {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return fallback({ pillar, tone, original });
  try {
    const prompt = `You are Splice AI. Repurpose the LinkedIn post below into platform content.
Brand voice — pillar: ${pillar}; tone: ${tone}; signature words to use: ${wordsUse.join(", ") || "none"}; structural rules: ${rules || "none"}.
AI STOP SHIELD — never use these words (regenerate around them): ${wordsAvoid.join(", ") || "none"}.
Respond ONLY as JSON: {"linkedin": "...enhanced post...", "carousel": ["slide1 hook", "slide2 problem", "slide3 explanation", "slide4 example", "slide5 lesson", "slide6 cta"], "thread": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"]}. Each tweet ≤ 260 chars.
Original post:\n${original}`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } }),
    });
    if (!r.ok) throw new Error(`Gemini HTTP ${r.status}`);
    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("No JSON in Gemini response");
    const parsed = JSON.parse(m[0]);
    return {
      linkedin: String(parsed.linkedin || original),
      carousel: Array.isArray(parsed.carousel) ? parsed.carousel.slice(0, 6) : fallback({ pillar, tone, original }).carousel,
      thread: Array.isArray(parsed.thread) ? parsed.thread.slice(0, 5).map((t) => String(t).slice(0, 280)) : fallback({ pillar, tone, original }).thread,
      provider: "gemini-1.5-pro",
    };
  } catch (e) {
    console.error("Gemini live call failed, using fallback:", e?.message);
    return { ...fallback({ pillar, tone, original }), error: e?.message };
  }
}
