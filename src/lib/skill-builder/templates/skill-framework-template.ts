export const SKILL_FRAMEWORK_REFERENCE = `# AXDD 8-Type Skill Framework

## Purpose

This document defines the 8 AXDD skill package types used to classify agent skills and standard kits.

A package's type determines:
- which files must be present in the kit (matrix-driven),
- how the kit is loaded by the agent harness,
- which validations apply at release time.

---

## 1. simple-skill

A minimal skill package that contains only \`SKILL.md\`.

**Use when**
- The task is simple.
- No references, templates, scripts, or validation assets are required.

**Required files**
- \`SKILL.md\`

**Example use cases**
- Rename files in a folder
- Summarize text
- Convert format
- Create a short checklist

**Difference from adjacent types**
- vs. \`reference-skill\` — no external knowledge to consult.
- vs. \`template-skill\` — no fixed output structure to follow.

---

## 2. reference-skill

A skill that uses one or more reference documents.

**Use when**
- The agent must follow existing code, MD files, style guides, policies, or standards.

**Required files**
- \`SKILL.md\`
- \`references/\`

**Example use cases**
- Apply a company writing style guide
- Apply API design principles
- Cite an internal architecture doc

**Difference from adjacent types**
- vs. \`simple-skill\` — adds a knowledge base.
- vs. \`template-skill\` — knowledge is consulted, not slotted into a fixed shape.

---

## 3. template-skill

A skill that applies predefined output templates.

**Use when**
- The output must follow a fixed document or artifact structure.

**Required files**
- \`SKILL.md\`
- \`templates/\`

**Example use cases**
- Produce a standard PR description
- Produce a meeting notes doc in the team's shape
- Produce a one-pager from a brief

**Difference from adjacent types**
- vs. \`reference-skill\` — the shape of the output is the contract.
- vs. \`script-skill\` — the agent fills the template by reasoning, not by running code.

---

## 4. script-skill

A skill that uses scripts, JSON, CLI commands, or automation helpers.

**Use when**
- A repeatable execution step is needed.
- The agent should call a helper script rather than reason from scratch.

**Required files**
- \`SKILL.md\`
- \`scripts/\`
- \`config/\`

**Example use cases**
- Bump a version + tag a release
- Generate boilerplate from a config
- Run a parameterized data pull

**Difference from adjacent types**
- vs. \`template-skill\` — output is produced by execution, not by filling a doc.
- vs. \`asset-skill\` — focused on doing one repeatable action, not packaging a process.

---

## 5. asset-skill

A skill that packages a complete process or task asset set.

**Use when**
- The work requires references, templates, checklists, examples, or reusable artifacts.
- The package represents a reusable work unit.

**Required files**
- \`SKILL.md\`
- \`references/\`
- \`templates/\`
- \`checklists/\`
- \`examples/\`

**Example use cases**
- A "design review" asset bundle (rubric + templates + sample reviews)
- A "research synthesis" bundle (frameworks + templates + worked examples)

**Difference from adjacent types**
- vs. \`template-skill\` — adds knowledge, gates, and examples around the templates.
- vs. \`full-step-skill\` — no stage-by-stage workflow, no \`WORK_UNIT.json\` / \`HOOKS.json\`.

---

## 6. full-step-skill

A complete workflow kit that includes references, templates, hooks, work units, checklists, tests, and optional scripts.

**Use when**
- The task has multiple workflow stages.
- The agent needs routing, validation, and handoff logic.
- The kit should be reusable across projects.

**Required files**
- \`SKILL.md\`
- \`CATALOG.md\`
- \`README.md\`
- \`WORK_UNIT.json\`
- \`HOOKS.json\`
- \`references/\`
- \`templates/\`
- \`checklists/\`
- \`tests/\`
- \`examples/\`

**Example use cases**
- An end-to-end UX/UI design kit (this kit).
- An end-to-end incident response kit.
- An end-to-end onboarding kit.

**Difference from adjacent types**
- vs. \`asset-skill\` — adds an executable workflow (\`WORK_UNIT.json\`) and routing (\`HOOKS.json\`).
- vs. \`metadata-skill\` — focused on running one workflow well, not on classifying many assets.

> **This AXDD UX/UI Standard Kit is classified as a \`full-step-skill\`.** It ships the full 10-entry tree above, the 6-stage \`WORK_UNIT.json\`, \`HOOKS.json\` routing, and the validation / governance assets required for release.

---

## 7. metadata-skill

A skill that helps the agent discover, classify, or select assets based on metadata.

**Use when**
- There are many reusable assets.
- The agent must choose the right asset by tags, category, owner, version, or status.

**Required files**
- \`SKILL.md\`
- \`CATALOG.md\`
- \`KIT_MANIFEST.json\` or metadata index

**Example use cases**
- A registry that points the agent at the correct kit for an incoming request.
- A discovery layer that picks the right template family by tags.

**Difference from adjacent types**
- vs. \`full-step-skill\` — does not run a workflow itself; it routes to other kits.
- vs. \`reference-skill\` — the knowledge it ships is structured metadata, not prose.

---

## 8. test-skill

A skill focused on validation, QA, sandbox tests, and release checks.

**Use when**
- The goal is not generation but verification.
- The agent must run scenarios, log results, and produce a validation report.

**Required files**
- \`SKILL.md\`
- \`tests/\`
- \`checklists/\`
- \`validation-log-template.md\`

**Example use cases**
- A pre-release sandbox suite for another kit's output.
- An accessibility audit kit.
- A regression scenario library.

**Difference from adjacent types**
- vs. \`full-step-skill\` — only the validation portion, not the generation portion.
- vs. \`asset-skill\` — output is pass / fail evidence, not produced artifacts.
`;
