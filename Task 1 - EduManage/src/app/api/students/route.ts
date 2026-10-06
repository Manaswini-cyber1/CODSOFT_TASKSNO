import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  admissionNo: z.string().min(1),
  classId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

// GET /api/students?classId=...  -> list students (admin/teacher only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const classId = req.nextUrl.searchParams.get("classId") ?? undefined;

  const students = await prisma.student.findMany({
    where: classId ? { classId } : undefined,
    include: { user: { select: { name: true, email: true } }, class: true },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json(students);
}

// POST /api/students -> create a student + linked user account (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const student = await prisma.student.create({
      data: {
        admissionNo: data.admissionNo,
        classId: data.classId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        user: {
          create: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: "STUDENT",
          },
        },
      },
      include: { user: true },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email or admission number already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
