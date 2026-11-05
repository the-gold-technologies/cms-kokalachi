"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  MapPin,
  Calendar,
  PenLine,
  Camera,
  ExternalLink,
  Tag,
  Edit,
  FolderOpen,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export interface CommunityTripChapter {
  slug: string;
  destination: string;
  country: string;
  tripType: string;
  travelledOn: string;
  tagline: string;
  journeySlug?: string;
  coverImage: string;
  media: any[];
  stories: any[];
}

export function CommunityChaptersSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [chapters, setChapters] = useState<CommunityTripChapter[]>([]);
  const [moreMomentsLabel, setMoreMomentsLabel] = useState("");
  const [inTheirWordsLabel, setInTheirWordsLabel] = useState("");
  const [inShortLabel, setInShortLabel] = useState("");
  const [whatTheyLovedLabel, setWhatTheyLovedLabel] = useState("");

  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

  useEffect(() => {
    setChapters(Array.isArray(initialData?.chapters) ? initialData.chapters : []);
    setMoreMomentsLabel(initialData?.moreMomentsLabel ?? "");
    setInTheirWordsLabel(initialData?.inTheirWordsLabel ?? "");
    setInShortLabel(initialData?.inShortLabel ?? "");
    setWhatTheyLovedLabel(initialData?.whatTheyLovedLabel ?? "");
  }, [initialData]);

  const confirmRemoveChapter = async () => {
    if (chapterToDelete === null) return;
    const updatedChapters = chapters.filter((_, i) => i !== chapterToDelete);
    setChapters(updatedChapters);

    try {
      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityChaptersSection",
          content: {
            moreMomentsLabel: moreMomentsLabel.trim(),
            inTheirWordsLabel: inTheirWordsLabel.trim(),
            inShortLabel: inShortLabel.trim(),
            whatTheyLovedLabel: whatTheyLovedLabel.trim(),
            chapters: updatedChapters,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete destination chapter");
      }
      toast.success("Destination chapter deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete");
    } finally {
      setChapterToDelete(null);
    }
  };

  const handleSaveLabels = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CommunityChaptersSection",
          content: {
            moreMomentsLabel: moreMomentsLabel.trim(),
            inTheirWordsLabel: inTheirWordsLabel.trim(),
            inShortLabel: inShortLabel.trim(),
            whatTheyLovedLabel: whatTheyLovedLabel.trim(),
            chapters,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save community labels");
      }

      setSaved(true);
      toast.success("Community section headings & labels saved!");
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
        title="2. Destination Chapters & Traveller Stories"
        description="Display and manage each destination as an independent card. Click 'Edit Chapter' to customize its banner, traveller letters, and photo/video wall on a dedicated page."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge={`${chapters.length} Destinations`}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-2 animate-in fade-in duration-300">
          {/* Header Action: Add Destination Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D96C2C]" />
                Destination Cards ({chapters.length})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Each destination powers its own story archive page (/community/[slug]) and supplies
                cards to the main community index.
              </p>
            </div>
            <Link
              href="/static-pages/community/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A60] hover:bg-[#093e42] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Destination Chapter
            </Link>
          </div>

          {/* Chapters Cards Grid */}
          {chapters.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/60 rounded-3xl border border-dashed border-slate-300">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No destination chapters yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &ldquo;Add Destination Chapter&rdquo; to create your first destination.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter, cIdx) => {
                const storiesCount = Array.isArray(chapter.stories) ? chapter.stories.length : 0;
                const mediaCount = Array.isArray(chapter.media) ? chapter.media.length : 0;
                return (
                  <div
                    key={chapter.slug || cIdx}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Card Top: Cover Image with Badges */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      {chapter.coverImage ? (
                        <img
                          src={chapter.coverImage}
                          alt={chapter.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                          <MapPin className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        {chapter.tripType ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#D96C2C] text-white shadow-xs">
                            {chapter.tripType}
                          </span>
                        ) : (
                          <span />
                        )}

                        {chapter.country && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-700 shadow-xs backdrop-blur-xs">
                            {chapter.country}
                          </span>
                        )}
                      </div>

                      {/* Bottom Banner Title on Image */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                        <h4 className="font-serif font-bold text-lg sm:text-xl truncate text-white drop-shadow-xs">
                          {chapter.destination || "Untitled Destination"}
                        </h4>
                        {chapter.tagline && (
                          <p className="text-xs text-amber-200/90 truncate font-script text-[14px]">
                            {chapter.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Content & Stats */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-[#0E5A60] shrink-0" />
                          <span className="font-semibold">
                            {chapter.travelledOn || "Date not specified"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <PenLine className="w-3.5 h-3.5 text-[#D96C2C]" />
                            <span>
                              {storiesCount} {storiesCount === 1 ? "Story" : "Stories"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Camera className="w-3.5 h-3.5 text-[#0E5A60]" />
                            <span>
                              {mediaCount} {mediaCount === 1 ? "Photo/Video" : "Photos/Videos"}
                            </span>
                          </div>
                        </div>

                        {chapter.slug && (
                          <p className="text-[11px] font-mono text-slate-400 truncate">
                            /community/{chapter.slug}
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setChapterToDelete(cIdx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/static-pages/community/edit/${chapter.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E5A60] hover:bg-[#093e42] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit Chapter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section Headings & Shared Labels Card */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-[#0E5A60]" />
              <h4 className="text-sm font-bold text-slate-800">
                Community Section Headings & Shared Labels
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Headings used on the public website for story filters, summary boxes, and photo
              lightboxes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <InputField
                label="Eyebrow Above Stories"
                helperText="Eyebrow above the main story grid"
                value={inTheirWordsLabel}
                onChange={(e) => setInTheirWordsLabel(e.target.value)}
                placeholder="In their words"
              />
              <InputField
                label="Summary Box Heading"
                helperText="Title of the review summary box"
                value={inShortLabel}
                onChange={(e) => setInShortLabel(e.target.value)}
                placeholder="In short"
              />
              <InputField
                label="Highlights Heading"
                helperText="Heading for highlight cards"
                value={whatTheyLovedLabel}
                onChange={(e) => setWhatTheyLovedLabel(e.target.value)}
                placeholder="What they loved"
              />
              <InputField
                label="'+ More' Gallery Text"
                helperText="Shown when photos exceed 8"
                value={moreMomentsLabel}
                onChange={(e) => setMoreMomentsLabel(e.target.value)}
                placeholder="more moments"
              />
            </div>

            <div className="pt-2">
              <SaveButton
                loading={loading}
                saved={saved}
                onClick={handleSaveLabels}
                label="Save Headings & Labels"
                className="w-full py-3.5 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={chapterToDelete !== null}
        title="Delete Destination Chapter"
        itemName={
          chapterToDelete !== null
            ? chapters[chapterToDelete]?.destination || `Chapter ${chapterToDelete + 1}`
            : undefined
        }
        message="This will permanently delete this destination chapter along with its traveller review letters and photo/video wall moments."
        confirmLabel="Delete Destination"
        onConfirm={confirmRemoveChapter}
        onClose={() => setChapterToDelete(null)}
      />
    </article>
  );
}
