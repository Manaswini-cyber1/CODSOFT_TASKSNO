"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  admissionNo: string;
};

type ClassData = {
  id: string;
  name: string;
  students: Student[];
};

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED";

export default function AttendanceForm({
  classes,
}: {
  classes: ClassData[];
}) {
  const [classId, setClassId] = useState(
    classes.length > 0 ? classes[0].id : ""
  );

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const [remarks, setRemarks] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedClass = classes.find(
    (c) => c.id === classId
  );

  const students = selectedClass?.students ?? [];

  useEffect(() => {
    if (!classId || !date) return;

    async function loadAttendance() {
      try {
        const response = await fetch(
          `/api/attendance?classId=${classId}&date=${date}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const existingAttendance: Record<
          string,
          AttendanceStatus
        > = {};

        const existingRemarks: Record<string, string> = {};

        for (const record of data) {
          existingAttendance[record.studentId] =
            record.status;

          if (record.remarks) {
            existingRemarks[record.studentId] =
              record.remarks;
          }
        }

        const newAttendance: Record<
          string,
          AttendanceStatus
        > = {};

        for (const student of students) {
          newAttendance[student.id] =
            existingAttendance[student.id] ?? "PRESENT";
        }

        setAttendance(newAttendance);
        setRemarks(existingRemarks);
      } catch {
        setError("Could not load attendance.");
      }
    }

    loadAttendance();
  }, [classId, date]);

  function changeStatus(
    studentId: string,
    status: AttendanceStatus
  ) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  }

  function changeRemark(
    studentId: string,
    value: string
  ) {
    setRemarks((previous) => ({
      ...previous,
      [studentId]: value,
    }));
  }

  function markAll(status: AttendanceStatus) {
    const updated: Record<string, AttendanceStatus> = {};

    for (const student of students) {
      updated[student.id] = status;
    }

    setAttendance(updated);
  }

  async function saveAttendance() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id] ?? "PRESENT",
        remarks: remarks[student.id] || undefined,
      }));

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId,
          date,
          records,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Failed to save attendance."
        );

        setLoading(false);
        return;
      }

      setMessage(
        `Attendance saved successfully for ${records.length} students.`
      );
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      {/* Class and Date */}
      <div className="grid grid-cols-1 gap-6 border border-rule bg-parchment-raised p-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">
            Select Class
          </label>

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">
            Attendance Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="mt-6 border-l-4 border-forest bg-green-50 px-4 py-3 text-sm text-forest">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 border-l-4 border-burgundy bg-red-50 px-4 py-3 text-sm text-burgundy">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      {students.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => markAll("PRESENT")}
            className="border border-forest px-4 py-2 text-sm text-forest hover:bg-green-50"
          >
            Mark All Present
          </button>

          <button
            type="button"
            onClick={() => markAll("ABSENT")}
            className="border border-burgundy px-4 py-2 text-sm text-burgundy hover:bg-red-50"
          >
            Mark All Absent
          </button>
        </div>
      )}

      {/* Student List */}
      <div className="mt-6 overflow-x-auto border border-rule">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rule bg-parchment">
              <th className="px-5 py-4 text-left text-sm font-medium text-ink">
                #
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-ink">
                Student
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-ink">
                Admission No
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-ink">
                Attendance
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-ink">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => {
              const status =
                attendance[student.id] ?? "PRESENT";

              return (
                <tr
                  key={student.id}
                  className="border-b border-rule last:border-b-0"
                >
                  <td className="px-5 py-4 text-sm text-ink-soft">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">
                      {student.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-ink-soft">
                    {student.admissionNo}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={status}
                      onChange={(e) =>
                        changeStatus(
                          student.id,
                          e.target.value as AttendanceStatus
                        )
                      }
                      className="border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                    >
                      <option value="PRESENT">
                        Present
                      </option>

                      <option value="ABSENT">
                        Absent
                      </option>

                      <option value="LATE">
                        Late
                      </option>

                      <option value="EXCUSED">
                        Excused
                      </option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={remarks[student.id] ?? ""}
                      onChange={(e) =>
                        changeRemark(
                          student.id,
                          e.target.value
                        )
                      }
                      placeholder="Optional"
                      className="w-full min-w-[180px] border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                    />
                  </td>
                </tr>
              );
            })}

            {students.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No students are assigned to this class yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save */}
      {students.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={saveAttendance}
            disabled={loading}
            className="bg-ink px-7 py-3 text-sm font-medium text-white hover:bg-ink-soft disabled:opacity-50"
          >
            {loading
              ? "Saving Attendance..."
              : "Save Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}