import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { GeneratedPackage } from "@/types/skill";

export async function downloadPackageAsZip(pkg: GeneratedPackage): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder(pkg.packageName);
  if (!root) throw new Error("Failed to create package root in ZIP.");

  const prefix = `${pkg.packageName}/`;
  for (const f of pkg.files) {
    const relPath = f.path.startsWith(prefix) ? f.path.slice(prefix.length) : f.path;
    root.file(relPath, f.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${pkg.packageName}.zip`);
}
