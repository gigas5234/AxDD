"use client";

import { useLocale, tr } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

export function QualityFooter({
  onDownload,
  isDownloading,
  hasPackage,
}: {
  onDownload: () => void;
  isDownloading: boolean;
  hasPackage: boolean;
}) {
  const { locale } = useLocale();
  return (
    <div className="border-t border-hairline bg-canvas-parchment px-3 py-3 flex-shrink-0">
      <button
        type="button"
        onClick={onDownload}
        disabled={!hasPackage || isDownloading}
        className="w-full inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[22px] py-[10px] text-[15px] font-normal hover:opacity-95 disabled:opacity-50 transition"
      >
        {isDownloading ? tr(UI.qfDownloading, locale) : tr(UI.qfDownload, locale)}
      </button>
    </div>
  );
}
