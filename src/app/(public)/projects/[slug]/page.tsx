import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/firebase/admin";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const revalidate = 3600;

export default async function ProjectSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>
      <article className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>
        {project.imageUrl && (
          <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-muted">
            <img
              src={project.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {project.description && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.url?.trim() && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            View project
            <ExternalLink className="size-4" />
          </a>
        )}
      </article>
    </div>
  );
}
