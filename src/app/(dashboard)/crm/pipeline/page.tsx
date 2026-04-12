"use client";

import { useEffect, useState } from "react";
import { useEnterprise } from "@/components/providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Loader2 } from "lucide-react";
import { formatCurrency, stageColors } from "@/lib/utils";

interface Lead {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contact: { firstName: string; lastName: string } | null;
}

const stages = [
  { key: "new", label: "New", color: "border-t-blue-500" },
  { key: "qualified", label: "Qualified", color: "border-t-purple-500" },
  { key: "proposal", label: "Proposal", color: "border-t-yellow-500" },
  { key: "negotiation", label: "Negotiation", color: "border-t-orange-500" },
  { key: "won", label: "Won", color: "border-t-green-500" },
  { key: "lost", label: "Lost", color: "border-t-red-500" },
];

export default function PipelinePage() {
  const { currentEnterprise } = useEnterprise();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentEnterprise) return;
    setLoading(true);
    fetch(`/api/leads?enterpriseId=${currentEnterprise.id}`)
      .then((res) => res.json())
      .then((data) => { setLeads(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentEnterprise]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Loading pipeline...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <p className="text-muted-foreground">Visual overview of your deals by stage</p>
      </div>

      <div className="grid grid-cols-6 gap-4 min-h-[500px]">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.key);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.value, 0);
          return (
            <div key={stage.key} className="flex flex-col">
              <Card className={`border-t-4 ${stage.color} mb-3`}>
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {stage.label}
                    <Badge variant="secondary" className="text-[10px]">{stageLeads.length}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-semibold">{formatCurrency(stageTotal)}</p>
                </CardHeader>
              </Card>
              <div className="flex-1 space-y-2">
                {stageLeads.map((lead) => (
                  <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium leading-tight">{lead.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.contact ? `${lead.contact.firstName} ${lead.contact.lastName}` : "No contact"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-primary">{formatCurrency(lead.value)}</span>
                        <span className="text-[10px] text-muted-foreground">{lead.probability}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {stageLeads.length === 0 && (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                    <p className="text-xs text-muted-foreground">No deals</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
