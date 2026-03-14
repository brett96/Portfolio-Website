import Link from "next/link";
import { getEducation } from "@/lib/firebase/admin";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EducationList } from "@/components/public/EducationList";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export default async function EducationPage() {
  let education: Awaited<ReturnType<typeof getEducation>> = [];
  try {
    education = await getEducation();
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
        title="Education"
        description="Academic background"
      />
      {education.length > 0 ? (
        <EducationList items={education} />
      ) : (
        <p className="text-muted-foreground">No education entries yet.</p>
      )}
    </div>
  );
}
