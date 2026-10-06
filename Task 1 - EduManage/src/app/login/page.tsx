"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("That email and password don't match our records.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "ADMIN") router.push("/dashboard/admin");
    else if (role === "TEACHER") router.push("/dashboard/teacher");
    else router.push("/dashboard/student");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="font-display text-2xl text-ink">EduManage</p>
        <h1 className="mt-1 text-sm text-ink-soft">Sign in to your record</h1>

        <div className="mt-8 border-t border-rule pt-6">
          {error && (
            <p className="mb-4 border-l-2 border-burgundy bg-parchment-raised px-3 py-2 text-sm text-burgundy">
              {error}
            </p>
          )}

          <label className="block text-xs text-ink-soft">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border-b border-rule bg-transparent py-2 text-ink focus:border-ink focus:outline-none"
          />

          <label className="mt-5 block text-xs text-ink-soft">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border-b border-rule bg-transparent py-2 text-ink focus:border-ink focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-ink py-2.5 text-parchment-raised transition-colors hover:bg-ink-soft disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
          Demo accounts: admin@edumanage.test, teacher@edumanage.test, student@edumanage.test
          <br />
          Password for each: password123
        </p>
      </form>
    </main>
  );
}