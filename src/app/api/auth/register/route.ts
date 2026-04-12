import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, enterpriseName } = await req.json();

    if (!name || !email || !password || !enterpriseName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const slug = enterpriseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const enterprise = await prisma.enterprise.create({
      data: {
        name: enterpriseName,
        slug: `${slug}-${Date.now().toString(36)}`,
        email,
      },
    });

    await prisma.enterpriseMember.create({
      data: {
        userId: user.id,
        enterpriseId: enterprise.id,
        role: "owner",
      },
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      enterprise: { id: enterprise.id, name: enterprise.name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
