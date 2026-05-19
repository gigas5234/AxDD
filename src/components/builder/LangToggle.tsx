"use client";

import { useLocale } from "@/lib/i18n/locale";

export function LangToggle({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { locale, setLocale } = useLocale();
  const isDark = variant === "dark";
  const base =
    "px-2 py-[3px] rounded-sm text-[12.5px] font-medium transition select-none";
  const activeCls = isDark
    ? "text-body-on-dark bg-body-on-dark/15"
    : "text-ink bg-ink/10";
  const idleCls = isDark
    ? "text-body-on-dark/55 hover:text-body-on-dark/85"
    : "text-ink-muted-48 hover:text-ink";
  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`${base} ${locale === "en" ? activeCls : idleCls}`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ko")}
        className={`${base} ${locale === "ko" ? activeCls : idleCls}`}
        aria-pressed={locale === "ko"}
      >
        한국어
      </button>
    </div>
  );
}
