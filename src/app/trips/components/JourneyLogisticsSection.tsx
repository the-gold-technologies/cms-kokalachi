"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { StringListEditor } from "@/components/StringListEditor";
import { SaveButton } from "@/components/SaveButton";
import { ShieldCheck, CheckCircle2, XCircle, Utensils, Luggage, CloudSun } from "lucide-react";
import toast from "react-hot-toast";

export function JourneyLogisticsSection({
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
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [whatToPack, setWhatToPack] = useState<string[]>([]);
  const [weather, setWeather] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setInclusions(Array.isArray(initialData.inclusions) ? initialData.inclusions : []);
      setExclusions(Array.isArray(initialData.exclusions) ? initialData.exclusions : []);
      setMeals(Array.isArray(initialData.meals) ? initialData.meals : []);
      setWhatToPack(Array.isArray(initialData.whatToPack) ? initialData.whatToPack : []);
      setWeather(Array.isArray(initialData.weather) ? initialData.weather : []);
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        inclusions,
        exclusions,
        meals,
        whatToPack,
        weather,
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Logistics, inclusions & packing details saved!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save logistics");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving logistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="4. Inclusions, Exclusions & Preparation"
        description="Transparent breakdown of what is covered in the trip cost, meals, packing checklist, and weather guidance displayed on the detail page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-6 flex flex-col gap-6"
        >
          {/* Row 1: Inclusions & Exclusions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StringListEditor
              label="What's Included (Inclusions)"
              items={inclusions}
              onChange={setInclusions}
              icon={<CheckCircle2 className="w-4 h-4 text-[#0E5A60]" />}
              accentColor="teal"
              placeholder="e.g. All boutique accommodation & traditional stays..."
            />
            <StringListEditor
              label="What's Not Included (Exclusions)"
              items={exclusions}
              onChange={setExclusions}
              icon={<XCircle className="w-4 h-4 text-[#D96C2C]" />}
              accentColor="orange"
              placeholder="e.g. Flights to/from the arrival destination..."
            />
          </div>

          {/* Row 2: Meals & What to Pack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StringListEditor
              label="Meals Provided"
              items={meals}
              onChange={setMeals}
              icon={<Utensils className="w-4 h-4 text-[#0E5A60]" />}
              accentColor="teal"
              placeholder="e.g. Daily traditional breakfasts and curated group dinners..."
            />
            <StringListEditor
              label="What to Pack Checklist"
              items={whatToPack}
              onChange={setWhatToPack}
              icon={<Luggage className="w-4 h-4 text-[#0E5A60]" />}
              accentColor="teal"
              placeholder="e.g. Sturdy trekking shoes with good grip on wet rocks..."
            />
          </div>

          {/* Row 3: Weather & Preparation Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StringListEditor
              label="Weather & Climate Notes"
              items={weather}
              onChange={setWeather}
              icon={<CloudSun className="w-4 h-4 text-[#0E5A60]" />}
              accentColor="teal"
              placeholder="e.g. Crisp autumn mornings with sunny afternoons..."
            />

            <div className="p-6 sm:p-7 rounded-3xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#0E5A60] uppercase tracking-wider">
                <div className="w-7 h-7 rounded-xl bg-[#D96C2C]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#D96C2C]" />
                </div>
                <span>Traveller Confidence Tips</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Clear packing lists and weather guidelines reduce traveller hesitation before
                booking. Each bullet point will automatically render with checkmark badges on the
                live trip detail page under the <strong>&ldquo;What to Pack&rdquo;</strong> and{" "}
                <strong>&ldquo;Weather&rdquo;</strong> tabs.
              </p>
              <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-200/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span>Supports multi-line paste to add multiple items instantly.</span>
              </div>
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
