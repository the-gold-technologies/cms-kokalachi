"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ContactFormData {
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface ContactFormConfigSectionProps {
  initialData?: ContactFormData;
  onSave?: (data: ContactFormData) => Promise<boolean | void>;
}

export function ContactFormConfigSection({ initialData, onSave }: ContactFormConfigSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [buttonText, setButtonText] = useState(initialData?.buttonText || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.badge !== undefined) setBadge(initialData.badge || "");
      if (initialData.title !== undefined) setTitle(initialData.title || "");
      if (initialData.subtitle !== undefined) setSubtitle(initialData.subtitle || "");
      if (initialData.buttonText !== undefined) setButtonText(initialData.buttonText || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: ContactFormData = {
        badge: badge.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        buttonText: buttonText.trim(),
      };

      if (onSave) {
        await onSave(payload);
      } else {
        const res = await fetch("/api/contact-us", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "ContactForm",
            content: payload,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Enquiry Form configuration updated successfully!");
        } else {
          toast.error(json.error || "Failed to update form settings");
        }
      }
    } catch {
      toast.error("Network error saving form settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="3. Enquiry Form Card Configuration"
        description="Customize the right-hand enquiry form badge tag, card title, help instructions, and submission button label."
        badge="Enquiry Form"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                label="Form Badge / Tag"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Online Request"
              />
              <InputField
                label="Form Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Send an Enquiry"
                required
              />
              <InputField
                label="Submit Button Text *"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Submit Enquiry"
                required
              />
            </div>

            <TextAreaField
              label="Form Subtitle / Help Instructions"
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Please fill in your details and our team will get back to you with pricing & availability."
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
