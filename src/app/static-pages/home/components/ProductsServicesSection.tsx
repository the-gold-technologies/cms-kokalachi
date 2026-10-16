"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  CloudUpload,
  Loader2,
  X,
  RefreshCw,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export interface ProductServiceItem {
  id: string;
  name: string;
  link: string;
  img: string;
  hoverImg: string;
}

export interface ProductsServicesData {
  title: string;
  subtitle: string;
  items: ProductServiceItem[];
}

const initialProductsServices: ProductsServicesData = {
  title: "",
  subtitle: "",
  items: [],
};

function CircularImageDropzone({
  value,
  onChange,
  label,
  sublabel,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  sublabel: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 tracking-wide">{label}</label>
        <span className="text-[11px] text-gray-400 font-medium">{sublabel}</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
            e.target.value = "";
          }
        }}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {value ? (
        <div className="w-full border border-gray-200 rounded-2xl bg-white p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">
                {value.split("/").pop() || "Image"}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">✓ Image loaded</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer group ${
            isDragging
              ? "border-[#D8232A] bg-red-50/50 scale-[0.99]"
              : "border-gray-300 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5">
              <Loader2 className="w-5 h-5 text-[#D8232A] animate-spin" />
              <span className="text-xs font-medium text-gray-600">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CloudUpload className="w-4 h-4 text-gray-500 group-hover:text-[#D8232A] transition-colors" />
              <span className="text-xs font-bold text-gray-700">
                <span className="text-[#D8232A] hover:underline mr-1">Upload</span>
                or drag & drop
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductsServicesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<ProductsServicesData>(initialProductsServices);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    industrial: true,
    greases: true,
  });

  useEffect(() => {
    if (initialData) {
      const items = Array.isArray(initialData.items) ? initialData.items : [];

      setData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        items,
      });

      const initExpanded: Record<string, boolean> = {};
      items.forEach((item: ProductServiceItem, index: number) => {
        const key = item.id || `item-${index}`;
        initExpanded[key] = index === 0;
      });
      setExpandedIds(initExpanded);
    }
  }, [initialData]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddItem = () => {
    const newId = `item-${Date.now()}`;
    const newItem: ProductServiceItem = {
      id: newId,
      name: "New Product Category",
      link: "/products",
      img: "",
      hoverImg: "",
    };
    setData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setExpandedIds((prev) => ({ ...prev, [newId]: true }));
    toast.success("New product category item added");
  };

  const handleRemoveItem = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.items.length <= 1) {
      toast.error("You must have at least 1 category item.");
      return;
    }
    const updated = data.items.filter((_, i) => i !== idx);
    setData((prev) => ({ ...prev, items: updated }));
    toast.success("Category item removed");
  };

  const handleItemChange = (idx: number, field: keyof ProductServiceItem, value: string) => {
    const updated = [...data.items];
    updated[idx] = { ...updated[idx], [field]: value };
    setData((prev) => ({ ...prev, items: updated }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ProductsServicesSection",
          content: data,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Products & Services section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving Products & Services section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Products & Services Section"
          description="Manage the circular category icons, hover states, titles, and link routes on the homepage."
          badge={`${data.items.length} Item${data.items.length === 1 ? "" : "s"}`}
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
              {/* Section Headline and Description */}
              <div className="grid grid-cols-1 gap-5">
                <InputField
                  label="Section Title"
                  value={data.title}
                  onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="OUR PRODUCTS AND SERVICES"
                  helperText="Main uppercase heading"
                />

                <TextAreaField
                  label="Section Subtitle / Description"
                  rows={3}
                  value={data.subtitle}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Introductory description below the title"
                  helperText="Introductory description below the title"
                />
              </div>

              {/* Items Header */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#D8232A]" />
                  Category Items ({data.items.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 rounded-full border border-dashed border-gray-300 hover:border-[#0B0F29] text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer bg-white shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D8232A]" />
                  Add Category
                </button>
              </div>

              {/* Collapsible Accordion Items List */}
              <div className="flex flex-col gap-4">
                {data.items.map((item, idx) => {
                  const itemId = item.id || `item-${idx}`;
                  const isItemExpanded = !!expandedIds[itemId];

                  return (
                    <div
                      key={itemId}
                      className="bg-gray-50/80 rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs transition-all"
                    >
                      {/* Accordion Item Header (Click to collapse/expand) */}
                      <div
                        onClick={() => toggleExpand(itemId)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100/70 transition-colors select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-[#0B0F29] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>

                          {/* Thumbnail preview if exists */}
                          {item.img ? (
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.img}
                                alt="Thumb"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200/70 border border-gray-200 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-[#0B0F29] uppercase tracking-wide truncate">
                              {item.name || `Category #${idx + 1}`}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono truncate">
                              {item.link || "/products"}
                            </span>
                          </div>
                        </div>

                        {/* Expand/Collapse Chevron and Delete */}
                        <div className="flex items-center gap-2 shrink-0">
                          {data.items.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveItem(idx, e)}
                              title="Delete Item"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div
                            className={`p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/70 transition-transform duration-200 ${
                              isItemExpanded ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Accordion Body Content */}
                      <div
                        className={`grid transition-all duration-200 ease-in-out border-t border-gray-200/60 ${
                          isItemExpanded
                            ? "grid-rows-[1fr] opacity-100 p-5 bg-white"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden flex flex-col gap-4">
                          {/* Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                              label="Category Name"
                              value={item.name}
                              onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                              placeholder="e.g. Industrial Oils"
                            />
                            <InputField
                              label="Destination Link"
                              value={item.link}
                              onChange={(e) => handleItemChange(idx, "link", e.target.value)}
                              placeholder="e.g. /products/industrial-oils"
                            />
                          </div>

                          {/* Default & Hover Image Dropzones */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <CircularImageDropzone
                              label="Default Image (Idle State)"
                              sublabel="e.g. /industrial-2.png"
                              value={item.img}
                              onChange={(url) => handleItemChange(idx, "img", url)}
                            />

                            <CircularImageDropzone
                              label="Hover Image (Active State)"
                              sublabel="e.g. /industrial-1.png"
                              value={item.hoverImg}
                              onChange={(url) => handleItemChange(idx, "hoverImg", url)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Width Save Changes Button */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
