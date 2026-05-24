"use client";

import type {
  CapabilityPack,
  QualityReport,
  SkillConfig,
} from "@/types/skill";
import { getCapabilityPack } from "@/lib/skill-builder/blocks/capability-packs";
import { QualityPanel } from "./QualityPanel";
import { MarkdownPreview } from "./MarkdownPreview";
import { SettingsForm, type SettingsTarget } from "./SettingsForm";
import { useLocale, tr } from "@/lib/i18n/locale";
import { UI, PACK_LABELS } from "@/lib/i18n/strings";

export type InspectorTarget =
  | { type: "quality" }
  | { type: "capability-pack"; id: CapabilityPack }
  | { type: "settings"; section: SettingsTarget; title: string; helper?: string }
  | { type: "file-matrix" }
  | { type: "summary" }
  | { type: "overview" }
  | { type: "composition" }
  | { type: "files-grouped" }
  | { type: "governance" }
  | { type: "advanced" };

export function InspectorPanel({
  target,
  report,
  isEnabled,
  onToggle,
  onClose,
  config,
  onConfigChange,
  files,
  onInspect,
}: {
  target: InspectorTarget;
  report: QualityReport | null;
  isEnabled: (id: CapabilityPack) => boolean;
  onToggle: (id: CapabilityPack) => void;
  onClose: () => void;
  config?: SkillConfig;
  onConfigChange?: (next: SkillConfig) => void;
  files?: { path: string; fileName: string }[];
  onInspect?: (target: InspectorTarget) => void;
}) {
  const { locale } = useLocale();

  // ── Kit Overview ─────────────────────────────────────────────────────────
  if (target.type === "overview" && config) {
    const fails =
      report?.checks.filter((c) => c.status === "fail").length ?? 0;
    const hasPkg = !!files;
    const isKo = locale === "ko";
    const identityRows: [string, string][] = isKo
      ? [
          ["스킬 이름", config.skillName],
          ["패키지", config.packageName],
          ["카테고리", config.category],
          ["빌드 모드", config.buildMode],
          ["기본 키트 구조", config.packageType],
          ["포함된 타입", `${config.includedSkillTypes.length} / 8`],
          ["설명", config.description],
        ]
      : [
          ["Skill name", config.skillName],
          ["Package", config.packageName],
          ["Category", config.category],
          ["Build mode", config.buildMode],
          ["Primary kit", config.packageType],
          ["Included types", `${config.includedSkillTypes.length} / 8`],
          ["Description", config.description],
        ];
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
            {tr(UI.detailKicker, locale)}
          </div>
          <div className="text-body-strong text-ink mt-0.5">
            {tr(UI.detailKitOverview, locale)}
          </div>
          <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
            {isKo
              ? "이 킷이 무엇을 만들고 어떻게 배포되는지 요약합니다."
              : "What this kit will produce and how to ship it."}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-4 text-[13.5px]">
          <section className="space-y-2">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
              {tr(UI.detailIdentity, locale)}
            </div>
            <dl className="rounded-md border border-hairline bg-canvas divide-y divide-divider-soft text-[12.5px]">
              {identityRows.map(([k, v]) => (
                <div key={k} className="flex gap-3 px-3 py-2 items-start">
                  <dt className="text-ink-muted-80 min-w-[110px] flex-shrink-0">
                    {k}
                  </dt>
                  <dd className="text-ink leading-snug break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="space-y-2">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
              {tr(UI.detailExpectedOutput, locale)}
            </div>
            <div className="rounded-md border border-hairline bg-canvas px-3 py-2 text-[12.5px] text-ink-muted-80 leading-snug">
              {hasPkg
                ? isKo
                  ? `${files!.length}개의 파일이 생성되었습니다.${
                      report
                        ? ` 품질 ${report.totalScore} / 100 · ${fails} fails.`
                        : ""
                    }`
                  : `${files!.length} files generated.${
                      report
                        ? ` Quality ${report.totalScore} / 100 · ${fails} fails.`
                        : ""
                    }`
                : isKo
                  ? "상단 헤더의 Generate Kit 버튼을 눌러 AXDD Standard Kit를 생성하세요."
                  : "Press Generate Kit in the header to compose the AXDD Standard Kit."}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ── Skill Composition ────────────────────────────────────────────────────
  if (target.type === "composition" && config && onConfigChange) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Detail
            </div>
            <div className="text-body-strong text-ink mt-0.5">
              Skill Composition
            </div>
            <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
              Which AXDD skill types this kit bundles. Preset auto-selects;
              switch to Custom to edit manually.
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-4">
          {/* Build mode toggle reused from per-section settings */}
          <div className="rounded-md border border-hairline bg-canvas">
            <SettingsForm
              config={config}
              onChange={onConfigChange}
              inspector={target}
              onInspect={() => {}}
              targetOnly="build-mode"
            />
          </div>
          <div className="rounded-md border border-hairline bg-canvas">
            <SettingsForm
              config={config}
              onChange={onConfigChange}
              inspector={target}
              onInspect={() => {}}
              targetOnly="included-types"
            />
          </div>
          <div className="rounded-md border border-hairline bg-canvas">
            <SettingsForm
              config={config}
              onChange={onConfigChange}
              inspector={target}
              onInspect={() => {}}
              targetOnly="primary-kit"
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Generated Files (grouped matrix) ─────────────────────────────────────
  if (target.type === "files-grouped") {
    const groups: { label: string; match: (path: string) => boolean }[] = [
      {
        label: "Core",
        match: (p) =>
          /\/(SKILL\.md|CATALOG\.md|README\.md|KIT_MANIFEST\.json)$/.test(p),
      },
      {
        label: "Workflow",
        match: (p) =>
          /\/(WORK_UNIT\.json|HOOKS\.json)$/.test(p) ||
          p.includes("/references/stage-guides/"),
      },
      {
        label: "Knowledge",
        match: (p) =>
          p.includes("/references/") && !p.includes("/references/stage-guides/"),
      },
      { label: "Templates", match: (p) => p.includes("/templates/") },
      { label: "Checklists", match: (p) => p.includes("/checklists/") },
      { label: "Tests", match: (p) => p.includes("/tests/") },
      { label: "Examples", match: (p) => p.includes("/examples/") },
      {
        label: "Scripts & Metadata",
        match: (p) =>
          p.includes("/scripts/") ||
          p.includes("/config/") ||
          p.includes("/metadata/") ||
          p.includes("/assets/"),
      },
    ];
    const bucketed = groups.map((g) => ({
      ...g,
      items: (files ?? []).filter((f) => g.match(f.path)),
    }));

    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Detail
            </div>
            <div className="text-body-strong text-ink mt-0.5">
              Generated Files
            </div>
            <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
              {files
                ? `${files.length} files grouped by purpose.`
                : "No package yet. Press Generate Kit to populate this view."}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-3">
          {bucketed.map((b) => (
            <section key={b.label} className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <div className="text-[12px] font-semibold text-ink">
                  {b.label}
                </div>
                <div className="text-[11px] text-ink-muted-80 font-mono">
                  {b.items.length}
                </div>
              </div>
              {b.items.length === 0 ? (
                <div className="text-[11.5px] text-ink-muted-48 italic px-1">
                  none in this kit
                </div>
              ) : (
                <ul className="divide-y divide-divider-soft border border-hairline rounded-md bg-canvas overflow-hidden">
                  {b.items.map((f) => (
                    <li
                      key={f.path}
                      className="px-3 py-1.5 font-mono text-[12px] text-ink truncate"
                      title={f.path}
                    >
                      {f.path}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ── Governance ───────────────────────────────────────────────────────────
  if (target.type === "governance") {
    const checks = report?.checks ?? [];
    const fails = checks.filter((c) => c.status === "fail");
    const warns = checks.filter((c) => c.status === "warning");
    const passes = checks.filter((c) => c.status === "pass");
    const findCheck = (idPart: string) =>
      checks.find((c) => c.id.includes(idPart));
    const probes: { label: string; key: string }[] = [
      { label: "JSON validity (WORK_UNIT)", key: "work-unit-json" },
      { label: "JSON validity (HOOKS)", key: "hooks-json" },
      { label: "Stage count = 6", key: "work-unit-stages" },
      { label: "Hook routes resolve", key: "hooks-stage-routes" },
      { label: "Hook trigger collisions", key: "hooks-collisions" },
      { label: "CATALOG cross-references", key: "catalog-refs" },
      { label: "Required files (matrix)", key: "matrix-" },
      { label: "Stage guides present", key: "stage-guides-set" },
      { label: "Skill framework reference", key: "skill-framework-ref" },
      { label: "Figma manual fallback", key: "figma-fallback" },
      { label: "Script stubs", key: "script-stubs" },
      { label: "Metadata stubs", key: "metadata-stubs" },
      { label: "Asset stub", key: "asset-stubs" },
    ];
    const statusDot = (s: "pass" | "warning" | "fail" | undefined) =>
      s === "fail"
        ? "bg-primary"
        : s === "warning"
          ? "bg-ink-muted-48"
          : s === "pass"
            ? "bg-ink/40"
            : "bg-hairline";
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Detail
            </div>
            <div className="text-body-strong text-ink mt-0.5">Governance</div>
            <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
              Quality score, JSON validity, required files, governance gates.
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-4">
          <section className="rounded-md border border-hairline bg-canvas p-3 space-y-1">
            <div className="flex items-baseline justify-between">
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48">
                Score
              </div>
              <div className="text-[20px] font-semibold text-ink">
                {report?.totalScore ?? "—"} <span className="text-[12px] text-ink-muted-80">/ 100</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-ink-muted-80">
              <span>pass {passes.length}</span>
              <span>warn {warns.length}</span>
              <span className={fails.length > 0 ? "text-primary" : ""}>
                fail {fails.length}
              </span>
            </div>
          </section>

          <section className="space-y-1.5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
              Gates
            </div>
            <ul className="divide-y divide-divider-soft border border-hairline rounded-md bg-canvas overflow-hidden">
              {probes.map((p) => {
                const c = findCheck(p.key);
                return (
                  <li
                    key={p.key}
                    className="px-3 py-2 flex items-center gap-2 text-[12.5px]"
                    title={c?.message ?? "not evaluated"}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(c?.status)}`}
                    />
                    <span className="text-ink flex-1 truncate">{p.label}</span>
                    <span className="font-mono text-[11px] text-ink-muted-80">
                      {c?.status ?? "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {fails.length > 0 && (
            <section className="space-y-1.5">
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-primary font-medium">
                Failures
              </div>
              <ul className="space-y-1">
                {fails.map((c) => (
                  <li
                    key={c.id}
                    className="px-3 py-2 rounded-md border border-primary/30 bg-primary/5 text-[12px] text-ink"
                  >
                    <div className="font-medium">{c.label}</div>
                    <div className="text-ink-muted-80 mt-0.5 leading-snug">
                      {c.message}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    );
  }

  // ── Advanced Settings (sub-nav of per-section editors) ───────────────────
  if (target.type === "advanced") {
    const advancedRows: {
      section: SettingsTarget | "file-matrix";
      label: string;
      hint: string;
    }[] = [
      { section: "basic", label: "Basic Info", hint: "Name, package, description, target agent" },
      { section: "role", label: "Role & Awareness", hint: "Role level, implementation / DS / business awareness" },
      { section: "output", label: "Output Format", hint: "Markdown / JSON / tables / Cursor prompt / checklists / examples" },
      { section: "workflow", label: "Workflow / Stages", hint: "Legacy workflow modules / stage display" },
      { section: "packs", label: "Design Capability Add-ons", hint: "Optional UX/UI content packs" },
      { section: "rules", label: "Quality Rules", hint: "Universal + category-specific rules" },
      { section: "lang", label: "Language", hint: "Primary language (Korean translation is Phase 2)" },
      { section: "pkg", label: "Raw Package Options", hint: "Per-folder include toggles (matrix-locked)" },
      { section: "file-matrix", label: "File Matrix (raw view)", hint: "Folder counts of the current generation" },
    ];

    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Detail
            </div>
            <div className="text-body-strong text-ink mt-0.5">
              Advanced Settings
            </div>
            <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
              Detailed knobs. Most users won't need these; pick a preset
              instead.
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-1">
          {advancedRows.map((r) => (
            <button
              key={r.section}
              type="button"
              onClick={() => {
                if (!onInspect) return;
                if (r.section === "file-matrix") {
                  onInspect({ type: "file-matrix" });
                } else {
                  onInspect({
                    type: "settings",
                    section: r.section,
                    title: r.label,
                  });
                }
              }}
              className="w-full text-left rounded-md border border-hairline bg-canvas px-3 py-2 hover:bg-divider-soft transition"
            >
              <div className="text-[13px] font-medium text-ink">{r.label}</div>
              <div className="text-[11.5px] text-ink-muted-80 mt-0.5 leading-snug">
                {r.hint}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (target.type === "summary") {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
            Inspector
          </div>
          <div className="text-body-strong text-ink mt-0.5">
            Select a setting on the left
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 text-[13.5px] text-ink-muted-80 leading-relaxed">
          Click an item in the left sidebar to edit it here. The kit preview
          and file tree stay visible while you adjust settings.
        </div>
      </div>
    );
  }

  if (target.type === "settings" && config && onConfigChange) {
    const isPresetIncluded =
      target.section === "included-types" && config.buildMode === "preset";
    const helperText =
      target.helper ??
      (isPresetIncluded
        ? "Preset mode uses a recommended skill combination. Switch to Custom mode to edit skill types manually."
        : undefined);
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Settings
            </div>
            <div className="text-body-strong text-ink mt-0.5">
              {target.title}
            </div>
            {helperText && (
              <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
                {helperText}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(UI.inspCloseTitle, locale)}
            className="text-ink-muted-48 hover:text-ink text-[18px] leading-none px-1"
            title={tr(UI.inspCloseTitle, locale)}
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3">
          <SettingsForm
            config={config}
            onChange={onConfigChange}
            inspector={target}
            onInspect={() => {}}
            targetOnly={target.section}
          />
        </div>
      </div>
    );
  }

  if (target.type === "file-matrix" && files) {
    const folderCounts = new Map<string, number>();
    for (const f of files) {
      const parts = f.path.split("/");
      const folder = parts.length >= 3 ? parts.slice(1, -1).join("/") || "(root)" : "(root)";
      folderCounts.set(folder, (folderCounts.get(folder) ?? 0) + 1);
    }
    const rows = Array.from(folderCounts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
              Settings
            </div>
            <div className="text-body-strong text-ink mt-0.5">
              Generated File Matrix
            </div>
            <div className="text-[12.5px] text-ink-muted-80 mt-1 leading-snug">
              Files emitted for the currently included skill types. Derived from
              the merged required-files matrix.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(UI.inspCloseTitle, locale)}
            className="text-ink-muted-48 hover:text-ink text-[18px] leading-none px-1"
            title={tr(UI.inspCloseTitle, locale)}
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-3">
          <div className="text-[12px] text-ink-muted-80">
            Total: <span className="font-mono">{files.length}</span> files
          </div>
          <ul className="divide-y divide-divider-soft border border-hairline rounded-md bg-canvas overflow-hidden">
            {rows.map(([folder, count]) => (
              <li key={folder} className="px-3 py-2 flex items-center gap-2">
                <span className="font-mono text-[12.5px] text-ink flex-1 truncate">
                  {folder}
                </span>
                <span className="text-[11.5px] font-mono text-ink-muted-80">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (target.type === "quality") {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
            {tr(UI.panelQualityDetails, locale)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          <QualityPanel report={report} />
        </div>
      </div>
    );
  }

  if (target.type !== "capability-pack") {
    return null;
  }
  const pack = getCapabilityPack(target.id);
  if (!pack) {
    return (
      <div className="p-4 text-caption text-ink-muted-48">
        {tr(UI.inspPackNotFound, locale)}
      </div>
    );
  }
  const enabled = isEnabled(pack.id);
  const packI18n = PACK_LABELS[pack.id];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Inspector header */}
      <div className="px-4 py-3 border-b border-hairline flex items-start gap-2 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
            {tr(UI.panelCapabilityPack, locale)}
          </div>
          <div className="text-body-strong text-ink mt-0.5">
            {tr(packI18n.label, locale)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={tr(UI.inspCloseTitle, locale)}
          className="text-ink-muted-48 hover:text-ink text-[18px] leading-none px-1"
          title={tr(UI.inspCloseTitle, locale)}
        >
          ×
        </button>
      </div>

      {/* Inspector body */}
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-3 space-y-4">
        <p className="text-[15px] text-ink leading-relaxed">
          {tr(packI18n.summary, locale)}
        </p>

        <button
          type="button"
          onClick={() => onToggle(pack.id)}
          className={`w-full inline-flex items-center justify-center rounded-pill px-[18px] py-[8px] text-caption transition ${
            enabled
              ? "bg-primary text-body-on-dark hover:opacity-95"
              : "border border-primary text-primary hover:bg-primary/5"
          }`}
        >
          {enabled ? tr(UI.inspEnabled, locale) : tr(UI.inspEnable, locale)}
        </button>

        <div>
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-2">
            {tr(UI.inspWhenEnabled, locale)}
          </div>
          <ul className="space-y-1.5">
            {pack.effect.filesAdded.map((f) => (
              <li
                key={`file-${f}`}
                className="text-[14px] leading-relaxed text-ink"
              >
                <span className="inline-block min-w-[68px] text-ink-muted-80 text-[11px] uppercase tracking-[0.12em] mr-2">
                  {tr(UI.inspLabelFile, locale)}
                </span>
                <span className="font-mono text-[12.5px]">{f}</span>
              </li>
            ))}
            {pack.effect.skillMdSections.map((s) => (
              <li
                key={`sec-${s}`}
                className="text-[14px] leading-relaxed text-ink"
              >
                <span className="inline-block min-w-[68px] text-ink-muted-80 text-[11px] uppercase tracking-[0.12em] mr-2">
                  {tr(UI.inspLabelSection, locale)}
                </span>
                {s}
              </li>
            ))}
            {pack.effect.rulesAdded.map((r) => (
              <li
                key={`rule-${r}`}
                className="text-[14px] leading-relaxed text-ink"
              >
                <span className="inline-block min-w-[68px] text-ink-muted-80 text-[11px] uppercase tracking-[0.12em] mr-2">
                  {tr(UI.inspLabelRule, locale)}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {pack.dependencies && pack.dependencies.length > 0 && (
          <div className="pt-1">
            <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-2">
              {tr(UI.depsTitle, locale)}
            </div>
            <ul className="space-y-1.5">
              {pack.dependencies.map((depId) => {
                const depPack = getCapabilityPack(depId);
                if (!depPack) return null;
                const depEnabled = isEnabled(depId);
                const depI18n = PACK_LABELS[depId];
                return (
                  <li
                    key={depId}
                    className="flex items-center gap-2 text-[13px]"
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${depEnabled ? "bg-ink" : "bg-primary"}`}
                    />
                    <span className="text-ink truncate flex-1">
                      {tr(UI.depsRequires, locale)}:{" "}
                      <span className="font-semibold">
                        {depI18n ? tr(depI18n.label, locale) : depPack.label}
                      </span>
                    </span>
                    {depEnabled ? (
                      <span className="text-[11px] text-ink-muted-48">
                        {tr(UI.depsMet, locale)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggle(depId)}
                        className="text-[11px] text-primary hover:underline"
                      >
                        {tr(UI.depsEnable, locale)}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="text-[12px] text-ink-muted-48 italic leading-relaxed pt-1 border-t border-divider-soft">
          {tr(UI.inspInspiredBy, locale)} {pack.sourceInspiration}
        </div>

        {pack.skillMdSection && (
          <details className="rounded-md border border-hairline bg-canvas">
            <summary className="px-3 py-2 text-caption-strong text-ink cursor-pointer hover:bg-divider-soft select-none flex items-center">
              <span className="flex-1">
                {tr(UI.inspSkillMdPreview, locale)}
              </span>
              <span className="text-ink-muted-48 text-caption">▾</span>
            </summary>
            <div className="border-t border-divider-soft max-h-[40vh] overflow-y-auto thin-scrollbar">
              <MarkdownPreview
                content={`## ${pack.skillMdSection.heading}\n\n${pack.skillMdSection.body}`}
                compact
              />
            </div>
          </details>
        )}

        {pack.referenceFile && (
          <details className="rounded-md border border-hairline bg-canvas">
            <summary className="px-3 py-2 text-caption-strong text-ink cursor-pointer hover:bg-divider-soft select-none flex items-center">
              <span className="flex-1 truncate">
                {tr(UI.inspReferencePreview, locale)} ·{" "}
                <span className="font-mono text-[11px] text-ink-muted-48">
                  {pack.referenceFile.fileName}
                </span>
              </span>
              <span className="text-ink-muted-48 text-caption">▾</span>
            </summary>
            <div className="border-t border-divider-soft max-h-[50vh] overflow-y-auto thin-scrollbar">
              <MarkdownPreview content={pack.referenceFile.content} compact />
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
