"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Clock,
  BookOpen,
  Sparkles,
  PenTool,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SelectField } from "@/components/SelectField";
import { ImageUploadField } from "@/components/ImageUploadField";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SaveButton } from "@/components/SaveButton";
import { BlogCategoryModal } from "./BlogCategoryModal";
import { uploadFiles } from "@/lib/uploadHelpers";

interface BlogFormProps {
  blogId?: string;
  isNew?: boolean;
}

interface CategoryOption {
  value: string;
  label: string;
}

export function BlogForm({ blogId, isNew = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Categories
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    { value: "Automotive", label: "Automotive" },
    { value: "Industrial", label: "Industrial" },
    { value: "Bike Oils", label: "Bike Oils" },
    { value: "Specialties", label: "Specialties" },
  ]);

  // Core Metadata
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Automotive");
  const [publishDate, setPublishDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  );
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImages, setCoverImages] = useState<(File | string | null)[]>([]);

  // Rich Text Editor Content
  const [editorContent, setEditorContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blogs/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const opts = json.data.map((c: any) => ({
          value: c.name,
          label: c.name,
        }));
        setCategoryOptions(opts);
      }
    } catch {
      // Keep defaults
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Convert structured sections into HTML if loading existing blog
  const convertSectionsToHtml = (contentObj: any): string => {
    if (!contentObj) return "";
    if (typeof contentObj === "string") return contentObj;
    if (contentObj.bodyHtml) return contentObj.bodyHtml;

    let html = "";
    if (contentObj.intro) {
      html += `<p>${contentObj.intro}</p>`;
    }

    if (Array.isArray(contentObj.sections)) {
      contentObj.sections.forEach((sec: any) => {
        if (sec.heading) html += `<h2>${sec.heading}</h2>`;
        if (Array.isArray(sec.paragraphs)) {
          sec.paragraphs.forEach((p: string) => {
            if (p) html += `<p>${p}</p>`;
          });
        }
        if (Array.isArray(sec.bulletPoints) && sec.bulletPoints.length > 0) {
          html += `<ul>${sec.bulletPoints.map((b: string) => `<li>${b}</li>`).join("")}</ul>`;
        }
      });
    }

    if (contentObj.conclusion) {
      html += `<blockquote><strong>Takeaway:</strong> ${contentObj.conclusion}</blockquote>`;
    }

    return html;
  };

  // Load Blog Data if editing
  useEffect(() => {
    async function loadBlog() {
      if (isNew || !blogId) return;

      try {
        setFetching(true);
        const res = await fetch(`/api/blogs?id=${blogId}`);
        const json = await res.json();
        if (json.success && json.data) {
          const b = json.data;
          setTitle(b.title || "");
          setSlug(b.slug || "");
          setCategory(b.category || "Automotive");
          setPublishDate(b.publishDate || "");
          setReadTime(b.readTime || "");
          setAuthor(b.author || "");
          setExcerpt(b.excerpt || "");
          setCoverImages(b.coverImage ? [b.coverImage] : []);

          const initialHtml = convertSectionsToHtml(b.content);
          setEditorContent(initialHtml);
          setIsPublished(b.isPublished !== false);
        } else {
          toast.error("Article not found");
          router.push("/static-pages/blogs");
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        toast.error("Failed to load article");
      } finally {
        setFetching(false);
      }
    }
    loadBlog();
  }, [blogId, isNew, router]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Article title and URL slug are required");
      return;
    }

    setLoading(true);

    try {
      let finalCoverUrl = "";
      const validImages = coverImages.filter((img): img is File | string => !!img);
      if (validImages.length > 0) {
        const [uploaded] = await uploadFiles(validImages);
        finalCoverUrl = uploaded || "";
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        category,
        publishDate: publishDate.trim(),
        readTime: readTime.trim(),
        author: author.trim(),
        excerpt: excerpt.trim(),
        coverImage: finalCoverUrl,
        content: {
          bodyHtml: editorContent,
          intro: excerpt.trim(),
        },
        isPublished,
      };

      const url = "/api/blogs";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? payload : { ...payload, id: blogId }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(isNew ? "Article created successfully!" : "Article updated successfully!");
        router.push("/static-pages/blogs");
      } else {
        toast.error(json.error || "Failed to save article");
      }
    } catch {
      toast.error("Network error saving article");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 text-center text-gray-400 text-sm animate-pulse flex flex-col items-center justify-center gap-3">
        <FileText className="w-8 h-8 text-[#D8232A] animate-spin" />
        <span>Loading article details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-16">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/static-pages/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#D8232A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles List
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isNew ? "Create New Article" : `Edit Article: ${title || "Untitled"}`}
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Compose and format industrial lubrication guides with the full Rich Text Editor.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/static-pages/blogs"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <SaveButton loading={loading} label="Save Changes" className="w-auto px-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Core Article Content & Rich Text Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card 1: Identification & Metadata */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D8232A]" />
              1. Article Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Article Title *"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How Often Should You Change Your Engine Oil?"
                required
              />
              <InputField
                label="URL Slug *"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. how-often-should-you-change-your-engine-oil"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Category *</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D8232A] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                </div>
                <SelectField
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categoryOptions}
                />
              </div>

              <InputField
                label="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="HPCL Lubricants Technical Team"
              />
              <InputField
                label="Estimated Read Time"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 6 min read"
              />
            </div>

            <TextAreaField
              label="Article Short Excerpt (Card Summary)"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 2-line summary displayed on public blog cards..."
            />
          </div>

          {/* Card 2: Visual Rich Text Editor */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#D8232A]" />
                2. Article Body (Rich Text Editor)
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">WYSIWYG Mode</span>
            </div>

            <RichTextEditor
              label="Full Article Content"
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Write your complete technical guide, format headings (H2, H3), add bullet lists, blockquotes, and links..."
              tooltip="Use toolbar to format headings, lists, bold text, and blockquotes."
              minHeight="380px"
            />
          </div>
        </div>

        {/* Right Column (1 Col): Cover Graphic, Publishing Settings */}
        <div className="flex flex-col gap-6">
          {/* Card 3: Cover Graphic */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D8232A]" />
              Article Cover Graphic
            </h3>

            <ImageUploadField
              label="Cover Image"
              images={coverImages}
              onImagesChange={setCoverImages}
              maxImages={1}
              tooltip="Upload blog cover image (recommended 1200x630px)."
            />
          </div>

          {/* Card 4: Publication Controls */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D8232A]" />
              Publication & Visibility
            </h3>

            <InputField
              label="Display Date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              placeholder="October 14, 2025"
            />

            <label className="flex items-start gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="mt-0.5 rounded text-[#D8232A] focus:ring-[#D8232A] cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Publish Live</span>
                <span className="text-[11px] text-gray-500 leading-snug">
                  Article will be visible on the public website.
                </span>
              </div>
            </label>

            <div className="pt-3 border-t border-gray-100">
              <SaveButton
                loading={loading}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal for quick category creation */}
      <BlogCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesUpdated={() => {
          fetchCategories();
        }}
      />
    </form>
  );
}
