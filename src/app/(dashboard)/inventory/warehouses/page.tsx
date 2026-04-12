"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Warehouse as WarehouseIcon, Plus, Loader2, MapPin } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  capacity: number;
  usedCapacity: number;
  status: string;
}

export default function WarehousesPage() {
  const { currentEnterprise } = useEnterprise();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", city: "", country: "", capacity: "1000",
  });

  const fetchWarehouses = async () => {
    if (!currentEnterprise) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/enterprises?enterpriseId=${currentEnterprise.id}&resource=warehouses`);
      if (res.ok) setWarehouses(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchWarehouses(); }, [currentEnterprise]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!currentEnterprise) return;
    setSaving(true);
    try {
      const res = await fetch("/api/enterprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: "warehouse",
          ...form,
          capacity: parseInt(form.capacity),
          enterpriseId: currentEnterprise.id,
        }),
      });
      if (res.ok) {
        setShowDialog(false);
        setForm({ name: "", address: "", city: "", country: "", capacity: "1000" });
        fetchWarehouses();
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage storage locations and capacity</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Warehouse
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : warehouses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <WarehouseIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No warehouses</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add your first warehouse.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((wh) => {
            const usage = wh.capacity > 0 ? (wh.usedCapacity / wh.capacity) * 100 : 0;
            return (
              <Card key={wh.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WarehouseIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{wh.name}</h3>
                    </div>
                    <Badge variant={wh.status === "active" ? "default" : "secondary"}>{wh.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(wh.city || wh.country) && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {[wh.city, wh.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacity Usage</span>
                      <span className="font-medium">{Math.round(usage)}%</span>
                    </div>
                    <Progress value={usage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {wh.usedCapacity.toLocaleString()} / {wh.capacity.toLocaleString()} units
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Warehouse</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Capacity (units)</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
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
