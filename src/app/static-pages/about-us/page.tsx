"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  AboutHeroSection,
  AboutMahalaxmiContentSection,
  LubesHeadquarterSection,
} from "./components";

export default function AboutUsPageEditor() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const res = await fetch("/api/about-us");
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
    <section className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="About Us Page Content"
        description="Manage the live sections of your About Us page including Hero Banner, About Mahalaxmi Enterprises, Why Choose Us cards, and Headquarters info."
      />

      <AboutHeroSection initialData={aboutData?.AboutHero} />
      <AboutMahalaxmiContentSection initialData={aboutData?.AboutMahalaxmiContent} />
      <LubesHeadquarterSection initialData={aboutData?.LubesHeadquarterSection} />
    </section>
  );
}
