"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export interface AboutSectionData {
  title: string;
  subtitle: string;
  bodyText: string;
  buttonText: string;
  buttonLink: string;
}

const initialAboutData: AboutSectionData = {
  title: "",
  subtitle: "",
  bodyText: "",
  buttonText: "",
  buttonLink: "",
};

export function AboutSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<AboutSectionData>(initialAboutData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        bodyText: initialData.bodyText || "",
        buttonText: initialData.buttonText || "",
        buttonLink: initialData.buttonLink || "",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        bodyText: formData.bodyText,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "AboutSection",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("About section saved successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving about section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="About Section Content"
          description="Manage the introductory overview, company division text, and product link button on the homepage."
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
              {/* Section Title */}
              <InputField
                label="Section Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ABOUT HP LUBRICANTS & MAHALAXMI ENTERPRISES"
                helperText="Main title for the about section"
              />

              {/* Section Subtitle */}
              <InputField
                label="Section Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Hindustan Petroleum Corporation Limited (HPCL)..."
                helperText="Subtitle displayed below the title"
              />

              {/* Body Text */}
              <TextAreaField
                label="About Description (Body Text)"
                rows={5}
                value={formData.bodyText}
                onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                placeholder="Mahalaxmi Enterprises serves as an Authorized Industrial Lube Distributor (ILD)..."
                helperText="Main narrative overview describing company background and operations"
              />

              {/* Button Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="CTA Button Text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="READ MORE ABOUT US"
                />

                <InputField
                  label="CTA Button Target URL"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/about-us"
                  helperText="Destination link for the button"
                />
              </div>

              {/* Full Width Save Button */}
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
