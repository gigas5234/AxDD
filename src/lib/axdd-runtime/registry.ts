/**
 * AXDD Kit Registry — discovers installable kits and exposes their
 * KIT_MANIFEST metadata. In v0.1.1 the registry is in-memory and built
 * from the preset configs that ship in this repo, plus any kits the
 * user generated in the current session.
 *
 * Future shape (sketched but not implemented):
 *   - persistent registry backed by an HTTP service
 *   - per-tenant namespaces
 *   - version pinning + upgrade hints
 */

import type { SkillConfig, SkillPackageType } from "@/types/skill";
import {
  PRESETS,
  buildUxUiStandardKitConfig,
  buildReferenceReviewKitConfig,
  buildCursorHandoffKitConfig,
  buildFigmaManualKitConfig,
  buildUxValidationKitConfig,
} from "@/lib/skill-builder/default-preset";
import { PRESET_BUNDLES } from "@/lib/skill-builder/preset-bundles";
import { mergeRequiredFiles } from "@/lib/skill-builder/package-matrix";

export type KitRegistryEntry = {
  /** Preset id; also the install id. */
  id: string;
  /** Display name. */
  name: string;
  /** One-line purpose (taken from PresetBundle.focus). */
  focus: string;
  /** Primary kit structure (matches the derived primary in the config). */
  primaryKitStructure: SkillPackageType;
  /** Skill types the kit composes. */
  includedSkillTypes: SkillPackageType[];
  /** Tags (category + skill types) for search. */
  tags: string[];
  /** Headline files this kit puts forward. */
  emphasizedFiles: string[];
  /** Estimated file count (computed deterministically from the matrix). */
  estimatedFileCount: number;
  /** Available now vs roadmap. */
  status: "available" | "coming-soon";
  /** Factory that builds the config — for the in-app installer. */
  buildConfig: () => SkillConfig;
  /** Schema version for the registry record itself. */
  schemaVersion: string;
};

const CONFIG_BUILDERS: Record<string, () => SkillConfig> = {
  "axdd-ux-ui-standard-kit": buildUxUiStandardKitConfig,
  "axdd-ux-ui-reference-review": buildReferenceReviewKitConfig,
  "axdd-cursor-handoff-kit": buildCursorHandoffKitConfig,
  "axdd-figma-manual-instruction-kit": buildFigmaManualKitConfig,
  "axdd-ux-validation-governance-kit": buildUxValidationKitConfig,
};

/**
 * Rough estimate of file count from the matrix. Used by the registry
 * card so we can show "≈ 31 files" without actually generating the kit.
 * This is heuristic — the real number depends on capability packs etc.
 */
function estimateFileCount(cfg: SkillConfig): number {
  const required = mergeRequiredFiles(cfg.includedSkillTypes);
  let n = 0;
  if (required.skillMd) n += 1;
  if (required.catalogMd) n += 1;
  if (required.readmeMd) n += 1;
  if (required.workUnitJson) n += 1;
  if (required.hooksJson) n += 1;
  // references/ — base 4 + capability pack refs + stage-guides (6) if full-step
  if (required.references) {
    n += 4 + cfg.capabilityPacks.length;
    if (cfg.includedSkillTypes.includes("full-step-skill")) n += 6 + 1; // stage-guides + skill-framework
  }
  // templates/ — 3-5 depending on preset
  if (required.templates) {
    if (cfg.id === "axdd-ux-ui-reference-review") n += 2;
    else if (cfg.id === "axdd-cursor-handoff-kit") n += 3;
    else if (cfg.id === "axdd-figma-manual-instruction-kit") n += 2;
    else n += cfg.outputFormat.includeCursorPrompt ? 5 : 4;
  }
  if (required.checklists) n += 4;
  if (required.tests) {
    n += 2; // sandbox + log
    n += 4; // scorecards
    // scenarios + expected pairs (5 for full-step, 4 for cursor, 5 for ref-review)
    const pairs =
      cfg.id === "axdd-cursor-handoff-kit"
        ? 4
        : cfg.id === "axdd-ux-ui-reference-review"
          ? 5
          : cfg.includedSkillTypes.includes("full-step-skill")
            ? 5
            : 0;
    n += pairs * 2;
  }
  if (required.examples) n += 1;
  if (required.scripts) n += 2;
  if (required.assets) n += 1;
  if (required.metadata) n += 2;
  return n;
}

/**
 * Build the in-memory kit registry. This is the only source of truth
 * for the UI's Registry view. Adding a new preset = adding a row here
 * (or in PRESETS + PRESET_BUNDLES; we cross-reference both).
 */
export function getInstalledKits(): KitRegistryEntry[] {
  return PRESETS.filter((p) => p.category === "ux-ui").map((preset) => {
    const bundle = PRESET_BUNDLES[preset.id];
    const builder = CONFIG_BUILDERS[preset.id];
    // Configs we don't have a builder for (legacy / coming-soon UX/UI
    // presets) get a placeholder factory that builds the Standard Kit
    // so the registry can still render them as cards.
    const safeBuilder = builder ?? buildUxUiStandardKitConfig;
    const cfg = safeBuilder();
    const tags = [
      cfg.category,
      ...cfg.includedSkillTypes,
      cfg.buildMode,
    ];
    return {
      id: preset.id,
      name: preset.name,
      focus: bundle?.focus.en ?? preset.bestFor,
      primaryKitStructure: cfg.packageType,
      includedSkillTypes: cfg.includedSkillTypes,
      tags,
      emphasizedFiles: bundle?.emphasizedFiles ?? [],
      estimatedFileCount: estimateFileCount(cfg),
      status: preset.status,
      buildConfig: safeBuilder,
      schemaVersion: "0.1",
    };
  });
}

/** Lookup by id. Returns null if unknown. */
export function getKitFromRegistry(id: string): KitRegistryEntry | null {
  return getInstalledKits().find((k) => k.id === id) ?? null;
}

/** Crude search over name + focus + tags. */
export function searchRegistry(query: string): KitRegistryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return getInstalledKits();
  return getInstalledKits().filter((k) => {
    const hay = [
      k.name,
      k.focus,
      k.id,
      k.primaryKitStructure,
      ...k.tags,
      ...k.emphasizedFiles,
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((tok) => hay.includes(tok));
  });
}
