"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2, Calendar, Flame } from "lucide-react";
import toast from "react-hot-toast";

interface DepartureItem {
  id?: string;
  startDate: string;
  endDate: string;
  price?: string | number | null;
  originalPrice?: string | number | null;
  spotsLeft: number | string;
  status: "open" | "soldout" | "closed";
  label?: string | null;
  note?: string | null;
}

export function JourneyDeparturesSection({
  tripId,
  initialDepartures,
  onSaved,
}: {
  tripId: string;
  initialDepartures?: any[];
  onSaved?: (data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default mock data)
  const [departures, setDepartures] = useState<DepartureItem[]>([]);

  useEffect(() => {
    if (Array.isArray(initialDepartures)) {
      setDepartures(
        initialDepartures.map((d) => ({
          id: d.id ?? "",
          startDate: d.startDate ?? "",
          endDate: d.endDate ?? "",
          price: d.price !== undefined && d.price !== null ? String(d.price) : "",
          originalPrice: d.originalPrice !== undefined && d.originalPrice !== null ? String(d.originalPrice) : "",
          spotsLeft: d.spotsLeft !== undefined && d.spotsLeft !== null ? String(d.spotsLeft) : "10",
          status: d.status ?? "open",
          label: d.label ?? "",
          note: d.note ?? "",
        }))
      );
    }
  }, [initialDepartures]);

  const handleAddDeparture = () => {
    setDepartures((prev) => [
      ...prev,
      {
        startDate: "",
        endDate: "",
        price: "",
        originalPrice: "",
        spotsLeft: "10",
        status: "open",
        label: "",
        note: "",
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof DepartureItem, value: any) => {
    setDepartures((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setDepartures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        departures: departures.map((d) => ({
          id: d.id && d.id.trim() !== "" ? d.id : undefined,
          startDate: d.startDate,
          endDate: d.endDate,
          price: d.price ? parseFloat(String(d.price)) : null,
          originalPrice: d.originalPrice ? parseFloat(String(d.originalPrice)) : null,
          spotsLeft: typeof d.spotsLeft === "number" ? d.spotsLeft : parseInt(String(d.spotsLeft), 10) || 10,
          status: d.status,
          label: d.label && d.label.trim() !== "" ? d.label : null,
          note: d.note && d.note.trim() !== "" ? d.note : null,
        })),
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Departures and dates saved successfully!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save departures");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving departures");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="2. Departures & Booking Dates"
        description="Manage the live travel dates, spots left, batch pricing overrides, and availability badges that power booking and chip selectors across the website."
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
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0E5A60]" /> Scheduled Departures ({departures.length})
            </span>
            <button
              type="button"
              onClick={handleAddDeparture}
              className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Departure Batch
            </button>
          </div>

          {departures.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No dates scheduled yet. Click &ldquo;Add Departure Batch&rdquo; to open live booking dates for this journey.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {departures.map((dep, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 flex flex-col gap-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                    <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[11px] font-black">
                        {idx + 1}
                      </span>
                      Departure Batch #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove Departure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InputField
                      label="Start Date *"
                      type="date"
                      value={dep.startDate}
                      onChange={(e) => handleUpdate(idx, "startDate", e.target.value)}
                      required
                    />
                    <InputField
                      label="End Date *"
                      type="date"
                      value={dep.endDate}
                      onChange={(e) => handleUpdate(idx, "endDate", e.target.value)}
                      required
                    />
                    <InputField
                      label="Custom Batch Price (₹)"
                      type="number"
                      value={dep.price !== undefined && dep.price !== null ? String(dep.price) : ""}
                      onChange={(e) => handleUpdate(idx, "price", e.target.value)}
                      placeholder="Leave blank to use base"
                    />
                    <InputField
                      label="Spots Left *"
                      type="number"
                      value={String(dep.spotsLeft)}
                      onChange={(e) => handleUpdate(idx, "spotsLeft", e.target.value)}
                      placeholder="e.g. 8"
                      required
                    />
                  </div>

                  {/* Status & Labels Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Booking Status
                      </label>
                      <select
                        value={dep.status}
                        onChange={(e) => handleUpdate(idx, "status", e.target.value as any)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 cursor-pointer"
                      >
                        <option value="open">Open (Accepting Bookings)</option>
                        <option value="soldout">Sold Out</option>
                        <option value="closed">Closed / Archived</option>
                      </select>
                    </div>

                    <InputField
                      label="Batch Badge / Label"
                      value={dep.label ?? ""}
                      onChange={(e) => handleUpdate(idx, "label", e.target.value)}
                      placeholder="e.g. Diwali Special, Long Weekend"
                    />

                    <InputField
                      label="Departure Note"
                      value={dep.note ?? ""}
                      onChange={(e) => handleUpdate(idx, "note", e.target.value)}
                      placeholder="e.g. Departs Delhi on Friday night"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full-width Standard Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <SaveButton loading={loading} saved={saved} onClick={handleSave} />
          </div>
        </form>
      )}
    </div>
  );
}
