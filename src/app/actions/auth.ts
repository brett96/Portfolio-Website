"use server";

/**
 * Server Actions for auth: create long-lived session cookie and clear it.
 * Used after client-side Firebase sign-in; middleware and admin layout rely on the cookie.
 */

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

/** Session cookie validity: 14 days (max allowed by Firebase is 2 weeks). */
const SESSION_COOKIE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Exchange a Firebase ID token for a long-lived session cookie and set it.
 * Call this from the client after signInWithEmailAndPassword and getIdToken().
 */
export async function createSessionCookie(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE_MS,
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
      path: "/",
    });
    return { success: true };
  } catch (e) {
    console.error("createSessionCookie error:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create session",
    };
  }
}

/**
 * Clear the session cookie (e.g. on sign out).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
