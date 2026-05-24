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
import { REQUIRED_FILES_BY_TYPE } from "./package-matrix";
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
  const required = REQUIRED_FILES_BY_TYPE[config.packageType];
  const opts = config.packageOptions;
  const files: GeneratedFile[] = [];

  // Matrix wins: a file is emitted if the matrix requires it OR the user
  // explicitly opted in. The matrix minimum cannot be turned off.
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
  };

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
    if (config.packageType === "full-step-skill") {
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
      files.push(
        mdFile(
          pkg,
          `${pkg}/tests/${t.fileName}`,
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
