import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) {
    return NextResponse.json({ error: "enterpriseId required" }, { status: 400 });
  }

  const [
    totalContacts,
    totalLeads,
    totalOrders,
    totalProducts,
    totalEmployees,
    recentLeads,
    recentOrders,
    leads,
  ] = await Promise.all([
    prisma.contact.count({ where: { enterpriseId } }),
    prisma.lead.count({ where: { enterpriseId } }),
    prisma.order.count({ where: { enterpriseId } }),
    prisma.product.count({ where: { enterpriseId } }),
    prisma.employee.count({ where: { enterpriseId } }),
    prisma.lead.findMany({
      where: { enterpriseId },
      include: { contact: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      where: { enterpriseId },
      include: { contact: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.lead.findMany({
      where: { enterpriseId },
      select: { stage: true, value: true },
    }),
  ]);

  const totalRevenue = await prisma.invoice.aggregate({
    where: { enterpriseId, status: "paid" },
    _sum: { total: true },
  });

  // Pipeline breakdown
  const pipelineBreakdown: Record<string, number> = {};
  const pipelineValue: Record<string, number> = {};
  for (const lead of leads) {
    pipelineBreakdown[lead.stage] = (pipelineBreakdown[lead.stage] || 0) + 1;
    pipelineValue[lead.stage] = (pipelineValue[lead.stage] || 0) + lead.value;
  }

  return NextResponse.json({
    totalContacts,
    totalLeads,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts,
    totalEmployees,
    recentLeads,
    recentOrders,
    pipelineBreakdown,
    pipelineValue,
  });
}
