"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { StringListEditor } from "@/components/StringListEditor";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";

// The three "How are you travelling?" choices on the website. The keys are fixed because each
// one does something different there: Solo and Group search the trips, Custom opens the
// Custom Group Trip page. Only the wording is edited here.
type TravelStyleKey = "solo" | "group" | "custom";

interface TravellerOption {
  key: TravelStyleKey;
  label: string;
  desc: string;
}

const TRAVEL_STYLES: { key: TravelStyleKey; hint: string; defaults: TravellerOption }[] = [
  {
    key: "solo",
    hint: "Searches trips",
    defaults: { key: "solo", label: "Solo", desc: "Join a group trip on your own" },
  },
  {
    key: "group",
    hint: "Searches trips",
    defaults: { key: "group", label: "Group", desc: "With friends, a partner or family" },
  },
  {
    key: "custom",
    hint: "Opens the Custom Group Trip page",
    defaults: { key: "custom", label: "Custom", desc: "A private trip on your own dates" },
  },
];

// Saved options by key; anything missing (e.g. the old "1 Traveller" list) gets the defaults
function toTravelStyles(saved: unknown): TravellerOption[] {
  const list = Array.isArray(saved) ? saved : [];
  return TRAVEL_STYLES.map(({ key, defaults }) => {
    const found = list.find((o: any) => o && typeof o === "object" && o.key === key);
    return {
      key,
      label: found?.label ?? defaults.label,
      desc: found?.desc ?? defaults.desc,
    };
  });
}

interface HeroSectionContent {
  tagline: string;
  headline: string;
  scriptAccent: string;
  subtitle1: string;
  subtitle2: string;
  backgroundImage: string;
  destPlaceholder: string;
  searchPlaceholder: string;
  popularDestinationsTitle: string;
  whenLabel: string;
  travellersLabel: string;
  groupSizeTitle: string;
  searchButtonText: string;
  customButtonText: string;
  popularSearchesLabel: string;
  travellerOptions: TravellerOption[];
  popularDestinations: string[];
  quickDatePresets: string[];
}

export function HeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states initialized to clean empty values (ZERO default data)
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle1, setSubtitle1] = useState("");
  const [subtitle2, setSubtitle2] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [destPlaceholder, setDestPlaceholder] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [popularDestinationsTitle, setPopularDestinationsTitle] = useState("");
  const [whenLabel, setWhenLabel] = useState("");
  const [travellersLabel, setTravellersLabel] = useState("");
  const [groupSizeTitle, setGroupSizeTitle] = useState("");
  const [searchButtonText, setSearchButtonText] = useState("");
  const [customButtonText, setCustomButtonText] = useState("");
  const [popularSearchesLabel, setPopularSearchesLabel] = useState("");
  const [travellerOptions, setTravellerOptions] = useState<TravellerOption[]>(() =>
    toTravelStyles(null),
  );
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [quickDatePresets, setQuickDatePresets] = useState<string[]>([]);

  const [openTravellerIndices, setOpenTravellerIndices] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle1(initialData.subtitle1 ?? "");
      setSubtitle2(initialData.subtitle2 ?? "");
      setBackgroundImage(initialData.backgroundImage ?? "");
      setDestPlaceholder(initialData.destPlaceholder ?? "");
      setSearchPlaceholder(initialData.searchPlaceholder ?? "");
      setPopularDestinationsTitle(initialData.popularDestinationsTitle ?? "");
      setWhenLabel(initialData.whenLabel ?? "");
      setTravellersLabel(initialData.travellersLabel ?? "");
      setGroupSizeTitle(initialData.groupSizeTitle ?? "");
      setSearchButtonText(initialData.searchButtonText ?? "");
      setCustomButtonText(initialData.customButtonText ?? "");
      setPopularSearchesLabel(initialData.popularSearchesLabel ?? "");
      setTravellerOptions(toTravelStyles(initialData.travellerOptions));
      setPopularDestinations(
        Array.isArray(initialData.popularDestinations) ? initialData.popularDestinations : [],
      );
      setQuickDatePresets(
        Array.isArray(initialData.quickDatePresets) ? initialData.quickDatePresets : [],
      );
    }
  }, [initialData]);

  const toggleTravellerOption = (idx: number) => {
    setOpenTravellerIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const updateTravellerOption = (idx: number, field: "label" | "desc", value: string) => {
    const updated = [...travellerOptions];
    updated[idx] = { ...updated[idx], [field]: value };
    setTravellerOptions(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload: HeroSectionContent = {
        tagline,
        headline,
        scriptAccent,
        subtitle1,
        subtitle2,
        backgroundImage,
        destPlaceholder,
        searchPlaceholder,
        popularDestinationsTitle,
        whenLabel,
        travellersLabel,
        groupSizeTitle,
        searchButtonText,
        customButtonText,
        popularSearchesLabel,
        travellerOptions,
        popularDestinations,
        quickDatePresets,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "HeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Hero section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save Hero section");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="HeroSection"
          description="Manage primary headline, script font accent, subheadings, hero background image, and search filter tags."
          badge="Section 1"
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
                label="Top Category Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. FOR TRAVELLERS WHO WERE ONLY EVER RESTING"
                tooltip="Appears in uppercase small font above the primary headline"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Primary Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Find your circle. Find your next"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. journey."
                  tooltip="Rendered in flowing handwritten script with curved gold underline"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Subtitle Line 1"
                  value={subtitle1}
                  onChange={(e) => setSubtitle1(e.target.value)}
                  placeholder="e.g. Curated group trips for solo travellers."
                />
                <InputField
                  label="Subtitle Line 2"
                  value={subtitle2}
                  onChange={(e) => setSubtitle2(e.target.value)}
                  placeholder="e.g. Real people. Real stories. Real connections."
                />
              </div>

              <ImagePickerField
                label="Hero Background Image"
                value={backgroundImage}
                onChange={setBackgroundImage}
                tooltip="High-res landscape photography backdrop for hero area"
              />

              {/* Search Widget Controls */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Search Bar / Widget Controls
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize labels and placeholders inside the interactive search box
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Destination Input Placeholder"
                    value={destPlaceholder}
                    onChange={(e) => setDestPlaceholder(e.target.value)}
                    placeholder="e.g. Where to?"
                  />
                  <InputField
                    label="Destination Search Popup Placeholder"
                    value={searchPlaceholder}
                    onChange={(e) => setSearchPlaceholder(e.target.value)}
                    placeholder="e.g. Search destinations"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Popular Destinations Popup Title"
                    value={popularDestinationsTitle}
                    onChange={(e) => setPopularDestinationsTitle(e.target.value)}
                    placeholder="e.g. Popular Destinations"
                  />
                  <InputField
                    label="When / Dates Button Label"
                    value={whenLabel}
                    onChange={(e) => setWhenLabel(e.target.value)}
                    placeholder="e.g. When?"
                  />
                  <InputField
                    label="Travel Style Button Label"
                    value={travellersLabel}
                    onChange={(e) => setTravellersLabel(e.target.value)}
                    placeholder="e.g. Travelling"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Travel Style Popup Title"
                    value={groupSizeTitle}
                    onChange={(e) => setGroupSizeTitle(e.target.value)}
                    placeholder="e.g. How are you travelling?"
                  />
                  <InputField
                    label="Search CTA Button Text"
                    value={searchButtonText}
                    onChange={(e) => setSearchButtonText(e.target.value)}
                    placeholder="e.g. SEARCH TRIPS"
                  />
                  <InputField
                    label="Custom Trip Button Text"
                    value={customButtonText}
                    onChange={(e) => setCustomButtonText(e.target.value)}
                    placeholder="e.g. Plan My Trip"
                    tooltip="Replaces the search button when the visitor picks the Custom travel style"
                  />
                  <InputField
                    label="Popular Searches Label"
                    value={popularSearchesLabel}
                    onChange={(e) => setPopularSearchesLabel(e.target.value)}
                    placeholder="e.g. Popular Searches:"
                  />
                </div>

                {/* Traveller Options (Collapsible Cards) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                        Travel Style Options
                      </span>
                      <p className="text-xs text-gray-500">
                        The three choices in the &quot;How are you travelling?&quot; dropdown
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenTravellerIndices(
                          openTravellerIndices.length === travellerOptions.length
                            ? []
                            : travellerOptions.map((_, i) => i),
                        )
                      }
                      className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {openTravellerIndices.length === travellerOptions.length
                        ? "Collapse all"
                        : "Expand all"}
                    </button>
                  </div>

                  {travellerOptions.map((opt, idx) => (
                    <CollapsibleItemCard
                      key={opt.key}
                      title={`${opt.label || TRAVEL_STYLES[idx].defaults.label} (${TRAVEL_STYLES[idx].hint})`}
                      subtitle={opt.desc}
                      badge={`${idx + 1}`}
                      isOpen={openTravellerIndices.includes(idx)}
                      onToggle={() => toggleTravellerOption(idx)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputField
                          label="Option Label"
                          value={opt.label}
                          onChange={(e) => updateTravellerOption(idx, "label", e.target.value)}
                          placeholder={`e.g. ${TRAVEL_STYLES[idx].defaults.label}`}
                        />
                        <InputField
                          label="Option Description"
                          value={opt.desc}
                          onChange={(e) => updateTravellerOption(idx, "desc", e.target.value)}
                          placeholder={`e.g. ${TRAVEL_STYLES[idx].defaults.desc}`}
                        />
                      </div>
                    </CollapsibleItemCard>
                  ))}
                </div>
              </div>

              <StringListEditor
                label="Popular Destinations (Search Suggestions)"
                items={popularDestinations}
                onChange={setPopularDestinations}
                placeholder="e.g. Himachal Pradesh, Kashmir, Meghalaya"
                tooltip="Tags displayed inside the interactive search destination dropdown"
              />

              <StringListEditor
                label="Quick Date Presets"
                items={quickDatePresets}
                onChange={setQuickDatePresets}
                placeholder="e.g. Flexible Dates, Next 30 Days, Upcoming Weekends"
                tooltip="Quick selection pills in the calendar filter"
              />

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
