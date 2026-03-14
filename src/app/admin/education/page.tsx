"use client";

/**
 * Admin CRUD for Education. List with Edit/Delete; Add/Edit dialog.
 */
import { useState, useEffect } from "react";
import {
  fetchEducationClient,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/firebase/firestore";
import type { Education } from "@/types";
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

const defaultEducation: Omit<Education, "id"> = {
  institution: "",
  degree: "",
  field: "",
  honors: "",
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  order: 0,
};

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultEducation);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchEducationClient();
      setItems(list);
    } catch (e) {
      toast.error("Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...defaultEducation,
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      order: items.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (x: Education) => {
    setEditingId(x.id);
    setForm({
      institution: x.institution,
      degree: x.degree,
      field: x.field,
      honors: x.honors ?? "",
      startYear: x.startYear,
      endYear: x.endYear,
      order: x.order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim() || !form.field.trim()) {
      toast.error("Institution, degree, and field are required");
      return;
    }
    const start = form.startYear ?? new Date().getFullYear();
    const end = form.endYear ?? new Date().getFullYear();
    if (end < start) {
      toast.error("End year must be >= start year");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        institution: form.institution.trim(),
        degree: form.degree.trim(),
        field: form.field.trim(),
        honors: form.honors?.trim() || undefined,
        startYear: start,
        endYear: end,
        order: form.order ?? 0,
      };
      if (editingId) {
        await updateEducation(editingId, payload);
        toast.success("Education updated");
      } else {
        await createEducation(payload);
        toast.success("Education created");
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
    if (!confirm("Delete this education entry?")) return;
    try {
      await deleteEducation(id);
      toast.success("Education deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <PlusCircle className="size-4" />
          Add education
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No education yet. Add one above.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Field</TableHead>
                <TableHead className="hidden sm:table-cell">Honors</TableHead>
                <TableHead>Years</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="font-medium">{x.institution}</TableCell>
                  <TableCell>{x.degree}</TableCell>
                  <TableCell>{x.field}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {x.honors || "—"}
                  </TableCell>
                  <TableCell>
                    {x.startYear}–{x.endYear}
                  </TableCell>
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
            <DialogTitle>{editingId ? "Edit education" : "Add education"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={form.institution}
                onChange={(e) =>
                  setForm((f) => ({ ...f, institution: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={form.degree}
                onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
                placeholder="e.g. B.S."
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="field">Field *</Label>
              <Input
                id="field"
                value={form.field}
                onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
                placeholder="e.g. Computer Science"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="honors">Honors</Label>
              <Input
                id="honors"
                value={form.honors}
                onChange={(e) => setForm((f) => ({ ...f, honors: e.target.value }))}
                placeholder="e.g. President's Honors List"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startYear">Start year</Label>
                <Input
                  id="startYear"
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.startYear ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      startYear: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endYear">End year</Label>
                <Input
                  id="endYear"
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.endYear ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      endYear: parseInt(e.target.value, 10) || 0,
                    }))
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
