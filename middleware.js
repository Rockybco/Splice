import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";

const PROTECTED = [/^\/dashboard/, /^\/generate/, /^\/content\//, /^\/history/, /^\/settings/, /^\/admin/, /^\/onboarding/, /^\/auth\/linkedin/];

export function middleware(req) {
  const path = req.nextUrl.pathname;
  if (!PROTECTED.some((re) => re.test(path))) return NextResponse.next();
  if (req.cookies.get(COOKIE)?.value) return NextResponse.next();
  return NextResponse.redirect(new URL("/auth/signup", req.url));
}

export const config = { matcher: ["/dashboard/:path*", "/generate", "/content/:path*", "/history", "/settings/:path*", "/admin/:path*", "/onboarding/:path*", "/auth/linkedin"] };
