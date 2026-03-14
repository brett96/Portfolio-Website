"use client";

/**
 * Admin CRUD for Projects. List with Edit/Delete; Add/Edit dialog with image upload.
 */
import { useState, useEffect } from "react";
import {
  fetchProjectsClient,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/firebase/firestore";
import { uploadProjectImage } from "@/lib/firebase/storage";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { revalidatePortfolio } from "@/app/actions/revalidate";

const defaultProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  url: "",
  tags: [],
  order: 0,
  imageUrl: "",
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultProject);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchProjectsClient();
      setItems(list);
    } catch (e) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...defaultProject, order: items.length });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      url: p.url ?? "",
      tags: p.tags ?? [],
      order: p.order ?? 0,
      imageUrl: p.imageUrl ?? "",
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadProjectImage(
          imageFile,
          editingId ?? undefined
        );
      }
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() ?? "",
        url: form.url?.trim() || undefined,
        tags: form.tags?.length ? form.tags : undefined,
        order: form.order ?? 0,
        imageUrl: imageUrl || undefined,
      };
      if (editingId) {
        await updateProject(editingId, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }
      setDialogOpen(false);
      await revalidatePortfolio();
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : editingId ? "Failed to update" : "Failed to create";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      await revalidatePortfolio();
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const tagsStr = Array.isArray(form.tags) ? form.tags.join(", ") : "";
  const setTagsStr = (s: string) =>
    setForm((f) => ({
      ...f,
      tags: s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <PlusCircle className="size-4" />
          Add project
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No projects yet. Add one above.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="max-w-[200px] hidden md:table-cell">Description</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="size-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate hidden md:table-cell text-muted-foreground">
                    {p.description}
                  </TableCell>
                  <TableCell>{p.order ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(p)}
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(p.id)}
                        aria-label="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit project" : "Add project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="React, TypeScript"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))
                }
                className="mt-1 w-24"
              />
            </div>
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="mt-1"
              />
              {editingId && form.imageUrl && !imageFile && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Current image in use. Choose a new file to replace.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
