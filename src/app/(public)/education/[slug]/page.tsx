import Link from "next/link";
import { notFound } from "next/navigation";
import { getEducationBySlug } from "@/lib/firebase/admin";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export default async function EducationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const education = await getEducationBySlug(slug);
  if (!education) notFound();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link
        href="/education"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to education
      </Link>
      <article className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {education.institution}
        </h1>
        <p className="text-xl text-muted-foreground">
          {education.degree} in {education.field}
        </p>
        <p className="text-sm text-muted-foreground">
          {education.startYear} – {education.endYear}
        </p>
        {education.honors && (
          <p className="text-primary font-medium">{education.honors}</p>
        )}
      </article>
    </div>
  );
}
