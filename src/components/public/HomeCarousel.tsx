"use client";

/**
 * Homepage carousel: Experience, Projects, Education (Experience first). Each slide
 * shows the section title and the first/primary entry details, with a link to the full section.
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import type { Project, Experience, Education } from "@/types";
import cercaLabsLogo from "@/components/logos/CercaLabsLogo.jpg";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

interface HomeCarouselProps {
  firstExperience?: Experience | null;
  firstProject?: Project | null;
  firstEducation?: Education | null;
}

const SLIDES = [
  {
    id: "experience",
    title: "Experience",
    description: "Work history and roles",
    href: "/experience",
    icon: Briefcase,
    color: "from-chart-2/20 to-chart-2/5",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Selected work and side projects",
    href: "/projects",
    icon: FolderOpen,
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "education",
    title: "Education",
    description: "Academic background",
    href: "/education",
    icon: GraduationCap,
    color: "from-chart-3/20 to-chart-3/5",
  },
] as const;

const EDUCATION_DURATION_MS = 5000;
const EXPERIENCE_PROJECTS_DURATION_MS = 10000;

export function HomeCarousel({
  firstExperience,
  firstProject,
  firstEducation,
}: HomeCarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex(() => (i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const slideId = SLIDES[index].id;
    const durationMs =
      slideId === "education" ? EDUCATION_DURATION_MS : EXPERIENCE_PROJECTS_DURATION_MS;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, durationMs);
    return () => clearInterval(t);
  }, [index]);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  function SlideContent() {
    if (slide.id === "experience" && firstExperience) {
      return (
        <div className="text-left">
          <p className="font-semibold text-foreground">{firstExperience.company}</p>
          <p className="text-sm text-muted-foreground">{firstExperience.role}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(firstExperience.startDate)}
            {firstExperience.endDate ? ` – ${formatDate(firstExperience.endDate)}` : " – Present"}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/90">
            {firstExperience.description}
          </p>
        </div>
      );
    }
    if (slide.id === "projects" && firstProject) {
      return (
        <div className="text-left">
          {firstProject.imageUrl && (
            <div className="mb-3 aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-muted">
              <img src={firstProject.imageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="font-semibold text-foreground">{firstProject.title}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/90">
            {firstProject.description}
          </p>
          {firstProject.tags && firstProject.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {firstProject.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-background/60 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (slide.id === "education" && firstEducation) {
      return (
        <div className="text-left">
          <p className="font-semibold text-foreground">{firstEducation.institution}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {firstEducation.degree} in {firstEducation.field}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {firstEducation.startYear} – {firstEducation.endYear}
          </p>
          {firstEducation.honors && (
            <p className="mt-2 text-sm font-medium text-primary">{firstEducation.honors}</p>
          )}
        </div>
      );
    }
    return <p className="text-sm text-muted-foreground">{slide.description}</p>;
  }

  return (
    <section className="relative mx-auto w-full max-w-4xl px-6 pt-6 pb-6 sm:pt-8 sm:pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-xl isolate">
        {/* Slide area: min-height for mobile (logos above); desktop Experience has title+logos in one row so shorter */}
        <div className="relative min-h-[380px] sm:min-h-[300px]" style={{ contain: "layout" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`absolute inset-0 bg-gradient-to-br ${slide.color} pt-10 pr-8 pb-10 pl-8 sm:pt-12 sm:pr-12 sm:pb-12 sm:pl-12`}
              style={{ contain: "layout paint" }}
            >
            <Link
              href={slide.href}
              className="group flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
            >
              {slide.id === "experience" ? (
                <>
                  {/* Mobile: logos row on top. Desktop: title left, logos right in one row */}
                  <div className="flex w-full shrink-0 flex-row flex-nowrap items-center justify-center gap-4 py-1 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:gap-6">
                    <h2 className="hidden text-2xl font-bold tracking-tight text-foreground sm:block sm:text-3xl">
                      {slide.title}
                    </h2>
                    <div className="flex flex-row flex-nowrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
                      <span className="flex h-10 items-center sm:h-12 [&_img]:h-full [&_img]:w-auto [&_img]:object-contain">
                        <Image
                          src={cercaLabsLogo}
                          alt="CercaLabs"
                          className="h-full w-auto object-contain mix-blend-multiply"
                        />
                      </span>
                      <img
                        src="/logos/neogenomics.svg"
                        alt="Neogenomics"
                        className="h-5 w-auto shrink-0 object-contain sm:h-8"
                      />
                      <img
                        src="/logos/sprouts.svg"
                        alt="Sprouts"
                        className="h-5 w-auto shrink-0 object-contain sm:h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:hidden">
                        {slide.title}
                      </h2>
                      <div className="mt-4">
                        <SlideContent />
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                      View more
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </>
              ) : slide.id === "projects" ? (
                <>
                  {/* Mobile: logos row on top. Desktop: title left, logos right (MGA first, then lets-eat) */}
                  <div className="flex w-full shrink-0 flex-row flex-nowrap items-center justify-center gap-4 py-1 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:gap-6">
                    <h2 className="hidden text-2xl font-bold tracking-tight text-foreground sm:block sm:text-3xl">
                      {slide.title}
                    </h2>
                    <div className="flex flex-row flex-nowrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
                      <img
                        src="/logos/MyGamblingAssistant.png"
                        alt="My Gambling Assistant"
                        className="h-10 w-auto shrink-0 object-contain sm:h-12"
                      />
                      <img
                        src="/logos/lets-eat.gif"
                        alt="Lets Eat"
                        className="h-10 w-auto shrink-0 object-contain sm:h-12"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:hidden">
                        {slide.title}
                      </h2>
                      <div className="mt-4">
                        <SlideContent />
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                      View more
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:gap-6">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary">
                      <Icon className="size-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {slide.title}
                      </h2>
                      <div className="mt-4">
                        <SlideContent />
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                    View more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              )}
            </Link>
          </motion.div>
        </AnimatePresence>
        </div>

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
