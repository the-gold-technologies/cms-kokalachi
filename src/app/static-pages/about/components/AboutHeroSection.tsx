"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface AboutHeroContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  headlineSuffix: string;
  handwrittenSubtitle: string;
  backgroundImage: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  polaroid1Title: string;
  polaroid1Image: string;
  polaroid2Title: string;
  polaroid2Image: string;
  polaroid3Title: string;
  polaroid3Image: string;
  doodleNote: string;
}

export function AboutHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [handwrittenSubtitle, setHandwrittenSubtitle] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  const [primaryCtaText, setPrimaryCtaText] = useState("");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");

  const [polaroid1Title, setPolaroid1Title] = useState("");
  const [polaroid1Image, setPolaroid1Image] = useState("");
  const [polaroid2Title, setPolaroid2Title] = useState("");
  const [polaroid2Image, setPolaroid2Image] = useState("");
  const [polaroid3Title, setPolaroid3Title] = useState("");
  const [polaroid3Image, setPolaroid3Image] = useState("");
  const [doodleNote, setDoodleNote] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setHandwrittenSubtitle(initialData.handwrittenSubtitle ?? initialData.subtitle ?? "");
      setBackgroundImage(initialData.backgroundImage ?? initialData.bannerImage ?? "");
      setPrimaryCtaText(initialData.primaryCtaText ?? "");
      setPrimaryCtaLink(initialData.primaryCtaLink ?? "");
      setSecondaryCtaText(initialData.secondaryCtaText ?? "");
      setSecondaryCtaLink(initialData.secondaryCtaLink ?? "");

      setPolaroid1Title(initialData.polaroid1Title ?? "");
      setPolaroid1Image(initialData.polaroid1Image ?? "");
      setPolaroid2Title(initialData.polaroid2Title ?? "");
      setPolaroid2Image(initialData.polaroid2Image ?? "");
      setPolaroid3Title(initialData.polaroid3Title ?? "");
      setPolaroid3Image(initialData.polaroid3Image ?? "");
      setDoodleNote(initialData.doodleNote ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: AboutHeroContent = {
        tagline,
        headline,
        scriptAccent,
        headlineSuffix,
        handwrittenSubtitle,
        backgroundImage,
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        polaroid1Title,
        polaroid1Image,
        polaroid2Title,
        polaroid2Image,
        polaroid3Title,
        polaroid3Image,
        doodleNote,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "AboutHeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("About Hero section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving About Hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="AboutHeroSection"
          description="Main banner heading, handwritten subtitle, CTAs, background image, and the 3-polaroid card stack."
          badge="Step 1"
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
                label="Category Tagline Badge"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. ABOUT KOKALACHI"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Built on Friendships. Made for"
                />
                <InputField
                  label="Script Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. Meaningful"
                />
                <InputField
                  label="Headline Suffix"
                  value={headlineSuffix}
                  onChange={(e) => setHeadlineSuffix(e.target.value)}
                  placeholder="e.g. Journeys."
                />
              </div>

              <InputField
                label="Handwritten Subtitle"
                value={handwrittenSubtitle}
                onChange={(e) => setHandwrittenSubtitle(e.target.value)}
                placeholder="e.g. Same Roads. New People. Greater Stories."
                tooltip="Rendered in flowing handwritten font under the title"
              />

              <ImagePickerField
                label="Hero Background Image"
                value={backgroundImage}
                onChange={setBackgroundImage}
                tooltip="Scenic backdrop image for the About Hero section"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">Primary CTA Button</h4>
                  <InputField
                    label="Button Text"
                    value={primaryCtaText}
                    onChange={(e) => setPrimaryCtaText(e.target.value)}
                    placeholder="e.g. Our Story"
                  />
                  <InputField
                    label="Button Target Link"
                    value={primaryCtaLink}
                    onChange={(e) => setPrimaryCtaLink(e.target.value)}
                    placeholder="e.g. #why-we-started"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">Secondary Video CTA</h4>
                  <InputField
                    label="Button Text"
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    placeholder="e.g. Watch Our Journey"
                  />
                  <InputField
                    label="Video / Action Link"
                    value={secondaryCtaLink}
                    onChange={(e) => setSecondaryCtaLink(e.target.value)}
                    placeholder="e.g. #video"
                  />
                </div>
              </div>

              {/* 3 Polaroids & Doodle on Right Column */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Photo Stack Polaroids (Right Column)</h4>
                  <p className="text-xs text-gray-500">The 3 angled polaroid snapshots with handwritten titles and right margin doodle</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-teal-800 uppercase block">Polaroid 1 (Left Tilt)</span>
                    <InputField
                      label="Handwritten Title"
                      value={polaroid1Title}
                      onChange={(e) => setPolaroid1Title(e.target.value)}
                      placeholder="e.g. New Places"
                    />
                    <ImagePickerField
                      label="Photo"
                      value={polaroid1Image}
                      onChange={setPolaroid1Image}
                    />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-teal-800 uppercase block">Polaroid 2 (Right Tilt)</span>
                    <InputField
                      label="Handwritten Title"
                      value={polaroid2Title}
                      onChange={(e) => setPolaroid2Title(e.target.value)}
                      placeholder="e.g. Bigger Stories"
                    />
                    <ImagePickerField
                      label="Photo"
                      value={polaroid2Image}
                      onChange={setPolaroid2Image}
                    />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-teal-800 uppercase block">Polaroid 3 (Center Foreground)</span>
                    <InputField
                      label="Handwritten Title"
                      value={polaroid3Title}
                      onChange={(e) => setPolaroid3Title(e.target.value)}
                      placeholder="e.g. Real Connections"
                    />
                    <ImagePickerField
                      label="Photo"
                      value={polaroid3Image}
                      onChange={setPolaroid3Image}
                    />
                  </div>
                </div>

                <InputField
                  label="Handwritten Margin Note"
                  value={doodleNote}
                  onChange={(e) => setDoodleNote(e.target.value)}
                  placeholder="e.g. More Than Just Destinations"
                  tooltip="Text floating near the hand-drawn heart doodle"
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
