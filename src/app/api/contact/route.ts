import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email/send";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip") ?? undefined;
}

async function getGeoFromIp(ip: string | undefined): Promise<string | undefined> {
  if (!ip || ip === "::1" || ip === "127.0.0.1") return undefined;
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
      { next: { revalidate: 0 } }
    );
    const data = await res.json();
    if (data?.status === "success") {
      const parts = [data.city, data.regionName, data.country].filter(Boolean);
      return parts.length ? parts.join(", ") : undefined;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fromName = typeof body.fromName === "string" ? body.fromName.trim() : "";
    const replyTo = typeof body.replyTo === "string" ? body.replyTo.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!fromName || !replyTo || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(replyTo)) {
      return NextResponse.json(
        { error: "Reply To must be a valid email address." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const geo = await getGeoFromIp(ip);

    const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
    const domainUrl = origin ? new URL(origin).origin : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://www.bretttomita.com";

    await sendContactEmails({
      fromName,
      replyTo,
      subject,
      message,
      domainUrl,
      ip,
      geo,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email directly." },
      { status: 500 }
    );
  }
}
