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

interface CompanyCard {
  title: string;
  hashtag: string;
  description: string;
  image: string;
}

export function GoodCompanySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [description, setDescription] = useState("");
  const [leftMarginTag, setLeftMarginTag] = useState("");
  const [rightMarginTag, setRightMarginTag] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [cards, setCards] = useState<CompanyCard[]>([]);
  const [openCardIndices, setOpenCardIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setDescription(initialData.description ?? "");
      setLeftMarginTag(initialData.leftMarginTag ?? "");
      setRightMarginTag(initialData.rightMarginTag ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");

      const rawCards = Array.isArray(initialData.pillars)
        ? initialData.pillars
        : Array.isArray(initialData.cards)
          ? initialData.cards
          : [];

      setCards(
        rawCards.map((c: any) => ({
          title: c.title ?? "",
          hashtag: c.hashtag ?? "",
          description: c.description ?? "",
          image: c.image ?? "",
        })),
      );
    }
  }, [initialData]);

  const toggleCard = (idx: number) => {
    setOpenCardIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const addCard = () => {
    const nextIdx = cards.length;
    setCards([...cards, { title: "", hashtag: "", description: "", image: "" }]);
    setOpenCardIndices((prev) => [...prev, nextIdx]);
  };

  const removeCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
    setOpenCardIndices((prev) => prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
  };

  const updateCard = (idx: number, field: keyof CompanyCard, value: string) => {
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
        headlineSuffix,
        description,
        leftMarginTag,
        rightMarginTag,
        ctaText,
        ctaLink,
        cards,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "GoodCompanySection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Good Company section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Good Company section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="GoodCompanySection"
          description="Build trust around safety, like-minded travellers, and compatibility vetting."
          badge="Section 5"
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
                placeholder="e.g. TRAVEL WITH CONFIDENCE"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. You're in"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. good"
                  tooltip="Rendered in handwritten script"
                />
                <InputField
                  label="Headline Suffix"
                  value={headlineSuffix}
                  onChange={(e) => setHeadlineSuffix(e.target.value)}
                  placeholder="e.g. company."
                />
              </div>

              <TextAreaField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Every Kokalachi journey is thoughtfully curated..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Left Margin Floating Tag"
                  value={leftMarginTag}
                  onChange={(e) => setLeftMarginTag(e.target.value)}
                  placeholder="e.g. ✨ 100% vetted circles"
                />
                <InputField
                  label="Right Margin Floating Tag"
                  value={rightMarginTag}
                  onChange={(e) => setRightMarginTag(e.target.value)}
                  placeholder="e.g. ♡ verified solo safety"
                />
              </div>

              {/* CTA Link */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Trust & Safety Call To Action
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bottom link button for trust and safety inquiries
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="CTA Button Text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Learn More About Trust & Safety"
                  />
                  <InputField
                    label="CTA Destination Link"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="e.g. /faqs#safety-and-comfort"
                  />
                </div>
              </div>

              {/* 4 Cards with CollapsibleItemCard */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Trust & Safety Pillar Cards</h4>
                    <p className="text-xs text-gray-500">
                      Core pillars highlighting comfort, vetting, and pace
                    </p>
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
                    title={`Pillar #${idx + 1}: ${c.title || "Untitled"}`}
                    subtitle={c.description}
                    badge={c.hashtag}
                    image={c.image}
                    isOpen={openCardIndices.includes(idx)}
                    onToggle={() => toggleCard(idx)}
                    onDelete={() => removeCard(idx)}
                    deleteTitle="Remove Card"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Title"
                        value={c.title}
                        onChange={(e) => updateCard(idx, "title", e.target.value)}
                        placeholder="e.g. Small, Curated Groups"
                      />
                      <InputField
                        label="Hashtag"
                        value={c.hashtag}
                        onChange={(e) => updateCard(idx, "hashtag", e.target.value)}
                        placeholder="e.g. #curatedgroups"
                      />
                    </div>
                    <TextAreaField
                      label="Description"
                      value={c.description}
                      onChange={(e) => updateCard(idx, "description", e.target.value)}
                      placeholder="We keep our groups intentionally small..."
                      rows={2}
                    />
                    <ImagePickerField
                      label="Card Photo"
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
