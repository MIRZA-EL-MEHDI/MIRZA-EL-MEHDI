import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const leads = await prisma.lead.findMany({
    where: { enterpriseId },
    include: { contact: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  const body = await req.json();
  const lead = await prisma.lead.create({
    data: {
      title: body.title,
      value: body.value || 0,
      stage: body.stage || "new",
      source: body.source || null,
      probability: body.probability || 10,
      notes: body.notes || null,
      contactId: body.contactId || null,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(lead);
}
