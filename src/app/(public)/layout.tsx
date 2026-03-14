/**
 * Public layout: header (Projects + Experience dropdowns, Contact Me), footer, Contact modal.
 */
import { getProjects, getExperience } from "@/lib/firebase/admin";
import { PublicLayoutClient } from "@/components/public/PublicLayoutClient";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let experience: Awaited<ReturnType<typeof getExperience>> = [];
  try {
    [projects, experience] = await Promise.all([
      getProjects(),
      getExperience(),
    ]);
  } catch {
    // Firestore unavailable
  }

  return (
    <PublicLayoutClient projects={projects} experience={experience}>
      {children}
    </PublicLayoutClient>
  );
}
