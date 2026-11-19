"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { ChapterStoryEditor } from "./ChapterStoryEditor";
import { blocksToStoryText, storyTextToBlocks, BlogBlockItem } from "@/lib/blogContentParser";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  Edit3,
  Globe,
  Compass,
  Sparkles,
  Share2,
  Feather,
  Calendar,
  Clock,
  Lightbulb,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import { SharedSectionLink } from "@/components/SharedSectionLink";
import { ImportBlogDocModal } from "./ImportBlogDocModal";
import { ParsedBlogDoc } from "@/lib/blogDocParser";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.834.814 2.801.814 3.18 0 5.766-2.587 5.768-5.766.001-3.181-2.585-5.768-5.769-5.768zm3.376 8.219c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.146-.516-1.503-.618-2.455-2.138-2.529-2.236-.073-.099-.607-.808-.607-1.543s.385-1.096.522-1.246c.137-.149.3-.186.4-.186l.288.006c.099.004.23.018.334.269.113.272.385.94.419 1.009.034.069.057.149.011.239-.046.091-.069.148-.137.227-.069.079-.145.176-.207.237-.069.068-.14.141-.06.279.08.138.356.587.764.95.524.466.966.611 1.104.679.137.069.218.057.299-.034.08-.092.345-.401.437-.539.092-.137.184-.114.31-.068.127.046.804.379.942.448.138.069.23.103.264.161.034.057.034.333-.11.738z" />
    </svg>
  );
}

function renderRichTextWithLinks(text: string) {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <React.Fragment key={i}>{part}</React.Fragment>;
    return (
      <span
        key={i}
        className="font-semibold text-[#C85A24] underline decoration-[#D96C2C]/50 underline-offset-4 cursor-pointer hover:text-[#0E5A60] transition-colors"
        title={`Links to: ${match[2]}`}
      >
        {match[1]}
      </span>
    );
  });
}

function formatBlogDate(dateStr?: string): string {
  if (!dateStr) return "Today";
  try {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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
  relatedTripsKicker?: string;
  relatedTripsTitle?: string;
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
  schema?: string;
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
  const [currentId, setCurrentId] = useState<string | undefined>(initialData?.id);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"header" | "intro" | "chapters" | "cta" | "seo">(
    "header",
  );

  // Per-section visual preview mode toggles (exact same as ChapterStoryEditor)
  const [heroView, setHeroView] = useState<"edit" | "preview">("edit");
  const [introView, setIntroView] = useState<"edit" | "preview">("edit");
  const [ctaView, setCtaView] = useState<"edit" | "preview">("edit");

  // Core Header
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [heroLead, setHeroLead] = useState(initialData?.heroLead || "");
  const [heroAccent, setHeroAccent] = useState(initialData?.heroAccent || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [publishedAt, setPublishedAt] = useState(initialData?.publishedAt || "");
  const [author, setAuthor] = useState(initialData?.author || "");
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
      return initialData.sections.map((sec: any) => {
        let content = "";
        if (sec.content && typeof sec.content === "string") {
          content = sec.content;
        } else if (sec.blocks && Array.isArray(sec.blocks)) {
          content = blocksToStoryText(sec.blocks);
        }
        if (sec.image && typeof sec.image === "string" && sec.image.trim()) {
          const imgSrc = sec.image.trim();
          if (!content.includes(imgSrc)) {
            const alt = sec.imageAlt || sec.title || "";
            const polaroid = `:::polaroid\nsrc: ${imgSrc}\nalt: ${alt}\ncaption: ${alt}\n:::`;
            content = content ? `${content}\n\n${polaroid}` : polaroid;
          }
        }
        return {
          id: sec.id || `chapter-${Date.now().toString(36)}`,
          number: sec.number != null ? sec.number : null,
          kicker: sec.kicker || "",
          title: sec.title || "",
          content,
        };
      });
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
  const [ctaEyebrow, setCtaEyebrow] = useState(initialData?.ctaEyebrow || "");
  const [ctaTitle, setCtaTitle] = useState(initialData?.ctaTitle || "");
  const [ctaText, setCtaText] = useState(initialData?.ctaText || "");
  const [ctaPrimaryBtnText, setCtaPrimaryBtnText] = useState(initialData?.ctaPrimaryBtnText || "");
  const [ctaPrimaryBtnUrl, setCtaPrimaryBtnUrl] = useState(initialData?.ctaPrimaryBtnUrl || "");
  const [ctaSecondaryBtnText, setCtaSecondaryBtnText] = useState(
    initialData?.ctaSecondaryBtnText || "",
  );
  const [ctaSecondaryBtnUrl, setCtaSecondaryBtnUrl] = useState(
    initialData?.ctaSecondaryBtnUrl || "",
  );
  const [shareBtnText, setShareBtnText] = useState(initialData?.shareBtnText || "");
  const [relatedCategory, setRelatedCategory] = useState(initialData?.relatedCategory || "");
  // No longer shown on the website (the related-trips section was removed); kept so saving
  // doesn't wipe existing values
  const [relatedTripsKicker] = useState(initialData?.relatedTripsKicker || "");
  const [relatedTripsTitle] = useState(initialData?.relatedTripsTitle || "");
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
  const [sidebarBadge, setSidebarBadge] = useState(initialData?.sidebarBadge || "");
  const [shareTitle, setShareTitle] = useState(initialData?.shareTitle || "");
  const [shareNote, setShareNote] = useState(initialData?.shareNote || "");

  // Publishing & SEO
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [targetKeywords, setTargetKeywords] = useState(initialData?.targetKeywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [noIndex, setNoIndex] = useState(initialData?.noIndex ?? false);
  const [schema, setSchema] = useState(initialData?.schema || "");

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

  const handleUpdateSectionField = (secIdx: number, field: keyof SectionFormState, val: any) => {
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

  const handleApplyImportDoc = (doc: ParsedBlogDoc) => {
    if (doc.title) setTitle(doc.title);
    if (doc.slug) setSlug(doc.slug);
    if (doc.heroLead) setHeroLead(doc.heroLead);
    if (doc.heroAccent) setHeroAccent(doc.heroAccent);
    if (doc.excerpt) setExcerpt(doc.excerpt);
    if (doc.category) setCategory(doc.category);
    if (doc.publishedAt) setPublishedAt(doc.publishedAt);
    if (doc.author) setAuthor(doc.author);
    if (doc.heroImage) setHeroImage(doc.heroImage);
    if (doc.heroAlt) setHeroAlt(doc.heroAlt);
    if (doc.marginNote) setMarginNote(doc.marginNote);

    if (doc.introText) {
      setIntroText(doc.introText);
    } else if (doc.intro && doc.intro.length > 0) {
      setIntroText(doc.intro.join("\n\n"));
    }

    if (doc.sections && doc.sections.length > 0) {
      const newSections: SectionFormState[] = doc.sections.map((s, idx) => ({
        id: s.id || `chapter-${idx + 1}`,
        number: s.number != null ? s.number : null,
        kicker: s.kicker || "",
        title: s.title || `Chapter ${idx + 1}`,
        content: s.content || "",
      }));
      setSections(newSections);
    }

    if (doc.ctaEyebrow) setCtaEyebrow(doc.ctaEyebrow);
    if (doc.ctaTitle) setCtaTitle(doc.ctaTitle);
    if (doc.ctaText) setCtaText(doc.ctaText);
    if (doc.ctaPrimaryBtnText) setCtaPrimaryBtnText(doc.ctaPrimaryBtnText);
    if (doc.ctaPrimaryBtnUrl) setCtaPrimaryBtnUrl(doc.ctaPrimaryBtnUrl);
    if (doc.ctaSecondaryBtnText) setCtaSecondaryBtnText(doc.ctaSecondaryBtnText);
    if (doc.ctaSecondaryBtnUrl) setCtaSecondaryBtnUrl(doc.ctaSecondaryBtnUrl);
    if (doc.shareTitle) setShareTitle(doc.shareTitle);
    if (doc.shareNote) setShareNote(doc.shareNote);
    if (doc.shareBtnText) setShareBtnText(doc.shareBtnText);
    if (doc.relatedCategory) setRelatedCategory(doc.relatedCategory);
    if (doc.sidebarBadge) setSidebarBadge(doc.sidebarBadge);
    if (typeof doc.isPublished === "boolean") setIsPublished(doc.isPublished);
    if (typeof doc.isFeatured === "boolean") setIsFeatured(doc.isFeatured);
    if (doc.metaTitle) setMetaTitle(doc.metaTitle);
    if (doc.metaDescription) setMetaDescription(doc.metaDescription);
    if (doc.targetKeywords) setTargetKeywords(doc.targetKeywords);
    if (doc.canonicalUrl) setCanonicalUrl(doc.canonicalUrl);
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
    const parsedSections = sections.map((sec) => {
      const blocks = storyTextToBlocks(sec.content);
      const firstImage = blocks.find((b) => b.type === "image");
      return {
        id:
          sec.id ||
          sec.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
        number: sec.number != null ? Number(sec.number) : null,
        kicker: sec.kicker || undefined,
        title: sec.title.trim(),
        image: firstImage?.src || undefined,
        imageAlt: firstImage?.alt || undefined,
        blocks,
      };
    });

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
      relatedTripsKicker: relatedTripsKicker.trim() || "Made for first-timers",
      relatedTripsTitle: relatedTripsTitle.trim() || "Trips to say yes to",
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
      schema: schema.trim() || undefined,
    };

    try {
      const targetId = currentId || (isEdit ? initialData?.id : undefined);
      const url = targetId ? `/api/blogs/${targetId}` : "/api/blogs";
      const method = targetId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        if (json.data?.id) {
          setCurrentId(json.data.id);
          window.history.replaceState(null, "", `/blogs/edit/${json.data.id}`);
        }
        toast.success(
          isEdit || targetId ? "Story updated successfully!" : "Story saved successfully!",
        );
        setTimeout(() => {
          setSaved(false);
        }, 2500);
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
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0E5A60] hover:bg-[#0E5A60]/90 text-white text-xs font-bold transition-all shadow-md shadow-[#0E5A60]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
            title="Import story by uploading a Markdown (.md) or JSON file"
          >
            <UploadCloud className="w-4 h-4 text-[#D96C2C]" />
            Import from Document
          </button>
        </div>
      </div>

      {/* Editor Tab Navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { key: "header", label: "Hero & Details", icon: BookOpen },
          {
            key: "intro",
            label: `Story Intro (${detectedIntroParagraphs.length})`,
            icon: FileText,
          },
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
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D96C2C]" />
                  Story Title & Header Accents
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure story headline, author, publication date, hero photo, and teaser.
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setHeroView("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    heroView === "edit"
                      ? "bg-[#0E5A60] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => setHeroView("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    heroView === "preview"
                      ? "bg-[#0E5A60] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Visual Preview
                </button>
              </div>
            </div>

            {heroView === "edit" ? (
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
            ) : (
              /* Visual Preview for Hero & Details */
              <div className="space-y-6 pt-2">
                {/* Hero Banner Mirror */}
                <div className="relative h-[360px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={heroAlt || title || "Hero Preview"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs uppercase tracking-widest font-mono">
                      [No hero image selected]
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A3D]/95 via-[#0B2A3D]/30 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

                  <div className="absolute inset-0 flex items-end p-6 sm:p-10">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
                        <ArrowLeft className="w-3.5 h-3.5" /> The Kokalachi Journal
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-[#D96C2C] text-white text-[11px] font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {category || "First-Timer Guide"}
                        </span>
                        {isFeatured && (
                          <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight mb-3">
                        {heroLead || title || "Your Story Headline"}{" "}
                        {heroAccent && (
                          <span className="relative inline-block font-script font-normal text-[1.15em] text-[#FFD9BF] whitespace-nowrap">
                            {heroAccent}
                            <svg
                              className="absolute -bottom-2 left-0 w-full h-3 text-[#C85A24] pointer-events-none"
                              viewBox="0 0 100 20"
                              fill="none"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M5 15 Q 50 5 95 15"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        )}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-white/85 text-xs sm:text-sm">
                        <span className="flex items-center gap-1.5">
                          <Feather className="w-3.5 h-3.5 text-[#FFB98A]" />
                          {author || "Team Kokalachi"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FFB98A]" />
                          {formatBlogDate(publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt and Margin Note Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {excerpt && (
                    <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-amber-900/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A24] block mb-1">
                        Story Teaser / Excerpt
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        &ldquo;{excerpt}&rdquo;
                      </p>
                    </div>
                  )}

                  {marginNote && (
                    <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-amber-900/10 flex items-center">
                      <p className="font-script text-2xl text-[#C85A24] -rotate-2 flex items-center gap-2">
                        {marginNote}
                        <svg
                          className="w-8 h-5 text-[#C85A24]/70 rotate-12 shrink-0"
                          viewBox="0 0 50 30"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M 5 5 C 20 25 35 15 45 20 M 38 14 L 45 20 L 40 28"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hero Backdrop Image field is only visible when editing */}
          {heroView === "edit" && (
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
          )}
        </div>
      )}

      {/* TAB 2: STORY INTRO PARAGRAPHS (Clean Single Textarea) */}
      {activeTab === "intro" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D96C2C]" />
                Story Intro Narrative
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Write your opening story paragraphs in one continuous space. Paragraph 1 will
                automatically render with Kokalachi's signature drop-cap initial on the website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF5EE] text-[#0E5A60] border border-[#0E5A60]/20">
                {detectedIntroParagraphs.length}{" "}
                {detectedIntroParagraphs.length === 1 ? "paragraph" : "paragraphs"} detected
              </span>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIntroView("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    introView === "edit"
                      ? "bg-[#0E5A60] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Write Intro
                </button>
                <button
                  type="button"
                  onClick={() => setIntroView("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    introView === "preview"
                      ? "bg-[#0E5A60] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Visual Preview
                </button>
              </div>
            </div>
          </div>

          {introView === "edit" ? (
            <div>
              <textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                placeholder="Write your story introduction here... Press Enter twice to separate paragraphs."
                rows={12}
                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
              />
            </div>
          ) : (
            /* Visual Scrapbook Preview for Story Intro */
            <div className="bg-[#FAF5EE] rounded-2xl p-6 sm:p-10 border border-amber-900/10 space-y-6">
              <div className="max-w-[680px] mx-auto bg-white/95 p-6 sm:p-10 rounded-2xl border border-amber-900/10 shadow-xs">
                {detectedIntroParagraphs.length === 0 ? (
                  <p className="text-slate-400 italic text-sm text-center py-6">
                    No intro paragraphs written yet. Switch back to Write Intro to start writing!
                  </p>
                ) : (
                  detectedIntroParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-[18px] sm:text-[21px] font-serif text-[#0E5A60] leading-[1.65] mb-6 first-letter:float-left first-letter:font-serif first-letter:text-[60px] first-letter:leading-[0.85] first-letter:font-bold first-letter:text-[#D96C2C] first-letter:mr-3 first-letter:mt-1"
                          : "text-[15px] sm:text-[17px] text-slate-600 leading-[1.85] mb-6"
                      }
                    >
                      {renderRichTextWithLinks(para)}
                    </p>
                  ))
                )}

                {marginNote && (
                  <p className="font-script text-2xl sm:text-[26px] text-[#C85A24] -rotate-2 flex items-center gap-2 pl-2 my-6">
                    {marginNote}
                    <svg
                      className="w-8 h-5 text-[#C85A24]/70 rotate-12 shrink-0"
                      viewBox="0 0 50 30"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M 5 5 C 20 25 35 15 45 20 M 38 14 L 45 20 L 40 28"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHAPTERS & SCRAPBOOK STORY (Collapsible by Default) */}
      {activeTab === "chapters" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">Story Chapters</h2>
              <p className="text-xs text-slate-500">
                Click any chapter to expand and edit. Write continuously in the single editor
                window, insert scrapbook elements from the toolbar, and toggle Visual Preview to
                verify formatting.
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D96C2C]" />
                Story Bottom Call-To-Action & Journey Links
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the bottom invitation card, button destinations, and WhatsApp share card.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setCtaView("edit")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ctaView === "edit"
                    ? "bg-[#0E5A60] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit CTA
              </button>
              <button
                type="button"
                onClick={() => setCtaView("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ctaView === "preview"
                    ? "bg-[#0E5A60] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Visual Preview
              </button>
            </div>
          </div>

          {ctaView === "edit" ? (
            <>
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
                    The sticky sidebar suggests a journey from this category.
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
            </>
          ) : (
            /* Visual Preview for CTA & Recommendation */
            <div className="bg-[#FAF5EE] rounded-2xl p-6 sm:p-8 border border-amber-900/10 space-y-8">
              {/* WhatsApp Share Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-dashed border-[#0E5A60]/30 bg-white px-6 py-5 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A24] block mb-1">
                    {shareTitle || "psst…"}
                  </span>
                  <p className="font-script text-xl sm:text-2xl text-[#0E5A60]">
                    {shareNote || "Know a nervous first-timer? Send this their way."}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-2.5 text-xs font-bold shadow-xs shrink-0"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  {shareBtnText || "Share on WhatsApp"}
                </button>
              </div>

              {/* Bottom CTA Card */}
              <div className="rounded-3xl bg-[#0B2A3D] text-white p-6 sm:p-10 relative overflow-hidden shadow-md">
                <div className="relative z-10 max-w-xl">
                  {ctaEyebrow && (
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#FFB98A] block mb-2">
                      {ctaEyebrow}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-white">
                    {ctaTitle || "Find your first travel story"}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                    {ctaText ||
                      "Small-group journeys crafted for first-timers, solo wanderers, and people who value honest conversations around evening bonfires."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-5 py-2.5 rounded-full bg-[#D96C2C] text-white font-bold text-xs shadow-xs">
                      {ctaPrimaryBtnText || "Explore Upcoming Trips"}
                    </span>
                    <span className="px-5 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs border border-white/20">
                      {ctaSecondaryBtnText || "Read our FAQs"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
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

            <div className="md:col-span-2 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Structured Data (Schema Markup JSON-LD)
              </span>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder={
                  'e.g. { "@context": "https://schema.org", "@type": "BlogPosting", ... }'
                }
                rows={7}
                className="w-full font-mono text-xs px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
              />
              <span className="text-[11px] text-slate-400">
                Optional custom JSON-LD schema for this story. Leave empty to use auto-generated
                BlogPosting structured data.
              </span>
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

      <SharedSectionLink page="blog-post" placement="At the bottom of every blog post" />

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

      {/* Import Story Document Modal */}
      <ImportBlogDocModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApply={handleApplyImportDoc}
      />
    </div>
  );
}
