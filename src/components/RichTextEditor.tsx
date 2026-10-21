"use client";

import React, { useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to prevent SSR window/document issues in Next.js App Router
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    // ForwardRef wrapper to enable getEditor() access with ref
    return function ReactQuillWrapper(props: any) {
      return <RQ {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400 animate-pulse">
        Loading Rich Text Editor with Image Upload...
      </div>
    ),
  },
);

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  minHeight?: string;
  error?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Write rich article content, guides, formatting, and highlights...",
  tooltip,
  minHeight = "320px",
  error,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // Custom Image Upload Handler directly uploading to /api/upload
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png, image/jpeg, image/jpg, image/webp, image/gif");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const toastId = toast.loading("Uploading article image...");
      try {
        const formData = new FormData();
        formData.append("files", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (json.success && json.urls && json.urls.length > 0) {
          const imageUrl = json.urls[0];
          const editor = quillRef.current?.getEditor?.();

          if (editor) {
            const range = editor.getSelection(true) || {
              index: editor.getLength(),
            };
            editor.insertEmbed(range.index, "image", imageUrl);
            editor.setSelection(range.index + 1);
          } else {
            // Fallback appending HTML
            onChange(`${value}<p><img src="${imageUrl}" alt="${file.name}" /></p>`);
          }

          toast.success("Image inserted into article!", { id: toastId });
        } else {
          toast.error(json.error || "Failed to upload image", { id: toastId });
        }
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Error uploading image", { id: toastId });
      }
    };
  }, [onChange, value]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [handleImageUpload],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700">{label}</label>
          {tooltip && <span className="text-[11px] text-gray-400 font-medium">{tooltip}</span>}
        </div>
      )}

      <div
        className={`rich-editor-wrapper bg-white rounded-2xl border transition-all overflow-hidden ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-gray-200 focus-within:border-[#D8232A] focus-within:ring-1 focus-within:ring-[#D8232A]"
        }`}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="rich-text-quill"
          style={{ minHeight }}
        />
      </div>

      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}

      <style jsx global>{`
        .rich-editor-wrapper .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #f1f5f9;
          background-color: #f8fafc;
          padding: 10px 14px;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .rich-editor-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 14px;
          color: #1e293b;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
        .rich-editor-wrapper .ql-editor {
          min-height: ${minHeight};
          padding: 18px;
          line-height: 1.75;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        .rich-editor-wrapper .ql-snow .ql-stroke {
          stroke: #64748b;
        }
        .rich-editor-wrapper .ql-snow .ql-fill {
          fill: #64748b;
        }
        .rich-editor-wrapper .ql-snow .ql-picker {
          color: #64748b;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrapper .ql-snow .ql-toolbar button:focus .ql-stroke,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #d8232a;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-editor-wrapper .ql-snow .ql-toolbar button:focus .ql-fill,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #d8232a;
        }
        .rich-editor-wrapper .ql-snow .ql-picker:hover,
        .rich-editor-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          color: #d8232a;
        }
        .rich-editor-wrapper .ql-editor h2 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #0b0f29;
        }
        .rich-editor-wrapper .ql-editor h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #0b0f29;
        }
        .rich-editor-wrapper .ql-editor ul,
        .rich-editor-wrapper .ql-editor ol {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .rich-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #d8232a;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #475569;
          font-style: italic;
          background: #fef2f2;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .rich-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.25rem 0;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
