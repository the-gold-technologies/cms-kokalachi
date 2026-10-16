"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Tags, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface BlogCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated?: () => void;
}

export function BlogCategoryModal({
  isOpen,
  onClose,
  onCategoriesUpdated,
}: BlogCategoryModalProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingCat, setEditingCat] = useState<BlogCategory | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs/categories");
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const startEdit = (cat: BlogCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Category name and slug are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
      };

      const url = "/api/blogs/categories";
      const method = editingCat ? "PUT" : "POST";
      const body = editingCat
        ? JSON.stringify({ ...payload, id: editingCat.id })
        : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const json = await res.json();
      if (json.success) {
        toast.success(
          editingCat ? "Category updated successfully!" : "Category created successfully!",
        );
        resetForm();
        fetchCategories();
        if (onCategoriesUpdated) onCategoriesUpdated();
      } else {
        toast.error(json.error || "Failed to save category");
      }
    } catch {
      toast.error("Network error saving category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/blogs/categories?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
        if (onCategoriesUpdated) onCategoriesUpdated();
      } else {
        toast.error(json.error || "Failed to delete category");
      }
    } catch {
      toast.error("Network error deleting category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D8232A] flex items-center justify-center font-bold">
              <Tags className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Manage Blog Categories</h3>
              <p className="text-xs text-gray-400 font-medium">
                Create and organize categories for educational lubrication articles.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-7 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Add / Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D8232A]" />
                {editingCat ? `Edit: ${editingCat.name}` : "Add New Blog Category"}
              </span>
              {editingCat && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Category Name *"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Synthetic Greases"
                required
              />
              <InputField
                label="URL Slug *"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. synthetic-greases"
                required
              />
            </div>

            <TextAreaField
              label="Short Description (Optional)"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of articles in this category..."
            />

            <div className="pt-2">
              <SaveButton
                loading={submitting}
                label={editingCat ? "Update Category" : "Add Category"}
                className="w-full py-3 text-xs font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Existing Categories ({categories.length})
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                No categories found. Use the form above to add your first category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 flex items-start justify-between gap-3 group hover:border-[#D8232A]/30 hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{cat.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#D8232A] shrink-0">
                          {cat.count ?? 0} {cat.count === 1 ? "article" : "articles"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 truncate">
                        slug: {cat.slug}
                      </span>
                      {cat.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
