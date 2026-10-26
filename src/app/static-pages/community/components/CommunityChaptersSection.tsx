"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  Sparkles,
  MapPin,
  Calendar,
  Quote,
  Users,
  Compass,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

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

export function CommunityChaptersSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [chapters, setChapters] = useState<CommunityTripChapter[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(0);

  useEffect(() => {
    if (initialData?.chapters && Array.isArray(initialData.chapters)) {
      setChapters(initialData.chapters);
    } else {
      setChapters([]);
    }
  }, [initialData]);

  // Add Chapter
  const addChapter = () => {
    const newChapter: CommunityTripChapter = {
      slug: `trip-${Date.now().toString(36)}`,
      destination: "",
      country: "",
      tripType: "Group Journey",
      travelledOn: "",
      tagline: "",
      journeySlug: "",
      coverImage: "",
      media: [],
      stories: [
        {
          id: `story-${Date.now().toString(36)}`,
          title: "",
          pullQuote: "",
          travelledAs: "",
          summary: "",
          highlights: [
            { icon: "guide", label: "", detail: "" },
            { icon: "hotel", label: "", detail: "" },
          ],
          paragraphs: [""],
          signoff: "",
          authors: [{ name: "", role: "" }],
        },
      ],
    };
    setChapters((prev) => [...prev, newChapter]);
    setActiveChapterIndex(chapters.length);
  };

  const removeChapter = (index: number) => {
    if (confirm("Are you sure you want to delete this trip chapter?")) {
      setChapters((prev) => prev.filter((_, i) => i !== index));
      setActiveChapterIndex(null);
    }
  };

  const updateChapter = (index: number, field: keyof CommunityTripChapter, val: any) => {
    setChapters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Media wall helpers
  const addMediaItem = (chapterIndex: number) => {
    setChapters((prev) => {
      const copy = [...prev];
      const curMedia = copy[chapterIndex].media || [];
      copy[chapterIndex] = {
        ...copy[chapterIndex],
        media: [
          ...curMedia,
          {
            type: "image",
            src: "",
            alt: "",
            caption: "",
          },
        ],
      };
      return copy;
    });
  };

  const updateMediaItem = (
    chapterIndex: number,
    mediaIndex: number,
    field: keyof CommunityMediaItem,
    val: any,
  ) => {
    setChapters((prev) => {
      const copy = [...prev];
      const curMedia = [...(copy[chapterIndex].media || [])];
      curMedia[mediaIndex] = { ...curMedia[mediaIndex], [field]: val };
      copy[chapterIndex] = { ...copy[chapterIndex], media: curMedia };
      return copy;
    });
  };

  const removeMediaItem = (chapterIndex: number, mediaIndex: number) => {
    setChapters((prev) => {
      const copy = [...prev];
      const curMedia = copy[chapterIndex].media.filter((_, i) => i !== mediaIndex);
      copy[chapterIndex] = { ...copy[chapterIndex], media: curMedia };
      return copy;
    });
  };

  // Story helpers
  const addStory = (chapterIndex: number) => {
    setChapters((prev) => {
      const copy = [...prev];
      const curStories = copy[chapterIndex].stories || [];
      copy[chapterIndex] = {
        ...copy[chapterIndex],
        stories: [
          ...curStories,
          {
            id: `story-${Date.now().toString(36)}`,
            title: "",
            pullQuote: "",
            travelledAs: "",
            summary: "",
            highlights: [{ icon: "guide", label: "", detail: "" }],
            paragraphs: [""],
            signoff: "",
            authors: [{ name: "", role: "" }],
          },
        ],
      };
      return copy;
    });
  };

  const updateStory = (
    chapterIndex: number,
    storyIndex: number,
    field: keyof TravellerStoryItem,
    val: any,
  ) => {
    setChapters((prev) => {
      const copy = [...prev];
      const curStories = [...(copy[chapterIndex].stories || [])];
      curStories[storyIndex] = { ...curStories[storyIndex], [field]: val };
      copy[chapterIndex] = { ...copy[chapterIndex], stories: curStories };
      return copy;
    });
  };

  const removeStory = (chapterIndex: number, storyIndex: number) => {
    if (confirm("Remove this traveller story?")) {
      setChapters((prev) => {
        const copy = [...prev];
        const curStories = copy[chapterIndex].stories.filter((_, i) => i !== storyIndex);
        copy[chapterIndex] = { ...copy[chapterIndex], stories: curStories };
        return copy;
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityChaptersSection",
          content: { chapters },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save Community Chapters");
      }

      setSaved(true);
      toast.success("Trip chapters & traveller stories saved!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
      <SectionHeader
        title="2. Trip Chapters & Traveller Stories"
        description="Scrapbook of past journeys: destination cards, photo/video polaroid walls, and full heartfelt traveller review letters."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge={`${chapters.length} Chapters`}
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chapters List ({chapters.length})
            </span>
            <button
              onClick={addChapter}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E5A60] hover:bg-[#0B2A3D] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Trip Chapter
            </button>
          </div>

          {/* Chapters Accordion */}
          <div className="space-y-4">
            {chapters.map((chapter, cIdx) => {
              const isChapterOpen = activeChapterIndex === cIdx;
              const photoCount = (chapter.media || []).filter((m) => m.type === "image").length;
              const storyCount = (chapter.stories || []).length;

              return (
                <div
                  key={cIdx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-all"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() => setActiveChapterIndex(isChapterOpen ? null : cIdx)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-[#0E5A60]/10 text-[#0E5A60] font-bold text-xs flex items-center justify-center shrink-0">
                        {String(cIdx + 1).padStart(2, "0")}
                      </span>
                      {chapter.coverImage && (
                        <img
                          src={chapter.coverImage}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-slate-800 text-sm truncate">
                          {chapter.destination || `Chapter #${cIdx + 1} (Untitled)`}
                          {chapter.country && (
                            <span className="text-slate-400 font-sans font-normal text-xs ml-1.5">
                              · {chapter.country}
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{chapter.travelledOn || "Travel Date"}</span>
                          <span>·</span>
                          <span>{photoCount} media</span>
                          <span>·</span>
                          <span>{storyCount} stories</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => removeChapter(cIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveChapterIndex(isChapterOpen ? null : cIdx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      >
                        {isChapterOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Chapter Body */}
                  {isChapterOpen && (
                    <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-col gap-6">
                      {/* Trip Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <InputField
                          label="Destination Name"
                          placeholder="e.g. Udaipur"
                          value={chapter.destination}
                          onChange={(e) => updateChapter(cIdx, "destination", e.target.value)}
                        />
                        <InputField
                          label="Country"
                          placeholder="e.g. India"
                          value={chapter.country}
                          onChange={(e) => updateChapter(cIdx, "country", e.target.value)}
                        />
                        <InputField
                          label="Trip Type"
                          placeholder="e.g. Group Journey"
                          value={chapter.tripType}
                          onChange={(e) => updateChapter(cIdx, "tripType", e.target.value)}
                        />
                        <InputField
                          label="Travelled On"
                          placeholder="e.g. October 2026"
                          value={chapter.travelledOn}
                          onChange={(e) => updateChapter(cIdx, "travelledOn", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="Handwritten Tagline (beside gallery)"
                          placeholder="e.g. came as strangers, left as family ♡"
                          value={chapter.tagline}
                          onChange={(e) => updateChapter(cIdx, "tagline", e.target.value)}
                        />
                        <InputField
                          label="Journey Link Slug (Optional)"
                          placeholder="e.g. udaipur (links to /journeys/udaipur)"
                          value={chapter.journeySlug || ""}
                          onChange={(e) => updateChapter(cIdx, "journeySlug", e.target.value)}
                        />
                        <InputField
                          label="Chapter Slug"
                          placeholder="e.g. udaipur"
                          value={chapter.slug}
                          onChange={(e) => updateChapter(cIdx, "slug", e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <ImagePickerField
                          label="Cover Image (Quote Panel Background)"
                          value={chapter.coverImage}
                          onChange={(url) => updateChapter(cIdx, "coverImage", url)}
                          placeholder="Backdrop photo for traveller quotes"
                        />
                      </div>

                      {/* ================= MEDIA WALL ================= */}
                      <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#0E5A60]" />
                            <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                              Media Wall Photos & Videos ({chapter.media?.length || 0})
                            </h5>
                          </div>
                          <button
                            onClick={() => addMediaItem(cIdx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:border-[#0E5A60] text-slate-700 hover:text-[#0E5A60] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Photo / Video
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(chapter.media || []).map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  #{mIdx + 1} · {m.type}
                                </span>
                                <button
                                  onClick={() => removeMediaItem(cIdx, mIdx)}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                                  title="Remove Media"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <ImagePickerField
                                label=""
                                value={m.src}
                                onChange={(url) => updateMediaItem(cIdx, mIdx, "src", url)}
                                placeholder="Media URL or upload"
                              />

                              <InputField
                                label="Handwritten Polaroid Caption"
                                placeholder="e.g. Golden hour at Lake Pichola"
                                value={m.caption || ""}
                                onChange={(e) =>
                                  updateMediaItem(cIdx, mIdx, "caption", e.target.value)
                                }
                              />

                              <InputField
                                label="Alt description"
                                placeholder="e.g. City Palace lit up"
                                value={m.alt}
                                onChange={(e) => updateMediaItem(cIdx, mIdx, "alt", e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ================= TRAVELLER STORIES ================= */}
                      <div className="p-4 sm:p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Quote className="w-4 h-4 text-[#D96C2C]" />
                            <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                              Traveller Stories & Letters ({chapter.stories?.length || 0})
                            </h5>
                          </div>
                          <button
                            onClick={() => addStory(cIdx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#D96C2C] hover:bg-[#C85A24] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Traveller Story
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(chapter.stories || []).map((story, sIdx) => {
                            const isStoryOpen = activeStoryIndex === sIdx;
                            return (
                              <div
                                key={sIdx}
                                className="bg-white rounded-xl border border-amber-900/10 p-4 flex flex-col gap-4"
                              >
                                <div
                                  onClick={() => setActiveStoryIndex(isStoryOpen ? null : sIdx)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="font-serif text-xs font-bold text-[#D96C2C] bg-[#FDF0EC] px-2 py-0.5 rounded-md">
                                      Letter #{sIdx + 1}
                                    </span>
                                    <h6 className="font-serif font-bold text-slate-800 text-sm">
                                      {story.title || "Untitled Traveller Letter"}
                                    </h6>
                                    {story.travelledAs && (
                                      <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
                                        {story.travelledAs}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeStory(cIdx, sIdx);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {isStoryOpen ? (
                                      <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                </div>

                                {isStoryOpen && (
                                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <InputField
                                        label="Story Headline"
                                        placeholder="e.g. We went as strangers, but returned as an extended family"
                                        value={story.title}
                                        onChange={(e) =>
                                          updateStory(cIdx, sIdx, "title", e.target.value)
                                        }
                                      />
                                      <InputField
                                        label="Travelled As"
                                        placeholder="e.g. Couple, Mom & two daughters, Old friends"
                                        value={story.travelledAs}
                                        onChange={(e) =>
                                          updateStory(cIdx, sIdx, "travelledAs", e.target.value)
                                        }
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-xs font-semibold text-slate-700">
                                        Big Handwritten Pull Quote (Cover overlay)
                                      </span>
                                      <textarea
                                        value={story.pullQuote}
                                        onChange={(e) =>
                                          updateStory(cIdx, sIdx, "pullQuote", e.target.value)
                                        }
                                        placeholder="e.g. Sometimes, it is these little gestures that stay in our hearts the longest."
                                        rows={2}
                                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-xs font-semibold text-slate-700">
                                        "In Short" Summary (Italic block before letter)
                                      </span>
                                      <textarea
                                        value={story.summary}
                                        onChange={(e) =>
                                          updateStory(cIdx, sIdx, "summary", e.target.value)
                                        }
                                        placeholder="e.g. We went with a group of strangers, but returned with wonderful memories..."
                                        rows={2}
                                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
                                      />
                                    </div>

                                    {/* Authors list */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-700">
                                          Traveller Authors ({story.authors?.length || 0})
                                        </span>
                                        <button
                                          onClick={() => {
                                            const curAuthors = story.authors || [];
                                            updateStory(cIdx, sIdx, "authors", [
                                              ...curAuthors,
                                              { name: "", role: "" },
                                            ]);
                                          }}
                                          className="text-[11px] text-[#0E5A60] font-bold hover:underline cursor-pointer"
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
                                            <div className="flex-1 space-y-2">
                                              <input
                                                type="text"
                                                placeholder="Author Name (e.g. Yogita Girotra)"
                                                value={author.name}
                                                onChange={(e) => {
                                                  const copy = [...story.authors];
                                                  copy[aIdx] = {
                                                    ...copy[aIdx],
                                                    name: e.target.value,
                                                  };
                                                  updateStory(cIdx, sIdx, "authors", copy);
                                                }}
                                                className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                                              />
                                              <input
                                                type="text"
                                                placeholder="Role / Profession (Optional)"
                                                value={author.role || ""}
                                                onChange={(e) => {
                                                  const copy = [...story.authors];
                                                  copy[aIdx] = {
                                                    ...copy[aIdx],
                                                    role: e.target.value,
                                                  };
                                                  updateStory(cIdx, sIdx, "authors", copy);
                                                }}
                                                className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-500"
                                              />
                                            </div>
                                            {story.authors.length > 1 && (
                                              <button
                                                onClick={() => {
                                                  const copy = story.authors.filter(
                                                    (_, i) => i !== aIdx,
                                                  );
                                                  updateStory(cIdx, sIdx, "authors", copy);
                                                }}
                                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* What They Loved Highlights */}
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-700">
                                          "What They Loved" Highlights (
                                          {story.highlights?.length || 0})
                                        </span>
                                        <button
                                          onClick={() => {
                                            const curHigh = story.highlights || [];
                                            updateStory(cIdx, sIdx, "highlights", [
                                              ...curHigh,
                                              { icon: "guide", label: "", detail: "" },
                                            ]);
                                          }}
                                          className="text-[11px] text-[#0E5A60] font-bold hover:underline cursor-pointer"
                                        >
                                          + Add Highlight
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(story.highlights || []).map((high, hIdx) => (
                                          <div
                                            key={hIdx}
                                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2 relative"
                                          >
                                            <div className="flex items-center justify-between">
                                              <select
                                                value={high.icon}
                                                onChange={(e) => {
                                                  const copy = [...story.highlights];
                                                  copy[hIdx] = {
                                                    ...copy[hIdx],
                                                    icon: e.target.value as HighlightIcon,
                                                  };
                                                  updateStory(cIdx, sIdx, "highlights", copy);
                                                }}
                                                className="text-xs font-bold text-[#0E5A60] bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                                              >
                                                {HIGHLIGHT_ICON_OPTIONS.map((opt) => (
                                                  <option key={opt.id} value={opt.id}>
                                                    {opt.emoji} {opt.label}
                                                  </option>
                                                ))}
                                              </select>
                                              <button
                                                onClick={() => {
                                                  const copy = story.highlights.filter(
                                                    (_, i) => i !== hIdx,
                                                  );
                                                  updateStory(cIdx, sIdx, "highlights", copy);
                                                }}
                                                className="text-slate-400 hover:text-red-500 cursor-pointer"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              placeholder="Highlight title (e.g. Captain Abhay Negi)"
                                              value={high.label}
                                              onChange={(e) => {
                                                const copy = [...story.highlights];
                                                copy[hIdx] = {
                                                  ...copy[hIdx],
                                                  label: e.target.value,
                                                };
                                                updateStory(cIdx, sIdx, "highlights", copy);
                                              }}
                                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                                            />
                                            <input
                                              type="text"
                                              placeholder="Detail (e.g. Travel, stay & meals made smooth)"
                                              value={high.detail}
                                              onChange={(e) => {
                                                const copy = [...story.highlights];
                                                copy[hIdx] = {
                                                  ...copy[hIdx],
                                                  detail: e.target.value,
                                                };
                                                updateStory(cIdx, sIdx, "highlights", copy);
                                              }}
                                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-500"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Full Letter Paragraphs */}
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-700">
                                          Full Review Letter (Paragraph by paragraph)
                                        </span>
                                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">
                                          Tip: wrap words in ==phrase== for marker highlight!
                                        </span>
                                      </div>
                                      <textarea
                                        value={(story.paragraphs || []).join("\n\n")}
                                        onChange={(e) => {
                                          const pars = e.target.value
                                            .split(/\n\n+/)
                                            .map((p) => p.trim())
                                            .filter(Boolean);
                                          updateStory(cIdx, sIdx, "paragraphs", pars);
                                        }}
                                        placeholder="Paste review letter here. Separate paragraphs with double enter (blank line)..."
                                        rows={6}
                                        className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800 leading-relaxed font-sans"
                                      />
                                    </div>

                                    <InputField
                                      label="Letter Signoff / Blessing"
                                      placeholder="e.g. Much Love & Blessings"
                                      value={story.signoff || ""}
                                      onChange={(e) =>
                                        updateStory(cIdx, sIdx, "signoff", e.target.value)
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
      )}
    </article>
  );
}
