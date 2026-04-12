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
import { FileText, Plus, Search, Loader2 } from "lucide-react";
import { formatCurrency, formatDate, statusColors } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string | null;
  contact: { firstName: string; lastName: string } | null;
}

export default function InvoicesPage() {
  const { currentEnterprise } = useEnterprise();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: "draft", subtotal: "0", tax: "0", notes: "", dueDate: "",
  });

  const fetchInvoices = async () => {
    if (!currentEnterprise) return;
    setLoading(true);
    const res = await fetch(`/api/invoices?enterpriseId=${currentEnterprise.id}`);
    if (res.ok) setInvoices(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, [currentEnterprise]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!currentEnterprise) return;
    setSaving(true);
    const subtotal = parseFloat(form.subtotal);
    const tax = parseFloat(form.tax);
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: form.status, subtotal, tax, total: subtotal + tax,
        notes: form.notes, dueDate: form.dueDate || null,
        enterpriseId: currentEnterprise.id,
      }),
    });
    if (res.ok) {
      setShowDialog(false);
      setForm({ status: "draft", subtotal: "0", tax: "0", notes: "", dueDate: "" });
      fetchInvoices();
    }
    setSaving(false);
  };

  const filtered = invoices.filter((i) =>
    `${i.invoiceNumber} ${i.contact?.firstName || ""} ${i.contact?.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Create and manage invoices</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first invoice.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">{inv.contact ? `${inv.contact.firstName} ${inv.contact.lastName}` : "-"}</TableCell>
                    <TableCell>{formatCurrency(inv.subtotal)}</TableCell>
                    <TableCell>{formatCurrency(inv.tax)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(inv.total)}</TableCell>
                    <TableCell><Badge className={statusColors[inv.status] || ""}>{inv.status}</Badge></TableCell>
                    <TableCell className="text-sm">{formatDate(inv.issueDate)}</TableCell>
                    <TableCell className="text-sm">{inv.dueDate ? formatDate(inv.dueDate) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Subtotal ($)</Label><Input type="number" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: e.target.value })} /></div>
              <div className="space-y-2"><Label>Tax ($)</Label><Input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
