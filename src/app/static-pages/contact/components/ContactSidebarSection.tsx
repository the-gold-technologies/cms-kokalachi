"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ContactSidebarContent {
  trust1Title: string;
  trust1Desc: string;
  trust2Title: string;
  trust2Desc: string;
  trust3Title: string;
  trust3Desc: string;
  altCardTitle: string;
  emailTitle: string;
  emailDesc: string;
  emailAddress: string;
  instaTitle: string;
  instaDesc: string;
  instaHandle: string;
  instaLink: string;
}

export function ContactSidebarSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [trust1Title, setTrust1Title] = useState("");
  const [trust1Desc, setTrust1Desc] = useState("");
  const [trust2Title, setTrust2Title] = useState("");
  const [trust2Desc, setTrust2Desc] = useState("");
  const [trust3Title, setTrust3Title] = useState("");
  const [trust3Desc, setTrust3Desc] = useState("");

  const [altCardTitle, setAltCardTitle] = useState("");
  const [emailTitle, setEmailTitle] = useState("");
  const [emailDesc, setEmailDesc] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [instaTitle, setInstaTitle] = useState("");
  const [instaDesc, setInstaDesc] = useState("");
  const [instaHandle, setInstaHandle] = useState("");
  const [instaLink, setInstaLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setTrust1Title(initialData.trust1Title ?? "");
      setTrust1Desc(initialData.trust1Desc ?? "");
      setTrust2Title(initialData.trust2Title ?? "");
      setTrust2Desc(initialData.trust2Desc ?? "");
      setTrust3Title(initialData.trust3Title ?? "");
      setTrust3Desc(initialData.trust3Desc ?? "");

      setAltCardTitle(initialData.altCardTitle ?? "");
      setEmailTitle(initialData.emailTitle ?? "");
      setEmailDesc(initialData.emailDesc ?? "");
      setEmailAddress(initialData.emailAddress ?? initialData.email ?? "");
      setInstaTitle(initialData.instaTitle ?? "");
      setInstaDesc(initialData.instaDesc ?? "");
      setInstaHandle(initialData.instaHandle ?? initialData.instagram ?? "");
      setInstaLink(initialData.instaLink ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: ContactSidebarContent = {
        trust1Title,
        trust1Desc,
        trust2Title,
        trust2Desc,
        trust3Title,
        trust3Desc,
        altCardTitle,
        emailTitle,
        emailDesc,
        emailAddress,
        instaTitle,
        instaDesc,
        instaHandle,
        instaLink,
      };

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ContactSidebarSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Trust & Direct Channels saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Trust & Direct Channels");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="ContactSidebarSection"
          description="Right-hand trust badges (Human replies, No spam, Privacy), direct email, and Instagram DM card."
          badge="Section 3"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-6 pt-4">
              {/* Trust Points */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">3 Trust Reinforcement Points</h4>
                  <p className="text-xs text-gray-500">Security & privacy commitments displayed beside the contact form</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Trust Point 1</span>
                    <InputField label="Title" value={trust1Title} onChange={(e) => setTrust1Title(e.target.value)} placeholder="e.g. Real humans reply, not bots" />
                    <TextAreaField label="Description" value={trust1Desc} onChange={(e) => setTrust1Desc(e.target.value)} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Trust Point 2</span>
                    <InputField label="Title" value={trust2Title} onChange={(e) => setTrust2Title(e.target.value)} placeholder="e.g. No spam, ever" />
                    <TextAreaField label="Description" value={trust2Desc} onChange={(e) => setTrust2Desc(e.target.value)} rows={2} />
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Trust Point 3</span>
                    <InputField label="Title" value={trust3Title} onChange={(e) => setTrust3Title(e.target.value)} placeholder="e.g. Your details are safe with us" />
                    <TextAreaField label="Description" value={trust3Desc} onChange={(e) => setTrust3Desc(e.target.value)} rows={2} />
                  </div>
                </div>
              </div>

              {/* Direct Channels Card */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Direct Contact Channels ('Prefer to skip the form?')</h4>
                  <p className="text-xs text-gray-500">Direct email and Instagram handles shown in the sidebar</p>
                </div>

                <InputField
                  label="Card Title"
                  value={altCardTitle}
                  onChange={(e) => setAltCardTitle(e.target.value)}
                  placeholder="e.g. Prefer to skip the form?"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Channel */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200/60 space-y-2">
                    <span className="text-xs font-bold text-teal-800 block">Email Channel</span>
                    <InputField label="Title" value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} placeholder="e.g. Email" />
                    <InputField label="Email Address" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="e.g. hello@kokalachi.com" />
                    <TextAreaField label="Description" value={emailDesc} onChange={(e) => setEmailDesc(e.target.value)} rows={2} />
                  </div>

                  {/* Instagram Channel */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200/60 space-y-2">
                    <span className="text-xs font-bold text-amber-800 block">Instagram Channel</span>
                    <InputField label="Title" value={instaTitle} onChange={(e) => setInstaTitle(e.target.value)} placeholder="e.g. Instagram" />
                    <InputField label="Instagram Handle" value={instaHandle} onChange={(e) => setInstaHandle(e.target.value)} placeholder="e.g. @kokalachi" />
                    <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-[11px] text-amber-800 leading-snug">
                      <span className="font-bold">Centralized: </span>
                      Social media links are managed centrally under{" "}
                      <a href="/navigation/social-media" className="font-bold underline hover:text-amber-950 inline-flex items-center gap-0.5">
                        Navigation &gt; Social Media &amp; Footer
                      </a>
                    </div>
                    <TextAreaField label="Description" value={instaDesc} onChange={(e) => setInstaDesc(e.target.value)} rows={2} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <SaveButton
                  loading={loading}
                  saved={saved}
                  onClick={handleSave}
                  label="Save Changes"
                  className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
