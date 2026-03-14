import Link from "next/link";
import { getExperience } from "@/lib/firebase/admin";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ExperienceList } from "@/components/public/ExperienceList";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export default async function ExperiencePage() {
  let experience: Awaited<ReturnType<typeof getExperience>> = [];
  try {
    experience = await getExperience();
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
        title="Experience"
        description="Work history and roles."
      />
      {experience.length > 0 ? (
        <ExperienceList items={experience} />
      ) : (
        <p className="text-muted-foreground">No experience entries yet.</p>
      )}
    </div>
  );
}
