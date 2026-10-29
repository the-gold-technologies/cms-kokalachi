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
  sendAnotherMessageText: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  journeyLabel: string;
  journeyPlaceholder: string;
  travelDateLabel: string;
  guestsLabel: string;
  guestsSoloText: string;
  guestsPluralSuffix: string;
  messageLabel: string;
  messagePlaceholder: string;
  hearAboutLabel: string;
  hearAboutPlaceholder: string;
  submittingButtonText: string;
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
  const [sendAnotherMessageText, setSendAnotherMessageText] = useState("");
  const [nameLabel, setNameLabel] = useState("");
  const [namePlaceholder, setNamePlaceholder] = useState("");
  const [emailLabel, setEmailLabel] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [phoneLabel, setPhoneLabel] = useState("");
  const [phonePlaceholder, setPhonePlaceholder] = useState("");
  const [journeyLabel, setJourneyLabel] = useState("");
  const [journeyPlaceholder, setJourneyPlaceholder] = useState("");
  const [travelDateLabel, setTravelDateLabel] = useState("");
  const [guestsLabel, setGuestsLabel] = useState("");
  const [guestsSoloText, setGuestsSoloText] = useState("");
  const [guestsPluralSuffix, setGuestsPluralSuffix] = useState("");
  const [messageLabel, setMessageLabel] = useState("");
  const [messagePlaceholder, setMessagePlaceholder] = useState("");
  const [hearAboutLabel, setHearAboutLabel] = useState("");
  const [hearAboutPlaceholder, setHearAboutPlaceholder] = useState("");
  const [submittingButtonText, setSubmittingButtonText] = useState("");
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
      setSendAnotherMessageText(initialData.sendAnotherMessageText ?? "");
      setNameLabel(initialData.nameLabel ?? "");
      setNamePlaceholder(initialData.namePlaceholder ?? "");
      setEmailLabel(initialData.emailLabel ?? "");
      setEmailPlaceholder(initialData.emailPlaceholder ?? "");
      setPhoneLabel(initialData.phoneLabel ?? "");
      setPhonePlaceholder(initialData.phonePlaceholder ?? "");
      setJourneyLabel(initialData.journeyLabel ?? "");
      setJourneyPlaceholder(initialData.journeyPlaceholder ?? "");
      setTravelDateLabel(initialData.travelDateLabel ?? "");
      setGuestsLabel(initialData.guestsLabel ?? "");
      setGuestsSoloText(initialData.guestsSoloText ?? "");
      setGuestsPluralSuffix(initialData.guestsPluralSuffix ?? "");
      setMessageLabel(initialData.messageLabel ?? "");
      setMessagePlaceholder(initialData.messagePlaceholder ?? "");
      setHearAboutLabel(initialData.hearAboutLabel ?? "");
      setHearAboutPlaceholder(initialData.hearAboutPlaceholder ?? "");
      setSubmittingButtonText(initialData.submittingButtonText ?? "");
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
        sendAnotherMessageText,
        nameLabel,
        namePlaceholder,
        emailLabel,
        emailPlaceholder,
        phoneLabel,
        phonePlaceholder,
        journeyLabel,
        journeyPlaceholder,
        travelDateLabel,
        guestsLabel,
        guestsSoloText,
        guestsPluralSuffix,
        messageLabel,
        messagePlaceholder,
        hearAboutLabel,
        hearAboutPlaceholder,
        submittingButtonText,
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
          description="Enquiry card headings, field labels, placeholders, dropdown options, and submission messaging."
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextAreaField
                  label="Form Subtitle / Explainer"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. The more we know, the better we can help — but even a quick hello works."
                  rows={2}
                />
                <InputField
                  label="Submitting State Button Text"
                  value={submittingButtonText}
                  onChange={(e) => setSubmittingButtonText(e.target.value)}
                  placeholder="e.g. Sending..."
                />
              </div>

              {/* Success Screen Messaging */}
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100/60 space-y-4">
                <span className="text-xs font-bold text-teal-800 uppercase block tracking-wider">
                  Submission Success Screen
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Success Heading"
                    value={successTitle}
                    onChange={(e) => setSuccessTitle(e.target.value)}
                    placeholder="e.g. Enquiry Sent Successfully"
                  />
                  <InputField
                    label="'Send Another Message' Button Text"
                    value={sendAnotherMessageText}
                    onChange={(e) => setSendAnotherMessageText(e.target.value)}
                    placeholder="e.g. Send another message"
                  />
                </div>
                <TextAreaField
                  label="Success Description"
                  value={successSubtitle}
                  onChange={(e) => setSuccessSubtitle(e.target.value)}
                  placeholder="e.g. Thanks for reaching out! We've received your message and our team will get back to you within 24 hours."
                  rows={2}
                />
              </div>

              {/* Form Input Labels & Placeholders */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <span className="text-xs font-bold text-teal-800 uppercase block tracking-wider">
                  Input Field Labels & Placeholders
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name Label"
                    value={nameLabel}
                    onChange={(e) => setNameLabel(e.target.value)}
                    placeholder="e.g. Full Name"
                  />
                  <InputField
                    label="Full Name Placeholder"
                    value={namePlaceholder}
                    onChange={(e) => setNamePlaceholder(e.target.value)}
                    placeholder="e.g. e.g. Jane Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Email Address Label"
                    value={emailLabel}
                    onChange={(e) => setEmailLabel(e.target.value)}
                    placeholder="e.g. Email Address"
                  />
                  <InputField
                    label="Email Address Placeholder"
                    value={emailPlaceholder}
                    onChange={(e) => setEmailPlaceholder(e.target.value)}
                    placeholder="e.g. e.g. jane@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Phone Number Label"
                    value={phoneLabel}
                    onChange={(e) => setPhoneLabel(e.target.value)}
                    placeholder="e.g. Phone Number"
                  />
                  <InputField
                    label="Phone Number Placeholder"
                    value={phonePlaceholder}
                    onChange={(e) => setPhonePlaceholder(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Journey Dropdown Label"
                    value={journeyLabel}
                    onChange={(e) => setJourneyLabel(e.target.value)}
                    placeholder="e.g. Which journey are you interested in?"
                  />
                  <InputField
                    label="Journey Dropdown Placeholder"
                    value={journeyPlaceholder}
                    onChange={(e) => setJourneyPlaceholder(e.target.value)}
                    placeholder="e.g. Select an option (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Travel Date Label"
                    value={travelDateLabel}
                    onChange={(e) => setTravelDateLabel(e.target.value)}
                    placeholder="e.g. Preferred Travel Date"
                  />
                  <InputField
                    label="Guests Counter Label"
                    value={guestsLabel}
                    onChange={(e) => setGuestsLabel(e.target.value)}
                    placeholder="e.g. How many of you are travelling?"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="1 Guest Label"
                      value={guestsSoloText}
                      onChange={(e) => setGuestsSoloText(e.target.value)}
                      placeholder="e.g. Just me"
                    />
                    <InputField
                      label="Plural Suffix"
                      value={guestsPluralSuffix}
                      onChange={(e) => setGuestsPluralSuffix(e.target.value)}
                      placeholder="e.g. people"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Message Label"
                    value={messageLabel}
                    onChange={(e) => setMessageLabel(e.target.value)}
                    placeholder="e.g. How can we help?"
                  />
                  <InputField
                    label="Message Placeholder"
                    value={messagePlaceholder}
                    onChange={(e) => setMessagePlaceholder(e.target.value)}
                    placeholder="e.g. Tell us what's on your mind..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Referral Channel Label"
                    value={hearAboutLabel}
                    onChange={(e) => setHearAboutLabel(e.target.value)}
                    placeholder="e.g. How did you hear about us?"
                  />
                  <InputField
                    label="Referral Channel Placeholder"
                    value={hearAboutPlaceholder}
                    onChange={(e) => setHearAboutPlaceholder(e.target.value)}
                    placeholder="e.g. Select an option (optional)"
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
