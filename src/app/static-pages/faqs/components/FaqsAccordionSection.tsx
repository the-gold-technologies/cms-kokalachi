"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, FolderPlus } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

interface DeleteTarget {
  type: "category" | "question";
  catIndex: number;
  qIndex?: number;
  title: string;
  name: string;
  message: string;
}

export function FaqsAccordionSection({ initialData }: { initialData?: any }) {
  // Collapsed by default across CMS
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sidebarTitle, setSidebarTitle] = useState("Browse by topic");
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Global Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    if (initialData) {
      setSidebarTitle(initialData.sidebarTitle || "Browse by topic");
      if (Array.isArray(initialData.categories)) {
        setCategories(initialData.categories);
        // By default collapse categories or open first
        if (initialData.categories.length > 0) {
          setExpandedCategories({
            [initialData.categories[0].id || "0"]: true,
          });
        }
      }
    }
  }, [initialData]);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleAddCategory = () => {
    const newId = `topic-${Date.now().toString(36)}`;
    const newCategory: FaqCategory = {
      id: newId,
      title: "New Category",
      items: [
        {
          question: "What is your question?",
          answer: "Write a detailed and clear response here.",
        },
      ],
    };
    setCategories((prev) => [...prev, newCategory]);
    setExpandedCategories((prev) => ({ ...prev, [newId]: true }));
    toast.success("New category added");
  };

  const requestDeleteCategory = (catIndex: number) => {
    const cat = categories[catIndex];
    setDeleteTarget({
      type: "category",
      catIndex,
      title: "Delete Category",
      name: cat?.title || "Untitled Category",
      message: `Are you sure you want to permanently delete "${cat?.title || "this category"}" and all its ${cat?.items?.length || 0} questions? This action cannot be undone.`,
    });
  };

  const requestDeleteQuestion = (catIndex: number, qIndex: number) => {
    const q = categories[catIndex]?.items?.[qIndex];
    setDeleteTarget({
      type: "question",
      catIndex,
      qIndex,
      title: "Delete FAQ Question",
      name: q?.question || "Question & Answer Pair",
      message:
        "Are you sure you want to delete this question and answer? This action cannot be undone.",
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "category") {
      setCategories((prev) => prev.filter((_, idx) => idx !== deleteTarget.catIndex));
      toast.success("Category deleted successfully");
    } else if (deleteTarget.type === "question" && deleteTarget.qIndex !== undefined) {
      setCategories((prev) => {
        const copy = [...prev];
        const targetCat = { ...copy[deleteTarget.catIndex] };
        targetCat.items = targetCat.items.filter((_, idx) => idx !== deleteTarget.qIndex);
        copy[deleteTarget.catIndex] = targetCat;
        return copy;
      });
      toast.success("Question deleted successfully");
    }

    setDeleteTarget(null);
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    setCategories((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });
  };

  const handleUpdateCategoryField = (catIndex: number, field: "title" | "id", val: string) => {
    setCategories((prev) => {
      const copy = [...prev];
      copy[catIndex] = { ...copy[catIndex], [field]: val };
      return copy;
    });
  };

  const handleAddQuestion = (catIndex: number) => {
    setCategories((prev) => {
      const copy = [...prev];
      const targetCat = { ...copy[catIndex] };
      targetCat.items = [
        ...targetCat.items,
        {
          question: "",
          answer: "",
        },
      ];
      copy[catIndex] = targetCat;
      return copy;
    });
  };

  const handleMoveQuestion = (catIndex: number, qIndex: number, direction: "up" | "down") => {
    setCategories((prev) => {
      const copy = [...prev];
      const targetCat = { ...copy[catIndex] };
      const items = [...targetCat.items];
      const newIndex = direction === "up" ? qIndex - 1 : qIndex + 1;
      if (newIndex < 0 || newIndex >= items.length) return prev;
      const temp = items[qIndex];
      items[qIndex] = items[newIndex];
      items[newIndex] = temp;
      targetCat.items = items;
      copy[catIndex] = targetCat;
      return copy;
    });
  };

  const handleUpdateQuestion = (
    catIndex: number,
    qIndex: number,
    field: "question" | "answer",
    val: string,
  ) => {
    setCategories((prev) => {
      const copy = [...prev];
      const targetCat = { ...copy[catIndex] };
      const items = [...targetCat.items];
      items[qIndex] = { ...items[qIndex], [field]: val };
      targetCat.items = items;
      copy[catIndex] = targetCat;
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        sidebarTitle,
        categories,
      };

      const res = await fetch("/api/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "FaqsAccordionSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("FAQ topics and questions saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving FAQ Accordion section");
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="FaqsAccordionSection"
          description={`Topic categories and accordion FAQ entries (${categories.length} categories, ${totalQuestions} questions).`}
          badge="Section 2"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div className="flex-1 w-full sm:w-auto">
                  <InputField
                    label="Sidebar Navigation Title"
                    value={sidebarTitle}
                    onChange={(e) => setSidebarTitle(e.target.value)}
                    placeholder="e.g. Browse by topic"
                    tooltip="Label displayed above the sticky sidebar topic menu"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="mt-2 sm:mt-5 inline-flex items-center gap-2 px-4 py-3 bg-[#0E5A60] hover:bg-[#08383C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories list */}
              <div className="flex flex-col gap-5">
                {categories.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">
                      No categories yet. Click "Add Category" to start adding FAQs.
                    </p>
                  </div>
                ) : (
                  categories.map((category, catIndex) => {
                    const isCatOpen = !!expandedCategories[category.id || catIndex.toString()];

                    return (
                      <div
                        key={category.id || catIndex}
                        className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs transition-all"
                      >
                        {/* Category Header */}
                        <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div
                            onClick={() => toggleCategoryExpand(category.id || catIndex.toString())}
                            className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-[200px]"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#0E5A60]/10 text-[#0E5A60] text-xs font-bold flex items-center justify-center shrink-0">
                              {catIndex + 1}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">
                                {category.title || "Untitled Category"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                id: #{category.id} • {category.items?.length || 0} questions
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(catIndex, "up")}
                              disabled={catIndex === 0}
                              className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-200/50 transition-colors"
                              title="Move category up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(catIndex, "down")}
                              disabled={catIndex === categories.length - 1}
                              className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-200/50 transition-colors"
                              title="Move category down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDeleteCategory(catIndex)}
                              className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                toggleCategoryExpand(category.id || catIndex.toString())
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors ml-1"
                            >
                              {isCatOpen ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Category Body */}
                        {isCatOpen && (
                          <div className="p-5 sm:p-6 flex flex-col gap-6 bg-white animate-in fade-in duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                              <InputField
                                label="Category Title"
                                value={category.title}
                                onChange={(e) =>
                                  handleUpdateCategoryField(catIndex, "title", e.target.value)
                                }
                                placeholder="e.g. Safety & Comfort"
                              />
                              <InputField
                                label="Anchor / Section ID"
                                value={category.id}
                                onChange={(e) =>
                                  handleUpdateCategoryField(
                                    catIndex,
                                    "id",
                                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                                  )
                                }
                                placeholder="e.g. safety-and-comfort"
                                tooltip="URL anchor link for the sticky sidebar to scroll to"
                              />
                            </div>

                            {/* Q&A Items */}
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                  Questions in this Topic ({category.items?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestion(catIndex)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Question</span>
                                </button>
                              </div>

                              {!category.items || category.items.length === 0 ? (
                                <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-400">
                                  No questions in this category yet. Click "Add Question" above.
                                </div>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {category.items.map((item, qIndex) => (
                                    <div
                                      key={qIndex}
                                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col gap-3 transition-colors"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#0E5A60]">
                                          <span className="w-5 h-5 rounded-full bg-[#0E5A60] text-white flex items-center justify-center text-[10px]">
                                            Q{qIndex + 1}
                                          </span>
                                          <span>Question & Answer Pair</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleMoveQuestion(catIndex, qIndex, "up")
                                            }
                                            disabled={qIndex === 0}
                                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                            title="Move question up"
                                          >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleMoveQuestion(catIndex, qIndex, "down")
                                            }
                                            disabled={qIndex === category.items.length - 1}
                                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                            title="Move question down"
                                          >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => requestDeleteQuestion(catIndex, qIndex)}
                                            className="p-1 text-red-400 hover:text-red-600 rounded ml-1"
                                            title="Delete question"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      <InputField
                                        label="Question"
                                        value={item.question}
                                        onChange={(e) =>
                                          handleUpdateQuestion(
                                            catIndex,
                                            qIndex,
                                            "question",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="e.g. Is Kokalachi safe for solo travellers?"
                                      />

                                      <TextAreaField
                                        label="Answer"
                                        value={item.answer}
                                        onChange={(e) =>
                                          handleUpdateQuestion(
                                            catIndex,
                                            qIndex,
                                            "answer",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Write the detailed answer that appears when the accordion opens..."
                                        rows={3}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <SaveButton
                  loading={loading}
                  saved={saved}
                  onClick={handleSave}
                  label="Save FAQ Topics & Questions"
                  className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || "Delete Item"}
        itemName={deleteTarget?.name}
        message={
          deleteTarget?.message ||
          "Are you sure you want to delete this item? This action cannot be undone."
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}
