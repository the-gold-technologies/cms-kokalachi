"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { ImagePickerField } from "@/components/ImagePickerField";
import { StringListEditor } from "@/components/StringListEditor";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";

type Step = { title: string; description: string; points: string[] };

const STEP_COUNT = 3; // the website always shows exactly 3 steps
const EMPTY_STEP: Step = { title: "", description: "", points: [] };

// The checklist the website showed before it moved into the CMS. Loaded only for steps saved
// before checklists existed, so the first save keeps them instead of wiping them.
const UNSAVED_POINTS = [
  ["Small groups, fixed departure dates", "Full itinerary before you book"],
  ["Say hello before departure", "Ask questions & share plans"],
  ["Trip host with you throughout", "Come home with new friends"],
];

// A titled box that groups related fields, with a one-line hint of where they show up
function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      </div>
      {children}
    </div>
  );
}

// The small picture card above each step's text on the website
function PreviewBox({ hint, children }: { hint: string; children?: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-gray-200/70 space-y-3">
      <div>
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
          Preview card
        </span>
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      </div>
      {children}
    </div>
  );
}

export function HowItWorksSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Heading
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [description, setDescription] = useState("");

  // The three steps (title + description each)
  const [steps, setSteps] = useState<Step[]>([]);

  // Step 1 preview card
  const [step1UpcomingTitle, setStep1UpcomingTitle] = useState("");
  const [step1BookButtonText, setStep1BookButtonText] = useState("");

  // Step 2 preview card (sample group chat)
  const [step2GroupTitle, setStep2GroupTitle] = useState("");
  const [step2GroupSubtitle, setStep2GroupSubtitle] = useState("");
  const [step2Message1Author, setStep2Message1Author] = useState("");
  const [step2Message1Text, setStep2Message1Text] = useState("");
  const [step2Message2Author, setStep2Message2Author] = useState("");
  const [step2Message2Text, setStep2Message2Text] = useState("");
  const [step2Message3Text, setStep2Message3Text] = useState("");

  // Step 3 preview card
  const [step3Image, setStep3Image] = useState("");

  // Buttons
  const [ctaPrimaryText, setCtaPrimaryText] = useState("");
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState("");
  const [ctaSecondaryText, setCtaSecondaryText] = useState("");
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setTag(initialData.tag ?? "");
    setHeadline(initialData.headline ?? "");
    setScriptAccent(initialData.scriptAccent ?? "");
    setHeadlineSuffix(initialData.headlineSuffix ?? "");
    setDescription(initialData.description ?? "");

    setSteps(
      Array.isArray(initialData.steps)
        ? initialData.steps.map((s: any, i: number) => ({
            title: s?.title ?? "",
            description: s?.description ?? "",
            points: Array.isArray(s?.points) ? s.points : (UNSAVED_POINTS[i] ?? []),
          }))
        : [],
    );

    setStep1UpcomingTitle(initialData.step1UpcomingTitle ?? "");
    setStep1BookButtonText(initialData.step1BookButtonText ?? "");

    setStep2GroupTitle(initialData.step2GroupTitle ?? "");
    setStep2GroupSubtitle(initialData.step2GroupSubtitle ?? "");
    setStep2Message1Author(initialData.step2Message1Author ?? "");
    setStep2Message1Text(initialData.step2Message1Text ?? "");
    setStep2Message2Author(initialData.step2Message2Author ?? "");
    setStep2Message2Text(initialData.step2Message2Text ?? "");
    setStep2Message3Text(initialData.step2Message3Text ?? "");
    setStep3Image(initialData.step3Image ?? "");

    setCtaPrimaryText(initialData.ctaPrimaryText ?? "");
    setCtaPrimaryUrl(initialData.ctaPrimaryUrl ?? "");
    setCtaSecondaryText(initialData.ctaSecondaryText ?? "");
    setCtaSecondaryUrl(initialData.ctaSecondaryUrl ?? "");
  }, [initialData]);

  const stepIndexes = Array.from({ length: STEP_COUNT }, (_, i) => i);
  const stepAt = (i: number): Step => steps[i] ?? EMPTY_STEP;
  const updateStep = (i: number, patch: Partial<Step>) =>
    setSteps((prev) =>
      stepIndexes.map((n) => {
        const step = prev[n] ?? EMPTY_STEP;
        return n === i ? { ...step, ...patch } : step;
      }),
    );

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
        steps: stepIndexes.map((i) => {
          const step = stepAt(i);
          return { ...step, points: step.points.map((p) => p.trim()).filter(Boolean) };
        }),
        step1UpcomingTitle,
        step1BookButtonText,
        step2GroupTitle,
        step2GroupSubtitle,
        step2Message1Author,
        step2Message1Text,
        step2Message2Author,
        step2Message2Text,
        step2Message3Text,
        step3Image,
        ctaPrimaryText,
        ctaPrimaryUrl,
        ctaSecondaryText,
        ctaSecondaryUrl,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "HowItWorksSection", content: payload }),
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

  // What each step's preview card shows, and which of its text can be edited
  const stepCards: {
    titlePlaceholder: string;
    pointPlaceholder: string;
    hint: string;
    preview?: React.ReactNode;
  }[] = [
    {
      titlePlaceholder: "e.g. Discover a Journey",
      pointPlaceholder: "e.g. Small groups, fixed departure dates",
      hint: "Shows your next 2 open trips automatically. Only the header and button text are editable.",
      preview: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Card header"
            value={step1UpcomingTitle}
            onChange={(e) => setStep1UpcomingTitle(e.target.value)}
            placeholder="e.g. Upcoming journeys"
          />
          <InputField
            label="Button text"
            value={step1BookButtonText}
            onChange={(e) => setStep1BookButtonText(e.target.value)}
            placeholder="e.g. Book your spot"
          />
        </div>
      ),
    },
    {
      titlePlaceholder: "e.g. Connect Before You Go",
      pointPlaceholder: "e.g. Say hello before departure",
      hint: 'A sample group chat. Messages 1 and 2 are from other travellers; the last one is the green "you" reply.',
      preview: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Group name"
              value={step2GroupTitle}
              onChange={(e) => setStep2GroupTitle(e.target.value)}
              placeholder="e.g. Your pre-trip group"
            />
            <InputField
              label="Line under group name"
              value={step2GroupSubtitle}
              onChange={(e) => setStep2GroupSubtitle(e.target.value)}
              placeholder="e.g. You + your fellow travellers"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
            <InputField
              label="Message 1 · name"
              value={step2Message1Author}
              onChange={(e) => setStep2Message1Author(e.target.value)}
              placeholder="e.g. Priya"
            />
            <InputField
              label="Message 1 · text"
              value={step2Message1Text}
              onChange={(e) => setStep2Message1Text(e.target.value)}
              placeholder="e.g. So excited for this! Anyone flying in early? 🎒"
            />
            <InputField
              label="Message 2 · name"
              value={step2Message2Author}
              onChange={(e) => setStep2Message2Author(e.target.value)}
              placeholder="e.g. Arjun"
            />
            <InputField
              label="Message 2 · text"
              value={step2Message2Text}
              onChange={(e) => setStep2Message2Text(e.target.value)}
              placeholder="e.g. Land at 2pm! Shared cab from airport?"
            />
          </div>
          <InputField
            label="Your reply (green bubble)"
            value={step2Message3Text}
            onChange={(e) => setStep2Message3Text(e.target.value)}
            placeholder="e.g. Can't wait to meet everyone! ✨"
          />
        </>
      ),
    },
    {
      titlePlaceholder: "e.g. Pack & Experience",
      pointPlaceholder: "e.g. Trip host with you throughout",
      hint: "A photo with a real traveller quote from Community stories on top. Leave the photo empty to use that story's own photo.",
      preview: <ImagePickerField label="Photo" value={step3Image} onChange={setStep3Image} />,
    },
  ];

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="HowItWorksSection"
          description="The 3 steps that explain how a Kokalachi trip works."
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
              {/* 1. Heading */}
              <Group title="1. Section heading" hint="The text at the top of the section.">
                <InputField
                  label="Small label"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. HOW IT WORKS"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Heading · start"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Three steps to your next"
                  />
                  <InputField
                    label="Heading · handwritten word"
                    value={scriptAccent}
                    onChange={(e) => setScriptAccent(e.target.value)}
                    placeholder="e.g. unforgettable"
                  />
                  <InputField
                    label="Heading · end"
                    value={headlineSuffix}
                    onChange={(e) => setHeadlineSuffix(e.target.value)}
                    placeholder="e.g. journey."
                  />
                </div>

                <TextAreaField
                  label="Text under the heading"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Joining Kokalachi is simple..."
                  rows={2}
                  showLinkButton={false}
                />
              </Group>

              {/* 2. Steps */}
              <Group
                title="2. The three steps"
                hint="Each step has a title, a short description, checklist points and a preview card."
              >
                {stepCards.map((card, i) => (
                  <CollapsibleItemCard
                    key={i}
                    title={`Step ${String(i + 1).padStart(2, "0")}`}
                    subtitle={stepAt(i).title || "Untitled"}
                  >
                    <InputField
                      label="Title"
                      value={stepAt(i).title}
                      onChange={(e) => updateStep(i, { title: e.target.value })}
                      placeholder={card.titlePlaceholder}
                    />
                    <TextAreaField
                      label="Description"
                      value={stepAt(i).description}
                      onChange={(e) => updateStep(i, { description: e.target.value })}
                      rows={2}
                      showLinkButton={false}
                    />
                    <StringListEditor
                      label="Checklist points"
                      items={stepAt(i).points}
                      onChange={(points) => updateStep(i, { points })}
                      placeholder={card.pointPlaceholder}
                      tooltip="The short ticked lines at the bottom of the step card. 2 points look best."
                    />
                    <PreviewBox hint={card.hint}>{card.preview}</PreviewBox>
                  </CollapsibleItemCard>
                ))}
              </Group>

              {/* 3. Buttons */}
              <Group
                title="3. Buttons below the steps"
                hint="A main button and a smaller text link next to it."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Main button text"
                    value={ctaPrimaryText}
                    onChange={(e) => setCtaPrimaryText(e.target.value)}
                    placeholder="e.g. Explore upcoming journeys"
                  />
                  <InputField
                    label="Main button link"
                    value={ctaPrimaryUrl}
                    onChange={(e) => setCtaPrimaryUrl(e.target.value)}
                    placeholder="e.g. /journeys"
                  />
                  <InputField
                    label="Text link"
                    value={ctaSecondaryText}
                    onChange={(e) => setCtaSecondaryText(e.target.value)}
                    placeholder="e.g. Have questions? Read the FAQs"
                  />
                  <InputField
                    label="Text link URL"
                    value={ctaSecondaryUrl}
                    onChange={(e) => setCtaSecondaryUrl(e.target.value)}
                    placeholder="e.g. /faqs"
                  />
                </div>
              </Group>

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
