"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  AboutHeroSection,
  WhyWeStartedSection,
  WhatWeBelieveSection,
  MeetFounderSection,
  ExploreJourneysSection,
  JoinTribeSection,
} from "./components";

export default function AboutUsPageEditor() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const res = await fetch("/api/about");
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
        }
      } catch (err) {
        console.error("Failed to load about us data:", err);
      }
    }
    loadAboutData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="About Us Page Sections"
        description="Manage the live sections of your About Us page: Hero banner, Why We Started, Core Beliefs, Meet the Founder, and Community Tribe CTA."
      />

      <AboutHeroSection initialData={aboutData?.AboutHeroSection} />
      <WhyWeStartedSection initialData={aboutData?.WhyWeStartedSection} />
      <WhatWeBelieveSection initialData={aboutData?.WhatWeBelieveSection} />
      <MeetFounderSection initialData={aboutData?.MeetFounderSection} />
      <ExploreJourneysSection initialData={aboutData?.ExploreJourneysSection} />
      <JoinTribeSection initialData={aboutData?.JoinTribeSection} />
    </section>
  );
}
