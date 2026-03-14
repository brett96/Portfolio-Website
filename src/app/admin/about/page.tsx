"use client";

/**
 * Admin: edit the About section (single document: title + content).
 */
import { useState, useEffect } from "react";
import { fetchAboutClient, setAbout } from "@/lib/firebase/firestore";
import type { About } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { revalidatePortfolio } from "@/app/actions/revalidate";

export default function AdminAboutPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAboutClient()
      .then((about) => {
        if (about) {
          setTitle(about.title ?? "");
          setContent(about.content ?? "");
        }
      })
      .catch(() => toast.error("Failed to load About"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await setAbout({ title: title.trim(), content: content.trim() });
      await revalidatePortfolio();
      toast.success("About section saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">About</h1>
      <p className="text-muted-foreground text-sm">
        This content appears in the About section on the home page.
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="about-title">Title</Label>
          <Input
            id="about-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="About"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="about-content">Content</Label>
          <textarea
            id="about-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write your about text here. Line breaks are preserved."
            className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
          Save About
        </Button>
      </form>
    </div>
  );
}
