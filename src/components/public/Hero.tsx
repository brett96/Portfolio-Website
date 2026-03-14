/**
 * Hero section: name, tagline, short intro. Optional Download Resume button.
 */
import type { HeroContent } from "@/types";
import { Download, Github, Linkedin } from "lucide-react";

const DEFAULTS: HeroContent = {
  name: "Brett Tomita",
  tagline: "Senior Software Engineer",
  description: "Over 10 years of experience building clean, maintainable software",
};

interface HeroProps {
  /** From Firestore (getHero). If null/undefined, defaults are used. */
  hero?: HeroContent | null;
  /** If set, show a Download Resume button below the description. */
  resumeUrl?: string | null;
}

export function Hero({ hero, resumeUrl }: HeroProps) {
  const name = hero?.name?.trim() || DEFAULTS.name;
  const tagline = hero?.tagline?.trim() || DEFAULTS.tagline;
  const description = hero?.description?.trim() || DEFAULTS.description;
  const showResume = resumeUrl?.trim();

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/60 to-background px-6 py-20 sm:py-28">
      <div className="container relative mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {name}
        </h1>
        <div className="absolute top-1/2 right-0 hidden -translate-y-1/2 items-center gap-2 md:flex">
          <a
            href="https://github.com/brett96"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="size-6 sm:size-7" />
          </a>
          <a
            href="https://www.linkedin.com/in/brett-tomita-9186a615a"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-6 sm:size-7" />
          </a>
        </div>
        <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
          {tagline}
        </p>
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          <a
            href="https://github.com/brett96"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="size-6 sm:size-7" />
          </a>
          <a
            href="https://www.linkedin.com/in/brett-tomita-9186a615a"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-6 sm:size-7" />
          </a>
        </div>
        <p className="mt-6 max-w-xl mx-auto text-base text-muted-foreground/90 leading-relaxed">
          {description}
        </p>
        {showResume && (
          <a
            href={showResume}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Download className="size-4" />
            Download Resume
          </a>
        )}
      </div>
    </section>
  );
}
