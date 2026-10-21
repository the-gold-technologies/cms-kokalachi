"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
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

export function JourneyExperienceSection({
  tripId,
  initialData,
  onSaved,
}: {
  tripId: string;
  initialData?: any;
  onSaved?: (data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default mock data)
  const [overview, setOverview] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  useEffect(() => {
    if (initialData) {
      setOverview(Array.isArray(initialData.overview) ? initialData.overview : []);
      setHighlights(
        Array.isArray(initialData.highlights)
          ? initialData.highlights.map((h: any) => ({
              icon: h.icon ?? "",
              title: h.title ?? "",
              description: h.description ?? "",
            }))
          : []
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
          : []
      );
    }
  }, [initialData]);

  // Overview handlers
  const handleAddOverviewParagraph = () => {
    setOverview((prev) => [...prev, ""]);
  };

  const handleUpdateOverview = (idx: number, val: string) => {
    setOverview((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveOverview = (idx: number) => {
    setOverview((prev) => prev.filter((_, i) => i !== idx));
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, { icon: "Sparkles", title: "", description: "" }]);
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
  };

  // Itinerary handlers
  const handleAddDay = () => {
    setItinerary((prev) => [
      ...prev,
      {
        day: `Day ${prev.length + 1}`,
        title: "",
        journey: "",
        community: "",
        image: "",
      },
    ]);
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
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        overview: overview.filter((p) => p.trim() !== ""),
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
          {/* Part A: Overview Paragraphs */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0E5A60]" /> Experience Overview Paragraphs ({overview.length})
              </span>
              <button
                type="button"
                onClick={handleAddOverviewParagraph}
                className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Paragraph
              </button>
            </div>

            {overview.map((para, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <TextAreaField
                  label={`Paragraph #${idx + 1}`}
                  value={para}
                  onChange={(e) => handleUpdateOverview(idx, e.target.value)}
                  rows={3}
                  placeholder="Enter storytelling paragraph describing this curated journey..."
                  containerClassName="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOverview(idx)}
                  className="mt-8 p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Part B: Highlights */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D96C2C]" /> Key Highlights ({highlights.length})
              </span>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Highlight
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex flex-col gap-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Highlight #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <InputField
                    label="Highlight Title"
                    value={hl.title}
                    onChange={(e) => handleUpdateHighlight(idx, "title", e.target.value)}
                    placeholder="e.g. Floating Market Shikara"
                  />
                  <TextAreaField
                    label="Short Description"
                    value={hl.description}
                    onChange={(e) => handleUpdateHighlight(idx, "description", e.target.value)}
                    rows={2}
                    placeholder="Wake before dawn to witness Dal Lake's historic wholesale floating bazaar..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Part C: Day-by-Day Itinerary */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0E5A60]" /> Day-by-Day Itinerary ({itinerary.length} Days)
              </span>
              <button
                type="button"
                onClick={handleAddDay}
                className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {itinerary.map((dayItem, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50/70 rounded-3xl border border-gray-100 flex flex-col gap-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                    <span className="text-sm font-bold text-[#0E5A60] flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#0E5A60] text-white flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      {dayItem.day ? dayItem.day : `Day ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove Day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField
                      label="Day Label"
                      value={dayItem.day}
                      onChange={(e) => handleUpdateDay(idx, "day", e.target.value)}
                      placeholder="e.g. Day 1"
                    />
                    <InputField
                      label="Day Title"
                      value={dayItem.title}
                      onChange={(e) => handleUpdateDay(idx, "title", e.target.value)}
                      placeholder="e.g. Arrival in Srinagar & Sunset Shikara Ride"
                      containerClassName="sm:col-span-2"
                    />
                  </div>

                  <TextAreaField
                    label="What Happens on this Day (Journey Narrative)"
                    value={dayItem.journey}
                    onChange={(e) => handleUpdateDay(idx, "journey", e.target.value)}
                    rows={3}
                    placeholder="Arrive at Srinagar airport where your tribe curator meets you..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Community & Local Connection"
                      value={dayItem.community}
                      onChange={(e) => handleUpdateDay(idx, "community", e.target.value)}
                      placeholder="e.g. Hosted by Bashir Ahmed, 3rd-generation houseboat keeper"
                    />
                    <ImagePickerField
                      label="Optional Day Photo URL"
                      value={dayItem.image ?? ""}
                      onChange={(val) => handleUpdateDay(idx, "image", val)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
            </div>
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
