import type { OutputFormatSettings, SkillBlock } from "@/types/skill";

export function outputFormatBlock(fmt: OutputFormatSettings): SkillBlock {
  const lines: string[] = [];
  lines.push("### Output Formats");

  switch (fmt.answerStyle) {
    case "concise":
      lines.push(
        "- Keep direct chat responses concise. Use detailed structured output only when producing documents, specifications, templates, or implementation prompts.",
      );
      break;
    case "structured":
      lines.push(
        "- Default to structured output with clear sections, lists, and headings. Skip filler prose.",
      );
      break;
    case "detailed":
      lines.push(
        "- Prefer full structured documentation with sections, examples, risks, and implementation notes.",
      );
      break;
  }

  if (fmt.includeMarkdown) lines.push("- Use Markdown for all longform output.");
  if (fmt.includeJson)
    lines.push("- Emit machine-readable JSON for tokens, specs, or structured data.");
  if (fmt.includeTables)
    lines.push("- Use Markdown tables when comparing options or listing properties.");
  if (fmt.includeChecklists)
    lines.push("- Emit checklists for reviews, acceptance criteria, and QA passes.");
  if (fmt.includeExamples)
    lines.push("- Provide at least one concrete example per produced spec.");
  if (fmt.includeCursorPrompt)
    lines.push(
      "- When producing an implementation handoff, also emit a Cursor-ready prompt block.",
    );

  return {
    id: "output-format",
    category: "output",
    title: "Output Format",
    description: "How the skill should structure its outputs.",
    content: lines.join("\n"),
  };
}
