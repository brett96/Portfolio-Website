/**
 * Public homepage: Hero, carousel (first entry per section), About (editable in admin),
 * then full Experience, Projects, and Education sections.
 */
import { Hero } from "@/components/public/Hero";
import { HomeCarousel } from "@/components/public/HomeCarousel";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ExperienceList } from "@/components/public/ExperienceList";
import { EducationList } from "@/components/public/EducationList";
import {
  getProjects,
  getExperience,
  getEducation,
  getAbout,
  getHero,
  getResume,
} from "@/lib/firebase/admin";

export const revalidate = 3600;

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let experience: Awaited<ReturnType<typeof getExperience>> = [];
  let education: Awaited<ReturnType<typeof getEducation>> = [];
  let about: Awaited<ReturnType<typeof getAbout>> = null;
  let hero: Awaited<ReturnType<typeof getHero>> = null;
  let resume: Awaited<ReturnType<typeof getResume>> = null;

  try {
    [projects, experience, education, about, hero, resume] = await Promise.all([
      getProjects(),
      getExperience(),
      getEducation(),
      getAbout(),
      getHero(),
      getResume(),
    ]);
  } catch {
    // Firestore unavailable
  }

  const firstProject = projects[0] ?? null;
  const firstExperience = experience[0] ?? null;
  const firstEducation = education[0] ?? null;

  return (
    <>
      <Hero hero={hero} resumeUrl={resume?.url} />
      <HomeCarousel
        firstExperience={firstExperience}
        firstProject={firstProject}
        firstEducation={firstEducation}
      />

      <div className="container mx-auto max-w-4xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-16 space-y-16">
        {/* About (editable in admin) */}
        {about && (about.title || about.content) && (
          <section id="about">
            <SectionHeading
              title={about.title || "About"}
              description={undefined}
            />
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {about.content}
              </div>
            </div>
          </section>
        )}

        {/* Experience - full list */}
        <section id="experience">
          <SectionHeading
            title="Experience"
            description="Work history and roles"
          />
          {experience.length > 0 ? (
            <ExperienceList items={experience} />
          ) : (
            <p className="text-muted-foreground">No experience entries yet.</p>
          )}
        </section>

        {/* Projects - full list */}
        <section id="projects">
          <SectionHeading
            title="Projects"
            description="Selected work and side projects"
          />
          {projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects yet. Check back soon.</p>
          )}
        </section>

        {/* Education - full list */}
        <section id="education">
          <SectionHeading
            title="Education"
            description="Academic background"
          />
          {education.length > 0 ? (
            <EducationList items={education} />
          ) : (
            <p className="text-muted-foreground">No education entries yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
