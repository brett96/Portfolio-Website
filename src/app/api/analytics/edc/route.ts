/**
 * EDC analytics ingest (Firestore daily page-view counters).
 *
 * POST with Authorization: Bearer <EDC_ANALYTICS_INGEST_SECRET>
 * (called from Edge middleware only; secret is never exposed to browsers).
 *
 * Vercel: set EDC_ANALYTICS_INGEST_SECRET (long random string).
 */

import { NextRequest, NextResponse } from "next/server";
import { recordEdcPageView } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  const ingestSecret = process.env.EDC_ANALYTICS_INGEST_SECRET;
  if (!ingestSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${ingestSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await recordEdcPageView();
  return NextResponse.json({ ok });
}
