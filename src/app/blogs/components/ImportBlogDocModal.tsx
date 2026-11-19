"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  FileCode,
  Download,
  CheckCircle2,
  Sparkles,
  Clipboard,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { parseBlogDocument, ParsedBlogDoc } from "@/lib/blogDocParser";

interface ImportBlogDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ParsedBlogDoc) => void;
}

export function ImportBlogDocModal({ isOpen, onClose, onApply }: ImportBlogDocModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedBlogDoc | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setRawText(content);
        try {
          const result = parseBlogDocument(content);
          setParsed(result);
          toast.success(`Parsed "${file.name}" successfully!`);
        } catch {
          toast.error("Could not parse file. Please check format.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (val: string) => {
    setRawText(val);
    if (!val.trim()) {
      setParsed(null);
      return;
    }
    try {
      const result = parseBlogDocument(val);
      setParsed(result);
    } catch {
      setParsed(null);
    }
  };

  const handleApply = () => {
    if (!parsed || (!parsed.title && (!parsed.sections || parsed.sections.length === 0))) {
      toast.error("Please provide a valid story document with at least a Title or Chapter.");
      return;
    }
    onApply(parsed);
    onClose();
    toast.success(`Pre-filled story from "${parsed.title || "Document"}"!`);
  };

  const sampleJson = {
    title: "First Time on a Group Trip? Here's What It Actually Feels Like.",
    slug: "first-time-on-a-group-trip",
    heroLead: "First Time on a Group Trip?",
    heroAccent: "Here's what it actually feels like.",
    excerpt:
      "A candid reflection on showing up solo, sharing chai with strangers, and leaving with lifelong friends.",
    category: "First-Timer Guide",
    author: "Team Kokalachi",
    publishedAt: new Date().toISOString().split("T")[0],
    heroImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    heroAlt: "Group of travellers sharing laughter around a scenic mountain viewpoint",
    marginNote: "nervous? same. that's the point ♡",
    intro: [
      "The first morning always starts the same way. You're holding a lukewarm paper cup of chai, trying to remember six new names.",
      "By day three, those same strangers are sharing their blister plasters and debating the merits of local street food.",
    ],
    sections: [
      {
        number: 1,
        kicker: "Before you go",
        title: "The first hello shouldn't happen at the airport",
        content:
          "We create a warm WhatsApp circle a week before departure so everyone breaks the ice.\n\n:::tip\nDon't overpack on shoes. Two reliable pairs will carry you anywhere.\n:::",
      },
      {
        number: 2,
        kicker: "On the road",
        title: "Evenings belong to honest bonfire conversations",
        content:
          "There is something about twilight in the hills that makes people drop their guards.\n\n:::quote\nTravel isn't about escaping life, but discovering life isn't meant to be lived alone.\n:::",
      },
    ],
    ctaTitle: "Ready to take the first step?",
    ctaText: "Explore our upcoming journeys and find your tribe.",
    shareNote: "Know a nervous first-timer? Send this their way.",
  };

  const sampleMarkdown = `---
title: "First Time on a Group Trip? Here's What It Actually Feels Like."
category: "First-Timer Guide"
author: "Team Kokalachi"
heroLead: "First Time on a Group Trip?"
heroAccent: "Here's what it actually feels like."
heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
excerpt: "A candid reflection on showing up solo and leaving with lifelong friends."
marginNote: "nervous? same. that's the point ♡"
---

The first morning always starts the same way. You're holding a lukewarm paper cup of chai, trying to remember six new names.

By day three, those same strangers are sharing their blister plasters and debating the merits of local street food.

## 01: The first hello shouldn't happen at the airport
kicker: Before you go
We create a warm WhatsApp circle a week before departure so everyone breaks the ice.

:::tip
Don't overpack on shoes. Two reliable pairs will carry you anywhere.
:::

## 02: Evenings belong to honest bonfire conversations
kicker: On the road
There is something about twilight in the hills that makes people drop their guards.

:::quote
Travel isn't about escaping life, but discovering life isn't meant to be lived alone.
:::
`;

  const handleDownloadSample = (type: "json" | "md") => {
    const content = type === "json" ? JSON.stringify(sampleJson, null, 2) : sampleMarkdown;
    const blob = new Blob([content], {
      type: type === "json" ? "application/json" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-story-template.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0E5A60]/10 flex items-center justify-center text-[#0E5A60]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Import Story from Document
              </h3>
              <p className="text-xs text-gray-500">
                Upload or paste a Markdown (.md) or JSON file to auto-fill story title, intro,
                chapters & CTA.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Template Bar */}
        <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="font-semibold text-gray-600 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-[#0E5A60]" /> Download Sample Templates:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadSample("json")}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-gray-200 text-[#0E5A60] font-bold text-[11px] hover:bg-teal-50 hover:border-[#0E5A60]/30 transition-colors shadow-2xs cursor-pointer"
            >
              <FileCode className="w-3 h-3 text-[#0E5A60]" /> JSON Template (.json)
            </button>
            <button
              type="button"
              onClick={() => handleDownloadSample("md")}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-gray-200 text-[#D96C2C] font-bold text-[11px] hover:bg-orange-50 hover:border-[#D96C2C]/30 transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3 h-3 text-[#D96C2C]" /> Markdown Doc (.md)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === "upload"
                  ? "border-[#0E5A60] text-[#0E5A60]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload File (.md, .json, .txt)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === "paste"
                  ? "border-[#0E5A60] text-[#0E5A60]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" /> Paste Document Text
            </button>
          </div>

          {activeTab === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileProcess(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer text-center ${
                isDragging
                  ? "border-[#0E5A60] bg-[#0E5A60]/5"
                  : "border-gray-200 hover:border-[#0E5A60]/40 bg-gray-50/50 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.json,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileProcess(file);
                }}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {fileName ? `Loaded: ${fileName}` : "Click to browse or drag & drop story file"}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports .md (Markdown with frontmatter) and .json files
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Paste Document Text
              </label>
              <textarea
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={9}
                placeholder="Paste Markdown story or JSON content here..."
                className="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs font-mono text-gray-800 focus:outline-none focus:border-[#0E5A60] focus:ring-2 focus:ring-[#0E5A60]/10 leading-relaxed"
              />
            </div>
          )}

          {/* Parsed Summary Card */}
          {parsed && (
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Successfully Parsed Document
                </span>
                <span className="text-[11px] font-bold text-[#D96C2C]">
                  {parsed.sections?.length || 0} chapters detected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-teal-100/60">
                  <span className="text-[10px] text-gray-400 block font-semibold">Title</span>
                  <p className="font-bold text-gray-800 truncate">{parsed.title || "—"}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-teal-100/60">
                  <span className="text-[10px] text-gray-400 block font-semibold">Category</span>
                  <p className="font-bold text-gray-800 truncate">{parsed.category || "—"}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-teal-100/60">
                  <span className="text-[10px] text-gray-400 block font-semibold">Author</span>
                  <p className="font-bold text-gray-800 truncate">{parsed.author || "—"}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-teal-100/60">
                  <span className="text-[10px] text-gray-400 block font-semibold">Intro</span>
                  <p className="font-bold text-gray-800 truncate">
                    {parsed.intro?.length ? `${parsed.intro.length} paragraphs` : "None"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!parsed}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              parsed
                ? "bg-[#0E5A60] hover:bg-[#0E5A60]/90 text-white shadow-[#0E5A60]/20 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFD9BF]" />
            Apply &amp; Pre-Fill Story
          </button>
        </div>
      </div>
    </div>
  );
}
