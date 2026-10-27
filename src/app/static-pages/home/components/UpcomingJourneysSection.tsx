"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function UpcomingJourneysSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tag,
        headline,
        scriptAccent,
        headlineSuffix,
        subtitle,
        ctaText,
        ctaLink,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "UpcomingJourneysSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Upcoming Journeys section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Upcoming Journeys section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="UpcomingJourneysSection"
          description="Controls headline, copy, and explore button for the upcoming journeys carousel on the homepage. Journeys and vibe filters are centrally managed under Journeys."
          badge="Section 8"
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
                label="Section Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. UPCOMING JOURNEYS"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Find your next"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. escape."
                />
                <InputField
                  label="Headline Suffix"
                  value={headlineSuffix}
                  onChange={(e) => setHeadlineSuffix(e.target.value)}
                  placeholder="e.g. begin?"
                />
              </div>

              <TextAreaField
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Handcrafted itineraries ready to book..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bottom CTA Button Label"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Explore All Journeys"
                />
                <InputField
                  label="Bottom CTA Destination Link"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. /journeys"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <SaveButton loading={loading} saved={saved} onClick={handleSave} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
