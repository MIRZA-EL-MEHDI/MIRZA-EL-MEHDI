"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  ShoppingCart,
  DollarSign,
  Package,
  UserCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface DashboardData {
  totalContacts: number;
  totalLeads: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalEmployees: number;
  recentLeads: Array<{
    id: string;
    title: string;
    value: number;
    stage: string;
    contact: { firstName: string; lastName: string } | null;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    contact: { firstName: string; lastName: string } | null;
  }>;
  pipelineBreakdown: Record<string, number>;
}

export default function DashboardPage() {
  const { currentEnterprise } = useEnterprise();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentEnterprise) return;
    setLoading(true);
    fetch(`/api/dashboard?enterpriseId=${currentEnterprise.id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentEnterprise]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your enterprise overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2"><div className="h-4 bg-muted rounded w-24" /></CardHeader>
              <CardContent><div className="h-8 bg-muted rounded w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Total Contacts", value: formatNumber(data.totalContacts), icon: Users, change: "+12%", up: true, color: "text-blue-600" },
    { title: "Active Leads", value: formatNumber(data.totalLeads), icon: Target, change: "+8%", up: true, color: "text-purple-600" },
    { title: "Orders", value: formatNumber(data.totalOrders), icon: ShoppingCart, change: "+5%", up: true, color: "text-green-600" },
    { title: "Revenue", value: formatCurrency(data.totalRevenue), icon: DollarSign, change: "+15%", up: true, color: "text-emerald-600" },
    { title: "Products", value: formatNumber(data.totalProducts), icon: Package, change: "+3%", up: true, color: "text-orange-600" },
    { title: "Employees", value: formatNumber(data.totalEmployees), icon: UserCircle, change: "+2%", up: true, color: "text-indigo-600" },
  ];

  const stageColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    qualified: "bg-purple-100 text-purple-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your {currentEnterprise?.name} overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className={`flex items-center text-xs font-medium ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.pipelineBreakdown).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={stageColors[stage] || "bg-gray-100 text-gray-800"}>
                      {stage}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{count} deals</span>
                </div>
              ))}
              {Object.keys(data.pipelineBreakdown).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No leads yet. Create your first lead to see the pipeline.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{lead.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.contact ? `${lead.contact.firstName} ${lead.contact.lastName}` : "No contact"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(lead.value)}</p>
                    <Badge variant="secondary" className={`text-[10px] ${stageColors[lead.stage] || ""}`}>
                      {lead.stage}
                    </Badge>
                  </div>
                </div>
              ))}
              {data.recentLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent leads.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.contact ? `${order.contact.firstName} ${order.contact.lastName}` : "Walk-in"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
                  <Badge variant="secondary" className="text-[10px]">{order.status}</Badge>
                </div>
              </div>
            ))}
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent orders.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
