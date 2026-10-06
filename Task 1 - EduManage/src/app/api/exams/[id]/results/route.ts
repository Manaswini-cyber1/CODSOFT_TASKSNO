import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const resultsSchema = z.object({
  results: z.array(
    z.object({
      studentId: z.string(),
      marksObtained: z.number().min(0),
      remarks: z.string().optional(),
    })
  ),
});

function gradeFor(marks: number, max: number): string {
  const pct = (marks / max) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 35) return "D";
  return "F";
}

// GET /api/exams/:id/results
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await prisma.examResult.findMany({
    where: { examId: params.id },
    include: { student: { include: { user: { select: { name: true } } } } },
  });

  return NextResponse.json(results);
}

// POST /api/exams/:id/results -> bulk-record marks (teacher/admin)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = resultsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const exam = await prisma.exam.findUnique({ where: { id: params.id } });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  const { results } = parsed.data;

  const saved = await prisma.$transaction(
    results.map((r) =>
      prisma.examResult.upsert({
        where: { examId_studentId: { examId: exam.id, studentId: r.studentId } },
        update: {
          marksObtained: r.marksObtained,
          grade: gradeFor(r.marksObtained, exam.maxMarks),
          remarks: r.remarks,
        },
        create: {
          examId: exam.id,
          studentId: r.studentId,
          marksObtained: r.marksObtained,
          grade: gradeFor(r.marksObtained, exam.maxMarks),
          remarks: r.remarks,
        },
      })
    )
  );

  return NextResponse.json({ count: saved.length }, { status: 201 });
}
