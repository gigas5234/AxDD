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
      <head>
        {/* Pretendard Variable — Korean + Latin web font (orioncactus/pretendard, OFL) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
