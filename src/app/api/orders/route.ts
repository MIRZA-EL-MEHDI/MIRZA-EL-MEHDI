import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const orders = await prisma.order.findMany({
    where: { enterpriseId },
    include: {
      contact: { select: { firstName: true, lastName: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: body.status || "draft",
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      notes: body.notes || null,
      contactId: body.contactId || null,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(order);
}
