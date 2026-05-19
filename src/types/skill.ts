export type SkillCategory =
  | "ux-ui"
  | "product"
  | "frontend"
  | "design-system"
  | "research"
  | "content"
  | "data"
  | "harness";

export type TargetAgent =
  | "generic"
  | "claude-code"
  | "cursor"
  | "codex"
  | "windsurf";

export type RoleLevel = "junior" | "mid" | "senior" | "expert";

export type WorkflowModule =
  // UX/UI Designer
  | "problem-definition"
  | "user-flow"
  | "information-architecture"
  | "screen-design"
  | "component-breakdown"
  | "design-system-draft"
  | "figma-to-code"
  | "ux-review"
  | "accessibility-check"
  | "implementation-prompt"
  // Frontend Implementation
  | "code-architecture"
  | "component-implementation"
  | "state-management"
  | "routing-strategy"
  | "performance-budget"
  | "accessibility-implementation"
  // Design System Generator
  | "token-system"
  | "primitive-design"
  | "variant-system"
  | "documentation-strategy"
  | "migration-plan"
  // Harness Setup
  | "harness-target-selection"
  | "harness-permissions"
  | "harness-hooks"
  | "harness-install-flow";

export type CapabilityPack =
  // Cross-category (mostly UX/UI but reusable)
  | "design-taste"
  | "web-best-practices"
  | "theme-factory"
  | "tailwind-first"
  | "shadcn-affinity"
  | "mobile-patterns"
  | "extract-design-system"
  | "visual-composition"
  // Frontend Implementation
  | "react-patterns"
  | "typescript-strict"
  | "testing-discipline"
  // Harness Setup
  | "claude-code-target"
  | "cursor-target"
  | "codex-target";

export type QualityRule =
  // Universal (any category)
  | "avoid-vague-language"
  | "avoid-unnecessary-questions"
  | "avoid-overlong-chat-response"
  // UX/UI Designer
  | "define-primary-action"
  | "include-information-hierarchy"
  | "include-screen-states"
  | "componentize-output"
  | "include-responsive-notes"
  | "include-accessibility"
  // Frontend Implementation
  | "fe-no-any"
  | "fe-compose-over-branch"
  | "fe-test-users-not-impl"
  | "fe-semantic-html-first"
  | "fe-perf-budget"
  | "fe-state-colocation"
  // Design System Generator
  | "ds-semantic-tokens"
  | "ds-no-business-in-primitive"
  | "ds-variants-cap-5"
  | "ds-states-4tuple"
  | "ds-doc-canonical-usage";

export type AnswerStyle = "concise" | "structured" | "detailed";
export type TranslationMode = "none" | "on-demand" | "side-by-side" | "cached";
export type ExportFormat = "zip" | "single-md" | "clipboard";

export type RoleProfileSettings = {
  roleLevel: RoleLevel;
  domainFocus: string[];
  implementationAwareness: boolean;
  designSystemAwareness: boolean;
  businessAwareness: boolean;
};

export type OutputFormatSettings = {
  answerStyle: AnswerStyle;
  includeMarkdown: boolean;
  includeJson: boolean;
  includeTables: boolean;
  includeCursorPrompt: boolean;
  includeChecklists: boolean;
  includeExamples: boolean;
};

export type LanguageSettings = {
  primaryLanguage: "en" | "ko";
  previewLanguages: ("en" | "ko")[];
  generateKoreanByDefault: boolean;
  translationMode: TranslationMode;
};

export type PackageOptions = {
  includeSkillMd: boolean;
  includeReadme: boolean;
  includeReferences: boolean;
  includeTemplates: boolean;
  includeExamples: boolean;
  exportFormat: ExportFormat;
};

export type CustomExample = {
  title: string;
  input: string;
  expectedOutput: string;
};

export type SkillConfig = {
  id: string;
  skillName: string;
  packageName: string;
  description: string;
  category: SkillCategory;
  targetAgent: TargetAgent;
  roleProfile: RoleProfileSettings;
  workflowModules: WorkflowModule[];
  capabilityPacks: CapabilityPack[];
  outputFormat: OutputFormatSettings;
  qualityRules: QualityRule[];
  language: LanguageSettings;
  packageOptions: PackageOptions;
  customInstructions?: string;
  customExamples?: CustomExample[];
  createdAt: string;
  updatedAt: string;
};

export type GeneratedFile = {
  id: string;
  path: string;
  fileName: string;
  language: "markdown" | "json" | "text";
  content: string;
  translatedContent?: string;
  isEdited: boolean;
  isGenerated: boolean;
  generatedFrom: string[];
  lastGeneratedAt: string;
};

export type QualityCheck = {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail";
  message: string;
};

export type QualityReport = {
  totalScore: number;
  checks: QualityCheck[];
  warnings: string[];
  suggestions: string[];
};

export type GeneratedPackage = {
  id: string;
  packageName: string;
  config: SkillConfig;
  files: GeneratedFile[];
  qualityReport: QualityReport;
};

export type SkillBlock = {
  id: string;
  category: "role" | "workflow" | "output" | "rule" | "reference" | "template";
  title: string;
  description: string;
  content: string;
  dependencies?: string[];
  conflicts?: string[];
};
