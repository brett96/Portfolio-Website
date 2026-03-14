import Link from "next/link";
import { getProjects } from "@/lib/firebase/admin";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects();
  } catch {
    // Firestore unavailable
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
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
    </div>
  );
}
