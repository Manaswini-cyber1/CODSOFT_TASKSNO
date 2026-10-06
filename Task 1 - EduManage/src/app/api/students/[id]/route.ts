import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      class: true,
      attendance: { orderBy: { date: "desc" }, take: 30 },
      results: { include: { exam: true } },
      fees: true,
    },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Students may only view their own record; admins/teachers can view any.
  if (session.user.role === "STUDENT" && student.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(student);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { classId, guardianName, guardianPhone, dateOfBirth } = body;

  const updated = await prisma.student.update({
    where: { id: params.id },
    data: {
      classId,
      guardianName,
      guardianPhone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Deleting the linked User cascades to the Student record (see schema onDelete: Cascade).
  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: student.userId } });
  return NextResponse.json({ success: true });
}
