import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [studentCount, teacherCount, classCount, pendingFees] =
    await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.feeRecord.aggregate({
        where: {
          status: {
            in: ["PENDING", "OVERDUE"],
          },
        },
        _sum: {
          amountDue: true,
          amountPaid: true,
        },
      }),
    ]);

  const outstanding =
    (pendingFees._sum.amountDue ?? 0) -
    (pendingFees._sum.amountPaid ?? 0);

  const recentStudents = await prisma.student.findMany({
    take: 5,
    orderBy: {
      enrolledAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      class: true,
    },
  });

  return (
    <DashboardShell
      title="Admin Dashboard"
      userName={session?.user?.name ?? ""}
    >
      {/* Welcome */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#6d5dfc] via-[#6366f1] to-[#00a8cc] p-6 text-white shadow-xl shadow-purple-200">
        <p className="text-sm font-medium text-white/70">
          Education Management System
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Good to see you, {session?.user?.name || "Admin"}! 👋
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
          Monitor students, teachers, classes and financial information from
          your centralized dashboard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={studentCount}
          icon="👨‍🎓"
          trend="Active students"
        />

        <StatCard
          label="Total Teachers"
          value={teacherCount}
          icon="👩‍🏫"
          trend="Teaching staff"
        />

        <StatCard
          label="Total Classes"
          value={classCount}
          icon="🏫"
          trend="Active classes"
        />

        <StatCard
          label="Outstanding Fees"
          value={`₹${outstanding.toFixed(2)}`}
          icon="💳"
          trend="Pending collection"
        />
      </div>

      {/* Recent Students */}
      <section className="mt-8 dashboard-card overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">
              Recently Enrolled Students
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest student registrations
            </p>
          </div>

          <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600">
            {recentStudents.length} Recent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Admission No.</th>
              </tr>
            </thead>

            <tbody>
              {recentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                        {student.user.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>

                      <span className="font-semibold text-slate-700">
                        {student.user.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {student.user.email}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {student.class?.name ?? "Unassigned"}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-600">
                    {student.admissionNo}
                  </td>
                </tr>
              ))}

              {recentStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No students have been enrolled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}