import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="text-slate-600">You don't have permission to view this page.</p>
      <Link href="/login" className="text-slate-900 underline">
        Back to sign in
      </Link>
    </main>
  );
}
