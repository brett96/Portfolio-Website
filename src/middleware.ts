/**
 * Next.js Middleware (Edge runtime). For /admin, only check that the session
 * cookie exists; do not verify the token here (firebase-admin is not available on Edge).
 * Secure verification happens in src/app/admin/layout.tsx with admin.auth().verifySessionCookie().
 * Full implementation in Phase 3.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
