export default function Step5() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/onboarding/step-6" className="card w-[600px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "83%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">5 OF 6 · Semantic Integrity &amp; Negative Prompting</div>
        <h1 className="text-2xl font-extrabold">Words to avoid 🛡</h1>
        <p className="text-sm text-gray-500">Banned vocabulary blocked by AI Stop Shield™.</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {["corporate", "clickbait", "delve", "synergy", "game-changer", "tapestry", "revolutionize"].map((w) => <span key={w} className="badge bg-red-50 border">{w} ×</span>)}
        </div>
        <input className="input mt-3" name="wordsAvoid" placeholder="Add banned buzzword (e.g. synergy)" />
        <button className="btn mt-4">Next: Content Rules →</button>
      </form>
    </div>
  );
}
