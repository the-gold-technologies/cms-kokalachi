"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function HowItWorksSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [description, setDescription] = useState("");

  const [ctaPrimaryText, setCtaPrimaryText] = useState("");
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState("");
  const [ctaSecondaryText, setCtaSecondaryText] = useState("");
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState("");

  const [step1Title, setStep1Title] = useState("");
  const [step1Desc, setStep1Desc] = useState("");
  const [step1Tag, setStep1Tag] = useState("");
  const [step1Image, setStep1Image] = useState("");
  const [step1UpcomingTitle, setStep1UpcomingTitle] = useState("");
  const [step1BookButtonText, setStep1BookButtonText] = useState("");

  const [step2Title, setStep2Title] = useState("");
  const [step2Desc, setStep2Desc] = useState("");
  const [step2Tag, setStep2Tag] = useState("");
  const [step2Image, setStep2Image] = useState("");
  const [step2GroupTitle, setStep2GroupTitle] = useState("");
  const [step2GroupSubtitle, setStep2GroupSubtitle] = useState("");
  const [step2Message1Author, setStep2Message1Author] = useState("");
  const [step2Message1Text, setStep2Message1Text] = useState("");
  const [step2Message2Author, setStep2Message2Author] = useState("");
  const [step2Message2Text, setStep2Message2Text] = useState("");
  const [step2Message3Text, setStep2Message3Text] = useState("");

  const [step3Title, setStep3Title] = useState("");
  const [step3Desc, setStep3Desc] = useState("");
  const [step3Tag, setStep3Tag] = useState("");
  const [step3Image, setStep3Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setDescription(initialData.description ?? "");

      setCtaPrimaryText(initialData.ctaPrimaryText ?? "");
      setCtaPrimaryUrl(initialData.ctaPrimaryUrl ?? "");
      setCtaSecondaryText(initialData.ctaSecondaryText ?? "");
      setCtaSecondaryUrl(initialData.ctaSecondaryUrl ?? "");

      setStep1UpcomingTitle(initialData.step1UpcomingTitle ?? "");
      setStep1BookButtonText(initialData.step1BookButtonText ?? "");

      setStep2GroupTitle(initialData.step2GroupTitle ?? "");
      setStep2GroupSubtitle(initialData.step2GroupSubtitle ?? "");
      setStep2Message1Author(initialData.step2Message1Author ?? "");
      setStep2Message1Text(initialData.step2Message1Text ?? "");
      setStep2Message2Author(initialData.step2Message2Author ?? "");
      setStep2Message2Text(initialData.step2Message2Text ?? "");
      setStep2Message3Text(initialData.step2Message3Text ?? "");

      if (Array.isArray(initialData.steps)) {
        if (initialData.steps[0]) {
          setStep1Title(initialData.steps[0].title ?? "");
          setStep1Desc(initialData.steps[0].description ?? "");
          setStep1Tag(initialData.steps[0].tag ?? "");
          setStep1Image(initialData.steps[0].image ?? "");
        }
        if (initialData.steps[1]) {
          setStep2Title(initialData.steps[1].title ?? "");
          setStep2Desc(initialData.steps[1].description ?? "");
          setStep2Tag(initialData.steps[1].tag ?? "");
          setStep2Image(initialData.steps[1].image ?? "");
        }
        if (initialData.steps[2]) {
          setStep3Title(initialData.steps[2].title ?? "");
          setStep3Desc(initialData.steps[2].description ?? "");
          setStep3Tag(initialData.steps[2].tag ?? "");
          setStep3Image(initialData.steps[2].image ?? "");
        }
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tag,
        headline,
        scriptAccent,
        headlineSuffix,
        description,
        ctaPrimaryText,
        ctaPrimaryUrl,
        ctaSecondaryText,
        ctaSecondaryUrl,
        step1UpcomingTitle,
        step1BookButtonText,
        step2GroupTitle,
        step2GroupSubtitle,
        step2Message1Author,
        step2Message1Text,
        step2Message2Author,
        step2Message2Text,
        step2Message3Text,
        steps: [
          {
            stepNumber: 1,
            title: step1Title,
            description: step1Desc,
            tag: step1Tag,
            image: step1Image,
          },
          {
            stepNumber: 2,
            title: step2Title,
            description: step2Desc,
            tag: step2Tag,
            image: step2Image,
          },
          {
            stepNumber: 3,
            title: step3Title,
            description: step3Desc,
            tag: step3Tag,
            image: step3Image,
          },
        ],
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "HowItWorksSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("How It Works section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving How It Works section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="HowItWorksSection"
          description="Edit the 3-step frictionless booking and journey onboarding process."
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
              <InputField
                label="Section Tagline"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. HOW IT WORKS"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Three steps to your next"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. unforgettable"
                />
                <InputField
                  label="Headline Suffix"
                  value={headlineSuffix}
                  onChange={(e) => setHeadlineSuffix(e.target.value)}
                  placeholder="e.g. journey."
                />
              </div>

              <TextAreaField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Joining Kokalachi is simple..."
                rows={2}
              />

              {/* CTAs */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Call To Action Buttons
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bottom CTA links underneath the three steps
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Primary CTA Text"
                    value={ctaPrimaryText}
                    onChange={(e) => setCtaPrimaryText(e.target.value)}
                    placeholder="e.g. Explore upcoming journeys"
                  />
                  <InputField
                    label="Primary CTA URL"
                    value={ctaPrimaryUrl}
                    onChange={(e) => setCtaPrimaryUrl(e.target.value)}
                    placeholder="e.g. /journeys"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Secondary CTA Link Text"
                    value={ctaSecondaryText}
                    onChange={(e) => setCtaSecondaryText(e.target.value)}
                    placeholder="e.g. Have questions? Read the FAQs"
                  />
                  <InputField
                    label="Secondary CTA URL"
                    value={ctaSecondaryUrl}
                    onChange={(e) => setCtaSecondaryUrl(e.target.value)}
                    placeholder="e.g. /faqs"
                  />
                </div>
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Step 1 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Step 01
                  </span>
                  <InputField
                    label="Title"
                    value={step1Title}
                    onChange={(e) => setStep1Title(e.target.value)}
                    placeholder="e.g. Discover a Journey"
                  />
                  <InputField
                    label="Accent Badge"
                    value={step1Tag}
                    onChange={(e) => setStep1Tag(e.target.value)}
                    placeholder="e.g. Choose your vibe & destination!"
                  />
                  <TextAreaField
                    label="Description"
                    value={step1Desc}
                    onChange={(e) => setStep1Desc(e.target.value)}
                    placeholder="Browse upcoming journeys..."
                    rows={2}
                  />
                  <ImagePickerField
                    label="Step 1 Photo"
                    value={step1Image}
                    onChange={setStep1Image}
                  />
                  <div className="pt-2 border-t border-gray-200/60 space-y-2">
                    <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider block">
                      Step 1 Interactive Card UI
                    </span>
                    <InputField
                      label="Trips Card Header"
                      value={step1UpcomingTitle}
                      onChange={(e) => setStep1UpcomingTitle(e.target.value)}
                      placeholder="e.g. Upcoming journeys"
                    />
                    <InputField
                      label="Trip Book Button Text"
                      value={step1BookButtonText}
                      onChange={(e) => setStep1BookButtonText(e.target.value)}
                      placeholder="e.g. Book your spot"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Step 02
                  </span>
                  <InputField
                    label="Title"
                    value={step2Title}
                    onChange={(e) => setStep2Title(e.target.value)}
                    placeholder="e.g. Connect Before You Go"
                  />
                  <InputField
                    label="Accent Badge"
                    value={step2Tag}
                    onChange={(e) => setStep2Tag(e.target.value)}
                    placeholder="e.g. Pre-trip WhatsApp Circle"
                  />
                  <TextAreaField
                    label="Description"
                    value={step2Desc}
                    onChange={(e) => setStep2Desc(e.target.value)}
                    placeholder="Meet your travel circle..."
                    rows={2}
                  />
                  <ImagePickerField
                    label="Step 2 Photo"
                    value={step2Image}
                    onChange={setStep2Image}
                  />
                  <div className="pt-2 border-t border-gray-200/60 space-y-2">
                    <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider block">
                      Step 2 Chat Mockup Copy
                    </span>
                    <InputField
                      label="Group Title"
                      value={step2GroupTitle}
                      onChange={(e) => setStep2GroupTitle(e.target.value)}
                      placeholder="e.g. Your pre-trip group"
                    />
                    <InputField
                      label="Group Subtitle"
                      value={step2GroupSubtitle}
                      onChange={(e) => setStep2GroupSubtitle(e.target.value)}
                      placeholder="e.g. You + your fellow travellers"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="Message 1 Author"
                        value={step2Message1Author}
                        onChange={(e) => setStep2Message1Author(e.target.value)}
                        placeholder="e.g. Priya"
                      />
                      <InputField
                        label="Message 2 Author"
                        value={step2Message2Author}
                        onChange={(e) => setStep2Message2Author(e.target.value)}
                        placeholder="e.g. Arjun"
                      />
                    </div>
                    <InputField
                      label="Message 1 Text"
                      value={step2Message1Text}
                      onChange={(e) => setStep2Message1Text(e.target.value)}
                      placeholder="e.g. So excited for this! Anyone flying in early? 🎒"
                    />
                    <InputField
                      label="Message 2 Text"
                      value={step2Message2Text}
                      onChange={(e) => setStep2Message2Text(e.target.value)}
                      placeholder="e.g. Land at 2pm! Shared cab from airport?"
                    />
                    <InputField
                      label="Message 3 Text"
                      value={step2Message3Text}
                      onChange={(e) => setStep2Message3Text(e.target.value)}
                      placeholder="e.g. Can't wait to meet everyone! ✨"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Step 03
                  </span>
                  <InputField
                    label="Title"
                    value={step3Title}
                    onChange={(e) => setStep3Title(e.target.value)}
                    placeholder="e.g. Pack & Experience"
                  />
                  <InputField
                    label="Accent Badge"
                    value={step3Tag}
                    onChange={(e) => setStep3Tag(e.target.value)}
                    placeholder="e.g. Meet your tribe"
                  />
                  <TextAreaField
                    label="Description"
                    value={step3Desc}
                    onChange={(e) => setStep3Desc(e.target.value)}
                    placeholder="Show up, immerse in local culture..."
                    rows={2}
                  />
                  <ImagePickerField
                    label="Step 3 Photo"
                    value={step3Image}
                    onChange={setStep3Image}
                  />
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
