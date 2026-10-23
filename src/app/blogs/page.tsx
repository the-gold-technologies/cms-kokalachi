"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
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
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPosts(json.data);
      } else {
        toast.error(json.error || "Failed to load blog stories");
      }
    } catch {
      toast.error("Network error loading stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.heroLead.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && p.isPublished) ||
      (statusFilter === "Draft" && !p.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section className="flex flex-col gap-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-3">
            The Kokalachi Journal
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-[#FAF5EE] text-[#D96C2C] border border-[#D96C2C]/20">
              {posts.length} {posts.length === 1 ? "Story" : "Stories"}
            </span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Curate, craft, and publish slow-travel stories, first-timer guides, and memoirs.
          </p>
        </div>

        <Link
          href="/blogs/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E5A60] hover:bg-[#0B2A3D] text-white font-semibold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Write New Story
        </Link>
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
          <p className="text-xs text-slate-400 font-semibold">Loading Kokalachi Journal stories...</p>
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

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D96C2C] text-white shadow-sm">
                    {post.category || "Story"}
                  </span>
                  {post.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {/* Publish Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer backdrop-blur-xs ${
                    post.isPublished
                      ? "bg-emerald-600/90 hover:bg-emerald-700 text-white"
                      : "bg-slate-800/80 hover:bg-slate-900 text-slate-200"
                  }`}
                  title={post.isPublished ? "Click to set as Draft" : "Click to Publish"}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      post.isPublished ? "bg-emerald-300 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {post.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
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
