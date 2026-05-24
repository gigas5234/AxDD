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
  | { type: "summary" };

export function InspectorPanel({
  target,
  report,
  isEnabled,
  onToggle,
  onClose,
  config,
  onConfigChange,
  files,
}: {
  target: InspectorTarget;
  report: QualityReport | null;
  isEnabled: (id: CapabilityPack) => boolean;
  onToggle: (id: CapabilityPack) => void;
  onClose: () => void;
  config?: SkillConfig;
  onConfigChange?: (next: SkillConfig) => void;
  files?: { path: string; fileName: string }[];
}) {
  const { locale } = useLocale();

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
