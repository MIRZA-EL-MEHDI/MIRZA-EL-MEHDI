"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Building, Plus, Loader2, Users, Check } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function EnterprisesPage() {
  const { enterprises, currentEnterprise, setCurrentEnterprise, refreshEnterprises } = useEnterprise();
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", address: "",
  });

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/enterprises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowDialog(false);
      setForm({ name: "", email: "", phone: "", website: "", address: "" });
      refreshEnterprises();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprises</h1>
          <p className="text-muted-foreground">Manage your companies and organizations</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Enterprise
        </Button>
      </div>

      {enterprises.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No enterprises</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first enterprise to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enterprises.map((ent) => (
            <Card
              key={ent.id}
              className={`hover:shadow-md transition-all cursor-pointer ${
                ent.id === currentEnterprise?.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setCurrentEnterprise(ent)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                      {getInitials(ent.name)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{ent.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 capitalize text-[10px]">{ent.role}</Badge>
                    </div>
                  </div>
                  {ent.id === currentEnterprise?.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Click to switch to this enterprise
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Enterprise</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Company Inc." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Enterprise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
