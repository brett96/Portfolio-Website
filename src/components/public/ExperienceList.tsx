import Link from "next/link";
import type { Experience } from "@/types";
import { slugify } from "@/lib/slug";
import { MarkdownContent } from "@/components/public/MarkdownContent";

interface ExperienceListProps {
  items: Experience[];
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function ExperienceList({ items }: ExperienceListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-8">
      {items.map((item) => (
        <li key={item.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-primary">
          <Link
            href={`/experience/${slugify(item.company)}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold text-foreground">{item.company}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm font-medium text-muted-foreground">{item.role}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(item.startDate)}
              {item.endDate ? ` – ${formatDate(item.endDate)}` : " – Present"}
            </p>
            <div className="mt-3 text-sm text-foreground/90">
              <MarkdownContent content={item.description} compact />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
