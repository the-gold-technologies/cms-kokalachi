"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  tooltip?: string;
  accentColor?: "red" | "dark";
}

export function StringListEditor({
  label,
  items = [],
  onChange,
  placeholder = "Add point...",
  accentColor = "red",
}: StringListEditorProps) {
  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, val: string) => {
    if (val.includes("\n")) {
      const splitLines = val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const copy = [...items];
      copy.splice(index, 1, ...splitLines);
      onChange(copy);
      return;
    }

    const copy = [...items];
    copy[index] = val;
    onChange(copy);
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
            {label}
          </label>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#D8232A]">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#D8232A] hover:text-[#b51b21] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div
            onClick={handleAdd}
            className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-[#D8232A]/40 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-[#D8232A]" />
            <span>Click to add your first bullet point</span>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-1.5 focus-within:bg-white focus-within:border-[#D8232A] focus-within:ring-2 focus-within:ring-[#D8232A]/10 transition-all group"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-red-50 text-[#D8232A]">
                <span className="text-[10px] font-bold">{idx + 1}</span>
              </div>

              <input
                type="text"
                value={item}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-gray-800 focus:outline-none placeholder:text-gray-400 py-1.5"
              />

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
