"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_REGISTRY } from "@/lib/skill-builder/categories";
import {
  buildUxUiDefaultConfig,
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
  SkillConfig,
} from "@/types/skill";
import { SettingsForm } from "@/components/builder/SettingsForm";
import { FileTree } from "@/components/builder/FileTree";
import { MarkdownPreview } from "@/components/builder/MarkdownPreview";
import { RawEditor } from "@/components/builder/RawEditor";
import {
  InspectorPanel,
  type InspectorTarget,
} from "@/components/builder/InspectorPanel";
import { QualityFooter } from "@/components/builder/QualityFooter";
import { Dropdown, type DropdownItem } from "@/components/builder/Dropdown";
import { LangToggle } from "@/components/builder/LangToggle";
import { useLocale, tr } from "@/lib/i18n/locale";
import {
  UI,
  CATEGORY_LABELS,
  PRESET_LABELS,
} from "@/lib/i18n/strings";

type PreviewTab = "preview" | "raw" | "korean";

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
    type: "quality",
  });

  // Esc → close inspector (back to Quality view)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && inspector.type !== "quality") {
        setInspector({ type: "quality" });
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

  const presetItems: DropdownItem[] = PRESETS.map((p) => {
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
    <div className="min-h-screen flex flex-col bg-canvas-parchment text-ink">
      {/* Global nav — pure black, 44px */}
      <header className="relative z-40 h-11 bg-surface-black text-body-on-dark flex items-center px-5 flex-shrink-0">
        <Link href="/" className="text-nav-link font-medium hover:opacity-80">
          {tr(UI.brand, locale)}
        </Link>
        <nav className="ml-8 flex items-center gap-5 text-nav-link">
          <span className="text-body-on-dark">{tr(UI.navUxUi, locale)}</span>
          <span className="text-body-on-dark/50">{tr(UI.navProduct, locale)}</span>
          <span className="text-body-on-dark/50">{tr(UI.navFrontend, locale)}</span>
          <span className="text-body-on-dark/50">{tr(UI.navDesignSystem, locale)}</span>
        </nav>
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
          value="ux-ui"
          items={categoryItems}
          onChange={() => {
            /* Only ux-ui is selectable in MVP; other items are disabled. */
          }}
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
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[22px] py-[8px] text-[15px] font-normal hover:opacity-95 disabled:opacity-50 transition"
          >
            {isGenerating ? tr(UI.generating, locale) : tr(UI.generate, locale)}
          </button>
        </div>
      </div>

      {/* 3-column body */}
      <div className="flex-1 grid grid-cols-[320px_minmax(0,1fr)_320px] min-h-0">
        {/* Left panel — settings-dominant */}
        <aside className="border-r border-hairline bg-canvas-parchment overflow-y-auto thin-scrollbar">
          {/* Sticky Quick Bar (c) */}
          <div className="sticky top-0 z-20 bg-canvas-parchment/95 backdrop-blur-md border-b border-hairline px-3 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-3 py-[7px] text-caption hover:opacity-95 disabled:opacity-50 transition"
            >
              {isGenerating
                ? tr(UI.generating, locale)
                : hasPackage
                  ? tr(UI.qbRegenerate, locale)
                  : tr(UI.qbGenerate, locale)}
            </button>
            <button
              type="button"
              onClick={handleResetToPreset}
              className="inline-flex items-center justify-center rounded-md border border-hairline bg-surface-pearl px-3 py-[7px] text-caption text-ink-muted-80 hover:bg-divider-soft transition"
              title={tr(UI.qbResetTitle, locale)}
            >
              {tr(UI.qbReset, locale)}
            </button>
          </div>

          <div className="p-4 space-y-3">
            <PanelLabel>{tr(UI.panelDetailedSettings, locale)}</PanelLabel>
            <SettingsForm
              config={config}
              onChange={setConfig}
              inspector={inspector}
              onInspect={setInspector}
            />
          </div>
        </aside>

        {/* Center panel — white canvas */}
        <main className="flex min-h-0 bg-canvas">
          <div className="w-64 border-r border-hairline overflow-y-auto thin-scrollbar bg-canvas">
            <div className="px-4 py-3 border-b border-hairline">
              <PanelLabel>{tr(UI.panelFiles, locale)}</PanelLabel>
            </div>
            <FileTree
              files={pkg?.files ?? []}
              selectedFileId={selectedFileId}
              onSelect={(id) => setSelectedFileId(id)}
            />
          </div>

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
                <TabButton
                  label={tr(UI.previewTabKorean, locale)}
                  active={activeTab === "korean"}
                  onClick={() => setActiveTab("korean")}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 thin-scrollbar">
              {!selectedFile && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md px-6">
                    <div
                      className="text-ink font-semibold"
                      style={{
                        fontSize: 40,
                        lineHeight: 1.1,
                        letterSpacing: "-0.28px",
                      }}
                    >
                      {tr(UI.emptyHeroTitle, locale)}
                    </div>
                    <div className="text-ink-muted-48 mt-3" style={{ fontSize: 17 }}>
                      {tr(UI.emptyHeroBody, locale)}
                    </div>
                  </div>
                </div>
              )}
              {selectedFile && activeTab === "preview" && (
                <MarkdownPreview content={selectedFile.content} />
              )}
              {selectedFile && activeTab === "raw" && (
                <RawEditor
                  content={selectedFile.content}
                  onChange={handleEditContent}
                />
              )}
              {selectedFile && activeTab === "korean" && (
                <div className="px-6 py-6">
                  <div className="rounded-lg border border-hairline bg-canvas-parchment p-5">
                    <div className="text-caption uppercase tracking-[0.16em] text-ink-muted-48">
                      {tr(UI.btnKoreanPreview, locale)}
                    </div>
                    <p className="mt-2 text-ink" style={{ fontSize: 17 }}>
                      {tr(UI.koPreviewLine1, locale)}
                    </p>
                    <p className="mt-2 text-ink-muted-48" style={{ fontSize: 14 }}>
                      {tr(UI.koPreviewLine2, locale)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-12 border-t border-hairline px-4 flex items-center justify-between flex-shrink-0">
              <div className="text-fine-print text-ink-muted-48">
                {selectedFile?.lastGeneratedAt
                  ? `${tr(UI.lastGenerated, locale)} ${new Date(selectedFile.lastGeneratedAt).toLocaleTimeString()}`
                  : ""}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  title={tr(UI.btnKoreanPreviewTitle, locale)}
                  className="text-caption px-3 py-1.5 rounded-md border border-hairline bg-surface-pearl text-ink-muted-48 cursor-not-allowed"
                >
                  {tr(UI.btnKoreanPreview, locale)}
                </button>
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

        {/* Right panel — Inspector (flex-1) + Quality/Export footer (fixed) */}
        <aside className="border-l border-hairline bg-canvas-parchment flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <InspectorPanel
              target={inspector}
              report={pkg?.qualityReport ?? null}
              isEnabled={(id) => config.capabilityPacks.includes(id)}
              onToggle={togglePack}
              onClose={() => setInspector({ type: "quality" })}
            />
          </div>
          <QualityFooter
            report={pkg?.qualityReport ?? null}
            onDownload={handleDownloadZip}
            isDownloading={isExporting}
            hasPackage={!!pkg}
            onInspectQuality={() => setInspector({ type: "quality" })}
            inspecting={inspector.type === "quality"}
          />
        </aside>
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
