"use client";

import React, { useState, useEffect } from "react";
import { Share2, Award, Copyright } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { ImagePickerField } from "@/components/ImagePickerField";

export default function FooterSocialMediaCMSPage() {
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [savedSocial, setSavedSocial] = useState(false);

  const [loadingBadges, setLoadingBadges] = useState(false);
  const [savedBadges, setSavedBadges] = useState(false);

  // Social Links
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  // Footer Partner Badges & Copyright
  const [hpclBadge, setHpclBadge] = useState("");
  const [indiaGovBadge, setIndiaGovBadge] = useState("");
  const [globalCompactBadge, setGlobalCompactBadge] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo");
        const json = await res.json();
        if (json.success && json.data?.socialLinks) {
          const s = json.data.socialLinks;
          if (s.facebook) setFacebook(s.facebook);
          if (s.linkedin) setLinkedin(s.linkedin);
          if (s.instagram) setInstagram(s.instagram);
          if (s.youtube) setYoutube(s.youtube);
          if (s.hpclBadge) setHpclBadge(s.hpclBadge);
          if (s.indiaGovBadge) setIndiaGovBadge(s.indiaGovBadge);
          if (s.globalCompactBadge) setGlobalCompactBadge(s.globalCompactBadge);
          if (s.copyrightText) setCopyrightText(s.copyrightText);
        }
      } catch (err) {
        console.error("Failed to load footer & social config:", err);
      }
    }
    loadConfig();
  }, []);

  const saveConfig = async (updatedFields: Record<string, any>) => {
    const getRes = await fetch("/api/seo");
    const currentJson = await getRes.json();
    const currentSocials = currentJson.data?.socialLinks || {};

    const payload = {
      socialLinks: {
        ...currentSocials,
        facebook,
        linkedin,
        instagram,
        youtube,
        hpclBadge,
        indiaGovBadge,
        globalCompactBadge,
        copyrightText,
        ...updatedFields,
      },
    };

    const res = await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  };

  const handleSaveSocial = async () => {
    setLoadingSocial(true);
    setSavedSocial(false);
    try {
      const json = await saveConfig({
        facebook,
        linkedin,
        instagram,
        youtube,
      });
      if (json.success) {
        setSavedSocial(true);
        toast.success("Social media profiles updated successfully!");
        setTimeout(() => setSavedSocial(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setLoadingSocial(false);
    }
  };

  const handleSaveBadges = async () => {
    setLoadingBadges(true);
    setSavedBadges(false);
    try {
      const json = await saveConfig({
        hpclBadge,
        indiaGovBadge,
        globalCompactBadge,
        copyrightText,
      });
      if (json.success) {
        setSavedBadges(true);
        toast.success("Footer partner badges & copyright updated successfully!");
        setTimeout(() => setSavedBadges(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setLoadingBadges(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 pb-16 w-full max-w-5xl mx-auto">
      <PageHeader
        title="Footer &amp; Social Media Management"
        description="Manage corporate social media links, official partner accreditation badges, and copyright notice displayed in the website footer."
        badge="Footer &amp; Socials"
      />

      <div className="flex flex-col gap-8 w-full">
        {/* Form 1: Social Media Channels (Full Width) */}
        <div className="w-full border border-slate-200 rounded-3xl bg-white p-7 sm:p-9 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EB1E25] flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">1. Social Media Profiles</h3>
              <p className="text-xs text-slate-500">
                Corporate channel URLs appearing in the website footer and navigation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Facebook Page URL"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
            />
            <InputField
              label="LinkedIn Company URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/..."
            />
            <InputField
              label="Instagram Profile URL"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
            />
            <InputField
              label="YouTube Channel URL"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://youtube.com/@..."
            />
          </div>

          {/* Form 1 Full Width Save Button */}
          <div className="pt-4 border-t border-slate-100 mt-2">
            <SaveButton
              loading={loadingSocial}
              saved={savedSocial}
              onClick={handleSaveSocial}
              label="Save Changes"
              className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md"
            />
          </div>
        </div>

        {/* Form 2: Official Partner Badges & Copyright (Full Width) */}
        <div className="w-full border border-slate-200 rounded-3xl bg-white p-7 sm:p-9 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                2. Footer Partner Badges &amp; Copyright
              </h3>
              <p className="text-xs text-slate-500">
                Upload official accreditation badges and configure the footer copyright notice
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              <ImagePickerField
                label="HPCL Official Partner Logo Badge"
                value={hpclBadge}
                onChange={(url) => setHpclBadge(url)}
                folder="mahalaxmi/footer"
                helperText="Main corporate HPCL partner logo graphic appearing on the left of the footer credentials."
              />
            </div>

            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              <ImagePickerField
                label="India.gov.in Official Badge"
                value={indiaGovBadge}
                onChange={(url) => setIndiaGovBadge(url)}
                folder="mahalaxmi/footer"
                helperText="National portal of India badge displayed in the partner column."
              />
            </div>

            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              <ImagePickerField
                label="UN Global Compact Certification Badge"
                value={globalCompactBadge}
                onChange={(url) => setGlobalCompactBadge(url)}
                folder="mahalaxmi/footer"
                helperText="United Nations Global Compact compliance badge displayed in the partner column."
              />
            </div>

            {/* Copyright Text Field */}
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              <InputField
                label="Footer Copyright Text Notice"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2026 Mahalaxmi Enterprises. All rights reserved."
                helperText="Displays in the bottom-left corner of the website footer."
              />
            </div>
          </div>

          {/* Form 2 Full Width Save Button */}
          <div className="pt-4 border-t border-slate-100 mt-2">
            <SaveButton
              loading={loadingBadges}
              saved={savedBadges}
              onClick={handleSaveBadges}
              label="Save Changes"
              className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
