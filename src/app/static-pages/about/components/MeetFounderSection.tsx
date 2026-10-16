"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface MeetFounderContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  badge: string;
  founderNames: string;
  founderFullName: string;
  founderTitle: string;
  founderPhoto: string;
  leadQuote: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  storyParagraph4: string;
  closingNote: string;
}

export function MeetFounderSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [badge, setBadge] = useState("");
  const [founderNames, setFounderNames] = useState("");
  const [founderFullName, setFounderFullName] = useState("");
  const [founderTitle, setFounderTitle] = useState("");
  const [founderPhoto, setFounderPhoto] = useState("");
  const [leadQuote, setLeadQuote] = useState("");
  const [storyParagraph1, setStoryParagraph1] = useState("");
  const [storyParagraph2, setStoryParagraph2] = useState("");
  const [storyParagraph3, setStoryParagraph3] = useState("");
  const [storyParagraph4, setStoryParagraph4] = useState("");
  const [closingNote, setClosingNote] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setBadge(initialData.badge ?? "");
      setFounderNames(initialData.founderNames ?? initialData.name ?? "");
      setFounderFullName(initialData.founderFullName ?? "");
      setFounderTitle(initialData.founderTitle ?? initialData.role ?? "");
      setFounderPhoto(initialData.founderPhoto ?? initialData.photo ?? "");
      setLeadQuote(initialData.leadQuote ?? "");

      setStoryParagraph1(initialData.storyParagraph1 ?? "");
      setStoryParagraph2(initialData.storyParagraph2 ?? "");
      setStoryParagraph3(initialData.storyParagraph3 ?? "");
      setStoryParagraph4(initialData.storyParagraph4 ?? "");
      setClosingNote(initialData.closingNote ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: MeetFounderContent = {
        tagline,
        headline,
        scriptAccent,
        badge,
        founderNames,
        founderFullName,
        founderTitle,
        founderPhoto,
        leadQuote,
        storyParagraph1,
        storyParagraph2,
        storyParagraph3,
        storyParagraph4,
        closingNote,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "MeetFounderSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Meet Founders section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Meet Founders section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="MeetFounderSection"
          description="Rachit & Hitesh: 35-year friendship origin story, co-founders photo, and personal journey ethos."
          badge="Step 4"
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
                label="Category Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. MEET THE FOUNDERS"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Some ideas take decades to find their"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. moment."
                />
              </div>

              {/* Founder Image & Glass Card Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <ImagePickerField
                  label="Founders Photo"
                  value={founderPhoto}
                  onChange={setFounderPhoto}
                  tooltip="Card photo of Rachit & Hitesh"
                />

                <div className="space-y-3">
                  <InputField
                    label="Glass Card Badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. CO-FOUNDERS"
                  />
                  <InputField
                    label="Display Short Names"
                    value={founderNames}
                    onChange={(e) => setFounderNames(e.target.value)}
                    placeholder="e.g. Rachit & Hitesh"
                  />
                  <InputField
                    label="Full Names (Handwritten Signature)"
                    value={founderFullName}
                    onChange={(e) => setFounderFullName(e.target.value)}
                    placeholder="e.g. Rachit Ahuja & Hitesh Kalra"
                  />
                  <InputField
                    label="Signature Title"
                    value={founderTitle}
                    onChange={(e) => setFounderTitle(e.target.value)}
                    placeholder="e.g. Co-Founders, Kokalachi ♡"
                  />
                </div>
              </div>

              {/* Story Narrative Paragraphs */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Founders Story Narrative</h4>
                  <p className="text-xs text-gray-500">The 4 conversational story paragraphs describing their 35-year journey</p>
                </div>

                <InputField
                  label="Opening Bold Sentence"
                  value={leadQuote}
                  onChange={(e) => setLeadQuote(e.target.value)}
                  placeholder="e.g. Kokalachi is one of them."
                />

                <TextAreaField
                  label="Paragraph 1 (35 Years of Friendship)"
                  value={storyParagraph1}
                  onChange={(e) => setStoryParagraph1(e.target.value)}
                  placeholder="We've been friends for over 35 years through countless conversations, road trips..."
                  rows={3}
                />

                <TextAreaField
                  label="Paragraph 2 (Hitesh & Rachit Backgrounds)"
                  value={storyParagraph2}
                  onChange={(e) => setStoryParagraph2(e.target.value)}
                  placeholder="Hitesh has spent 28 years in the travel industry... Rachit has spent his own years chasing curiosity..."
                  rows={3}
                />

                <TextAreaField
                  label="Paragraph 3 (Core Realization)"
                  value={storyParagraph3}
                  onChange={(e) => setStoryParagraph3(e.target.value)}
                  placeholder="Between the two of us, one thing became clear travel isn't just about seeing new places..."
                  rows={2}
                />

                <TextAreaField
                  label="Paragraph 4 (Why Kokalachi Was Built)"
                  value={storyParagraph4}
                  onChange={(e) => setStoryParagraph4(e.target.value)}
                  placeholder="That's why we built Kokalachi. Not as another travel company but as a community..."
                  rows={2}
                />

                <InputField
                  label="Closing Warm Invitation Line"
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                  placeholder="e.g. We hope you'll join us on one."
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
