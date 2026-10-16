"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Search,
  BookOpen,
  Tags,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { BlogsHeroSection, BlogCategoryModal } from "./components";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishDate: string;
  readTime: string;
  author: string;
  excerpt: string;
  coverImage?: string;
  isPublished?: boolean;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export default function BlogsCMSPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [sections, setSections] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      const [blogsRes, categoriesRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/blogs/categories"),
      ]);

      const blogsJson = await blogsRes.json();
      const catJson = await categoriesRes.json();

      if (blogsJson.success) {
        setBlogs(blogsJson.data.blogs || []);
        setSections(blogsJson.data.sections || {});
      }

      if (catJson.success && Array.isArray(catJson.data)) {
        setCategories(catJson.data);
      }
    } catch {
      toast.error("Failed to load technical articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Article deleted successfully");
        fetchBlogsData();
      } else {
        toast.error(json.error || "Failed to delete article");
      }
    } catch {
      toast.error("Network error deleting article");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat =
      selectedCategory === "ALL" || b.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Technical Articles & Insights"
          description="Manage educational guides, engine oil maintenance recommendations, and machinery lubrication articles."
        />
        <Link
          href="/static-pages/blogs/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8232A] hover:bg-[#b51b21] text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-[0_0_20px_rgba(216,35,42,0.35)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      {/* 1. Hero Banner Management */}
      <BlogsHeroSection initialData={sections.BlogsHero} />

      {/* Category Pills & Search Filter Card with Fixed Bottom Category Action */}
      <div className="flex flex-col gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        {/* Row 1: Scrollable Category Pills + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar flex-1 min-w-0">
            {/* ALL Tab */}
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "ALL"
                  ? "bg-[#D8232A] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>ALL</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === "ALL"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {blogs.length}
              </span>
            </button>

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              const count =
                cat.count ??
                blogs.filter((b) => b.category?.toLowerCase() === cat.name.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#D8232A] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium focus:ring-1 focus:ring-[#D8232A] focus:border-[#D8232A] outline-none"
            />
          </div>
        </div>

        {/* Row 2: Fixed Bottom Side of Card for Category Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100/80">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
            <span>{categories.length} Categories</span>
            <span>•</span>
            <span>
              Showing {filteredBlogs.length} of {blogs.length} articles
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50/70 hover:bg-red-100/80 text-[#D8232A] text-xs font-bold rounded-full border border-[#D8232A]/20 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#D8232A]" />
            <span>Add / Manage Categories</span>
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm animate-pulse flex flex-col items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-[#D8232A] animate-spin" />
          <span>Loading articles...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500 flex flex-col items-center justify-center gap-2">
          <BookOpen className="w-10 h-10 text-gray-300" />
          <p className="font-bold text-gray-800">No articles found</p>
          <p className="text-xs text-gray-400">
            Click &quot;Add Article&quot; to publish a new technical lubrication guide.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#D8232A]">
                    {b.category}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {b.readTime}
                  </span>
                </div>

                {b.coverImage && (
                  <Link
                    href={`/static-pages/blogs/edit/${b.id}`}
                    className="w-full h-44 bg-gray-100 rounded-2xl mb-4 overflow-hidden border border-gray-100 block group-hover:border-[#D8232A]/30 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D8232A]" />
                  <span>{b.publishDate}</span>
                </div>

                <Link
                  href={`/static-pages/blogs/edit/${b.id}`}
                  className="font-bold text-base text-gray-900 group-hover:text-[#D8232A] transition-colors line-clamp-2 leading-snug block"
                >
                  {b.title}
                </Link>

                {b.excerpt && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {b.author || "HPCL Division"}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/static-pages/blogs/edit/${b.id}`}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    title="Edit Article"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(b.id, b.title)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Management Modal */}
      <BlogCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesUpdated={fetchBlogsData}
      />
    </section>
  );
}
