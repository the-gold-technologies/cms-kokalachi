"use client";

import React, { useState, useRef } from "react";
import { FileText, Upload, X, Loader2, HelpCircle, Link as LinkIcon, Check } from "lucide-react";
import toast from "react-hot-toast";

interface PdfUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  tooltip?: string;
  placeholder?: string;
}

export function PdfUploadField({
  label,
  value,
  onChange,
  tooltip,
  placeholder = "https://.../document.pdf",
}: PdfUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a valid PDF document (.pdf)");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("PDF size should be under 30MB");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        onChange(json.url);
        toast.success("PDF uploaded successfully", { id: toastId });
      } else {
        toast.error(json.error || "Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Network error during PDF upload", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getCleanFileName = (val: string) => {
    if (!val) return "";
    try {
      const decoded = decodeURIComponent(val.split("/").pop() || "");
      // Remove timestamp prefix if generated
      return decoded.replace(/^\d+[-_]/, "");
    } catch {
      return val.split("/").pop() || "Document.pdf";
    }
  };

  const fileName = getCleanFileName(value);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span title={tooltip} className="cursor-help text-gray-400">
              <HelpCircle className="w-3 h-3" />
            </span>
          )}
        </label>

        {!uploading && !value && (
          <button
            type="button"
            onClick={() => {
              setIsUrlMode(!isUrlMode);
              setTempUrl("");
            }}
            className="text-[11px] font-semibold text-gray-400 hover:text-[#D8232A] transition-colors cursor-pointer flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            {isUrlMode ? "Upload File Instead" : "Enter URL"}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {uploading ? (
        <div className="p-6 rounded-2xl bg-red-50/40 border border-red-100 flex items-center justify-center gap-3 text-xs text-[#D8232A] font-bold animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-[#D8232A]" />
          <span>Uploading PDF document to server...</span>
        </div>
      ) : value ? (
        /* Attached PDF Card Preview */
        <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl group hover:border-gray-300 transition-all shadow-xs">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D8232A] flex items-center justify-center shrink-0 border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate max-w-[170px] sm:max-w-[240px]">
                {fileName || "Datasheet PDF"}
              </span>
              <span className="text-[11px] text-gray-400 font-medium truncate max-w-[170px] sm:max-w-[240px]">
                PDF Document • Ready for download
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-bold text-[#D8232A] bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shadow-2xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
              title="Remove PDF"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isUrlMode ? (
        /* Manual URL Input Form */
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#D8232A] focus:ring-1 focus:ring-[#D8232A] outline-none text-gray-800"
          />
          <button
            type="button"
            onClick={() => {
              if (tempUrl.trim()) {
                onChange(tempUrl.trim());
                setIsUrlMode(false);
              }
            }}
            className="px-4 py-2.5 bg-[#0B0F29] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        /* Clean Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center group ${
            isDragOver
              ? "border-[#D8232A] bg-red-50/30"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-white text-gray-500 group-hover:text-[#D8232A] group-hover:scale-105 border border-gray-100 flex items-center justify-center transition-all shadow-2xs">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 group-hover:text-[#D8232A] transition-colors">
              Click to browse or drop PDF here
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Official TDS / MSDS datasheet (.pdf up to 30MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
