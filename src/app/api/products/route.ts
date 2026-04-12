import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: { enterpriseId },
    include: { category: { select: { name: true, color: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      sku: body.sku,
      description: body.description || null,
      price: body.price || 0,
      cost: body.cost || 0,
      quantity: body.quantity || 0,
      minStock: body.minStock || 5,
      unit: body.unit || "pcs",
      status: body.status || "active",
      categoryId: body.categoryId || null,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(product);
}
