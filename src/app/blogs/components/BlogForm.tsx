"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { ChapterStoryEditor } from "./ChapterStoryEditor";
import {
  blocksToStoryText,
  storyTextToBlocks,
  BlogBlockItem,
} from "@/lib/blogContentParser";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  Globe,
  Compass,
  Sparkles,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

export interface BlogSectionItem {
  id: string;
  number?: number | null;
  kicker?: string;
  title: string;
  blocks: BlogBlockItem[];
}

export interface BlogFormData {
  id?: string;
  slug: string;
  title: string;
  heroLead: string;
  heroAccent: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  heroImage: string;
  heroAlt: string;
  ogImage?: string;
  marginNote?: string;
  intro: string[];
  sections: BlogSectionItem[];
  ctaEyebrow?: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryBtnText?: string;
  ctaPrimaryBtnUrl?: string;
  ctaSecondaryBtnText?: string;
  ctaSecondaryBtnUrl?: string;
  shareBtnText?: string;
  relatedCategory: string;
  sidebarBadge?: string;
  shareTitle?: string;
  shareNote?: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  canonicalUrl?: string;
  noIndex: boolean;
}

interface SectionFormState {
  id: string;
  number?: number | null;
  kicker?: string;
  title: string;
  content: string;
}

const CATEGORY_PRESETS = [
  "First-Timer Guide",
  "Traveller Stories",
  "Packing Guide",
  "Route Guide",
  "Local Culture",
  "Community Rituals",
];



export function BlogForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<BlogFormData>;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"header" | "intro" | "chapters" | "cta" | "seo">(
    "header",
  );

  // Core Header
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [heroLead, setHeroLead] = useState(initialData?.heroLead || "");
  const [heroAccent, setHeroAccent] = useState(initialData?.heroAccent || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "First-Timer Guide");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt || new Date().toISOString().split("T")[0],
  );
  const [author, setAuthor] = useState(initialData?.author || "Team Kokalachi");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || "");
  const [heroAlt, setHeroAlt] = useState(initialData?.heroAlt || "");
  const [marginNote, setMarginNote] = useState(initialData?.marginNote || "");

  // Story Intro - Single unified continuous text
  const [introText, setIntroText] = useState<string>(() => {
    if (initialData?.intro && Array.isArray(initialData.intro) && initialData.intro.length > 0) {
      return initialData.intro.join("\n\n");
    }
    return "";
  });

  // Story Chapters - Collapsible by default
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleChapterCollapse = (id: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [sections, setSections] = useState<SectionFormState[]>(() => {
    if (initialData?.sections && initialData.sections.length > 0) {
      return initialData.sections.map((sec) => ({
        id: sec.id || `chapter-${Date.now().toString(36)}`,
        number: sec.number != null ? sec.number : null,
        kicker: sec.kicker || "",
        title: sec.title || "",
        content: blocksToStoryText(sec.blocks || []),
      }));
    }
    return [
      {
        id: "chapter-1",
        number: 1,
        kicker: "",
        title: "",
        content: "",
      },
    ];
  });

  // CTA & Recommendation
  const [ctaEyebrow, setCtaEyebrow] = useState(
    initialData?.ctaEyebrow || "Your first chai stop is waiting",
  );
  const [ctaTitle, setCtaTitle] = useState(
    initialData?.ctaTitle || "Ready to take the first step?",
  );
  const [ctaText, setCtaText] = useState(
    initialData?.ctaText ||
      "Browse our upcoming journeys and find the one that makes you a little excited and a little nervous. That's usually the right one.",
  );
  const [ctaPrimaryBtnText, setCtaPrimaryBtnText] = useState(
    initialData?.ctaPrimaryBtnText || "Explore Upcoming Trips",
  );
  const [ctaPrimaryBtnUrl, setCtaPrimaryBtnUrl] = useState(
    initialData?.ctaPrimaryBtnUrl || "/#upcoming-journeys",
  );
  const [ctaSecondaryBtnText, setCtaSecondaryBtnText] = useState(
    initialData?.ctaSecondaryBtnText || "Read our FAQs",
  );
  const [ctaSecondaryBtnUrl, setCtaSecondaryBtnUrl] = useState(
    initialData?.ctaSecondaryBtnUrl || "/faqs",
  );
  const [shareBtnText, setShareBtnText] = useState(
    initialData?.shareBtnText || "Share on WhatsApp",
  );
  const [relatedCategory, setRelatedCategory] = useState(
    initialData?.relatedCategory || "FirstTimers",
  );
  const [journeyCategories, setJourneyCategories] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    async function loadJourneyCategories() {
      try {
        const res = await fetch("/api/journeys");
        const json = await res.json();
        if (json.success && json.data?.sections?.JourneysFilterSection?.categories) {
          const cats = json.data.sections.JourneysFilterSection.categories
            .filter((c: any) => c.id !== "All")
            .map((c: any) => ({
              id: c.id,
              label: c.label || c.id,
            }));
          setJourneyCategories(cats);
        }
      } catch (err) {
        console.error("Failed to load journey categories in blog form", err);
      }
    }
    loadJourneyCategories();
  }, []);
  const [sidebarBadge, setSidebarBadge] = useState(
    initialData?.sidebarBadge || "First-timer pick",
  );
  const [shareTitle, setShareTitle] = useState(
    initialData?.shareTitle || "psst…",
  );
  const [shareNote, setShareNote] = useState(
    initialData?.shareNote || "Know a nervous first-timer? Send this their way.",
  );

  // Publishing & SEO
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [targetKeywords, setTargetKeywords] = useState(initialData?.targetKeywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [noIndex, setNoIndex] = useState(initialData?.noIndex ?? false);

  // Auto-generate slug from title
  const handleAutoSlug = () => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
    toast.success("Slug generated from title");
  };

  // Section helpers
  const handleAddSection = () => {
    const nextNum = sections.filter((s) => s.number != null).length + 1;
    const newId = `chapter-${Date.now().toString(36)}`;
    const newSec: SectionFormState = {
      id: newId,
      number: nextNum,
      kicker: "",
      title: "",
      content: "",
    };
    setSections([...sections, newSec]);
    // Expand the newly created chapter so the user can edit it immediately
    setExpandedChapters((prev) => ({ ...prev, [newId]: true }));
  };

  const handleUpdateSectionField = (
    secIdx: number,
    field: keyof SectionFormState,
    val: any,
  ) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], [field]: val };
    setSections(updated);
  };

  const handleUpdateSectionContent = (secIdx: number, content: string) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], content };
    setSections(updated);
  };

  const handleRemoveSection = (secIdx: number) => {
    setSections(sections.filter((_, i) => i !== secIdx));
  };

  // Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a story title");
      setActiveTab("header");
      return;
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!cleanSlug) {
      toast.error("Please provide a valid URL slug");
      setActiveTab("header");
      return;
    }

    setLoading(true);
    setSaved(false);

    // Split introText by double newlines into clean paragraph strings
    const introParagraphs = introText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Parse each section's unified CMS story text into structured blocks
    const parsedSections = sections.map((sec) => ({
      id:
        sec.id ||
        sec.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      number: sec.number != null ? Number(sec.number) : null,
      kicker: sec.kicker || undefined,
      title: sec.title.trim(),
      blocks: storyTextToBlocks(sec.content),
    }));

    const payload: BlogFormData = {
      title: title.trim(),
      slug: cleanSlug,
      heroLead: heroLead || title.trim(),
      heroAccent: heroAccent || "",
      excerpt: excerpt.trim(),
      category: category || "First-Timer Guide",
      publishedAt: publishedAt || new Date().toISOString().split("T")[0],
      author: author || "Team Kokalachi",
      heroImage: heroImage.trim(),
      heroAlt: heroAlt || title.trim(),
      marginNote: marginNote.trim() || undefined,
      intro: introParagraphs,
      sections: parsedSections,
      ctaEyebrow: ctaEyebrow.trim() || "Your first chai stop is waiting",
      ctaTitle: ctaTitle.trim(),
      ctaText: ctaText.trim(),
      ctaPrimaryBtnText: ctaPrimaryBtnText.trim() || "Explore Upcoming Trips",
      ctaPrimaryBtnUrl: ctaPrimaryBtnUrl.trim() || "/#upcoming-journeys",
      ctaSecondaryBtnText: ctaSecondaryBtnText.trim() || "Read our FAQs",
      ctaSecondaryBtnUrl: ctaSecondaryBtnUrl.trim() || "/faqs",
      shareBtnText: shareBtnText.trim() || "Share on WhatsApp",
      relatedCategory: relatedCategory || "FirstTimers",
      sidebarBadge: sidebarBadge.trim() || "First-timer pick",
      shareTitle: shareTitle.trim() || "psst…",
      shareNote: shareNote.trim() || "Know a nervous first-timer? Send this their way.",
      isPublished,
      isFeatured,
      order: Number(order) || 0,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || excerpt.trim() || undefined,
      targetKeywords: targetKeywords.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || `/blogs/${cleanSlug}`,
      noIndex,
    };

    try {
      const url = isEdit && initialData?.id ? `/api/blogs/${initialData.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Story updated successfully!" : "Story published successfully!");
        setTimeout(() => {
          router.push("/blogs");
          router.refresh();
        }, 800);
      } else {
        toast.error(json.error || "Failed to save story");
      }
    } catch {
      toast.error("Network error while saving story");
    } finally {
      setLoading(false);
    }
  };

  // Detected intro paragraphs count
  const detectedIntroParagraphs = introText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-8 pb-24 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Back to all stories"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              {isEdit ? "Edit Story" : "Write New Story"}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#FAF5EE] text-[#D96C2C] border border-[#D96C2C]/20 uppercase">
                {category}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Assemble your scrapbook journal with handwritten accents, polaroids, and postcards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <SaveButton onClick={handleSubmit} loading={loading} saved={saved} />
        </div>
      </div>

      {/* Editor Tab Navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { key: "header", label: "Hero & Details", icon: BookOpen },
          { key: "intro", label: `Story Intro (${detectedIntroParagraphs.length})`, icon: FileText },
          { key: "chapters", label: `Chapters & Story (${sections.length})`, icon: Layers },
          { key: "cta", label: "CTA & Recommendation", icon: Compass },
          { key: "seo", label: "SEO & Social", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0E5A60] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & CORE DETAILS */}
      {activeTab === "header" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D96C2C]" />
              Story Title & Header Accents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <InputField
                  label="Story Headline / Title"
                  placeholder="e.g. First Time on a Group Trip? Here's What It Actually Feels Like."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 tracking-wide block mb-1.5">
                  URL Slug
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="first-time-on-a-group-trip"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                  />
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Auto
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Canonical URL: /blogs/{slug || "slug-here"}
                </span>
              </div>

              <div>
                <InputField
                  label="Hero Lead (Large Serifs in Header)"
                  placeholder="e.g. First Time on a Group Trip?"
                  value={heroLead}
                  onChange={(e) => setHeroLead(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="Hero Cursive Accent (Italic Handwritten Subline)"
                  placeholder="e.g. Here's what it actually feels like."
                  value={heroAccent}
                  onChange={(e) => setHeroAccent(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 tracking-wide block mb-1.5">
                  Category Tag
                </label>
                <input
                  list="category-presets"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="First-Timer Guide"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                />
                <datalist id="category-presets">
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <InputField
                  label="Author Name"
                  placeholder="e.g. Team Kokalachi"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div>
                <InputField
                  label="Publish Date (YYYY-MM-DD)"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>

              <div>
                <InputField
                  label="Handwritten Margin Note (Beside Intro)"
                  placeholder="e.g. nervous? same. that's the point ♡"
                  value={marginNote}
                  onChange={(e) => setMarginNote(e.target.value)}
                  tooltip="Small cursive note with a hand-drawn doodle arrow beside the intro"
                />
              </div>

              <div className="md:col-span-2">
                <TextAreaField
                  label="Story Excerpt / Teaser"
                  placeholder="Brief 2-3 sentence summary that draws travellers in on cards & Google results..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Hero Backdrop Image */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D96C2C]" />
              Hero Photography Backdrop
            </h2>
            <ImagePickerField
              label="Hero Backdrop Image"
              value={heroImage}
              onChange={setHeroImage}
              folder="kokalachi/blogs"
              tooltip="Full-width atmospheric photography for the story header"
            />
            <InputField
              label="Image Alt Text (for accessibility & SEO)"
              placeholder="e.g. Five friends with arms around each other watching a golden sunset over the sea"
              value={heroAlt}
              onChange={(e) => setHeroAlt(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* TAB 2: STORY INTRO PARAGRAPHS (Clean Single Textarea) */}
      {activeTab === "intro" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D96C2C]" />
                Story Intro Narrative
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Write your opening story paragraphs in one continuous space. Paragraph 1 will automatically render with Kokalachi's signature drop-cap initial on the website.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF5EE] text-[#0E5A60] border border-[#0E5A60]/20">
              {detectedIntroParagraphs.length} {detectedIntroParagraphs.length === 1 ? "paragraph" : "paragraphs"} detected
            </span>
          </div>

          <div>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Write your story introduction here... Press Enter twice to separate paragraphs."
              rows={12}
              className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
            />
          </div>
        </div>
      )}

      {/* TAB 3: CHAPTERS & SCRAPBOOK STORY (Collapsible by Default) */}
      {activeTab === "chapters" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">Story Chapters</h2>
              <p className="text-xs text-slate-500">
                Click any chapter to expand and edit. Write continuously in the single editor window, insert scrapbook elements from the toolbar, and toggle Visual Preview to verify formatting.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A60] hover:bg-[#0B2A3D] text-white text-xs font-bold rounded-full shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Chapter
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, secIdx) => {
              const isExpanded = !!expandedChapters[section.id || `idx-${secIdx}`];
              const sectionKey = section.id || `idx-${secIdx}`;

              return (
                <div
                  key={sectionKey}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  {/* Collapsible Chapter Header Bar */}
                  <div
                    onClick={() => toggleChapterCollapse(sectionKey)}
                    className="p-4 sm:p-5 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200/60 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-[#0E5A60] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-2xs">
                        {section.number != null ? String(section.number).padStart(2, "0") : "✦"}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {section.title || `Chapter ${secIdx + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {section.kicker && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A24] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                              {section.kicker}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono">
                            #{section.id || "anchor"} · Unified Story Editor
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(secIdx)}
                          className="p-1.5 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleChapterCollapse(sectionKey)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                        title={isExpanded ? "Collapse chapter" : "Expand chapter"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Chapter Body (Only visible when expanded) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Chapter Details: Spacious 2-row layout */}
                      <div className="space-y-4">
                        {/* Row 1: Chapter Title (65%) + Kicker (35%) */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-8">
                            <InputField
                              label="Chapter Title"
                              value={section.title}
                              onChange={(e) =>
                                handleUpdateSectionField(secIdx, "title", e.target.value)
                              }
                              placeholder="e.g. The first hello shouldn't happen at the airport"
                              required
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <InputField
                              label="Kicker (Table of Contents Label)"
                              placeholder="e.g. Before you go"
                              value={section.kicker || ""}
                              onChange={(e) =>
                                handleUpdateSectionField(secIdx, "kicker", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Row 2: Anchor ID + Numbered Chapter Toggle */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          <div className="sm:col-span-8">
                            <InputField
                              label="Anchor ID (for smooth-scroll links)"
                              placeholder="e.g. before-you-go"
                              value={section.id || ""}
                              onChange={(e) =>
                                handleUpdateSectionField(secIdx, "id", e.target.value)
                              }
                            />
                          </div>
                          <div className="sm:col-span-4 sm:pt-4">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={section.number != null}
                                onChange={(e) =>
                                  handleUpdateSectionField(
                                    secIdx,
                                    "number",
                                    e.target.checked ? secIdx + 1 : null,
                                  )
                                }
                                className="rounded text-[#0E5A60] focus:ring-[#0E5A60]"
                              />
                              Numbered Chapter (shows 01, 02)
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* UNIFIED CMS STORY EDITOR WINDOW (With Write / Visual Preview & Toolbar) */}
                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Chapter Story Narrative & Scrapbook Window
                        </span>

                        <ChapterStoryEditor
                          content={section.content}
                          onChange={(content) => handleUpdateSectionContent(secIdx, content)}
                          chapterTitle={section.title}
                          chapterKicker={section.kicker}
                          chapterNumber={section.number}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CTA & RECOMMENDATION */}
      {activeTab === "cta" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D96C2C]" />
            Story Bottom Call-To-Action & Journey Links
          </h2>

          <div className="space-y-5">
            <InputField
              label="CTA Eyebrow Tagline"
              placeholder="e.g. Your first chai stop is waiting"
              value={ctaEyebrow}
              onChange={(e) => setCtaEyebrow(e.target.value)}
              tooltip="Small bold orange label displayed above the main CTA headline"
            />

            <InputField
              label="CTA Headline"
              placeholder="e.g. Ready to take the first step?"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
            />

            <TextAreaField
              label="CTA Body Text"
              placeholder="e.g. Browse our upcoming journeys and find the one that makes you a little excited..."
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              rows={3}
            />

            {/* CTA Buttons Configuration */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                CTA Action Buttons
              </span>

              {/* Primary Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <InputField
                    label="Primary Button Label (Orange Pill)"
                    placeholder="e.g. Explore Upcoming Trips"
                    value={ctaPrimaryBtnText}
                    onChange={(e) => setCtaPrimaryBtnText(e.target.value)}
                  />
                </div>
                <div>
                  <InputField
                    label="Primary Button Link URL"
                    placeholder="e.g. /#upcoming-journeys"
                    value={ctaPrimaryBtnUrl}
                    onChange={(e) => setCtaPrimaryBtnUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Secondary Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <InputField
                    label="Secondary Button Label (Subtle Link)"
                    placeholder="e.g. Read our FAQs"
                    value={ctaSecondaryBtnText}
                    onChange={(e) => setCtaSecondaryBtnText(e.target.value)}
                  />
                </div>
                <div>
                  <InputField
                    label="Secondary Button Link URL"
                    placeholder="e.g. /faqs"
                    value={ctaSecondaryBtnUrl}
                    onChange={(e) => setCtaSecondaryBtnUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 tracking-wide block mb-1.5">
                Related Journey Recommendation Category
              </label>
              <select
                value={relatedCategory}
                onChange={(e) => setRelatedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
              >
                {journeyCategories.length > 0 ? (
                  journeyCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({cat.id})
                    </option>
                  ))
                ) : (
                  <option value={relatedCategory || "FirstTimers"}>
                    {relatedCategory || "FirstTimers"}
                  </option>
                )}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                The article will automatically feature journeys matching this category at the bottom
                and in the sticky sidebar.
              </span>
            </div>
          </div>

          {/* Sticky Sidebar & WhatsApp Share Card Settings */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#D96C2C]" />
              Sticky Sidebar & WhatsApp Share Card
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputField
                  label="Sidebar Trip Badge Pill"
                  placeholder="e.g. First-timer pick"
                  value={sidebarBadge}
                  onChange={(e) => setSidebarBadge(e.target.value)}
                  tooltip="Small orange pill displayed on the recommended trip card in the sidebar"
                />
              </div>

              <div>
                <InputField
                  label="WhatsApp Card Handwritten Accent"
                  placeholder="e.g. psst…"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  tooltip="Cursive accent text above the share message"
                />
              </div>

              <div className="sm:col-span-2">
                <TextAreaField
                  label="WhatsApp Card Share Message"
                  placeholder="e.g. Know a nervous first-timer? Send this their way."
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  rows={2}
                  tooltip="Message displayed on the yellow sticky share card above the WhatsApp button"
                />
              </div>

              <div className="sm:col-span-2">
                <InputField
                  label="WhatsApp Button Text (Green Pill)"
                  placeholder="e.g. Share on WhatsApp"
                  value={shareBtnText}
                  onChange={(e) => setShareBtnText(e.target.value)}
                  tooltip="Label inside the green WhatsApp share button"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO & SETTINGS */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D96C2C]" />
            SEO & Publishing Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status Toggles */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Published Status</span>
                <span className="text-[11px] text-slate-500">
                  Visible to travellers on the Kokalachi website
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublished ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Featured Story</span>
                <span className="text-[11px] text-slate-500">
                  Pin as the primary large hero card on the Journal home
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFeatured ? "bg-amber-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="md:col-span-2">
              <InputField
                label="Custom Meta Title (Search Engine Snippet Title)"
                placeholder="Leave blank to use story title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <TextAreaField
                label="Custom Meta Description"
                placeholder="Leave blank to use story excerpt"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <InputField
                label="Target SEO Keywords"
                placeholder="group trip, first time solo, kokalachi"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
              />
            </div>

            <div>
              <InputField
                label="Canonical URL"
                placeholder={`/blogs/${slug || "story-slug"}`}
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noIndex}
                  onChange={(e) => setNoIndex(e.target.checked)}
                  className="rounded text-[#0E5A60] focus:ring-[#0E5A60]"
                />
                No Index (Hide this article from search engine crawlers)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span className="text-xs font-semibold text-slate-700">
            {isPublished ? "Story will be published" : "Draft mode"} · {sections.length} chapters
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <SaveButton onClick={handleSubmit} loading={loading} saved={saved} />
        </div>
      </div>
    </div>
  );
}
