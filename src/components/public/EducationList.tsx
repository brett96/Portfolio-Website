import type { Education } from "@/types";

interface EducationListProps {
  items: Education[];
}

export function EducationList({ items }: EducationListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.id} className="border-l-2 border-primary/30 pl-5">
          <p className="font-semibold text-foreground">{item.institution}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {item.degree} in {item.field}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.startYear} – {item.endYear}
          </p>
          {item.honors && (
            <p className="mt-2 text-sm font-medium text-primary">{item.honors}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
