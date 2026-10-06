import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createTeacherSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  employeeId: z.string().min(1),
  department: z.string().min(1),
  phone: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teachers = await prisma.teacher.findMany({
    include: { user: { select: { name: true, email: true } }, classes: true },
    orderBy: { joinedAt: "desc" },
  });

  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createTeacherSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const teacher = await prisma.teacher.create({
      data: {
        employeeId: data.employeeId,
        department: data.department,
        phone: data.phone,
        user: {
          create: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: "TEACHER",
          },
        },
      },
      include: { user: true },
    });
    return NextResponse.json(teacher, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email or employee ID already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
