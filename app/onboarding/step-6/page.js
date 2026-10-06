export default function Step6() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form action="/auth/linkedin" className="card w-[500px] fade-up">
        <div className="h-2 rounded bg-gray-100"><div className="h-2 rounded" style={{ width: "100%", background: "#0D7377" }} /></div>
        <div className="text-xs font-bold mt-3">6 OF 6</div>
        <h1 className="text-2xl font-extrabold">Formatting rules &amp; constraints</h1>
        <textarea className="input mt-4" name="rules" rows={4} maxLength={1000} placeholder="No hashtags on LinkedIn. Max 2 emojis. Always end with a question. (optional)" />
        <button className="btn mt-4 w-full">Save &amp; Continue →</button>
      </form>
    </div>
  );
}
