"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  HeroSection,
  WhyWeExistSection,
  HowItWorksSection,
  DifferenceSection,
  GoodCompanySection,
  MomentsThatStayedSection,
  WhoTravelsSection,
  UpcomingJourneysSection,
  BehindKokalachiSection,
} from "./components";

export default function HomePageEditor() {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const res = await fetch("/api/home");
        const json = await res.json();
        if (json.success && json.data) {
          setHomeData(json.data);
        }
      } catch (err) {
        console.error("Failed to load home sections:", err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Home Page Sections"
        description="Manage the layout sections of your homepage. Expand any section to edit its copy, images, and settings."
      />

      <HeroSection initialData={homeData?.HeroSection} />
      <WhyWeExistSection initialData={homeData?.WhyWeExistSection} />
      <HowItWorksSection initialData={homeData?.HowItWorksSection} />
      <DifferenceSection initialData={homeData?.DifferenceSection} />
      <GoodCompanySection initialData={homeData?.GoodCompanySection} />
      <MomentsThatStayedSection initialData={homeData?.MomentsThatStayedSection} />
      {/* Section 7: Who Travels With Us — Commented out to match website layout */}
      {/* <WhoTravelsSection initialData={homeData?.WhoTravelsSection} /> */}
      <UpcomingJourneysSection initialData={homeData?.UpcomingJourneysSection} />
      <BehindKokalachiSection initialData={homeData?.BehindKokalachiSection} />
    </section>
  );
}
