export default function Step3() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/onboarding/step-4" className="card w-[500px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "50%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">3 OF 6</div>
        <h1 className="text-2xl font-extrabold">Describe your tone, Splicer</h1>
        <label className="label mt-4">How does your writing sound? (20–500 chars)</label>
        <textarea className="input" name="tone" rows={4} minLength={20} maxLength={500} defaultValue="Direct, no-nonsense, pragmatic. Short sentences. Zero fluff." required />
        <button className="btn mt-4">Next →</button>
      </form>
    </div>
  );
}
