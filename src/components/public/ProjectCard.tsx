import type { Project } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/80 bg-card transition-shadow hover:shadow-md">
      {project.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
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
      {project.url && (
        <CardContent className="pt-0">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            View project
            <ExternalLink className="size-3.5" />
          </a>
        </CardContent>
      )}
    </Card>
  );
}
