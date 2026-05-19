"use client";

import type { Recommendation } from "@/lib/skill-builder/recommender";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  UI,
  CATEGORY_LABELS,
  PACK_LABELS,
  WORKFLOW_LABELS,
} from "@/lib/i18n/strings";

export function RecommendationPanel({
  rec,
  onApply,
  onDismiss,
}: {
  rec: Recommendation;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const { locale } = useLocale();

  return (
    <div className="rounded-lg border border-primary bg-canvas overflow-hidden">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-3 px-4 py-3 border-b border-hairline bg-canvas-parchment">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48">
            {tr(UI.recHeader, locale)}
          </div>
          <div className="text-[15px] font-semibold text-ink truncate mt-0.5">
            "{rec.query}"
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-ink-muted-48 hover:text-ink text-[14px] px-2"
          aria-label={tr(UI.recDismiss, locale)}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {!rec.hasAnyMatch && (
          <div className="text-[13px] text-ink-muted-80 leading-relaxed">
            {tr(UI.recNoMatch, locale)}
          </div>
        )}

        {rec.category && (
          <Block label={tr(UI.recCategory, locale)}>
            <Row
              title={tr(CATEGORY_LABELS[rec.category.id].label, locale)}
              matched={rec.category.matchedTokens}
              matchedLabel={tr(UI.recMatched, locale)}
            />
          </Block>
        )}

        {rec.recipe && (
          <Block label={tr(UI.recRecipe, locale)}>
            <Row
              title={tr(rec.recipe.recipe.name, locale)}
              matched={rec.recipe.matchedTokens}
              matchedLabel={tr(UI.recMatched, locale)}
            />
          </Block>
        )}

        {rec.packs.length > 0 && (
          <Block label={tr(UI.recPacks, locale)}>
            <ul className="space-y-1.5">
              {rec.packs.map((p) => (
                <li key={p.id}>
                  <Row
                    title={tr(PACK_LABELS[p.id].label, locale)}
                    matched={p.matchedTokens}
                    matchedLabel={tr(UI.recMatched, locale)}
                  />
                </li>
              ))}
            </ul>
          </Block>
        )}

        {rec.workflows.length > 0 && (
          <Block label={tr(UI.recWorkflows, locale)}>
            <ul className="space-y-1.5">
              {rec.workflows.map((w) => (
                <li key={w.id}>
                  <Row
                    title={tr(WORKFLOW_LABELS[w.id], locale)}
                    matched={w.matchedTokens}
                    matchedLabel={tr(UI.recMatched, locale)}
                  />
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>

      {/* Footer */}
      {rec.hasAnyMatch && (
        <div className="px-4 py-3 border-t border-hairline flex items-center justify-end gap-2 bg-canvas-parchment">
          <button
            type="button"
            onClick={onDismiss}
            className="text-[13px] px-3 py-1.5 rounded-md text-ink-muted-80 hover:bg-divider-soft transition"
          >
            {tr(UI.recDismiss, locale)}
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[18px] py-[8px] text-[14px] font-normal hover:opacity-95 transition"
          >
            {tr(UI.recApplyAll, locale)}
          </button>
        </div>
      )}
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({
  title,
  matched,
  matchedLabel,
}: {
  title: string;
  matched: string[];
  matchedLabel: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-[14px] text-ink truncate">{title}</div>
      {matched.length > 0 && (
        <div className="text-[11px] text-ink-muted-48 whitespace-nowrap truncate">
          {matchedLabel}:{" "}
          <span className="text-ink-muted-80 font-mono">
            {matched.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
