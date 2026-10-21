"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";

interface FaqsCtaContent {
  tagline: string;
  headline: string;
  whatsappText: string;
  whatsappUrl: string;
  enquiryText: string;
  enquiryUrl: string;
}

export function FaqsCtaSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [whatsappText, setWhatsappText] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [enquiryText, setEnquiryText] = useState("");
  const [enquiryUrl, setEnquiryUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline || "");
      setHeadline(initialData.headline || "");
      setWhatsappText(initialData.whatsappText || "");
      setWhatsappUrl(initialData.whatsappUrl || "");
      setEnquiryText(initialData.enquiryText || "");
      setEnquiryUrl(initialData.enquiryUrl || "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: FaqsCtaContent = {
        tagline,
        headline,
        whatsappText,
        whatsappUrl,
        enquiryText,
        enquiryUrl,
      };

      const res = await fetch("/api/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "FaqsCtaSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("FAQ CTA section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving FAQ CTA section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="FaqsCtaSection"
          description="Bottom call-to-action inviting users to message on WhatsApp or submit a general travel enquiry."
          badge="Section 3"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Tag Badge Pill"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Still Have Questions?"
                />
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. We're a message away."
                />
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex flex-col gap-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Primary WhatsApp Action
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="WhatsApp Button Text"
                    value={whatsappText}
                    onChange={(e) => setWhatsappText(e.target.value)}
                    placeholder="e.g. Chat with Us on WhatsApp"
                  />
                  <InputField
                    label="WhatsApp Link / URL"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="e.g. https://wa.me/919711845700"
                    tooltip="Direct wa.me link with phone number and optional pre-filled message"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 flex flex-col gap-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Secondary Enquiry Action
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Enquiry Button Text"
                    value={enquiryText}
                    onChange={(e) => setEnquiryText(e.target.value)}
                    placeholder="e.g. Send an Enquiry"
                  />
                  <InputField
                    label="Enquiry Link Destination"
                    value={enquiryUrl}
                    onChange={(e) => setEnquiryUrl(e.target.value)}
                    placeholder="e.g. /contact"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <SaveButton
                  loading={loading}
                  saved={saved}
                  onClick={handleSave}
                  label="Save CTA Changes"
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
