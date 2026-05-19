"use client";

import { useState } from "react";
import type {
  AnswerStyle,
  CapabilityPack,
  QualityRule,
  RoleLevel,
  SkillConfig,
  TargetAgent,
  TranslationMode,
  WorkflowModule,
} from "@/types/skill";
import { CAPABILITY_PACKS } from "@/lib/skill-builder/blocks/capability-packs";
import type { InspectorTarget } from "./InspectorPanel";

const ROLE_LEVELS: RoleLevel[] = ["junior", "mid", "senior", "expert"];
const TARGET_AGENTS: TargetAgent[] = [
  "generic",
  "claude-code",
  "cursor",
  "codex",
  "windsurf",
];
const ANSWER_STYLES: AnswerStyle[] = ["concise", "structured", "detailed"];
const TRANSLATION_MODES: TranslationMode[] = [
  "none",
  "on-demand",
  "side-by-side",
  "cached",
];

const WORKFLOW_LABELS: Record<WorkflowModule, string> = {
  "problem-definition": "Problem Definition",
  "user-flow": "User Flow",
  "information-architecture": "Information Architecture",
  "screen-design": "Screen Design",
  "component-breakdown": "Component Breakdown",
  "design-system-draft": "Design System Draft",
  "figma-to-code": "Figma to Code",
  "ux-review": "UX Review",
  "accessibility-check": "Accessibility Check",
  "implementation-prompt": "Implementation Prompt",
};

const QUALITY_LABELS: Record<QualityRule, string> = {
  "avoid-vague-language": "Avoid vague language",
  "define-primary-action": "Define primary action",
  "include-information-hierarchy": "Include information hierarchy",
  "include-screen-states": "Include screen states",
  "componentize-output": "Componentize output",
  "include-responsive-notes": "Include responsive notes",
  "include-accessibility": "Include accessibility",
  "avoid-unnecessary-questions": "Avoid unnecessary questions",
  "avoid-overlong-chat-response": "Avoid overlong chat responses",
};

const ALL_WORKFLOWS = Object.keys(WORKFLOW_LABELS) as WorkflowModule[];
const ALL_RULES = Object.keys(QUALITY_LABELS) as QualityRule[];

function Section({
  id,
  title,
  hint,
  children,
  openSection,
  onToggleSection,
}: {
  id: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
  openSection: string | null;
  onToggleSection: (id: string | null) => void;
}) {
  const isOpen = openSection === id;
  return (
    <details
      className="border border-hairline rounded-lg bg-canvas overflow-hidden"
      open={isOpen}
      onToggle={(e) => {
        const nowOpen = e.currentTarget.open;
        if (nowOpen) onToggleSection(id);
        else if (openSection === id) onToggleSection(null);
      }}
    >
      <summary className="px-4 py-3 text-[14.5px] font-semibold text-ink cursor-pointer select-none hover:bg-divider-soft flex items-center gap-3">
        <span className="flex-1 truncate">{title}</span>
        {hint && (
          <span className="text-[12.5px] text-ink-muted-80 font-normal truncate">
            {hint}
          </span>
        )}
        <span className="text-ink-muted-48 text-caption">{isOpen ? "▾" : "▸"}</span>
      </summary>
      <div className="px-4 pb-4 pt-2 space-y-3 border-t border-divider-soft">
        {children}
      </div>
    </details>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-1.5">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-fine-print text-ink-muted-48 mt-1 leading-snug">
          {hint}
        </span>
      )}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 text-[14px] leading-relaxed text-ink cursor-pointer py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded-sm border-hairline accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

export type SettingsFormProps = {
  config: SkillConfig;
  onChange: (next: SkillConfig) => void;
  inspector: InspectorTarget;
  onInspect: (target: InspectorTarget) => void;
};

export function SettingsForm({
  config,
  onChange,
  inspector,
  onInspect,
}: SettingsFormProps) {
  const [openSection, setOpenSection] = useState<string | null>("basic");

  // Compute hints shown next to closed section headers
  const hintRole = `${config.roleProfile.roleLevel}, ${config.roleProfile.domainFocus.length} focus`;
  const hintWorkflow = `${config.workflowModules.length}/${ALL_WORKFLOWS.length}`;
  const hintPacks = `${config.capabilityPacks.length}/${CAPABILITY_PACKS.length}`;
  const hintOutput = config.outputFormat.answerStyle;
  const hintRules = `${config.qualityRules.length}/${ALL_RULES.length}`;
  const hintLang = `${config.language.primaryLanguage} · ${config.language.translationMode}`;
  const hintPkg = (() => {
    const o = config.packageOptions;
    const count = [
      o.includeSkillMd,
      o.includeReadme,
      o.includeReferences,
      o.includeTemplates,
      o.includeExamples,
    ].filter(Boolean).length;
    return `${count}/5 included`;
  })();
  function update<K extends keyof SkillConfig>(key: K, value: SkillConfig[K]) {
    onChange({ ...config, [key]: value, updatedAt: new Date().toISOString() });
  }

  function updateRole<K extends keyof SkillConfig["roleProfile"]>(
    key: K,
    value: SkillConfig["roleProfile"][K],
  ) {
    update("roleProfile", { ...config.roleProfile, [key]: value });
  }

  function updateOutput<K extends keyof SkillConfig["outputFormat"]>(
    key: K,
    value: SkillConfig["outputFormat"][K],
  ) {
    update("outputFormat", { ...config.outputFormat, [key]: value });
  }

  function updateLang<K extends keyof SkillConfig["language"]>(
    key: K,
    value: SkillConfig["language"][K],
  ) {
    update("language", { ...config.language, [key]: value });
  }

  function updatePkg<K extends keyof SkillConfig["packageOptions"]>(
    key: K,
    value: SkillConfig["packageOptions"][K],
  ) {
    update("packageOptions", { ...config.packageOptions, [key]: value });
  }

  function toggleWorkflow(m: WorkflowModule) {
    const has = config.workflowModules.includes(m);
    update(
      "workflowModules",
      has
        ? config.workflowModules.filter((x) => x !== m)
        : [...config.workflowModules, m],
    );
  }

  function toggleRule(r: QualityRule) {
    const has = config.qualityRules.includes(r);
    update(
      "qualityRules",
      has ? config.qualityRules.filter((x) => x !== r) : [...config.qualityRules, r],
    );
  }

  function togglePack(p: CapabilityPack) {
    const has = config.capabilityPacks.includes(p);
    update(
      "capabilityPacks",
      has
        ? config.capabilityPacks.filter((x) => x !== p)
        : [...config.capabilityPacks, p],
    );
  }

  const inputCls =
    "w-full rounded-sm border border-hairline px-2.5 py-1.5 text-caption bg-canvas text-ink focus:outline-none focus:border-primary-focus focus:ring-1 focus:ring-primary-focus";

  return (
    <div className="space-y-3">
      <Section
        id="basic"
        title="1. Basic Info"
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label="Skill name">
          <input
            className={inputCls}
            value={config.skillName}
            onChange={(e) => update("skillName", e.target.value)}
          />
        </Field>
        <Field label="Package name">
          <input
            className={inputCls}
            value={config.packageName}
            onChange={(e) => update("packageName", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={inputCls}
            rows={3}
            value={config.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <Field label="Target agent">
          <select
            className={inputCls}
            value={config.targetAgent}
            onChange={(e) => update("targetAgent", e.target.value as TargetAgent)}
          >
            {TARGET_AGENTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section
        id="role"
        title="2. Role Profile"
        hint={hintRole}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label="Role level">
          <select
            className={inputCls}
            value={config.roleProfile.roleLevel}
            onChange={(e) => updateRole("roleLevel", e.target.value as RoleLevel)}
          >
            {ROLE_LEVELS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Domain focus (comma separated)">
          <input
            className={inputCls}
            value={config.roleProfile.domainFocus.join(", ")}
            onChange={(e) =>
              updateRole(
                "domainFocus",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
        <Check
          label="Implementation awareness"
          checked={config.roleProfile.implementationAwareness}
          onChange={(v) => updateRole("implementationAwareness", v)}
        />
        <Check
          label="Design system awareness"
          checked={config.roleProfile.designSystemAwareness}
          onChange={(v) => updateRole("designSystemAwareness", v)}
        />
        <Check
          label="Business awareness"
          checked={config.roleProfile.businessAwareness}
          onChange={(v) => updateRole("businessAwareness", v)}
        />
      </Section>

      <Section
        id="workflow"
        title="3. Workflow Modules"
        hint={hintWorkflow}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_WORKFLOWS.map((m) => (
            <Check
              key={m}
              label={WORKFLOW_LABELS[m]}
              checked={config.workflowModules.includes(m)}
              onChange={() => toggleWorkflow(m)}
            />
          ))}
        </div>
      </Section>

      <Section
        id="packs"
        title="4. Capability Packs"
        hint={hintPacks}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <p className="text-fine-print text-ink-muted-48 leading-snug -mt-1">
          Optional skill flavors. Click a card to see its full effect on the
          right.
        </p>
        <div className="space-y-1.5">
          {CAPABILITY_PACKS.map((pack) => {
            const checked = config.capabilityPacks.includes(pack.id);
            const inspecting =
              inspector.type === "capability-pack" && inspector.id === pack.id;
            return (
              <div
                key={pack.id}
                className={`rounded-md border bg-canvas transition flex items-stretch overflow-hidden ${
                  inspecting
                    ? "border-ink"
                    : checked
                      ? "border-primary"
                      : "border-hairline hover:border-ink-muted-48"
                }`}
              >
                <label className="flex items-center pl-3 pr-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePack(pack.id)}
                    className="rounded-sm accent-primary"
                    aria-label={`Enable ${pack.label}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onInspect({ type: "capability-pack", id: pack.id })
                  }
                  className="flex-1 text-left py-2.5 pr-3 flex items-center gap-2 min-w-0"
                  title="Show details on the right"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-ink truncate">
                      {pack.label}
                    </div>
                    <div className="text-[12px] text-ink-muted-80 leading-snug truncate mt-0.5">
                      {pack.summary}
                    </div>
                  </div>
                  <span
                    className={`text-[14px] ${inspecting ? "text-ink" : "text-ink-muted-48"}`}
                  >
                    ▸
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        id="output"
        title="5. Output Format"
        hint={hintOutput}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label="Answer style">
          <select
            className={inputCls}
            value={config.outputFormat.answerStyle}
            onChange={(e) =>
              updateOutput("answerStyle", e.target.value as AnswerStyle)
            }
          >
            {ANSWER_STYLES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Check
          label="Include Markdown"
          checked={config.outputFormat.includeMarkdown}
          onChange={(v) => updateOutput("includeMarkdown", v)}
        />
        <Check
          label="Include JSON"
          checked={config.outputFormat.includeJson}
          onChange={(v) => updateOutput("includeJson", v)}
        />
        <Check
          label="Include tables"
          checked={config.outputFormat.includeTables}
          onChange={(v) => updateOutput("includeTables", v)}
        />
        <Check
          label="Include Cursor prompt"
          checked={config.outputFormat.includeCursorPrompt}
          onChange={(v) => updateOutput("includeCursorPrompt", v)}
        />
        <Check
          label="Include checklists"
          checked={config.outputFormat.includeChecklists}
          onChange={(v) => updateOutput("includeChecklists", v)}
        />
        <Check
          label="Include examples"
          checked={config.outputFormat.includeExamples}
          onChange={(v) => updateOutput("includeExamples", v)}
        />
      </Section>

      <Section
        id="rules"
        title="6. Quality Rules"
        hint={hintRules}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_RULES.map((r) => (
            <Check
              key={r}
              label={QUALITY_LABELS[r]}
              checked={config.qualityRules.includes(r)}
              onChange={() => toggleRule(r)}
            />
          ))}
        </div>
      </Section>

      <Section
        id="lang"
        title="7. Language"
        hint={hintLang}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label="Primary language">
          <select
            className={inputCls}
            value={config.language.primaryLanguage}
            onChange={(e) =>
              updateLang("primaryLanguage", e.target.value as "en" | "ko")
            }
          >
            <option value="en">English</option>
            <option value="ko">Korean</option>
          </select>
        </Field>
        <Field
          label="Translation mode"
          hint="Korean translation is mocked in the MVP — see Korean tab in the preview."
        >
          <select
            className={inputCls}
            value={config.language.translationMode}
            onChange={(e) =>
              updateLang("translationMode", e.target.value as TranslationMode)
            }
          >
            {TRANSLATION_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Check
          label="Generate Korean by default"
          checked={config.language.generateKoreanByDefault}
          onChange={(v) => updateLang("generateKoreanByDefault", v)}
        />
      </Section>

      <Section
        id="pkg"
        title="8. Package Options"
        hint={hintPkg}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Check
          label="Include SKILL.md"
          checked={config.packageOptions.includeSkillMd}
          onChange={(v) => updatePkg("includeSkillMd", v)}
        />
        <Check
          label="Include README.md"
          checked={config.packageOptions.includeReadme}
          onChange={(v) => updatePkg("includeReadme", v)}
        />
        <Check
          label="Include references/"
          checked={config.packageOptions.includeReferences}
          onChange={(v) => updatePkg("includeReferences", v)}
        />
        <Check
          label="Include templates/"
          checked={config.packageOptions.includeTemplates}
          onChange={(v) => updatePkg("includeTemplates", v)}
        />
        <Check
          label="Include examples/"
          checked={config.packageOptions.includeExamples}
          onChange={(v) => updatePkg("includeExamples", v)}
        />
      </Section>
    </div>
  );
}
