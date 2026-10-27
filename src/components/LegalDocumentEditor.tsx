"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SaveButton } from "@/components/SaveButton";

export interface LegalDoc {
  slug?: string;
  title: string;
  description: string;
  updatedOn: string;
  intro: string;
  questionsEmail?: string;
  bodyHtml?: string;
}

interface LegalDocumentEditorProps {
  pageTitle: string;
  pageDescription: string;
  apiEndpoint: string;
  documentName: string;
  bodyLabel?: string;
}

export function LegalDocumentEditor({
  pageTitle,
  pageDescription,
  apiEndpoint,
  documentName,
  bodyLabel,
}: LegalDocumentEditorProps) {
  // Document metadata state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updatedOn, setUpdatedOn] = useState("");
  const [intro, setIntro] = useState("");
  const [questionsEmail, setQuestionsEmail] = useState("hello@kokalachi.com");

  // Rich Text Editor HTML content
  const [bodyHtml, setBodyHtml] = useState("");

  // Collapsed by default
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);

  // Independent Loading & Saved states
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);

  const [bodyLoading, setBodyLoading] = useState(false);
  const [bodySaved, setBodySaved] = useState(false);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(apiEndpoint);
        const json = await res.json();
        if (json.success && json.data) {
          const loadedDoc: LegalDoc =
            json.data.LegalDocumentSection ||
            json.data.doc ||
            json.data || {};

          setTitle(loadedDoc.title || "");
          setDescription(loadedDoc.description || "");
          setUpdatedOn(loadedDoc.updatedOn || "");
          setIntro(loadedDoc.intro || "");
          setQuestionsEmail(loadedDoc.questionsEmail || "hello@kokalachi.com");
          setBodyHtml(loadedDoc.bodyHtml || "");
        }
      } catch (err) {
        console.error("Failed to load legal document:", err);
        toast.error("Failed to load document content");
      }
    }
    loadData();
  }, [apiEndpoint]);

  // Helper to persist document state to API
  const saveDocumentPayload = async (customOverrides?: Partial<LegalDoc>) => {
    const slug = apiEndpoint.includes("privacy") ? "privacy-policy" : "terms";

    const docPayload: LegalDoc = {
      slug,
      title: title.trim(),
      description: description.trim(),
      updatedOn: updatedOn.trim(),
      intro: intro.trim(),
      questionsEmail: questionsEmail.trim(),
      bodyHtml,
      ...customOverrides,
    };

    const res = await fetch(apiEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ LegalDocumentSection: docPayload }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to save document");
    }
    return json;
  };

  // 1. Save Document Details (Overview)
  const handleSaveDetails = async () => {
    setDetailsLoading(true);
    setDetailsSaved(false);
    try {
      await saveDocumentPayload();
      setDetailsSaved(true);
      toast.success(`${documentName} details saved successfully!`);
      setTimeout(() => setDetailsSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save document details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // 2. Save Document Body Content
  const handleSaveBody = async () => {
    setBodyLoading(true);
    setBodySaved(false);
    try {
      await saveDocumentPayload();
      setBodySaved(true);
      toast.success(`${documentName} body content saved successfully!`);
      setTimeout(() => setBodySaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save body content");
    } finally {
      setBodyLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      <PageHeader title={pageTitle} description={pageDescription} />

      {/* 1. Document Overview Card (Collapsed by default) */}
      <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
        <SectionHeader
          title="1. Document Details"
          description="Header title, lead intro text, updated date, and support email."
          badge="Overview"
          isOpen={detailsOpen}
          onToggle={() => setDetailsOpen(!detailsOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            detailsOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Terms & Conditions"
              />
              <InputField
                label="Last Updated Date (YYYY-MM-DD or text)"
                value={updatedOn}
                onChange={(e) => setUpdatedOn(e.target.value)}
                placeholder="e.g. 2026-10-25"
                tooltip="Displayed in the header banner as Last updated date"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Questions Support Email"
                value={questionsEmail}
                onChange={(e) => setQuestionsEmail(e.target.value)}
                placeholder="e.g. hello@kokalachi.com"
                tooltip="Recipient for inquiries in the bottom callout card"
              />
              <InputField
                label="Document Subtitle / Short Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. The terms that apply when you use the Kokalachi website..."
              />
            </div>

            <TextAreaField
              label="Lead Introduction Paragraph"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Introductory paragraph shown prominently below the hero heading..."
              rows={3}
            />

            {/* Dedicated Save Button for Document Details */}
            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={detailsLoading}
                saved={detailsSaved}
                onClick={handleSaveDetails}
                label={`Save ${documentName} Details`}
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </article>

      {/* 2. Document Body Content Card (Collapsed by default) */}
      <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
        <SectionHeader
          title={`2. ${bodyLabel || `${documentName} Body Content`}`}
          description="Format paragraphs, headings, bullet lists, blockquotes, and upload inline images."
          badge="Content"
          isOpen={bodyOpen}
          onToggle={() => setBodyOpen(!bodyOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            bodyOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-6 pt-2">
            <RichTextEditor
              value={bodyHtml}
              onChange={setBodyHtml}
              placeholder={`Start writing ${documentName.toLowerCase()} content here with headings, paragraphs, bullet points, and images...`}
              minHeight="480px"
            />

            {/* Dedicated Save Button for Document Body Content */}
            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={bodyLoading}
                saved={bodySaved}
                onClick={handleSaveBody}
                label={`Save ${documentName} Body Content`}
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
