"use client";

/**
 * Admin: upload or remove the public resume. File is stored in Firebase Storage,
 * download URL in Firestore.
 */
import { useState, useEffect } from "react";
import { fetchResumeClient, setResume } from "@/lib/firebase/firestore";
import { uploadResume } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileDown, Trash2 } from "lucide-react";
import { revalidatePortfolio } from "@/app/actions/revalidate";

export default function AdminResumePage() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchResumeClient()
      .then((r) => setCurrentUrl(r?.url?.trim() || null))
      .catch(() => toast.error("Failed to load resume"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("resume-file") as HTMLInputElement)?.files?.[0];
    if (!file) {
      toast.error("Choose a file");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadResume(file);
      await setResume({ url });
      await revalidatePortfolio();
      setCurrentUrl(url);
      toast.success("Resume uploaded");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    if (!currentUrl) return;
    if (!confirm("Remove the resume? Visitors will no longer see the Download button.")) return;
    setClearing(true);
    try {
      await setResume({ url: "" });
      await revalidatePortfolio();
      setCurrentUrl(null);
      toast.success("Resume removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resume</h1>
      <p className="text-muted-foreground text-sm">
        Upload a resume (PDF or other file) for visitors to download from the home page hero. If set, a &quot;Download Resume&quot; button appears below the short description.
      </p>

      {currentUrl && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">Current resume</p>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-primary underline"
          >
            {currentUrl.slice(0, 60)}…
          </a>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-2"
            onClick={handleClear}
            disabled={clearing}
          >
            {clearing && <Loader2 className="size-4 animate-spin" />}
            <Trash2 className="size-4" />
            Remove resume
          </Button>
        </div>
      )}

      <form onSubmit={handleUpload} className="max-w-md space-y-4">
        <div>
          <Label htmlFor="resume-file">Upload new resume</Label>
          <Input
            id="resume-file"
            name="resume-file"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading && <Loader2 className="size-4 animate-spin mr-2" />}
          <FileDown className="size-4 mr-2" />
          Upload resume
        </Button>
      </form>
    </div>
  );
}
