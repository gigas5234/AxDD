import type {
  CapabilityPack,
  SkillConfig,
  WorkflowModule,
} from "@/types/skill";
import { CAPABILITY_PACKS } from "./blocks/capability-packs";
import { WORKFLOW_BLOCKS } from "./blocks/workflow-blocks";

export type DependencyViolation = {
  source: { kind: "pack" | "workflow"; id: string; label: string };
  missing: { kind: "pack" | "workflow"; id: string; label: string };
};

export function checkDependencies(config: SkillConfig): DependencyViolation[] {
  const violations: DependencyViolation[] = [];

  // ── Capability pack dependencies ─────────────────────────────────────────
  for (const packId of config.capabilityPacks) {
    const pack = CAPABILITY_PACKS.find((p) => p.id === packId);
    if (!pack?.dependencies) continue;
    for (const depId of pack.dependencies) {
      if (!config.capabilityPacks.includes(depId)) {
        const dep = CAPABILITY_PACKS.find((p) => p.id === depId);
        violations.push({
          source: { kind: "pack", id: pack.id, label: pack.label },
          missing: { kind: "pack", id: depId, label: dep?.label ?? depId },
        });
      }
    }
  }

  // ── Workflow module dependencies ─────────────────────────────────────────
  for (const wfId of config.workflowModules) {
    const wf = WORKFLOW_BLOCKS[wfId];
    if (!wf?.dependencies) continue;
    for (const depIdStr of wf.dependencies) {
      const depId = depIdStr as WorkflowModule;
      if (!config.workflowModules.includes(depId)) {
        const dep = WORKFLOW_BLOCKS[depId];
        violations.push({
          source: { kind: "workflow", id: wfId, label: wf.title },
          missing: { kind: "workflow", id: depId, label: dep?.title ?? depId },
        });
      }
    }
  }

  return violations;
}

export function violationsForItem(
  violations: DependencyViolation[],
  kind: "pack" | "workflow",
  id: string,
): DependencyViolation[] {
  return violations.filter(
    (v) => v.source.kind === kind && v.source.id === id,
  );
}

export function packHasUnmetDeps(
  violations: DependencyViolation[],
  packId: CapabilityPack,
): boolean {
  return violations.some(
    (v) => v.source.kind === "pack" && v.source.id === packId,
  );
}

export function workflowHasUnmetDeps(
  violations: DependencyViolation[],
  wfId: WorkflowModule,
): boolean {
  return violations.some(
    (v) => v.source.kind === "workflow" && v.source.id === wfId,
  );
}
