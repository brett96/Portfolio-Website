/**
 * Public layout: header (with Projects dropdown) and footer for home and login.
 */
import { getProjects } from "@/lib/firebase/admin";
import { PublicHeader } from "@/components/public/PublicHeader";

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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Brett Tomita
            </p>
            <div className="flex gap-6">
              <a
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </a>
              <a
                href="/experience"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Experience
              </a>
              <a
                href="/education"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Education
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
