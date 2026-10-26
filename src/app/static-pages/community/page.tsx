"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CommunityHeroSection,
  CommunityChaptersSection,
  CommunityCtaSection,
  CommunitySeoSection,
} from "./components";

export default function CommunityCMSPage() {
  const [communityData, setCommunityData] = useState<any>(null);
  const [seoData, setSeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunityData() {
      try {
        const res = await fetch("/api/community");
        const json = await res.json();
        if (json.success) {
          setCommunityData(json.data?.sections ?? json.data);
          if (json.seo) {
            setSeoData(json.seo);
          }
        }
      } catch (err) {
        console.error("Failed to load community page content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <PageHeader
        title="Community Page Sections"
        description="Manage the community page live sections: Top Hero Banner, Destination Chapters (scrapbook photo/video wall & traveller review letters), the Share Your Story Call-to-Action, and Page SEO."
      />

      <CommunityHeroSection initialData={communityData?.CommunityHeroSection} />
      <CommunityChaptersSection initialData={communityData?.CommunityChaptersSection} />
      <CommunityCtaSection initialData={communityData?.CommunityCtaSection} />
      <CommunitySeoSection initialSeo={seoData} />
    </section>
  );
}
