import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createExamSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  classId: z.string(),
  examDate: z.string(),
  maxMarks: z.number().int().positive().default(100),
  passMarks: z.number().int().positive().default(35),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classId = req.nextUrl.searchParams.get("classId") ?? undefined;

  const exams = await prisma.exam.findMany({
    where: classId ? { classId } : undefined,
    include: { class: true, teacher: { include: { user: { select: { name: true } } } } },
    orderBy: { examDate: "desc" },
  });

  return NextResponse.json(exams);
}

// POST /api/exams -> teacher/admin schedules a new exam
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createExamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher && session.user.role === "TEACHER") {
    return NextResponse.json({ error: "Teacher profile not found" }, { status: 400 });
  }

  const exam = await prisma.exam.create({
    data: {
      title: data.title,
      subject: data.subject,
      classId: data.classId,
      examDate: new Date(data.examDate),
      maxMarks: data.maxMarks,
      passMarks: data.passMarks,
      teacherId: teacher ? teacher.id : (await prisma.teacher.findFirstOrThrow()).id,
    },
  });

  return NextResponse.json(exam, { status: 201 });
}
