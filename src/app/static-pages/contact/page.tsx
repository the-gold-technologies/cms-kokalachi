"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ContactHeroSection, ContactFormSection, ContactSidebarSection } from "./components";

export default function ContactUsCMSPage() {
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function loadContactData() {
      try {
        const res = await fetch("/api/contact");
        const json = await res.json();
        if (json.success && json.data) {
          setContactData(json.data.sections ?? json.data);
        }
      } catch (err) {
        console.error("Failed to load contact page content:", err);
      }
    }
    loadContactData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <PageHeader
        title="Contact Page Sections"
        description="Manage the contact page hero banner, enquiry form options, and sidebar trust commitments."
      />

      <ContactHeroSection initialData={contactData?.ContactHeroSection} />
      <ContactFormSection initialData={contactData?.ContactFormSection} />
      <ContactSidebarSection initialData={contactData?.ContactSidebarSection} />
    </section>
  );
}
