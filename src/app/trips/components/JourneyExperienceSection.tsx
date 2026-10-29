"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";
import { Plus, Trash2, MapPin, Sparkles, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface HighlightItem {
  icon?: string;
  title: string;
  description: string;
}

interface ItineraryDay {
  day: string;
  title: string;
  journey: string;
  community: string;
  image?: string;
}

function formatOverviewForEditor(overview: any): string {
  if (!overview) return "";
  if (typeof overview === "string") return overview;
  if (!Array.isArray(overview)) return "";

  let result = "";
  for (let i = 0; i < overview.length; i++) {
    const line = String(overview[i] || "").trim();
    if (!line) continue;
    if (i === 0) {
      result += line;
    } else {
      const prevLine = String(overview[i - 1] || "").trim();
      const isCurrentBullet = line.startsWith("•") || line.startsWith("-");
      const isPrevBullet = prevLine.startsWith("•") || prevLine.startsWith("-");

      if (isCurrentBullet && isPrevBullet) {
        result += "\n" + line;
      } else {
        result += "\n\n" + line;
      }
    }
  }
  return result;
}

export function JourneyExperienceSection({
  tripId,
  initialData,
  onSaved,
}: {
  tripId: string;
  initialData?: any;
  onSaved?: (data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default mock data)
  const [overviewText, setOverviewText] = useState("");
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [openHighlightIndices, setOpenHighlightIndices] = useState<number[]>([]);
  const [openItineraryIndices, setOpenItineraryIndices] = useState<number[]>([]);

  const toggleHighlight = (idx: number) => {
    setOpenHighlightIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const toggleItinerary = (idx: number) => {
    setOpenItineraryIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  useEffect(() => {
    if (initialData) {
      setOverviewText(formatOverviewForEditor(initialData.overview));
      setHighlights(
        Array.isArray(initialData.highlights)
          ? initialData.highlights.map((h: any) => ({
              icon: h.icon ?? "",
              title: h.title ?? "",
              description: h.description ?? "",
            }))
          : [],
      );
      setItinerary(
        Array.isArray(initialData.itinerary)
          ? initialData.itinerary.map((it: any) => ({
              day: it.day ?? "",
              title: it.title ?? "",
              journey: it.journey ?? "",
              community: it.community ?? "",
              image: it.image ?? "",
            }))
          : [],
      );
    }
  }, [initialData]);

  // Highlight Handlers
  const handleAddHighlight = () => {
    const nextIdx = highlights.length;
    setHighlights((prev) => [...prev, { icon: "✨", title: "", description: "" }]);
    setOpenHighlightIndices((prev) => [...prev, nextIdx]);
  };

  const handleUpdateHighlight = (idx: number, field: keyof HighlightItem, val: string) => {
    setHighlights((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== idx));
    setOpenHighlightIndices((prev) =>
      prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)),
    );
  };

  // Itinerary Handlers
  const handleAddDay = () => {
    const nextIdx = itinerary.length;
    const nextDayNum = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev,
      {
        day: `Day ${nextDayNum}`,
        title: "",
        journey: "",
        community: "",
        image: "",
      },
    ]);
    setOpenItineraryIndices((prev) => [...prev, nextIdx]);
  };

  const handleUpdateDay = (idx: number, field: keyof ItineraryDay, val: string) => {
    setItinerary((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveDay = (idx: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== idx));
    setOpenItineraryIndices((prev) =>
      prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const overviewArray = overviewText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        overview: overviewArray,
        highlights: highlights.filter((h) => h.title.trim() !== ""),
        itinerary: itinerary.filter((d) => d.day.trim() !== "" || d.title.trim() !== ""),
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Experience, highlights & itinerary saved!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save experience");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="3. Detail Page Experience (Overview, Highlights & Itinerary)"
        description="The deep storytelling content displayed on the internal Journey detail page: narrative overview, key highlights, and day-by-day itinerary with community host connections."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-6 flex flex-col gap-8"
        >
          {/* Part A: Overview Narrative (Single Textarea) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0E5A60]" /> Experience Overview Narrative
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                Press Enter to add line breaks and paragraph spacing
              </span>
            </div>

            <TextAreaField
              label="Overview Narrative & Bullet Points"
              value={overviewText}
              onChange={(e) => setOverviewText(e.target.value)}
              rows={9}
              placeholder="Write the storytelling narrative for this journey...&#10;&#10;Here's what the journey holds:&#10;• Begin in Srinagar with a scenic drive...&#10;• Settle into a riverside stay in Pahalgam...&#10;• Trek toward Aru Valley and Betaab Valley..."
              tooltip="Write your narrative here. Lines starting with • or - will automatically render as bullet points on the website. Empty lines create paragraph breaks."
              helperText="Lines starting with • or - format as bullets; blank lines separate paragraphs."
            />
          </div>

          {/* Part B: Highlights */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D96C2C]" /> Key Highlights (
                {highlights.length})
              </span>
              <div className="flex items-center gap-2">
                {highlights.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenHighlightIndices(
                        openHighlightIndices.length === highlights.length
                          ? []
                          : highlights.map((_, i) => i),
                      )
                    }
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {openHighlightIndices.length === highlights.length
                      ? "Collapse all"
                      : "Expand all"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="text-xs font-bold text-[#D96C2C] hover:text-[#b85419] flex items-center gap-1 bg-[#D96C2C]/10 hover:bg-[#D96C2C]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Highlight
                </button>
              </div>
            </div>

            {highlights.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No key highlights added yet. Click &ldquo;Add Highlight&rdquo; to showcase iconic
                experiences.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {highlights.map((item, idx) => (
                  <CollapsibleItemCard
                    key={idx}
                    title={`${item.icon ? `${item.icon} ` : ""}Highlight #${idx + 1}`}
                    subtitle={item.title}
                    isOpen={openHighlightIndices.includes(idx)}
                    onToggle={() => toggleHighlight(idx)}
                    onDelete={() => handleRemoveHighlight(idx)}
                    deleteTitle="Remove Highlight"
                  >
                    <div className="grid grid-cols-4 gap-3">
                      <InputField
                        label="Emoji / Icon"
                        value={item.icon ?? ""}
                        onChange={(e) => handleUpdateHighlight(idx, "icon", e.target.value)}
                        placeholder="✨"
                        containerClassName="col-span-1"
                      />
                      <InputField
                        label="Title *"
                        value={item.title}
                        onChange={(e) => handleUpdateHighlight(idx, "title", e.target.value)}
                        placeholder="e.g. Living-Root Bridges"
                        containerClassName="col-span-3"
                        required
                      />
                    </div>

                    <TextAreaField
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateHighlight(idx, "description", e.target.value)}
                      placeholder="e.g. Hike through deep sub-tropical canyons..."
                      rows={2}
                    />
                  </CollapsibleItemCard>
                ))}
              </div>
            )}
          </div>

          {/* Part C: Day-by-Day Itinerary */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0E5A60]" /> Day-by-Day Itinerary (
                {itinerary.length} Days)
              </span>
              <div className="flex items-center gap-2">
                {itinerary.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenItineraryIndices(
                        openItineraryIndices.length === itinerary.length
                          ? []
                          : itinerary.map((_, i) => i),
                      )
                    }
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {openItineraryIndices.length === itinerary.length
                      ? "Collapse all"
                      : "Expand all"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Day
                </button>
              </div>
            </div>

            {itinerary.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No itinerary days added yet. Click &ldquo;Add Day&rdquo; to build your daily
                schedule.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {itinerary.map((day, idx) => (
                  <CollapsibleItemCard
                    key={idx}
                    title={day.day || `Day ${idx + 1}`}
                    subtitle={day.title || "Untitled Day"}
                    image={day.image}
                    isOpen={openItineraryIndices.includes(idx)}
                    onToggle={() => toggleItinerary(idx)}
                    onDelete={() => handleRemoveDay(idx)}
                    deleteTitle="Remove Day"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <InputField
                        label="Day Label *"
                        value={day.day}
                        onChange={(e) => handleUpdateDay(idx, "day", e.target.value)}
                        placeholder="e.g. Day 1"
                        required
                      />
                      <InputField
                        label="Day Title *"
                        value={day.title}
                        onChange={(e) => handleUpdateDay(idx, "title", e.target.value)}
                        placeholder="e.g. Arrival in the Meadow of Gold"
                        containerClassName="sm:col-span-2"
                        required
                      />
                    </div>

                    <TextAreaField
                      label="Day Experience & Activities Narrative"
                      value={day.journey}
                      onChange={(e) => handleUpdateDay(idx, "journey", e.target.value)}
                      placeholder="Describe the day's journey, sights, meals, and adventures..."
                      rows={3}
                    />

                    <InputField
                      label="Community & Friendship Connection"
                      value={day.community}
                      onChange={(e) => handleUpdateDay(idx, "community", e.target.value)}
                      placeholder="e.g. Evening icebreaker tea circle by the stream"
                    />

                    <ImagePickerField
                      label="Day Photo (Optional)"
                      value={day.image ?? ""}
                      onChange={(url) => handleUpdateDay(idx, "image", url)}
                    />
                  </CollapsibleItemCard>
                ))}
              </div>
            )}
          </div>

          {/* Full-width Standard Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <SaveButton loading={loading} saved={saved} onClick={handleSave} />
          </div>
        </form>
      )}
    </div>
  );
}
