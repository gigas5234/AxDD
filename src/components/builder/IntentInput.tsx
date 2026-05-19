"use client";

import { useState, type FormEvent } from "react";
import { useLocale, tr } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

const EXAMPLES_KO = [
  "핀테크 온보딩 화면 설계",
  "React 컴포넌트 구현",
  "디자인 시스템 토큰",
  "모바일 앱 UX 리뷰",
];

const EXAMPLES_EN = [
  "fintech onboarding screen design",
  "implement React component",
  "design system tokens",
  "mobile app UX review",
];

export function IntentInput({
  onSubmit,
}: {
  onSubmit: (query: string) => void;
}) {
  const { locale } = useLocale();
  const [value, setValue] = useState("");
  const examples = locale === "ko" ? EXAMPLES_KO : EXAMPLES_EN;

  function submit(query: string) {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    onSubmit(trimmed);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(value);
  }

  function handleChipClick(text: string) {
    setValue(text);
    submit(text);
  }

  return (
    <section className="relative rounded-lg border border-hairline bg-canvas overflow-hidden">
      {/* Top accent stripe — single-accent compliant */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

      {/* Headline */}
      <div className="px-6 pt-7 pb-3 text-center">
        <h2
          className="text-ink font-semibold"
          style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.3px" }}
        >
          {tr(UI.intentHeroTitle, locale)}
        </h2>
        <p
          className="text-ink-muted-80 mt-2 mx-auto max-w-xl"
          style={{ fontSize: 15, lineHeight: 1.55 }}
        >
          {tr(UI.intentHeroSubtitle, locale)}
        </p>
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="px-6 pb-3">
        <div className="flex items-stretch gap-2 rounded-lg border-[1.5px] border-ink bg-canvas-parchment p-[6px] transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={tr(UI.intentPlaceholder, locale)}
            className="flex-1 min-w-0 bg-transparent px-3 py-2 text-[16px] text-ink placeholder:text-ink-muted-48 focus:outline-none"
            aria-label={tr(UI.intentHeroTitle, locale)}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={value.trim().length < 2}
            className="inline-flex items-center justify-center rounded-md bg-primary text-body-on-dark px-4 py-2 text-[14px] font-semibold hover:opacity-95 disabled:opacity-40 transition whitespace-nowrap"
          >
            {tr(UI.intentSubmit, locale)} <span className="ml-1">→</span>
          </button>
        </div>
      </form>

      {/* Example chips */}
      <div className="px-6 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mr-1">
            {tr(UI.intentExamplesLabel, locale)}
          </span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleChipClick(ex)}
              className="text-[13px] text-ink-muted-80 hover:text-ink bg-canvas-parchment hover:bg-divider-soft border border-hairline rounded-pill px-3 py-[5px] transition"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-6 py-2.5 text-[11px] text-ink-muted-48 leading-snug border-t border-divider-soft bg-canvas-parchment">
        {tr(UI.intentNote, locale)}
      </div>
    </section>
  );
}
