/**
 * Parse tags from admin input: comma, semicolon, or newline separated.
 */
export function parseTagsFromInput(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** One-line preview for admin tables (strip common markdown noise). */
export function plainTextPreview(markdown: string, maxLen = 120): string {
  const s = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return s.length <= maxLen ? s : `${s.slice(0, maxLen)}…`;
}
