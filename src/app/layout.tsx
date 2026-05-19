import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
