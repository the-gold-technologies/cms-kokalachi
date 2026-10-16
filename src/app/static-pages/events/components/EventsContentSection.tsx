"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface EventsContentData {
  title?: string;
  introText?: string;
}

interface EventsContentSectionProps {
  initialData?: EventsContentData;
  onSave?: (data: EventsContentData) => Promise<boolean | void>;
}

export function EventsContentSection({ initialData, onSave }: EventsContentSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState(initialData?.title || "");
  const [introText, setIntroText] = useState(initialData?.introText || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title || "");
      if (initialData.introText !== undefined) setIntroText(initialData.introText || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: EventsContentData = {
        title: title.trim(),
        introText: introText.trim(),
      };

      if (onSave) {
        await onSave(payload);
      } else {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "EventsContent",
            content: payload,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Events content updated successfully!");
        } else {
          toast.error(json.error || "Failed to update events content");
        }
      }
    } catch {
      toast.error("Network error saving content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="2. Events Main Heading & Introduction"
        description="Configure the main title and stakeholder engagement overview paragraph."
        badge="Heading & Text"
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
            <InputField
              label="Page Heading *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="EVENTS"
              required
            />

            <TextAreaField
              label="Introduction Description *"
              rows={4}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Mahalaxmi Enterprises actively engages with their stakeholders..."
              required
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
