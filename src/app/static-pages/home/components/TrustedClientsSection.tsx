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
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export interface ClientItem {
  id: string;
  name: string;
  category: string;
  logo: string;
}

export interface TrustedClientsData {
  title: string;
  subtitle: string;
  clients: ClientItem[];
}

const initialTrustedClients: TrustedClientsData = {
  title: "",
  subtitle: "",
  clients: [],
};

function LogoDropzone({
  value,
  onChange,
  label = "Client Brand Logo",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
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
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch {
      toast.error("Error uploading logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-700 tracking-wide">{label}</label>

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
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80";
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">
                {value.split("/").pop() || "Logo Image"}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">✓ Logo loaded</span>
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
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={async (e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              await uploadFile(e.dataTransfer.files[0]);
            }
          }}
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
              <span className="text-xs font-medium text-gray-600">Uploading logo...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CloudUpload className="w-4 h-4 text-gray-500 group-hover:text-[#D8232A] transition-colors" />
              <span className="text-xs font-bold text-gray-700">
                <span className="text-[#D8232A] hover:underline mr-1">Upload Logo</span>
                or drag & drop
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TrustedClientsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<TrustedClientsData>(initialTrustedClients);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    haldiram: true,
  });

  useEffect(() => {
    if (initialData) {
      const list = Array.isArray(initialData.clients)
        ? initialData.clients
        : Array.isArray(initialData)
          ? initialData
          : [];

      setData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        clients: list,
      });

      const init: Record<string, boolean> = {};
      list.forEach((c: ClientItem, idx: number) => {
        const k = c.id || `client-${idx}`;
        init[k] = idx === 0;
      });
      setExpandedIds(init);
    }
  }, [initialData]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddClient = () => {
    const newId = `client-${Date.now()}`;
    const newItem: ClientItem = {
      id: newId,
      name: "New Partner / Client",
      category: "Industrial Enterprise",
      logo: "",
    };
    setData((prev) => ({
      ...prev,
      clients: [...prev.clients, newItem],
    }));
    setExpandedIds((prev) => ({ ...prev, [newId]: true }));
    toast.success("New client added");
  };

  const handleRemoveClient = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.clients.length <= 1) {
      toast.error("You must have at least 1 client.");
      return;
    }
    const updated = data.clients.filter((_, i) => i !== idx);
    setData((prev) => ({ ...prev, clients: updated }));
    toast.success("Client removed");
  };

  const handleClientChange = (idx: number, field: keyof ClientItem, value: string) => {
    const updated = [...data.clients];
    updated[idx] = { ...updated[idx], [field]: value };
    setData((prev) => ({ ...prev, clients: updated }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "TrustedClientsSection",
          content: data,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Trusted clients saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving trusted clients");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Trusted Clients & Partners Marquee"
          description="Manage corporate client logos, government partners, and defense organizations displayed in the marquee."
          badge={`${data.clients.length} Client${data.clients.length === 1 ? "" : "s"}`}
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
              {/* Headline & Description */}
              <div className="grid grid-cols-1 gap-5">
                <InputField
                  label="Section Title"
                  value={data.title}
                  onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="TRUSTED CLIENTS & PARTNERS"
                  helperText="Main heading for the marquee section"
                />

                <TextAreaField
                  label="Section Subtitle / Description"
                  rows={2}
                  value={data.subtitle}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Introductory subline below the title"
                  helperText="Introductory subline below the title"
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-5 flex-wrap gap-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#D8232A]" />
                  Partner Clients ({data.clients.length})
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddClient}
                    className="px-4 py-2 rounded-full border border-dashed border-gray-300 hover:border-[#0B0F29] text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer bg-white shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D8232A]" />
                    Add Client
                  </button>
                </div>
              </div>

              {/* Collapsible Clients Accordion List */}
              <div className="flex flex-col gap-4">
                {data.clients.map((client, idx) => {
                  const itemKey = client.id || `client-${idx}`;
                  const isItemExpanded = !!expandedIds[itemKey];

                  return (
                    <div
                      key={itemKey}
                      className="bg-gray-50/80 rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs transition-all"
                    >
                      {/* Accordion Item Header */}
                      <div
                        onClick={() => toggleExpand(itemKey)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100/70 transition-colors select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-[#0B0F29] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>

                          {/* Logo thumbnail */}
                          {client.logo ? (
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={client.logo}
                                alt={client.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gray-200/80 border border-gray-200 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4 text-gray-400" />
                            </div>
                          )}

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-[#0B0F29] uppercase tracking-wide truncate">
                              {client.name || `Client #${idx + 1}`}
                            </span>
                            <span className="text-[11px] text-[#D8232A] font-semibold truncate">
                              {client.category || "Client Category"}
                            </span>
                          </div>
                        </div>

                        {/* Expand/Collapse Chevron & Delete */}
                        <div className="flex items-center gap-2 shrink-0">
                          {data.clients.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveClient(idx, e)}
                              title="Delete Client"
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                              label="Client / Enterprise Name"
                              value={client.name}
                              onChange={(e) => handleClientChange(idx, "name", e.target.value)}
                              placeholder="e.g. Haldiram's / THDC Khurja"
                            />
                            <InputField
                              label="Industry / Category"
                              value={client.category}
                              onChange={(e) => handleClientChange(idx, "category", e.target.value)}
                              placeholder="e.g. Food Processing Giant / Armed Forces"
                            />
                          </div>

                          <LogoDropzone
                            label="Client Brand Logo"
                            value={client.logo}
                            onChange={(url) => handleClientChange(idx, "logo", url)}
                          />
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
