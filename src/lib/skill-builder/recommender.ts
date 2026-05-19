import type {
  CapabilityPack,
  SkillCategory,
  SkillConfig,
  WorkflowModule,
} from "@/types/skill";
import { CATEGORY_REGISTRY } from "./categories";
import { CAPABILITY_PACKS } from "./blocks/capability-packs";
import { WORKFLOW_BLOCKS } from "./blocks/workflow-blocks";
import { RECIPES, applyRecipeToConfig, type Recipe } from "./recipes";
import { buildDefaultConfigForCategory } from "./default-preset";
import {
  CATEGORY_LABELS,
  PACK_LABELS,
  WORKFLOW_LABELS,
} from "@/lib/i18n/strings";

// ─────────────────────────────────────────────────────────────────────────────
// Tokenization & scoring
// ─────────────────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  // EN
  "the", "and", "for", "with", "from", "into", "that", "this", "have",
  "want", "need", "make", "build", "create", "design", "use", "using", "your",
  // KO 조사·자주 쓰는 어미
  "이", "가", "을", "를", "은", "는", "의", "에", "에서", "하고", "으로", "로",
  "만들", "만들어", "해줘", "하고싶", "원해", "필요", "사용",
]);

function tokenize(input: string): string[] {
  const normalized = input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[.,!?;:()[\]{}<>'"`/\\|、。·]+/g, " ");
  const raw = normalized
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
    .filter((t) => !STOPWORDS.has(t));

  // For Korean tokens (≥ 4 chars), also emit overlapping bigrams to catch compound words.
  // e.g. "온보딩화면" → "온보딩화면", "온보", "보딩", "딩화", "화면"
  const expanded = new Set<string>(raw);
  for (const tok of raw) {
    if (tok.length >= 4 && /[가-힯]/.test(tok)) {
      for (let i = 0; i + 2 <= tok.length; i++) {
        expanded.add(tok.slice(i, i + 2));
      }
    }
  }
  return Array.from(expanded);
}

function scoreText(
  tokens: string[],
  text: string,
): { score: number; matched: string[] } {
  const lowered = text.toLowerCase();
  const matched = new Set<string>();
  let score = 0;
  for (const tok of tokens) {
    if (lowered.includes(tok)) {
      matched.add(tok);
      // Longer matches weight more
      score += tok.length >= 3 ? 2 : 1;
    }
  }
  return { score, matched: Array.from(matched) };
}

function combine(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation output shape
// ─────────────────────────────────────────────────────────────────────────────

export type ScoredCategory = {
  id: SkillCategory;
  score: number;
  matchedTokens: string[];
};

export type ScoredRecipe = {
  recipe: Recipe;
  score: number;
  matchedTokens: string[];
};

export type ScoredPack = {
  id: CapabilityPack;
  score: number;
  matchedTokens: string[];
};

export type ScoredWorkflow = {
  id: WorkflowModule;
  score: number;
  matchedTokens: string[];
};

export type Recommendation = {
  query: string;
  category: ScoredCategory | null;
  recipe: ScoredRecipe | null;
  packs: ScoredPack[];
  workflows: ScoredWorkflow[];
  hasAnyMatch: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Recommend
// ─────────────────────────────────────────────────────────────────────────────

export function recommend(query: string): Recommendation {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return {
      query,
      category: null,
      recipe: null,
      packs: [],
      workflows: [],
      hasAnyMatch: false,
    };
  }

  // Categories — only available ones
  const categoryScores: ScoredCategory[] = CATEGORY_REGISTRY.filter(
    (c) => c.status === "available",
  )
    .map((c) => {
      const i18n = CATEGORY_LABELS[c.id];
      const text = combine(
        c.label,
        c.shortDescription,
        i18n?.label.en,
        i18n?.label.ko,
        i18n?.shortDescription.en,
        i18n?.shortDescription.ko,
      );
      const { score, matched } = scoreText(tokens, text);
      return { id: c.id, score, matchedTokens: matched };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const bestCategory = categoryScores[0] ?? null;

  // Recipes
  const recipeScores: ScoredRecipe[] = RECIPES.map((r) => {
    const text = combine(r.name.en, r.name.ko, r.goal.en, r.goal.ko);
    const { score, matched } = scoreText(tokens, text);
    return { recipe: r, score, matchedTokens: matched };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const bestRecipe = recipeScores[0] ?? null;

  // Capability Packs
  const packScores: ScoredPack[] = CAPABILITY_PACKS.map((p) => {
    const i18n = PACK_LABELS[p.id];
    const text = combine(
      p.label,
      p.summary,
      p.sourceInspiration,
      i18n?.label.en,
      i18n?.label.ko,
      i18n?.summary.en,
      i18n?.summary.ko,
    );
    const { score, matched } = scoreText(tokens, text);
    return { id: p.id, score, matchedTokens: matched };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Workflow modules
  const workflowEntries = Object.entries(WORKFLOW_BLOCKS) as Array<
    [WorkflowModule, (typeof WORKFLOW_BLOCKS)[WorkflowModule]]
  >;
  const workflowScores: ScoredWorkflow[] = workflowEntries
    .map(([id, block]) => {
      const i18n = WORKFLOW_LABELS[id];
      const text = combine(
        block.title,
        block.description,
        i18n?.en,
        i18n?.ko,
      );
      const { score, matched } = scoreText(tokens, text);
      return { id, score, matchedTokens: matched };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const hasAnyMatch =
    !!bestCategory ||
    !!bestRecipe ||
    packScores.length > 0 ||
    workflowScores.length > 0;

  return {
    query,
    category: bestCategory,
    recipe: bestRecipe,
    packs: packScores,
    workflows: workflowScores,
    hasAnyMatch,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply
// ─────────────────────────────────────────────────────────────────────────────

const MAX_PACKS = 6;
const MAX_WORKFLOWS = 12;

export function applyRecommendationToConfig(
  rec: Recommendation,
  baseConfig: SkillConfig,
): SkillConfig {
  // 1) Switch category if a different one was recommended.
  // Recipes don't carry a category; if only a recipe was matched, keep the current category.
  const targetCategory: SkillCategory =
    rec.category?.id ?? baseConfig.category;

  let next: SkillConfig =
    targetCategory !== baseConfig.category
      ? buildDefaultConfigForCategory(targetCategory)
      : { ...baseConfig };

  // 2) If a recipe was matched, apply its packs/workflows/style
  if (rec.recipe) {
    next = applyRecipeToConfig(rec.recipe.recipe, next);
  }

  // 3) Add any extra recommended packs not already in the config
  const extraPacks = rec.packs
    .map((p) => p.id)
    .filter((id) => !next.capabilityPacks.includes(id));
  if (extraPacks.length > 0) {
    next = {
      ...next,
      capabilityPacks: [...next.capabilityPacks, ...extraPacks].slice(
        0,
        MAX_PACKS,
      ),
    };
  }

  // 4) Add any extra recommended workflows
  const extraWorkflows = rec.workflows
    .map((w) => w.id)
    .filter((id) => !next.workflowModules.includes(id));
  if (extraWorkflows.length > 0) {
    next = {
      ...next,
      workflowModules: [...next.workflowModules, ...extraWorkflows].slice(
        0,
        MAX_WORKFLOWS,
      ),
    };
  }

  return { ...next, updatedAt: new Date().toISOString() };
}
