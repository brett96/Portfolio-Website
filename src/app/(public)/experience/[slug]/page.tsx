import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/firebase/admin";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function ExperienceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);
  if (!experience) notFound();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link
        href="/experience"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to experience
      </Link>
      <article className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {experience.company}
        </h1>
        <p className="text-xl text-muted-foreground">{experience.role}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(experience.startDate)}
          {experience.endDate
            ? ` – ${formatDate(experience.endDate)}`
            : " – Present"}
        </p>
        {experience.description && (
          <div className="prose prose-neutral dark:prose-invert max-w-none pt-2">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {experience.description}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
