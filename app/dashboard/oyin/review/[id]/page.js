import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { getContent, shortId } from "@/lib/store";
import ReviewClient from "./client";

export default async function Review({ params }) {
  const me = await currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  const c = await getContent(params.id);
  if (!c) return <div className="p-8">Not found</div>;
  return (
    <Shell title="Review" crumbs={[`Review · ${shortId(c.id)}`, `from ${c.authorEmail}`]} nav={oyinNav} user="Oyin">
      <div className="text-sm text-gray-500 mb-3">Status: <b>{c.status}</b> · Submitted content</div>
      <ReviewClient item={c} />
    </Shell>
  );
}
