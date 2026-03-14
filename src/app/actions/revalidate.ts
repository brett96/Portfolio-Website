"use server";

/**
 * On-demand revalidation for public portfolio pages.
 * Call after admin create/update/delete so the live site shows new data without waiting for ISR.
 * Only runs revalidation if the request has a valid admin session cookie.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

const PUBLIC_PATHS = ["/", "/projects", "/experience", "/education"] as const;

/**
 * Revalidate the home and section pages so the next visitor sees fresh Firestore data.
 * No-op if session cookie is missing or invalid (so only admins can trigger it).
 */
export async function revalidatePortfolio(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return;

    await getAdminAuth().verifySessionCookie(sessionCookie, true);
    for (const path of PUBLIC_PATHS) {
      revalidatePath(path);
    }
  } catch {
    // Invalid or expired session; skip revalidation
  }
}
