import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduManage",
  description:
    "Education management platform for students, teachers, attendance, exams and fees.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-parchment font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}