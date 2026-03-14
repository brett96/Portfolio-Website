"use client";

/**
 * Homepage carousel: three sections (Projects, Experience, Education) that rotate
 * and are clickable to navigate to their detail pages. Uses framer-motion for transitions.
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: "projects",
    title: "Projects",
    description: "Selected work and side projects.",
    href: "/projects",
    icon: FolderOpen,
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "experience",
    title: "Experience",
    description: "Work history and roles.",
    href: "/experience",
    icon: Briefcase,
    color: "from-chart-2/20 to-chart-2/5",
  },
  {
    id: "education",
    title: "Education",
    description: "Academic background.",
    href: "/education",
    icon: GraduationCap,
    color: "from-chart-3/20 to-chart-3/5",
  },
] as const;

const ROTATE_MS = 5000;

export function HomeCarousel() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <section className="relative mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`bg-gradient-to-br ${slide.color} p-8 sm:p-12`}
          >
            <Link
              href={slide.href}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
            >
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary">
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {slide.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{slide.description}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                  View more
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots + nav */}
        <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-6 py-4">
          <div className="flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to ${s.title}`}
                onClick={() => goTo(i)}
                className="group flex flex-col items-center gap-1"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/40 group-hover:bg-muted-foreground/60"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(index - 1)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="sr-only">Previous</span>
              <svg className="size-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(index + 1)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="sr-only">Next</span>
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
