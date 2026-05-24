"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_REGISTRY } from "@/lib/skill-builder/categories";
import {
  buildDefaultConfigForCategory,
  buildUxUiDefaultConfig,
  DEFAULT_PRESET_BY_CATEGORY,
  PRESETS,
} from "@/lib/skill-builder/default-preset";
import {
  generatePackage,
  regenerateFile,
} from "@/lib/skill-builder/generate-package";
import { downloadPackageAsZip } from "@/lib/skill-builder/zip-export";
import { runQualityChecks } from "@/lib/skill-builder/quality-checker";
import type {
  CapabilityPack,
  GeneratedFile,
  GeneratedPackage,
  SkillCategory,
  SkillConfig,
} from "@/types/skill";
import { SettingsNav } from "@/components/builder/SettingsNav";
import { FileTree } from "@/components/builder/FileTree";
import { MarkdownPreview } from "@/components/builder/MarkdownPreview";
import { RawEditor } from "@/components/builder/RawEditor";
import {
  InspectorPanel,
  type InspectorTarget,
} from "@/components/builder/InspectorPanel";
import { Dropdown, type DropdownItem } from "@/components/builder/Dropdown";
import { LangToggle } from "@/components/builder/LangToggle";
import { RecipeCard } from "@/components/builder/RecipeCard";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  UI,
  CATEGORY_LABELS,
  PRESET_LABELS,
} from "@/lib/i18n/strings";
import {
  RECIPES,
  applyRecipeToConfig,
  findMatchingRecipeId,
} from "@/lib/skill-builder/recipes";
import {
  REFERENCE_SKILLS,
  SKILLS_SH_URL,
} from "@/lib/skill-builder/reference-skills";
import {
  recommend,
  applyRecommendationToConfig,
  type Recommendation,
} from "@/lib/skill-builder/recommender";
import { IntentInput } from "@/components/builder/IntentInput";
import { RecommendationPanel } from "@/components/builder/RecommendationPanel";
import { SimulatorPanel } from "@/components/builder/SimulatorPanel";

type PreviewTab = "preview" | "raw" | "korean" | "simulate";

function DemoSummary({ pkg }: { pkg: GeneratedPackage }) {
  const workUnit = pkg.files.find((f) => f.fileName === "WORK_UNIT.json");
  const hooks = pkg.files.find((f) => f.fileName === "HOOKS.json");
  const jsonOk = (() => {
    try {
      if (workUnit) JSON.parse(workUnit.content);
      if (hooks) JSON.parse(hooks.content);
      return true;
    } catch {
      return false;
    }
  })();
  const fails = pkg.qualityReport.checks.filter((c) => c.status === "fail").length;
  const chip =
    "inline-flex items-center gap-1 px-2 py-[3px] rounded-sm text-[11px] tracking-wide bg-ink/5 text-ink-muted-80 border border-hairline";
  return (
    <div
      className="flex items-center gap-1.5"
      title="Demo summary for AXDD Standard Kit Composer"
    >
      <span className={chip}>mode: {pkg.config.buildMode}</span>
      <span className={chip}>primary: {pkg.config.packageType}</span>
      <span className={chip}>
        included: {pkg.config.includedSkillTypes.length}/8
      </span>
      <span className={chip}>files: {pkg.files.length}</span>
      <span className={chip}>JSON: {jsonOk ? "passed" : "failed"}</span>
      <span className={chip}>
        quality: {pkg.qualityReport.totalScore} / 100 · {fails} fails
      </span>
    </div>
  );
}

export default function BuilderPage() {
  const { locale } = useLocale();
  const [config, setConfig] = useState<SkillConfig>(() => buildUxUiDefaultConfig());
  const [pkg, setPkg] = useState<GeneratedPackage | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    "ux-ui-axdd-default",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [inspector, setInspector] = useState<InspectorTarget>({
    type: "summary",
  });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );

  function handleIntentSubmit(query: string) {
    setRecommendation(recommend(query));
  }

  function handleApplyRecommendation() {
    if (!recommendation) return;
    setConfig((c) => applyRecommendationToConfig(recommendation, c));
    setRecommendation(null);
  }

  // Esc → close inspector (back to Quality view)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && inspector.type !== "summary") {
        setInspector({ type: "summary" });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [inspector]);

  function togglePack(id: CapabilityPack) {
    const has = config.capabilityPacks.includes(id);
    setConfig({
      ...config,
      capabilityPacks: has
        ? config.capabilityPacks.filter((x) => x !== id)
        : [...config.capabilityPacks, id],
      updatedAt: new Date().toISOString(),
    });
  }

  const selectedFile: GeneratedFile | null = useMemo(() => {
    if (!pkg || !selectedFileId) return null;
    return pkg.files.find((f) => f.id === selectedFileId) ?? null;
  }, [pkg, selectedFileId]);

  const matchingRecipeId = useMemo(() => findMatchingRecipeId(config), [config]);

  function handleGenerate() {
    setIsGenerating(true);
    try {
      const next = generatePackage(config);
      setPkg(next);
      setSelectedFileId(next.files[0]?.id ?? null);
      setActiveTab("preview");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectPreset(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset || preset.status !== "available" || !preset.buildConfig) return;
    setSelectedPresetId(preset.id);
    setConfig(preset.buildConfig());
  }

  function handleSelectCategory(categoryId: string) {
    const cat = categoryId as SkillCategory;
    const nextConfig = buildDefaultConfigForCategory(cat);
    setConfig(nextConfig);
    const defaultPresetId = DEFAULT_PRESET_BY_CATEGORY[cat];
    if (defaultPresetId) setSelectedPresetId(defaultPresetId);
    // Clear any existing package so the user re-generates for the new category
    setPkg(null);
    setSelectedFileId(null);
  }

  function handleResetToPreset() {
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    if (!preset?.buildConfig) return;
    setConfig(preset.buildConfig());
  }

  function handleEditContent(next: string) {
    if (!pkg || !selectedFile) return;
    const updatedFiles = pkg.files.map((f) =>
      f.id === selectedFile.id
        ? { ...f, content: next, isEdited: f.content !== next ? true : f.isEdited }
        : f,
    );
    const report = runQualityChecks(pkg.config, updatedFiles);
    setPkg({ ...pkg, files: updatedFiles, qualityReport: report });
  }

  function handleRegenerateFile() {
    if (!pkg || !selectedFile) return;
    const fresh = regenerateFile(pkg.config, selectedFile.path);
    if (!fresh) return;
    const updatedFiles = pkg.files.map((f) =>
      f.id === selectedFile.id
        ? {
            ...fresh,
            id: f.id,
            isEdited: false,
            lastGeneratedAt: new Date().toISOString(),
          }
        : f,
    );
    const report = runQualityChecks(pkg.config, updatedFiles);
    setPkg({ ...pkg, files: updatedFiles, qualityReport: report });
  }

  async function handleDownloadZip() {
    if (!pkg) return;
    setIsExporting(true);
    try {
      await downloadPackageAsZip(pkg);
    } finally {
      setIsExporting(false);
    }
  }

  const categoryItems: DropdownItem[] = CATEGORY_REGISTRY.map((c) => ({
    id: c.id,
    label: tr(CATEGORY_LABELS[c.id].label, locale),
    description: tr(CATEGORY_LABELS[c.id].shortDescription, locale),
    disabled: c.status === "coming-soon",
  }));

  const presetItems: DropdownItem[] = PRESETS.filter(
    (p) => p.category === config.category,
  ).map((p) => {
    const i18n = PRESET_LABELS[p.id];
    return {
      id: p.id,
      label: i18n ? tr(i18n.name, locale) : p.name,
      description: i18n ? tr(i18n.bestFor, locale) : p.bestFor,
      disabled: p.status === "coming-soon",
    };
  });

  const hasPackage = pkg !== null;

  return (
    <div className="h-screen flex flex-col bg-canvas-parchment text-ink overflow-hidden">
      {/* Global nav — pure black, 44px */}
      <header className="relative z-40 h-11 bg-surface-black text-body-on-dark flex items-center px-5 flex-shrink-0 gap-3">
        <Link href="/" className="text-nav-link font-medium hover:opacity-80">
          {tr(UI.brand, locale)}
        </Link>
        <span
          className="text-[11px] tracking-wide uppercase px-2 py-[2px] rounded-sm bg-body-on-dark/10 text-body-on-dark/80"
          title="AXDD Standard Kit Composer — demo build"
        >
          AXDD Standard Kit Composer · v0.1
        </span>
        <div className="ml-auto">
          <LangToggle variant="dark" />
        </div>
      </header>

      {/* Sub-nav — frosted parchment with Category + Preset dropdowns */}
      <div
        className="relative z-30 bg-canvas-parchment/80 backdrop-blur-md border-b border-hairline flex items-center px-5 flex-shrink-0 gap-3"
        style={{ height: 52 }}
      >
        <Dropdown
          label={tr(UI.category, locale)}
          value={config.category}
          items={categoryItems}
          onChange={handleSelectCategory}
          minWidth={240}
        />
        <Dropdown
          label={tr(UI.preset, locale)}
          value={selectedPresetId}
          items={presetItems}
          onChange={handleSelectPreset}
          minWidth={260}
        />
        <div className="ml-auto flex items-center gap-2">
          {pkg ? <DemoSummary pkg={pkg} /> : null}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center rounded-pill bg-cta text-body-on-dark px-[22px] py-[8px] text-[15px] font-medium shadow-sm hover:bg-cta-hover focus-visible:outline-cta-focus disabled:opacity-50 transition"
          >
            {isGenerating ? tr(UI.generating, locale) : tr(UI.generate, locale)}
          </button>
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={!pkg || isExporting}
            title={tr(UI.qfDownload, locale)}
            className="inline-flex items-center justify-center rounded-pill border border-ink/30 bg-canvas text-ink px-[18px] py-[8px] text-[14px] font-medium hover:bg-divider-soft disabled:opacity-50 transition"
          >
            {isExporting ? tr(UI.qfDownloading, locale) : tr(UI.qfDownload, locale)}
          </button>
        </div>
      </div>

      {/* Body — left nav, optional detail panel, main workspace */}
      <div
        className={`flex-1 grid min-h-0 ${
          inspector.type === "summary"
            ? "grid-cols-[280px_minmax(0,1fr)]"
            : "grid-cols-[280px_380px_minmax(0,1fr)]"
        }`}
      >
        {/* Left panel — settings nav (compact, no expansion) */}
        <aside className="border-r border-hairline bg-canvas-parchment overflow-y-auto thin-scrollbar min-h-0 h-full">
          <div className="p-4 space-y-3 pb-12">
            <div className="flex items-center justify-between">
              <PanelLabel>{tr(UI.panelDetailedSettings, locale)}</PanelLabel>
              <button
                type="button"
                onClick={handleResetToPreset}
                title={tr(UI.qbResetTitle, locale)}
                className="text-[12px] text-ink-muted-48 hover:text-ink underline-offset-2 hover:underline transition"
              >
                ↺ {tr(UI.qbReset, locale)}
              </button>
            </div>
            <SettingsNav
              config={config}
              selectedPresetId={selectedPresetId}
              pkg={pkg}
              inspector={inspector}
              onInspect={setInspector}
            />
          </div>
        </aside>

        {/* Settings detail panel — appears next to the left nav when a
            setting (or related target) is selected. Pushes the main
            workspace to the right. */}
        {inspector.type !== "summary" && (
          <aside className="border-r border-hairline bg-canvas-parchment min-h-0 h-full overflow-hidden flex flex-col">
            <InspectorPanel
              target={inspector}
              report={pkg?.qualityReport ?? null}
              isEnabled={(id) => config.capabilityPacks.includes(id)}
              onToggle={togglePack}
              onClose={() => setInspector({ type: "summary" })}
              config={config}
              onConfigChange={setConfig}
              files={pkg?.files}
            />
          </aside>
        )}

        {/* Main workspace — files + preview. The files column only
            appears after a package has been generated so the workspace
            isn't dominated by an empty 256px sidebar on first load. */}
        <main className="flex min-h-0 bg-canvas">
          {pkg && (
            <div className="w-64 border-r border-hairline overflow-y-auto thin-scrollbar bg-canvas flex-shrink-0">
              <div className="px-4 py-3 border-b border-hairline space-y-1">
                <PanelLabel>{tr(UI.panelFiles, locale)}</PanelLabel>
                <div className="text-[11.5px] text-ink-muted-80 leading-snug">
                  <div className="font-mono text-ink truncate">
                    {pkg.packageName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-ink-muted-80">
                    <span className="font-mono">{pkg.config.packageType}</span>
                    <span>·</span>
                    <span>{pkg.files.length} files</span>
                  </div>
                </div>
              </div>
              <FileTree
                files={pkg.files}
                selectedFileId={selectedFileId}
                onSelect={(id) => setSelectedFileId(id)}
              />
            </div>
          )}

          <section className="flex-1 flex flex-col min-w-0">
            <div className="h-11 border-b border-hairline px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {selectedFile ? (
                  <>
                    <span
                      className="text-caption text-ink-muted-48 truncate"
                      title={selectedFile.path}
                    >
                      {selectedFile.path}
                    </span>
                    {selectedFile.isEdited && (
                      <span className="text-[11px] text-primary">
                        {tr(UI.edited, locale)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-caption text-ink-muted-48">
                    {tr(UI.previewEmptyHint, locale)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <TabButton
                  label={tr(UI.previewTabPreview, locale)}
                  active={activeTab === "preview"}
                  onClick={() => setActiveTab("preview")}
                />
                <TabButton
                  label={tr(UI.previewTabRaw, locale)}
                  active={activeTab === "raw"}
                  onClick={() => setActiveTab("raw")}
                />
                {/* Korean Preview tab — Phase 2 roadmap; hidden in v0.1. */}
                <TabButton
                  label={tr(UI.simTab, locale)}
                  active={activeTab === "simulate"}
                  onClick={() => setActiveTab("simulate")}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 thin-scrollbar">
              {activeTab === "simulate" && (
                <SimulatorPanel config={config} pkg={pkg} />
              )}
              {activeTab !== "simulate" && !selectedFile && (
                <div className="px-8 py-10 max-w-4xl mx-auto">
                  {/* Intent input — primary hero */}
                  <div className="mb-6">
                    <IntentInput onSubmit={handleIntentSubmit} />
                  </div>

                  {/* Recommendation result (only when present) */}
                  {recommendation && (
                    <div className="mb-8">
                      <RecommendationPanel
                        rec={recommendation}
                        onApply={handleApplyRecommendation}
                        onDismiss={() => setRecommendation(null)}
                      />
                    </div>
                  )}

                  {/* "Or pick a starting point" divider */}
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-hairline" />
                    <div className="text-[12px] uppercase tracking-[0.16em] text-ink-muted-48">
                      {tr(UI.orPickRecipe, locale)}
                    </div>
                    <div className="flex-1 h-px bg-hairline" />
                  </div>

                  {/* Recommended recipes */}
                  <section className="mb-10">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-[18px] font-semibold text-ink">
                        {tr(UI.recipesTitle, locale)}
                      </h3>
                    </div>
                    <p className="text-[13px] text-ink-muted-80 leading-snug mb-4">
                      {tr(UI.recipesIntro, locale)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {RECIPES.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          active={matchingRecipeId === recipe.id}
                          onApply={() =>
                            setConfig((c) => applyRecipeToConfig(recipe, c))
                          }
                        />
                      ))}
                    </div>
                  </section>

                  {/* Reference skills */}
                  <section>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-[18px] font-semibold text-ink">
                        {tr(UI.refSkillsTitle, locale)}
                      </h3>
                      <a
                        href={SKILLS_SH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-primary hover:underline"
                      >
                        {tr(UI.refSeeMore, locale)}
                      </a>
                    </div>
                    <p className="text-[13px] text-ink-muted-80 leading-snug mb-4">
                      {tr(UI.refSkillsIntro, locale)}
                    </p>
                    <ul className="divide-y divide-divider-soft border border-hairline rounded-lg bg-canvas overflow-hidden">
                      {REFERENCE_SKILLS.map((rs) => (
                        <li
                          key={rs.name}
                          className="flex items-baseline gap-3 px-4 py-2.5"
                        >
                          <span className="font-mono text-[13px] text-ink font-semibold truncate min-w-[180px]">
                            {rs.name}
                          </span>
                          <span className="text-[12px] text-ink-muted-48 truncate hidden sm:inline">
                            {rs.publisher}
                          </span>
                          <span className="flex-1 text-[12.5px] text-ink-muted-80 leading-snug truncate">
                            {tr(rs.description, locale)}
                          </span>
                          <span className="text-[11px] text-ink-muted-48 whitespace-nowrap">
                            {rs.installs} {tr(UI.refInstalls, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}
              {selectedFile && activeTab === "preview" && (
                <MarkdownPreview
                  content={selectedFile.content}
                  language={selectedFile.language}
                />
              )}
              {selectedFile && activeTab === "raw" && (
                <RawEditor
                  content={selectedFile.content}
                  onChange={handleEditContent}
                />
              )}
              {/* Korean preview tab body removed in v0.1 — see Phase 2 roadmap. */}
            </div>

            <div className="h-12 border-t border-hairline px-4 flex items-center justify-between flex-shrink-0">
              <div className="text-fine-print text-ink-muted-48">
                {selectedFile?.lastGeneratedAt
                  ? `${tr(UI.lastGenerated, locale)} ${new Date(selectedFile.lastGeneratedAt).toLocaleTimeString()}`
                  : ""}
              </div>
              <div className="flex items-center gap-2">
                {/* Korean preview button — Phase 2 roadmap; hidden in v0.1. */}
                <button
                  type="button"
                  onClick={handleRegenerateFile}
                  disabled={!selectedFile}
                  title={tr(UI.btnRegenerateFileTitle, locale)}
                  className="text-caption px-3 py-1.5 rounded-md border border-hairline bg-surface-pearl text-ink-muted-80 hover:bg-divider-soft disabled:opacity-50"
                >
                  {tr(UI.btnRegenerateFile, locale)}
                </button>
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
      {children}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-caption px-3 py-1 rounded-sm transition ${
        active
          ? "bg-ink text-body-on-dark"
          : "text-ink-muted-80 hover:bg-divider-soft"
      }`}
    >
      {label}
    </button>
  );
}
