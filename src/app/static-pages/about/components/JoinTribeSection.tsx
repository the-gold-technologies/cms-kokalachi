"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface JoinTribeContent {
  tagline: string;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  blobImage: string;
  blobImageAlt: string;
  polaroidNote: string;
  footerTag: string;
}

export function JoinTribeSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("");
  const [primaryButtonLink, setPrimaryButtonLink] = useState("");
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [secondaryButtonLink, setSecondaryButtonLink] = useState("");
  const [blobImage, setBlobImage] = useState("");
  const [blobImageAlt, setBlobImageAlt] = useState("");
  const [polaroidNote, setPolaroidNote] = useState("");
  const [footerTag, setFooterTag] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setDescription(initialData.description ?? initialData.subtitle ?? "");
      setPrimaryButtonText(initialData.primaryButtonText ?? "");
      setPrimaryButtonLink(initialData.primaryButtonLink ?? "");
      setSecondaryButtonText(initialData.secondaryButtonText ?? "");
      setSecondaryButtonLink(initialData.secondaryButtonLink ?? "");
      setBlobImage(initialData.blobImage ?? "");
      setBlobImageAlt(initialData.blobImageAlt ?? "");
      setPolaroidNote(initialData.polaroidNote ?? "");
      setFooterTag(initialData.footerTag ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: JoinTribeContent = {
        tagline,
        headline,
        description,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        blobImage,
        blobImageAlt,
        polaroidNote,
        footerTag,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "JoinTribeSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Join The Tribe section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Join The Tribe section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="JoinTribeSection"
          description="Final CTA banner with curved organic photo, polaroid badge, and direct links to upcoming trips."
          badge="Step 6"
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
                label="Section Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. JOIN THE TRIBE"
              />

              <InputField
                label="Main Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Your next journey is waiting. So are your people."
              />

              <TextAreaField
                label="Inspiring Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Somewhere out there is a group of travellers who are just as ready to explore..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Primary CTA Button
                  </h4>
                  <InputField
                    label="Button Text"
                    value={primaryButtonText}
                    onChange={(e) => setPrimaryButtonText(e.target.value)}
                    placeholder="e.g. Explore Upcoming Trips"
                  />
                  <InputField
                    label="Destination Link"
                    value={primaryButtonLink}
                    onChange={(e) => setPrimaryButtonLink(e.target.value)}
                    placeholder="e.g. /#upcoming-journeys"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Secondary Action Button
                  </h4>
                  <InputField
                    label="Button Text"
                    value={secondaryButtonText}
                    onChange={(e) => setSecondaryButtonText(e.target.value)}
                    placeholder="e.g. Find your Next Journey"
                  />
                  <InputField
                    label="Destination Link"
                    value={secondaryButtonLink}
                    onChange={(e) => setSecondaryButtonLink(e.target.value)}
                    placeholder="e.g. /#upcoming-journeys"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <ImagePickerField
                  label="Curved Organic Blob Photo (Right Column)"
                  value={blobImage}
                  onChange={setBlobImage}
                />
                <InputField
                  label="Blob Image Alt Text"
                  value={blobImageAlt}
                  onChange={(e) => setBlobImageAlt(e.target.value)}
                  placeholder="e.g. Group on mountain"
                />
                <div className="space-y-3">
                  <InputField
                    label="Polaroid Note Text"
                    value={polaroidNote}
                    onChange={(e) => setPolaroidNote(e.target.value)}
                    placeholder="e.g. Good People Brighter Journeys ♡"
                  />
                  <InputField
                    label="Footer Bottom Tag"
                    value={footerTag}
                    onChange={(e) => setFooterTag(e.target.value)}
                    placeholder="e.g. TRAVEL • PEOPLE • PURPOSE"
                  />
                </div>
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
