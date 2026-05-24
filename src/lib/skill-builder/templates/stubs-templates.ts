export type StubFileSpec = {
  fileName: string;
  content: string;
  language: "markdown" | "json" | "text";
  generatedFrom: string[];
};

// ── script-skill stubs ──────────────────────────────────────────────────────
const SCRIPT_EXAMPLE = `// scripts/example-script.ts
//
// Skeleton script for a \`script-skill\` package. Replace with the actual
// repeatable execution step this kit needs the agent to call.
//
// Usage (from the kit consumer):
//   tsx scripts/example-script.ts --input <path> --out <path>
//
// Read configuration from config/script-config.json.

import { readFileSync } from "node:fs";
import { join } from "node:path";

type ScriptConfig = {
  name: string;
  version: string;
  options: Record<string, unknown>;
};

function loadConfig(): ScriptConfig {
  const raw = readFileSync(
    join(__dirname, "..", "config", "script-config.json"),
    "utf8",
  );
  return JSON.parse(raw) as ScriptConfig;
}

function main(): void {
  const cfg = loadConfig();
  // eslint-disable-next-line no-console
  console.log("[" + cfg.name + " v" + cfg.version + "] running with:", cfg.options);
  // ... actual work goes here ...
}

main();
`;

const SCRIPT_CONFIG = `{
  "name": "example-script",
  "version": "0.1.0",
  "options": {
    "dryRun": true,
    "verbose": false
  }
}
`;

export function buildScriptSkillFiles(): StubFileSpec[] {
  return [
    {
      fileName: "example-script.ts",
      content: SCRIPT_EXAMPLE,
      language: "text",
      generatedFrom: ["stub-script-example"],
    },
    {
      fileName: "script-config.json",
      content: SCRIPT_CONFIG,
      language: "json",
      generatedFrom: ["stub-script-config"],
    },
  ];
}

// ── metadata-skill stubs ────────────────────────────────────────────────────
const KIT_MANIFEST = `{
  "schemaVersion": "0.1",
  "kitId": "<kit-id>",
  "kitName": "<Kit Name>",
  "version": "0.1.0",
  "owner": "<team or person>",
  "tags": ["ux-ui", "axdd"],
  "entrypoint": "SKILL.md",
  "catalog": "CATALOG.md"
}
`;

const METADATA_INDEX = `{
  "schemaVersion": "0.1",
  "assets": [
    {
      "id": "skill",
      "type": "skill-entry",
      "path": "SKILL.md",
      "tags": ["entry"]
    },
    {
      "id": "catalog",
      "type": "catalog",
      "path": "CATALOG.md",
      "tags": ["index"]
    }
  ]
}
`;

export function buildMetadataSkillFiles(): StubFileSpec[] {
  return [
    {
      fileName: "KIT_MANIFEST.json",
      content: KIT_MANIFEST,
      language: "json",
      generatedFrom: ["stub-kit-manifest"],
    },
    {
      fileName: "index.json",
      content: METADATA_INDEX,
      language: "json",
      generatedFrom: ["stub-metadata-index"],
    },
  ];
}

// ── asset-skill stub ────────────────────────────────────────────────────────
const ASSET_INDEX = `# Asset Index

Inventory of bundled assets for this kit.

| id | path | type | description |
|----|------|------|-------------|
| a-1 | assets/example.png | image | Replace with a real asset. |

## Conventions
- Keep asset filenames stable across versions — links from other kits depend on them.
- Document license / origin per asset in this file.
`;

export function buildAssetSkillFiles(): StubFileSpec[] {
  return [
    {
      fileName: "asset-index.md",
      content: ASSET_INDEX,
      language: "markdown",
      generatedFrom: ["stub-asset-index"],
    },
  ];
}
