"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { SectionFieldsEditor, type SectionValues } from "@/components/SectionFieldsEditor";
import { SHARED_SECTIONS, type SharedSectionKey } from "@/lib/sharedSections";

export default function SharedSectionsCMSPage() {
  const [sections, setSections] = useState<Record<string, SectionValues> | null>(null);

  useEffect(() => {
    async function loadSharedSections() {
      try {
        const res = await fetch("/api/shared-sections");
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setSections(json.data ?? {});
      } catch (err) {
        console.error("Failed to load shared sections:", err);
        toast.error("Failed to load shared sections");
        setSections({});
      }
    }
    loadSharedSections();
  }, []);

  const save = (key: SharedSectionKey) => async (values: SectionValues) => {
    const res = await fetch("/api/shared-sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: key, content: values }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to save");
    setSections((prev) => ({ ...(prev ?? {}), [key]: json.data }));
    return json.data as SectionValues;
  };

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <PageHeader
        title="Shared Sections"
        description="Sections that appear on many pages of the website. Edit them once here and choose the pages they show on."
      />

      {sections === null ? (
        <div className="py-12 text-center text-xs font-medium text-slate-400">
          Loading shared sections...
        </div>
      ) : (
        SHARED_SECTIONS.map((config) => (
          <SectionFieldsEditor
            key={config.key}
            config={config}
            initialData={sections[config.key]}
            defaultOpen={SHARED_SECTIONS.length === 1}
            onSave={save(config.key)}
          />
        ))
      )}
    </section>
  );
}
