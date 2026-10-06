import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import StatCard from "@/components/StatCard";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      classes: {
        include: {
          students: true,
        },
      },
      exams: {
        orderBy: {
          examDate: "asc",
        },
        take: 5,
        include: {
          class: true,
        },
      },
    },
  });

  const totalStudents =
    teacher?.classes.reduce(
      (sum, c) => sum + c.students.length,
      0
    ) ?? 0;

  return (
    <DashboardShell
      title="Teacher Dashboard"
      userName={session.user.name ?? ""}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          label="Classes"
          value={teacher?.classes.length ?? 0}
        />

        <StatCard
          label="Students taught"
          value={totalStudents}
        />

        <StatCard
          label="Upcoming exams"
          value={teacher?.exams.length ?? 0}
        />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-lg text-ink">
          Your classes
        </h2>

        <div className="mt-3 grid grid-cols-1 gap-px overflow-hidden border border-rule sm:grid-cols-2">
          {teacher?.classes.map((c) => (
            <div
              key={c.id}
              className="bg-parchment-raised px-5 py-4"
            >
              <p className="font-medium text-ink">
                {c.name}
              </p>

              <p className="text-sm text-ink-soft">
                {c.students.length} students
              </p>
            </div>
          ))}

          {(!teacher || teacher.classes.length === 0) && (
            <p className="px-5 py-4 text-ink-soft">
              No classes assigned yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg text-ink">
          Upcoming exams
        </h2>

        <table className="ledger-table mt-3 w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {teacher?.exams.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>

                <td className="text-ink-soft">
                  {e.subject}
                </td>

                <td>{e.class.name}</td>

                <td className="text-ink-soft">
                  {e.examDate.toDateString()}
                </td>
              </tr>
            ))}

            {(!teacher || teacher.exams.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-ink-soft"
                >
                  No exams scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}