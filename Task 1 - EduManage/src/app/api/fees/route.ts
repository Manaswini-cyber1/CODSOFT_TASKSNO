import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createFeeSchema = z.object({
  studentId: z.string(),
  term: z.string().min(1),
  amountDue: z.number().positive(),
  dueDate: z.string(),
});

// GET /api/fees?studentId=...&status=PENDING
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  let studentId = req.nextUrl.searchParams.get("studentId") ?? undefined;

  // Students can only see their own fee records.
  if (session.user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    studentId = student?.id;
  }

  const fees = await prisma.feeRecord.findMany({
    where: {
      studentId,
      status: status as any,
    },
    include: { student: { include: { user: { select: { name: true } } } } },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(fees);
}

// POST /api/fees -> admin creates a fee record for a student
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createFeeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const fee = await prisma.feeRecord.create({
    data: {
      studentId: data.studentId,
      term: data.term,
      amountDue: data.amountDue,
      dueDate: new Date(data.dueDate),
      status: "PENDING",
    },
  });

  return NextResponse.json(fee, { status: 201 });
}
