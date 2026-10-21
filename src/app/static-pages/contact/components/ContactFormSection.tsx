"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { StringListEditor } from "@/components/StringListEditor";
import { SaveButton } from "@/components/SaveButton";

interface ContactFormContent {
  heading: string;
  subtitle: string;
  successTitle: string;
  successSubtitle: string;
  journeyOptions: string[];
  hearAboutOptions: string[];
  submitButtonText: string;
  urgencyNote: string;
}

export function ContactFormSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [heading, setHeading] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [successSubtitle, setSuccessSubtitle] = useState("");
  const [journeyOptions, setJourneyOptions] = useState<string[]>([]);
  const [hearAboutOptions, setHearAboutOptions] = useState<string[]>([]);
  const [submitButtonText, setSubmitButtonText] = useState("");
  const [urgencyNote, setUrgencyNote] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? initialData.title ?? "");
      setSubtitle(initialData.subtitle ?? initialData.description ?? "");
      setSuccessTitle(initialData.successTitle ?? "");
      setSuccessSubtitle(initialData.successSubtitle ?? "");
      setJourneyOptions(
        Array.isArray(initialData.journeyOptions) ? initialData.journeyOptions : [],
      );
      setHearAboutOptions(
        Array.isArray(initialData.hearAboutOptions) ? initialData.hearAboutOptions : [],
      );
      setSubmitButtonText(initialData.submitButtonText ?? initialData.buttonText ?? "");
      setUrgencyNote(initialData.urgencyNote ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: ContactFormContent = {
        heading,
        subtitle,
        successTitle,
        successSubtitle,
        journeyOptions,
        hearAboutOptions,
        submitButtonText,
        urgencyNote,
      };

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ContactFormSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Contact Form configuration saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Contact Form configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="ContactFormSection"
          description="Enquiry card headings, journey dropdown options, referral channels, and submission response messaging."
          badge="Section 2"
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
                  label="Form Card Heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. Tell us a little about your next journey"
                />
                <InputField
                  label="Submit Button Label"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  placeholder="e.g. Send Enquiry"
                />
              </div>

              <TextAreaField
                label="Form Subtitle / Explainer"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. The more we know, the better we can help — but even a quick hello works."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase block">
                    Submission Success Title
                  </span>
                  <InputField
                    label="Success Heading"
                    value={successTitle}
                    onChange={(e) => setSuccessTitle(e.target.value)}
                    placeholder="e.g. Enquiry Sent Successfully"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase block">
                    Submission Success Message
                  </span>
                  <TextAreaField
                    label="Success Description"
                    value={successSubtitle}
                    onChange={(e) => setSuccessSubtitle(e.target.value)}
                    placeholder="e.g. Thanks for reaching out! We've received your message and our team will get back to you within 24 hours."
                    rows={2}
                  />
                </div>
              </div>

              {/* Journey Dropdown Choices */}
              <StringListEditor
                label="Journey Dropdown Choices ('Which journey are you interested in?')"
                items={journeyOptions}
                onChange={setJourneyOptions}
                placeholder="e.g. The Houseboat Diaries (Kashmir)"
                tooltip="Options rendered in the journey selection dropdown"
              />

              {/* Hear About Us Options */}
              <StringListEditor
                label="Referral Source Choices ('How did you hear about us?')"
                items={hearAboutOptions}
                onChange={setHearAboutOptions}
                placeholder="e.g. Instagram, A friend, Google Search, Kokalachi Traveller"
                tooltip="Options rendered in the referral source dropdown"
              />

              <InputField
                label="SLA / Urgency Footer Note"
                value={urgencyNote}
                onChange={(e) => setUrgencyNote(e.target.value)}
                placeholder="e.g. We typically respond within 24 hours. For anything urgent, Instagram is your fastest bet."
              />

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
