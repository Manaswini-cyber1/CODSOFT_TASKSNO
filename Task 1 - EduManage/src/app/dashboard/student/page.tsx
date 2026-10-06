import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      class: true,
      attendance: { orderBy: { date: "desc" }, take: 10 },
      results: { include: { exam: true }, orderBy: { id: "desc" }, take: 10 },
      fees: { orderBy: { dueDate: "asc" } },
    },
  });

  const presentCount = student?.attendance.filter((a) => a.status === "PRESENT").length ?? 0;
  const attendanceRate = student?.attendance.length
    ? Math.round((presentCount / student.attendance.length) * 100)
    : 0;
  const outstandingFees =
    student?.fees
      .filter((f) => f.status !== "PAID")
      .reduce((sum, f) => sum + (f.amountDue - f.amountPaid), 0) ?? 0;

  return (
    <DashboardShell title="Overview" userName={session.user.name ?? ""} role="STUDENT">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard label="Class" value={student?.class?.name ?? "Unassigned"} />
        <StatCard
          label="Attendance (last 10)"
          value={`${attendanceRate}%`}
          tone={attendanceRate >= 75 ? "forest" : "burgundy"}
        />
        <StatCard
          label="Outstanding fees"
          value={`$${outstandingFees.toFixed(2)}`}
          tone={outstandingFees > 0 ? "burgundy" : "forest"}
        />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-lg text-ink">Recent exam results</h2>
        <table className="ledger-table mt-3 w-full">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {student?.results.map((r) => (
              <tr key={r.id}>
                <td>{r.exam.title}</td>
                <td className="text-ink-soft">{r.exam.subject}</td>
                <td>
                  {r.marksObtained}/{r.exam.maxMarks}
                </td>
                <td className="font-medium text-gold">{r.grade}</td>
              </tr>
            ))}
            {(!student || student.results.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-soft">
                  No results recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg text-ink">Fee records</h2>
        <table className="ledger-table mt-3 w-full">
          <thead>
            <tr>
              <th>Term</th>
              <th>Due</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {student?.fees.map((f) => (
              <tr key={f.id}>
                <td>{f.term}</td>
                <td>${f.amountDue.toFixed(2)}</td>
                <td>${f.amountPaid.toFixed(2)}</td>
                <td
                  className={
                    f.status === "PAID"
                      ? "font-medium text-forest"
                      : f.status === "OVERDUE"
                      ? "font-medium text-burgundy"
                      : "text-ink-soft"
                  }
                >
                  {f.status}
                </td>
              </tr>
            ))}
            {(!student || student.fees.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-soft">
                  No fee records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}