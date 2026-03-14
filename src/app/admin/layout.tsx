/**
 * Admin layout. Middleware already checked that the session cookie exists;
 * here we verify it with firebase-admin (verifySessionCookie) and redirect
 * to /login if invalid. Renders sidebar + sign-out + children.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";
import { AdminSignOut } from "./AdminSignOut";
import { LayoutDashboard, FolderOpen, Briefcase, GraduationCap, ExternalLink } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="flex w-56 flex-col border-r border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="font-semibold text-foreground no-underline hover:text-foreground/90">
            Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <FolderOpen className="size-4" />
            Projects
          </Link>
          <Link
            href="/admin/experience"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <Briefcase className="size-4" />
            Experience
          </Link>
          <Link
            href="/admin/education"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <GraduationCap className="size-4" />
            Education
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View site
          </a>
        </nav>
        <div className="border-t border-border p-3">
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
