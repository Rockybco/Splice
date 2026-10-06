import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser, loadDb } from "@/lib/guard";
import ReviewClient from "./client";

export default function Review({ params }) {
  const me = currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  const db = loadDb();
  const c = db.contents.find((x) => x.id === params.id);
  if (!c) return <div className="p-8">Not found</div>;
  return (
    <Shell title="Review" crumbs={[`Review · ${c.id}`, `from ${c.authorEmail}`]} nav={oyinNav} user="Oyin">
      <div className="text-sm text-gray-500 mb-3">Status: <b>{c.status}</b> · Submitted content</div>
      <ReviewClient item={c} />
    </Shell>
  );
}
