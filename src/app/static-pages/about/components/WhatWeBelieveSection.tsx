"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";
import { Plus, Trash2 } from "lucide-react";

interface BeliefPillar {
  title: string;
  desc: string;
}

export function WhatWeBelieveSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [polaroidImage, setPolaroidImage] = useState("");
  const [polaroidCaption, setPolaroidCaption] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const [mainImageAlt, setMainImageAlt] = useState("");
  const [polaroidImageAlt, setPolaroidImageAlt] = useState("");

  const [pillars, setPillars] = useState<BeliefPillar[]>([]);
  const [openPillarIndices, setOpenPillarIndices] = useState<number[]>([]);

  const togglePillar = (idx: number) => {
    setOpenPillarIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setMainImage(initialData.mainImage ?? "");
      setPolaroidImage(initialData.polaroidImage ?? "");
      setPolaroidCaption(initialData.polaroidCaption ?? "");
      setFooterNote(initialData.footerNote ?? "");
      setMainImageAlt(initialData.mainImageAlt ?? "");
      setPolaroidImageAlt(initialData.polaroidImageAlt ?? "");

      if (Array.isArray(initialData.pillars)) {
        setPillars(
          initialData.pillars.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? p.description ?? "",
          })),
        );
      } else {
        setPillars([]);
      }
    }
  }, [initialData]);

  const handleAddPillar = () => {
    const nextIdx = pillars.length;
    setPillars((prev) => [...prev, { title: "", desc: "" }]);
    setOpenPillarIndices((prev) => [...prev, nextIdx]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
    setOpenPillarIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdatePillar = (index: number, field: "title" | "desc", value: string) => {
    setPillars((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tagline,
        headline,
        scriptAccent,
        description,
        mainImage,
        polaroidImage,
        polaroidCaption,
        mainImageAlt,
        polaroidImageAlt,
        footerNote,
        pillars,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "WhatWeBelieveSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("What We Believe section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving What We Believe section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="WhatWeBelieveSection"
          description="The Kokalachi Way: Core non-negotiable pillars of curated travel, images, and brand ethos."
          badge="Step 3"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-6 pt-4">
              <InputField
                label="Section Tagline Badge"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. WHAT WE BELIEVE"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. The Kokalachi"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. Way"
                />
              </div>

              <TextAreaField
                label="Intro Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Everything we design every itinerary, every group, every detail..."
                rows={2}
              />

              {/* Dynamic Pillars List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Non-Negotiable Pillars ({pillars.length})
                    </h4>
                    <p className="text-xs text-gray-500">
                      Core values guiding group size, traveller vetting, and respect
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pillars.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPillarIndices(
                            openPillarIndices.length === pillars.length
                              ? []
                              : pillars.map((_, i) => i),
                          )
                        }
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {openPillarIndices.length === pillars.length
                          ? "Collapse all"
                          : "Expand all"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddPillar}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Pillar</span>
                    </button>
                  </div>
                </div>

                {pillars.length === 0 ? (
                  <div
                    onClick={handleAddPillar}
                    className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span>No pillars added yet. Click to add your first pillar.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {pillars.map((pillar, idx) => (
                      <CollapsibleItemCard
                        key={idx}
                        title={`Pillar #${idx + 1}`}
                        subtitle={pillar.title}
                        isOpen={openPillarIndices.includes(idx)}
                        onToggle={() => togglePillar(idx)}
                        onDelete={() => handleRemovePillar(idx)}
                        deleteTitle="Delete Pillar"
                      >
                        <InputField
                          label="Headline"
                          value={pillar.title}
                          onChange={(e) => handleUpdatePillar(idx, "title", e.target.value)}
                          placeholder="e.g. Curated travel groups, real connection."
                        />

                        <TextAreaField
                          label="Description"
                          value={pillar.desc}
                          onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                          placeholder="Write pillar description..."
                          rows={3}
                        />
                      </CollapsibleItemCard>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Visual Stack & Footer Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <ImagePickerField
                  label="Sunset Group Photo (Right Main Visual)"
                  value={mainImage}
                  onChange={setMainImage}
                />
                <InputField
                  label="Main Image Alt Text"
                  value={mainImageAlt}
                  onChange={(e) => setMainImageAlt(e.target.value)}
                  placeholder="e.g. Group sitting together"
                />
                <div className="space-y-3">
                  <ImagePickerField
                    label="Bottom Right Polaroid Photo"
                    value={polaroidImage}
                    onChange={setPolaroidImage}
                  />
                  <InputField
                    label="Polaroid Caption"
                    value={polaroidCaption}
                    onChange={(e) => setPolaroidCaption(e.target.value)}
                    placeholder="e.g. Always a better way to travel"
                  />
                </div>
              </div>

              <InputField
                label="Footer Motto Note"
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                placeholder="e.g. BETTER PEOPLE. BRIGHTER JOURNEYS."
              />

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
