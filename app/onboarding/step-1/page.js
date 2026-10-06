export default function Step1() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/onboarding/step-2" className="card w-[500px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "17%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">1 OF 6</div>
        <h1 className="text-2xl font-extrabold">Tell us your name, Splicer</h1>
        <label className="label mt-4">What should we call you?</label>
        <input className="input" name="name" placeholder="Rocky B." required />
        <button className="btn mt-4">Next →</button>
      </form>
    </div>
  );
}
