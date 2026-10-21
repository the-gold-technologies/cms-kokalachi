"use client";

import React, { useRef, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  accentColor?: "teal" | "orange" | "green" | "rose";
}

function AutoExpandingTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(28, textareaRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resize();
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-gray-800 focus:outline-none placeholder:text-gray-400 py-1 resize-none leading-relaxed overflow-hidden font-normal"
    />
  );
}

export function StringListEditor({
  label,
  items = [],
  onChange,
  placeholder = "Add bullet point...",
  icon,
  accentColor = "teal",
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const copy = [...items];
      copy.splice(index + 1, 0, "");
      onChange(copy);
    } else if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      handleRemove(index);
    }
  };

  const colorStyles = {
    teal: {
      badge: "bg-[#0E5A60]/10 text-[#0E5A60]",
      pill: "bg-[#0E5A60]/10 text-[#0E5A60]",
      button: "text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20",
      focusRing: "focus-within:border-[#0E5A60] focus-within:ring-2 focus-within:ring-[#0E5A60]/15",
    },
    orange: {
      badge: "bg-[#D96C2C]/10 text-[#D96C2C]",
      pill: "bg-[#D96C2C]/10 text-[#D96C2C]",
      button: "text-[#D96C2C] hover:text-[#b85419] bg-[#D96C2C]/10 hover:bg-[#D96C2C]/20",
      focusRing: "focus-within:border-[#D96C2C] focus-within:ring-2 focus-within:ring-[#D96C2C]/15",
    },
    green: {
      badge: "bg-emerald-50 text-emerald-700",
      pill: "bg-emerald-50 text-emerald-700",
      button: "text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100",
      focusRing: "focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15",
    },
    rose: {
      badge: "bg-rose-50 text-rose-700",
      pill: "bg-rose-50 text-rose-700",
      button: "text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100",
      focusRing: "focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/15",
    },
  }[accentColor] || {
    badge: "bg-[#0E5A60]/10 text-[#0E5A60]",
    pill: "bg-[#0E5A60]/10 text-[#0E5A60]",
    button: "text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20",
    focusRing: "focus-within:border-[#0E5A60] focus-within:ring-2 focus-within:ring-[#0E5A60]/15",
  };

  return (
    <div className="flex flex-col gap-3 w-full bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm transition-all">
      {/* Header with Icon, Title, Count, and Add Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${colorStyles.badge}`}>
              {icon}
            </div>
          )}
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
            {label}
          </label>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${colorStyles.badge}`}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${colorStyles.button}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-2.5">
        {items.length === 0 ? (
          <div
            onClick={handleAdd}
            className="p-5 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-gray-400" />
            <span>Click to add item or paste multiple lines</span>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 bg-gray-50/80 hover:bg-gray-50/95 border border-gray-200/70 rounded-2xl px-3.5 py-2.5 ${colorStyles.focusRing} focus-within:bg-white focus-within:shadow-xs transition-all group`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5 ${colorStyles.pill}`}
              >
                {idx + 1}
              </div>

              <AutoExpandingTextarea
                value={item}
                onChange={(val) => handleUpdate(idx, val)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                placeholder={placeholder}
              />

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-40 group-hover:opacity-100 shrink-0 mt-0.5"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 px-1">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px]">Enter</kbd> to add next bullet</span>
          <button
            type="button"
            onClick={handleAdd}
            className="text-[11px] font-semibold text-[#0E5A60] hover:underline cursor-pointer"
          >
            + Add another
          </button>
        </div>
      )}
    </div>
  );
}
