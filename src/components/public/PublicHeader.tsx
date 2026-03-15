"use client";

/**
 * Public site header with Projects and Experience dropdowns, and Contact Me.
 */
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Project, Experience } from "@/types";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface PublicHeaderProps {
  projects: Project[];
  experience: Experience[];
  onOpenContact?: () => void;
}

export function PublicHeader({ projects, experience, onOpenContact }: PublicHeaderProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const [popoverRect, setPopoverRect] = useState<{ top: number; left: number } | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<HTMLDivElement | null>(null);
  const justOpenedProjectsRef = useRef(false);
  const justOpenedExperienceRef = useRef(false);
  const popoverPortalRef = useRef<HTMLDivElement | null>(null);
  const leaveRowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (projectsRef.current?.contains(target) || experienceRef.current?.contains(target)) return;
      if (popoverPortalRef.current?.contains(target)) return;
      if (leaveRowTimeoutRef.current) {
        clearTimeout(leaveRowTimeoutRef.current);
        leaveRowTimeoutRef.current = null;
      }
      setProjectsOpen(false);
      setExperienceOpen(false);
      setPopupProjectId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (leaveRowTimeoutRef.current) clearTimeout(leaveRowTimeoutRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!popupProjectId || !activeRowRef.current) {
      setPopoverRect(null);
      return;
    }
    const rect = activeRowRef.current.getBoundingClientRect();
    setPopoverRect({ top: rect.top, left: rect.right + 8 });
  }, [popupProjectId]);

  return (
    <header className="sticky top-0 z-10 overflow-visible border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-semibold text-foreground no-underline hover:text-foreground/90 transition-colors"
        >
          Brett Tomita
        </Link>
        <nav className="flex items-center gap-6">
          <div className="relative" ref={projectsRef}>
            <button
              type="button"
              onPointerDown={(e) => {
                if (e.pointerType === "touch" && !projectsOpen) {
                  setExperienceOpen(false);
                  setProjectsOpen(true);
                  justOpenedProjectsRef.current = true;
                }
              }}
              onClick={() => {
                if (justOpenedProjectsRef.current) {
                  justOpenedProjectsRef.current = false;
                  return;
                }
                setExperienceOpen(false);
                setProjectsOpen((o) => !o);
              }}
              onMouseEnter={() => {
                setExperienceOpen(false);
                setProjectsOpen(true);
              }}
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
                className="fixed top-14 left-4 right-4 z-[100] max-h-[calc(100svh-5.5rem)] overflow-y-auto rounded-xl border border-border bg-popover py-3 shadow-xl md:absolute md:top-full md:left-0 md:right-auto md:mt-1 md:max-h-[min(85vh,28rem)] md:min-w-[220px] md:w-auto md:max-w-none md:rounded-lg md:py-1 md:shadow-lg"
              >
                {projects.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground md:px-3 md:py-2">
                    No projects yet
                  </div>
                ) : (
                  projects.map((project) => {
                    const hasDescription = Boolean(
                      project.description?.trim()
                    );
                    const hasUrl = Boolean(project.url?.trim());
                    const showPopup = popupProjectId === project.id;
                    const itemClass = "flex items-center justify-between gap-2 px-4 py-3 text-base text-popover-foreground hover:bg-accent hover:text-accent-foreground md:px-3 md:py-2 md:text-sm";
                    const mutedClass = "block px-4 py-3 text-base text-muted-foreground md:px-3 md:py-2 md:text-sm";

                    const projectSlug = slugify(project.title);
                    if (!hasDescription) {
                      return (
                        <Link
                          key={project.id}
                          href={`/projects/${projectSlug}`}
                          className={itemClass}
                          onClick={() => setProjectsOpen(false)}
                        >
                          {project.title}
                          {hasUrl && <ExternalLink className="size-4 shrink-0 opacity-70 md:size-3.5" />}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={project.id}
                        ref={showPopup ? (el) => { activeRowRef.current = el; } : undefined}
                        className="relative border-b border-border/40 last:border-b-0 md:border-b-0"
                        onMouseEnter={() => {
                          if (leaveRowTimeoutRef.current) {
                            clearTimeout(leaveRowTimeoutRef.current);
                            leaveRowTimeoutRef.current = null;
                          }
                          setPopupProjectId(project.id);
                        }}
                        onMouseLeave={() => {
                          leaveRowTimeoutRef.current = setTimeout(() => setPopupProjectId(null), 120);
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPopupProjectId((id) =>
                              id === project.id ? null : project.id
                            )
                          }
                          className={cn(
                            "flex w-full items-center justify-between gap-2 text-left",
                            itemClass
                          )}
                        >
                          {project.title}
                          <ChevronRight
                            className={cn(
                              "size-4 shrink-0 transition-transform md:size-3.5",
                              showPopup
                                ? "md:rotate-180 -rotate-90"
                                : "md:rotate-0 rotate-90"
                            )}
                          />
                        </button>
                        {/* Mobile: inline expanded block so list stays scrollable */}
                        {showPopup && (
                          <div className="border-t border-border/60 bg-muted/30 px-4 py-3 md:hidden">
                            <p className="text-sm text-popover-foreground leading-relaxed line-clamp-4">
                              {project.description}
                            </p>
                            <Link
                              href={`/projects/${projectSlug}`}
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                              onClick={() => {
                                setProjectsOpen(false);
                                setPopupProjectId(null);
                              }}
                            >
                              View
                              <ChevronRight className="size-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            {/* Desktop: project description popover in portal so it isn't clipped by dropdown overflow */}
            {typeof document !== "undefined" &&
              projectsOpen &&
              popupProjectId &&
              popoverRect &&
              (() => {
                const project = projects.find((p) => p.id === popupProjectId);
                if (!project?.description?.trim()) return null;
                const desktopProjectSlug = slugify(project.title);
                return createPortal(
                  <div
                    ref={popoverPortalRef}
                    className="hidden md:block fixed z-[100] w-72 rounded-lg border border-border bg-popover p-4 shadow-lg"
                    style={{ top: popoverRect.top, left: popoverRect.left }}
                    onMouseEnter={() => {
                      if (leaveRowTimeoutRef.current) {
                        clearTimeout(leaveRowTimeoutRef.current);
                        leaveRowTimeoutRef.current = null;
                      }
                      setPopupProjectId(project.id);
                    }}
                    onMouseLeave={() => setPopupProjectId(null)}
                  >
                    <p className="text-sm text-popover-foreground leading-relaxed line-clamp-4">
                      {project.description}
                    </p>
                    <Link
                      href={`/projects/${desktopProjectSlug}`}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setProjectsOpen(false);
                        setPopupProjectId(null);
                      }}
                    >
                      View
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>,
                  document.body
                );
              })()}
          </div>
          <div className="relative" ref={experienceRef}>
<button
            type="button"
            onPointerDown={(e) => {
              if (e.pointerType === "touch" && !experienceOpen) {
                setProjectsOpen(false);
                setPopupProjectId(null);
                setExperienceOpen(true);
                justOpenedExperienceRef.current = true;
              }
            }}
            onClick={() => {
              if (justOpenedExperienceRef.current) {
                justOpenedExperienceRef.current = false;
                return;
              }
              setProjectsOpen(false);
              setPopupProjectId(null);
              setExperienceOpen((o) => !o);
            }}
            onMouseEnter={() => {
              setProjectsOpen(false);
              setPopupProjectId(null);
              setExperienceOpen(true);
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={experienceOpen}
            aria-haspopup="true"
          >
            Experience
              <ChevronDown
                className={cn("size-4 transition-transform", experienceOpen && "rotate-180")}
              />
            </button>
            {experienceOpen && (
              <div
                className="absolute top-full left-0 mt-1 min-w-[220px] overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-lg z-50 max-h-[min(70vh,24rem)] md:max-h-none"
                onMouseLeave={() => setExperienceOpen(false)}
              >
                {experience.length === 0 ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No experience yet
                    </div>
                    <div className="my-1 border-t border-border/60" />
                    <Link
                      href="/education"
                      className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setExperienceOpen(false)}
                    >
                      Education
                    </Link>
                  </>
                ) : (
                  <>
                    {experience.map((exp) => (
                      <Link
                        key={exp.id}
                        href={`/experience/${slugify(exp.company)}`}
                        className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setExperienceOpen(false)}
                      >
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-muted-foreground"> — {exp.role}</span>
                      </Link>
                    ))}
                    <div className="my-1 border-t border-border/60" />
                    <Link
                      href="/education"
                      className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setExperienceOpen(false)}
                    >
                      Education
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenContact?.()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Me
          </button>
        </nav>
      </div>
    </header>
  );
}
