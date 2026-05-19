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
import { runQualityChecks } from "./quality-checker";

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function file(
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

export function generatePackage(config: SkillConfig): GeneratedPackage {
  const pkg = config.packageName;
  const files: GeneratedFile[] = [];

  if (config.packageOptions.includeSkillMd) {
    files.push(
      file(
        pkg,
        `${pkg}/SKILL.md`,
        "SKILL.md",
        renderSkillMd(config),
        ["skill-md-template"],
      ),
    );
  }
  if (config.packageOptions.includeReadme) {
    files.push(
      file(
        pkg,
        `${pkg}/README.md`,
        "README.md",
        renderReadmeMd(config),
        ["readme-template"],
      ),
    );
  }
  if (config.packageOptions.includeReferences) {
    const refs = buildReferenceFiles({
      designSystemAwareness: config.roleProfile.designSystemAwareness,
      includeAccessibility: config.qualityRules.includes("include-accessibility"),
      capabilityPacks: config.capabilityPacks,
    });
    for (const r of refs) {
      files.push(
        file(
          pkg,
          `${pkg}/references/${r.fileName}`,
          r.fileName,
          r.content,
          r.generatedFrom,
        ),
      );
    }
  }
  if (config.packageOptions.includeTemplates) {
    const tpls = buildTemplateFiles({
      includeCursorPrompt: config.outputFormat.includeCursorPrompt,
    });
    for (const t of tpls) {
      files.push(
        file(
          pkg,
          `${pkg}/templates/${t.fileName}`,
          t.fileName,
          t.content,
          t.generatedFrom,
        ),
      );
    }
  }
  if (config.packageOptions.includeExamples) {
    const exs = buildExampleFiles();
    for (const ex of exs) {
      files.push(
        file(
          pkg,
          `${pkg}/examples/${ex.fileName}`,
          ex.fileName,
          ex.content,
          ex.generatedFrom,
        ),
      );
    }
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
