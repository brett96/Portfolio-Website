"use client";

/**
 * Admin: edit the main site hero/header (name, tagline, description).
 */
import { useState, useEffect } from "react";
import { fetchHeroClient, setHero } from "@/lib/firebase/firestore";
import type { HeroContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { revalidatePortfolio } from "@/app/actions/revalidate";

const DEFAULTS: HeroContent = {
  name: "Brett Tomita",
  tagline: "Senior Software Engineer",
  description: "Over 10 years of experience building clean, maintainable software",
};

export default function AdminHeroPage() {
  const [name, setName] = useState(DEFAULTS.name);
  const [tagline, setTagline] = useState(DEFAULTS.tagline);
  const [description, setDescription] = useState(DEFAULTS.description);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHeroClient()
      .then((hero) => {
        if (hero) {
          setName(hero.name ?? DEFAULTS.name);
          setTagline(hero.tagline ?? DEFAULTS.tagline);
          setDescription(hero.description ?? DEFAULTS.description);
        }
      })
      .catch(() => toast.error("Failed to load hero"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await setHero({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
      });
      await revalidatePortfolio();
      toast.success("Hero updated");
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
      <h1 className="text-2xl font-bold">Site header / Hero</h1>
      <p className="text-muted-foreground text-sm">
        Edit the main name, tagline, and description shown at the top of the public site.
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="hero-name">Name</Label>
          <Input
            id="hero-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={DEFAULTS.name}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hero-tagline">Tagline (subtitle)</Label>
          <Input
            id="hero-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder={DEFAULTS.tagline}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hero-description">Short description</Label>
          <textarea
            id="hero-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={DEFAULTS.description}
            className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
          Save hero
        </Button>
      </form>
    </div>
  );
}
