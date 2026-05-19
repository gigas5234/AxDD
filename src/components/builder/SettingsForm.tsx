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
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  UI,
  WORKFLOW_LABELS as WORKFLOW_I18N,
  QUALITY_LABELS as QUALITY_I18N,
  PACK_LABELS,
  ROLE_LEVEL_LABELS,
  ANSWER_STYLE_LABELS,
  TRANSLATION_MODE_LABELS,
} from "@/lib/i18n/strings";

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

const ALL_WORKFLOWS = Object.keys(WORKFLOW_I18N) as WorkflowModule[];
const ALL_RULES = Object.keys(QUALITY_I18N) as QualityRule[];

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
  const { locale } = useLocale();
  const [openSection, setOpenSection] = useState<string | null>("basic");

  // Compute hints shown next to closed section headers
  const focusWord = locale === "ko" ? "개 도메인" : "focus";
  const includedWord = locale === "ko" ? "포함" : "included";
  const hintRole = `${tr(ROLE_LEVEL_LABELS[config.roleProfile.roleLevel], locale)}, ${config.roleProfile.domainFocus.length} ${focusWord}`;
  const hintWorkflow = `${config.workflowModules.length}/${ALL_WORKFLOWS.length}`;
  const hintPacks = `${config.capabilityPacks.length}/${CAPABILITY_PACKS.length}`;
  const hintOutput = tr(ANSWER_STYLE_LABELS[config.outputFormat.answerStyle], locale);
  const hintRules = `${config.qualityRules.length}/${ALL_RULES.length}`;
  const langLabel =
    config.language.primaryLanguage === "ko"
      ? tr(UI.langKorean, locale)
      : tr(UI.langEnglish, locale);
  const hintLang = `${langLabel} · ${tr(TRANSLATION_MODE_LABELS[config.language.translationMode], locale)}`;
  const hintPkg = (() => {
    const o = config.packageOptions;
    const count = [
      o.includeSkillMd,
      o.includeReadme,
      o.includeReferences,
      o.includeTemplates,
      o.includeExamples,
    ].filter(Boolean).length;
    return `${count}/5 ${includedWord}`;
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
        title={tr(UI.secBasic, locale)}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label={tr(UI.fldSkillName, locale)}>
          <input
            className={inputCls}
            value={config.skillName}
            onChange={(e) => update("skillName", e.target.value)}
          />
        </Field>
        <Field label={tr(UI.fldPackageName, locale)}>
          <input
            className={inputCls}
            value={config.packageName}
            onChange={(e) => update("packageName", e.target.value)}
          />
        </Field>
        <Field label={tr(UI.fldDescription, locale)}>
          <textarea
            className={inputCls}
            rows={3}
            value={config.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <Field label={tr(UI.fldTargetAgent, locale)}>
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
        title={tr(UI.secRole, locale)}
        hint={hintRole}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label={tr(UI.fldRoleLevel, locale)}>
          <select
            className={inputCls}
            value={config.roleProfile.roleLevel}
            onChange={(e) => updateRole("roleLevel", e.target.value as RoleLevel)}
          >
            {ROLE_LEVELS.map((r) => (
              <option key={r} value={r}>
                {tr(ROLE_LEVEL_LABELS[r], locale)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tr(UI.fldDomainFocus, locale)}>
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
          label={tr(UI.fldImplAware, locale)}
          checked={config.roleProfile.implementationAwareness}
          onChange={(v) => updateRole("implementationAwareness", v)}
        />
        <Check
          label={tr(UI.fldDsAware, locale)}
          checked={config.roleProfile.designSystemAwareness}
          onChange={(v) => updateRole("designSystemAwareness", v)}
        />
        <Check
          label={tr(UI.fldBizAware, locale)}
          checked={config.roleProfile.businessAwareness}
          onChange={(v) => updateRole("businessAwareness", v)}
        />
      </Section>

      <Section
        id="workflow"
        title={tr(UI.secWorkflow, locale)}
        hint={hintWorkflow}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_WORKFLOWS.map((m) => (
            <Check
              key={m}
              label={tr(WORKFLOW_I18N[m], locale)}
              checked={config.workflowModules.includes(m)}
              onChange={() => toggleWorkflow(m)}
            />
          ))}
        </div>
      </Section>

      <Section
        id="packs"
        title={tr(UI.secPacks, locale)}
        hint={hintPacks}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <p className="text-fine-print text-ink-muted-48 leading-snug -mt-1">
          {tr(UI.packsIntro, locale)}
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
                    aria-label={tr(PACK_LABELS[pack.id].label, locale)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onInspect({ type: "capability-pack", id: pack.id })
                  }
                  className="flex-1 text-left py-2.5 pr-3 flex items-center gap-2 min-w-0"
                  title={tr(UI.inspShowDetails, locale)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-ink truncate">
                      {tr(PACK_LABELS[pack.id].label, locale)}
                    </div>
                    <div className="text-[12px] text-ink-muted-80 leading-snug truncate mt-0.5">
                      {tr(PACK_LABELS[pack.id].summary, locale)}
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
        title={tr(UI.secOutput, locale)}
        hint={hintOutput}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label={tr(UI.fldAnswerStyle, locale)}>
          <select
            className={inputCls}
            value={config.outputFormat.answerStyle}
            onChange={(e) =>
              updateOutput("answerStyle", e.target.value as AnswerStyle)
            }
          >
            {ANSWER_STYLES.map((a) => (
              <option key={a} value={a}>
                {tr(ANSWER_STYLE_LABELS[a], locale)}
              </option>
            ))}
          </select>
        </Field>
        <Check
          label={tr(UI.fldIncludeMd, locale)}
          checked={config.outputFormat.includeMarkdown}
          onChange={(v) => updateOutput("includeMarkdown", v)}
        />
        <Check
          label={tr(UI.fldIncludeJson, locale)}
          checked={config.outputFormat.includeJson}
          onChange={(v) => updateOutput("includeJson", v)}
        />
        <Check
          label={tr(UI.fldIncludeTables, locale)}
          checked={config.outputFormat.includeTables}
          onChange={(v) => updateOutput("includeTables", v)}
        />
        <Check
          label={tr(UI.fldIncludeCursor, locale)}
          checked={config.outputFormat.includeCursorPrompt}
          onChange={(v) => updateOutput("includeCursorPrompt", v)}
        />
        <Check
          label={tr(UI.fldIncludeChecks, locale)}
          checked={config.outputFormat.includeChecklists}
          onChange={(v) => updateOutput("includeChecklists", v)}
        />
        <Check
          label={tr(UI.fldIncludeExamples, locale)}
          checked={config.outputFormat.includeExamples}
          onChange={(v) => updateOutput("includeExamples", v)}
        />
      </Section>

      <Section
        id="rules"
        title={tr(UI.secRules, locale)}
        hint={hintRules}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_RULES.map((r) => (
            <Check
              key={r}
              label={tr(QUALITY_I18N[r], locale)}
              checked={config.qualityRules.includes(r)}
              onChange={() => toggleRule(r)}
            />
          ))}
        </div>
      </Section>

      <Section
        id="lang"
        title={tr(UI.secLanguage, locale)}
        hint={hintLang}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Field label={tr(UI.fldPrimaryLang, locale)}>
          <select
            className={inputCls}
            value={config.language.primaryLanguage}
            onChange={(e) =>
              updateLang("primaryLanguage", e.target.value as "en" | "ko")
            }
          >
            <option value="en">{tr(UI.langEnglish, locale)}</option>
            <option value="ko">{tr(UI.langKorean, locale)}</option>
          </select>
        </Field>
        <Field
          label={tr(UI.fldTranslationMode, locale)}
          hint={tr(UI.fldTranslationHint, locale)}
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
                {tr(TRANSLATION_MODE_LABELS[m], locale)}
              </option>
            ))}
          </select>
        </Field>
        <Check
          label={tr(UI.fldGenKoDefault, locale)}
          checked={config.language.generateKoreanByDefault}
          onChange={(v) => updateLang("generateKoreanByDefault", v)}
        />
      </Section>

      <Section
        id="pkg"
        title={tr(UI.secPackage, locale)}
        hint={hintPkg}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <Check
          label={tr(UI.fldIncSkillMd, locale)}
          checked={config.packageOptions.includeSkillMd}
          onChange={(v) => updatePkg("includeSkillMd", v)}
        />
        <Check
          label={tr(UI.fldIncReadme, locale)}
          checked={config.packageOptions.includeReadme}
          onChange={(v) => updatePkg("includeReadme", v)}
        />
        <Check
          label={tr(UI.fldIncReferences, locale)}
          checked={config.packageOptions.includeReferences}
          onChange={(v) => updatePkg("includeReferences", v)}
        />
        <Check
          label={tr(UI.fldIncTemplates, locale)}
          checked={config.packageOptions.includeTemplates}
          onChange={(v) => updatePkg("includeTemplates", v)}
        />
        <Check
          label={tr(UI.fldIncExamples, locale)}
          checked={config.packageOptions.includeExamples}
          onChange={(v) => updatePkg("includeExamples", v)}
        />
      </Section>
    </div>
  );
}
