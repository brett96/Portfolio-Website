/**
 * Hero section: name, title, short intro. Clean and prominent.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/60 to-background px-6 py-20 sm:py-28">
      <div className="container mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Portfolio
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Brett Tomita
        </h1>
        <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
          Software Engineer
        </p>
        <p className="mt-6 max-w-xl mx-auto text-base text-muted-foreground/90 leading-relaxed">
          Building clean, maintainable software. Focused on web applications, tooling, and user experience.
        </p>
      </div>
    </section>
  );
}
