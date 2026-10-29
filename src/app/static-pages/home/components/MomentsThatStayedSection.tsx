"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";
import { Plus } from "lucide-react";

interface TestimonialCard {
  quote: string;
  author: string;
  trip: string;
  image: string;
}

interface TimelineStepItem {
  icon: string;
  title: string;
  description: string;
}

export function MomentsThatStayedSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [featuredMediaUrl, setFeaturedMediaUrl] = useState("");
  const [featuredQuote, setFeaturedQuote] = useState("");
  const [featuredLocation, setFeaturedLocation] = useState("");
  const [annotationLeft, setAnnotationLeft] = useState("");
  const [annotationRight, setAnnotationRight] = useState("");

  const [unfilteredMomentsLabel, setUnfilteredMomentsLabel] = useState("");
  const [readLetterLabel, setReadLetterLabel] = useState("");
  const [readFullLetterLabel, setReadFullLetterLabel] = useState("");
  const [chatBadgeLabel, setChatBadgeLabel] = useState("");
  const [memoryLaneLabel, setMemoryLaneLabel] = useState("");
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineSteps, setTimelineSteps] = useState<TimelineStepItem[]>([]);

  const [cards, setCards] = useState<TestimonialCard[]>([]);

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setFeaturedMediaUrl(initialData.featuredMediaUrl ?? "");
      setFeaturedQuote(initialData.featuredQuote ?? "");
      setFeaturedLocation(initialData.featuredLocation ?? "");
      setAnnotationLeft(initialData.annotationLeft ?? "");
      setAnnotationRight(initialData.annotationRight ?? "");

      setUnfilteredMomentsLabel(initialData.unfilteredMomentsLabel ?? "");
      setReadLetterLabel(initialData.readLetterLabel ?? "");
      setReadFullLetterLabel(initialData.readFullLetterLabel ?? "");
      setChatBadgeLabel(initialData.chatBadgeLabel ?? "");
      setMemoryLaneLabel(initialData.memoryLaneLabel ?? "");
      setTimelineTitle(initialData.timelineTitle ?? "");

      if (Array.isArray(initialData.timelineSteps)) {
        setTimelineSteps(
          initialData.timelineSteps.map((s: any) => ({
            icon: s.icon ?? "heart",
            title: s.title ?? "",
            description: s.description ?? "",
          })),
        );
      }

      if (Array.isArray(initialData.cards)) {
        setCards(
          initialData.cards.map((c: any) => ({
            quote: c.quote ?? "",
            author: c.author ?? "",
            trip: c.trip ?? "",
            image: c.image ?? "",
          })),
        );
      }
    }
  }, [initialData]);

  const [openCardIndices, setOpenCardIndices] = useState<number[]>([]);
  const [openStepIndices, setOpenStepIndices] = useState<number[]>([]);

  const toggleCard = (idx: number) => {
    setOpenCardIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const addCard = () => {
    const nextIdx = cards.length;
    setCards([...cards, { quote: "", author: "", trip: "", image: "" }]);
    setOpenCardIndices((prev) => [...prev, nextIdx]);
  };

  const removeCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
    setOpenCardIndices((prev) => prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
  };

  const updateCard = (idx: number, field: keyof TestimonialCard, value: string) => {
    const updated = [...cards];
    updated[idx] = { ...updated[idx], [field]: value };
    setCards(updated);
  };

  const toggleStep = (idx: number) => {
    setOpenStepIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const addStep = () => {
    const nextIdx = timelineSteps.length;
    setTimelineSteps([...timelineSteps, { icon: "heart", title: "", description: "" }]);
    setOpenStepIndices((prev) => [...prev, nextIdx]);
  };

  const removeStep = (idx: number) => {
    setTimelineSteps(timelineSteps.filter((_, i) => i !== idx));
    setOpenStepIndices((prev) => prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
  };

  const updateStep = (idx: number, field: keyof TimelineStepItem, value: string) => {
    const updated = [...timelineSteps];
    updated[idx] = { ...updated[idx], [field]: value };
    setTimelineSteps(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tag,
        headline,
        scriptAccent,
        subtitle,
        featuredMediaUrl,
        featuredQuote,
        featuredLocation,
        annotationLeft,
        annotationRight,
        unfilteredMomentsLabel,
        readLetterLabel,
        readFullLetterLabel,
        chatBadgeLabel,
        memoryLaneLabel,
        timelineTitle,
        timelineSteps,
        cards,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "MomentsThatStayedSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Moments That Stayed section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Moments That Stayed section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="MomentsThatStayedSection"
          description="Manage the artistic scrapbook travel memories collage, quote cards, timeline, and social proof."
          badge="Section 6"
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
                placeholder="e.g. MOMENTS THAT STAYED"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Every journey leaves with stories. Some leave with"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. lifelong friendships."
                  tooltip="Rendered in handwritten font"
                />
              </div>

              <TextAreaField
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Real stories and unfiltered memories captured by travellers..."
                rows={2}
              />

              {/* Labels */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Artistic Labels & Badges
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Badges and action labels rendered across memory elements
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputField
                    label="Unfiltered Moments Label"
                    value={unfilteredMomentsLabel}
                    onChange={(e) => setUnfilteredMomentsLabel(e.target.value)}
                    placeholder="e.g. 📌 Unfiltered Moments"
                  />
                  <InputField
                    label="Read Letter Button"
                    value={readLetterLabel}
                    onChange={(e) => setReadLetterLabel(e.target.value)}
                    placeholder="e.g. Read letter"
                  />
                  <InputField
                    label="Read Full Letter Button"
                    value={readFullLetterLabel}
                    onChange={(e) => setReadFullLetterLabel(e.target.value)}
                    placeholder="e.g. Read full letter"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField
                    label="Chat Badge Label"
                    value={chatBadgeLabel}
                    onChange={(e) => setChatBadgeLabel(e.target.value)}
                    placeholder="e.g. Chat"
                  />
                  <InputField
                    label="Memory Lane Floating Pill"
                    value={memoryLaneLabel}
                    onChange={(e) => setMemoryLaneLabel(e.target.value)}
                    placeholder="e.g. ♡ Memory Lane"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Left Tape Annotation"
                  value={annotationLeft}
                  onChange={(e) => setAnnotationLeft(e.target.value)}
                  placeholder="e.g. ✨ 100% Unfiltered Memories"
                />
                <InputField
                  label="Right Tape Annotation"
                  value={annotationRight}
                  onChange={(e) => setAnnotationRight(e.target.value)}
                  placeholder="e.g. ♡ Captured by Real Travellers"
                />
              </div>

              {/* Featured Main Spotlight Story */}
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Featured Center Spotlight Card
                </span>
                <ImagePickerField
                  label="Featured Card Image"
                  value={featuredMediaUrl}
                  onChange={setFeaturedMediaUrl}
                  tooltip="Large card image depicting candid traveller laughter or moments"
                />
                <InputField
                  label="Featured Quote"
                  value={featuredQuote}
                  onChange={(e) => setFeaturedQuote(e.target.value)}
                  placeholder="e.g. I almost cancelled this trip. Now I am planning my next one."
                />
                <InputField
                  label="Featured Location & Date"
                  value={featuredLocation}
                  onChange={(e) => setFeaturedLocation(e.target.value)}
                  placeholder="e.g. The Slow Island, Sri Lanka - March 2026"
                />
              </div>

              {/* Post-trip Timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Post-Trip Timeline Steps</h4>
                    <p className="text-xs text-gray-500">
                      Step progression from "Trip Ends" to "Lifelong Friends"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {timelineSteps.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenStepIndices(
                            openStepIndices.length === timelineSteps.length
                              ? []
                              : timelineSteps.map((_, i) => i),
                          )
                        }
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {openStepIndices.length === timelineSteps.length
                          ? "Collapse all"
                          : "Expand all"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addStep}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E5A60] text-white text-xs font-medium hover:bg-[#0c4e53] transition-colors"
                    >
                      <Plus size={14} /> Add Step
                    </button>
                  </div>
                </div>

                <InputField
                  label="Timeline Heading"
                  value={timelineTitle}
                  onChange={(e) => setTimelineTitle(e.target.value)}
                  placeholder="e.g. The Journey Continues..."
                />

                {timelineSteps.map((step, idx) => (
                  <CollapsibleItemCard
                    key={idx}
                    title={`Step #${idx + 1}: ${step.title || "Untitled"}`}
                    subtitle={step.description}
                    badge={step.icon}
                    isOpen={openStepIndices.includes(idx)}
                    onToggle={() => toggleStep(idx)}
                    onDelete={() => removeStep(idx)}
                    deleteTitle="Remove Step"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Step Title"
                        value={step.title}
                        onChange={(e) => updateStep(idx, "title", e.target.value)}
                        placeholder="e.g. WhatsApp Still Active"
                      />
                      <InputField
                        label="Icon Identifier (plane, message, cake, pin, camera, heart)"
                        value={step.icon}
                        onChange={(e) => updateStep(idx, "icon", e.target.value)}
                        placeholder="e.g. message"
                      />
                    </div>
                    <TextAreaField
                      label="Step Description"
                      value={step.description}
                      onChange={(e) => updateStep(idx, "description", e.target.value)}
                      placeholder="e.g. Daily memes and photo sharing."
                      rows={2}
                    />
                  </CollapsibleItemCard>
                ))}
              </div>

              {/* Scrapbook Memory Cards */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Scrapbook Testimonial / Memory Cards
                    </h4>
                    <p className="text-xs text-gray-500">Candid traveller reviews and memories</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cards.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCardIndices(
                            openCardIndices.length === cards.length ? [] : cards.map((_, i) => i),
                          )
                        }
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {openCardIndices.length === cards.length ? "Collapse all" : "Expand all"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E5A60] text-white text-xs font-medium hover:bg-[#0c4e53] transition-colors"
                    >
                      <Plus size={14} /> Add Card
                    </button>
                  </div>
                </div>

                {cards.map((c, idx) => (
                  <CollapsibleItemCard
                    key={idx}
                    title={`Memory Card #${idx + 1}`}
                    subtitle={c.author ? `${c.author}${c.trip ? ` (${c.trip})` : ""}` : c.quote}
                    badge={c.trip}
                    image={c.image}
                    isOpen={openCardIndices.includes(idx)}
                    onToggle={() => toggleCard(idx)}
                    onDelete={() => removeCard(idx)}
                    deleteTitle="Remove Card"
                  >
                    <TextAreaField
                      label="Quote / Story"
                      value={c.quote}
                      onChange={(e) => updateCard(idx, "quote", e.target.value)}
                      placeholder="e.g. I came alone, nervous and quiet. Left with 9 people I now consider close friends."
                      rows={2}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Traveller Name"
                        value={c.author}
                        onChange={(e) => updateCard(idx, "author", e.target.value)}
                        placeholder="e.g. Pooja S."
                      />
                      <InputField
                        label="Trip Joined"
                        value={c.trip}
                        onChange={(e) => updateCard(idx, "trip", e.target.value)}
                        placeholder="e.g. Kashmir Autumn Circle"
                      />
                    </div>
                    <ImagePickerField
                      label="Photo"
                      value={c.image}
                      onChange={(url) => updateCard(idx, "image", url)}
                    />
                  </CollapsibleItemCard>
                ))}
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
