/**
 * Public homepage: Hero + carousel (Projects / Experience / Education). Each carousel
 * section is clickable and navigates to its detail page with the site-wide transition.
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
