"use client";

/**
 * Admin CRUD for Experience. List with Edit/Delete; Add/Edit dialog.
 */
import { useState, useEffect } from "react";
import {
  fetchExperienceClient,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/firebase/firestore";
import type { Experience } from "@/types";
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

const defaultExperience: Omit<Experience, "id"> = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  order: 0,
};

function toInputDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return iso.slice(0, 10);
  } catch {
    return "";
  }
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultExperience);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchExperienceClient();
      setItems(list);
    } catch (e) {
      toast.error("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...defaultExperience, order: items.length });
    setDialogOpen(true);
  };

  const openEdit = (x: Experience) => {
    setEditingId(x.id);
    setForm({
      company: x.company,
      role: x.role,
      description: x.description ?? "",
      startDate: x.startDate ?? "",
      endDate: x.endDate ?? "",
      order: x.order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      toast.error("Company and role are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        company: form.company.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
        startDate: form.startDate || new Date().toISOString().slice(0, 10),
        endDate: form.endDate?.trim() || undefined,
        order: form.order ?? 0,
      };
      if (editingId) {
        await updateExperience(editingId, payload);
        toast.success("Experience updated");
      } else {
        await createExperience(payload);
        toast.success("Experience created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(editingId ? "Failed to update" : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience entry?")) return;
    try {
      await deleteExperience(id);
      toast.success("Experience deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <PlusCircle className="size-4" />
          Add experience
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No experience yet. Add one above.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell max-w-[200px]">Description</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="font-medium">{x.company}</TableCell>
                  <TableCell>{x.role}</TableCell>
                  <TableCell className="max-w-[200px] truncate hidden md:table-cell text-muted-foreground">
                    {x.description}
                  </TableCell>
                  <TableCell>{toInputDate(x.startDate)}</TableCell>
                  <TableCell>{toInputDate(x.endDate) || "—"}</TableCell>
                  <TableCell>{x.order ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(x)}
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(x.id)}
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
            <DialogTitle>{editingId ? "Edit experience" : "Add experience"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={toInputDate(form.startDate)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value || "" }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={toInputDate(form.endDate)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value || "" }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    order: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="mt-1 w-24"
              />
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
