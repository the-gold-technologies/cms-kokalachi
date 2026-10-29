"use client";

import React, { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

export interface CollapsibleItemCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  deleteTitle?: string;
  extraHeaderActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function CollapsibleItemCard({
  title,
  subtitle,
  badge,
  image,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onDelete,
  deleteTitle = "Delete Item",
  extraHeaderActions,
  children,
  className = "",
  headerClassName = "",
}: CollapsibleItemCardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled) {
      controlledOnToggle?.();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "bg-gray-50/90 border-gray-200 shadow-sm"
          : "bg-gray-50/60 hover:bg-gray-50 border-gray-100 hover:border-gray-200"
      } ${className}`}
    >
      {/* Header Row (Clickable to collapse/expand) */}
      <div
        onClick={handleToggle}
        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer select-none group transition-colors ${
          isOpen ? "border-b border-gray-100/90 bg-gray-50/90" : ""
        } ${headerClassName}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {image && (
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300/60 shadow-xs">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="text-xs font-bold text-teal-800 shrink-0 group-hover:text-teal-900 transition-colors">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100/70 text-teal-800 shrink-0">
                {badge}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-gray-500 truncate max-w-[260px] sm:max-w-[400px]">
                — {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {extraHeaderActions}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title={deleteTitle}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
            title={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronDown
              size={17}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180 text-teal-800" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="p-4 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
