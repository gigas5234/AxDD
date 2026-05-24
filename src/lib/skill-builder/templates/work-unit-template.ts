import type { SkillConfig } from "@/types/skill";
import { STAGE_METADATA, ALL_STAGES } from "../package-matrix";

export function renderWorkUnitJson(config: SkillConfig): string {
  const stages = (config.workflowStages.length > 0
    ? config.workflowStages
    : ALL_STAGES
  ).map((id) => {
    const meta = STAGE_METADATA[id];
    return {
      id: meta.id,
      title: meta.title,
      order: meta.order,
      purpose: meta.purpose,
      inputs: meta.inputs,
      outputs: meta.outputs,
      usesTemplates: meta.usesTemplates,
      usesReferences: meta.usesReferences,
      usesChecklists: meta.usesChecklists,
      exitCriteria: meta.exitCriteria,
    };
  });

  const doc = {
    kitName: config.skillName,
    category: config.category,
    packageType: config.packageType,
    stages,
  };

  return JSON.stringify(doc, null, 2) + "\n";
}
