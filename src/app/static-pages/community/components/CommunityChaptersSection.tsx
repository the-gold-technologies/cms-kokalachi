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
  Quote,
  Users,
  Mail,
  Settings2,
  Tags,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
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

// The website's photo wall shows this many tiles; the rest open from a "+N more moments" tile
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

const textareaClass =
  "w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D8232A] focus:ring-1 focus:ring-[#D8232A] transition-all text-gray-800 leading-relaxed";
const smallInputClass =
  "w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#D8232A] focus:ring-1 focus:ring-[#D8232A]";

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

export function CommunityChaptersSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [chapters, setChapters] = useState<CommunityTripChapter[]>([]);
  const [moreMomentsLabel, setMoreMomentsLabel] = useState("");
  const [inTheirWordsLabel, setInTheirWordsLabel] = useState("");
  const [inShortLabel, setInShortLabel] = useState("");
  const [whatTheyLovedLabel, setWhatTheyLovedLabel] = useState("");
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

  useEffect(() => {
    setChapters(Array.isArray(initialData?.chapters) ? initialData.chapters : []);
    setMoreMomentsLabel(initialData?.moreMomentsLabel ?? "");
    setInTheirWordsLabel(initialData?.inTheirWordsLabel ?? "");
    setInShortLabel(initialData?.inShortLabel ?? "");
    setWhatTheyLovedLabel(initialData?.whatTheyLovedLabel ?? "");
  }, [initialData]);

  const addChapter = () => {
    const newChapter: CommunityTripChapter = {
      slug: `trip-${Date.now().toString(36)}`,
      destination: "",
      country: "",
      tripType: "",
      travelledOn: "",
      tagline: "",
      journeySlug: "",
      coverImage: "",
      media: [],
      stories: [newStory()],
    };
    setChapters((prev) => [...prev, newChapter]);
    setActiveChapterIndex(chapters.length);
  };

  const confirmRemoveChapter = () => {
    if (chapterToDelete === null) return;
    setChapters((prev) => prev.filter((_, i) => i !== chapterToDelete));
    setActiveChapterIndex(null);
    setChapterToDelete(null);
  };

  const updateChapter = (index: number, patch: Partial<CommunityTripChapter>) => {
    setChapters((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
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
          content: {
            moreMomentsLabel,
            inTheirWordsLabel,
            inShortLabel,
            whatTheyLovedLabel,
            chapters,
          },
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
        description="One chapter per trip. Each chapter appears on the website in this order: heading → photo & video wall → traveller letters."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge={`${chapters.length} Chapters`}
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Trips ({chapters.length})
            </span>
            <button
              onClick={addChapter}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E5A60] hover:bg-[#0B2A3D] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Trip Chapter
            </button>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, cIdx) => {
              const isChapterOpen = activeChapterIndex === cIdx;
              return (
                <div
                  key={cIdx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <ChapterRow
                    chapter={chapter}
                    number={cIdx + 1}
                    isOpen={isChapterOpen}
                    onToggle={() => setActiveChapterIndex(isChapterOpen ? null : cIdx)}
                    onDelete={() => setChapterToDelete(cIdx)}
                  />
                  {isChapterOpen && (
                    <ChapterEditor
                      chapter={chapter}
                      number={cIdx + 1}
                      onChange={(patch) => updateChapter(cIdx, patch)}
                      moreMomentsLabel={moreMomentsLabel}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Labels shared by every chapter */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-800">
                Small labels used in every chapter
              </span>
            </div>
            <p className="text-xs text-slate-500 -mt-2">
              These short headings repeat on every trip. Change them once here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Above the letters"
                helperText="Shown once above the traveller letters, e.g. 'In their words'"
                value={inTheirWordsLabel}
                onChange={(e) => setInTheirWordsLabel(e.target.value)}
                placeholder="In their words"
              />
              <InputField
                label="Summary box heading"
                helperText="Heading of the short summary box inside each letter"
                value={inShortLabel}
                onChange={(e) => setInShortLabel(e.target.value)}
                placeholder="In short"
              />
              <InputField
                label="Highlights heading"
                helperText="Heading above the highlight cards inside each letter"
                value={whatTheyLovedLabel}
                onChange={(e) => setWhatTheyLovedLabel(e.target.value)}
                placeholder="What they loved"
              />
              <InputField
                label="'+ more' tile text"
                helperText={`Shown on the last photo tile when a trip has more than ${WALL_TILE_LIMIT} photos/videos`}
                value={moreMomentsLabel}
                onChange={(e) => setMoreMomentsLabel(e.target.value)}
                placeholder="more moments"
              />
            </div>
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

      <DeleteConfirmModal
        isOpen={chapterToDelete !== null}
        title="Delete Trip Chapter"
        itemName={
          chapterToDelete !== null
            ? chapters[chapterToDelete]?.destination || `Chapter ${chapterToDelete + 1}`
            : undefined
        }
        message="This removes the trip with all its photos, videos and traveller letters. Click Save Changes afterwards to apply it to the website."
        confirmLabel="Delete Chapter"
        onConfirm={confirmRemoveChapter}
        onClose={() => setChapterToDelete(null)}
      />
    </article>
  );
}

/* ---------------------------------------------------------------- */
/* Collapsed chapter row                                             */
/* ---------------------------------------------------------------- */

function ChapterRow({
  chapter,
  number,
  isOpen,
  onToggle,
  onDelete,
}: {
  chapter: CommunityTripChapter;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const media = chapter.media || [];
  const thumb = media[0]?.type === "video" ? media[0]?.poster : media[0]?.src;
  return (
    <div
      onClick={onToggle}
      className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-serif text-2xl text-[#D96C2C]/40 leading-none w-8 shrink-0">
          {String(number).padStart(2, "0")}
        </span>
        {thumb && (
          <img
            src={thumb}
            alt=""
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
          />
        )}
        <div className="min-w-0">
          {chapter.tripType && (
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C85A24]">
              {chapter.tripType}
            </p>
          )}
          <h4 className="font-serif font-bold text-slate-800 text-base truncate">
            {chapter.destination || "Untitled trip"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {[
              chapter.travelledOn,
              `${media.length} photos/videos`,
              `${(chapter.stories || []).length} letters`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Expanded chapter: same order as the website                       */
/* ---------------------------------------------------------------- */

function StepHeading({
  step,
  title,
  hint,
  action,
}: {
  step: number;
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-[#0E5A60] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {step}
        </span>
        <div>
          <h5 className="font-bold text-slate-800 text-sm sm:text-base">{title}</h5>
          <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function ChapterEditor({
  chapter,
  number: _number,
  onChange,
  moreMomentsLabel,
}: {
  chapter: CommunityTripChapter;
  number: number;
  onChange: (patch: Partial<CommunityTripChapter>) => void;
  moreMomentsLabel: string;
}) {
  const [openStory, setOpenStory] = useState<number | null>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<number | null>(null);
  const media = chapter.media || [];
  const stories = chapter.stories || [];

  const setMedia = (next: CommunityMediaItem[]) => onChange({ media: next });
  const setStories = (next: TravellerStoryItem[]) => onChange({ stories: next });

  return (
    <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-col gap-8">
      {/* ================= 1. HEADING ================= */}
      <section className="flex flex-col gap-5">
        <StepHeading
          step={1}
          title="Trip heading"
          hint="The top of the chapter: destination, date, trip type, and tagline."
        />

        {/* Fields in the same order they appear above */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            <InputField
              label="Trip type (small orange line)"
              placeholder="e.g. Group Journey"
              value={chapter.tripType}
              onChange={(e) => onChange({ tripType: e.target.value })}
            />
            <InputField
              label="Destination (big title)"
              placeholder="e.g. Udaipur"
              value={chapter.destination}
              onChange={(e) => onChange({ destination: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Country"
                placeholder="e.g. India"
                value={chapter.country}
                onChange={(e) => onChange({ country: e.target.value })}
              />
              <InputField
                label="Travelled on"
                placeholder="e.g. October 2026"
                value={chapter.travelledOn}
                onChange={(e) => onChange({ travelledOn: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <InputField
              label="Tagline (right side)"
              placeholder="e.g. came as strangers, left as family ♡"
              value={chapter.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
            />
            <InputField
              label="Journey button (optional)"
              helperText="Enter the journey's slug to show a 'See the … journey' button linking to /journeys/<slug>. Leave empty to hide the button."
              placeholder="e.g. udaipur"
              value={chapter.journeySlug || ""}
              onChange={(e) => onChange({ journeySlug: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* ================= 2. PHOTO & VIDEO WALL ================= */}
      <section className="flex flex-col gap-4 pt-6 border-t border-slate-100">
        <StepHeading
          step={2}
          title={`Photo & video wall (${media.length})`}
          hint={`Polaroid-style tiles under the heading. The first ${WALL_TILE_LIMIT} show on the page${
            moreMomentsLabel ? `; extra ones open from a "+N ${moreMomentsLabel}" tile` : ""
          }.`}
          action={
            <button
              onClick={() => setMedia([...media, { type: "image", src: "", alt: "", caption: "" }])}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:border-[#0E5A60] text-slate-700 hover:text-[#0E5A60] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add photo / video
            </button>
          }
        />

        {media.length === 0 ? (
          <p className="text-xs text-slate-400 italic px-1">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((m, mIdx) => (
              <MediaTile
                key={mIdx}
                item={m}
                index={mIdx}
                hidden={mIdx >= WALL_TILE_LIMIT}
                onChange={(patch) =>
                  setMedia(media.map((x, i) => (i === mIdx ? { ...x, ...patch } : x)))
                }
                onRemove={() => setMedia(media.filter((_, i) => i !== mIdx))}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= 3. TRAVELLER LETTERS ================= */}
      <section className="flex flex-col gap-4 pt-6 border-t border-slate-100">
        <StepHeading
          step={3}
          title={`Traveller letters (${stories.length})`}
          hint="Each letter is a card: a photo panel with the quote and names on one side, the letter on the other."
          action={
            <button
              onClick={() => {
                setStories([...stories, newStory()]);
                setOpenStory(stories.length);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#D96C2C] hover:bg-[#C85A24] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add letter
            </button>
          }
        />

        <div className="max-w-md">
          <ImagePickerField
            label="Photo behind the quote panel"
            helperText="One photo for this trip, used as the background of every letter's quote panel."
            value={chapter.coverImage}
            onChange={(url) => onChange({ coverImage: url })}
            placeholder="Backdrop photo for traveller quotes"
          />
        </div>

        <div className="space-y-4">
          {stories.map((story, sIdx) => (
            <StoryEditor
              key={story.id + sIdx}
              story={story}
              index={sIdx}
              coverImage={chapter.coverImage}
              isOpen={openStory === sIdx}
              onToggle={() => setOpenStory(openStory === sIdx ? null : sIdx)}
              onChange={(patch) =>
                setStories(stories.map((s, i) => (i === sIdx ? { ...s, ...patch } : s)))
              }
              onRemove={() => setLetterToDelete(sIdx)}
            />
          ))}
        </div>
      </section>

      {/* ================= ADVANCED ================= */}
      <section className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          Advanced
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
        {showAdvanced && (
          <div className="mt-3 max-w-md">
            <InputField
              label="Page anchor"
              helperText="Used for links that jump straight to this trip, e.g. /community#udaipur. Lowercase, no spaces."
              placeholder="e.g. udaipur"
              value={chapter.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
            />
          </div>
        )}
      </section>

      <DeleteConfirmModal
        isOpen={letterToDelete !== null}
        title="Delete Traveller Letter"
        itemName={
          letterToDelete !== null
            ? stories[letterToDelete]?.title || `Letter ${letterToDelete + 1}`
            : undefined
        }
        message="This removes the letter, its quote, travellers and highlights from this trip. Click Save Changes afterwards to apply it to the website."
        confirmLabel="Delete Letter"
        onConfirm={() => {
          if (letterToDelete === null) return;
          setStories(stories.filter((_, i) => i !== letterToDelete));
          setOpenStory(null);
          setLetterToDelete(null);
        }}
        onClose={() => setLetterToDelete(null)}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Photo / video tile                                                */
/* ---------------------------------------------------------------- */

function MediaTile({
  item,
  index,
  hidden,
  onChange,
  onRemove,
}: {
  item: CommunityMediaItem;
  index: number;
  hidden: boolean;
  onChange: (patch: Partial<CommunityMediaItem>) => void;
  onRemove: () => void;
}) {
  const isVideo = item.type === "video";
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">#{index + 1}</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {(["image", "video"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ type: t })}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                  item.type === t ? "bg-white shadow-sm text-[#0E5A60]" : "text-slate-400"
                }`}
              >
                {t === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                {t === "image" ? "Photo" : "Video"}
              </button>
            ))}
          </div>
          {hidden && (
            <span className="text-[10px] text-slate-400" title="Opens from the '+ more' tile">
              in viewer only
            </span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isVideo ? (
        <>
          <ImagePickerField
            label="Thumbnail photo"
            value={item.poster || ""}
            onChange={(url) => onChange({ poster: url })}
            placeholder="Shown on the wall with a play button"
          />
          <InputField
            label="Video link"
            placeholder="https://…mp4"
            value={item.src}
            onChange={(e) => onChange({ src: e.target.value })}
          />
        </>
      ) : (
        <ImagePickerField
          label="Photo"
          value={item.src}
          onChange={(url) => onChange({ src: url })}
          placeholder="Media URL or upload"
        />
      )}

      <InputField
        label="Caption (under the photo)"
        placeholder="e.g. Golden hour at Lake Pichola"
        value={item.caption || ""}
        onChange={(e) => onChange({ caption: e.target.value })}
      />
      <InputField
        label="Image description"
        helperText="Not shown on the page. Read by screen readers and search engines."
        placeholder="e.g. City Palace lit up at night"
        value={item.alt}
        onChange={(e) => onChange({ alt: e.target.value })}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Traveller letter: two panels, like the website card               */
/* ---------------------------------------------------------------- */

function StoryEditor({
  story,
  index,
  coverImage,
  isOpen,
  onToggle,
  onChange,
  onRemove,
}: {
  story: TravellerStoryItem;
  index: number;
  coverImage: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<TravellerStoryItem>) => void;
  onRemove: () => void;
}) {
  const authors = story.authors || [];
  const highlights = story.highlights || [];
  const names = authors
    .map((a) => a.name)
    .filter(Boolean)
    .join(" & ");

  return (
    <div className="bg-white rounded-2xl border border-amber-900/15 overflow-hidden">
      <div
        onClick={onToggle}
        className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/40"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Mail className="w-4 h-4 text-[#D96C2C] shrink-0" />
          <span className="text-xs font-bold text-[#D96C2C] shrink-0">Letter {index + 1}</span>
          <span className="font-serif font-semibold text-slate-800 text-sm truncate">
            {story.title || "Untitled letter"}
          </span>
          {names && (
            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">— {names}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
            title="Remove letter"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col border-t border-amber-900/10">
          {/* ---------- Photo panel ---------- */}
          <div className="p-5 bg-[#0B2A3D]/[0.03] border-b border-amber-900/10 flex flex-col gap-4">
            <PanelLabel title="Photo panel" hint="Shown over the trip photo" />
            {coverImage ? (
              <img
                src={coverImage}
                alt=""
                className="w-full h-24 object-cover rounded-xl opacity-80"
              />
            ) : (
              <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                Add the &ldquo;Photo behind the quote panel&rdquo; above.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <FieldLabel icon={<Quote className="w-3 h-3" />}>Big quote</FieldLabel>
              <textarea
                value={story.pullQuote}
                onChange={(e) => onChange({ pullQuote: e.target.value })}
                placeholder="e.g. Sometimes, it is these little gestures that stay in our hearts the longest."
                rows={3}
                className={textareaClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel icon={<Users className="w-3 h-3" />}>
                  Travellers ({authors.length})
                </FieldLabel>
                <button
                  onClick={() => onChange({ authors: [...authors, { name: "", role: "" }] })}
                  className="text-[11px] text-[#0E5A60] font-bold hover:underline cursor-pointer"
                >
                  + Add traveller
                </button>
              </div>
              {authors.map((author, aIdx) => (
                <div
                  key={aIdx}
                  className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-slate-200"
                >
                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      type="text"
                      placeholder="Name (e.g. Yogita Girotra)"
                      value={author.name}
                      onChange={(e) =>
                        onChange({
                          authors: authors.map((a, i) =>
                            i === aIdx ? { ...a, name: e.target.value } : a,
                          ),
                        })
                      }
                      className={smallInputClass}
                    />
                    <input
                      type="text"
                      placeholder="Role / profession (optional)"
                      value={author.role || ""}
                      onChange={(e) =>
                        onChange({
                          authors: authors.map((a, i) =>
                            i === aIdx ? { ...a, role: e.target.value } : a,
                          ),
                        })
                      }
                      className={`${smallInputClass} text-slate-500`}
                    />
                  </div>
                  {authors.length > 1 && (
                    <button
                      onClick={() => onChange({ authors: authors.filter((_, i) => i !== aIdx) })}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove traveller"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <InputField
              label="Travelled as (pill under names)"
              placeholder="e.g. Couple, Mom & two daughters"
              value={story.travelledAs}
              onChange={(e) => onChange({ travelledAs: e.target.value })}
            />
          </div>

          {/* ---------- The letter ---------- */}
          <div className="p-5 flex flex-col gap-5">
            <PanelLabel title="Letter" hint="Fields are in the order they appear on the card" />

            <InputField
              label="Headline"
              placeholder="e.g. We went as strangers, but returned as an extended family"
              value={story.title}
              onChange={(e) => onChange({ title: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Short summary (1–2 sentences)</FieldLabel>
              <textarea
                value={story.summary}
                onChange={(e) => onChange({ summary: e.target.value })}
                placeholder="e.g. We went with a group of strangers, but returned with wonderful memories..."
                rows={2}
                className={textareaClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Highlights ({highlights.length}) · 2–4 works best</FieldLabel>
                <button
                  onClick={() =>
                    onChange({
                      highlights: [...highlights, { icon: "guide", label: "", detail: "" }],
                    })
                  }
                  className="text-[11px] text-[#0E5A60] font-bold hover:underline cursor-pointer"
                >
                  + Add highlight
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((high, hIdx) => {
                  const setHigh = (patch: Partial<StoryHighlightItem>) =>
                    onChange({
                      highlights: highlights.map((h, i) => (i === hIdx ? { ...h, ...patch } : h)),
                    });
                  return (
                    <div
                      key={hIdx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={high.icon}
                          onChange={(e) => setHigh({ icon: e.target.value as HighlightIcon })}
                          className="flex-1 text-xs font-semibold text-[#0E5A60] bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                          title="Icon"
                        >
                          {HIGHLIGHT_ICON_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.emoji} {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            onChange({ highlights: highlights.filter((_, i) => i !== hIdx) })
                          }
                          className="text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Remove highlight"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Captain Abhay Negi)"
                        value={high.label}
                        onChange={(e) => setHigh({ label: e.target.value })}
                        className={`${smallInputClass} font-semibold text-slate-800`}
                      />
                      <input
                        type="text"
                        placeholder="Detail (e.g. Travel, stay & meals made smooth)"
                        value={high.detail}
                        onChange={(e) => setHigh({ detail: e.target.value })}
                        className={`${smallInputClass} text-slate-500`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <LetterBody
              paragraphs={story.paragraphs || []}
              onChange={(paragraphs) => onChange({ paragraphs })}
            />

            <InputField
              label="Sign-off (above the names)"
              placeholder="e.g. Much Love & Blessings"
              value={story.signoff || ""}
              onChange={(e) => onChange({ signoff: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Full letter text. Keeps the raw text locally so typing a blank line to start a new
// paragraph isn't stripped mid-typing; paragraphs are derived from it on every change.
function LetterBody({
  paragraphs,
  onChange,
}: {
  paragraphs: string[];
  onChange: (p: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft((cur) =>
      toParagraphs(cur).join("\n\n") === paragraphs.join("\n\n") ? cur : paragraphs.join("\n\n"),
    );
  }, [paragraphs]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FieldLabel>Full letter (opens with &ldquo;Read full letter&rdquo;)</FieldLabel>
        <span className="text-[11px] text-slate-400">{paragraphs.length} paragraphs</span>
      </div>
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(toParagraphs(e.target.value));
        }}
        placeholder="Paste the traveller's review here. Leave an empty line between paragraphs."
        rows={8}
        className={textareaClass}
      />
      <p className="text-[11px] text-slate-500 px-1">
        Leave an empty line between paragraphs. To highlight a phrase with a marker, wrap it like{" "}
        <code className="font-mono bg-amber-50 text-amber-700 px-1 rounded">==this phrase==</code>.
      </p>
    </div>
  );
}

function toParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function PanelLabel({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C85A24]">
        {title}
      </p>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}

function FieldLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}
