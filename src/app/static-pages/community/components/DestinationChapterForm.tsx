"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  PenLine,
  Camera,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  Quote,
  Users,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export type HighlightIcon =
  | "guide"
  | "welcome"
  | "hotel"
  | "bus"
  | "visa"
  | "transfer"
  | "tours"
  | "support"
  | "plan"
  | "place"
  | "friends";

export const HIGHLIGHT_ICON_OPTIONS: { id: HighlightIcon; label: string; emoji: string }[] = [
  { id: "guide", label: "Trip Leader / Guide", emoji: "👤" },
  { id: "welcome", label: "Warm Welcome / Host", emoji: "🤝" },
  { id: "hotel", label: "Hotel / Boutique Stay", emoji: "🏨" },
  { id: "bus", label: "Transport / Tempo", emoji: "🚐" },
  { id: "visa", label: "Visa / Documentation", emoji: "🛂" },
  { id: "transfer", label: "Transfers & Logistics", emoji: "🚗" },
  { id: "tours", label: "Tours & Excursions", emoji: "🎟️" },
  { id: "support", label: "Team Support / Reachable", emoji: "🎧" },
  { id: "plan", label: "Flawless Planning", emoji: "✨" },
  { id: "place", label: "Scenic Place / Views", emoji: "🏔️" },
  { id: "friends", label: "Friendship & Tribe", emoji: "🎉" },
];

const WALL_TILE_LIMIT = 8;

export interface CommunityMediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
}

export interface StoryHighlightItem {
  icon: HighlightIcon;
  label: string;
  detail: string;
}

export interface StoryAuthorItem {
  name: string;
  role?: string;
}

export interface TravellerStoryItem {
  id: string;
  title: string;
  pullQuote: string;
  travelledAs: string;
  summary: string;
  highlights: StoryHighlightItem[];
  paragraphs: string[];
  signoff?: string;
  authors: StoryAuthorItem[];
}

export interface CommunityTripChapter {
  slug: string;
  destination: string;
  country: string;
  tripType: string;
  travelledOn: string;
  tagline: string;
  journeySlug?: string;
  coverImage: string;
  media: CommunityMediaItem[];
  stories: TravellerStoryItem[];
}

const inputFocusClass =
  "focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]";

const textareaClass = `w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 ${inputFocusClass} transition-all leading-relaxed`;

const newStory = (): TravellerStoryItem => ({
  id: `story-${Date.now().toString(36)}`,
  title: "",
  pullQuote: "",
  travelledAs: "",
  summary: "",
  highlights: [{ icon: "guide", label: "", detail: "" }],
  paragraphs: [],
  signoff: "",
  authors: [{ name: "", role: "" }],
});

interface DestinationChapterFormProps {
  initialSlug?: string;
  isNew?: boolean;
}

export function DestinationChapterForm({
  initialSlug,
  isNew = false,
}: DestinationChapterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<"details" | "stories" | "media">("details");

  // Chapter state
  const [slug, setSlug] = useState("");
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelledOn, setTravelledOn] = useState("");
  const [tagline, setTagline] = useState("");
  const [journeySlug, setJourneySlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [media, setMedia] = useState<CommunityMediaItem[]>([]);
  const [stories, setStories] = useState<TravellerStoryItem[]>([]);

  // Raw community section data to preserve other chapters
  const [allChapters, setAllChapters] = useState<CommunityTripChapter[]>([]);
  const [sectionMetadata, setSectionMetadata] = useState<{
    moreMomentsLabel: string;
    inTheirWordsLabel: string;
    inShortLabel: string;
    whatTheyLovedLabel: string;
  }>({
    moreMomentsLabel: "",
    inTheirWordsLabel: "",
    inShortLabel: "",
    whatTheyLovedLabel: "",
  });

  // Load existing community data
  useEffect(() => {
    async function fetchCommunity() {
      try {
        const res = await fetch("/api/community");
        const json = await res.json();
        if (json.success) {
          const section =
            json.data?.CommunityChaptersSection ??
            json.data?.sections?.CommunityChaptersSection ??
            {};
          const existingChapters: CommunityTripChapter[] = Array.isArray(section.chapters)
            ? section.chapters
            : [];
          setAllChapters(existingChapters);
          setSectionMetadata({
            moreMomentsLabel: section.moreMomentsLabel ?? "",
            inTheirWordsLabel: section.inTheirWordsLabel ?? "",
            inShortLabel: section.inShortLabel ?? "",
            whatTheyLovedLabel: section.whatTheyLovedLabel ?? "",
          });

          if (!isNew && initialSlug) {
            const found = existingChapters.find((c) => c.slug === initialSlug);
            if (found) {
              setSlug(found.slug ?? "");
              setDestination(found.destination ?? "");
              setCountry(found.country ?? "");
              setTripType(found.tripType ?? "");
              setTravelledOn(found.travelledOn ?? "");
              setTagline(found.tagline ?? "");
              setJourneySlug(found.journeySlug ?? "");
              setCoverImage(found.coverImage ?? "");
              setMedia(Array.isArray(found.media) ? found.media : []);
              setStories(Array.isArray(found.stories) ? found.stories : []);
            } else {
              toast.error("Destination chapter not found");
              router.push("/static-pages/community");
            }
          } else {
            // New Chapter defaults
            setSlug(`trip-${Date.now().toString(36)}`);
            setStories([newStory()]);
          }
        }
      } catch (err) {
        console.error("Failed to load community data:", err);
        toast.error("Failed to load destination chapter");
      } finally {
        setLoading(false);
      }
    }

    fetchCommunity();
  }, [initialSlug, isNew, router]);

  const handleSave = async () => {
    if (!destination.trim()) {
      toast.error("Please enter a Destination Name");
      setActiveTab("details");
      return;
    }

    const currentSlug = slug.trim() || destination.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const currentChapter: CommunityTripChapter = {
      slug: currentSlug,
      destination: destination.trim(),
      country: country.trim(),
      tripType: tripType.trim(),
      travelledOn: travelledOn.trim(),
      tagline: tagline.trim(),
      journeySlug: journeySlug.trim() || undefined,
      coverImage: coverImage.trim(),
      media,
      stories,
    };

    let updatedChapters: CommunityTripChapter[] = [];
    if (isNew) {
      updatedChapters = [...allChapters, currentChapter];
    } else {
      updatedChapters = allChapters.map((c) => (c.slug === initialSlug ? currentChapter : c));
    }

    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityChaptersSection",
          content: {
            ...sectionMetadata,
            chapters: updatedChapters,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save chapter");
      }

      setSaved(true);
      toast.success(isNew ? "Destination chapter created!" : "Destination chapter updated!");
      setTimeout(() => {
        router.push("/static-pages/community");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save chapter");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#0E5A60]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading chapter details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-6xl mx-auto w-full">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/static-pages/community"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0E5A60] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Community Page
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {isNew ? "Add Destination Chapter" : `Edit: ${destination || "Untitled Chapter"}`}
            </h1>
            {slug && (
              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                /community/{slug}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/static-pages/community"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0E5A60] hover:bg-[#093e42] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "details"
              ? "bg-[#0E5A60] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MapPin className="w-4 h-4" />
          1. Destination & Banner Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stories")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "stories"
              ? "bg-[#0E5A60] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <PenLine className="w-4 h-4" />
          2. Traveller Stories ({stories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "media"
              ? "bg-[#0E5A60] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4" />
          3. Photo & Video Wall ({media.length})
        </button>
      </div>

      {/* Tab 1: Destination Details */}
      {activeTab === "details" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D96C2C]" />
              Destination & Story Page Banner
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Controls the top header banner on /community/{slug || "[slug]"} and the card previews
              on the community index.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Destination Name"
              placeholder="e.g. Udaipur"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              helperText="Main title of this chapter"
            />

            <InputField
              label="Country"
              placeholder="e.g. India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <InputField
              label="Trip Type (Orange Pill Tag)"
              placeholder="e.g. SLOW-PACED ESCAPE or Group Journey"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            />

            <InputField
              label="Travelled On (Date)"
              placeholder="e.g. October 2026"
              value={travelledOn}
              onChange={(e) => setTravelledOn(e.target.value)}
            />

            <InputField
              label="Tagline (Handwritten Cursive Accent)"
              placeholder="e.g. came as strangers, left as family ♡"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />

            <InputField
              label="URL Slug (/community/[slug])"
              placeholder="e.g. udaipur"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Lowercase, hyphenated, no spaces"
            />

            <InputField
              label="Connected Journey Slug (Optional)"
              placeholder="e.g. udaipur"
              value={journeySlug}
              onChange={(e) => setJourneySlug(e.target.value)}
              helperText="Links to /journeys/[slug] if travellers can book this trip. Leave empty to hide button."
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <ImagePickerField
              label="Destination Cover Photo"
              helperText="High-resolution backdrop for the destination banner on /community/[slug] and the card preview."
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              placeholder="Upload or enter cover image URL"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Traveller Stories & Letters */}
      {activeTab === "stories" && (
        <StoriesManager stories={stories} onChange={(newStories) => setStories(newStories)} />
      )}

      {/* Tab 3: Photo & Video Wall */}
      {activeTab === "media" && (
        <MediaManager media={media} onChange={(newMedia) => setMedia(newMedia)} />
      )}

      {/* Bottom Save Changes Bar */}
      <div className="pt-4 border-t border-slate-200">
        <SaveButton
          loading={saving}
          saved={saved}
          onClick={handleSave}
          label="Save Changes"
          className="w-full py-4 text-sm font-bold shadow-sm hover:shadow-md cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab 2: Stories Manager Component                                 */
/* ---------------------------------------------------------------- */

function StoriesManager({
  stories,
  onChange,
}: {
  stories: TravellerStoryItem[];
  onChange: (stories: TravellerStoryItem[]) => void;
}) {
  const [openStoryIndex, setOpenStoryIndex] = useState<number | null>(0);
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null);

  const addStory = () => {
    onChange([...stories, newStory()]);
    setOpenStoryIndex(stories.length);
  };

  const removeStory = (index: number) => {
    onChange(stories.filter((_, i) => i !== index));
    setOpenStoryIndex(null);
    setStoryToDelete(null);
  };

  const updateStory = (index: number, patch: Partial<TravellerStoryItem>) => {
    onChange(stories.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <PenLine className="w-4 h-4 text-[#D96C2C]" />
            Traveller Stories & Review Letters ({stories.length})
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            These reviews are shown as postcard cards on the main community page and display the
            complete letter on this destination page.
          </p>
        </div>
        <button
          type="button"
          onClick={addStory}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#D96C2C] hover:bg-[#b8571e] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Story / Letter
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No traveller stories added yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add Story / Letter&rdquo; to add your first review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story, sIdx) => {
            const isOpen = openStoryIndex === sIdx;
            const authorNames = (story.authors || [])
              .map((a) => a.name)
              .filter(Boolean)
              .join(" & ");
            return (
              <div
                key={story.id || sIdx}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-[#D96C2C]/30 shadow-md bg-white"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Story Accordion Header */}
                <div
                  onClick={() => setOpenStoryIndex(isOpen ? null : sIdx)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-[#FAF3EC] text-[#D96C2C] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h6 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                          {story.title || "Untitled Story"}
                        </h6>
                        {authorNames && (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            By {authorNames}
                          </span>
                        )}
                        {story.travelledAs && (
                          <span className="text-[11px] text-[#0E5A60] bg-[#0E5A60]/10 font-medium px-2 py-0.5 rounded-full">
                            {story.travelledAs}
                          </span>
                        )}
                      </div>
                      {story.pullQuote && (
                        <p className="text-xs text-slate-500 italic mt-0.5 truncate max-w-xl">
                          &ldquo;{story.pullQuote}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setStoryToDelete(sIdx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenStoryIndex(isOpen ? null : sIdx)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Story Form */}
                {isOpen && (
                  <div className="border-t border-slate-100 p-5 sm:p-7 bg-[#FAF8F5]/40 space-y-7">
                    {/* Part 1: Postcard Front */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
                      <div className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-[#D96C2C]" />
                        <h6 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          1. Quote & Traveller Information (Card Front)
                        </h6>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide block">
                          Handwritten Pull Quote
                        </label>
                        <textarea
                          rows={2}
                          value={story.pullQuote}
                          onChange={(e) => updateStory(sIdx, { pullQuote: e.target.value })}
                          placeholder="e.g. Sometimes, it is these little gestures that stay in our hearts the longest."
                          className={textareaClass}
                        />
                        <span className="text-[11px] text-slate-400 block">
                          Displayed prominently in cursive handwriting on the community review card.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                        <InputField
                          label="Travelled As Badge"
                          placeholder="e.g. Solo Traveller, Couple, Friends"
                          value={story.travelledAs}
                          onChange={(e) => updateStory(sIdx, { travelledAs: e.target.value })}
                          helperText="Shown next to author name on the card"
                        />

                        <InputField
                          label="Sign-off Greeting"
                          placeholder="e.g. Much Love & Blessings"
                          value={story.signoff || ""}
                          onChange={(e) => updateStory(sIdx, { signoff: e.target.value })}
                          helperText="Warm sign-off line at the end of the letter"
                        />
                      </div>

                      {/* Authors List */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            Travellers / Reviewers ({(story.authors || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateStory(sIdx, {
                                authors: [...(story.authors || []), { name: "", role: "" }],
                              })
                            }
                            className="text-xs text-[#0E5A60] font-bold hover:underline cursor-pointer"
                          >
                            + Add Author
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(story.authors || []).map((author, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2"
                            >
                              <div className="flex-1 space-y-1.5">
                                <input
                                  type="text"
                                  placeholder="Full Name (e.g. Yogita Girotra)"
                                  value={author.name}
                                  onChange={(e) => {
                                    const next = [...story.authors];
                                    next[aIdx] = { ...next[aIdx], name: e.target.value };
                                    updateStory(sIdx, { authors: next });
                                  }}
                                  className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#0E5A60]"
                                />
                                <input
                                  type="text"
                                  placeholder="Role / City (optional)"
                                  value={author.role || ""}
                                  onChange={(e) => {
                                    const next = [...story.authors];
                                    next[aIdx] = { ...next[aIdx], role: e.target.value };
                                    updateStory(sIdx, { authors: next });
                                  }}
                                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-500 focus:border-[#0E5A60]"
                                />
                              </div>
                              {story.authors.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = story.authors.filter((_, i) => i !== aIdx);
                                    updateStory(sIdx, { authors: next });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white cursor-pointer"
                                  title="Remove Author"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Part 2: Headline & Summary */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                      <h6 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        2. Headline & Short Summary
                      </h6>
                      <InputField
                        label="Story Headline"
                        placeholder="e.g. We went as strangers, but returned as an extended family"
                        value={story.title}
                        onChange={(e) => updateStory(sIdx, { title: e.target.value })}
                      />
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide block">
                          Short Summary (2-3 sentences)
                        </label>
                        <textarea
                          rows={3}
                          value={story.summary}
                          onChange={(e) => updateStory(sIdx, { summary: e.target.value })}
                          placeholder="Brief teaser summary displayed on the card."
                          className={textareaClass}
                        />
                      </div>
                    </div>

                    {/* Part 3: Highlights */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            3. Review Highlights ({(story.highlights || []).length})
                          </h6>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Key trip highlights (leader, stay, transport, planning).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateStory(sIdx, {
                              highlights: [
                                ...(story.highlights || []),
                                { icon: "guide", label: "", detail: "" },
                              ],
                            })
                          }
                          className="text-xs text-[#0E5A60] font-bold hover:underline cursor-pointer"
                        >
                          + Add Highlight
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(story.highlights || []).map((high, hIdx) => (
                          <div
                            key={hIdx}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <select
                                value={high.icon}
                                onChange={(e) => {
                                  const next = [...story.highlights];
                                  next[hIdx] = {
                                    ...next[hIdx],
                                    icon: e.target.value as HighlightIcon,
                                  };
                                  updateStory(sIdx, { highlights: next });
                                }}
                                className="flex-1 text-xs font-bold text-[#0E5A60] bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                              >
                                {HIGHLIGHT_ICON_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.emoji} {opt.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = story.highlights.filter((_, i) => i !== hIdx);
                                  updateStory(sIdx, { highlights: next });
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white cursor-pointer"
                                title="Remove Highlight"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Title (e.g. Captain Abhay Negi)"
                              value={high.label}
                              onChange={(e) => {
                                const next = [...story.highlights];
                                next[hIdx] = { ...next[hIdx], label: e.target.value };
                                updateStory(sIdx, { highlights: next });
                              }}
                              className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#0E5A60]"
                            />
                            <input
                              type="text"
                              placeholder="Detail (e.g. Travel, stay & meals made smooth)"
                              value={high.detail}
                              onChange={(e) => {
                                const next = [...story.highlights];
                                next[hIdx] = { ...next[hIdx], detail: e.target.value };
                                updateStory(sIdx, { highlights: next });
                              }}
                              className="w-full text-xs text-slate-500 px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#0E5A60]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 4: Full Letter Content */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          4. Full Letter Text
                        </h6>
                        <span className="text-xs font-medium text-slate-400">
                          {(story.paragraphs || []).length} Paragraphs
                        </span>
                      </div>
                      <textarea
                        rows={8}
                        value={(story.paragraphs || []).join("\n\n")}
                        onChange={(e) => {
                          const paras = e.target.value
                            .split(/\n\s*\n/)
                            .map((p) => p.trim())
                            .filter(Boolean);
                          updateStory(sIdx, { paragraphs: paras });
                        }}
                        placeholder="Paste the traveller's full review letter. Press Enter twice to create a new paragraph."
                        className={textareaClass}
                      />
                      <p className="text-[11px] text-slate-400">
                        Leave an empty line between paragraphs. To highlight text with an amber
                        marker, wrap it like:{" "}
                        <code className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-mono">
                          ==this highlight==
                        </code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Story Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={storyToDelete !== null}
        title="Delete Traveller Story"
        itemName={
          storyToDelete !== null
            ? stories[storyToDelete]?.title || `Story ${storyToDelete + 1}`
            : undefined
        }
        message="Are you sure you want to delete this traveller review story? Click Save Changes afterwards to publish."
        confirmLabel="Delete Story"
        onConfirm={() => {
          if (storyToDelete !== null) removeStory(storyToDelete);
        }}
        onClose={() => setStoryToDelete(null)}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab 3: Media Wall Manager Component                              */
/* ---------------------------------------------------------------- */

function MediaManager({
  media,
  onChange,
}: {
  media: CommunityMediaItem[];
  onChange: (media: CommunityMediaItem[]) => void;
}) {
  const addMedia = () => {
    onChange([...media, { type: "image", src: "", alt: "", caption: "" }]);
  };

  const removeMedia = (index: number) => {
    onChange(media.filter((_, i) => i !== index));
  };

  const updateMedia = (index: number, patch: Partial<CommunityMediaItem>) => {
    onChange(media.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#D96C2C]" />
            Scrapbook Moments & Gallery ({media.length})
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Polaroid photo and video scrapbook on the destination page. The first {WALL_TILE_LIMIT}{" "}
            appear on the page, and extra ones open in the lightbox.
          </p>
        </div>
        <button
          type="button"
          onClick={addMedia}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0E5A60] hover:bg-[#093e42] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Photo / Video
        </button>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No media uploaded yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add Photo / Video&rdquo; to build your photo scrapbook.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {media.map((item, mIdx) => {
            const isVideo = item.type === "video";
            const isTileOnPage = mIdx < WALL_TILE_LIMIT;
            return (
              <div
                key={mIdx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                {/* Media Card Header */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">#{mIdx + 1}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isTileOnPage
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isTileOnPage ? "Wall Tile" : `+${media.length - WALL_TILE_LIMIT} Lightbox`}
                    </span>
                  </div>

                  {/* Type Selector: Image vs Video */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateMedia(mIdx, { type: "image" })}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        !isVideo ? "bg-[#0E5A60] text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMedia(mIdx, { type: "video" })}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        isVideo ? "bg-[#0E5A60] text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Video
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMedia(mIdx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                    title="Remove Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Media Inputs */}
                <div className="p-4 space-y-4">
                  {isVideo ? (
                    <>
                      <ImagePickerField
                        label="Video Poster / Thumbnail"
                        value={item.poster || ""}
                        onChange={(url) => updateMedia(mIdx, { poster: url })}
                        placeholder="Thumbnail image URL"
                      />
                      <InputField
                        label="Video URL (.mp4)"
                        placeholder="https://...mp4"
                        value={item.src}
                        onChange={(e) => updateMedia(mIdx, { src: e.target.value })}
                      />
                    </>
                  ) : (
                    <ImagePickerField
                      label="Photo URL / Upload"
                      value={item.src}
                      onChange={(url) => updateMedia(mIdx, { src: url })}
                      placeholder="Photo image URL"
                    />
                  )}

                  <InputField
                    label="Caption (Displayed on Polaroid)"
                    placeholder="e.g. Golden hour at Lake Pichola"
                    value={item.caption || ""}
                    onChange={(e) => updateMedia(mIdx, { caption: e.target.value })}
                  />

                  <InputField
                    label="Alt Description (For SEO & Accessibility)"
                    placeholder="e.g. Group smiling by the lake"
                    value={item.alt}
                    onChange={(e) => updateMedia(mIdx, { alt: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
