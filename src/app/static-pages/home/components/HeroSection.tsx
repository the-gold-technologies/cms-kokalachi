"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { StringListEditor } from "@/components/StringListEditor";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface HeroSectionContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  subtitle1: string;
  subtitle2: string;
  backgroundImage: string;
  destPlaceholder: string;
  popularDestinations: string[];
  quickDatePresets: string[];
}

export function HeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states initialized to clean empty values (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle1, setSubtitle1] = useState("");
  const [subtitle2, setSubtitle2] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [destPlaceholder, setDestPlaceholder] = useState("");
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [quickDatePresets, setQuickDatePresets] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle1(initialData.subtitle1 ?? "");
      setSubtitle2(initialData.subtitle2 ?? "");
      setBackgroundImage(initialData.backgroundImage ?? "");
      setDestPlaceholder(initialData.destPlaceholder ?? "");
      setPopularDestinations(
        Array.isArray(initialData.popularDestinations) ? initialData.popularDestinations : [],
      );
      setQuickDatePresets(
        Array.isArray(initialData.quickDatePresets) ? initialData.quickDatePresets : [],
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: HeroSectionContent = {
        tagline,
        headline,
        scriptAccent,
        subtitle1,
        subtitle2,
        backgroundImage,
        destPlaceholder,
        popularDestinations,
        quickDatePresets,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "HeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Hero section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save Hero section");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="HeroSection"
          description="Manage primary headline, script font accent, subheadings, hero background image, and search filter tags."
          badge="Section 1"
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
                label="Top Category Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. FOR TRAVELLERS WHO WERE ONLY EVER RESTING"
                tooltip="Appears in uppercase small font above the primary headline"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Primary Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Find your circle. Find your next"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. journey."
                  tooltip="Rendered in flowing handwritten script with curved gold underline"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Subtitle Line 1"
                  value={subtitle1}
                  onChange={(e) => setSubtitle1(e.target.value)}
                  placeholder="e.g. Curated group trips for solo travellers."
                />
                <InputField
                  label="Subtitle Line 2"
                  value={subtitle2}
                  onChange={(e) => setSubtitle2(e.target.value)}
                  placeholder="e.g. Real people. Real stories. Real connections."
                />
              </div>

              <ImagePickerField
                label="Hero Background Image"
                value={backgroundImage}
                onChange={setBackgroundImage}
                tooltip="High-res landscape photography backdrop for hero area"
              />

              <InputField
                label="Search Input Placeholder"
                value={destPlaceholder}
                onChange={(e) => setDestPlaceholder(e.target.value)}
                placeholder="e.g. Where to?"
              />

              <StringListEditor
                label="Popular Destinations (Search Suggestions)"
                items={popularDestinations}
                onChange={setPopularDestinations}
                placeholder="e.g. Himachal Pradesh, Kashmir, Meghalaya"
                tooltip="Tags displayed inside the interactive search destination dropdown"
              />

              <StringListEditor
                label="Quick Date Presets"
                items={quickDatePresets}
                onChange={setQuickDatePresets}
                placeholder="e.g. Flexible Dates, Next 30 Days, Upcoming Weekends"
                tooltip="Quick selection pills in the calendar filter"
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
