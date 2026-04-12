"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, DollarSign, ShoppingCart, Package, Target } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface AnalyticsData {
  totalContacts: number;
  totalLeads: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalEmployees: number;
  pipelineBreakdown: Record<string, number>;
  pipelineValue: Record<string, number>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export default function AnalyticsPage() {
  const { currentEnterprise } = useEnterprise();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentEnterprise) return;
    setLoading(true);
    fetch(`/api/dashboard?enterpriseId=${currentEnterprise.id}`)
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentEnterprise]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const totalPipelineValue = Object.values(data.pipelineValue || {}).reduce((a, b) => a + b, 0);
  const wonValue = data.pipelineValue?.won || 0;
  const conversionRate = data.totalLeads > 0
    ? ((data.pipelineBreakdown?.won || 0) / data.totalLeads * 100).toFixed(1)
    : "0";

  const metrics = [
    { label: "Total Contacts", value: formatNumber(data.totalContacts), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Leads", value: formatNumber(data.totalLeads), icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Orders", value: formatNumber(data.totalOrders), icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Revenue", value: formatCurrency(data.totalRevenue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pipeline Value", value: formatCurrency(totalPipelineValue), icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Products", value: formatNumber(data.totalProducts), icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const stageBarColors: Record<string, string> = {
    new: "bg-blue-500",
    qualified: "bg-purple-500",
    proposal: "bg-yellow-500",
    negotiation: "bg-orange-500",
    won: "bg-green-500",
    lost: "bg-red-500",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence for {currentEnterprise?.name}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${m.bg}`}>
                <m.icon className={`h-6 w-6 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pipeline Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.pipelineBreakdown).map(([stage, count]) => {
              const maxCount = Math.max(...Object.values(data.pipelineBreakdown), 1);
              const width = (count / maxCount) * 100;
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{stage}</span>
                    <span className="text-muted-foreground">{count} deals</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${stageBarColors[stage] || "bg-gray-500"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(data.pipelineBreakdown).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No pipeline data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Key Performance Indicators</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">{conversionRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${Math.min(parseFloat(conversionRate), 100)}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Won Revenue</span>
                <span className="text-sm font-bold">{formatCurrency(wonValue)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Avg. Deal Size</span>
                <span className="text-sm font-bold">
                  {formatCurrency(data.totalLeads > 0 ? totalPipelineValue / data.totalLeads : 0)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Employees</span>
                <span className="text-sm font-bold">{data.totalEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
