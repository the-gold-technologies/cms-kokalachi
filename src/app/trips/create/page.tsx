"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { StringListEditor } from "@/components/StringListEditor";
import { SaveButton } from "@/components/SaveButton";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  MapPin,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Utensils,
  Luggage,
  CloudSun,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { ImportJourneyDocModal } from "../components/ImportJourneyDocModal";
import { ParsedJourneyDoc } from "@/lib/journeyDocParser";
import toast from "react-hot-toast";

interface DepartureItem {
  startDate: string;
  endDate: string;
  price?: string;
  originalPrice?: string;
  spotsLeft: string;
  status: "open" | "soldout" | "closed";
  label?: string;
  note?: string;
}

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

interface FaqItem {
  question: string;
  answer: string;
}

export default function CreateFullJourneyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Vibe Categories from API
  const [vibeCategories, setVibeCategories] = useState<{ id: string; label: string }[]>([]);

  // 1. Card & Core Details State
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

  // 2. Departures State
  const [departures, setDepartures] = useState<DepartureItem[]>([]);

  // 3. Experience State
  const [overviewText, setOverviewText] = useState("");
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  // 4. Logistics State
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [whatToPack, setWhatToPack] = useState<string[]>([]);
  const [weather, setWeather] = useState<string[]>([]);

  // 5. FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // 6. SEO State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [schema, setSchema] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleApplyDoc = (data: ParsedJourneyDoc) => {
    if (data.title) setTitle(data.title);
    if (data.slug) setSlug(data.slug);
    else if (data.title) setSlug(generateSlug(data.title));

    if (data.subtitle !== undefined) setSubtitle(data.subtitle);
    if (data.destinationSlug !== undefined) setDestinationSlug(data.destinationSlug);
    if (data.location !== undefined) setLocation(data.location);
    if (data.duration !== undefined) setDuration(data.duration);
    if (data.groupSize !== undefined) setGroupSize(data.groupSize);
    if (data.rating !== undefined) setRating(String(data.rating));
    if (data.price !== undefined) setPrice(String(data.price));
    if (data.originalPrice !== undefined) setOriginalPrice(String(data.originalPrice));
    if (data.gstAmount !== undefined) setGstAmount(String(data.gstAmount));
    if (data.category) setCategory(data.category);
    if (data.tag !== undefined) setTag(data.tag);
    if (data.hook !== undefined) setHook(data.hook);
    if (data.image) setImage(data.image);
    if (Array.isArray(data.gallery) && data.gallery.length > 0) setGallery(data.gallery);
    if (Array.isArray(data.vibeTags) && data.vibeTags.length > 0) setVibeTags(data.vibeTags);

    if (Array.isArray(data.departures) && data.departures.length > 0) {
      setDepartures(
        data.departures.map((d) => ({
          startDate: d.startDate || "",
          endDate: d.endDate || "",
          price: d.price != null ? String(d.price) : "",
          originalPrice: d.originalPrice != null ? String(d.originalPrice) : "",
          spotsLeft: String(d.spotsLeft ?? ""),
          status: (d.status as any) || "open",
          label: d.label || "",
          note: d.note || "",
        })),
      );
    }

    if (data.overviewText) {
      setOverviewText(data.overviewText);
    } else if (Array.isArray(data.overview) && data.overview.length > 0) {
      setOverviewText(data.overview.join("\n\n"));
    }

    if (Array.isArray(data.highlights) && data.highlights.length > 0) {
      setHighlights(
        data.highlights.map((h) => ({
          icon: h.icon || "Sparkles",
          title: h.title || "",
          description: h.description || "",
        })),
      );
    }

    if (Array.isArray(data.itinerary) && data.itinerary.length > 0) {
      setItinerary(
        data.itinerary.map((it) => ({
          day: it.day || "",
          title: it.title || "",
          journey: it.journey || "",
          community: it.community || "",
          image: it.image || "",
        })),
      );
    }

    if (Array.isArray(data.inclusions) && data.inclusions.length > 0)
      setInclusions(data.inclusions);
    if (Array.isArray(data.exclusions) && data.exclusions.length > 0)
      setExclusions(data.exclusions);
    if (Array.isArray(data.meals) && data.meals.length > 0) setMeals(data.meals);
    if (Array.isArray(data.whatToPack) && data.whatToPack.length > 0)
      setWhatToPack(data.whatToPack);
    if (Array.isArray(data.weather) && data.weather.length > 0) setWeather(data.weather);

    if (Array.isArray(data.faqs) && data.faqs.length > 0) {
      setFaqs(
        data.faqs.map((f) => ({
          question: f.question || "",
          answer: f.answer || "",
        })),
      );
    }

    if (data.metaTitle !== undefined) setMetaTitle(data.metaTitle);
    if (data.metaDescription !== undefined) setMetaDescription(data.metaDescription);
    if (data.targetKeywords !== undefined) setTargetKeywords(data.targetKeywords);

    toast.success("All 6 sections pre-filled from document!");
  };

  // Load vibe categories from API
  useEffect(() => {
    async function loadVibeCategories() {
      try {
        const res = await fetch("/api/journeys");
        const json = await res.json();
        if (json.success && json.data?.sections?.JourneysFilterSection?.categories) {
          const cats = json.data.sections.JourneysFilterSection.categories.filter(
            (c: any) => c.id !== "All",
          );
          setVibeCategories(cats);
          if (cats.length > 0) setCategory(cats[0].id);
        }
      } catch {
        console.error("Failed to load vibe categories");
      }
    }
    loadVibeCategories();
  }, []);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(generateSlug(val));
  };

  // Departure Handlers
  const handleAddDeparture = () => {
    setDepartures((prev) => [
      ...prev,
      {
        startDate: "",
        endDate: "",
        price: "",
        originalPrice: "",
        spotsLeft: "",
        status: "open",
        label: "",
        note: "",
      },
    ]);
  };

  const handleUpdateDeparture = (idx: number, field: keyof DepartureItem, val: any) => {
    setDepartures((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveDeparture = (idx: number) => {
    setDepartures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Overview handled via single overviewText textarea

  // Highlights Handlers
  const handleAddHighlight = () =>
    setHighlights((prev) => [...prev, { icon: "Sparkles", title: "", description: "" }]);
  const handleUpdateHighlight = (idx: number, field: keyof HighlightItem, val: string) => {
    setHighlights((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };
  const handleRemoveHighlight = (idx: number) =>
    setHighlights((prev) => prev.filter((_, i) => i !== idx));

  // Itinerary Handlers
  const handleAddDay = () =>
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
  const handleUpdateDay = (idx: number, field: keyof ItineraryDay, val: string) => {
    setItinerary((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };
  const handleRemoveDay = (idx: number) => setItinerary((prev) => prev.filter((_, i) => i !== idx));

  // FAQs Handlers
  const handleAddFaq = () => setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  const handleUpdateFaq = (idx: number, field: keyof FaqItem, val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };
  const handleRemoveFaq = (idx: number) => setFaqs((prev) => prev.filter((_, i) => i !== idx));

  // Gallery Handlers
  const handleAddGalleryImage = () => setGallery((prev) => [...prev, ""]);
  const handleUpdateGalleryImage = (idx: number, val: string) => {
    setGallery((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };
  const handleRemoveGalleryImage = (idx: number) =>
    setGallery((prev) => prev.filter((_, i) => i !== idx));

  const handleSaveJourney = async () => {
    const finalSlug = slug || generateSlug(title);
    if (!title || !finalSlug) {
      toast.error("Please enter a journey title");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        title,
        slug: finalSlug,
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
        departures: departures
          .filter((d) => d.startDate && d.endDate)
          .map((d) => ({
            startDate: d.startDate,
            endDate: d.endDate,
            price: d.price ? parseFloat(d.price) : null,
            originalPrice: d.originalPrice ? parseFloat(d.originalPrice) : null,
            spotsLeft: parseInt(d.spotsLeft) || null,
            status: d.status,
            label: d.label && d.label.trim() !== "" ? d.label : null,
            note: d.note && d.note.trim() !== "" ? d.note : null,
          })),
        overview: overviewText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        highlights: highlights.filter((h) => h.title.trim() !== ""),
        itinerary: itinerary.filter((d) => d.day.trim() !== "" || d.title.trim() !== ""),
        inclusions,
        exclusions,
        meals,
        whatToPack,
        weather,
        faqs: faqs.filter((f) => f.question.trim() !== ""),
        metaTitle,
        metaDescription,
        targetKeywords,
        noIndex,
        schema: schema.trim() || undefined,
      };

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSaved(true);
        toast.success("Journey created successfully!");
        setTimeout(() => {
          router.push("/trips");
        }, 1000);
      } else {
        toast.error(json.error ?? "Failed to create journey");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error creating journey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-7xl mx-auto w-full">
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0E5A60] transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journeys
        </Link>

        <PageHeader
          title="Create New Journey"
          description="Fill out the complete journey details in one single place: card visuals, live booking batches, storytelling narrative, day-by-day itinerary, inclusions, and FAQs."
        />
      </div>

      {/* Quick Import Action Card */}
      <div className="bg-gradient-to-r from-[#0E5A60]/10 via-[#FAF4EC] to-white rounded-3xl p-6 sm:p-7 border border-[#0E5A60]/20 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0E5A60] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0E5A60]/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Import Journey from Document</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0E5A60] text-white px-2.5 py-0.5 rounded-full">
                JSON &amp; Markdown
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              Upload a .json or .md file (or paste its content) to automatically pre-fill all 6
              sections: itinerary, highlights, meals, inclusions, packing checklist, weather, FAQs,
              departures &amp; images.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0E5A60] hover:bg-[#0E5A60]/90 text-white text-xs font-bold transition-all shadow-md shadow-[#0E5A60]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#D96C2C]" />
          Import from Document
        </button>
      </div>

      {/* Section 1: Card & Core Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
        <SectionHeader
          title="1. Card & Core Details"
          description="Title, URL slug, destination, duration, vibe category, pricing, and slideshow images."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Journey Title *"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. The Houseboat Diaries - Kashmir"
            required
          />
          <div className="flex flex-col gap-1.5 px-0.5">
            <div className="flex items-center justify-between ml-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span>URL Slug *</span>
                <span className="text-[10px] font-semibold text-[#0E5A60] bg-[#0E5A60]/10 px-2 py-0.5 rounded-full normal-case">
                  Auto / Editable
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (title) {
                    const generated = generateSlug(title);
                    setSlug(generated);
                    toast.success("Slug generated from title!");
                  } else {
                    toast.error("Please enter a title first");
                  }
                }}
                className="text-[11px] font-semibold text-[#0E5A60] hover:underline cursor-pointer"
                title="Regenerate slug from current title"
              >
                Sync with Title
              </button>
            </div>
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono select-none pointer-events-none">
                /journeys/
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="custom-or-auto-slug"
                className="w-full pl-24 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-mono text-gray-800 focus:outline-none focus:border-[#0E5A60] focus:ring-2 focus:ring-[#0E5A60]/15 transition-all"
                required
              />
            </div>
            <span className="text-[11px] text-gray-400 ml-4">
              Auto-generated from title, or type freely to customize.
            </span>
          </div>
        </div>

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
              {vibeCategories.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label || v.id}
                </option>
              ))}
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

        <TextAreaField
          label="Hook / Punchy Tagline"
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          rows={2}
          placeholder="e.g. Waking up to lotus blooms and shikara oars."
        />

        <StringListEditor
          label="Vibe Tags (e.g. Lake Life, Shikara Walks, Sufi Music)"
          items={vibeTags}
          onChange={setVibeTags}
          placeholder="Add a vibe tag..."
        />

        <ImagePickerField
          label="Primary Card Cover Image"
          value={image}
          onChange={setImage}
          placeholder="https://images.unsplash.com/..."
        />

        {/* Gallery Images */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#0E5A60]" /> Card Slideshow Images (
              {gallery.length})
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

        <label className="flex items-center gap-2.5 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-[#0E5A60] rounded border-gray-300 focus:ring-[#0E5A60]"
          />
          <span className="text-xs font-bold text-gray-700">
            Feature on Homepage (Upcoming Journeys Carousel)
          </span>
        </label>
      </div>

      {/* Section 2: Departures & Booking Dates */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <SectionHeader
            title="2. Departures & Live Booking Dates"
            description="Add scheduled travel dates, spots left, and batch pricing overrides."
          />
          <button
            type="button"
            onClick={handleAddDeparture}
            className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Departure Batch
          </button>
        </div>

        {departures.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No departure dates added yet. Click &ldquo;Add Departure Batch&rdquo; to open booking
            dates.
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
                    onClick={() => handleRemoveDeparture(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Start Date *"
                    type="date"
                    value={dep.startDate}
                    onChange={(e) => handleUpdateDeparture(idx, "startDate", e.target.value)}
                    required
                  />
                  <InputField
                    label="End Date *"
                    type="date"
                    value={dep.endDate}
                    onChange={(e) => handleUpdateDeparture(idx, "endDate", e.target.value)}
                    required
                  />
                  <InputField
                    label="Batch Price Override (₹)"
                    type="number"
                    value={dep.price ?? ""}
                    onChange={(e) => handleUpdateDeparture(idx, "price", e.target.value)}
                    placeholder="Leave blank to use base"
                  />
                  <InputField
                    label="Spots Left *"
                    type="number"
                    value={dep.spotsLeft}
                    onChange={(e) => handleUpdateDeparture(idx, "spotsLeft", e.target.value)}
                    placeholder="e.g. 10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={dep.status}
                      onChange={(e) => handleUpdateDeparture(idx, "status", e.target.value as any)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 cursor-pointer"
                    >
                      <option value="open">Open (Accepting Bookings)</option>
                      <option value="soldout">Sold Out</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <InputField
                    label="Batch Badge / Label"
                    value={dep.label ?? ""}
                    onChange={(e) => handleUpdateDeparture(idx, "label", e.target.value)}
                    placeholder="e.g. Diwali Special"
                  />
                  <InputField
                    label="Departure Note"
                    value={dep.note ?? ""}
                    onChange={(e) => handleUpdateDeparture(idx, "note", e.target.value)}
                    placeholder="e.g. Departs Delhi on Friday"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Detail Page Experience */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-8">
        <SectionHeader
          title="3. Detail Page Experience (Overview, Highlights & Itinerary)"
          description="Narrative overview, key trip highlights, and day-by-day itinerary with community host connections."
        />

        {/* Overview Narrative (Single Textarea) */}
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

        {/* Highlights */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D96C2C]" /> Highlights ({highlights.length})
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
                  label="Description"
                  value={hl.description}
                  onChange={(e) => handleUpdateHighlight(idx, "description", e.target.value)}
                  rows={2}
                  placeholder="Wake before dawn to witness Dal Lake's floating market..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Itinerary */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0E5A60]" /> Day-by-Day Itinerary (
              {itinerary.length} Days)
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
      </div>

      {/* Section 4: Inclusions, Exclusions & Preparation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
        <SectionHeader
          title="4. Inclusions, Exclusions & Preparation"
          description="Transparent breakdown of what is covered in the trip cost, meals, packing checklist, and weather."
        />

        {/* Row 1: Inclusions & Exclusions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StringListEditor
            label="What's Included (Inclusions)"
            items={inclusions}
            onChange={setInclusions}
            icon={<CheckCircle2 className="w-4 h-4 text-[#0E5A60]" />}
            accentColor="teal"
            placeholder="e.g. All boutique accommodation & traditional houseboat stays..."
          />
          <StringListEditor
            label="What's Not Included (Exclusions)"
            items={exclusions}
            onChange={setExclusions}
            icon={<XCircle className="w-4 h-4 text-[#D96C2C]" />}
            accentColor="orange"
            placeholder="e.g. Flights to/from Srinagar (SXR)..."
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
            placeholder="e.g. Daily traditional breakfasts and curated dinners..."
          />
          <StringListEditor
            label="What to Pack Checklist"
            items={whatToPack}
            onChange={setWhatToPack}
            icon={<Luggage className="w-4 h-4 text-[#0E5A60]" />}
            accentColor="teal"
            placeholder="e.g. Warm layers (temperatures drop at night)..."
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
            placeholder="e.g. Crisp autumn days with brilliant sunshine..."
          />

          <div className="p-6 sm:p-7 rounded-3xl bg-gray-50/70 border border-gray-100 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#0E5A60] uppercase tracking-wider">
              <div className="w-7 h-7 rounded-xl bg-[#D96C2C]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#D96C2C]" />
              </div>
              <span>Traveller Confidence Tips</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Clear packing lists and weather guidelines reduce traveller hesitation before booking.
              Each bullet point will automatically render with checkmark badges on the live trip
              detail page under the <strong>&ldquo;What to Pack&rdquo;</strong> and{" "}
              <strong>&ldquo;Weather&rdquo;</strong> tabs.
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-200/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>Supports multi-line paste to add multiple items instantly.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <SectionHeader
            title="5. Frequently Asked Questions (FAQs)"
            description="Address traveller questions about fitness level, single supplements, visas, and trip guarantees."
          />
          <button
            type="button"
            onClick={handleAddFaq}
            className="text-xs font-bold text-[#0E5A60] hover:text-[#061C29] flex items-center gap-1 bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
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
                <span className="text-xs font-bold text-[#0E5A60]">Question #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <InputField
                label="Question"
                value={faq.question}
                onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                placeholder="e.g. Can I join as a solo traveller?"
              />

              <TextAreaField
                label="Answer"
                value={faq.answer}
                onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                rows={2}
                placeholder="e.g. Yes! Over 60% of our travellers join solo..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: SEO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
        <SectionHeader
          title="6. Search Engine Optimization (SEO)"
          description="Meta title tag, target keywords, description, and indexing."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Meta Title Tag"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="e.g. The Houseboat Diaries Kashmir | Curated Group Travel"
          />
          <InputField
            label="Target Search Keywords"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
            placeholder="e.g. kashmir group trip, houseboat stays srinagar"
          />
        </div>

        <TextAreaField
          label="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={2}
          placeholder="Experience Kashmir's autumn colours, Dal Lake houseboats..."
        />

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Structured Data (Schema Markup JSON-LD)
          </span>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder={'e.g. { "@context": "https://schema.org", "@type": "TouristTrip", ... }'}
            rows={6}
            className="w-full font-mono text-xs px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-gray-800"
          />
          <span className="text-[11px] text-gray-400">
            Optional custom JSON-LD schema. Leave empty to use auto-generated TouristTrip structured
            data.
          </span>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={noIndex}
            onChange={(e) => setNoIndex(e.target.checked)}
            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
          />
          <span className="text-xs font-bold text-gray-700">
            Hide from search engines (no-index)
          </span>
        </label>
      </div>

      {/* Global Save Button at the Bottom */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-xl">
        <SaveButton
          label="Create Journey with All Details"
          loading={loading}
          saved={saved}
          onClick={handleSaveJourney}
        />
      </div>

      <ImportJourneyDocModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApply={handleApplyDoc}
      />
    </div>
  );
}
