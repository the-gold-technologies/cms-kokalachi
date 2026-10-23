"use client";

import React, { useState, useRef } from "react";
import {
  Lightbulb,
  Quote,
  Image as ImageIcon,
  Mail,
  ListOrdered,
  CheckSquare,
  Eye,
  Edit3,
  Link2,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { ImagePickerField } from "@/components/ImagePickerField";
import { storyTextToBlocks } from "@/lib/blogContentParser";

interface ChapterStoryEditorProps {
  content: string;
  onChange: (val: string) => void;
  chapterTitle?: string;
  chapterKicker?: string;
  chapterNumber?: number | null;
}

export function ChapterStoryEditor({
  content,
  onChange,
  chapterTitle = "",
  chapterKicker,
  chapterNumber,
}: ChapterStoryEditorProps) {
  const [activeView, setActiveView] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Polaroid Modal State (clean, empty by default)
  const [showPolaroidModal, setShowPolaroidModal] = useState(false);
  const [polaroidSrc, setPolaroidSrc] = useState("");
  const [polaroidAlt, setPolaroidAlt] = useState("");
  const [polaroidCaption, setPolaroidCaption] = useState("");

  // Postcard Modal State (clean, empty by default)
  const [showPostcardModal, setShowPostcardModal] = useState(false);
  const [postcardText, setPostcardText] = useState("");
  const [postcardSignature, setPostcardSignature] = useState("");

  /**
   * Inserts snippet at current cursor position (or at end) and places
   * cursor precisely inside the block for immediate typing.
   */
  const insertSnippet = (snippet: string, cursorOffsetFromStart?: number) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(content ? `${content.trim()}\n\n${snippet}\n\n` : `${snippet}\n\n`);
      return;
    }

    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const before = content.substring(0, start);
    const after = content.substring(end);

    const prefix =
      before.endsWith("\n\n") || before === "" ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const suffix =
      after.startsWith("\n\n") || after === "" ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const newContent = `${before}${prefix}${snippet}${suffix}${after}`;
    onChange(newContent);

    setTimeout(() => {
      el.focus();
      const targetPos =
        cursorOffsetFromStart !== undefined
          ? start + prefix.length + cursorOffsetFromStart
          : start + prefix.length + snippet.length;
      el.setSelectionRange(targetPos, targetPos);
    }, 50);
  };

  // Insert EMPTY blocks with cursor placed directly between tags
  const handleInsertTip = () => {
    // ":::tip\n\n:::" has length 10. Offset 8 puts cursor right on the empty line inside!
    insertSnippet(":::tip\n\n:::", 8);
  };

  const handleInsertQuote = () => {
    // ":::quote\n\n:::" has length 12. Offset 10 puts cursor right on the empty line inside!
    insertSnippet(":::quote\n\n:::", 10);
  };

  const handleInsertCards = () => {
    // Offset 19 puts cursor right after "- **Title:** "
    insertSnippet(":::cards\n- **Title:** \n:::", 19);
  };

  const handleInsertChecks = () => {
    // Offset 20 puts cursor right after "- **Title:** "
    insertSnippet(":::checks\n- **Title:** \n:::", 20);
  };

  const handleInsertLink = () => {
    const el = textareaRef.current;
    if (el && el.selectionStart !== el.selectionEnd) {
      const selected = content.substring(el.selectionStart, el.selectionEnd);
      insertSnippet(`[${selected}](url)`, selected.length + 3);
    } else {
      insertSnippet("[Link text](url)", 1);
    }
  };

  // Polaroid confirmation (clean without pre-added dummy text)
  const handleConfirmPolaroid = () => {
    if (!polaroidSrc.trim()) return;
    const lines = [":::polaroid"];
    lines.push(`src: ${polaroidSrc.trim()}`);
    if (polaroidAlt.trim()) lines.push(`alt: ${polaroidAlt.trim()}`);
    if (polaroidCaption.trim()) lines.push(`caption: ${polaroidCaption.trim()}`);
    lines.push(":::");
    insertSnippet(lines.join("\n"));

    setShowPolaroidModal(false);
    setPolaroidSrc("");
    setPolaroidAlt("");
    setPolaroidCaption("");
  };

  // Postcard confirmation (clean without pre-added dummy text)
  const handleConfirmPostcard = () => {
    if (!postcardText.trim()) return;
    const lines = [":::postcard"];
    if (postcardSignature.trim()) lines.push(`signature: ${postcardSignature.trim()}`);
    lines.push(`text: ${postcardText.trim()}`);
    lines.push(":::");
    insertSnippet(lines.join("\n"));

    setShowPostcardModal(false);
    setPostcardText("");
    setPostcardSignature("");
  };

  // Content metrics
  const parsedBlocks = storyTextToBlocks(content);
  const paragraphCount = parsedBlocks.filter((b) => b.type === "p").length;
  const scrapbookCount = parsedBlocks.filter((b) => b.type !== "p").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Editor Top Navigation & Action Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Scrapbook Insert Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D96C2C]" /> Insert:
          </span>

          <button
            type="button"
            onClick={handleInsertTip}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Insert an empty Kokalachi tip note"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            Tip Note
          </button>

          <button
            type="button"
            onClick={handleInsertQuote}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Insert an empty pull quote"
          >
            <Quote className="w-3.5 h-3.5 text-[#D96C2C]" />
            Pull Quote
          </button>

          <button
            type="button"
            onClick={() => {
              setPolaroidSrc("");
              setPolaroidAlt("");
              setPolaroidCaption("");
              setShowPolaroidModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0E5A60] border border-teal-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Upload or pick a Polaroid photo"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#0E5A60]" />
            Polaroid Photo
          </button>

          <button
            type="button"
            onClick={() => {
              setPostcardText("");
              setPostcardSignature("");
              setShowPostcardModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Insert a souvenir postcard"
          >
            <Mail className="w-3.5 h-3.5 text-rose-600" />
            Postcard
          </button>

          <button
            type="button"
            onClick={handleInsertCards}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Insert highlight cards"
          >
            <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
            Cards List
          </button>

          <button
            type="button"
            onClick={handleInsertChecks}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Insert a checklist"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            Checklist
          </button>

          <button
            type="button"
            onClick={handleInsertLink}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Insert markdown link [Label](/path)"
          >
            <Link2 className="w-3.5 h-3.5" />
            Link
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView("write")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "write"
                ? "bg-[#0E5A60] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write Story
          </button>

          <button
            type="button"
            onClick={() => setActiveView("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "preview"
                ? "bg-[#0E5A60] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Visual Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeView === "write" ? (
        <div className="p-4 sm:p-5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={14}
            placeholder={`Write your chapter story here...\n\nPress Enter twice (leave an empty line) to start a new paragraph.\n\nUse the toolbar buttons above to insert Kokalachi Tip Notes, Pull Quotes, Polaroid Photos, and Postcards.`}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-sans text-sm sm:text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] resize-y"
          />

          {/* Editor Status Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">
                {paragraphCount} {paragraphCount === 1 ? "paragraph" : "paragraphs"}
              </span>
              <span>·</span>
              <span className="font-semibold text-slate-700">
                {scrapbookCount} scrapbook {scrapbookCount === 1 ? "element" : "elements"}
              </span>
              <span>·</span>
              <span>{wordCount} words</span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              <span>
                Press Enter twice for paragraph breaks · Switch to Visual Preview to see rendered
                scrapbook!
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Scrapbook Preview */
        <div className="p-6 sm:p-8 bg-[#FAF5EE]/60 max-h-[640px] overflow-y-auto space-y-6">
          <div className="max-w-[700px] mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-amber-900/10 shadow-xs">
            {/* Chapter Header */}
            {chapterNumber != null ? (
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#D96C2C] leading-none">
                    {String(chapterNumber).padStart(2, "0")}
                  </span>
                  {chapterKicker && (
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A24] pb-1">
                      {chapterKicker}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E5A60] leading-tight">
                  {chapterTitle || "Untitled Chapter"}
                </h3>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-bold text-[#0E5A60]">
                  {chapterTitle || "Untitled Chapter"}
                </h3>
              </div>
            )}

            {/* Rendered Blocks */}
            <div className="space-y-6">
              {parsedBlocks.length === 0 ? (
                <p className="text-slate-400 italic text-sm text-center py-8">
                  No content written yet. Switch back to Write Story to begin!
                </p>
              ) : (
                parsedBlocks.map((block, idx) => {
                  if (block.type === "p") {
                    return (
                      <p
                        key={idx}
                        className="text-slate-700 text-[15px] sm:text-base leading-relaxed"
                      >
                        {renderRichTextWithLinks(block.text || "")}
                      </p>
                    );
                  }

                  if (block.type === "tip") {
                    return (
                      <div key={idx} className="relative my-8 mx-1 sm:mx-4 rotate-[-0.8deg]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#D96C2C]/25 border-y border-[#D96C2C]/20 rotate-[-4deg] z-10" />
                        <div className="bg-[#FFF6DF] border border-amber-900/10 rounded-2xl px-6 py-5 shadow-sm">
                          <p className="font-serif italic text-lg text-[#C85A24] flex items-center gap-2 mb-2 font-bold">
                            <Lightbulb size={18} className="text-[#D96C2C]" /> Kokalachi Tip
                          </p>
                          <p className="text-sm sm:text-[15px] text-[#5B4636] leading-relaxed">
                            {renderRichTextWithLinks(block.text || "")}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={idx}
                        className="my-8 py-2 pl-6 border-l-4 border-[#D96C2C] bg-orange-50/30 rounded-r-xl"
                      >
                        <p className="font-serif italic text-xl sm:text-2xl text-[#0E5A60] leading-snug">
                          &ldquo;{renderRichTextWithLinks(block.text || "")}&rdquo;
                        </p>
                      </blockquote>
                    );
                  }

                  if (block.type === "image") {
                    return (
                      <figure key={idx} className="my-8 flex justify-center">
                        <div className="relative bg-white p-3 pb-12 shadow-md rotate-[1.5deg] max-w-[500px] w-full border border-slate-200">
                          <div className="absolute -top-2 left-6 w-16 h-4 bg-[#FFF4E5] border-y border-amber-900/15 rotate-[-6deg]" />
                          <div className="absolute -top-2 right-6 w-16 h-4 bg-[#FFF4E5] border-y border-amber-900/15 rotate-[5deg]" />
                          {block.src ? (
                            <img
                              src={block.src}
                              alt={block.alt || "Polaroid photo"}
                              className="w-full aspect-[4/3] object-cover rounded-xs"
                            />
                          ) : (
                            <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                              [No image selected]
                            </div>
                          )}
                          <figcaption className="absolute bottom-3 left-0 right-0 text-center font-serif italic text-base sm:text-lg text-[#0E5A60]">
                            {block.caption || ""}
                          </figcaption>
                        </div>
                      </figure>
                    );
                  }

                  if (block.type === "postcard") {
                    return (
                      <div key={idx} className="my-8 flex justify-center">
                        <div className="relative w-full max-w-[520px] bg-[#FDFAF3] border border-amber-900/20 rounded-md shadow-md rotate-[-1.2deg] p-6">
                          <div className="absolute top-4 right-4 w-12 h-14 border-2 border-dashed border-[#D96C2C]/60 bg-[#D96C2C]/10 flex flex-col items-center justify-center rotate-3">
                            <span className="text-lg">🏔️</span>
                            <span className="text-[7px] font-bold text-[#C85A24] uppercase">
                              Kokalachi
                            </span>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C85A24] mb-3">
                            Souvenir Postcard
                          </p>
                          <p className="font-serif italic text-lg sm:text-xl text-[#0E5A60] leading-snug pr-12">
                            {block.text}
                            {block.signature && (
                              <span className="block mt-2 text-sm text-[#C85A24] font-semibold">
                                — {block.signature}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (block.type === "list") {
                    const isCards = block.style === "cards";
                    return (
                      <div key={idx} className="my-6 space-y-3">
                        {(block.items || []).map((item, itIdx) => (
                          <div
                            key={itIdx}
                            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                              isCards
                                ? "bg-white border-slate-200 shadow-2xs"
                                : "bg-emerald-50/40 border-emerald-200/50"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full bg-[#0E5A60] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {isCards ? itIdx + 1 : "✓"}
                            </span>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {item.title && (
                                <strong className="text-[#0E5A60] font-bold mr-1.5">
                                  {item.title}
                                </strong>
                              )}
                              {renderRichTextWithLinks(item.text)}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return null;
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: INSERT POLAROID PHOTO */}
      {showPolaroidModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0E5A60]" />
                Insert Polaroid Photo
              </h3>
              <button
                type="button"
                onClick={() => setShowPolaroidModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Upload or pick a photo from Cloudinary. It will be styled like a vintage tilted
              Polaroid with masking tape and handwritten caption.
            </p>

            <div className="space-y-4">
              <ImagePickerField
                label="Select Photo"
                value={polaroidSrc}
                onChange={setPolaroidSrc}
                folder="kokalachi/blogs"
                tooltip="Cloudinary upload or selection"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Handwritten Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. strangers at breakfast, friends by dinner"
                  value={polaroidCaption}
                  onChange={(e) => setPolaroidCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alt Text (for accessibility & SEO)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Travellers laughing together around the table"
                  value={polaroidAlt}
                  onChange={(e) => setPolaroidAlt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPolaroidModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!polaroidSrc.trim()}
                onClick={handleConfirmPolaroid}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0E5A60] hover:bg-[#0B2A3D] text-white disabled:opacity-40 cursor-pointer transition-colors shadow-xs"
              >
                Insert Polaroid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INSERT POSTCARD */}
      {showPostcardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-600" />
                Insert Souvenir Postcard
              </h3>
              <button
                type="button"
                onClick={() => setShowPostcardModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Postcards render with a vintage mountain stamp, cancellation postmark, and handwritten
              cursive note.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Postcard Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your postcard message here..."
                  value={postcardText}
                  onChange={(e) => setPostcardText(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sender Signature
                </label>
                <input
                  type="text"
                  placeholder="e.g. someone you met on day one"
                  value={postcardSignature}
                  onChange={(e) => setPostcardSignature(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPostcardModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!postcardText.trim()}
                onClick={handleConfirmPostcard}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0E5A60] hover:bg-[#0B2A3D] text-white disabled:opacity-40 cursor-pointer transition-colors shadow-xs"
              >
                Insert Postcard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper to render [Text](/url) markdown links into React elements
 */
function renderRichTextWithLinks(text: string): React.ReactNode {
  if (!text) return null;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    parts.push(
      <span
        key={match.index}
        className="text-[#0E5A60] underline decoration-[#D96C2C] decoration-2 underline-offset-2 font-medium"
      >
        {label}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
