"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ExploreJourneysContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  description: string;
}

export function ExploreJourneysSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? initialData.subtitle ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: ExploreJourneysContent = {
        tagline,
        headline,
        scriptAccent,
        description,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ExploreJourneysSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Explore Journeys section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Explore Journeys section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="ExploreJourneysSection"
          description="Section header and copy above the 3 featured upcoming journey cards on the About page."
          badge="Step 5"
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
                placeholder="e.g. UPCOMING TRIPS"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Explore Our"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. Journeys."
                />
              </div>

              <TextAreaField
                label="Section Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Find your next adventure with these handcrafted experiences."
                rows={2}
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
