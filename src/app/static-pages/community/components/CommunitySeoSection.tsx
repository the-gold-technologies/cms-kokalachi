"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";

export function CommunitySeoSection({ initialSeo }: { initialSeo?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO hardcoded fallback strings)
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [schema, setSchema] = useState("");

  useEffect(() => {
    if (initialSeo) {
      setMetaTitle(initialSeo.metaTitle ?? initialSeo.title ?? "");
      setMetaDescription(initialSeo.metaDescription ?? "");
      setTargetKeywords(initialSeo.targetKeywords ?? "");
      setCanonicalUrl(initialSeo.canonicalUrl ?? "");
      setNoIndex(Boolean(initialSeo.noIndex));
      setSchema(
        typeof initialSeo.schema === "string"
          ? initialSeo.schema
          : initialSeo.schema
            ? JSON.stringify(initialSeo.schema, null, 2)
            : "",
      );
    }
  }, [initialSeo]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      if (schema.trim()) {
        try {
          JSON.parse(schema.trim());
        } catch {
          toast.error("Invalid JSON format in Schema Markup field");
          setLoading(false);
          return;
        }
      }

      const payload = {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        targetKeywords: targetKeywords.trim(),
        canonicalUrl: canonicalUrl.trim(),
        noIndex,
        schema: schema.trim() || null,
      };

      const res = await fetch("/api/seo/pages/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save Community SEO");
      }

      setSaved(true);
      toast.success("Community Page SEO & Metadata saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save SEO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
      <SectionHeader
        title="4. Community SEO & Structured Data"
        description="Search engine optimization settings: Google title tag, meta description, target keywords, canonical URL, and JSON-LD schema markup."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge="Page SEO"
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Meta Title (Browser tab & Google heading)"
              placeholder="e.g. The Kokalachi Community | Strangers once, now family"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              tooltip="Recommended: 50–60 characters"
            />
            <InputField
              label="Canonical URL"
              placeholder="e.g. https://kokalachi.com/community"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              tooltip="The definitive URL for search engine indexing"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Meta Description</span>
              <span className="text-[11px] text-slate-400">
                {metaDescription.length} / 160 characters
              </span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="e.g. Real stories, photos and videos from Kokalachi travellers..."
              rows={3}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
            />
          </div>

          <InputField
            label="Target Keywords (comma-separated)"
            placeholder="e.g. kokalachi community, traveller stories, slow travel memories, trip photos"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">
              Structured Data (Schema Markup JSON-LD)
            </span>
            <textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              placeholder="Paste JSON-LD schema here..."
              rows={6}
              className="w-full font-mono text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
            />
            <span className="text-[11px] text-slate-400">
              Valid JSON-LD schema for search engines (Google Rich Results).
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="w-4 h-4 rounded text-[#0E5A60] focus:ring-[#0E5A60]"
              />
              Discourage search engines from indexing this page (noindex)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <SaveButton
              loading={loading}
              saved={saved}
              onClick={handleSave}
              label="Save Changes"
              className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      )}
    </article>
  );
}
