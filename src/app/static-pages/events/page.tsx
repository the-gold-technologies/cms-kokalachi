"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { EventsHeroSection, EventsContentSection, EventsGallerySection } from "./components";
import toast from "react-hot-toast";

export default function EventsCMSPage() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success && json.data) {
        setSections(json.data);
      }
    } catch {
      toast.error("Failed to load events page content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSaveSection = async (sectionType: string, content: any) => {
    try {
      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionType,
          content,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Section updated successfully!");
        setSections((prev) => ({ ...prev, [sectionType]: content }));
      } else {
        toast.error(json.error || "Failed to save changes");
      }
    } catch {
      toast.error("Network error saving changes");
    }
  };

  return (
    <section className="flex flex-col gap-8 pb-16">
      <PageHeader
        title="Events & Activities Page"
        description="Manage banner graphic, stakeholder engagement narrative, and photo gallery showcase."
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm animate-pulse">
          Loading events page content...
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Section 1: Hero Banner */}
          <EventsHeroSection
            initialData={sections.EventsHero}
            onSave={(data) => handleSaveSection("EventsHero", data)}
          />

          {/* Section 2: Heading & Intro Text */}
          <EventsContentSection
            initialData={sections.EventsContent}
            onSave={(data) => handleSaveSection("EventsContent", data)}
          />

          {/* Section 3: Photo Gallery */}
          <EventsGallerySection
            initialData={sections.EventsGallery}
            onSave={(data) => handleSaveSection("EventsGallery", data)}
          />
        </div>
      )}
    </section>
  );
}
