"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

interface TestimonialCard {
  quote: string;
  author: string;
  trip: string;
  image: string;
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

  const addCard = () => {
    setCards([...cards, { quote: "", author: "", trip: "", image: "" }]);
  };

  const removeCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
  };

  const updateCard = (idx: number, field: keyof TestimonialCard, value: string) => {
    const updated = [...cards];
    updated[idx] = { ...updated[idx], [field]: value };
    setCards(updated);
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
          description="Manage the artistic scrapbook travel memories collage, quote cards, and social proof."
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
                label="Section Tag"
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
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. lifelong friendships."
                />
              </div>

              <TextAreaField
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Real stories from real travellers..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Left Handwritten Annotation"
                  value={annotationLeft}
                  onChange={(e) => setAnnotationLeft(e.target.value)}
                  placeholder="e.g. ✨ 100% Unfiltered Memories"
                />
                <InputField
                  label="Right Handwritten Annotation"
                  value={annotationRight}
                  onChange={(e) => setAnnotationRight(e.target.value)}
                  placeholder="e.g. ♡ Captured by Real Travellers"
                />
              </div>

              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Featured Cinematic Showcase Card
                </h4>
                <ImagePickerField
                  label="Featured Media Image"
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

              {/* Scrapbook Memory Cards */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Scrapbook Testimonial / Memory Cards
                    </h4>
                    <p className="text-xs text-gray-500">Candid traveller reviews and memories</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E5A60] text-white text-xs font-medium hover:bg-[#0c4e53] transition-colors"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                {cards.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeCard(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      title="Remove Card"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="text-xs font-bold text-teal-800 block">
                      Memory Card #{idx + 1}
                    </span>
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
                  </div>
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
