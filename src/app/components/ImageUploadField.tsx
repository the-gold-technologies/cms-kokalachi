"use client";

import React, { useState, useRef } from "react";
import { CloudUpload, X, HelpCircle, Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadFieldProps {
  label?: string;
  images?: (File | string | null)[];
  onImagesChange?: (images: (File | string | null)[]) => void;
  maxImages?: number;
  containerClassName?: string;
  tooltip?: string;
  folder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = "Image",
  images: controlledImages,
  onImagesChange,
  maxImages = 1,
  containerClassName = "",
  tooltip,
  folder = "mahalaxmi/uploads",
}) => {
  const [internalImages, setInternalImages] = useState<(File | string | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = (controlledImages ?? internalImages).filter((img): img is string | File =>
    Boolean(img),
  );

  const handleUpdate = (newImages: (File | string | null)[]) => {
    if (!controlledImages) {
      setInternalImages(newImages);
    }
    onImagesChange?.(newImages);
  };

  // Upload single or multiple files to /api/upload
  const uploadAndAddFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;

    // Filter valid image files
    const validFiles = files.filter(
      (f) =>
        f.type.startsWith("image/") ||
        f.name.endsWith(".ico") ||
        f.name.endsWith(".svg") ||
        f.name.endsWith(".png") ||
        f.name.endsWith(".jpg") ||
        f.name.endsWith(".jpeg") ||
        f.name.endsWith(".webp"),
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WebP, ICO, SVG)");
      return;
    }

    // Limit to maxImages available slots
    const availableSlots = maxImages === 1 ? 1 : maxImages - images.length;
    if (availableSlots <= 0 && maxImages > 1) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots > 0 ? availableSlots : 1);

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadProgressText(
        filesToUpload.length > 1
          ? `Uploading ${i + 1}/${filesToUpload.length}: ${file.name}...`
          : `Uploading ${file.name}...`,
      );

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
          uploadedUrls.push(json.url);
        } else {
          toast.error(json.error || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        toast.error(err?.message || `Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadProgressText("");

    if (uploadedUrls.length > 0) {
      if (maxImages === 1) {
        handleUpdate([uploadedUrls[0]]);
      } else {
        const currentStringImages = images
          .map((img) => (typeof img === "string" ? img : ""))
          .filter(Boolean);
        handleUpdate([...currentStringImages, ...uploadedUrls].slice(0, maxImages));
      }
      toast.success(
        uploadedUrls.length === 1
          ? "Image uploaded successfully!"
          : `${uploadedUrls.length} images uploaded successfully!`,
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      await uploadAndAddFiles(droppedFiles);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      await uploadAndAddFiles(selectedFiles);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index);
    handleUpdate(nextImages);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    if (maxImages === 1) {
      handleUpdate([url]);
    } else {
      const currentStringImages = images
        .map((img) => (typeof img === "string" ? img : ""))
        .filter(Boolean);
      handleUpdate([...currentStringImages, url].slice(0, maxImages));
    }
    setManualUrl("");
    setShowUrlInput(false);
    toast.success("Image URL added!");
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 relative">
            {label}
            {tooltip && (
              <div className="group relative flex items-center">
                <HelpCircle className="w-3.5 h-3.5 cursor-help text-gray-400 hover:text-[#002B5C] transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] px-4 py-3 bg-slate-900 text-white text-[11px] font-medium rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 normal-case tracking-normal text-center leading-relaxed">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                </div>
              </div>
            )}
          </label>
        )}

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#002B5C] hover:text-[#D8232A] font-semibold transition-colors cursor-pointer"
        >
          {showUrlInput ? "Hide Direct URL" : "Paste Direct URL"}
        </button>
      </div>

      {/* Manual URL input fallback */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <LinkIcon className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Paste direct image URL (https://...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManualUrl()}
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-mono"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-[#002B5C] text-white text-xs font-bold rounded-xl hover:bg-[#D8232A] transition cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/x-icon, .ico, .svg, .png, .jpg, .jpeg, .webp"
        multiple={maxImages > 1}
        className="hidden"
      />

      {/* Uploaded Images List */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          {images.map((img, idx) => {
            if (!img) return null;
            const imgSrc = typeof img === "string" ? img : URL.createObjectURL(img as Blob);
            const fileName =
              typeof img === "string"
                ? img.split("/").pop() || "Uploaded Image"
                : (img as File).name || "Image";

            return (
              <div
                key={idx}
                className="w-full border border-gray-200 rounded-2xl bg-slate-50/70 flex items-center justify-between p-3 px-4 relative overflow-hidden group hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={`Preview ${idx + 1}`}
                    className="w-12 h-12 object-contain bg-white rounded-xl shadow-xs border border-gray-200 shrink-0 p-0.5"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-900 font-bold text-xs truncate max-w-[220px] sm:max-w-[340px]">
                      {fileName}
                    </span>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Uploaded & Ready
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage(idx);
                  }}
                  className="p-1.5 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 shadow-xs transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 transition-all cursor-pointer group
          ${
            isDragging
              ? "border-[#002B5C] bg-blue-50/50 scale-[0.99]"
              : "border-gray-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300"
          }
          ${isUploading ? "opacity-75 pointer-events-none" : ""}
        `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#002B5C] animate-spin" />
              <p className="text-xs font-bold text-slate-700">
                {uploadProgressText || "Uploading image to Cloudinary..."}
              </p>
              <p className="text-[11px] text-slate-400">Please wait a moment</p>
            </div>
          ) : (
            <>
              <span className="text-slate-600 font-semibold text-xs sm:text-sm mb-3">
                {maxImages > 1
                  ? `Upload Images (${images.length}/${maxImages} selected)`
                  : "Provide an image or lubricant graphic"}
              </span>

              <div
                className={`p-3 rounded-2xl shadow-xs border mb-3 transition-transform ${
                  isDragging
                    ? "bg-[#002B5C] text-white scale-110 border-[#002B5C]"
                    : "bg-white text-[#002B5C] border-gray-100 group-hover:scale-110"
                }`}
              >
                <CloudUpload className="w-6 h-6" strokeWidth={2} />
              </div>

              <p className="text-slate-600 text-xs sm:text-sm mb-1 text-center font-medium">
                <span className="text-[#D8232A] font-bold hover:underline mr-1">
                  Click to upload
                </span>
                or drag and drop
              </p>
              <p className="text-slate-400 text-[11px] text-center font-normal">
                PNG, JPG, WebP, SVG or ICO (up to 10MB).
                {maxImages > 1 ? ` Max ${maxImages} images.` : ""}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
