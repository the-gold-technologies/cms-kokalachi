"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { ImageUploadField } from "@/components/ImageUploadField";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

interface ContactHeroData {
  title?: string;
  subtitle?: string;
  image?: string;
  altText?: string;
}

interface ContactHeroSectionProps {
  initialData?: ContactHeroData;
  onSave?: (data: ContactHeroData) => Promise<boolean | void>;
}

export function ContactHeroSection({ initialData, onSave }: ContactHeroSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [images, setImages] = useState<(File | string | null)[]>(
    initialData?.image ? [initialData.image] : [],
  );
  const [altText, setAltText] = useState(initialData?.altText || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.subtitle !== undefined) setSubtitle(initialData.subtitle);
      setImages(initialData.image ? [initialData.image] : []);
      setAltText(initialData.altText || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = "";
      const validImages = images.filter((img): img is File | string => !!img);
      if (validImages.length > 0) {
        const [uploaded] = await uploadFiles(validImages);
        finalImageUrl = uploaded || "";
      }

      const payload: ContactHeroData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        image: finalImageUrl,
        altText: altText.trim(),
      };

      if (onSave) {
        await onSave(payload);
      } else {
        const res = await fetch("/api/contact-us", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "ContactHero",
            content: payload,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Contact Hero banner updated successfully!");
        } else {
          toast.error(json.error || "Failed to update hero banner");
        }
      }
    } catch {
      toast.error("Network error saving Hero banner");
    } finally {
      setLoading(false);
    }
  };

  const validCount = images.filter((img) => img !== null).length;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="1. Contact Hero Banner & Titles"
        description="Manage page headings, subtitle, and the full-width header banner graphic displayed on the Contact Us page."
        badge={`${validCount} Banner`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Page / Section Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contact Us"
              />
              <InputField
                label="Section Subtitle / Tagline"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Get in touch with Mahalaxmi Enterprises"
              />
            </div>

            <ImageUploadField
              label="Hero Banner Graphic"
              images={images}
              onImagesChange={setImages}
              maxImages={1}
              tooltip="Upload full-width header banner image (e.g. 1920x600px)."
            />

            <InputField
              label="Banner Alt Text (SEO & Accessibility)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Contact Us - Mahalaxmi Enterprises"
            />

            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={loading}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
