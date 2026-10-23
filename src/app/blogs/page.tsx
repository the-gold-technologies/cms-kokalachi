"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import {
  Search,
  Plus,
  Loader2,
  Calendar,
  Clock,
  Feather,
  Edit,
  Trash2,
  Sparkles,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

interface BlogPostItem {
  id: string;
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
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  sections?: any[];
  createdAt: string;
}

export default function BlogsListPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Expandable Section 1: Public Blog Page Header Banner State
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroEyebrow, setHeroEyebrow] = useState("The Kokalachi Journal");
  const [heroTitleLead, setHeroTitleLead] = useState("Stories for the ");
  const [heroTitleAccent, setHeroTitleAccent] = useState("curious traveller.");
  const [heroDescription, setHeroDescription] = useState(
    "Honest guides, little rituals and real stories from the road, for anyone who has a bucket list but not yet a travel buddy.",
  );
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
  );
  const [heroAlt, setHeroAlt] = useState("The Kokalachi Journal");

  // Expandable Section 2: Blog Page Accents & Bottom CTA State
  const [isCtaOpen, setIsCtaOpen] = useState(false);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaSaved, setCtaSaved] = useState(false);
  const [kicker, setKicker] = useState("Fresh off the press");
  const [chaiNote, setChaiNote] = useState("grab a chai first ☕");
  const [brewingTitle, setBrewingTitle] = useState("more stories brewing…");
  const [brewingDescription, setBrewingDescription] = useState(
    "Packing lists, route guides and traveller memoirs are on their way. Until then, the best stories are the ones you go and make.",
  );
  const [ctaBtnText, setCtaBtnText] = useState("Find your journey");
  const [ctaBtnUrl, setCtaBtnUrl] = useState("/journeys");

  // Single unified fetch: gets blogs cards, hero banner, CTA, and SEO from /api/blogs
  const fetchBlogsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();

      if (json.success) {
        // Extract blogs array from json.data.blogs (or fallback json.data / json.blogs)
        const blogsList = Array.isArray(json.data?.blogs)
          ? json.data.blogs
          : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.blogs)
          ? json.blogs
          : [];
        setPosts(blogsList);

        // Extract sections from json.data.sections
        const sections = json.data?.sections || json.sections || {};
        const hero = sections.BlogHeroSection || json.hero;
        if (hero) {
          if (hero.eyebrow !== undefined) setHeroEyebrow(hero.eyebrow);
          if (hero.titleLead !== undefined) setHeroTitleLead(hero.titleLead);
          if (hero.titleAccent !== undefined) setHeroTitleAccent(hero.titleAccent);
          if (hero.description !== undefined) setHeroDescription(hero.description);
          if (hero.heroImage !== undefined) setHeroImage(hero.heroImage);
          if (hero.heroAlt !== undefined) setHeroAlt(hero.heroAlt);
        }

        const cta = sections.BlogCtaSection || json.cta;
        if (cta) {
          if (cta.kicker !== undefined) setKicker(cta.kicker);
          if (cta.chaiNote !== undefined) setChaiNote(cta.chaiNote);
          if (cta.brewingTitle !== undefined) setBrewingTitle(cta.brewingTitle);
          if (cta.brewingDescription !== undefined) setBrewingDescription(cta.brewingDescription);
          if (cta.ctaBtnText !== undefined) setCtaBtnText(cta.ctaBtnText);
          if (cta.ctaBtnUrl !== undefined) setCtaBtnUrl(cta.ctaBtnUrl);
        }
      } else {
        toast.error(json.error || "Failed to load blog stories");
      }
    } catch {
      toast.error("Network error loading blog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const handleSaveHero = async () => {
    setHeroLoading(true);
    setHeroSaved(false);
    try {
      const payload = {
        eyebrow: heroEyebrow,
        titleLead: heroTitleLead,
        titleAccent: heroTitleAccent,
        description: heroDescription,
        heroImage,
        heroAlt,
      };

      const res = await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "BlogHeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setHeroSaved(true);
        toast.success("Blog page banner updated successfully!");
        setTimeout(() => setHeroSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save blog banner");
      }
    } catch {
      toast.error("Network error saving blog banner");
    } finally {
      setHeroLoading(false);
    }
  };

  const handleSaveCta = async () => {
    setCtaLoading(true);
    setCtaSaved(false);
    try {
      const payload = {
        kicker,
        chaiNote,
        brewingTitle,
        brewingDescription,
        ctaBtnText,
        ctaBtnUrl,
      };

      const res = await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "BlogCtaSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCtaSaved(true);
        toast.success("Blog page CTA and accents updated successfully!");
        setTimeout(() => setCtaSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save CTA content");
      }
    } catch {
      toast.error("Network error saving CTA content");
    } finally {
      setCtaLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/blogs/${postToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Blog story deleted successfully");
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setPostToDelete(null);
      } else {
        toast.error(json.error || "Failed to delete blog story");
      }
    } catch {
      toast.error("Network error deleting story");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostItem) => {
    const updatedStatus = !post.isPublished;
    try {
      const res = await fetch(`/api/blogs/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(updatedStatus ? "Story published!" : "Story moved to draft");
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPublished: updatedStatus } : p)),
        );
      } else {
        toast.error(json.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update publication status");
    }
  };

  // Extract distinct categories
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || p.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && p.isPublished) ||
      (statusFilter === "Draft" && !p.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="Kokalachi Journal & Stories"
          description="Manage your slow-travel stories, publish status, editorial chapters, and public blog page banner and CTA content."
        />

        <Link
          href="/blogs/create"
          className="px-5 py-3 rounded-2xl bg-[#0E5A60] hover:bg-[#061C29] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Write New Story
        </Link>
      </div>

      {/* Expandable Section 1: Public Blog Page Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
        <SectionHeader
          title="Public Blog Page Header Banner"
          description='Controls the top hero banner headline ("Stories for the curious traveller"), badge, description, and hero cover photo on /blogs.'
          isOpen={isHeroOpen}
          onToggle={() => setIsHeroOpen(!isHeroOpen)}
        />

        {isHeroOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveHero();
            }}
            className="mt-6 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Eyebrow Badge"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                placeholder="e.g. The Kokalachi Journal"
              />
              <InputField
                label="Main Title Word / Prefix"
                value={heroTitleLead}
                onChange={(e) => setHeroTitleLead(e.target.value)}
                placeholder="e.g. Stories for the"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Script Accent Text (Underlined)"
                value={heroTitleAccent}
                onChange={(e) => setHeroTitleAccent(e.target.value)}
                placeholder="e.g. curious traveller."
              />
              <InputField
                label="Image Alt Text"
                value={heroAlt}
                onChange={(e) => setHeroAlt(e.target.value)}
                placeholder="e.g. The Kokalachi Journal"
              />
            </div>

            <ImagePickerField
              label="Hero Background Image"
              value={heroImage}
              onChange={(val) => setHeroImage(val)}
              placeholder="https://..."
            />

            <TextAreaField
              label="Hero Description"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              rows={2}
              placeholder="Honest guides, little rituals and real stories from the road..."
            />

            <div className="pt-4 border-t border-gray-100">
              <SaveButton loading={heroLoading} saved={heroSaved} onClick={handleSaveHero} />
            </div>
          </form>
        )}
      </div>

      {/* Expandable Section 2: Blog Page Accents & Bottom CTA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
        <SectionHeader
          title="Blog Page Accents & Bottom CTA"
          description='Controls the section kicker ("Fresh off the press"), chai note, and bottom brewing story CTA box on /blogs.'
          isOpen={isCtaOpen}
          onToggle={() => setIsCtaOpen(!isCtaOpen)}
        />

        {isCtaOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveCta();
            }}
            className="mt-6 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Section Kicker Tag"
                value={kicker}
                onChange={(e) => setKicker(e.target.value)}
                placeholder="e.g. Fresh off the press"
              />
              <InputField
                label="Featured Story Chai Note (Script font)"
                value={chaiNote}
                onChange={(e) => setChaiNote(e.target.value)}
                placeholder="e.g. grab a chai first ☕"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Bottom Brewing Title (Script font)"
                value={brewingTitle}
                onChange={(e) => setBrewingTitle(e.target.value)}
                placeholder="e.g. more stories brewing…"
              />
              <InputField
                label="CTA Button Label"
                value={ctaBtnText}
                onChange={(e) => setCtaBtnText(e.target.value)}
                placeholder="e.g. Find your journey"
              />
            </div>

            <InputField
              label="CTA Button Target URL"
              value={ctaBtnUrl}
              onChange={(e) => setCtaBtnUrl(e.target.value)}
              placeholder="e.g. /journeys"
            />

            <TextAreaField
              label="Bottom Brewing Description"
              value={brewingDescription}
              onChange={(e) => setBrewingDescription(e.target.value)}
              rows={2}
              placeholder="Packing lists, route guides and traveller memoirs are on their way..."
            />

            <div className="pt-4 border-t border-gray-100">
              <SaveButton loading={ctaLoading} saved={ctaSaved} onClick={handleSaveCta} />
            </div>
          </form>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search stories by title, author, or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0E5A60] focus:ring-1 focus:ring-[#0E5A60] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#0E5A60] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold">
            {["All", "Published", "Draft"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E5A60]" />
          <p className="text-xs text-slate-400 font-semibold">
            Loading Kokalachi Journal stories...
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF5EE] text-[#D96C2C] flex items-center justify-center mb-4">
            <Feather className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-800 mb-1">No stories found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
            {search || categoryFilter !== "All" || statusFilter !== "All"
              ? "No stories match your current search or filters. Try adjusting them."
              : "Start by writing and publishing your very first slow-travel story!"}
          </p>
          <Link
            href="/blogs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A60] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#0B2A3D] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Write Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col relative"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {post.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.heroImage}
                    alt={post.heroAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Feather className="w-10 h-10" />
                  </div>
                )}

                {/* Subtle top gradient overlay */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

                {/* Category Badge (Top Left) */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
                    {post.category || "Story"}
                  </span>
                </div>

                {/* Publish Toggle Button (Top Right) */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer backdrop-blur-md border ${
                    post.isPublished
                      ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/90"
                      : "bg-slate-950/80 border-white/20 text-slate-300 hover:bg-slate-900/90"
                  }`}
                  title={post.isPublished ? "Click to set as Draft" : "Click to Publish"}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      post.isPublished ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {post.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Featured Badge */}
                  {post.isFeatured && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-300/80 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" /> Featured
                        Story
                      </span>
                    </div>
                  )}

                  <h3 className="font-serif font-bold text-lg text-[#0E5A60] leading-snug line-clamp-2 mb-2 group-hover:text-[#D96C2C] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt || "No excerpt summary provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-4">
                    <span className="flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-[#D96C2C]" />
                      {post.author || "Team Kokalachi"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D96C2C]" />
                      {post.publishedAt || "No date"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`https://kokalachi.com/blogs/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                      title="View on website"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Live
                    </a>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/blogs/edit/${post.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0E5A60]/10 hover:bg-[#0E5A60] text-[#0E5A60] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setPostToDelete({ id: post.id, title: post.title })}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        title="Delete Blog Story"
        itemName={postToDelete?.title}
        message="Are you sure you want to permanently delete this story? Any associated Cloudinary images will also be cleaned up."
        confirmLabel="Yes, Delete Story"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!deleteLoading) setPostToDelete(null);
        }}
      />
    </section>
  );
}
