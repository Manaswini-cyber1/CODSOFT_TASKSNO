import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const markAttendanceSchema = z.object({
  classId: z.string(),
  date: z.string(), // ISO date
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
      remarks: z.string().optional(),
    })
  ),
});

// GET /api/attendance?classId=...&date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classId = req.nextUrl.searchParams.get("classId");
  const date = req.nextUrl.searchParams.get("date");

  const where: any = {};
  if (classId) where.classId = classId;
  if (date) {
    const day = new Date(date);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    where.date = { gte: day, lt: nextDay };
  }
  // Students can only see their own attendance.
  if (session.user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return NextResponse.json([], { status: 200 });
    where.studentId = student.id;
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: { student: { include: { user: { select: { name: true } } } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(attendance);
}

// POST /api/attendance -> bulk upsert attendance for a class on a given date (teacher/admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = markAttendanceSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { classId, date, records } = parsed.data;
  const day = new Date(date);

  const results = await prisma.$transaction(
    records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date: day } },
        update: { status: r.status, remarks: r.remarks },
        create: {
          studentId: r.studentId,
          classId,
          date: day,
          status: r.status,
          remarks: r.remarks,
        },
      })
    )
  );

  return NextResponse.json({ count: results.length }, { status: 201 });
}
