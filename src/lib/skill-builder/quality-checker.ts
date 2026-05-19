import type {
  GeneratedFile,
  QualityCheck,
  QualityReport,
  SkillConfig,
} from "@/types/skill";

// ─────────────────────────────────────────────────────────────────────────────
// Score model
// pass = 1.0   warning = 0.5   fail = 0.0
// totalScore = round( sum(weights) / count(checks) * 100 )
// ─────────────────────────────────────────────────────────────────────────────

function weightOf(status: "pass" | "warning" | "fail"): number {
  if (status === "pass") return 1;
  if (status === "warning") return 0.5;
  return 0;
}

function pass(id: string, label: string, message = "OK"): QualityCheck {
  return { id, label, status: "pass", message };
}
function warn(id: string, label: string, message: string): QualityCheck {
  return { id, label, status: "warning", message };
}
function fail(id: string, label: string, message: string): QualityCheck {
  return { id, label, status: "fail", message };
}

function hasFile(files: GeneratedFile[], suffix: string): boolean {
  return files.some((f) => f.path.endsWith(suffix));
}

function fileContent(files: GeneratedFile[], suffix: string): string {
  return files.find((f) => f.path.endsWith(suffix))?.content ?? "";
}

const DEFAULT_DESCRIPTION_BOILERPLATE =
  "AI-assisted UX/UI design workflow skill for product designers and makers.";

export function runQualityChecks(
  config: SkillConfig,
  files: GeneratedFile[],
): QualityReport {
  const checks: QualityCheck[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const skillMd = fileContent(files, "SKILL.md");
  const packCount = config.capabilityPacks.length;
  const wfCount = config.workflowModules.length;
  const ruleCount = config.qualityRules.length;

  // ── 1. Name ────────────────────────────────────────────────────────────────
  if (config.skillName && config.skillName.trim().length >= 3) {
    checks.push(pass("name", "Skill has a clear name"));
  } else {
    checks.push(fail("name", "Skill name", "Skill name is missing or too short."));
  }

  // ── 2. Description quality ────────────────────────────────────────────────
  const desc = (config.description ?? "").trim();
  if (desc.length === 0) {
    checks.push(fail("description", "Skill description", "Description is empty."));
  } else if (desc === DEFAULT_DESCRIPTION_BOILERPLATE) {
    checks.push(
      warn(
        "description",
        "Skill description (boilerplate)",
        "You're using the default boilerplate. Rewrite it to describe *your* skill specifically.",
      ),
    );
    suggestions.push(
      "Rewrite the description to your specific use case — the default boilerplate is too generic.",
    );
  } else if (desc.length < 30) {
    checks.push(
      warn(
        "description",
        "Skill description (short)",
        "Description is shorter than 30 characters — add when-to-use context.",
      ),
    );
  } else {
    checks.push(pass("description", "Skill description"));
  }

  // ── 3. Workflow count (Goldilocks) ────────────────────────────────────────
  if (wfCount === 0) {
    checks.push(
      fail("workflow-count", "Workflow modules", "No workflow modules selected."),
    );
  } else if (wfCount <= 3) {
    checks.push(
      warn(
        "workflow-count",
        "Workflow modules (few)",
        `Only ${wfCount} module${wfCount > 1 ? "s" : ""} — the skill may feel thin.`,
      ),
    );
  } else if (wfCount >= 10) {
    checks.push(
      warn(
        "workflow-count",
        "Workflow modules (many)",
        `${wfCount} modules — consider trimming to a focused 5-8.`,
      ),
    );
    warnings.push(
      "Workflow has many modules; consider trimming for focused agent behavior.",
    );
  } else {
    checks.push(pass("workflow-count", `Workflow modules (${wfCount})`));
  }

  // ── 4. Capability Pack count (Goldilocks) ─────────────────────────────────
  if (packCount === 0) {
    checks.push(
      warn(
        "pack-count",
        "Capability Packs (none)",
        "No packs enabled — consider Design Taste or Web Best Practices.",
      ),
    );
    suggestions.push(
      "Enable at least one Capability Pack to give the skill an opinionated flavor.",
    );
  } else if (packCount === 1) {
    checks.push(
      warn(
        "pack-count",
        "Capability Packs (only 1)",
        "Just one pack — consider combining 2-4 for richer behavior.",
      ),
    );
  } else if (packCount >= 7) {
    checks.push(
      warn(
        "pack-count",
        "Capability Packs (many)",
        `${packCount} packs — overlap risk. 2-5 is usually the sweet spot.`,
      ),
    );
  } else {
    checks.push(pass("pack-count", `Capability Packs (${packCount})`));
  }

  // ── 5. Quality rules count ────────────────────────────────────────────────
  if (ruleCount === 0) {
    checks.push(fail("rules-count", "Quality rules", "No quality rules selected."));
  } else if (ruleCount <= 2) {
    checks.push(
      warn(
        "rules-count",
        "Quality rules (few)",
        "Fewer than 3 rules — the skill is silent on too many things.",
      ),
    );
  } else {
    checks.push(pass("rules-count", `Quality rules (${ruleCount})`));
  }

  // ── 6. "What not to do" coverage ──────────────────────────────────────────
  const hasAvoidRule =
    config.qualityRules.includes("avoid-vague-language") ||
    config.qualityRules.includes("avoid-unnecessary-questions") ||
    config.qualityRules.includes("avoid-overlong-chat-response");
  if (hasAvoidRule) {
    checks.push(pass("avoid", "Includes 'what not to do' guidance"));
  } else {
    checks.push(
      warn(
        "avoid",
        "What not to do",
        "No avoid-* rules selected — skill is silent on what NOT to do.",
      ),
    );
  }

  // ── 7. Accessibility coverage (rule OR mobile-patterns pack OR a11y workflow) ─
  const hasA11y =
    config.qualityRules.includes("include-accessibility") ||
    config.capabilityPacks.includes("mobile-patterns") ||
    config.workflowModules.includes("accessibility-check");
  if (hasA11y) {
    checks.push(pass("a11y", "Accessibility covered"));
  } else {
    checks.push(
      warn(
        "a11y",
        "Accessibility coverage",
        "No accessibility rule, pack, or workflow enabled.",
      ),
    );
    suggestions.push(
      "Enable accessibility rule, Mobile Patterns pack, or the accessibility-check workflow.",
    );
  }

  // ── 8. Design system coverage ─────────────────────────────────────────────
  const hasDs =
    config.roleProfile.designSystemAwareness ||
    config.capabilityPacks.includes("theme-factory") ||
    config.workflowModules.includes("design-system-draft");
  if (hasDs) {
    checks.push(pass("design-system", "Design system thinking covered"));
  } else {
    checks.push(
      warn(
        "design-system",
        "Design system coverage",
        "Neither designSystemAwareness, Theme Factory pack, nor design-system-draft workflow is on.",
      ),
    );
  }

  // ── 9. Pack coherence: shadcn requires Tailwind ───────────────────────────
  const hasShadcn = config.capabilityPacks.includes("shadcn-affinity");
  const hasTailwind = config.capabilityPacks.includes("tailwind-first");
  if (hasShadcn && !hasTailwind) {
    checks.push(
      warn(
        "coherence-shadcn",
        "shadcn requires Tailwind",
        "shadcn/ui Affinity is on but Tailwind-First is off — shadcn is built on Tailwind.",
      ),
    );
    warnings.push(
      "shadcn/ui Affinity is enabled without Tailwind-First. Enable Tailwind-First for coherent output.",
    );
  } else {
    checks.push(pass("coherence-shadcn", "Pack coherence (shadcn ↔ tailwind)"));
  }

  // ── 10. Cursor prompt coherence ───────────────────────────────────────────
  if (
    config.outputFormat.includeCursorPrompt &&
    !config.roleProfile.implementationAwareness
  ) {
    checks.push(
      warn(
        "coherence-cursor",
        "Cursor prompt without implementation awareness",
        "Cursor prompts work best when the role is implementation-aware.",
      ),
    );
    warnings.push(
      "Cursor prompt template is enabled, but implementation awareness is off.",
    );
  } else {
    checks.push(pass("coherence-cursor", "Cursor / implementation coherence"));
  }

  // ── 11. Output richness ───────────────────────────────────────────────────
  const richnessSignals = [
    config.outputFormat.includeMarkdown,
    config.outputFormat.includeJson,
    config.outputFormat.includeChecklists,
    config.outputFormat.includeExamples,
  ].filter(Boolean).length;
  if (richnessSignals === 0) {
    checks.push(fail("output-richness", "Output formats", "No output formats enabled."));
  } else if (richnessSignals <= 2) {
    checks.push(
      warn(
        "output-richness",
        "Output formats (sparse)",
        "Consider enabling JSON, checklists, or examples for richer output.",
      ),
    );
  } else {
    checks.push(pass("output-richness", `Output formats (${richnessSignals}/4)`));
  }

  // ── 12. Package completeness ──────────────────────────────────────────────
  const pkgFlags = config.packageOptions;
  const pkgIncluded = [
    pkgFlags.includeSkillMd,
    pkgFlags.includeReadme,
    pkgFlags.includeReferences,
    pkgFlags.includeTemplates,
    pkgFlags.includeExamples,
  ].filter(Boolean).length;
  if (pkgIncluded < 3) {
    checks.push(
      warn(
        "package-completeness",
        "Package completeness",
        `${pkgIncluded}/5 included — skill packages usually ship all five.`,
      ),
    );
  } else if (pkgIncluded < 5) {
    checks.push(
      warn(
        "package-completeness",
        "Package completeness",
        `${pkgIncluded}/5 included — consider enabling the rest.`,
      ),
    );
  } else {
    checks.push(pass("package-completeness", "All package parts included"));
  }

  // ── 13. Token-cost guardrail (Korean by default off) ──────────────────────
  if (
    config.language.generateKoreanByDefault &&
    config.language.translationMode === "none"
  ) {
    checks.push(
      warn(
        "translation-coherence",
        "Translation mode contradiction",
        "Generate Korean by default is on but translationMode is 'none'.",
      ),
    );
  } else if (config.language.translationMode === "side-by-side") {
    checks.push(
      warn(
        "translation-coherence",
        "Side-by-side translation cost",
        "Side-by-side translation roughly doubles token usage. Consider 'on-demand'.",
      ),
    );
    suggestions.push(
      "Side-by-side translation can be expensive. 'on-demand' is the MVP recommendation.",
    );
  } else {
    checks.push(pass("translation-coherence", "Translation mode coherent"));
  }

  // ── Structural sanity (silent passes when SKILL.md is included) ──────────
  if (config.packageOptions.includeSkillMd) {
    if (!skillMd.includes("## Role")) {
      checks.push(fail("structural-role", "SKILL.md structure", "Missing ## Role section."));
    }
    if (!skillMd.includes("When to use this skill")) {
      checks.push(
        fail(
          "structural-whentouse",
          "SKILL.md structure",
          "Missing When-to-use section.",
        ),
      );
    }
  }

  // ── Aggregate weighted score ─────────────────────────────────────────────
  const total = checks.length;
  const earned = checks.reduce((s, c) => s + weightOf(c.status), 0);
  const totalScore = total === 0 ? 0 : Math.round((earned / total) * 100);

  return {
    totalScore,
    checks,
    warnings,
    suggestions,
  };
}
