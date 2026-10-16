"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface CompanyCard {
  title: string;
  hashtag: string;
  description: string;
  image: string;
}

export function GoodCompanySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
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

  const [card1, setCard1] = useState<CompanyCard>({ title: "", hashtag: "", description: "", image: "" });
  const [card2, setCard2] = useState<CompanyCard>({ title: "", hashtag: "", description: "", image: "" });
  const [card3, setCard3] = useState<CompanyCard>({ title: "", hashtag: "", description: "", image: "" });
  const [card4, setCard4] = useState<CompanyCard>({ title: "", hashtag: "", description: "", image: "" });

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setDescription(initialData.description ?? "");
      setLeftMarginTag(initialData.leftMarginTag ?? "");
      setRightMarginTag(initialData.rightMarginTag ?? "");

      const cards = Array.isArray(initialData.pillars)
        ? initialData.pillars
        : Array.isArray(initialData.cards)
        ? initialData.cards
        : [];

      if (cards[0]) {
        setCard1({
          title: cards[0].title ?? "",
          hashtag: cards[0].hashtag ?? "",
          description: cards[0].description ?? "",
          image: cards[0].image ?? "",
        });
      }
      if (cards[1]) {
        setCard2({
          title: cards[1].title ?? "",
          hashtag: cards[1].hashtag ?? "",
          description: cards[1].description ?? "",
          image: cards[1].image ?? "",
        });
      }
      if (cards[2]) {
        setCard3({
          title: cards[2].title ?? "",
          hashtag: cards[2].hashtag ?? "",
          description: cards[2].description ?? "",
          image: cards[2].image ?? "",
        });
      }
      if (cards[3]) {
        setCard4({
          title: cards[3].title ?? "",
          hashtag: cards[3].hashtag ?? "",
          description: cards[3].description ?? "",
          image: cards[3].image ?? "",
        });
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
        leftMarginTag,
        rightMarginTag,
        cards: [card1, card2, card3, card4],
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
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-6 pt-4">
              <InputField
                label="Section Header Badge"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. TRAVEL WITH CONFIDENCE"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline Prefix"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. You’re in"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. good"
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
                placeholder="Every Kokalachi journey is thoughtfully curated so you can focus on the experience..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Left Margin Doodle Note"
                  value={leftMarginTag}
                  onChange={(e) => setLeftMarginTag(e.target.value)}
                  placeholder="e.g. ✨ 100% vetted circles"
                />
                <InputField
                  label="Right Margin Doodle Note"
                  value={rightMarginTag}
                  onChange={(e) => setRightMarginTag(e.target.value)}
                  placeholder="e.g. ♡ verified solo safety"
                />
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Card 1</span>
                  <InputField label="Title" value={card1.title} onChange={(e) => setCard1({ ...card1, title: e.target.value })} placeholder="e.g. Small, Curated Groups" />
                  <InputField label="Hashtag" value={card1.hashtag} onChange={(e) => setCard1({ ...card1, hashtag: e.target.value })} placeholder="e.g. #curatedgroups" />
                  <TextAreaField label="Description" value={card1.description} onChange={(e) => setCard1({ ...card1, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Card Photo" value={card1.image} onChange={(url) => setCard1({ ...card1, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Card 2</span>
                  <InputField label="Title" value={card2.title} onChange={(e) => setCard2({ ...card2, title: e.target.value })} placeholder="e.g. Meet Before You Travel" />
                  <InputField label="Hashtag" value={card2.hashtag} onChange={(e) => setCard2({ ...card2, hashtag: e.target.value })} placeholder="e.g. #meetfirst" />
                  <TextAreaField label="Description" value={card2.description} onChange={(e) => setCard2({ ...card2, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Card Photo" value={card2.image} onChange={(url) => setCard2({ ...card2, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Card 3</span>
                  <InputField label="Title" value={card3.title} onChange={(e) => setCard3({ ...card3, title: e.target.value })} placeholder="e.g. A Safe & Welcoming Space" />
                  <InputField label="Hashtag" value={card3.hashtag} onChange={(e) => setCard3({ ...card3, hashtag: e.target.value })} placeholder="e.g. #safespaces" />
                  <TextAreaField label="Description" value={card3.description} onChange={(e) => setCard3({ ...card3, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Card Photo" value={card3.image} onChange={(url) => setCard3({ ...card3, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Card 4</span>
                  <InputField label="Title" value={card4.title} onChange={(e) => setCard4({ ...card4, title: e.target.value })} placeholder="e.g. Shared Experiences, Not Rigid Schedules" />
                  <InputField label="Hashtag" value={card4.hashtag} onChange={(e) => setCard4({ ...card4, hashtag: e.target.value })} placeholder="e.g. #slowtravel" />
                  <TextAreaField label="Description" value={card4.description} onChange={(e) => setCard4({ ...card4, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Card Photo" value={card4.image} onChange={(url) => setCard4({ ...card4, image: url })} />
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
