"use client";

import type { GeneratedPackage, SkillConfig } from "@/types/skill";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  PRESET_LABELS,
  SKILL_PACKAGE_TYPE_LABELS,
  UI,
} from "@/lib/i18n/strings";
import {
  type InspectorTarget,
} from "./InspectorPanel";
import { type SettingsTarget } from "./SettingsForm";
import { PRESETS } from "@/lib/skill-builder/default-preset";

type NavRow =
  | { kind: "settings"; section: SettingsTarget; label: string; helper?: string }
  | { kind: "file-matrix"; label: string }
  | { kind: "preset"; label: string };

const SECTION_GROUPS: { title: string; rows: NavRow[] }[] = [
  {
    title: "Quick Setup",
    rows: [{ kind: "settings", section: "build-mode", label: "Build Mode" }],
  },
  {
    title: "Kit Composition",
    rows: [
      { kind: "settings", section: "primary-kit", label: "Primary Kit Structure" },
      { kind: "settings", section: "included-types", label: "Included Skill Types" },
      { kind: "file-matrix", label: "Generated File Matrix" },
    ],
  },
  {
    title: "Customize",
    rows: [
      { kind: "settings", section: "role", label: "Role & Awareness" },
      { kind: "settings", section: "output", label: "Output Format" },
      { kind: "settings", section: "workflow", label: "Workflow / Validation" },
      { kind: "settings", section: "packs", label: "Design Capability Add-ons" },
      { kind: "settings", section: "rules", label: "Quality Rules" },
      { kind: "settings", section: "lang", label: "Language" },
    ],
  },
  {
    title: "Advanced",
    rows: [
      { kind: "settings", section: "basic", label: "Basic Info" },
      { kind: "settings", section: "pkg", label: "Raw Package Options" },
    ],
  },
];

export function SettingsNav({
  config,
  selectedPresetId,
  pkg,
  inspector,
  onInspect,
}: {
  config: SkillConfig;
  selectedPresetId: string;
  pkg: GeneratedPackage | null;
  inspector: InspectorTarget;
  onInspect: (target: InspectorTarget) => void;
}) {
  const { locale } = useLocale();

  const fails =
    pkg?.qualityReport.checks.filter((c) => c.status === "fail").length ?? 0;
  const presetMeta = PRESET_LABELS[selectedPresetId];
  const presetLabel = presetMeta
    ? tr(presetMeta.name, locale)
    : PRESETS.find((p) => p.id === selectedPresetId)?.name ?? selectedPresetId;
  const primaryMeta = SKILL_PACKAGE_TYPE_LABELS[config.packageType];

  function isActive(row: NavRow): boolean {
    if (row.kind === "settings") {
      return (
        inspector.type === "settings" && inspector.section === row.section
      );
    }
    if (row.kind === "file-matrix") return inspector.type === "file-matrix";
    return false; // preset is a one-shot action
  }

  function handleClick(row: NavRow) {
    if (row.kind === "settings") {
      onInspect({
        type: "settings",
        section: row.section,
        title: row.label,
      });
      return;
    }
    if (row.kind === "file-matrix") {
      onInspect({ type: "file-matrix" });
    }
  }

  const rowCls = (active: boolean) =>
    `w-full text-left text-[13px] px-3 py-1.5 rounded-md transition flex items-center gap-2 ${
      active
        ? "bg-primary/10 text-ink border border-primary/30"
        : "text-ink hover:bg-divider-soft border border-transparent"
    }`;

  return (
    <nav className="space-y-4">
      {/* Current Kit Summary */}
      <section className="rounded-md border border-hairline bg-canvas overflow-hidden">
        <header className="px-3 py-2 border-b border-divider-soft">
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
            Current Kit
          </div>
          <div className="text-[13.5px] font-semibold text-ink mt-0.5 truncate">
            {presetLabel}
          </div>
        </header>
        <dl className="px-3 py-2 space-y-1 text-[12.5px]">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted-80">Mode</dt>
            <dd className="font-mono text-ink">{config.buildMode}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted-80">Primary</dt>
            <dd
              className="font-mono text-ink truncate ml-2"
              title={tr(primaryMeta.name, locale)}
            >
              {config.packageType}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-muted-80">Included</dt>
            <dd className="font-mono text-ink">
              {config.includedSkillTypes.length} / 8
            </dd>
          </div>
          {pkg && (
            <>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted-80">Files</dt>
                <dd className="font-mono text-ink">{pkg.files.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted-80">Quality</dt>
                <dd className="font-mono text-ink">
                  {pkg.qualityReport.totalScore} / 100
                  {fails > 0 && (
                    <span className="ml-1 text-primary">· {fails} fails</span>
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </section>

      {/* Grouped nav rows */}
      {SECTION_GROUPS.map((group) => (
        <section key={group.title} className="space-y-1">
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium px-1">
            {group.title}
          </div>
          <ul className="space-y-0.5">
            {group.rows.map((row) => {
              const active = isActive(row);
              return (
                <li key={`${row.kind}-${"section" in row ? row.section : row.label}`}>
                  <button
                    type="button"
                    onClick={() => handleClick(row)}
                    className={rowCls(active)}
                  >
                    <span className="flex-1 truncate">{row.label}</span>
                    {row.kind === "preset" && (
                      <span className="text-[10.5px] text-ink-muted-48">
                        change
                      </span>
                    )}
                    {active && (
                      <span
                        className="text-[10.5px] text-primary"
                        aria-hidden="true"
                      >
                        ●
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="text-fine-print text-ink-muted-48 leading-snug px-1 pt-2">
        {tr(UI.panelDetailedSettings, locale)} · click any item to edit on the
        right.
      </p>
    </nav>
  );
}
