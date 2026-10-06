import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paySchema = z.object({ amount: z.number().positive() });

// POST /api/fees/:id/pay -> admin records a payment (full or partial)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = paySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const fee = await prisma.feeRecord.findUnique({ where: { id: params.id } });
  if (!fee) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newAmountPaid = fee.amountPaid + parsed.data.amount;
  const status = newAmountPaid >= fee.amountDue ? "PAID" : "PENDING";

  const updated = await prisma.feeRecord.update({
    where: { id: params.id },
    data: {
      amountPaid: newAmountPaid,
      status,
      paidAt: status === "PAID" ? new Date() : fee.paidAt,
    },
  });

  return NextResponse.json(updated);
}
