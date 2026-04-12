import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  if (!enterpriseId) return NextResponse.json([]);

  const employees = await prisma.employee.findMany({
    where: { enterpriseId },
    include: { department: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const body = await req.json();
  const employee = await prisma.employee.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      position: body.position,
      salary: body.salary || 0,
      status: body.status || "active",
      departmentId: body.departmentId || null,
      enterpriseId: body.enterpriseId,
    },
  });

  return NextResponse.json(employee);
}
