/**
 * Public homepage: Hero + rotating carousel (Experience, Projects, Education).
 * Experience is shown first; each slide links to its detail page.
 */
import { Hero } from "@/components/public/Hero";
import { HomeCarousel } from "@/components/public/HomeCarousel";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeCarousel />
    </>
  );
}
