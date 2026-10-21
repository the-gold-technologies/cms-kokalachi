"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Image as ImageIcon,
  FileText,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle,
  Compass,
  Sun,
  Moon,
  Info,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export default function SocialMediaFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Section 1: Logos
  const [navbarDarkLogo, setNavbarDarkLogo] = useState("/logo-clean.png");
  const [navbarLightLogo, setNavbarLightLogo] = useState("/clean_logo_lighter.png");
  const [footerLogo, setFooterLogo] = useState("/logo-footer.png");

  // Section 2: Footer Information
  const [footerDescription, setFooterDescription] = useState(
    "Kokalachi designs immersive, slow-paced journeys for conscious travelers, dreamers, and storytellers. We replace tourist traps with authentic human connection.",
  );
  const [footerAddress, setFooterAddress] = useState(
    "91 Springboard, C-2, Sector 1, Noida - 201301",
  );
  const [footerPhone, setFooterPhone] = useState("+91 97118 45700");
  const [footerEmail, setFooterEmail] = useState("hello@kokalachi.com");
  const [copyrightText, setCopyrightText] = useState("© 2026 kokalachitravel.com");

  // Section 3: Centralized Social Media Links
  const [instagram, setInstagram] = useState("https://www.instagram.com/kokalachi/");
  const [facebook, setFacebook] = useState(
    "https://www.facebook.com/share/1MA2Wf52Cr/?mibextid=wwXIfr",
  );
  const [youtube, setYoutube] = useState("https://youtube.com/@kokalachi");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsapp, setWhatsapp] = useState("+91 97118 45700");

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo");
        const json = await res.json();
        if (json.success && json.data) {
          const cfg = json.data;
          const s = cfg.socialLinks || {};

          // Navbar Dark Logo (stored in cfg.logo)
          if (cfg.logo) setNavbarDarkLogo(cfg.logo);
          // Navbar Light Logo (stored in s.navbarLightLogo)
          if (s.navbarLightLogo) setNavbarLightLogo(s.navbarLightLogo);
          // Footer Logo (stored in s.footerLogo)
          if (s.footerLogo) setFooterLogo(s.footerLogo);

          // Footer details (stored in top-level fields)
          if (cfg.siteDescription) setFooterDescription(cfg.siteDescription);
          if (cfg.address) setFooterAddress(cfg.address);
          if (cfg.phone) setFooterPhone(cfg.phone);
          if (cfg.email) setFooterEmail(cfg.email);
          if (s.copyrightText) setCopyrightText(s.copyrightText);

          // Social channels (stored in top-level fields)
          if (cfg.instagramUrl) setInstagram(cfg.instagramUrl);
          if (cfg.facebookUrl) setFacebook(cfg.facebookUrl);
          if (cfg.youtubeUrl) setYoutube(cfg.youtubeUrl);
          if (cfg.linkedinUrl) setLinkedin(cfg.linkedinUrl);
          if (s.twitter) setTwitter(s.twitter);
          if (s.whatsapp) setWhatsapp(s.whatsapp);
        }
      } catch (err) {
        console.error("Failed to load footer & social config:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        logo: navbarDarkLogo,
        siteDescription: footerDescription,
        address: footerAddress,
        phone: footerPhone,
        email: footerEmail,
        instagramUrl: instagram,
        facebookUrl: facebook,
        youtubeUrl: youtube,
        linkedinUrl: linkedin || null,
        socialLinks: {
          navbarLightLogo,
          footerLogo,
          twitter,
          whatsapp,
          copyrightText,
        },
      };

      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setSaved(true);
        toast.success("Social Media & Footer settings updated successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Error saving config:", err);
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pb-20 w-full max-w-5xl mx-auto">
      {/* Clean Page Header */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
            Social Media &amp; Footer
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-normal pl-12.5">
          Manage navbar logos (dark &amp; light variants), footer branding and contact details, and
          centralized social media links.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0E5A60] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-8 w-full">
          {/* Section 1: Logos & Branding (Dark, Light, Footer) */}
          <div className="w-full border border-slate-200/90 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] flex items-center justify-center font-bold">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  1. Website Branding &amp; Logos
                </h3>
                <p className="text-xs text-slate-500">
                  Configure dark &amp; light variants for the navigation bar, plus the footer logo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Navbar Dark Logo */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Navbar Dark Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Dark Variant (Scrolled/Solid Header)"
                  value={navbarDarkLogo}
                  onChange={(url) => setNavbarDarkLogo(url)}
                  folder="kokalachi/brand"
                  placeholder="/logo-clean.png"
                  helperText="Displayed on solid white navbar when user scrolls down."
                />
              </div>

              {/* Navbar Light Logo */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Navbar Light Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Light Variant (Transparent Hero Header)"
                  value={navbarLightLogo}
                  onChange={(url) => setNavbarLightLogo(url)}
                  folder="kokalachi/brand"
                  placeholder="/clean_logo_lighter.png"
                  helperText="Displayed over dark hero images on top transparent navbar."
                />
              </div>

              {/* Footer Logo */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D96C2C]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Footer Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Footer Brand Logo"
                  value={footerLogo}
                  onChange={(url) => setFooterLogo(url)}
                  folder="kokalachi/brand"
                  placeholder="/logo-footer.png"
                  helperText="Logo graphic displayed in the website footer column."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Footer Details & Contact Information */}
          <div className="w-full border border-slate-200/90 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D96C2C]/10 text-[#D96C2C] flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  2. Footer Details &amp; Contact Information
                </h3>
                <p className="text-xs text-slate-500">
                  Address, phone numbers, email, and brand description appearing in the website
                  footer.
                </p>
              </div>
            </div>

            {/* Footer Description / Bio */}
            <div>
              <TextAreaField
                label="Footer Brand Description"
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                rows={3}
                placeholder="Kokalachi designs immersive, slow-paced journeys..."
                helperText="Short narrative displayed directly beneath the footer logo."
              />
            </div>

            {/* Address, Phone, Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <InputField
                  label="Registered Address"
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                  placeholder="e.g. 91 Springboard, C-2, Sector 1, Noida - 201301"
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Official Contact Number"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  placeholder="e.g. +91 97118 45700"
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Official Contact Email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="e.g. hello@kokalachi.com"
                />
              </div>
            </div>

            {/* Copyright Notice */}
            <div className="pt-2">
              <InputField
                label="Copyright Notice"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2026 kokalachitravel.com"
                helperText="Displays in the bottom sub-bar of the website footer."
              />
            </div>
          </div>

          {/* Section 3: Centralized Social Media Channels */}
          <div className="w-full border border-slate-200/90 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  3. Centralized Social Media Profiles
                </h3>
                <p className="text-xs text-slate-500">
                  Single source of truth for all social channels displayed across the entire
                  website.
                </p>
              </div>
            </div>

            {/* Centralized Hub Info Banner */}
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/70 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0E5A60] shrink-0 mt-0.5" />
              <p className="text-xs text-teal-900 leading-relaxed">
                <span className="font-bold">Centralized Hub: </span>
                All social media icons across the website (Navbar, Footer, Contact Page) read from
                these fields. They are managed exclusively in this section.
              </p>
            </div>

            {/* Social Media Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Instagram */}
              <div className="space-y-1">
                <InputField
                  label="Instagram Profile URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://www.instagram.com/kokalachi/"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-1">
                <InputField
                  label="Facebook Page URL"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://www.facebook.com/share/..."
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1">
                <InputField
                  label="YouTube Channel URL"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@kokalachi"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <InputField
                  label="LinkedIn Company URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/kokalachi"
                />
              </div>

              {/* Twitter / X */}
              <div className="space-y-1">
                <InputField
                  label="Twitter / X Profile URL"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/kokalachi"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <InputField
                  label="WhatsApp Number / Link"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 97118 45700 or https://wa.me/..."
                />
              </div>
            </div>
          </div>

          {/* Full-Width Save Bar at Bottom */}
          <div className="pt-2">
            <SaveButton
              loading={saving}
              saved={saved}
              onClick={handleSave}
              label="Save All Changes"
              className="w-full py-4 text-sm font-bold shadow-md hover:shadow-lg"
            />
          </div>
        </form>
      )}
    </section>
  );
}
