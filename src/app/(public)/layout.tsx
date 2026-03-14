/**
 * Public layout: header and footer for home and login.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <a
            href="/"
            className="font-semibold text-foreground no-underline hover:text-foreground/90 transition-colors"
          >
            Brett Tomita
          </a>
          <nav className="flex items-center gap-6">
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
          </nav>
        </div>
      </header>
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
