import Link from "next/link";
import type { Project } from "@/types";
import { slugify } from "@/lib/slug";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const slug = slugify(project.title);
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/80 bg-card transition-shadow hover:shadow-md">
      {project.imageUrl && (
        <Link href={`/projects/${slug}`} className="relative block aspect-video w-full overflow-hidden bg-muted">
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      )}
      <CardHeader className="flex-1">
        <CardTitle className="text-lg leading-tight">
          <Link href={`/projects/${slug}`} className="hover:underline">
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2 line-clamp-3 text-sm leading-relaxed">
          {project.description}
        </CardDescription>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Link
          href={`/projects/${slug}`}
          className="flex h-7 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          View
          <ChevronRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
