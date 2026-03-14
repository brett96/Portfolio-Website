/**
 * Admin layout. Middleware already checked that the session cookie exists;
 * here we verify it with firebase-admin (verifySessionCookie) and redirect
 * to /login if invalid. Renders AdminShell (sidebar + mobile sheet) + children.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";
import { AdminShell } from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    await getAdminAuth().verifySessionCookie(sessionCookie, true);
  } catch {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
