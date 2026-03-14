"use client";

/**
 * Client wrapper for public layout: header, footer, and Contact modal state.
 * Receives projects and experience from server layout; renders Contact Me modal when opened.
 */
import { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { ContactModal } from "@/components/public/ContactModal";
import { Github, Linkedin } from "lucide-react";
import type { Project, Experience } from "@/types";

interface PublicLayoutClientProps {
  projects: Project[];
  experience: Experience[];
  children: React.ReactNode;
}

export function PublicLayoutClient({
  projects,
  experience,
  children,
}: PublicLayoutClientProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader
        projects={projects}
        experience={experience}
        onOpenContact={() => setContactOpen(true)}
      />
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
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/experience"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Experience
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </footer>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
