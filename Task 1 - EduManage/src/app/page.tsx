import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc]">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d5dfc] to-[#00b4d8] text-lg font-bold text-white shadow-lg">
            E
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#172033]">EduManage</h1>
            <p className="text-xs text-slate-500">Smart Education System</p>
          </div>
        </div>

        <Link
          href="/login"
          className="rounded-xl bg-[#172033] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#29344d]"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pt-20">
        <div className="absolute left-10 top-10 -z-0 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute right-10 top-20 -z-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Modern Education Management
            </div>

            <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-[#172033] md:text-6xl">
              Manage your
              <span className="gradient-text block">
                education smarter.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              EduManage brings students, teachers, attendance, examinations,
              fees and academic records together in one simple platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-[#6d5dfc] to-[#00a8cc] px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5"
              >
                Get Started →
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-bold text-[#172033]">3+</p>
                <p className="text-sm text-slate-500">User Roles</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#172033]">100%</p>
                <p className="text-sm text-slate-500">Centralized</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#172033]">24/7</p>
                <p className="text-sm text-slate-500">Accessible</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-white bg-white p-4 shadow-2xl shadow-slate-200">
              <div className="rounded-2xl bg-[#f7f8fc] p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      OVERVIEW
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#172033]">
                      Dashboard
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    ✦
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <PreviewCard
                    title="Students"
                    value="1,248"
                    icon="👨‍🎓"
                  />

                  <PreviewCard
                    title="Teachers"
                    value="86"
                    icon="👩‍🏫"
                  />

                  <PreviewCard
                    title="Attendance"
                    value="92%"
                    icon="📊"
                  />

                  <PreviewCard
                    title="Fees"
                    value="₹8.4L"
                    icon="💳"
                  />
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#172033]">
                        Academic Performance
                      </p>
                      <p className="text-xs text-slate-400">
                        Monthly overview
                      </p>
                    </div>

                    <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      +12.5%
                    </span>
                  </div>

                  <div className="mt-6 flex h-28 items-end gap-2">
                    {[45, 65, 52, 78, 60, 88, 72, 95, 82, 100].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-lg bg-gradient-to-t from-[#6d5dfc] to-[#8b7fff]"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <p className="text-xs text-slate-400">System Status</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-slate-700">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-purple-600">POWERFUL FEATURES</p>

            <h2 className="mt-3 text-3xl font-bold text-[#172033] md:text-4xl">
              Everything your institution needs
            </h2>

            <p className="mt-4 text-slate-500">
              A centralized platform designed to simplify everyday academic
              management.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="👨‍🎓"
              title="Student Management"
              description="Manage student profiles, classes, academic information and enrollment records."
            />

            <Feature
              icon="👩‍🏫"
              title="Teacher Management"
              description="Organize teachers, assigned classes and upcoming academic activities."
            />

            <Feature
              icon="📊"
              title="Attendance Tracking"
              description="Monitor attendance and quickly understand student participation."
            />

            <Feature
              icon="📝"
              title="Examinations"
              description="Manage exams, marks, grades and academic performance."
            />

            <Feature
              icon="💳"
              title="Fee Management"
              description="Track payments, outstanding fees and payment history."
            />

            <Feature
              icon="📈"
              title="Reports & Analytics"
              description="Turn academic data into useful insights through dashboards and reports."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#f7f8fc] py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 text-sm text-slate-500 md:flex-row lg:px-10">
          <p>© 2026 EduManage. Smart education management.</p>
          <p>Built for modern academic institutions.</p>
        </div>
      </footer>
    </main>
  );
}

function PreviewCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-green-500">+8%</span>
      </div>

      <p className="mt-4 text-xs text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-bold text-[#172033]">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-[#f9fafc] p-7 transition hover:-translate-y-1 hover:border-purple-100 hover:bg-white hover:shadow-xl hover:shadow-purple-100/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#172033]">{title}</h3>

      <p className="mt-2 leading-7 text-slate-500">{description}</p>
    </div>
  );
}