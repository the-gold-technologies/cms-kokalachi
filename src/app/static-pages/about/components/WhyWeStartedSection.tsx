"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface WhyWeStartedContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  description: string;
  mainImage: string;
  polaroidImage: string;
  polaroidNote: string;
  item1Title: string;
  item2Title: string;
  item3Title: string;
  conclusionPrefix: string;
  conclusionBrand: string;
  conclusionText: string;
}

export function WhyWeStartedSection({ initialData }: { initialData?: any }) {
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
  const [polaroidNote, setPolaroidNote] = useState("");

  const [item1Title, setItem1Title] = useState("");
  const [item2Title, setItem2Title] = useState("");
  const [item3Title, setItem3Title] = useState("");

  const [conclusionPrefix, setConclusionPrefix] = useState("");
  const [conclusionBrand, setConclusionBrand] = useState("");
  const [conclusionText, setConclusionText] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setMainImage(initialData.mainImage ?? "");
      setPolaroidImage(initialData.polaroidImage ?? "");
      setPolaroidNote(initialData.polaroidNote ?? "");

      setItem1Title(initialData.item1Title ?? initialData.items?.[0] ?? "");
      setItem2Title(initialData.item2Title ?? initialData.items?.[1] ?? "");
      setItem3Title(initialData.item3Title ?? initialData.items?.[2] ?? "");

      setConclusionPrefix(initialData.conclusionPrefix ?? "");
      setConclusionBrand(initialData.conclusionBrand ?? "");
      setConclusionText(initialData.conclusionText ?? initialData.conclusion ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: WhyWeStartedContent = {
        tagline,
        headline,
        scriptAccent,
        description,
        mainImage,
        polaroidImage,
        polaroidNote,
        item1Title,
        item2Title,
        item3Title,
        conclusionPrefix,
        conclusionBrand,
        conclusionText,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "WhyWeStartedSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Why We Started section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Why We Started section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="WhyWeStartedSection"
          description="The origin story: The problem of postponed plans, 3 obstacle callouts, and the birth of Kokalachi."
          badge="Step 2"
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
                placeholder="e.g. WHY WE STARTED"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. The problem we couldn't"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. ignore."
                />
              </div>

              <TextAreaField
                label="Intro Narrative"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Big travel plans often stay on hold, not because the desire fades..."
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <ImagePickerField
                  label="Main Group Journey Photo"
                  value={mainImage}
                  onChange={setMainImage}
                  tooltip="Hero visual of travellers walking or laughing together"
                />
                <div className="space-y-3">
                  <ImagePickerField
                    label="Overlapping Polaroid Photo"
                    value={polaroidImage}
                    onChange={setPolaroidImage}
                  />
                  <InputField
                    label="Polaroid Handwritten Note"
                    value={polaroidNote}
                    onChange={(e) => setPolaroidNote(e.target.value)}
                    placeholder="e.g. Plans are easy. People make it real."
                  />
                </div>
              </div>

              {/* 3 Obstacle Callouts */}
              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">3 Pain Point Circles</h4>
                  <p className="text-xs text-gray-500">
                    Icons and captions connected by the wavy flight line
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Circle 1 (Map)</span>
                    <InputField
                      label="Caption Text"
                      value={item1Title}
                      onChange={(e) => setItem1Title(e.target.value)}
                      placeholder="e.g. Big plans, left on hold."
                    />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-amber-800 block">
                      Circle 2 (Calendar)
                    </span>
                    <InputField
                      label="Caption Text"
                      value={item2Title}
                      onChange={(e) => setItem2Title(e.target.value)}
                      placeholder="e.g. Schedules don't always align."
                    />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Circle 3 (Users)</span>
                    <InputField
                      label="Caption Text"
                      value={item3Title}
                      onChange={(e) => setItem3Title(e.target.value)}
                      placeholder="e.g. The right people are hard to find."
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Conclusion */}
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E5A60]">
                  Bottom Brand Mission Conclusion
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Prefix Text"
                    value={conclusionPrefix}
                    onChange={(e) => setConclusionPrefix(e.target.value)}
                    placeholder="e.g. So we built"
                  />
                  <InputField
                    label="Brand Highlight Word"
                    value={conclusionBrand}
                    onChange={(e) => setConclusionBrand(e.target.value)}
                    placeholder="e.g. Kokalachi."
                  />
                </div>
                <TextAreaField
                  label="Mission Statement"
                  value={conclusionText}
                  onChange={(e) => setConclusionText(e.target.value)}
                  placeholder="e.g. A way to bring together people who share the same pull toward the world so a trip doesn't need to wait for the stars to align."
                  rows={2}
                />
              </div>

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
