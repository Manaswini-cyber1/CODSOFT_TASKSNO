import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Maps each protected dashboard prefix to the roles allowed to view it.
const roleAccess: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["ADMIN", "TEACHER"],
  "/dashboard/student": ["ADMIN", "STUDENT"],
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token as any)?.role as string | undefined;

    const matchedPrefix = Object.keys(roleAccess).find((prefix) => pathname.startsWith(prefix));
    if (matchedPrefix && role && !roleAccess[matchedPrefix].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
