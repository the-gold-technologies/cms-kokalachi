"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown, Lock, Pencil, X, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

// Admins can rename the website's menu links here. URLs, order and structure are fixed
// (src/lib/navLinks.ts) because the website's pages and menus are built around them.

const LABEL_MAX_LENGTH = 40; // same as NAV_LABEL_MAX_LENGTH in src/lib/navLinks.ts

interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  type: string;
  parent: string;
  order: number;
}

export default function MenuLinksPage() {
  const [links, setLinks] = useState<NavLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<NavLinkItem | null>(null);

  useEffect(() => {
    async function loadNavLinks() {
      try {
        const res = await fetch("/api/nav-links");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) setLinks(json.data);
        else toast.error(json.error ?? "Failed to load navigation links");
      } catch (err) {
        console.error("Failed to load navigation links:", err);
        toast.error("Failed to load navigation links");
      } finally {
        setLoading(false);
      }
    }
    loadNavLinks();
  }, []);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rootLinks = links
    .filter((l) => l.parent === "-" || !l.parent)
    .sort((a, b) => a.order - b.order);

  const getTypeBadge = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("dropdown item")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-indigo-50 text-indigo-700">
          DROPDOWN ITEM
        </span>
      );
    }
    if (t.includes("dropdown")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-purple-50 text-purple-600">
          DROPDOWN
        </span>
      );
    }
    if (t.includes("action")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-amber-50 text-amber-700 border border-amber-100">
          ACTION BUTTON
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-blue-50 text-[#002B5C]">
        MAIN LINK
      </span>
    );
  };

  const editButton = (link: NavLinkItem) => (
    <button
      type="button"
      onClick={() => setEditing(link)}
      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-[#0E5A60] hover:border-[#0E5A60]/30 hover:bg-[#0E5A60]/10 transition-colors cursor-pointer"
      title={`Rename "${link.label}"`}
      aria-label={`Rename ${link.label}`}
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
  );

  const urlCell = (url: string, small = false) => (
    <td
      className={`${small ? "py-4 text-xs" : "py-5 text-sm"} px-6 font-mono text-slate-400 max-w-[280px]`}
      title={`${url} (fixed, can't be changed)`}
    >
      <span className="flex items-center gap-1.5 min-w-0">
        <Lock className="w-3 h-3 shrink-0 text-slate-300" />
        <span className="truncate">{url}</span>
      </span>
    </td>
  );

  return (
    <section className="flex flex-col gap-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
          Navigation Links
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-normal">
          Rename the links in the website&apos;s navigation bar with the edit icon in the Action
          column. The pages they open (URLs) are fixed and can&apos;t be changed here.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-2 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-12 text-center text-xs font-medium text-slate-400">
            Loading navigation structure...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-transparent">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-24 whitespace-nowrap">
                    ORDER
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    NAME
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-40 whitespace-nowrap">
                    TYPE
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-56 whitespace-nowrap">
                    URL (FIXED)
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-24 whitespace-nowrap">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                {rootLinks.map((root, rootIndex) => {
                  const children = links
                    .filter((c) => c.parent === root.id)
                    .sort((a, b) => a.order - b.order);
                  const hasChildren = children.length > 0;
                  const isExpanded = !!expandedParents[root.id];

                  return (
                    <React.Fragment key={root.id}>
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-5 px-6 text-sm font-semibold text-slate-600 whitespace-nowrap">
                          {rootIndex + 1}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleParent(root.id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 cursor-pointer shrink-0"
                                aria-label={
                                  isExpanded ? "Hide dropdown links" : "Show dropdown links"
                                }
                                aria-expanded={isExpanded}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                                )}
                              </button>
                            ) : (
                              <div className="w-6 shrink-0" />
                            )}
                            <span
                              className={`text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight line-clamp-1 select-none ${hasChildren ? "cursor-pointer" : ""}`}
                              onClick={() => hasChildren && toggleParent(root.id)}
                              title={root.label}
                            >
                              {root.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center whitespace-nowrap">
                          {getTypeBadge(root.type)}
                        </td>
                        {urlCell(root.url)}
                        <td className="py-5 px-6 text-center">{editButton(root)}</td>
                      </tr>

                      {isExpanded &&
                        children.map((child, childIndex) => (
                          <tr
                            key={child.id}
                            className="bg-[#fcfdff]/70 hover:bg-[#f5f8ff] transition-colors"
                          >
                            <td className="py-4 px-6 text-sm font-medium text-gray-400 pl-12 whitespace-nowrap">
                              {rootIndex + 1}.{childIndex + 1}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2.5 pl-6 border-l-2 border-gray-100/60 min-w-0">
                                <span className="text-gray-300 text-sm shrink-0">↳</span>
                                <span
                                  className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-1"
                                  title={child.label}
                                >
                                  {child.label}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center whitespace-nowrap">
                              {getTypeBadge(child.type)}
                            </td>
                            {urlCell(child.url, true)}
                            <td className="py-4 px-6 text-center">{editButton(child)}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <RenameLinkModal
          link={editing}
          onClose={() => setEditing(null)}
          onSaved={(data) => {
            setLinks(data);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

// Popup for renaming one menu link. Saves straight away; the URL is shown but locked.
function RenameLinkModal({
  link,
  onClose,
  onSaved,
}: {
  link: NavLinkItem;
  onClose: () => void;
  onSaved: (links: NavLinkItem[]) => void;
}) {
  const [label, setLabel] = useState(link.label);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = label.trim();
  const error = !trimmed
    ? "Name can't be empty"
    : trimmed.length > LABEL_MAX_LENGTH
      ? `Keep it to ${LABEL_MAX_LENGTH} characters or fewer`
      : null;
  const unchanged = trimmed === link.label;

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  // Close on Escape (not while saving)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saving, onClose]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || saving) return;
    if (unchanged) return onClose();
    setSaving(true);
    try {
      const res = await fetch("/api/nav-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: [{ id: link.id, label: trimmed }] }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(`Renamed to "${trimmed}"`);
      onSaved(json.data);
    } catch (err: any) {
      console.error("Failed to rename menu link:", err);
      toast.error(err?.message || "Failed to rename menu link");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={() => !saving && onClose()} />
      <form
        onSubmit={handleSave}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-link-title"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 flex flex-col gap-5 z-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 id="rename-link-title" className="text-base sm:text-lg font-bold text-gray-900">
                Rename Menu Link
              </h3>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {link.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nav-link-name" className="text-sm font-bold text-slate-700">
            Name
          </label>
          <input
            id="nav-link-name"
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={saving}
            aria-invalid={!!error}
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] transition-all ${
              error ? "border-red-300" : "border-slate-200"
            }`}
          />
          <div className="flex items-center justify-between text-[11px]">
            <span className={error ? "text-red-500 font-medium" : "text-slate-400"}>
              {error ?? `Was "${link.label}"`}
            </span>
            <span className={trimmed.length > LABEL_MAX_LENGTH ? "text-red-500" : "text-slate-400"}>
              {trimmed.length}/{LABEL_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">URL</span>
          <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm text-slate-500">
            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{link.url}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            The page this link opens is fixed and can&apos;t be changed.
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!error || saving}
            className={`flex-1 px-5 py-3 rounded-xl bg-[#0E5A60] text-white font-semibold hover:bg-[#0A4347] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              error || saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
