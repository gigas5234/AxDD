export type SkillCategory =
  | "ux-ui"
  | "product"
  | "frontend"
  | "design-system"
  | "research"
  | "content"
  | "data";

export type TargetAgent =
  | "generic"
  | "claude-code"
  | "cursor"
  | "codex"
  | "windsurf";

export type RoleLevel = "junior" | "mid" | "senior" | "expert";

export type WorkflowModule =
  | "problem-definition"
  | "user-flow"
  | "information-architecture"
  | "screen-design"
  | "component-breakdown"
  | "design-system-draft"
  | "figma-to-code"
  | "ux-review"
  | "accessibility-check"
  | "implementation-prompt";

export type CapabilityPack =
  | "design-taste"
  | "web-best-practices"
  | "theme-factory"
  | "tailwind-first"
  | "shadcn-affinity"
  | "mobile-patterns"
  | "extract-design-system"
  | "visual-composition";

export type QualityRule =
  | "avoid-vague-language"
  | "define-primary-action"
  | "include-information-hierarchy"
  | "include-screen-states"
  | "componentize-output"
  | "include-responsive-notes"
  | "include-accessibility"
  | "avoid-unnecessary-questions"
  | "avoid-overlong-chat-response";

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
