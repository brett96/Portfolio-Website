/**
 * Public layout: header (with Projects dropdown) and footer for home and login.
 */
import Link from "next/link";
import { getProjects } from "@/lib/firebase/admin";
import { PublicHeader } from "@/components/public/PublicHeader";
import { Github, Linkedin } from "lucide-react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects();
  } catch {
    // Firestore unavailable
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader projects={projects} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <span>Brett Tomita</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 sm:justify-normal">
              <a
                href="https://github.com/brett96"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/brett-tomita-9186a615a"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
              <span className="text-muted-foreground/50">|</span>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/experience" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Experience
              </Link>
              <Link href="/education" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Education
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
