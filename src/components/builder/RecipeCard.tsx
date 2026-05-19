"use client";

import type { Recipe } from "@/lib/skill-builder/recipes";
import { PACK_LABELS, WORKFLOW_LABELS, ANSWER_STYLE_LABELS, UI } from "@/lib/i18n/strings";
import { useLocale, tr } from "@/lib/i18n/locale";

export function RecipeCard({
  recipe,
  active,
  onApply,
}: {
  recipe: Recipe;
  active: boolean;
  onApply: () => void;
}) {
  const { locale } = useLocale();
  return (
    <div
      className={`rounded-lg border bg-canvas p-4 flex flex-col gap-3 transition ${
        active ? "border-primary" : "border-hairline hover:border-ink-muted-48"
      }`}
    >
      <div>
        <div className="text-[15px] font-semibold text-ink leading-tight">
          {tr(recipe.name, locale)}
        </div>
        <p className="mt-1 text-[12.5px] text-ink-muted-80 leading-snug">
          {tr(recipe.goal, locale)}
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted-48 mr-1">
            {tr(UI.recipePacksLabel, locale)}
          </span>
          {recipe.capabilityPacks.map((p) => (
            <span
              key={p}
              className="text-[11px] text-ink-muted-80 bg-canvas-parchment border border-divider-soft rounded-sm px-1.5 py-0.5"
            >
              {tr(PACK_LABELS[p].label, locale)}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted-48 mr-1">
            {tr(UI.recipeWorkflowsLabel, locale)}
          </span>
          <span className="text-[11px] text-ink-muted-80">
            {recipe.workflowModules.length}
            {locale === "ko" ? "개" : ""}
            {locale === "en" ? " modules" : ""}
          </span>
          {recipe.answerStyle && (
            <>
              <span className="text-[10px] text-ink-muted-48 ml-2 mr-1 uppercase tracking-[0.14em]">
                {tr(UI.recipeStyleLabel, locale)}
              </span>
              <span className="text-[11px] text-ink-muted-80">
                {tr(ANSWER_STYLE_LABELS[recipe.answerStyle], locale)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className={`mt-auto inline-flex items-center justify-center rounded-pill px-3 py-[7px] text-[13px] transition ${
          active
            ? "bg-canvas-parchment text-ink-muted-80 border border-hairline"
            : "bg-primary text-body-on-dark hover:opacity-95"
        }`}
        disabled={active}
      >
        {active ? tr(UI.recipeApplied, locale) : tr(UI.recipeApply, locale)}
      </button>
    </div>
  );
}
