"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface BeliefPillar {
  title: string;
  desc: string;
}

export function WhatWeBelieveSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
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

  const [p1, setP1] = useState<BeliefPillar>({ title: "", desc: "" });
  const [p2, setP2] = useState<BeliefPillar>({ title: "", desc: "" });
  const [p3, setP3] = useState<BeliefPillar>({ title: "", desc: "" });
  const [p4, setP4] = useState<BeliefPillar>({ title: "", desc: "" });
  const [p5, setP5] = useState<BeliefPillar>({ title: "", desc: "" });

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

      const list = Array.isArray(initialData.pillars) ? initialData.pillars : [];
      if (list[0]) setP1({ title: list[0].title ?? "", desc: list[0].desc ?? list[0].description ?? "" });
      if (list[1]) setP2({ title: list[1].title ?? "", desc: list[1].desc ?? list[1].description ?? "" });
      if (list[2]) setP3({ title: list[2].title ?? "", desc: list[2].desc ?? list[2].description ?? "" });
      if (list[3]) setP4({ title: list[3].title ?? "", desc: list[3].desc ?? list[3].description ?? "" });
      if (list[4]) setP5({ title: list[4].title ?? "", desc: list[4].desc ?? list[4].description ?? "" });
    }
  }, [initialData]);

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
        footerNote,
        pillars: [p1, p2, p3, p4, p5],
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
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
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

              {/* 5 Core Pillars */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">5 Non-Negotiable Pillars</h4>
                  <p className="text-xs text-gray-500">Core values guiding group size, traveller vetting, and respect</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Pillar 1 (Curated Groups)</span>
                    <InputField label="Headline" value={p1.title} onChange={(e) => setP1({ ...p1, title: e.target.value })} placeholder="e.g. Curated travel groups, real connection." />
                    <TextAreaField label="Description" value={p1.desc} onChange={(e) => setP1({ ...p1, desc: e.target.value })} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Pillar 2 (People & Place)</span>
                    <InputField label="Headline" value={p2.title} onChange={(e) => setP2({ ...p2, title: e.target.value })} placeholder="e.g. The people matter as much as the place." />
                    <TextAreaField label="Description" value={p2.desc} onChange={(e) => setP2({ ...p2, desc: e.target.value })} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Pillar 3 (Pre-Trip Trust)</span>
                    <InputField label="Headline" value={p3.title} onChange={(e) => setP3({ ...p3, title: e.target.value })} placeholder="e.g. Trust is earned before the trip starts." />
                    <TextAreaField label="Description" value={p3.desc} onChange={(e) => setP3({ ...p3, desc: e.target.value })} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Pillar 4 (Respect)</span>
                    <InputField label="Headline" value={p4.title} onChange={(e) => setP4({ ...p4, title: e.target.value })} placeholder="e.g. Respect is non-negotiable." />
                    <TextAreaField label="Description" value={p4.desc} onChange={(e) => setP4({ ...p4, desc: e.target.value })} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2 md:col-span-2">
                    <span className="text-xs font-bold text-teal-800 block">Pillar 5 (No Compromises)</span>
                    <InputField label="Headline" value={p5.title} onChange={(e) => setP5({ ...p5, title: e.target.value })} placeholder="e.g. We won't compromise your experience to fill a seat." />
                    <TextAreaField label="Description" value={p5.desc} onChange={(e) => setP5({ ...p5, desc: e.target.value })} rows={2} />
                  </div>
                </div>
              </div>

              {/* Right Visual Stack & Footer Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <ImagePickerField
                  label="Sunset Group Photo (Right Main Visual)"
                  value={mainImage}
                  onChange={setMainImage}
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
