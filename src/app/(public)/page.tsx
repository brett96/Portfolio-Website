/**
 * Public homepage: Hero + first entry of Projects, Experience, and Education
 * with details visible. Each section links to the full list.
 */
import Link from "next/link";
import { Hero } from "@/components/public/Hero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ExperienceList } from "@/components/public/ExperienceList";
import { EducationList } from "@/components/public/EducationList";
import { getProjects, getExperience, getEducation } from "@/lib/firebase/admin";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let experience: Awaited<ReturnType<typeof getExperience>> = [];
  let education: Awaited<ReturnType<typeof getEducation>> = [];

  try {
    [projects, experience, education] = await Promise.all([
      getProjects(),
      getExperience(),
      getEducation(),
    ]);
  } catch {
    // Firestore unavailable
  }

  const firstProject = projects[0];
  const firstExperience = experience.slice(0, 1);
  const firstEducation = education.slice(0, 1);

  return (
    <>
      <Hero />
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-16 space-y-16">
        {/* Projects */}
        <section id="projects">
          <SectionHeading
            title="Projects"
            description="Selected work and side projects."
          />
          {firstProject ? (
            <>
              <ProjectCard project={firstProject} />
              <Link
                href="/projects"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all projects
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No projects yet. Check back soon.</p>
          )}
        </section>

        {/* Experience */}
        <section id="experience">
          <SectionHeading
            title="Experience"
            description="Work history and roles."
          />
          {firstExperience.length > 0 ? (
            <>
              <ExperienceList items={firstExperience} />
              <Link
                href="/experience"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all experience
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No experience entries yet.</p>
          )}
        </section>

        {/* Education */}
        <section id="education">
          <SectionHeading
            title="Education"
            description="Academic background."
          />
          {firstEducation.length > 0 ? (
            <>
              <EducationList items={firstEducation} />
              <Link
                href="/education"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View all education
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No education entries yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
