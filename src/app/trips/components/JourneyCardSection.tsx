"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { StringListEditor } from "@/components/StringListEditor";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";



export function JourneyCardSection({
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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [destinationSlug, setDestinationSlug] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [category, setCategory] = useState("Trending");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState("");
  const [hook, setHook] = useState("");
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [vibeTags, setVibeTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [vibeCategories, setVibeCategories] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    async function loadVibeCats() {
      try {
        const res = await fetch("/api/journeys");
        const json = await res.json();
        if (json.success && json.data?.sections?.JourneysFilterSection?.categories) {
          const cats = json.data.sections.JourneysFilterSection.categories.filter((c: any) => c.id !== "All");
          setVibeCategories(cats);
        }
      } catch {
        // ignore
      }
    }
    loadVibeCats();
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setSlug(initialData.slug ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setDestinationSlug(initialData.destinationSlug ?? "");
      setLocation(initialData.location ?? "");
      setDuration(initialData.duration ?? "");
      setGroupSize(initialData.groupSize ?? "");
      setRating(initialData.rating ? String(initialData.rating) : "");
      setPrice(initialData.price !== undefined ? String(initialData.price) : "");
      setOriginalPrice(initialData.originalPrice ? String(initialData.originalPrice) : "");
      setGstAmount(initialData.gstAmount ? String(initialData.gstAmount) : "");
      setCategory(initialData.category ?? "Trending");
      setTag(initialData.tag ?? "");
      setTagColor(initialData.tagColor ?? "");
      setHook(initialData.hook ?? "");
      setImage(initialData.image ?? "");
      setGallery(Array.isArray(initialData.gallery) ? initialData.gallery : []);
      setVibeTags(Array.isArray(initialData.vibeTags) ? initialData.vibeTags : []);
      setIsFeatured(!!initialData.isFeatured);
    }
  }, [initialData]);

  const handleAddGalleryImage = () => {
    setGallery((prev) => [...prev, ""]);
  };

  const handleUpdateGalleryImage = (idx: number, val: string) => {
    setGallery((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        title,
        slug,
        subtitle,
        destinationSlug,
        location,
        duration,
        groupSize,
        rating: rating ? parseFloat(rating) : 5.0,
        price: price ? parseFloat(price) : 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        gstAmount: gstAmount ? parseFloat(gstAmount) : 0,
        category,
        tag,
        tagColor,
        hook,
        image,
        gallery: gallery.filter((g) => g.trim() !== ""),
        vibeTags,
        isFeatured,
      };

      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Card & core details saved successfully!");
        if (onSaved) onSaved(json.data);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save card details");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving card details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
      <SectionHeader
        title="1. Journey Card & Core Details"
        description="Configure titles, pricing, duration, destination, vibe filters, and card slideshow images displayed across the website."
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
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Journey Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Houseboat Diaries - Kashmir"
              required
            />
            <div className="flex flex-col gap-1.5 px-0.5">
              <div className="flex items-center justify-between ml-4">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>URL Slug</span>
                  <span className="text-[10px] font-semibold text-[#0E5A60] bg-[#0E5A60]/10 px-2 py-0.5 rounded-full normal-case">
                    Auto-generated
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = title
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    if (generated) {
                      setSlug(generated);
                      toast.success("Slug synchronized with title!");
                    }
                  }}
                  className="text-[11px] font-semibold text-[#0E5A60] hover:underline cursor-pointer"
                  title="Update slug to match current title"
                >
                  Sync with Title
                </button>
              </div>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono select-none">
                  /journeys/
                </div>
                <input
                  type="text"
                  value={slug}
                  readOnly
                  placeholder="auto-generated-from-title"
                  className="w-full pl-24 pr-5 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs sm:text-sm font-mono text-gray-600 focus:outline-none cursor-not-allowed select-all"
                />
              </div>
              <span className="text-[11px] text-gray-400 ml-4">
                Live URL path for this journey on the website.
              </span>
            </div>
          </div>

          {/* Row 2: Subtitle & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Subtitle / Short Description"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Slow water living in Dal Lake & high meadows"
            />
            <InputField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Srinagar & Gulmarg, Kashmir"
            />
          </div>

          {/* Row 3: Destination, Duration, Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <InputField
              label="Destination Tag"
              value={destinationSlug}
              onChange={(e) => setDestinationSlug(e.target.value)}
              placeholder="e.g. Kashmir"
            />
            <InputField
              label="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 Days / 5 Nights"
            />
            <InputField
              label="Group Size"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              placeholder="e.g. 8–14 Travellers"
            />
          </div>

          {/* Row 4: Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <InputField
              label="Starting From Price (₹) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 34999"
              required
            />
            <InputField
              label="Original Struck-through Price (₹)"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 39999"
            />
            <InputField
              label="GST Amount (₹)"
              type="number"
              value={gstAmount}
              onChange={(e) => setGstAmount(e.target.value)}
              placeholder="e.g. 1750"
            />
          </div>

          {/* Row 5: Primary Vibe Category & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Primary Vibe Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 cursor-pointer"
              >
                {vibeCategories.length > 0 ? (
                  vibeCategories.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label || v.id}
                    </option>
                  ))
                ) : (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>
            <InputField
              label="Card Badge / Tag (Optional)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Popular, Trending, Limited"
            />
            <InputField
              label="Review Rating (out of 5.0)"
              type="number"
              step="0.01"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g. 4.95"
            />
          </div>

          {/* Row 6: Hook */}
          <TextAreaField
            label="Hook / Punchy Tagline"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            rows={2}
            placeholder="e.g. Waking up to lotus blooms and shikara oars."
          />

          {/* Row 7: Vibe Tags Chips */}
          <StringListEditor
            label="Vibe Tags (e.g. Lake Life, Shikara Walks, Sufi Music)"
            items={vibeTags}
            onChange={setVibeTags}
            placeholder="Add a vibe tag..."
          />

          {/* Row 8: Primary Card Image */}
          <ImagePickerField
            label="Primary Card Cover Image"
            value={image}
            onChange={setImage}
            placeholder="https://images.unsplash.com/..."
          />

          {/* Row 9: Card Gallery Slideshow Images */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0E5A60]" /> Card Slideshow Images ({gallery.length})
              </label>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slideshow Image
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-center gap-3"
                >
                  <span className="text-xs font-bold text-gray-400 shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleUpdateGalleryImage(idx, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0E5A60]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 10: Featured Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#0E5A60] rounded border-gray-300 focus:ring-[#0E5A60]"
              />
              <span className="text-xs font-bold text-gray-700">
                Feature on Homepage (Upcoming Journeys)
              </span>
            </label>
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
