"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Search, Loader2 } from "lucide-react";
import { formatCurrency, statusColors } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  orderDate: string;
  contact: { firstName: string; lastName: string } | null;
  _count: { items: number };
}

export default function OrdersPage() {
  const { currentEnterprise } = useEnterprise();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: "draft", subtotal: "0", tax: "0", notes: "",
  });

  const fetchOrders = async () => {
    if (!currentEnterprise) return;
    setLoading(true);
    const res = await fetch(`/api/orders?enterpriseId=${currentEnterprise.id}`);
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [currentEnterprise]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!currentEnterprise) return;
    setSaving(true);
    const subtotal = parseFloat(form.subtotal);
    const tax = parseFloat(form.tax);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: form.status,
        subtotal,
        tax,
        total: subtotal + tax,
        notes: form.notes,
        enterpriseId: currentEnterprise.id,
      }),
    });
    if (res.ok) {
      setShowDialog(false);
      setForm({ status: "draft", subtotal: "0", tax: "0", notes: "" });
      fetchOrders();
    }
    setSaving(false);
  };

  const filtered = orders.filter((o) =>
    `${o.orderNumber} ${o.contact?.firstName || ""} ${o.contact?.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your sales orders</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first order to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm">{order.contact ? `${order.contact.firstName} ${order.contact.lastName}` : "Walk-in"}</TableCell>
                    <TableCell><Badge variant="secondary">{order._count.items}</Badge></TableCell>
                    <TableCell>{formatCurrency(order.subtotal)}</TableCell>
                    <TableCell>{formatCurrency(order.tax)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell><Badge className={statusColors[order.status] || ""}>{order.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtotal ($)</Label>
                <Input type="number" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tax ($)</Label>
                <Input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
