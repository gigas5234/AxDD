# AXDD Standard Kit Composer — Release Notes

## v0.1.1 — Skill Depth Pass

Make the generated AXDD UX/UI Standard Kit less like a shell and more like a usable workflow kit. Deterministic — no new product features, no AI integration.

### Highlights

- **30 files generated** for the default `AXDD UX/UI Standard Kit` (was 24 in v0.1).
- **`references/stage-guides/` added** — one deep guide per workflow stage:
  - `requirement-intake-guide.md`
  - `ux-foundation-guide.md`
  - `ui-design-foundation-guide.md`
  - `prototype-planning-guide.md`
  - `review-validation-guide.md`
  - `handoff-guide.md`
  
  Each guide includes Purpose, When to use, Required + Optional inputs, Procedure, Decision rules, Output contract, Quality gate, Failure handling, Example input, Example output, and Handoff to next stage.

- **`WORK_UNIT.json` depth fields added** (per stage): `entryCriteria`, `procedure`, `decisionRules`, `qualityGate`, `failureHandling`, `nextStage`. Existing fields preserved.

- **`HOOKS.json` depth fields added** (per hook): `confidence`, `fallbackStage`, `requiresContext`, `skipIf`. Existing routing preserved.

- **Templates strengthened** so a designer or AI agent can produce real outputs:
  - `ux-brief-template.md` — full meta, problem framing, success table, scope, constraints, unknowns, risks, output contract, exit criteria.
  - `screen-spec-template.md` — identity, primary action, hierarchy, components, all 4 states, responsive, accessibility, implementation notes, output contract, exit criteria.
  - `design-review-template.md` — audit grid, findings table, prioritization, scenario results, accepted exceptions, output contract.
  - `cursor-prompt-template.md` — context, embedded spec, tokens, acceptance criteria, out-of-scope, engineer handoff checklist.

- **Checklists strengthened** — every checklist is now a 5-column table: `Item / Evidence / Issue / Fix / Accepted exception`. Files: `ux-foundation-checklist.md`, `ui-design-checklist.md`, `handoff-checklist.md`, `release-checklist.md`.

- **CATALOG.md** gains a new top-level `## Workflow Skills` section listing each stage as a `stage-skill` with id, type, when-to-use, required inputs, outputs, related templates / references / checklists, quality gate, next stage, and stage-guide path. Stage-guide files appear as catalog entries.

- **README.md** package tree now lists all reference files (including pack-driven `design-taste.md`, `web-best-practices.md`, `tailwind-mapping.md`) and explains the role of every file in the kit.

### Quality checker

Added five new checks (no breaking changes):

1. `references/stage-guides/` folder exists.
2. All 6 stage-guide files are present.
3. `CATALOG.md` references every stage-guide path.
4. `WORK_UNIT.json` contains `entryCriteria`, `procedure`, `decisionRules`, `qualityGate`, `failureHandling`, `nextStage` for each stage.
5. `README.md` package tree mentions `CATALOG.md`, `WORK_UNIT.json`, `HOOKS.json`, `checklists/`, `tests/`.

### Verification

- Default kit: **30 files**, **JSON validity: passed** (`WORK_UNIT.json`, `HOOKS.json`), **quality 98 / 100, 0 fails**.
- Remaining warning is the intentional "rewrite the default description" customization nudge.
- `tsc --noEmit` clean. ZIP export path unchanged.

---

## v0.1 — AXDD Standard Kit Composer

First demo build of the AXDD Standard Kit Composer.

### Highlights

- Pivot from single-file SKILL.md generator to a full AXDD Standard Kit composer.
- 8 `SkillPackageType` values in the data model; default preset is `AXDD UX/UI Standard Kit` (`category: ux-ui`, `packageType: full-step-skill`).
- `REQUIRED_FILES_BY_TYPE` matrix as the single source of truth shared by `generatePackage()` and the quality checker.
- Generated kit (24 files):
  - `SKILL.md`, `CATALOG.md`, `README.md`, `WORK_UNIT.json` (6 stages), `HOOKS.json` (6 hooks)
  - `references/`, `templates/` (including the enterprise `figma-instruction-template.md`), `checklists/`, `tests/`, `examples/`
- `SKILL.md` workflow section renders from `STAGE_METADATA` for full-step kits; legacy presets keep the old workflow-modules rendering.
- Quality checker: matrix presence, CATALOG cross-refs, JSON validity, 6-stage / 6-hook structure, hook collision detection, Figma fallback, governance files.
- Builder UI:
  - `AXDD Standard Kit Composer · v0.1` chip in header.
  - Live demo summary chips (type / files / JSON / quality).
  - Workflow section renders as a locked 6-stage list for full-step kits.
  - Package Options shows the full Standard Kit; matrix-required entries forced-checked.
  - Korean Preview removed from the MVP UI (deferred to Phase 2).
- Deterministic generation — no AI API in the MVP.
