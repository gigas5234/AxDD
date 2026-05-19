import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  title: "AxDD Skill Builder",
  description:
    "Compose, preview, and download AI Agent Skill packages without writing SKILL.md from scratch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
