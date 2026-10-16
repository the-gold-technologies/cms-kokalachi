"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  ContactHeroSection,
  ContactHeadquarterSection,
  ContactFormConfigSection,
} from "./components";
import toast from "react-hot-toast";

export default function ContactUsCMSPage() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact-us");
      const json = await res.json();
      if (json.success && json.data) {
        setSections(json.data.sections || {});
      }
    } catch {
      toast.error("Failed to load contact page content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleSaveSection = async (sectionType: string, content: any) => {
    try {
      const res = await fetch("/api/contact-us", {
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
        title="Contact Us Page Content"
        description="Manage banner graphic, company credentials, primary contact information, and enquiry form settings."
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm animate-pulse">
          Loading contact page content...
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Section 1: Hero Banner & Titles */}
          <ContactHeroSection
            initialData={sections.ContactHero}
            onSave={(data) => handleSaveSection("ContactHero", data)}
          />

          {/* Section 2: Headquarter Contact Details */}
          <ContactHeadquarterSection
            initialData={sections.ContactHeadquarter}
            onSave={(data) => handleSaveSection("ContactHeadquarter", data)}
          />

          {/* Section 3: Enquiry Form Card Settings */}
          <ContactFormConfigSection
            initialData={sections.ContactForm || sections.EnquiryForm}
            onSave={(data) => handleSaveSection("ContactForm", data)}
          />
        </div>
      )}
    </section>
  );
}
