import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const enterpriseId = searchParams.get("enterpriseId");
  const resource = searchParams.get("resource");

  // If requesting warehouses for a specific enterprise
  if (enterpriseId && resource === "warehouses") {
    const warehouses = await prisma.warehouse.findMany({
      where: { enterpriseId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(warehouses);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { enterprise: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json([], { status: 404 });
  }

  const enterprises = user.memberships.map((m) => ({
    id: m.enterprise.id,
    name: m.enterprise.name,
    slug: m.enterprise.slug,
    logo: m.enterprise.logo,
    role: m.role,
  }));

  return NextResponse.json(enterprises);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Creating a warehouse
  if (body.resource === "warehouse") {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: body.name,
        address: body.address || null,
        city: body.city || null,
        country: body.country || null,
        capacity: body.capacity || 0,
        enterpriseId: body.enterpriseId,
      },
    });
    return NextResponse.json(warehouse);
  }

  // Creating a new enterprise
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const enterprise = await prisma.enterprise.create({
    data: {
      name: body.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      email: body.email || null,
      phone: body.phone || null,
      website: body.website || null,
      address: body.address || null,
    },
  });

  await prisma.enterpriseMember.create({
    data: {
      userId: user.id,
      enterpriseId: enterprise.id,
      role: "owner",
    },
  });

  return NextResponse.json(enterprise);
}
