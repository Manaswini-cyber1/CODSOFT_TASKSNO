"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardShell({
  title,
  userName,
  children,
}: {
  title: string;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);

  const role = pathname.includes("/admin")
    ? "ADMIN"
    : pathname.includes("/teacher")
      ? "TEACHER"
      : "STUDENT";

  const dashboardPath =
    role === "ADMIN"
      ? "/dashboard/admin"
      : role === "TEACHER"
        ? "/dashboard/teacher"
        : "/dashboard/student";

  const menu = [
    {
      label: "Dashboard",
      icon: "⌂",
      href: dashboardPath,
    },
    {
      label: "Students",
      icon: "👨‍🎓",
      href: "/dashboard/admin",
      show: role === "ADMIN",
    },
    {
      label: "Teachers",
      icon: "👩‍🏫",
      href: "/dashboard/admin",
      show: role === "ADMIN",
    },
    {
      label: "Attendance",
      icon: "📊",
      href: dashboardPath,
    },
    {
      label: "Examinations",
      icon: "📝",
      href: dashboardPath,
    },
    {
      label: "Fees",
      icon: "💳",
      href: dashboardPath,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Mobile overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d5dfc] to-[#00b4d8] font-bold text-white shadow-lg">
              E
            </div>

            <div>
              <h1 className="font-bold text-[#172033]">EduManage</h1>
              <p className="text-xs text-slate-400">Education System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menu
              .filter((item) => item.show !== false)
              .map((item) => {
                const active =
                  item.label === "Dashboard"
                    ? pathname === item.href
                    : false;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-gradient-to-r from-purple-50 to-cyan-50 text-purple-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-base">
                      {item.icon}
                    </span>

                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              ↪
            </span>
            Sign out
          </button>
        </div>

        {/* User */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 font-bold text-white">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {userName || "User"}
              </p>
              <p className="text-xs font-medium text-purple-600">{role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenu(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg lg:hidden"
            >
              ☰
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Welcome back 👋
              </p>
              <h1 className="text-xl font-bold text-[#172033]">{title}</h1>
            </div>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <div className="relative">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg hover:bg-slate-50">
                🔔
              </button>

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 font-bold text-white">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">
                  {userName || "User"}
                </p>
                <p className="text-xs text-slate-400">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}