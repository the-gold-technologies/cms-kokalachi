"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SaveButton } from "@/components/SaveButton";
import { InputField } from "@/components/InputField";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ShieldCheck, FileText, Calendar, Eye, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function PrivacyPolicyAdminPage() {
  const [title, setTitle] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPrivacyPolicy() {
      try {
        const res = await fetch("/api/privacy-policy");
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          setTitle(data.title || "");
          setLastUpdated(data.lastUpdated || "");
          setContent(data.content || "");
          setIsPublished(data.isPublished ?? true);
        }
      } catch (err) {
        console.error("Failed to load privacy policy:", err);
        toast.error("Failed to load Privacy Policy");
      } finally {
        setIsLoading(false);
      }
    }
    loadPrivacyPolicy();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const tid = toast.loading("Saving Privacy Policy...");
    try {
      const res = await fetch("/api/privacy-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          lastUpdated,
          content,
          isPublished,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Privacy Policy saved successfully!", { id: tid });
      } else {
        toast.error(json.error || "Failed to save Privacy Policy", { id: tid });
      }
    } catch (err) {
      console.error("Error saving privacy policy:", err);
      toast.error("Network error while saving.", { id: tid });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">
          Loading Privacy Policy editor...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          title="Privacy Policy Page"
          description="Create and customize your legal Privacy Policy statement and terms."
        />
        <div className="mb-2 shrink-0">
          <SaveButton onClick={handleSave} disabled={isSaving} className="w-auto px-10" />
        </div>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Rich Content Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Document Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-[#002B5C] rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B0F29]">Document Heading & Identity</h2>
                <p className="text-xs text-slate-400">
                  Set the main page header and last updated revision timestamp.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Privacy Policy"
                tooltip="The main heading displayed at the top of the privacy policy page."
              />

              <InputField
                label="Last Updated Stamp"
                value={lastUpdated}
                onChange={(e) => setLastUpdated(e.target.value)}
                placeholder="e.g. August 2026"
                tooltip="The revision date shown to website visitors."
              />
            </div>
          </div>

          {/* Rich Text Editor Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-[#D8232A] rounded-2xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B0F29]">Policy Body Content</h2>
                  <p className="text-xs text-slate-400">
                    Use rich formatting, headings, bullet lists, quotes, and image insertion.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <RichTextEditor
                label="Full Policy Content"
                value={content}
                onChange={setContent}
                placeholder="Write your detailed privacy policy sections, clauses, and contact info..."
                minHeight="420px"
                tooltip="Full WYSIWYG editor. You can format headings, lists, bold text, links, and upload images."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Status & Live Preview Guide */}
        <div className="flex flex-col gap-6">
          {/* Publication Status Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#0B0F29] uppercase tracking-wider">
              Status & Visibility
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Published on Website</span>
                <span className="text-[11px] text-slate-400">Visible at /privacy-policy</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002B5C]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
