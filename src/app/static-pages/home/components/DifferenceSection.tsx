"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface PolaroidCard {
  title: string;
  tag: string;
  description: string;
  image: string;
  caption: string;
}

export function DifferenceSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [subtitleStatement, setSubtitleStatement] = useState("");
  const [leftDoodleText, setLeftDoodleText] = useState("");
  const [rightDoodleText, setRightDoodleText] = useState("");

  const [card1, setCard1] = useState<PolaroidCard>({ title: "", tag: "", description: "", image: "", caption: "" });
  const [card2, setCard2] = useState<PolaroidCard>({ title: "", tag: "", description: "", image: "", caption: "" });
  const [card3, setCard3] = useState<PolaroidCard>({ title: "", tag: "", description: "", image: "", caption: "" });
  const [card4, setCard4] = useState<PolaroidCard>({ title: "", tag: "", description: "", image: "", caption: "" });

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setSubtitleStatement(initialData.subtitleStatement ?? initialData.description ?? "");
      setLeftDoodleText(initialData.leftDoodleText ?? "");
      setRightDoodleText(initialData.rightDoodleText ?? "");

      if (Array.isArray(initialData.features)) {
        if (initialData.features[0]) {
          setCard1({
            title: initialData.features[0].title ?? "",
            tag: initialData.features[0].tag ?? "",
            description: initialData.features[0].description ?? "",
            image: initialData.features[0].image ?? "",
            caption: initialData.features[0].caption ?? "",
          });
        }
        if (initialData.features[1]) {
          setCard2({
            title: initialData.features[1].title ?? "",
            tag: initialData.features[1].tag ?? "",
            description: initialData.features[1].description ?? "",
            image: initialData.features[1].image ?? "",
            caption: initialData.features[1].caption ?? "",
          });
        }
        if (initialData.features[2]) {
          setCard3({
            title: initialData.features[2].title ?? "",
            tag: initialData.features[2].tag ?? "",
            description: initialData.features[2].description ?? "",
            image: initialData.features[2].image ?? "",
            caption: initialData.features[2].caption ?? "",
          });
        }
        if (initialData.features[3]) {
          setCard4({
            title: initialData.features[3].title ?? "",
            tag: initialData.features[3].tag ?? "",
            description: initialData.features[3].description ?? "",
            image: initialData.features[3].image ?? "",
            caption: initialData.features[3].caption ?? "",
          });
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
        subtitleStatement,
        leftDoodleText,
        rightDoodleText,
        features: [card1, card2, card3, card4],
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "DifferenceSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Difference section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Difference section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="DifferenceSection"
          description="Highlight Kokalachi differentiators: small groups, curated stays, zero bus tours."
          badge="Section 4"
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
                placeholder="e.g. WHY KOKALACHI"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. More than a trip. Here's what"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. makes"
                />
                <InputField
                  label="Headline Suffix"
                  value={headlineSuffix}
                  onChange={(e) => setHeadlineSuffix(e.target.value)}
                  placeholder="e.g. us different."
                />
              </div>

              <TextAreaField
                label="Core Belief Statement"
                value={subtitleStatement}
                onChange={(e) => setSubtitleStatement(e.target.value)}
                placeholder="Every journey is designed around one simple belief..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Left Doodle Callout Text"
                  value={leftDoodleText}
                  onChange={(e) => setLeftDoodleText(e.target.value)}
                  placeholder="e.g. Pack your bags & leave the details to us! ✈️♡"
                />
                <InputField
                  label="Right Doodle Callout Text"
                  value={rightDoodleText}
                  onChange={(e) => setRightDoodleText(e.target.value)}
                  placeholder="e.g. “Memories > Monuments” 🌿✨"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Card 1 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Polaroid 1</span>
                  <InputField label="Title" value={card1.title} onChange={(e) => setCard1({ ...card1, title: e.target.value })} placeholder="e.g. Curated, Not Crowded" />
                  <InputField label="Sub-badge" value={card1.tag} onChange={(e) => setCard1({ ...card1, tag: e.target.value })} placeholder="e.g. 01. Intimate Circles" />
                  <TextAreaField label="Description" value={card1.description} onChange={(e) => setCard1({ ...card1, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Polaroid Photo" value={card1.image} onChange={(url) => setCard1({ ...card1, image: url })} />
                  <InputField label="Handwritten Caption" value={card1.caption} onChange={(e) => setCard1({ ...card1, caption: e.target.value })} placeholder="e.g. Sri Lanka Table Conversations ✨" />
                </div>

                {/* Card 2 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Polaroid 2</span>
                  <InputField label="Title" value={card2.title} onChange={(e) => setCard2({ ...card2, title: e.target.value })} placeholder="e.g. Designed for Connection, Not Just Sightseeing" />
                  <InputField label="Sub-badge" value={card2.tag} onChange={(e) => setCard2({ ...card2, tag: e.target.value })} placeholder="e.g. 02. Real Connection" />
                  <TextAreaField label="Description" value={card2.description} onChange={(e) => setCard2({ ...card2, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Polaroid Photo" value={card2.image} onChange={(url) => setCard2({ ...card2, image: url })} />
                  <InputField label="Handwritten Caption" value={card2.caption} onChange={(e) => setCard2({ ...card2, caption: e.target.value })} placeholder="e.g. Unfiltered Shared Moments ♡" />
                </div>

                {/* Card 3 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Polaroid 3</span>
                  <InputField label="Title" value={card3.title} onChange={(e) => setCard3({ ...card3, title: e.target.value })} placeholder="e.g. Hosted, End to End" />
                  <InputField label="Sub-badge" value={card3.tag} onChange={(e) => setCard3({ ...card3, tag: e.target.value })} placeholder="e.g. 03. Seamless Hosting" />
                  <TextAreaField label="Description" value={card3.description} onChange={(e) => setCard3({ ...card3, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Polaroid Photo" value={card3.image} onChange={(url) => setCard3({ ...card3, image: url })} />
                  <InputField label="Handwritten Caption" value={card3.caption} onChange={(e) => setCard3({ ...card3, caption: e.target.value })} placeholder="e.g. Host Accompanied ⛰️" />
                </div>

                {/* Card 4 */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Polaroid 4</span>
                  <InputField label="Title" value={card4.title} onChange={(e) => setCard4({ ...card4, title: e.target.value })} placeholder="e.g. Every Detail, Thoughtfully Planned" />
                  <InputField label="Sub-badge" value={card4.tag} onChange={(e) => setCard4({ ...card4, tag: e.target.value })} placeholder="e.g. 04. Intention & Care" />
                  <TextAreaField label="Description" value={card4.description} onChange={(e) => setCard4({ ...card4, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Polaroid Photo" value={card4.image} onChange={(url) => setCard4({ ...card4, image: url })} />
                  <InputField label="Handwritten Caption" value={card4.caption} onChange={(e) => setCard4({ ...card4, caption: e.target.value })} placeholder="e.g. Built With Pure Intention 🌊" />
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
