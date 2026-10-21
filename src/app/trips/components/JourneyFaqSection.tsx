"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

interface FaqItem {
  question: string;
  answer: string;
}

export function JourneyFaqSection({
  tripId,
  initialFaqs,
  onSaved,
}: {
  tripId: string;
  initialFaqs?: any[];
  onSaved?: (data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default mock data)
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (Array.isArray(initialFaqs)) {
      setFaqs(
        initialFaqs.map((f) => ({
          question: f.question ?? "",
          answer: f.answer ?? "",
        }))
      );
    }
  }, [initialFaqs]);

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleUpdate = (index: number, field: keyof FaqItem, val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        faqs: faqs.filter((f) => f.question.trim() !== ""),
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("FAQs saved successfully!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save FAQs");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving FAQs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="5. Frequently Asked Questions (FAQs)"
        description="Address traveller questions about fitness level, single supplements, visas, meeting points, and trip guarantees."
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
              <HelpCircle className="w-3.5 h-3.5 text-[#0E5A60]" /> Questions & Answers ({faqs.length})
            </span>
            <button
              type="button"
              onClick={handleAddFaq}
              className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 flex flex-col gap-3 relative"
              >
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                  <span className="text-xs font-bold text-[#0E5A60]">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <InputField
                  label="Question"
                  value={faq.question}
                  onChange={(e) => handleUpdate(idx, "question", e.target.value)}
                  placeholder="e.g. Can I join as a solo traveller?"
                />

                <TextAreaField
                  label="Answer"
                  value={faq.answer}
                  onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
                  rows={2}
                  placeholder="e.g. Yes! Over 60% of our travellers join solo..."
                />
              </div>
            ))}
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
