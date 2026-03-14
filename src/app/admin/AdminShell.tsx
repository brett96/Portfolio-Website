"use client";

/**
 * Admin layout shell: sidebar (desktop) and collapsible Sheet menu (mobile).
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminSignOut } from "./AdminSignOut";
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  GraduationCap,
  ExternalLink,
  FileText,
  Menu,
  Type,
  FileDown,
  type LucideIcon,
} from "lucide-react";

const NAV_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Site header", icon: Type },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/about", label: "About", icon: FileText },
  { href: "/admin/resume", label: "Resume", icon: FileDown },
];

const linkClass =
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={`${linkClass} ${pathname === href ? "bg-sidebar-accent text-foreground" : ""}`}
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground ${onNavigate ? "" : ""}`}
      >
        <ExternalLink className="size-4 shrink-0" />
        View site
      </a>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <Link
            href="/admin"
            className="font-semibold text-foreground no-underline hover:text-foreground/90"
          >
            Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <NavLinks />
        </nav>
        <div className="border-t border-border p-3">
          <AdminSignOut />
        </div>
      </aside>

      {/* Mobile header + Sheet menu */}
      <div className="flex flex-1 flex-col md:contents">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-card px-4 shadow-sm md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <div className="p-4 border-b border-border">
                <Link
                  href="/admin"
                  onClick={() => setSheetOpen(false)}
                  className="font-semibold text-foreground no-underline"
                >
                  Admin
                </Link>
              </div>
              <nav className="flex flex-1 flex-col gap-0.5 p-3 overflow-auto">
                <NavLinks onNavigate={() => setSheetOpen(false)} />
              </nav>
              <div className="border-t border-border p-3">
                <AdminSignOut />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground">Admin</span>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
