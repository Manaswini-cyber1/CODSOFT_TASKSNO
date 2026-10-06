"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    admissionNo: "",
    classId: "",
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          admissionNo: form.admissionNo,
          classId: form.classId || undefined,
          dateOfBirth: form.dateOfBirth || undefined,
          guardianName: form.guardianName || undefined,
          guardianPhone: form.guardianPhone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Failed to add student."
        );
        setLoading(false);
        return;
      }

      setMessage("Student added successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        admissionNo: "",
        classId: "",
        dateOfBirth: "",
        guardianName: "",
        guardianPhone: "",
      });

      setTimeout(() => {
        router.push("/dashboard/admin");
        router.refresh();
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-parchment px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="mb-4 text-sm text-ink-soft hover:text-ink"
          >
            ← Back to Admin Dashboard
          </button>

          <h1 className="font-display text-3xl text-ink">
            Add New Student
          </h1>

          <p className="mt-2 text-sm text-ink-soft">
            Create a student profile and login account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-rule bg-parchment-raised p-6 shadow-sm"
        >
          {message && (
            <div className="mb-6 border-l-4 border-forest bg-green-50 px-4 py-3 text-sm text-forest">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 border-l-4 border-burgundy bg-red-50 px-4 py-3 text-sm text-burgundy">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Student Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter student name"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Admission Number */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Admission Number *
              </label>

              <input
                type="text"
                name="admissionNo"
                value={form.admissionNo}
                onChange={handleChange}
                required
                placeholder="Example: ADM2026001"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="student@example.com"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Login Password *
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Class ID */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Class ID
              </label>

              <input
                type="text"
                name="classId"
                value={form.classId}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />

              <p className="mt-1 text-xs text-ink-soft">
                Leave empty for now if the student is not assigned to a class.
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Guardian Name
              </label>

              <input
                type="text"
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                placeholder="Parent / Guardian name"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="block text-sm font-medium text-ink">
                Guardian Phone
              </label>

              <input
                type="tel"
                name="guardianPhone"
                value={form.guardianPhone}
                onChange={handleChange}
                placeholder="Phone number"
                className="mt-2 w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4 border-t border-rule pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft disabled:opacity-50"
            >
              {loading ? "Adding Student..." : "Add Student"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/admin")}
              className="border border-rule px-6 py-3 text-sm text-ink transition hover:bg-parchment"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}