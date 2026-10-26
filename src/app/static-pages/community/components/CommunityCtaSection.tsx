"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";

export function CommunityCtaSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO hardcoded fallback strings)
  const [kicker, setKicker] = useState("");
  const [titleLead, setTitleLead] = useState("");
  const [titleAccent, setTitleAccent] = useState("");
  const [description, setDescription] = useState("");
  const [primaryBtnText, setPrimaryBtnText] = useState("");
  const [primaryBtnUrl, setPrimaryBtnUrl] = useState("");
  const [secondaryBtnText, setSecondaryBtnText] = useState("");
  const [secondaryBtnUrl, setSecondaryBtnUrl] = useState("");
  const [tertiaryLinkText, setTertiaryLinkText] = useState("");
  const [tertiaryLinkUrl, setTertiaryLinkUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setKicker(initialData.kicker ?? "");
      setTitleLead(initialData.titleLead ?? "");
      setTitleAccent(initialData.titleAccent ?? "");
      setDescription(initialData.description ?? "");
      setPrimaryBtnText(initialData.primaryBtnText ?? "");
      setPrimaryBtnUrl(initialData.primaryBtnUrl ?? "");
      setSecondaryBtnText(initialData.secondaryBtnText ?? "");
      setSecondaryBtnUrl(initialData.secondaryBtnUrl ?? "");
      setTertiaryLinkText(initialData.tertiaryLinkText ?? "");
      setTertiaryLinkUrl(initialData.tertiaryLinkUrl ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        kicker: kicker.trim(),
        titleLead: titleLead.trim(),
        titleAccent: titleAccent.trim(),
        description: description.trim(),
        primaryBtnText: primaryBtnText.trim(),
        primaryBtnUrl: primaryBtnUrl.trim(),
        secondaryBtnText: secondaryBtnText.trim(),
        secondaryBtnUrl: secondaryBtnUrl.trim(),
        tertiaryLinkText: tertiaryLinkText.trim(),
        tertiaryLinkUrl: tertiaryLinkUrl.trim(),
      };

      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityCtaSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save Community CTA");
      }

      setSaved(true);
      toast.success("Community Share Your Story CTA saved!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
      <SectionHeader
        title="3. Share Your Story CTA Section"
        description="Bottom banner inviting travellers to send their own stories, link to Instagram, or explore upcoming journeys."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge="Community CTA"
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Kicker / Eyebrow"
              placeholder="e.g. Travelled with us?"
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
            />
            <InputField
              label="Title Lead"
              placeholder="e.g. Your story belongs "
              value={titleLead}
              onChange={(e) => setTitleLead(e.target.value)}
            />
            <InputField
              label="Title Script Accent"
              placeholder="e.g. here too."
              value={titleAccent}
              onChange={(e) => setTitleAccent(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-700">Description / Subtitle</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Send us a few lines and your favourite photos or videos..."
              rows={3}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Primary CTA Button Label"
              placeholder="e.g. Share your story"
              value={primaryBtnText}
              onChange={(e) => setPrimaryBtnText(e.target.value)}
            />
            <InputField
              label="Primary CTA Button URL"
              placeholder="e.g. /contact"
              value={primaryBtnUrl}
              onChange={(e) => setPrimaryBtnUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Secondary Button Label (Instagram)"
              placeholder="e.g. @kokalachi"
              value={secondaryBtnText}
              onChange={(e) => setSecondaryBtnText(e.target.value)}
            />
            <InputField
              label="Secondary Button URL"
              placeholder="e.g. https://www.instagram.com/kokalachi/"
              value={secondaryBtnUrl}
              onChange={(e) => setSecondaryBtnUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Tertiary Explore Link Text"
              placeholder="e.g. Or find the trip next"
              value={tertiaryLinkText}
              onChange={(e) => setTertiaryLinkText(e.target.value)}
            />
            <InputField
              label="Tertiary Explore Link URL"
              placeholder="e.g. /journeys"
              value={tertiaryLinkUrl}
              onChange={(e) => setTertiaryLinkUrl(e.target.value)}
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
      )}
    </article>
  );
}
