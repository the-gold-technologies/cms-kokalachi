"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2, Tag, Compass } from "lucide-react";
import toast from "react-hot-toast";

interface VibeCategory {
  id: string;
  label: string;
}

export function VibeFiltersSection({
  initialData,
  onSaved,
}: {
  initialData?: any;
  onSaved?: (categories: VibeCategory[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [sidebarTitle, setSidebarTitle] = useState("");
  const [emptyStateText, setEmptyStateText] = useState("");
  const [categories, setCategories] = useState<VibeCategory[]>([]);

  useEffect(() => {
    if (initialData) {
      setSidebarTitle(initialData.sidebarTitle ?? "");
      setEmptyStateText(initialData.emptyStateText ?? "");
      if (Array.isArray(initialData.categories)) {
        setCategories(
          initialData.categories.map((c: any) => ({
            id: c.id ?? "",
            label: c.label ?? "",
          }))
        );
      }
    }
  }, [initialData]);

  const handleAddCategory = () => {
    setCategories((prev) => [
      ...prev,
      { id: "", label: "" },
    ]);
  };

  const handleUpdateCategory = (index: number, field: keyof VibeCategory, val: string) => {
    setCategories((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        sidebarTitle,
        emptyStateText,
        categories: categories.filter((c) => c.id.trim() !== "" || c.label.trim() !== ""),
      };

      const res = await fetch("/api/journeys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "JourneysFilterSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Vibe filter categories saved successfully!");
        if (onSaved) onSaved(payload.categories);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save vibe filters");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving vibe filters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="Manage Vibe Filters (Filter by Vibe)"
        description="Add, edit, or remove the vibe filter categories (e.g. Trending, Women Only, Adventure) used to filter journeys across the website and homepage."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-6 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Sidebar Heading"
              value={sidebarTitle}
              onChange={(e) => setSidebarTitle(e.target.value)}
              placeholder="e.g. Filter by Vibe"
            />
            <InputField
              label="Empty State Message"
              value={emptyStateText}
              onChange={(e) => setEmptyStateText(e.target.value)}
              placeholder="e.g. No journeys found for this category yet."
            />
          </div>

          {/* Vibe Categories List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0E5A60]" /> Vibe Categories ({categories.length})
              </label>
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Vibe Filter
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex flex-col gap-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#D96C2C]" /> Filter #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(idx)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove Filter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <InputField
                      label="Category ID / Key *"
                      value={cat.id}
                      onChange={(e) => handleUpdateCategory(idx, "id", e.target.value)}
                      placeholder="e.g. Trending"
                      required
                    />
                    <InputField
                      label="Display Label *"
                      value={cat.label}
                      onChange={(e) => handleUpdateCategory(idx, "label", e.target.value)}
                      placeholder="e.g. Trending"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <SaveButton
              loading={loading}
              saved={saved}
              onClick={handleSave}
            />
          </div>
        </form>
      )}
    </div>
  );
}
