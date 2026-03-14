"use client";

/**
 * Public site header with Projects dropdown. Each project can show a description
 * popup (hover/tap) with a View button, or link directly if no description.
 */
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface PublicHeaderProps {
  projects: Project[];
}

export function PublicHeader({ projects }: PublicHeaderProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectsOpen(false);
        setPopupProjectId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-semibold text-foreground no-underline hover:text-foreground/90 transition-colors"
        >
          Brett Tomita
        </Link>
        <nav className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProjectsOpen((o) => !o)}
              onMouseEnter={() => setProjectsOpen(true)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={projectsOpen}
              aria-haspopup="true"
            >
              Projects
              <ChevronDown
                className={cn("size-4 transition-transform", projectsOpen && "rotate-180")}
              />
            </button>
            {projectsOpen && (
              <div
                className="absolute top-full left-0 mt-1 min-w-[220px] rounded-lg border border-border bg-popover py-1 shadow-lg z-50"
                onMouseLeave={() => setPopupProjectId(null)}
              >
                {projects.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No projects yet
                  </div>
                ) : (
                  projects.map((project) => {
                    const hasDescription = Boolean(
                      project.description?.trim()
                    );
                    const hasUrl = Boolean(project.url?.trim());
                    const showPopup = popupProjectId === project.id;

                    if (!hasDescription) {
                      return hasUrl ? (
                        <a
                          key={project.id}
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setProjectsOpen(false)}
                        >
                          {project.title}
                          <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span
                          key={project.id}
                          className="block px-3 py-2 text-sm text-muted-foreground"
                        >
                          {project.title}
                        </span>
                      );
                    }

                    return (
                      <div
                        key={project.id}
                        className="relative"
                        onMouseEnter={() => setPopupProjectId(project.id)}
                        onMouseLeave={() => setPopupProjectId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (showPopup) {
                              if (hasUrl) {
                                window.open(project.url!, "_blank");
                                setProjectsOpen(false);
                                setPopupProjectId(null);
                              } else {
                                setPopupProjectId(null);
                              }
                            } else {
                              setPopupProjectId(project.id);
                            }
                          }}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {project.title}
                          <ChevronRight
                            className={cn(
                              "size-3.5 shrink-0 transition-transform",
                              showPopup && "rotate-90"
                            )}
                          />
                        </button>
                        {showPopup && (
                          <div className="absolute left-0 top-full mt-1 w-[min(18rem,100%)] rounded-lg border border-border bg-popover p-4 shadow-lg z-50 md:left-full md:top-0 md:ml-1 md:mt-0 md:w-72">
                            <p className="text-sm text-popover-foreground leading-relaxed line-clamp-4">
                              {project.description}
                            </p>
                            {hasUrl ? (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                onClick={() => {
                                  setProjectsOpen(false);
                                  setPopupProjectId(null);
                                }}
                              >
                                View
                                <ExternalLink className="size-3.5" />
                              </a>
                            ) : (
                              <span className="mt-3 block text-center text-xs text-muted-foreground">
                                No link
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
          <Link
            href="/experience"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Experience
          </Link>
          <Link
            href="/education"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Education
          </Link>
        </nav>
      </div>
    </header>
  );
}
