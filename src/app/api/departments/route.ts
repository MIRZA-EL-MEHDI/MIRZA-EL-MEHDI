import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const departments = await prisma.department.findMany({
    where: { enterpriseId },
    include: { _count: { select: { employees: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(departments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const department = await prisma.department.create({
    data: {
      name: body.name,
      description: body.description || null,
      budget: body.budget || 0,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(department);
}
