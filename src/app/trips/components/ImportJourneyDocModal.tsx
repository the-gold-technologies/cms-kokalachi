"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  FileCode,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clipboard,
} from "lucide-react";
import toast from "react-hot-toast";
import { parseJourneyDocument, ParsedJourneyDoc } from "@/lib/journeyDocParser";

interface ImportJourneyDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ParsedJourneyDoc) => void;
}

export function ImportJourneyDocModal({
  isOpen,
  onClose,
  onApply,
}: ImportJourneyDocModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedJourneyDoc | null>(null);
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
          const result = parseJourneyDocument(content);
          setParsed(result);
          toast.success(`Parsed "${file.name}" successfully!`);
        } catch {
          toast.error("Could not parse file. Check format.");
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
      const result = parseJourneyDocument(val);
      setParsed(result);
    } catch {
      setParsed(null);
    }
  };

  const handleApply = () => {
    if (!parsed || !parsed.title) {
      toast.error("Please provide a valid journey document with at least a Title.");
      return;
    }
    onApply(parsed);
    onClose();
    toast.success(`Pre-filled form from "${parsed.title}"!`);
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
                Import Journey from Document
              </h3>
              <p className="text-xs text-gray-500">
                Upload or paste a Markdown (.md) or JSON document to auto-fill all 6 sections.
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
            <a
              href="/templates/journey-template.json"
              download="journey-template.json"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-gray-200 text-[#0E5A60] font-bold text-[11px] hover:bg-teal-50 hover:border-[#0E5A60]/30 transition-colors shadow-2xs"
            >
              <FileCode className="w-3 h-3 text-[#0E5A60]" /> JSON Template (.json)
            </a>
            <a
              href="/templates/journey-template.md"
              download="journey-template.md"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-gray-200 text-[#D96C2C] font-bold text-[11px] hover:bg-orange-50 hover:border-[#D96C2C]/30 transition-colors shadow-2xs"
            >
              <FileText className="w-3 h-3 text-[#D96C2C]" /> Markdown Doc (.md)
            </a>
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
                  {fileName ? `Loaded: ${fileName}` : "Click to browse or drag & drop journey doc"}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports .md, .json, and plain .txt files formatted as templates
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
                rows={8}
                placeholder="Paste Markdown document or JSON content here..."
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
                  {parsed.price ? `₹${parsed.price.toLocaleString()}` : "Price TBA"}
                </span>
              </div>

              <div className="text-sm font-serif font-bold text-gray-900">
                {parsed.title || "Untitled Journey"}
              </div>

              {parsed.subtitle && (
                <p className="text-xs text-gray-500 line-clamp-1">{parsed.subtitle}</p>
              )}

              {/* Counts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-teal-100/80 text-[11px] font-semibold text-gray-600">
                <div>📅 {parsed.departures?.length || 0} Batches</div>
                <div>📍 {parsed.itinerary?.length || 0} Itinerary Days</div>
                <div>✨ {parsed.highlights?.length || 0} Highlights</div>
                <div>✅ {parsed.inclusions?.length || 0} Inclusions</div>
                <div>❌ {parsed.exclusions?.length || 0} Exclusions</div>
                <div>🍽️ {parsed.meals?.length || 0} Meals</div>
                <div>🎒 {parsed.whatToPack?.length || 0} Packing Items</div>
                <div>❓ {parsed.faqs?.length || 0} FAQs</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
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
            disabled={!parsed || !parsed.title}
            className="px-6 py-2.5 rounded-xl bg-[#0E5A60] hover:bg-[#061C29] disabled:bg-gray-300 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply & Pre-fill Form</span>
          </button>
        </div>
      </div>
    </div>
  );
}
