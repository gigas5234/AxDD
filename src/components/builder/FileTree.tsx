"use client";

import type { GeneratedFile } from "@/types/skill";
import { useLocale, tr } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

type Node = {
  name: string;
  fullPath: string;
  isDir: boolean;
  fileId?: string;
  children: Node[];
};

function buildTree(files: GeneratedFile[]): Node {
  const root: Node = { name: "", fullPath: "", isDir: true, children: [] };
  for (const f of files) {
    const parts = f.path.split("/").filter(Boolean);
    let cursor = root;
    for (let i = 0; i < parts.length; i++) {
      const isLeaf = i === parts.length - 1;
      const name = parts[i];
      const fullPath = parts.slice(0, i + 1).join("/");
      let existing = cursor.children.find((c) => c.name === name);
      if (!existing) {
        existing = {
          name,
          fullPath,
          isDir: !isLeaf,
          fileId: isLeaf ? f.id : undefined,
          children: [],
        };
        cursor.children.push(existing);
      }
      cursor = existing;
    }
  }
  sortTree(root);
  return root;
}

function sortTree(n: Node) {
  n.children.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  n.children.forEach(sortTree);
}

function NodeRow({
  node,
  depth,
  selectedFileId,
  editedFileIds,
  onSelect,
}: {
  node: Node;
  depth: number;
  selectedFileId: string | null;
  editedFileIds: Set<string>;
  onSelect: (fileId: string) => void;
}) {
  const pad = { paddingLeft: 12 + depth * 14 };
  if (node.isDir) {
    return (
      <div>
        <div
          className="text-caption text-ink-muted-48 py-1.5 select-none"
          style={pad}
        >
          <span className="mr-1 text-ink-muted-48">▾</span>
          {node.name || "/"}
        </div>
        <div>
          {node.children.map((c) => (
            <NodeRow
              key={c.fullPath || c.name}
              node={c}
              depth={depth + 1}
              selectedFileId={selectedFileId}
              editedFileIds={editedFileIds}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    );
  }
  const isSelected = node.fileId === selectedFileId;
  const isEdited = node.fileId ? editedFileIds.has(node.fileId) : false;
  return (
    <button
      type="button"
      onClick={() => node.fileId && onSelect(node.fileId)}
      className={`w-full text-left text-[13.5px] py-1.5 transition flex items-center gap-2 ${
        isSelected
          ? "bg-canvas-parchment text-ink font-semibold border-l-2 border-primary"
          : "text-ink-muted-80 hover:bg-divider-soft border-l-2 border-transparent"
      }`}
      style={pad}
    >
      <span className="text-ink-muted-48">·</span>
      <span className="truncate">{node.name}</span>
      {isEdited && (
        <span
          className="ml-auto mr-3 inline-block w-1.5 h-1.5 rounded-full bg-primary"
          title="Edited"
          aria-label="Edited"
        />
      )}
    </button>
  );
}

export function FileTree({
  files,
  selectedFileId,
  onSelect,
}: {
  files: GeneratedFile[];
  selectedFileId: string | null;
  onSelect: (fileId: string) => void;
}) {
  const { locale } = useLocale();
  if (files.length === 0) {
    return (
      <div className="text-caption text-ink-muted-48 px-4 py-5">
        {tr(UI.fileTreeEmpty, locale)}
      </div>
    );
  }
  const tree = buildTree(files);
  const editedFileIds = new Set(files.filter((f) => f.isEdited).map((f) => f.id));
  return (
    <div className="py-2">
      {tree.children.map((c) => (
        <NodeRow
          key={c.fullPath}
          node={c}
          depth={0}
          selectedFileId={selectedFileId}
          editedFileIds={editedFileIds}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
