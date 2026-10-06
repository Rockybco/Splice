import { Logo } from "@/components/SpliceShell";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features">Features</a><a href="#how">How it works</a><a href="#proof">Results</a>
          </nav>
          <div className="flex gap-2">
            <a className="btn2" href="/auth/signup">Sign In</a>
            <a className="btn" href="/auth/signup">Start Free</a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12 fade-up">
        <h1 className="text-4xl font-extrabold max-w-2xl">Create content for every platform. In 30 seconds.</h1>
        <p className="mt-3 text-lg text-gray-600">Paste a LinkedIn post. We&apos;ll handle the rest.</p>
        <div className="mt-6 flex gap-3">
          <a className="btn" href="/auth/signup">Start Free</a>
          <a className="btn2" href="/generate">Save Live Demo</a>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl text-center">
          <div className="card"><div className="text-2xl font-extrabold">45,293</div><div className="text-sm text-gray-500">Posts generated</div></div>
          <div className="card"><div className="text-2xl font-extrabold">2,847</div><div className="text-sm text-gray-500">Creators</div></div>
          <div className="card"><div className="text-2xl font-extrabold">12.6 hrs</div><div className="text-sm text-gray-500">Avg time saved /mo</div></div>
        </div>
        <div id="features" className="mt-10 grid md:grid-cols-3 gap-4">
          {[["⚡", "30-Second Splice", "One paste becomes LinkedIn, IG carousel & X thread."], ["🎙", "Brand Voice Lock", "AI trained on your tone, words, and rules."], ["📈", "Auto-Publish", "LinkedIn OAuth v2 + Canva-ready + Typefully."]].map(([i, t, d]) => (
            <div key={t} className="card"><div className="text-2xl">{i}</div><div className="font-bold mt-2">{t}</div><div className="text-sm text-gray-600 mt-1">{d}</div></div>
          ))}
        </div>
        <div id="how" className="card mt-6">1 · Paste your LinkedIn post → 2 · Splice splits it per platform → 3 · Publish everywhere at once</div>
      </main>
    </div>
  );
}
