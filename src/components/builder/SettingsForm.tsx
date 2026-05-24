"use client";

import { useState } from "react";
import type {
  AnswerStyle,
  CapabilityPack,
  QualityRule,
  RoleLevel,
  SkillConfig,
  SkillPackageType,
  TargetAgent,
  TranslationMode,
  WorkflowModule,
} from "@/types/skill";
import {
  CAPABILITY_PACKS,
  PACKS_BY_CATEGORY,
} from "@/lib/skill-builder/blocks/capability-packs";
import { WORKFLOW_BY_CATEGORY } from "@/lib/skill-builder/blocks/workflow-blocks";
import { RULES_BY_CATEGORY } from "@/lib/skill-builder/blocks/rule-blocks";
import {
  checkDependencies,
  packHasUnmetDeps,
  workflowHasUnmetDeps,
} from "@/lib/skill-builder/dependencies";
import type { InspectorTarget } from "./InspectorPanel";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  UI,
  WORKFLOW_LABELS as WORKFLOW_I18N,
  WORKFLOW_STAGE_LABELS,
  QUALITY_LABELS as QUALITY_I18N,
  PACK_LABELS,
  ROLE_LEVEL_LABELS,
  ANSWER_STYLE_LABELS,
  TRANSLATION_MODE_LABELS,
  SKILL_PACKAGE_TYPE_LABELS,
} from "@/lib/i18n/strings";
import {
  REQUIRED_FILES_BY_TYPE,
  ALL_STAGES,
  STAGE_METADATA,
} from "@/lib/skill-builder/package-matrix";

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
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2.5 text-[14px] leading-relaxed text-ink py-0.5 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
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

  // Category-scoped workflow modules, capability packs, and quality rules
  const categoryWorkflows = WORKFLOW_BY_CATEGORY[config.category] ?? [];
  const categoryPackIds = PACKS_BY_CATEGORY[config.category] ?? [];
  const categoryPacks = CAPABILITY_PACKS.filter((p) =>
    categoryPackIds.includes(p.id),
  );
  const categoryRules = RULES_BY_CATEGORY[config.category] ?? [];

  // Live dependency violations across the current config
  const violations = checkDependencies(config);

  // Compute hints shown next to closed section headers
  const focusWord = locale === "ko" ? "개 도메인" : "focus";
  const includedWord = locale === "ko" ? "포함" : "included";
  const hintRole = `${tr(ROLE_LEVEL_LABELS[config.roleProfile.roleLevel], locale)}, ${config.roleProfile.domainFocus.length} ${focusWord}`;
  const hintWorkflow = `${config.workflowModules.length}/${categoryWorkflows.length || ALL_WORKFLOWS.length}`;
  const hintPacks = `${config.capabilityPacks.length}/${categoryPacks.length || CAPABILITY_PACKS.length}`;
  const hintOutput = tr(ANSWER_STYLE_LABELS[config.outputFormat.answerStyle], locale);
  const hintRules = `${config.qualityRules.length}/${categoryRules.length || ALL_RULES.length}`;
  const langLabel =
    config.language.primaryLanguage === "ko"
      ? tr(UI.langKorean, locale)
      : tr(UI.langEnglish, locale);
  const hintLang = `${langLabel} · ${tr(TRANSLATION_MODE_LABELS[config.language.translationMode], locale)}`;
  const isFullStep = config.packageType === "full-step-skill";
  const hintPkg = (() => {
    const o = config.packageOptions;
    if (isFullStep) {
      const flags = [
        o.includeSkillMd,
        o.includeCatalogMd,
        o.includeReadme,
        o.includeWorkUnitJson,
        o.includeHooksJson,
        o.includeReferences,
        o.includeTemplates,
        o.includeChecklists,
        o.includeTests,
        o.includeExamples,
      ];
      const count = flags.filter(Boolean).length;
      return `${count}/${flags.length} ${includedWord}`;
    }
    const count = [
      o.includeSkillMd,
      o.includeReadme,
      o.includeReferences,
      o.includeTemplates,
      o.includeExamples,
    ].filter(Boolean).length;
    return `${count}/5 ${includedWord}`;
  })();
  const hintWorkflowStages = `${
    (config.workflowStages.length || ALL_STAGES.length)
  }/${ALL_STAGES.length}`;
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

  const allPackageTypes: SkillPackageType[] = [
    "simple-skill",
    "reference-skill",
    "template-skill",
    "script-skill",
    "asset-skill",
    "full-step-skill",
    "metadata-skill",
    "test-skill",
  ];
  const hintPkgType = tr(
    SKILL_PACKAGE_TYPE_LABELS[config.packageType].name,
    locale,
  );

  return (
    <div className="space-y-3">
      <Section
        id="pkgtype"
        title={tr(UI.secSkillPackageType, locale)}
        hint={hintPkgType}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <p className="text-fine-print text-ink-muted-48 leading-snug -mt-1">
          {tr(UI.skillPackageTypeIntro, locale)}
        </p>
        {(() => {
          // v0.1.2: Primary Kit Structure is auto-selected by the preset.
          // The four "available" types reflect what current presets can drive;
          // the rest stay tagged as roadmap. All cards are read-only here —
          // the user changes Primary Kit Structure by choosing a preset.
          const availableTypes: SkillPackageType[] = [
            "full-step-skill",
            "reference-skill",
            "template-skill",
            "test-skill",
          ];
          const comingSoonTypes: SkillPackageType[] = allPackageTypes.filter(
            (pt) => !availableTypes.includes(pt),
          );

          const renderCard = (pt: SkillPackageType, isEnabled: boolean) => {
            const meta = SKILL_PACKAGE_TYPE_LABELS[pt];
            const selected = config.packageType === pt;
            return (
              <div
                key={pt}
                role="radio"
                aria-checked={selected}
                aria-disabled
                className={`rounded-md border p-3 transition flex items-start gap-2.5 cursor-default ${
                  selected
                    ? "border-primary bg-primary/5"
                    : isEnabled
                      ? "border-hairline bg-canvas"
                      : "border-hairline border-dashed bg-canvas-parchment"
                }`}
                title={
                  isEnabled
                    ? undefined
                    : tr(UI.skillPackageTypeComingSoon, locale)
                }
              >
                <input
                  type="radio"
                  name="skill-package-type"
                  className="mt-1 accent-primary"
                  checked={selected}
                  disabled
                  readOnly
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] font-semibold text-ink">
                      {tr(meta.name, locale)}
                    </span>
                    <span className="text-[10.5px] font-mono text-ink-muted-80">
                      {pt}
                    </span>
                    {!isEnabled && (
                      <span className="text-[10.5px] uppercase tracking-wide text-ink-muted-80 bg-divider-soft border border-hairline rounded-sm px-1.5 py-[1px]">
                        {tr(UI.skillPackageTypeComingSoon, locale)}
                      </span>
                    )}
                  </div>
                  <div className="text-[12.5px] text-ink-muted-80 mt-0.5">
                    {tr(meta.tagline, locale)}
                  </div>
                  <div className="text-[11px] text-ink-muted-80 mt-1 font-mono leading-snug break-words">
                    <span className="not-italic">Required:</span> {meta.required}
                  </div>
                  {selected && (
                    <div className="mt-2 text-[11.5px] text-ink-muted-80 leading-snug border-l-2 border-primary/40 pl-2">
                      {tr(
                        pt === "full-step-skill"
                          ? UI.fullStepWhyThisKit
                          : pt === "reference-skill"
                            ? UI.referenceWhyThisKit
                            : pt === "template-skill"
                              ? UI.templateWhyThisKit
                              : pt === "test-skill"
                                ? UI.testWhyThisKit
                                : UI.skillPackageTypeIntro,
                        locale,
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          };

          const subHeader = (label: string) => (
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-80 font-medium mt-1">
              {label}
            </div>
          );

          return (
            <div role="radiogroup" className="space-y-3">
              <div className="space-y-1.5">
                {subHeader(tr(UI.skillPackageTypeAvailable, locale))}
                <div className="grid grid-cols-1 gap-2">
                  {availableTypes.map((pt) => renderCard(pt, true))}
                </div>
              </div>

              <div className="space-y-1.5">
                {subHeader(tr(UI.skillPackageTypeComingSoon, locale))}
                <p className="text-fine-print text-ink-muted-80 leading-snug">
                  {tr(UI.skillPackageTypeRoadmapHelper, locale)}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {comingSoonTypes.map((pt) => renderCard(pt, false))}
                </div>
              </div>
            </div>
          );
        })()}
      </Section>

      <Section
        id="included-types"
        title={tr(UI.secIncludedSkillTypes, locale)}
        hint={`${config.includedSkillTypes.length} / 8`}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        <p className="text-fine-print text-ink-muted-80 leading-snug -mt-1">
          {tr(UI.includedSkillTypesIntro, locale)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {config.includedSkillTypes.map((pt) => {
            const meta = SKILL_PACKAGE_TYPE_LABELS[pt];
            const isPrimary = pt === config.packageType;
            return (
              <span
                key={pt}
                title={tr(meta.tagline, locale)}
                className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-[3px] text-[12px] ${
                  isPrimary
                    ? "border-primary bg-primary/10 text-ink"
                    : "border-hairline bg-canvas text-ink"
                }`}
              >
                <span className="font-medium">{tr(meta.name, locale)}</span>
                <span className="font-mono text-[10.5px] text-ink-muted-80">
                  {pt}
                </span>
                {isPrimary && (
                  <span className="text-[9.5px] uppercase tracking-wide text-primary border border-primary/40 rounded-sm px-1 leading-none py-[1px]">
                    {tr(UI.includedSkillTypesPrimaryBadge, locale)}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </Section>

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

      {isFullStep ? (
        <Section
          id="workflow"
          title={tr(UI.secWorkflowStages, locale)}
          hint={hintWorkflowStages}
          openSection={openSection}
          onToggleSection={setOpenSection}
        >
          <p className="text-fine-print text-ink-muted-48 leading-snug -mt-1">
            {tr(UI.workflowStagesIntro, locale)}
          </p>
          <ol className="space-y-1.5">
            {ALL_STAGES.map((id) => {
              const meta = STAGE_METADATA[id];
              return (
                <li
                  key={id}
                  className="flex items-start gap-2 text-[13.5px] text-ink"
                  title={meta.purpose}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-ink/5 text-ink-muted-80 text-[11px] font-mono">
                    {meta.order}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {tr(WORKFLOW_STAGE_LABELS[id], locale)}
                    </div>
                    <div className="text-[11.5px] text-ink-muted-48 font-mono truncate">
                      {id}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>
      ) : (
        <Section
          id="workflow"
          title={tr(UI.secWorkflow, locale)}
          hint={hintWorkflow}
          openSection={openSection}
          onToggleSection={setOpenSection}
        >
          <div className="grid grid-cols-1 gap-1.5">
            {(categoryWorkflows.length > 0 ? categoryWorkflows : ALL_WORKFLOWS).map(
              (m) => {
                const hasViolation = workflowHasUnmetDeps(violations, m);
                return (
                  <div key={m} className="flex items-center gap-2">
                    <Check
                      label={tr(WORKFLOW_I18N[m], locale)}
                      checked={config.workflowModules.includes(m)}
                      onChange={() => toggleWorkflow(m)}
                    />
                    {hasViolation && (
                      <span
                        className="text-[11px] text-primary font-medium"
                        title={tr(UI.depsUnmet, locale)}
                      >
                        ⚠
                      </span>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </Section>
      )}

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
        <p className="text-fine-print text-ink-muted-80 leading-snug -mt-1.5 italic">
          {tr(UI.addonsHelper, locale)}
        </p>
        <div className="space-y-1.5">
          {(categoryPacks.length > 0 ? categoryPacks : CAPABILITY_PACKS).map((pack) => {
            const checked = config.capabilityPacks.includes(pack.id);
            const inspecting =
              inspector.type === "capability-pack" && inspector.id === pack.id;
            const hasViolation = packHasUnmetDeps(violations, pack.id);
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
                    <div className="text-[14px] font-semibold text-ink truncate flex items-center gap-1.5">
                      {tr(PACK_LABELS[pack.id].label, locale)}
                      {hasViolation && (
                        <span
                          className="text-[11px] text-primary"
                          title={tr(UI.depsUnmet, locale)}
                        >
                          ⚠
                        </span>
                      )}
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
          {(categoryRules.length > 0 ? categoryRules : ALL_RULES).map((r) => (
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
          label={`${tr(UI.fldTranslationMode, locale)} — Phase 2 (coming soon)`}
          hint={tr(UI.fldTranslationHint, locale)}
        >
          <select
            className={inputCls}
            value={config.language.translationMode}
            onChange={(e) =>
              updateLang("translationMode", e.target.value as TranslationMode)
            }
            disabled
            title="AI translation is a Phase 2 feature. The MVP is fully static and deterministic."
          >
            {TRANSLATION_MODES.map((m) => (
              <option key={m} value={m}>
                {tr(TRANSLATION_MODE_LABELS[m], locale)}
              </option>
            ))}
          </select>
        </Field>
        <Check
          label={`${tr(UI.fldGenKoDefault, locale)} — Phase 2 (coming soon)`}
          checked={config.language.generateKoreanByDefault}
          onChange={(v) => updateLang("generateKoreanByDefault", v)}
          disabled
        />
      </Section>

      <Section
        id="pkg"
        title={tr(
          config.packageType === "full-step-skill"
            ? UI.secStandardKitFiles
            : config.packageType === "reference-skill"
              ? UI.secReferenceSkillFiles
              : config.packageType === "test-skill"
                ? UI.secTestSkillFiles
                : UI.secPackage,
          locale,
        )}
        hint={hintPkg}
        openSection={openSection}
        onToggleSection={setOpenSection}
      >
        {(() => {
          const required = REQUIRED_FILES_BY_TYPE[config.packageType];
          const lockedLabel = tr(UI.fldLockedRequired, locale);
          type Row = {
            label: string;
            requiredKey: keyof typeof required;
            optionKey: keyof SkillConfig["packageOptions"];
          };
          const useMatrixView = config.packageType !== "simple-skill";
          const rows: Row[] = useMatrixView
            ? [
                { label: tr(UI.fldIncSkillMd, locale), requiredKey: "skillMd", optionKey: "includeSkillMd" },
                { label: tr(UI.fldIncCatalog, locale), requiredKey: "catalogMd", optionKey: "includeCatalogMd" },
                { label: tr(UI.fldIncReadme, locale), requiredKey: "readmeMd", optionKey: "includeReadme" },
                { label: tr(UI.fldIncWorkUnit, locale), requiredKey: "workUnitJson", optionKey: "includeWorkUnitJson" },
                { label: tr(UI.fldIncHooks, locale), requiredKey: "hooksJson", optionKey: "includeHooksJson" },
                { label: tr(UI.fldIncReferences, locale), requiredKey: "references", optionKey: "includeReferences" },
                { label: tr(UI.fldIncTemplates, locale), requiredKey: "templates", optionKey: "includeTemplates" },
                { label: tr(UI.fldIncChecklists, locale), requiredKey: "checklists", optionKey: "includeChecklists" },
                { label: tr(UI.fldIncTests, locale), requiredKey: "tests", optionKey: "includeTests" },
                { label: tr(UI.fldIncExamples, locale), requiredKey: "examples", optionKey: "includeExamples" },
              ]
            : [
                { label: tr(UI.fldIncSkillMd, locale), requiredKey: "skillMd", optionKey: "includeSkillMd" },
              ];
          return (
            <div className="space-y-1">
              {rows.map((r) => {
                const isRequired = required[r.requiredKey];
                const isChecked = isRequired
                  ? true
                  : Boolean(config.packageOptions[r.optionKey]);
                return (
                  <div key={String(r.optionKey)} className="flex items-center gap-2">
                    <Check
                      label={r.label}
                      checked={isChecked}
                      onChange={(v) =>
                        !isRequired &&
                        updatePkg(r.optionKey, v as never)
                      }
                      disabled={isRequired}
                    />
                    {isRequired && (
                      <span
                        className="text-[10.5px] uppercase tracking-wide text-ink-muted-48"
                        title={lockedLabel}
                      >
                        🔒 {lockedLabel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Section>
    </div>
  );
}
