"use client";

import React, { useState, useRef } from "react";
import { CloudUpload, Link as LinkIcon, X, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ImagePickerFieldProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  helperText?: string;
  placeholder?: string;
  folder?: string;
}

export function ImagePickerField({
  label = "Upload Image",
  value = "",
  onChange,
  helperText,
  placeholder = "https://... or upload from computer",
  folder = "mahalaxmi/uploads",
}: ImagePickerFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size too large (maximum 10MB)");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name} to Cloudinary...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        onChange?.(json.url);
        toast.success("Image uploaded to Cloudinary successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to upload image", { id: toastId });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Network error uploading image", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 tracking-wide">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#002B5C] hover:text-[#EB1E25] font-semibold transition-colors cursor-pointer"
        >
          {showUrlInput ? "Hide Direct URL" : "Paste Direct URL"}
        </button>
      </div>

      {/* Direct URL input fallback */}
      {showUrlInput && (
        <div className="relative flex items-center mb-1">
          <LinkIcon className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B5C]/20 focus:border-[#002B5C] transition-all"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Upload Zone or Current Image Preview */}
      {value ? (
        <div className="relative p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Image Preview Box */}
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                <Check size={14} />
                <span>Uploaded on Cloudinary</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5 max-w-[280px] sm:max-w-md">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" /> Uploading
                </span>
              ) : (
                "Change Image"
              )}
            </button>
            <button
              type="button"
              onClick={() => onChange?.("")}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-5 px-4 border-2 border-dashed border-slate-200 hover:border-[#002B5C] rounded-2xl bg-slate-50/70 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-[#EB1E25] animate-spin" />
              <p className="text-xs font-bold text-slate-700">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#002B5C] group-hover:border-[#002B5C] transition-colors shadow-xs">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">
                  Click to upload image from computer
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG up to 10MB</p>
              </div>
            </>
          )}
        </button>
      )}

      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}
