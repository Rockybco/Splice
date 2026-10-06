export default function Step2() {
  const pillars = ["AI Automation & Growth", "Personal Branding", "Entrepreneurship", "Productivity", "Other"];
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/onboarding/step-3" className="card w-[500px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "33%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">2 OF 6</div>
        <h1 className="text-2xl font-extrabold">Pick your content pillar</h1>
        <div className="flex flex-col gap-2 mt-4">
          {pillars.map((p, i) => (
            <label key={p} className="flex items-center gap-2 border rounded-md px-3 py-2">
              <input type="radio" name="pillar" value={p} defaultChecked={i === 0} /> {p}
            </label>
          ))}
        </div>
        <button className="btn mt-4">Next →</button>
      </form>
    </div>
  );
}
