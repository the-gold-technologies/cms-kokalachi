"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { BookOpen } from "lucide-react";

export function BehindKokalachiSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states initialized to clean empty values
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.eyebrow ?? "");
      setHeadline(initialData.headline ?? initialData.title ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? initialData.subtitle ?? "");
      setCtaText(initialData.ctaText ?? initialData.buttonText ?? "");
      setCtaUrl(initialData.ctaUrl ?? initialData.buttonUrl ?? "");
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
        ctaText,
        ctaUrl,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "BehindKokalachiSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("From the Journal section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="BehindKokalachiSection"
          description="Manage 'From the Journal' section header, description, and link to blog articles."
          badge="Section 9"
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
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#C85A24] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0B2A3D] leading-relaxed">
                  <span className="font-bold">Dynamic Content Integration:</span> The featured story
                  and latest blog cards displayed in this section are automatically pulled from your
                  stories in <span className="font-semibold text-[#0E5A60]">Blog Journal</span>. Use
                  this form to customize the section header, copy, and button.
                </div>
              </div>

              <InputField
                label="Section Tagline / Eyebrow"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. FROM THE JOURNAL"
                tooltip="Appears above the headline in uppercase"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Stories that inspire your next"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. journey."
                  tooltip="Rendered in handwritten script with gold underline"
                />
              </div>

              <TextAreaField
                label="Subtitle Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Travel isn't just about destinations. It's about people, cultures, conversations and the memories we bring home..."
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="CTA Button Text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Explore the Journal"
                />
                <InputField
                  label="CTA Button Link"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="e.g. /blogs"
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
