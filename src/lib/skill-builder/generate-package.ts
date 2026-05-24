import type {
  GeneratedFile,
  GeneratedPackage,
  SkillConfig,
} from "@/types/skill";
import { renderSkillMd } from "./templates/skill-md-template";
import { renderReadmeMd } from "./templates/readme-template";
import { buildReferenceFiles } from "./templates/references-templates";
import { buildTemplateFiles } from "./templates/templates-templates";
import { buildExampleFiles } from "./templates/examples-templates";
import { buildChecklistFiles } from "./templates/checklists-templates";
import { buildTestFiles } from "./templates/tests-templates";
import { buildStageGuideFiles } from "./templates/stage-guides-templates";
import { SKILL_FRAMEWORK_REFERENCE } from "./templates/skill-framework-template";
import { renderWorkUnitJson } from "./templates/work-unit-template";
import { renderHooksJson } from "./templates/hooks-template";
import { renderCatalogMd } from "./templates/catalog-md-template";
import { FIGMA_INSTRUCTION_TEMPLATE } from "./templates/figma-instruction-template";
import {
  buildScriptSkillFiles,
  buildMetadataSkillFiles,
  buildAssetSkillFiles,
} from "./templates/stubs-templates";
import {
  derivePrimaryKitStructure,
  mergeRequiredFiles,
} from "./package-matrix";
import { runQualityChecks } from "./quality-checker";

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function mdFile(
  pkg: string,
  path: string,
  fileName: string,
  content: string,
  generatedFrom: string[],
): GeneratedFile {
  return {
    id: makeId("file"),
    path,
    fileName,
    language: "markdown",
    content,
    isEdited: false,
    isGenerated: true,
    generatedFrom,
    lastGeneratedAt: new Date().toISOString(),
  };
}

function jsonFile(
  pkg: string,
  path: string,
  fileName: string,
  content: string,
  generatedFrom: string[],
): GeneratedFile {
  return {
    id: makeId("file"),
    path,
    fileName,
    language: "json",
    content,
    isEdited: false,
    isGenerated: true,
    generatedFrom,
    lastGeneratedAt: new Date().toISOString(),
  };
}

export function generatePackage(config: SkillConfig): GeneratedPackage {
  const pkg = config.packageName;
  // Merge required files across every included skill type. A type's
  // contribution may stack — e.g. reference-skill + test-skill brings
  // references/, checklists/, and tests/ together. Empty includedSkillTypes
  // falls back to the single packageType (back-compat for legacy configs).
  const includedTypes =
    config.includedSkillTypes.length > 0
      ? config.includedSkillTypes
      : [config.packageType];
  const required = mergeRequiredFiles(includedTypes);
  const opts = config.packageOptions;
  const files: GeneratedFile[] = [];

  // Matrix wins: a file is emitted if the merged matrix requires it OR the
  // user explicitly opted in. The matrix minimum cannot be turned off.
  const want = {
    skillMd: required.skillMd || opts.includeSkillMd,
    readmeMd: required.readmeMd || opts.includeReadme,
    catalogMd: required.catalogMd || opts.includeCatalogMd,
    workUnitJson: required.workUnitJson || opts.includeWorkUnitJson,
    hooksJson: required.hooksJson || opts.includeHooksJson,
    references: required.references || opts.includeReferences,
    templates: required.templates || opts.includeTemplates,
    checklists: required.checklists || opts.includeChecklists,
    tests: required.tests || opts.includeTests,
    examples: required.examples || opts.includeExamples,
    scripts: required.scripts,
    assets: required.assets,
    metadata: required.metadata,
  };
  // Keep config.packageType in sync with the merged inclusion set — callers
  // may pass a stale packageType (e.g. when the user toggles types in custom
  // mode and the local state hasn't recomputed yet).
  const primaryKitStructure = derivePrimaryKitStructure(includedTypes);
  if (config.packageType !== primaryKitStructure) {
    config = { ...config, packageType: primaryKitStructure };
  }

  if (want.skillMd) {
    files.push(
      mdFile(pkg, `${pkg}/SKILL.md`, "SKILL.md", renderSkillMd(config), [
        "skill-md-template",
      ]),
    );
  }

  if (want.readmeMd) {
    files.push(
      mdFile(pkg, `${pkg}/README.md`, "README.md", renderReadmeMd(config), [
        "readme-template",
      ]),
    );
  }

  if (want.references) {
    const refs = buildReferenceFiles({
      designSystemAwareness: config.roleProfile.designSystemAwareness,
      includeAccessibility:
        config.qualityRules.includes("include-accessibility"),
      capabilityPacks: config.capabilityPacks,
    });
    for (const r of refs) {
      files.push(
        mdFile(
          pkg,
          `${pkg}/references/${r.fileName}`,
          r.fileName,
          r.content,
          r.generatedFrom,
        ),
      );
    }
    // Per-stage deep guides — required for full-step kits.
    if (includedTypes.includes("full-step-skill")) {
      for (const g of buildStageGuideFiles()) {
        files.push(
          mdFile(
            pkg,
            `${pkg}/references/stage-guides/${g.fileName}`,
            g.fileName,
            g.content,
            g.generatedFrom,
          ),
        );
      }
      // AXDD 8-Type Skill Framework classification reference.
      files.push(
        mdFile(
          pkg,
          `${pkg}/references/skill-framework.md`,
          "skill-framework.md",
          SKILL_FRAMEWORK_REFERENCE,
          ["ref-skill-framework"],
        ),
      );
    }
  }

  if (want.templates) {
    const tpls = buildTemplateFiles({
      includeCursorPrompt: config.outputFormat.includeCursorPrompt,
    });
    for (const t of tpls) {
      files.push(
        mdFile(
          pkg,
          `${pkg}/templates/${t.fileName}`,
          t.fileName,
          t.content,
          t.generatedFrom,
        ),
      );
    }
    // Figma manual fallback — required for ux-ui kits.
    if (config.category === "ux-ui") {
      files.push(
        mdFile(
          pkg,
          `${pkg}/templates/figma-instruction-template.md`,
          "figma-instruction-template.md",
          FIGMA_INSTRUCTION_TEMPLATE,
          ["tpl-figma-instruction"],
        ),
      );
    }
  }

  if (want.checklists) {
    for (const c of buildChecklistFiles()) {
      files.push(
        mdFile(
          pkg,
          `${pkg}/checklists/${c.fileName}`,
          c.fileName,
          c.content,
          c.generatedFrom,
        ),
      );
    }
  }

  if (want.tests) {
    for (const t of buildTestFiles()) {
      const sub = t.subPath ? `${t.subPath}/` : "";
      files.push(
        mdFile(
          pkg,
          `${pkg}/tests/${sub}${t.fileName}`,
          t.fileName,
          t.content,
          t.generatedFrom,
        ),
      );
    }
  }

  if (want.examples) {
    for (const ex of buildExampleFiles()) {
      files.push(
        mdFile(
          pkg,
          `${pkg}/examples/${ex.fileName}`,
          ex.fileName,
          ex.content,
          ex.generatedFrom,
        ),
      );
    }
  }

  if (want.workUnitJson) {
    files.push(
      jsonFile(
        pkg,
        `${pkg}/WORK_UNIT.json`,
        "WORK_UNIT.json",
        renderWorkUnitJson(config),
        ["work-unit-template"],
      ),
    );
  }

  if (want.hooksJson) {
    files.push(
      jsonFile(
        pkg,
        `${pkg}/HOOKS.json`,
        "HOOKS.json",
        renderHooksJson(config),
        ["hooks-template"],
      ),
    );
  }

  // script-skill stubs → scripts/ + config/
  if (want.scripts) {
    for (const s of buildScriptSkillFiles()) {
      const folder = s.fileName.endsWith(".ts") ? "scripts" : "config";
      files.push({
        id: makeId("file"),
        path: `${pkg}/${folder}/${s.fileName}`,
        fileName: s.fileName,
        language: s.language,
        content: s.content,
        isEdited: false,
        isGenerated: true,
        generatedFrom: s.generatedFrom,
        lastGeneratedAt: new Date().toISOString(),
      });
    }
  }

  // asset-skill stub → assets/asset-index.md
  if (want.assets) {
    for (const a of buildAssetSkillFiles()) {
      files.push(
        mdFile(
          pkg,
          `${pkg}/assets/${a.fileName}`,
          a.fileName,
          a.content,
          a.generatedFrom,
        ),
      );
    }
  }

  // metadata-skill stubs → top-level KIT_MANIFEST.json + metadata/index.json
  if (want.metadata) {
    for (const m of buildMetadataSkillFiles()) {
      const path =
        m.fileName === "KIT_MANIFEST.json"
          ? `${pkg}/KIT_MANIFEST.json`
          : `${pkg}/metadata/${m.fileName}`;
      files.push({
        id: makeId("file"),
        path,
        fileName: m.fileName,
        language: m.language,
        content: m.content,
        isEdited: false,
        isGenerated: true,
        generatedFrom: m.generatedFrom,
        lastGeneratedAt: new Date().toISOString(),
      });
    }
  }

  // CATALOG.md is rendered last so it can see every other file in the kit.
  if (want.catalogMd) {
    files.push(
      mdFile(
        pkg,
        `${pkg}/CATALOG.md`,
        "CATALOG.md",
        renderCatalogMd(config, files),
        ["catalog-md-template"],
      ),
    );
  }

  const qualityReport = runQualityChecks(config, files);

  return {
    id: makeId("pkg"),
    packageName: pkg,
    config,
    files,
    qualityReport,
  };
}

export function regenerateFile(
  config: SkillConfig,
  filePath: string,
): GeneratedFile | null {
  const fresh = generatePackage(config);
  const found = fresh.files.find((f) => f.path === filePath);
  return found ?? null;
}
