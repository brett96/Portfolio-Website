import { NextResponse } from "next/server";

/**
 * GET /pay — redirects to the Stripe payment link from STRIPE_PERSONAL_PAYMENT_PAGE_URL.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const raw = process.env.STRIPE_PERSONAL_PAYMENT_PAGE_URL?.trim();
  if (!raw) {
    return new NextResponse("Payment page is not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse("Invalid payment URL configuration.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return new NextResponse("Invalid payment URL configuration.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.redirect(target.toString(), 302);
}
