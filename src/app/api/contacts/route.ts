import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const contacts = await prisma.contact.findMany({
    where: { enterpriseId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const contact = await prisma.contact.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email || null,
      phone: body.phone || null,
      company: body.company || null,
      position: body.position || null,
      address: body.address || null,
      city: body.city || null,
      country: body.country || null,
      notes: body.notes || null,
      type: body.type || "customer",
      status: body.status || "active",
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(contact);
}
