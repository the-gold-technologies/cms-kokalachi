"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import toast from "react-hot-toast";

export function JourneySeoSection({
  tripId,
  initialData,
  onSaved,
}: {
  tripId: string;
  initialData?: any;
  onSaved?: (data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default mock data)
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [schema, setSchema] = useState("");

  useEffect(() => {
    if (initialData) {
      setMetaTitle(initialData.metaTitle ?? "");
      setMetaDescription(initialData.metaDescription ?? "");
      setTargetKeywords(initialData.targetKeywords ?? "");
      setNoIndex(!!initialData.noIndex);
      setSchema(initialData.schema ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        metaTitle,
        metaDescription,
        targetKeywords,
        noIndex,
        schema: schema.trim() || undefined,
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("SEO details saved successfully!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save SEO");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving SEO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="6. Search Engine Optimization (SEO)"
        description="Configure meta tags, target search keywords, and indexing rules for Google and social previews."
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
              label="Meta Title Tag"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="e.g. The Houseboat Diaries Kashmir | Curated Group Travel"
            />
            <InputField
              label="Target Search Keywords"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="e.g. kashmir group trip, houseboat stays srinagar"
            />
          </div>

          <TextAreaField
            label="Meta Description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            placeholder="Experience Kashmir's autumn colours, Dal Lake houseboats, and alpine meadow walks..."
          />

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Structured Data (Schema Markup JSON-LD)
            </span>
            <textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              placeholder={'e.g. { "@context": "https://schema.org", "@type": "TouristTrip", ... }'}
              rows={6}
              className="w-full font-mono text-xs px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-gray-800"
            />
            <span className="text-[11px] text-gray-400">
              Optional custom JSON-LD schema. Leave empty to use auto-generated TouristTrip
              structured data.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-gray-700">
                Hide from search engines (no-index)
              </span>
            </label>
          </div>

          {/* Full-width Standard Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <SaveButton loading={loading} saved={saved} onClick={handleSave} />
          </div>
        </form>
      )}
    </div>
  );
}
