"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, Loader2, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Department {
  id: string;
  name: string;
  description: string | null;
  headCount: number;
  budget: number;
  _count: { employees: number };
}

export default function DepartmentsPage() {
  const { currentEnterprise } = useEnterprise();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", budget: "0",
  });

  const fetchDepartments = async () => {
    if (!currentEnterprise) return;
    setLoading(true);
    const res = await fetch(`/api/departments?enterpriseId=${currentEnterprise.id}`);
    if (res.ok) setDepartments(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchDepartments(); }, [currentEnterprise]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!currentEnterprise) return;
    setSaving(true);
    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, budget: parseFloat(form.budget),
        enterpriseId: currentEnterprise.id,
      }),
    });
    if (res.ok) {
      setShowDialog(false);
      setForm({ name: "", description: "", budget: "0" });
      fetchDepartments();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Organize your company structure</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : departments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No departments</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first department.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{dept.name}</h3>
                </div>
                {dept.description && (
                  <p className="text-sm text-muted-foreground">{dept.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{dept._count.employees} employees</span>
                  </div>
                  <Badge variant="secondary">{formatCurrency(dept.budget)}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Department</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Budget ($)</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
