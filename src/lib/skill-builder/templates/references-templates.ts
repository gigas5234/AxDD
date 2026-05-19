import {
  ACCESSIBILITY_CHECKLIST,
  DESIGN_SYSTEM_RULES,
  UI_PATTERNS,
  UX_PRINCIPLES,
} from "../blocks/reference-blocks";
import { CAPABILITY_PACKS } from "../blocks/capability-packs";
import type { CapabilityPack } from "@/types/skill";

export type ReferenceFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

export function buildReferenceFiles(opts: {
  designSystemAwareness: boolean;
  includeAccessibility: boolean;
  capabilityPacks: CapabilityPack[];
}): ReferenceFileSpec[] {
  const files: ReferenceFileSpec[] = [
    {
      fileName: "ux-principles.md",
      content: UX_PRINCIPLES.content,
      generatedFrom: [UX_PRINCIPLES.id],
    },
    {
      fileName: "ui-patterns.md",
      content: UI_PATTERNS.content,
      generatedFrom: [UI_PATTERNS.id],
    },
  ];
  if (opts.designSystemAwareness) {
    files.push({
      fileName: "design-system-rules.md",
      content: DESIGN_SYSTEM_RULES.content,
      generatedFrom: [DESIGN_SYSTEM_RULES.id],
    });
  }
  if (opts.includeAccessibility) {
    files.push({
      fileName: "accessibility-checklist.md",
      content: ACCESSIBILITY_CHECKLIST.content,
      generatedFrom: [ACCESSIBILITY_CHECKLIST.id],
    });
  }
  // Capability pack reference files
  for (const pack of CAPABILITY_PACKS) {
    if (!opts.capabilityPacks.includes(pack.id)) continue;
    if (!pack.referenceFile) continue;
    files.push({
      fileName: pack.referenceFile.fileName,
      content: pack.referenceFile.content,
      generatedFrom: [`pack-${pack.id}`],
    });
  }
  return files;
}
