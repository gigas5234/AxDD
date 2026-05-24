import type {
  GeneratedFile,
  QualityCheck,
  QualityReport,
  SkillConfig,
} from "@/types/skill";
import { mergeRequiredFiles, ALL_STAGES } from "./package-matrix";

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
  "AXDD Standard Kit for AI-assisted UX/UI design — from requirement intake through handoff — with references, templates, checklists, and validation tests.";

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
  // Skip entirely for package types that legitimately have no workflow
  // modules (reference-skill, test-skill, simple-skill, asset-skill,
  // metadata-skill, script-skill, template-skill).
  const usesLegacyWorkflow =
    config.packageType === "full-step-skill" || wfCount > 0;
  if (!usesLegacyWorkflow) {
    // no check emitted — N/A
  } else if (wfCount === 0) {
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

  // ── AXDD Standard Kit checks ─────────────────────────────────────────────
  // Merge the matrix across every included skill type (custom mode can
  // combine multiple). For legacy/back-compat, fall back to packageType.
  const includedTypes =
    config.includedSkillTypes.length > 0
      ? config.includedSkillTypes
      : [config.packageType];
  const required = mergeRequiredFiles(includedTypes);
  const fileMissing = (folder: string) =>
    !files.some((f) => f.path.includes(`/${folder}/`));

  // 14. Matrix: SKILL.md
  if (required.skillMd && !hasFile(files, "/SKILL.md")) {
    checks.push(fail("matrix-skill-md", "SKILL.md required", "Missing SKILL.md."));
  } else {
    checks.push(pass("matrix-skill-md", "SKILL.md present"));
  }

  // 15. Matrix: CATALOG.md
  if (required.catalogMd) {
    if (!hasFile(files, "/CATALOG.md")) {
      checks.push(
        fail(
          "matrix-catalog",
          "CATALOG.md required",
          `Package type '${config.packageType}' requires CATALOG.md.`,
        ),
      );
    } else {
      checks.push(pass("matrix-catalog", "CATALOG.md present"));
      // 15b. CATALOG entries cross-reference real files
      const catalog = fileContent(files, "/CATALOG.md");
      const referenced = Array.from(catalog.matchAll(/`([a-z0-9_\-/.]+\.(?:md|json))`/gi))
        .map((m) => m[1])
        .filter((p) => p.includes("/"));
      const missing = referenced.filter(
        (p) => !files.some((f) => f.path.endsWith(`/${p}`)),
      );
      if (missing.length === 0) {
        checks.push(pass("catalog-refs", "CATALOG references resolve"));
      } else {
        checks.push(
          warn(
            "catalog-refs",
            "CATALOG references missing files",
            `Missing: ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "…" : ""}`,
          ),
        );
      }
    }
  }

  // 16. Matrix: WORK_UNIT.json (valid JSON, 6 stages)
  if (required.workUnitJson) {
    const wuRaw = fileContent(files, "/WORK_UNIT.json");
    if (!wuRaw) {
      checks.push(
        fail(
          "matrix-work-unit",
          "WORK_UNIT.json required",
          `Package type '${config.packageType}' requires WORK_UNIT.json.`,
        ),
      );
    } else {
      try {
        const parsed = JSON.parse(wuRaw);
        const n = Array.isArray(parsed.stages) ? parsed.stages.length : 0;
        if (n === 6) {
          checks.push(pass("work-unit-stages", "WORK_UNIT.json has 6 stages"));
        } else {
          checks.push(
            warn(
              "work-unit-stages",
              "WORK_UNIT.json stage count",
              `Expected 6 stages, found ${n}.`,
            ),
          );
        }
      } catch {
        checks.push(
          fail(
            "work-unit-json",
            "WORK_UNIT.json invalid JSON",
            "WORK_UNIT.json could not be parsed.",
          ),
        );
      }
    }
  }

  // 17. Matrix: HOOKS.json (valid JSON, routes + collisions)
  if (required.hooksJson) {
    const hkRaw = fileContent(files, "/HOOKS.json");
    if (!hkRaw) {
      checks.push(
        fail(
          "matrix-hooks",
          "HOOKS.json required",
          `Package type '${config.packageType}' requires HOOKS.json.`,
        ),
      );
    } else {
      try {
        const parsed = JSON.parse(hkRaw);
        const hooks = Array.isArray(parsed.hooks) ? parsed.hooks : [];
        // Stage references valid
        const knownStages = new Set<string>(ALL_STAGES);
        const badStage = hooks
          .map((h: { id: string; routeTo?: { stage?: string } }) => h)
          .filter(
            (h: { id: string; routeTo?: { stage?: string } }) =>
              h.routeTo?.stage && !knownStages.has(h.routeTo.stage),
          );
        if (badStage.length === 0) {
          checks.push(pass("hooks-stage-routes", "HOOKS routes to known stages"));
        } else {
          checks.push(
            fail(
              "hooks-stage-routes",
              "HOOKS routes to unknown stage(s)",
              `Bad: ${badStage.map((h: { id: string }) => h.id).join(", ")}`,
            ),
          );
        }
        // Trigger collisions
        const triggerToHooks = new Map<string, string[]>();
        for (const h of hooks as Array<{ id: string; triggers: string[] }>) {
          for (const t of h.triggers ?? []) {
            const key = t.toLowerCase();
            if (!triggerToHooks.has(key)) triggerToHooks.set(key, []);
            triggerToHooks.get(key)!.push(h.id);
          }
        }
        const collisions = Array.from(triggerToHooks.entries()).filter(
          ([, ids]) => ids.length > 1,
        );
        if (collisions.length === 0) {
          checks.push(pass("hooks-collisions", "No trigger collisions"));
        } else {
          checks.push(
            warn(
              "hooks-collisions",
              "Hook trigger collisions",
              collisions
                .slice(0, 3)
                .map(([t, ids]) => `"${t}" → ${ids.join("/")}`)
                .join("; "),
            ),
          );
        }
      } catch {
        checks.push(
          fail(
            "hooks-json",
            "HOOKS.json invalid JSON",
            "HOOKS.json could not be parsed.",
          ),
        );
      }
    }
  }

  // 18. Matrix: folder presence
  const folderRules: Array<[keyof typeof required, string]> = [
    ["references", "references"],
    ["templates", "templates"],
    ["checklists", "checklists"],
    ["tests", "tests"],
    ["examples", "examples"],
  ];
  for (const [key, folder] of folderRules) {
    if (required[key] && fileMissing(folder)) {
      checks.push(
        fail(
          `matrix-${folder}`,
          `${folder}/ required`,
          `Package type '${config.packageType}' requires ${folder}/ to be non-empty.`,
        ),
      );
    }
  }

  // 19. Figma manual fallback — only required for the full-step UX/UI Standard
  // Kit. Narrow presets (review, handoff, figma-manual itself) intentionally
  // ship a smaller template subset, so this check would fire spuriously.
  if (
    config.category === "ux-ui" &&
    required.templates &&
    includedTypes.includes("full-step-skill")
  ) {
    if (hasFile(files, "/templates/figma-instruction-template.md")) {
      checks.push(pass("figma-fallback", "Figma manual fallback present"));
    } else {
      checks.push(
        warn(
          "figma-fallback",
          "Figma manual fallback missing",
          "Full-step UX/UI kits should ship templates/figma-instruction-template.md for enterprise environments where Figma MCP is blocked.",
        ),
      );
    }
  }

  // 20-pre. AXDD 8-Type Skill Framework reference — full-step kits should ship it
  if (includedTypes.includes("full-step-skill")) {
    if (hasFile(files, "/references/skill-framework.md")) {
      checks.push(pass("skill-framework-ref", "skill-framework.md present"));
    } else {
      checks.push(
        warn(
          "skill-framework-ref",
          "skill-framework.md missing",
          "Full-step kits should include references/skill-framework.md so the package type can be self-documented.",
        ),
      );
    }
  }

  // 20a. Stage guides — full-step kits must ship one per stage
  if (includedTypes.includes("full-step-skill")) {
    const stageGuideFiles = files.filter((f) =>
      f.path.includes("/references/stage-guides/"),
    );
    if (stageGuideFiles.length === 0) {
      checks.push(
        fail(
          "stage-guides-folder",
          "references/stage-guides/ missing",
          "Full-step kits must include references/stage-guides/.",
        ),
      );
    } else {
      checks.push(pass("stage-guides-folder", "stage-guides folder present"));
      const requiredGuides = [
        "requirement-intake-guide.md",
        "ux-foundation-guide.md",
        "ui-design-foundation-guide.md",
        "prototype-planning-guide.md",
        "review-validation-guide.md",
        "handoff-guide.md",
      ];
      const missingGuides = requiredGuides.filter(
        (g) =>
          !files.some((f) => f.path.endsWith(`/references/stage-guides/${g}`)),
      );
      if (missingGuides.length === 0) {
        checks.push(pass("stage-guides-set", "all 6 stage guides present"));
      } else {
        checks.push(
          fail(
            "stage-guides-set",
            "stage guides missing",
            `Missing: ${missingGuides.join(", ")}`,
          ),
        );
      }
      // CATALOG references the stage guides
      const catalog = fileContent(files, "/CATALOG.md");
      const guideRefsMissing = requiredGuides.filter(
        (g) => !catalog.includes(`references/stage-guides/${g}`),
      );
      if (guideRefsMissing.length === 0) {
        checks.push(pass("catalog-stage-guides", "CATALOG references stage guides"));
      } else {
        checks.push(
          warn(
            "catalog-stage-guides",
            "CATALOG missing stage-guide references",
            `Missing: ${guideRefsMissing.join(", ")}`,
          ),
        );
      }
    }

    // WORK_UNIT.json must include the new per-stage fields
    const wuRaw = fileContent(files, "/WORK_UNIT.json");
    if (wuRaw) {
      try {
        const parsed = JSON.parse(wuRaw) as {
          stages: Array<Record<string, unknown>>;
        };
        const requiredKeys = [
          "entryCriteria",
          "procedure",
          "decisionRules",
          "qualityGate",
          "failureHandling",
          "nextStage",
        ];
        const missingPerStage: string[] = [];
        for (const s of parsed.stages ?? []) {
          for (const k of requiredKeys) {
            if (!(k in s))
              missingPerStage.push(`${String(s.id)}::${k}`);
          }
        }
        if (missingPerStage.length === 0) {
          checks.push(
            pass("work-unit-depth", "WORK_UNIT.json has full per-stage fields"),
          );
        } else {
          checks.push(
            fail(
              "work-unit-depth",
              "WORK_UNIT.json stage fields missing",
              `Missing: ${missingPerStage.slice(0, 5).join(", ")}${missingPerStage.length > 5 ? "…" : ""}`,
            ),
          );
        }
      } catch {
        // already handled by check 16
      }
    }

    // README package tree must mention the new top-level files / folders
    const readme = fileContent(files, "/README.md");
    if (readme) {
      const mustMention = [
        "CATALOG.md",
        "WORK_UNIT.json",
        "HOOKS.json",
        "checklists/",
        "tests/",
      ];
      const missingMentions = mustMention.filter((m) => !readme.includes(m));
      if (missingMentions.length === 0) {
        checks.push(pass("readme-tree", "README package tree is complete"));
      } else {
        checks.push(
          warn(
            "readme-tree",
            "README package tree missing entries",
            `Missing: ${missingMentions.join(", ")}`,
          ),
        );
      }
    }
  }

  // 20. Governance files (when tests/checklists required)
  if (required.tests) {
    if (!hasFile(files, "/tests/sandbox-test-scenario.md")) {
      checks.push(
        fail(
          "gov-sandbox",
          "Sandbox scenarios missing",
          "tests/sandbox-test-scenario.md is required.",
        ),
      );
    }
    if (!hasFile(files, "/tests/validation-log-template.md")) {
      checks.push(
        fail(
          "gov-validation-log",
          "Validation log missing",
          "tests/validation-log-template.md is required.",
        ),
      );
    }
  }
  if (required.checklists) {
    if (!hasFile(files, "/checklists/release-checklist.md")) {
      checks.push(
        fail(
          "gov-release",
          "Release checklist missing",
          "checklists/release-checklist.md is required.",
        ),
      );
    }
  }

  // 21. script-skill stubs
  if (includedTypes.includes("script-skill")) {
    const ok =
      hasFile(files, "/scripts/example-script.ts") &&
      hasFile(files, "/config/script-config.json");
    checks.push(
      ok
        ? pass("script-stubs", "script-skill stubs present")
        : fail(
            "script-stubs",
            "script-skill stubs missing",
            "Expected scripts/example-script.ts and config/script-config.json.",
          ),
    );
  }

  // 22. metadata-skill stubs
  if (includedTypes.includes("metadata-skill")) {
    const ok =
      hasFile(files, "/KIT_MANIFEST.json") &&
      hasFile(files, "/metadata/index.json");
    checks.push(
      ok
        ? pass("metadata-stubs", "metadata-skill stubs present")
        : fail(
            "metadata-stubs",
            "metadata-skill stubs missing",
            "Expected KIT_MANIFEST.json and metadata/index.json.",
          ),
    );
  }

  // 23. asset-skill stub
  if (includedTypes.includes("asset-skill")) {
    const ok = hasFile(files, "/assets/asset-index.md");
    checks.push(
      ok
        ? pass("asset-stubs", "asset-skill stub present")
        : fail(
            "asset-stubs",
            "asset-skill stub missing",
            "Expected assets/asset-index.md.",
          ),
    );
  }

  // 24. Tests/expected references must point at files this kit actually ships.
  // Walks every tests/expected/*.md and tests/scenarios/*.md and checks that
  // any backtick-wrapped `path/something.md` token resolves inside the kit.
  // Top-level filenames (SKILL.md, CATALOG.md, …) are always allowed.
  if (required.tests) {
    const testFiles = files.filter(
      (f) =>
        f.path.includes("/tests/scenarios/") ||
        f.path.includes("/tests/expected/"),
    );
    const presentSuffixes = new Set<string>();
    for (const f of files) {
      const parts = f.path.split("/");
      // last 1-3 path segments after the package root
      const rel = parts.slice(1).join("/");
      presentSuffixes.add(rel);
      const last = parts[parts.length - 1];
      presentSuffixes.add(last);
    }
    const phantom: string[] = [];
    for (const f of testFiles) {
      const refs = Array.from(
        f.content.matchAll(/`([a-z0-9_\-/.]+\.(?:md|json))`/gi),
      ).map((m) => m[1]);
      for (const r of refs) {
        // tolerate bare filenames + folder/file forms
        if (presentSuffixes.has(r)) continue;
        if (presentSuffixes.has(r.replace(/^[a-z]+\//, ""))) continue;
        phantom.push(`${f.fileName}: ${r}`);
      }
    }
    if (phantom.length === 0) {
      checks.push(
        pass(
          "tests-no-phantom-refs",
          "tests/expected references resolve",
        ),
      );
    } else {
      checks.push(
        warn(
          "tests-no-phantom-refs",
          "tests reference paths not in the kit",
          phantom.slice(0, 4).join("; ") + (phantom.length > 4 ? "…" : ""),
        ),
      );
    }
  }

  // 25. Non-full-step kits must not have tests whose positive instructions
  // (Expected route / Required outputs) reference hook-* / WORK_UNIT /
  // HOOKS / workflow stage routing. Mentions inside a "Forbidden" section
  // are fine — those are explicit "must NOT" instructions.
  if (
    required.tests &&
    !includedTypes.includes("full-step-skill")
  ) {
    const testFiles = files.filter(
      (f) =>
        f.path.includes("/tests/scenarios/") ||
        f.path.includes("/tests/expected/"),
    );
    const offenders: string[] = [];
    for (const f of testFiles) {
      // Trim the file content to everything BEFORE the "## Forbidden" section.
      const trimmed = f.content.split(/^##\s+Forbidden/m)[0];
      const STAGE_IDS =
        /`(?:requirement-intake|ux-foundation|ui-design-foundation|prototype-planning|review-validation|handoff)`/;
      if (
        /\bhook-[a-z-]+\b/.test(trimmed) ||
        /WORK_UNIT\.json/.test(trimmed) ||
        /HOOKS\.json/.test(trimmed) ||
        STAGE_IDS.test(trimmed)
      ) {
        offenders.push(f.fileName);
      }
    }
    if (offenders.length === 0) {
      checks.push(
        pass(
          "tests-no-workflow-refs",
          "non-full-step tests stay out of workflow routing",
        ),
      );
    } else {
      checks.push(
        warn(
          "tests-no-workflow-refs",
          "non-full-step tests reference hook / workflow routing",
          offenders.slice(0, 4).join(", "),
        ),
      );
    }
  }

  // 26. Reference-review preset must ship the design-review template.
  if (config.id === "axdd-ux-ui-reference-review") {
    const hasReviewTpl = hasFile(
      files,
      "/templates/design-review-template.md",
    );
    if (hasReviewTpl) {
      checks.push(
        pass("review-template", "Review template present"),
      );
    } else {
      checks.push(
        warn(
          "review-template",
          "Review template missing",
          "Reference-review kits should ship templates/design-review-template.md.",
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
