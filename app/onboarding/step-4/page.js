export default function Step4() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/onboarding/step-5" className="card w-[500px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "67%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">4 OF 6</div>
        <h1 className="text-2xl font-extrabold">Words you always use, Splicer</h1>
        <div className="flex gap-2 mt-4 flex-wrap">
          {["practical", "direct", "authentic"].map((w) => <span key={w} className="badge bg-amber-50 border">{w}</span>)}
        </div>
        <input className="input mt-3" name="wordsUse" placeholder="practical, direct, authentic" />
        <button className="btn mt-4">Next →</button>
      </form>
    </div>
  );
}
