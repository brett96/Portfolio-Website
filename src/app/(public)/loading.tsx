/**
 * Shown during navigation while the new page loads. Works with PageTransitionWrapper:
 * loader appears first, then content animates in.
 */
export default function PublicLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div
        className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
