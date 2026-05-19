"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownItem = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function Dropdown({
  label,
  value,
  items,
  onChange,
  minWidth = 220,
}: {
  label: string;
  value: string;
  items: DropdownItem[];
  onChange: (id: string) => void;
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = items.find((i) => i.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-hairline bg-canvas px-3 py-1.5 hover:bg-divider-soft transition"
        style={{ minWidth }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
          {label}
        </span>
        <span className="text-caption text-ink truncate">
          {current?.label ?? "—"}
        </span>
        <span className="ml-auto text-ink-muted-48 text-caption">▾</span>
      </button>
      {open && (
        <div
          className="absolute z-50 top-full mt-1 left-0 rounded-md border border-hairline bg-canvas overflow-hidden"
          style={{ minWidth: Math.max(minWidth, 280) }}
        >
          <ul
            className="py-1 max-h-[360px] overflow-y-auto thin-scrollbar"
            role="listbox"
          >
            {items.map((item) => {
              const selected = item.id === value;
              return (
                <li key={item.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.disabled) return;
                      onChange(item.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 transition ${
                      item.disabled
                        ? "text-ink-muted-48 cursor-not-allowed"
                        : selected
                          ? "bg-canvas-parchment text-ink"
                          : "text-ink hover:bg-divider-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-caption font-medium">
                        {item.label}
                      </span>
                      {item.disabled && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-muted-48">
                          Soon
                        </span>
                      )}
                      {!item.disabled && selected && (
                        <span className="text-[10px] text-primary">●</span>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-fine-print text-ink-muted-48 mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
