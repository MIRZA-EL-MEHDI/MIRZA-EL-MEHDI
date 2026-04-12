import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const invoices = await prisma.invoice.findMany({
    where: { enterpriseId },
    include: {
      contact: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const body = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      status: body.status || "draft",
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      notes: body.notes || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      contactId: body.contactId || null,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(invoice);
}
