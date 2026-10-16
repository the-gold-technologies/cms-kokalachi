"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface ContactHeroContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  bannerImage: string;
}

export function ContactHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? initialData.title ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setBannerImage(initialData.bannerImage ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: ContactHeroContent = {
        tagline,
        headline,
        scriptAccent,
        bannerImage,
      };

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ContactHeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Contact Hero section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Contact Hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="ContactHeroSection"
          description="Top banner photograph, category tag, and headline welcoming travellers to reach out."
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
                label="Tag Badge Pill"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Get In Touch"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Got a question before you"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. join the tribe?"
                  tooltip="Rendered in flowing handwritten script with curved gold underline"
                />
              </div>

              <ImagePickerField
                label="Hero Banner Image"
                value={bannerImage}
                onChange={setBannerImage}
                tooltip="High-res photography banner backdrop for contact page"
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
