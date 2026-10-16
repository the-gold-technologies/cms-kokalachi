"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SaveButton } from "@/components/SaveButton";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import Link from "next/link";
import { ArrowLeft, Search, Upload, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PageSpecificSEODetail() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const schemaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    targetKeywords: "",
    canonicalUrl: "",
    noIndex: false,
    schema: "",
    headingOptions: "h1" as any,
  });

  useEffect(() => {
    async function fetchPageSEO() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/seo/pages/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const page = json.data;
          setFormData({
            title: page.title || slug.charAt(0).toUpperCase() + slug.slice(1),
            slug: page.slug || slug,
            metaTitle: page.metaTitle || "",
            metaDescription: page.metaDescription || "",
            targetKeywords: page.targetKeywords || "",
            canonicalUrl: page.canonicalUrl || "",
            noIndex: page.noIndex || false,
            schema:
              typeof page.schema === "string"
                ? page.schema
                : page.schema
                  ? JSON.stringify(page.schema, null, 2)
                  : "",
            headingOptions:
              typeof page.headingOptions === "string"
                ? page.headingOptions
                : typeof page.headingOptions === "object" && page.headingOptions !== null
                  ? (page.headingOptions as any).heroHeadingTag ||
                    (page.headingOptions as any).h1 ||
                    "h1"
                  : "h1",
          });
        } else {
          // If not in DB yet, populate default
          setFormData((prev) => ({
            ...prev,
            title: slug.charAt(0).toUpperCase() + slug.slice(1),
            slug: slug,
            canonicalUrl: `https://mahalaxmilubricants.com/${slug === "home" ? "" : slug}`,
          }));
        }
      } catch (error) {
        console.error("Error fetching page SEO:", error);
        toast.error("Failed to load page SEO data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageSEO();
  }, [slug]);

  const handleSave = async () => {
    setIsSaving(true);
    const tid = toast.loading("Saving page SEO...");
    try {
      let parsedSchema = formData.schema;
      if (formData.schema.trim()) {
        try {
          parsedSchema = JSON.stringify(JSON.parse(formData.schema));
        } catch {
          // keep as string if not strict json
        }
      }

      const res = await fetch(`/api/seo/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seo: {
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            targetKeywords: formData.targetKeywords,
            canonicalUrl: formData.canonicalUrl,
            noIndex: formData.noIndex,
            schema: parsedSchema,
            headingOptions: formData.headingOptions,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Page SEO updated successfully!", { id: tid });
      } else {
        toast.error(json.error || "Failed to update page SEO.", { id: tid });
      }
    } catch (error) {
      console.error("Error saving page SEO:", error);
      toast.error("Network error while saving.", { id: tid });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchemaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        setFormData((prev) => ({
          ...prev,
          schema: JSON.stringify(parsed, null, 2),
        }));
        toast.success("Schema JSON imported successfully!");
      } catch {
        toast.error("Invalid JSON file format");
      }
    };
    reader.readAsText(file);
    if (schemaInputRef.current) schemaInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D8232A]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/seo/pages"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#002B5C] transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pages
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <PageHeader
            title={`SEO: ${formData.title}`}
            description={`Manage the search engine visibility and metadata for the /${formData.slug} page.`}
          />
          <div className="mb-2 shrink-0">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-auto px-10 shrink-0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        {/* Main Search Engine Optimization Card matching pub-club */}
        <div className="flex flex-col gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-50 text-[#002B5C] rounded-2xl">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0B1528]">Search Engine Meta</h2>
          </div>

          <InputField
            label="Meta Title (Browser Tab)"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            placeholder="e.g. Products & Industrial Oils | Mahalaxmi Enterprises"
            tooltip="Page-specific title. Overrides the default site title to improve search relevance for this page."
          />

          <TextAreaField
            label="Meta Description"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            placeholder="A compelling summary for search result snippets (keep under 160 chars)."
            rows={4}
            tooltip="A brief summary of this specific page's content. Search engines use this for the result snippet."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Target Keywords"
              value={formData.targetKeywords}
              onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
              placeholder="e.g. industrial lubricants, hp oil distributor, greases"
              tooltip="Comma-separated keywords or phrases you want this specific page to rank for."
            />
            <InputField
              label="Canonical URL"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              placeholder="https://mahalaxmilubricants.com/products"
              tooltip="The preferred URL for this page. Helps prevent duplicate content issues."
            />
          </div>

          {/* Structured Data (Schema Markup JSON-LD) */}
          <div className="flex flex-col gap-2 px-0.5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-1.5 relative">
                Structured Data (Schema Markup JSON-LD)
                <div className="group relative flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 cursor-help text-gray-300 hover:text-[#D8232A] transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] px-4 py-3 bg-white text-gray-900 text-[11px] font-medium rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 normal-case tracking-normal text-center leading-relaxed backdrop-blur-sm">
                    JSON-LD structured data schema markup for this specific page. Do not include
                    &lt;script&gt; tags, just the raw JSON object.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
                  </div>
                </div>
              </span>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={schemaInputRef}
                  onChange={handleSchemaUpload}
                  accept=".json,application/json,text/plain"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => schemaInputRef.current?.click()}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload JSON (.json)
                </button>
              </div>
            </div>
            <textarea
              value={formData.schema}
              onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
              placeholder='e.g. { "@context": "https://schema.org", "@type": "Product", ... }'
              rows={8}
              className="w-full font-mono text-xs px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:outline-none focus:border-[#002B5C] focus:ring-1 focus:ring-[#002B5C] outline-none transition-all text-gray-800"
            />
          </div>

          {/* Hero Heading Tag Configuration matching pub-club */}
          <div className="flex flex-col gap-1.5 px-0.5 mt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
              Hero Headline Tag (SEO)
            </span>
            <select
              value={typeof formData.headingOptions === "string" ? formData.headingOptions : "h1"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  headingOptions: e.target.value,
                })
              }
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#002B5C] focus:ring-1 focus:ring-[#002B5C] text-gray-800 cursor-pointer h-[54px]"
            >
              <option value="h1">H1 (Recommended standard title tag)</option>
              <option value="h2">H2 (Alternative heading tag)</option>
              <option value="h3">H3 (Sub-heading tag)</option>
              <option value="h4">H4 (Sub-heading tag)</option>
              <option value="h5">H5 (Sub-heading tag)</option>
              <option value="h6">H6 (Sub-heading tag)</option>
            </select>
          </div>

          {/* Index Visibility Toggle */}
          <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex-1">
              <h4 className="font-bold text-[#0B1528] text-sm mb-1 uppercase tracking-tight">
                Index Visibility
              </h4>
              <p className="text-xs text-gray-500">
                Should search engines find and index this page?
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!formData.noIndex}
                onChange={(e) => setFormData({ ...formData, noIndex: !e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-sm font-bold text-gray-700">
                {formData.noIndex ? "No-Index" : "Index"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
