"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { ImageUploadField } from "@/components/ImageUploadField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

export function HeroSliderSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<(File | string | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      if (Array.isArray(initialData.slides)) {
        setImages(
          initialData.slides.map((item: any) => (typeof item === "string" ? item : item.img || "")),
        );
      } else if (Array.isArray(initialData)) {
        setImages(
          initialData.map((item: any) => (typeof item === "string" ? item : item.img || "")),
        );
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const validImages = images.filter((img): img is File | string => !!img);

      if (validImages.length === 0) {
        toast.error("Please upload at least 1 hero banner image.");
        setLoading(false);
        return;
      }

      // 1. Upload any File objects via /api/upload
      const uploadedUrls = await uploadFiles(validImages);

      // 2. Format as slides array matching the website HeroSlider
      const slides = uploadedUrls.map((url, i) => ({
        id: i + 1,
        img: url,
        title: `HP Lubricants Banner ${i + 1}`,
        link: "#products",
      }));

      // 3. Save to /api/home
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "HeroSlider",
          content: {
            slides,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setImages(uploadedUrls);
        toast.success("Hero slider banners saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving hero slider");
    } finally {
      setLoading(false);
    }
  };

  const validCount = images.filter(Boolean).length;

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Hero Banner Slider"
          description="Upload homepage carousel banner images. Drag and drop multiple banners at once."
          badge={`${validCount} Banner${validCount === 1 ? "" : "s"}`}
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
                label="Hero Slider Images"
                images={images}
                onImagesChange={setImages}
                maxImages={15}
                tooltip="Upload 1920x715px resolution banner graphics for the homepage hero carousel."
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
