"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImageUploadField } from "@/components/ImageUploadField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

export interface AboutHeroData {
  bannerImage?: string;
  altText?: string;
}

export function AboutHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [images, setImages] = useState<(File | string | null)[]>(
    initialData?.bannerImage ? [initialData.bannerImage] : [],
  );
  const [altText, setAltText] = useState(initialData?.altText || "");

  useEffect(() => {
    if (initialData) {
      if (initialData.bannerImage !== undefined) {
        setImages(initialData.bannerImage ? [initialData.bannerImage] : []);
      }
      if (initialData.altText !== undefined) {
        setAltText(initialData.altText || "");
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const validImages = images.filter((img): img is File | string => !!img);

      if (validImages.length === 0) {
        toast.error("Please upload a hero banner image.");
        setLoading(false);
        return;
      }

      // 1. Upload file if newly selected
      const [uploadedUrl] = await uploadFiles(validImages);
      const finalImageUrl = uploadedUrl || "";

      const payload = {
        bannerImage: finalImageUrl,
        altText: altText.trim(),
      };

      // 2. Save to /api/about-us
      const res = await fetch("/api/about-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "AboutHero",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setImages([finalImageUrl]);
        toast.success("Hero Banner saved successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving hero banner");
    } finally {
      setLoading(false);
    }
  };

  const validCount = images.filter(Boolean).length;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="1. Hero Banner (About-HPCL Hero)"
        description="Upload banner graphic and manage accessibility alt text for the About Us hero."
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
          <div className="flex flex-col gap-6 pt-4">
            <ImageUploadField
              label="Hero Banner Image"
              images={images}
              onImagesChange={setImages}
              maxImages={1}
              tooltip="Upload banner image (recommended resolution 1920x715px or 21:9 aspect ratio)."
            />

            <InputField
              label="Image Alt Text (SEO & Accessibility)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. About MAHALAXMI ENTERPRISES Banner"
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
  );
}
