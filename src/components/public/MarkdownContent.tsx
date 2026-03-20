"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  /** Markdown source (GitHub Flavored Markdown: lists, tables, strikethrough, etc.) */
  content: string;
  className?: string;
  /** Tighter typography for cards / carousel */
  compact?: boolean;
}

/**
 * Renders sanitized Markdown with prose styling. Safe for user-authored content from admin.
 */
export function MarkdownContent({ content, className, compact }: MarkdownContentProps) {
  const trimmed = content?.trim();
  if (!trimmed) return null;

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        compact && "prose-sm prose-p:leading-relaxed prose-li:my-0.5",
        "prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-ul:my-2 prose-ol:my-2",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
