"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function HowItWorksSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [description, setDescription] = useState("");

  const [step1Title, setStep1Title] = useState("");
  const [step1Desc, setStep1Desc] = useState("");
  const [step1Tag, setStep1Tag] = useState("");
  const [step1Image, setStep1Image] = useState("");

  const [step2Title, setStep2Title] = useState("");
  const [step2Desc, setStep2Desc] = useState("");
  const [step2Tag, setStep2Tag] = useState("");
  const [step2Image, setStep2Image] = useState("");

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
        steps: [
          { stepNumber: 1, title: step1Title, description: step1Desc, tag: step1Tag, image: step1Image },
          { stepNumber: 2, title: step2Title, description: step2Desc, tag: step2Tag, image: step2Image },
          { stepNumber: 3, title: step3Title, description: step3Desc, tag: step3Tag, image: step3Image },
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
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-6 pt-4">
              <InputField
                label="Section Tag"
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
                  label="Script Accent"
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

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Step 1 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Step 01</span>
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
                </div>

                {/* Step 2 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Step 02</span>
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
                </div>

                {/* Step 3 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Step 03</span>
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
