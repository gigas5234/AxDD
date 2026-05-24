"use client";

import Link from "next/link";
import { LangToggle } from "@/components/builder/LangToggle";
import { useLocale, tr, type Bilingual } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

const HERO_TITLE: Bilingual = {
  en: "Compose AXDD Standard Kits without hand-writing SKILL.md, CATALOG.md, WORK_UNIT.json, or HOOKS.json.",
  ko: "SKILL.md, CATALOG.md, WORK_UNIT.json, HOOKS.json을 직접 작성하지 않고 AXDD Standard Kit를 조합하세요.",
};

const HERO_BODY: Bilingual = {
  en: "An AXDD Standard Kit Composer for UX/UI workflows. Pick a preset or compose any combination of the 8 AXDD skill package types — Reference, Template, Script, Asset, Full-Step, Metadata, Test, or Simple — preview every file, and download a ready-to-use kit.",
  ko: "UX/UI 워크플로용 AXDD Standard Kit Composer. 프리셋을 선택하거나 8가지 AXDD 스킬 패키지 타입(Reference · Template · Script · Asset · Full-Step · Metadata · Test · Simple)을 자유롭게 조합해, 모든 파일을 미리보고 즉시 사용 가능한 키트를 다운로드합니다.",
};

const CTA_OPEN: Bilingual = { en: "Open Builder", ko: "빌더 열기" };
const CTA_LEARN: Bilingual = { en: "Learn more", ko: "자세히 보기" };

const FEAT_TITLE_1: Bilingual = {
  en: "Preset or Custom",
  ko: "프리셋 또는 커스텀",
};
const FEAT_BODY_1: Bilingual = {
  en: "Start from a recommended UX/UI kit — AXDD UX/UI Standard Kit, Reference-Based UX/UI Review, or Cursor Handoff Kit — or switch to Custom and select any of the 8 AXDD skill package types.",
  ko: "추천 UX/UI 키트(AXDD UX/UI Standard Kit, Reference-Based UX/UI Review, Cursor Handoff Kit)로 시작하거나, Custom 모드로 전환해 8가지 AXDD 스킬 패키지 타입을 자유롭게 조합합니다.",
};

const FEAT_TITLE_2: Bilingual = {
  en: "Deterministic, matrix-driven",
  ko: "결정론적 · 매트릭스 기반 생성",
};
const FEAT_BODY_2: Bilingual = {
  en: "No AI calls. Required files come from a per-type matrix and are merged across every included skill type. The Primary Kit Structure is derived from your selection.",
  ko: "AI 호출 없이, 타입별 매트릭스에서 필수 파일이 도출되고 선택한 모든 스킬 타입이 병합됩니다. Primary Kit Structure도 선택에 따라 자동으로 결정됩니다.",
};

const FEAT_TITLE_3: Bilingual = {
  en: "Preview, quality, ZIP",
  ko: "미리보기 · 품질 검사 · ZIP",
};
const FEAT_BODY_3: Bilingual = {
  en: "A file tree, markdown / JSON preview, raw editor, and live quality checker share one workspace. Edit any file, watch the score update, and export the whole kit as a ZIP.",
  ko: "파일 트리·마크다운/JSON 미리보기·원본 에디터·실시간 품질 검사가 한 워크스페이스에 모여 있습니다. 어떤 파일이든 편집해 점수를 즉시 확인하고, 전체 키트를 ZIP으로 내보냅니다.",
};

const FOOTER_LEFT: Bilingual = {
  en: "AXDD Standard Kit Composer",
  ko: "AXDD Standard Kit Composer",
};
const FOOTER_RIGHT: Bilingual = {
  en: "UX/UI category · 8 AXDD skill types",
  ko: "UX/UI 카테고리 · 8가지 AXDD 스킬 타입",
};

export default function HomePage() {
  const { locale } = useLocale();
  return (
    <main className="min-h-screen flex flex-col">
      {/* Global nav — pure black, 44px */}
      <header className="h-11 bg-surface-black text-body-on-dark flex items-center px-5">
        <div className="text-nav-link font-medium">{tr(UI.brand, locale)}</div>
        <div className="ml-auto">
          <LangToggle variant="dark" />
        </div>
      </header>

      {/* Hero tile */}
      <section className="flex-1 bg-canvas flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center">
          <div className="text-caption uppercase tracking-[0.18em] text-ink-muted-48 mb-5">
            {tr(UI.brand, locale)}
          </div>
          <h1
            className="font-semibold text-ink"
            style={{
              fontSize: 56,
              lineHeight: 1.07,
              letterSpacing: "-0.28px",
            }}
          >
            {tr(HERO_TITLE, locale)}
          </h1>
          <p
            className="mt-6 text-ink-muted-80 mx-auto max-w-2xl"
            style={{
              fontSize: 21,
              lineHeight: 1.42,
              letterSpacing: "0.011em",
              fontWeight: 400,
            }}
          >
            {tr(HERO_BODY, locale)}
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-pill bg-cta text-body-on-dark px-[22px] py-[11px] text-[17px] font-medium shadow-sm hover:bg-cta-hover transition"
            >
              {tr(CTA_OPEN, locale)}
            </Link>
            <span
              className="inline-flex items-center justify-center rounded-pill border border-ink/30 text-ink px-[22px] py-[11px] text-[17px] font-normal opacity-70 cursor-not-allowed select-none"
              title="Phase 2"
            >
              {tr(CTA_LEARN, locale)}
            </span>
          </div>
        </div>
      </section>

      {/* Parchment tile — three-bullet description */}
      <section className="bg-canvas-parchment border-t border-divider-soft">
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCell
            title={tr(FEAT_TITLE_1, locale)}
            body={tr(FEAT_BODY_1, locale)}
          />
          <FeatureCell
            title={tr(FEAT_TITLE_2, locale)}
            body={tr(FEAT_BODY_2, locale)}
          />
          <FeatureCell
            title={tr(FEAT_TITLE_3, locale)}
            body={tr(FEAT_BODY_3, locale)}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas-parchment border-t border-divider-soft">
        <div className="max-w-5xl mx-auto px-6 py-8 text-fine-print text-ink-muted-48 flex items-center justify-between">
          <span>{tr(FOOTER_LEFT, locale)}</span>
          <span>{tr(FOOTER_RIGHT, locale)}</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCell({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0">
      <div className="text-tagline text-ink">{title}</div>
      <p
        className="mt-2 text-ink-muted-80"
        style={{
          fontSize: 17,
          lineHeight: 1.55,
          wordBreak: "keep-all",
          overflowWrap: "anywhere",
        }}
      >
        {body}
      </p>
    </div>
  );
}
