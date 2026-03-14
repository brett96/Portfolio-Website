/**
 * Root loading: used when navigating to admin or other root-level routes.
 * Matches the same style as public loading for consistency.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div
        className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
