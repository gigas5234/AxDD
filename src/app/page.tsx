"use client";

import Link from "next/link";
import { LangToggle } from "@/components/builder/LangToggle";
import { useLocale, tr, type Bilingual } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

const HERO_TITLE: Bilingual = {
  en: "Build AI Agent Skills without writing SKILL.md from scratch.",
  ko: "SKILL.md를 처음부터 쓰지 않고, 업무 흐름에 맞는 AI Agent Skill을 조합하세요.",
};

const HERO_BODY: Bilingual = {
  en: "Compose, preview, edit, and download structured AI Agent Skill packages. The first MVP supports the UX/UI Designer category and generates a complete package from a deterministic template engine.",
  ko: "구조화된 AI Agent Skill 패키지를 조합·미리보기·편집·다운로드합니다. MVP는 UX/UI 디자이너 카테고리를 지원하며, 결정론적 템플릿 엔진으로 패키지를 자동 생성합니다.",
};

const CTA_OPEN: Bilingual = { en: "Open Builder", ko: "빌더 열기" };
const CTA_LEARN: Bilingual = { en: "Learn more", ko: "자세히 보기" };

const FEAT_TITLE_1: Bilingual = {
  en: "Deterministic generation",
  ko: "결정론적 생성",
};
const FEAT_BODY_1: Bilingual = {
  en: "No AI calls. Templates compose SKILL.md, README, references, templates, and examples directly from your settings.",
  ko: "AI 호출 없이, 설정값에서 SKILL.md, README, references, templates, examples 파일을 곧바로 조합합니다.",
};

const FEAT_TITLE_2: Bilingual = {
  en: "Preview before download",
  ko: "다운로드 전에 미리보기",
};
const FEAT_BODY_2: Bilingual = {
  en: "A file tree, markdown render, and raw editor live in the same workspace. Edit any file before you export.",
  ko: "파일 트리·마크다운 렌더·원본 에디터가 한 워크스페이스에서 같이 동작합니다. 내보내기 전에 어느 파일이든 직접 편집할 수 있습니다.",
};

const FEAT_TITLE_3: Bilingual = { en: "Quality score", ko: "품질 점수" };
const FEAT_BODY_3: Bilingual = {
  en: "Eleven structural checks plus contextual warnings and suggestions, recomputed on every edit.",
  ko: "11개의 구조적 체크와 맥락별 경고·제안이 편집할 때마다 다시 계산됩니다.",
};

const FOOTER_LEFT: Bilingual = {
  en: "AxDD Skill Builder",
  ko: "AxDD 스킬 빌더",
};
const FOOTER_RIGHT: Bilingual = {
  en: "UX/UI Designer category",
  ko: "UX/UI 디자이너 카테고리",
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
              className="inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[22px] py-[11px] text-[17px] font-normal hover:opacity-95 transition"
            >
              {tr(CTA_OPEN, locale)}
            </Link>
            <span
              className="inline-flex items-center justify-center rounded-pill border border-primary text-primary px-[22px] py-[11px] text-[17px] font-normal opacity-70 cursor-not-allowed select-none"
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
