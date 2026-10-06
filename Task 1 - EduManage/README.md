# EduManage

A full-stack education management platform for managing students, teachers, attendance,
examinations, fees, and academic records — built with Next.js (App Router), Prisma, and
PostgreSQL.

## Stack

- **Next.js 14** (App Router) — serves both the frontend and the API (`src/app/api/**`),
  so there is no separate Node/Express server to run.
- **Prisma + PostgreSQL** — schema in `prisma/schema.prisma`.
- **NextAuth (Credentials provider)** — email/password auth, JWT sessions, role embedded
  in the token.
- **Tailwind CSS** — styling.
- **Zod** — request validation on every API route.

If you specifically want a separate Node/Express API instead of Next.js API routes, the
Prisma schema and business logic in `src/app/api/**` port over almost line-for-line — each
route file is already a self-contained handler.

## Project structure

```
prisma/
  schema.prisma        # User, Teacher, Student, Class, Attendance, Exam, ExamResult, FeeRecord
  seed.ts               # Demo admin/teacher/student + one class
src/
  app/
    page.tsx             # Landing page
    login/page.tsx        # Credentials login form
    unauthorized/page.tsx
    dashboard/
      admin/page.tsx       # Org-wide stats, recent enrollments
      teacher/page.tsx     # Classes taught, upcoming exams
      student/page.tsx     # Own attendance, results, fees
    api/
      auth/[...nextauth]/route.ts
      students/route.ts            # GET list / POST create
      students/[id]/route.ts       # GET / PATCH / DELETE one
      teachers/route.ts            # GET list / POST create
      attendance/route.ts          # GET / POST (bulk mark, upsert)
      exams/route.ts               # GET list / POST create
      exams/[id]/results/route.ts  # GET / POST (bulk record marks)
      fees/route.ts                # GET list / POST create
      fees/[id]/pay/route.ts       # POST record a payment
  components/
    DashboardShell.tsx   # Shared header/nav + sign-out
    StatCard.tsx
  lib/
    prisma.ts             # Prisma client singleton
    auth.ts                # NextAuth config
  middleware.ts            # Role-based route protection for /dashboard/*
  types/next-auth.d.ts      # Adds `role` to the session/JWT types
```

## Roles & access control

Three roles: `ADMIN`, `TEACHER`, `STUDENT`, stored on `User.role` and embedded in the JWT.

- `middleware.ts` blocks `/dashboard/admin`, `/dashboard/teacher`, `/dashboard/student`
  based on role, redirecting to `/unauthorized` otherwise.
- Every API route re-checks `getServerSession()` server-side — the middleware alone is
  not treated as sufficient, since middleware can be bypassed by calling the API directly.
- Students are further scoped to their **own** records (attendance, fees, exam results)
  inside the route handlers, not just by role.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database**
   ```bash
   cp .env.example .env
   # edit .env with your PostgreSQL connection string and a NEXTAUTH_SECRET
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

4. **Demo accounts** (created by the seed script, password `password123` for all):
   - `admin@edumanage.test`
   - `teacher@edumanage.test`
   - `student@edumanage.test`

## Extending this scaffold

This gives you a working vertical slice — auth, schema, role-based dashboards, and CRUD
APIs for every module named in the brief. Natural next steps, in rough priority order:

1. **Forms/UI for the write paths** — the API routes for creating students, teachers,
   marking attendance, scheduling exams and recording fees are all built; the dashboards
   currently only *display* data. Add client forms (e.g. `src/app/dashboard/admin/students/new/page.tsx`)
   that POST to them.
2. **Class management UI** — creating/editing `Class` records (currently seed-only).
3. **Reporting** — attendance percentage over a date range, class-wide exam averages, a
   fee-collection report. `recharts` is already installed for this.
4. **File uploads** — student photos, document attachments — would need S3/Cloudinary,
   since Prisma/Postgres only stores structured data.
5. **Pagination** on the list endpoints once data volume grows beyond a page or two.
6. **Password reset / invite flow** instead of admins setting initial passwords directly.
7. **Audit logging** for administrative actions (who changed what, when).

## Notes on the schema

- `Attendance` has a `@@unique([studentId, date])` constraint, so marking attendance twice
  for the same student on the same day upserts rather than duplicates.
- `ExamResult` has `@@unique([examId, studentId])` for the same reason.
- Deleting a `Student` or `Teacher` is done by deleting the linked `User` — the relation is
  `onDelete: Cascade`, so the profile row goes with it automatically.
