/**
 * Next.js Middleware (Edge runtime). For /admin, only check that the session
 * cookie exists; do not verify the token here (firebase-admin is not available on Edge).
 * Secure verification happens in src/app/admin/layout.tsx with admin.auth().verifySessionCookie().
 * Full implementation in Phase 3.
 *
 * EDC page views: logs one count per HTML navigation to /edc/ (see scheduleEdcPageViewLog).
 */

import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

function scheduleEdcPageViewLog(request: NextRequest, context: NextFetchEvent) {
  const secret = process.env.EDC_ANALYTICS_INGEST_SECRET;
  if (!secret) return;
  if (request.headers.get("sec-fetch-dest") !== "document") return;
  const ua = request.headers.get("user-agent") ?? "";
  if (
    /bot|crawl|spider|slurp|bingpreview|facebookexternal|embedly|lighthouse|pingdom|prerender|headlesschrome|preview/i.test(
      ua
    )
  ) {
    return;
  }
  const target = new URL("/api/analytics/edc", request.nextUrl.origin);
  context.waitUntil(
    fetch(target, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    }).catch(() => undefined)
  );
}

export async function middleware(request: NextRequest, context: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Force /edc → /edc/ so the proxied PWA's relative asset URLs (./css/app.css,
  // ./js/app.js, etc.) resolve against /edc/ instead of the site root.
  // Done in middleware with a strict equality check because Next.js's
  // next.config.ts `redirects` source matching treats trailing slashes as
  // optional, which caused /edc/ to match `source: "/edc"` and created an
  // infinite redirect loop.
  // Use the standard URL constructor, not NextURL.clone(): NextURL formats
  // href without a trailing slash unless trailingSlash: true, which strips
  // "/edc/" back to "/edc" and causes an infinite 308 loop with
  // skipTrailingSlashRedirect (see vercel/next.js#66738).
  if (pathname === "/edc") {
    const dest = new URL("/edc/", request.nextUrl.origin);
    return NextResponse.redirect(dest.toString(), 308);
  }

  if (pathname === "/edc/") {
    scheduleEdcPageViewLog(request, context);
  }

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
  matcher: ["/edc", "/edc/", "/admin", "/admin/:path*"],
};
