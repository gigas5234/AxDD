"use client";

import type { GeneratedPackage, SkillConfig } from "@/types/skill";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  PRESET_LABELS,
  SKILL_PACKAGE_TYPE_LABELS,
} from "@/lib/i18n/strings";
import { type InspectorTarget } from "./InspectorPanel";
import { PRESETS } from "@/lib/skill-builder/default-preset";

type NavRow = {
  id: NonNullable<InspectorTarget["type"]>;
  label: string;
  description: string;
  target: InspectorTarget;
};

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

  const rows: NavRow[] = [
    {
      id: "overview",
      label: "Kit Overview",
      description: "Preset, mode, primary type, expected files, generate",
      target: { type: "overview" },
    },
    {
      id: "composition",
      label: "Skill Composition",
      description: "Included skill types + AXDD 8-type taxonomy",
      target: { type: "composition" },
    },
    {
      id: "files-grouped",
      label: "Generated Files",
      description: "Core, workflow, knowledge, templates, checklists, tests",
      target: { type: "files-grouped" },
    },
    {
      id: "governance",
      label: "Governance",
      description: "Quality score, JSON validity, required files, gates",
      target: { type: "governance" },
    },
    {
      id: "validation-lab",
      label: "Validation Lab",
      description: "Router auto-match · rule-based judge · scenario log",
      target: { type: "validation-lab" },
    },
    {
      id: "registry",
      label: "Kit Registry",
      description: "Browse and install other AXDD kits",
      target: { type: "registry" },
    },
    {
      id: "advanced",
      label: "Advanced Settings",
      description: "Role, output, add-ons, rules, language, raw options",
      target: { type: "advanced" },
    },
  ];

  function isActive(row: NavRow): boolean {
    if (inspector.type === row.target.type) return true;
    // Treat per-section "settings" / "file-matrix" / "capability-pack"
    // targets as still belonging to the Advanced row so the nav doesn't
    // lose its highlight when the user drills in.
    if (
      row.id === "advanced" &&
      (inspector.type === "settings" ||
        inspector.type === "capability-pack" ||
        inspector.type === "file-matrix")
    ) {
      return true;
    }
    return false;
  }

  const rowCls = (active: boolean) =>
    `w-full text-left px-3 py-2.5 rounded-md transition border ${
      active
        ? "bg-primary/10 border-primary/30"
        : "bg-canvas border-transparent hover:bg-divider-soft"
    }`;

  return (
    <nav className="space-y-4">
      {/* Current Kit Summary card */}
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

      <ul className="space-y-1">
        {rows.map((row) => {
          const active = isActive(row);
          return (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => onInspect(row.target)}
                className={rowCls(active)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium text-ink flex-1 truncate">
                    {row.label}
                  </span>
                  {active && (
                    <span
                      className="text-[10.5px] text-primary"
                      aria-hidden="true"
                    >
                      ●
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-ink-muted-80 mt-0.5 leading-snug">
                  {row.description}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
