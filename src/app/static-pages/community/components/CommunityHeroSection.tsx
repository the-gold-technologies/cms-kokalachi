"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function CommunityHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO hardcoded fallback strings)
  const [badge, setBadge] = useState("");
  const [titleLead, setTitleLead] = useState("");
  const [titleAccent, setTitleAccent] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroAlt, setHeroAlt] = useState("");

  useEffect(() => {
    if (initialData) {
      setBadge(initialData.badge ?? "");
      setTitleLead(initialData.titleLead ?? "");
      setTitleAccent(initialData.titleAccent ?? "");
      setDescription(initialData.description ?? "");
      setHeroImage(initialData.heroImage ?? "");
      setHeroAlt(initialData.heroAlt ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        badge: badge.trim(),
        titleLead: titleLead.trim(),
        titleAccent: titleAccent.trim(),
        description: description.trim(),
        heroImage: heroImage.trim(),
        heroAlt: heroAlt.trim(),
      };

      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityHeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save Community Hero");
      }

      setSaved(true);
      toast.success("Community Hero Banner saved successfully!");
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
        title="1. Community Hero Banner"
        description="Top header of the community page: badge pill, headline with cursive accent, subtitle, and backdrop photo."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge="Community Hero"
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Badge Tag"
              placeholder="e.g. The Kokalachi Community"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
            <InputField
              label="Title Lead"
              placeholder="e.g. Strangers once, now "
              value={titleLead}
              onChange={(e) => setTitleLead(e.target.value)}
            />
            <InputField
              label="Title Script Accent"
              placeholder="e.g. family."
              value={titleAccent}
              onChange={(e) => setTitleAccent(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-700">
              Hero Subtitle / Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Photos, videos and letters from the people who travelled with us..."
              rows={3}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-6">
            <ImagePickerField
              label="Hero Background Photo"
              value={heroImage}
              onChange={setHeroImage}
              placeholder="Upload or paste image URL"
              tooltip="Scenic backdrop photo for the Community Hero banner"
            />
            <InputField
              label="Image Alt Text"
              placeholder="e.g. City Palace across Lake Pichola, Udaipur"
              value={heroAlt}
              onChange={(e) => setHeroAlt(e.target.value)}
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
