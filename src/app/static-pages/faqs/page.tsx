"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FaqsHeroSection, FaqsAccordionSection, FaqsCtaSection } from "./components";

export default function FaqsCMSPage() {
  const [faqsData, setFaqsData] = useState<any>(null);

  useEffect(() => {
    async function loadFaqsData() {
      try {
        const res = await fetch("/api/faqs");
        const json = await res.json();
        if (json.success && json.data) {
          setFaqsData(json.data.sections ?? json.data);
        }
      } catch (err) {
        console.error("Failed to load FAQs page content:", err);
      }
    }
    loadFaqsData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <PageHeader
        title="FAQ Page Sections"
        description="Manage the FAQs hero banner, categorized questions & answers, and contact support call-to-action."
      />

      <FaqsHeroSection initialData={faqsData?.FaqsHeroSection} />
      <FaqsAccordionSection initialData={faqsData?.FaqsAccordionSection} />
      <FaqsCtaSection initialData={faqsData?.FaqsCtaSection} />
    </section>
  );
}
