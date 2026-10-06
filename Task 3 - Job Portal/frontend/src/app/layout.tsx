
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerHub | Job Recruitment Platform",
  description:
    "Find jobs, apply for opportunities, and manage recruitment with CareerHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}