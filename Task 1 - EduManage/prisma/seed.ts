import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edumanage.test" },
    update: {},
    create: {
      name: "Alex Admin",
      email: "admin@edumanage.test",
      passwordHash: password,
      role: Role.ADMIN,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@edumanage.test" },
    update: {},
    create: {
      name: "Taylor Teacher",
      email: "teacher@edumanage.test",
      passwordHash: password,
      role: Role.TEACHER,
      teacher: {
        create: {
          employeeId: "EMP-1001",
          department: "Mathematics",
        },
      },
    },
    include: { teacher: true },
  });

  const cls = await prisma.class.upsert({
    where: { gradeLevel_section: { gradeLevel: 10, section: "A" } },
    update: {},
    create: {
      name: "Grade 10 - Section A",
      gradeLevel: 10,
      section: "A",
      teacherId: teacherUser.teacher!.id,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@edumanage.test" },
    update: {},
    create: {
      name: "Sam Student",
      email: "student@edumanage.test",
      passwordHash: password,
      role: Role.STUDENT,
      student: {
        create: {
          admissionNo: "ADM-2026-001",
          classId: cls.id,
        },
      },
    },
  });

  console.log("Seeded:", { admin: admin.email, teacher: teacherUser.email, student: studentUser.email });
  console.log("All demo accounts use password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
