"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, CloudUpload, FileCheck } from "lucide-react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

export interface GalleryItem {
  id: number | string;
  title: string;
  image: string | File;
  altText: string;
}

interface EventsGallerySectionProps {
  initialData?: { galleryItems?: GalleryItem[] };
  onSave?: (data: { galleryItems: any[] }) => Promise<boolean | void>;
}

export function EventsGallerySection({ initialData, onSave }: EventsGallerySectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.galleryItems) {
      setGallery(initialData.galleryItems);
    }
  }, [initialData]);

  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i),
    );

    if (fileArray.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const newItems: GalleryItem[] = fileArray.map((file) => {
      // Clean filename for default title
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");

      return {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanTitle,
        altText: cleanTitle,
        image: file,
      };
    });

    setGallery((prev) => [...newItems, ...prev]);
    toast.success(`Added ${newItems.length} photo${newItems.length > 1 ? "s" : ""} to gallery`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleUpdateItem = (index: number, field: "title" | "altText", val: string) => {
    setGallery((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleDeleteItem = (index: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== index));
    toast.success("Photo removed from gallery");
  };

  const handleSaveAll = async () => {
    if (gallery.length === 0) {
      toast.error("Gallery is empty");
      return;
    }

    setLoading(true);

    try {
      // 1. Separate items with newly added File objects from existing string URLs
      const fileUploadTasks: { index: number; file: File }[] = [];
      gallery.forEach((item, idx) => {
        if (typeof item.image !== "string") {
          fileUploadTasks.push({ index: idx, file: item.image as File });
        }
      });

      let updatedGallery = [...gallery];

      if (fileUploadTasks.length > 0) {
        const filesToUpload = fileUploadTasks.map((t) => t.file);
        const uploadedUrls = await uploadFiles(filesToUpload);

        fileUploadTasks.forEach((task, i) => {
          updatedGallery[task.index] = {
            ...updatedGallery[task.index],
            image: uploadedUrls[i] || "",
          };
        });
      }

      // Format payload items
      const finalGallery = updatedGallery.map((item, idx) => ({
        id: typeof item.id === "number" ? item.id : idx + 1,
        title: (item.title || "").trim(),
        altText: (item.altText || item.title || "").trim(),
        image: typeof item.image === "string" ? item.image : "",
      }));

      const payload = { galleryItems: finalGallery };

      if (onSave) {
        await onSave(payload);
      } else {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "EventsGallery",
            content: payload,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Events photo gallery saved successfully!");
          setGallery(finalGallery);
        } else {
          toast.error(json.error || "Failed to save gallery");
        }
      }
    } catch {
      toast.error("Network error saving gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="3. Photo Gallery Showcase"
        description="Upload photos directly, edit titles inline, and manage the 3-column lightbox grid on the live website."
        badge={`${gallery.length} Photos`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-6 pt-4">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files);
              }}
              multiple
              accept="image/*"
              className="hidden"
            />

            {/* Direct Inline Drag & Drop Upload Zone (No Popups!) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center group ${
                isDragOver
                  ? "border-[#D8232A] bg-red-50/40"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#D8232A] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <CloudUpload className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-800 group-hover:text-[#D8232A] transition-colors">
                  Click to choose photos or drag & drop images here
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  Supports multiple photos upload (PNG, JPG, WebP) • Photos will appear directly
                  below
                </p>
              </div>
            </div>

            {/* Photo Cards Grid with Inline Editing */}
            {gallery.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                No gallery photos added. Drop images above to populate the gallery.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {gallery.map((item, idx) => {
                  const imageSrc =
                    typeof item.image === "string"
                      ? item.image
                      : URL.createObjectURL(item.image as Blob);

                  const isNewUpload = typeof item.image !== "string";

                  return (
                    <div
                      key={item.id || idx}
                      className="bg-gray-50 rounded-2xl border border-gray-200/90 overflow-hidden flex flex-col justify-between group hover:border-[#D8232A]/40 hover:shadow-sm transition-all"
                    >
                      {/* Image Thumbnail Preview */}
                      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageSrc}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isNewUpload && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#D8232A] text-white text-[10px] font-bold shadow-xs">
                            New Upload
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Optional Title / Caption */}
                      <div className="p-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
                          placeholder="Event Title / Caption"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#D8232A] focus:outline-none text-gray-800 font-medium"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full-width Save Changes Button */}
            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={loading}
                onClick={handleSaveAll}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
