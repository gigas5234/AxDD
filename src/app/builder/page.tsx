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

type PreviewTab = "preview" | "raw" | "korean";

export default function BuilderPage() {
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
    label: c.label,
    description: c.shortDescription,
    disabled: c.status === "coming-soon",
  }));

  const presetItems: DropdownItem[] = PRESETS.map((p) => ({
    id: p.id,
    label: p.name,
    description: p.bestFor,
    disabled: p.status === "coming-soon",
  }));

  const hasPackage = pkg !== null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas-parchment text-ink">
      {/* Global nav — pure black, 44px */}
      <header className="relative z-40 h-11 bg-surface-black text-body-on-dark flex items-center px-5 flex-shrink-0">
        <Link href="/" className="text-nav-link font-medium hover:opacity-80">
          AxDD Skill Builder
        </Link>
        <nav className="ml-8 flex items-center gap-5 text-nav-link">
          <span className="text-body-on-dark">UX/UI</span>
          <span className="text-body-on-dark/50">Product</span>
          <span className="text-body-on-dark/50">Frontend</span>
          <span className="text-body-on-dark/50">Design System</span>
        </nav>
        <div className="ml-auto text-nav-link text-body-on-dark/70">
          Static MVP
        </div>
      </header>

      {/* Sub-nav — frosted parchment with Category + Preset dropdowns */}
      <div
        className="relative z-30 bg-canvas-parchment/80 backdrop-blur-md border-b border-hairline flex items-center px-5 flex-shrink-0 gap-3"
        style={{ height: 52 }}
      >
        <Dropdown
          label="Category"
          value="ux-ui"
          items={categoryItems}
          onChange={() => {
            /* Only ux-ui is selectable in MVP; other items are disabled. */
          }}
          minWidth={240}
        />
        <Dropdown
          label="Preset"
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
            {isGenerating ? "Generating…" : "Generate Skill Package"}
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
              {isGenerating ? "Generating…" : hasPackage ? "Re-generate" : "Generate"}
            </button>
            <button
              type="button"
              onClick={handleResetToPreset}
              className="inline-flex items-center justify-center rounded-md border border-hairline bg-surface-pearl px-3 py-[7px] text-caption text-ink-muted-80 hover:bg-divider-soft transition"
              title="Restore settings from the current preset's defaults"
            >
              Reset
            </button>
          </div>

          <div className="p-4 space-y-3">
            <PanelLabel>Detailed settings</PanelLabel>
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
              <PanelLabel>Files</PanelLabel>
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
                      <span className="text-[11px] text-primary">edited</span>
                    )}
                  </>
                ) : (
                  <span className="text-caption text-ink-muted-48">
                    Generate a package and select a file.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <TabButton
                  label="Preview"
                  active={activeTab === "preview"}
                  onClick={() => setActiveTab("preview")}
                />
                <TabButton
                  label="Raw"
                  active={activeTab === "raw"}
                  onClick={() => setActiveTab("raw")}
                />
                <TabButton
                  label="Korean"
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
                      Choose a preset and generate your first skill package.
                    </div>
                    <div className="text-ink-muted-48 mt-3" style={{ fontSize: 17 }}>
                      The file tree, preview, and quality score appear here once
                      the package is generated.
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
                      Korean Preview
                    </div>
                    <p className="mt-2 text-ink" style={{ fontSize: 17 }}>
                      한글 미리보기는 AI 번역 단계가 연결된 이후에 제공됩니다.
                      MVP에서는 토큰 사용량을 줄이기 위해 비활성화되어 있습니다.
                    </p>
                    <p className="mt-2 text-ink-muted-48" style={{ fontSize: 14 }}>
                      Korean preview is generated on demand to reduce token
                      usage. Available in Phase 2 (AI Assist).
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-12 border-t border-hairline px-4 flex items-center justify-between flex-shrink-0">
              <div className="text-fine-print text-ink-muted-48">
                {selectedFile?.lastGeneratedAt
                  ? `Last generated ${new Date(selectedFile.lastGeneratedAt).toLocaleTimeString()}`
                  : ""}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  title="Korean preview is available after AI integration (Phase 2)."
                  className="text-caption px-3 py-1.5 rounded-md border border-hairline bg-surface-pearl text-ink-muted-48 cursor-not-allowed"
                >
                  Korean Preview
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateFile}
                  disabled={!selectedFile}
                  title="Regenerate this file deterministically from the current config."
                  className="text-caption px-3 py-1.5 rounded-md border border-hairline bg-surface-pearl text-ink-muted-80 hover:bg-divider-soft disabled:opacity-50"
                >
                  Regenerate File
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
