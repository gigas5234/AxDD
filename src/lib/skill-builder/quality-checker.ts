import type {
  GeneratedFile,
  QualityCheck,
  QualityReport,
  SkillConfig,
} from "@/types/skill";

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

export function runQualityChecks(
  config: SkillConfig,
  files: GeneratedFile[],
): QualityReport {
  const checks: QualityCheck[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const skillMd = fileContent(files, "SKILL.md");

  // Name
  if (config.skillName && config.skillName.trim().length >= 3) {
    checks.push(pass("name", "Skill has a clear name"));
  } else {
    checks.push(fail("name", "Skill name", "Skill name is missing or too short."));
  }

  // Description
  if (config.description && config.description.trim().length >= 20) {
    checks.push(pass("description", "Skill description is descriptive enough"));
  } else if (config.description && config.description.trim().length > 0) {
    checks.push(
      warn(
        "description",
        "Skill description",
        "Description is short — consider adding when-to-use context.",
      ),
    );
    warnings.push("The skill description is too generic.");
  } else {
    checks.push(fail("description", "Skill description", "Description is missing."));
  }

  // When to use
  if (skillMd.includes("When to use this skill")) {
    checks.push(pass("when-to-use", "Skill defines when to use it"));
  } else {
    checks.push(
      fail("when-to-use", "When-to-use section", "SKILL.md does not declare when to use this skill."),
    );
  }

  // Role
  if (skillMd.includes("## Role")) {
    checks.push(pass("role", "Skill defines a role"));
  } else {
    checks.push(fail("role", "Role section", "SKILL.md does not define a role."));
  }

  // Workflow
  if (config.workflowModules.length >= 3) {
    checks.push(pass("workflow", "Skill defines workflow steps"));
  } else if (config.workflowModules.length > 0) {
    checks.push(
      warn(
        "workflow",
        "Workflow steps",
        "Few workflow modules selected — the skill may feel thin.",
      ),
    );
  } else {
    checks.push(
      fail("workflow", "Workflow steps", "No workflow modules selected."),
    );
  }
  if (config.workflowModules.length > 9) {
    warnings.push("The workflow has many modules; consider trimming for a beginner preset.");
  }

  // Output formats
  if (
    config.outputFormat.includeMarkdown ||
    config.outputFormat.includeJson ||
    config.outputFormat.includeTables ||
    config.outputFormat.includeChecklists
  ) {
    checks.push(pass("output", "Skill defines output formats"));
  } else {
    checks.push(
      fail("output", "Output formats", "No output formats are enabled."),
    );
  }

  // Quality rules
  if (config.qualityRules.length >= 3) {
    checks.push(pass("quality-rules", "Skill includes quality rules"));
  } else {
    checks.push(
      warn(
        "quality-rules",
        "Quality rules",
        "Few quality rules selected — consider enabling more.",
      ),
    );
  }

  // What not to do
  if (
    config.qualityRules.includes("avoid-vague-language") ||
    config.qualityRules.includes("avoid-unnecessary-questions") ||
    config.qualityRules.includes("avoid-overlong-chat-response")
  ) {
    checks.push(pass("what-not-to-do", "Skill includes 'what not to do' guidance"));
  } else {
    checks.push(
      warn(
        "what-not-to-do",
        "What not to do",
        "No 'avoid' rules selected — the skill is silent on what NOT to do.",
      ),
    );
  }

  // README
  if (config.packageOptions.includeReadme && hasFile(files, "README.md")) {
    checks.push(pass("readme", "Package includes README.md"));
  } else {
    checks.push(
      warn("readme", "README", "README.md is not included in this package."),
    );
  }

  // Templates
  if (config.packageOptions.includeTemplates) {
    const anyTemplate = files.some((f) => f.path.includes("/templates/"));
    if (anyTemplate) {
      checks.push(pass("templates", "Templates included"));
    } else {
      checks.push(
        fail("templates", "Templates", "Template option enabled but no template files produced."),
      );
    }
  }

  // References
  if (config.packageOptions.includeReferences) {
    const anyRef = files.some((f) => f.path.includes("/references/"));
    if (anyRef) {
      checks.push(pass("references", "References included"));
    } else {
      checks.push(
        fail("references", "References", "References option enabled but no reference files produced."),
      );
    }
  }

  // Conflicting rules
  if (
    config.outputFormat.includeCursorPrompt &&
    !config.roleProfile.implementationAwareness
  ) {
    warnings.push(
      "Cursor prompt template is enabled, but implementation awareness is disabled.",
    );
  }
  if (
    config.language.generateKoreanByDefault &&
    config.language.translationMode === "none"
  ) {
    warnings.push(
      "Korean-by-default is on but translationMode is 'none' — these settings conflict.",
    );
  }

  // Suggestions
  if (!config.qualityRules.includes("include-accessibility")) {
    suggestions.push("Accessibility rules are disabled. Consider enabling them for UX/UI skills.");
  }
  if (config.language.translationMode === "side-by-side") {
    suggestions.push(
      "Side-by-side translation increases token usage. Consider 'on-demand' for the MVP.",
    );
  }
  if (!config.outputFormat.includeExamples) {
    suggestions.push("Including examples helps the agent produce concrete outputs faster.");
  }

  const passCount = checks.filter((c) => c.status === "pass").length;
  const totalScore =
    checks.length === 0 ? 0 : Math.round((passCount / checks.length) * 100);

  return {
    totalScore,
    checks,
    warnings,
    suggestions,
  };
}
