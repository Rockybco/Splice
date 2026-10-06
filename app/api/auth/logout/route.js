import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";
export async function POST() {
  const res = NextResponse.redirect(new URL("/auth/signup", process.env.NEXT_PUBLIC_BASE || "http://localhost:3000"));
  res.cookies.delete(COOKIE);
  return res;
}
