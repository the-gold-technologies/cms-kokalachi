"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import type { RowItem, SectionConfig, SectionField } from "@/lib/sectionFields";

// One collapsible card in a config-driven editor (Trips Pages, Shared Sections), built from a
// section config (see src/lib/sectionFields.ts). The page decides where it saves (onSave).

type ListItem = { title: string; text: string };
export type SectionValues = Record<string, string | string[] | ListItem[]>;
type ListField = Extract<SectionField, { kind: "list" }>;
type BasicItem = RowItem | Extract<SectionField, { kind: "textarea" }>;

export function SectionFieldsEditor({
  config,
  initialData,
  defaultOpen = false,
  onSave,
}: {
  config: SectionConfig;
  initialData?: SectionValues; // undefined if the section isn't in the database yet
  defaultOpen?: boolean;
  onSave: (values: SectionValues) => Promise<SectionValues>; // resolves with the saved content
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [values, setValues] = useState<SectionValues>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialData) setValues(initialData);
  }, [initialData]);

  const text = (key: string) => (typeof values[key] === "string" ? (values[key] as string) : "");
  const list = (key: string) => (Array.isArray(values[key]) ? (values[key] as ListItem[]) : []);
  const picked = (key: string) => (Array.isArray(values[key]) ? (values[key] as string[]) : []);
  const set = (key: string, value: string | string[] | ListItem[]) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };
  // Fields tied to another field's value (e.g. steps only on enquiry pages)
  const visible = (field: { when?: { key: string; equals: string } }) =>
    !field.when || text(field.when.key) === field.when.equals;

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      setValues(await onSave(values));
      setSaved(true);
      toast.success(`${config.title} saved`);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const renderBasic = (field: BasicItem) => {
    if (!visible(field)) return null;
    switch (field.kind) {
      case "image":
        return (
          <ImagePickerField
            key={field.key}
            label={field.label}
            helperText={field.help}
            tooltip={field.tooltip}
            value={text(field.key)}
            onChange={(value) => set(field.key, value)}
            placeholder="Upload or paste image URL"
          />
        );
      case "textarea":
        return (
          <TextAreaField
            key={field.key}
            label={field.label}
            helperText={field.help}
            tooltip={field.tooltip}
            placeholder={field.placeholder}
            rows={3}
            value={text(field.key)}
            onChange={(e) => set(field.key, e.target.value)}
            showLinkButton={false}
          />
        );
      case "select":
        return (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-700">{field.label}</span>
            <span className="relative">
              <select
                value={text(field.key) || field.options[0].value}
                onChange={(e) => set(field.key, e.target.value)}
                className="w-full appearance-none cursor-pointer text-xs sm:text-sm pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0E5A60]/20 focus:border-[#0E5A60] outline-none transition-all text-slate-800"
              >
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </span>
            {field.help && <span className="text-[11px] text-slate-400">{field.help}</span>}
          </label>
        );
      default:
        return (
          <InputField
            key={field.key}
            label={field.label}
            helperText={field.help}
            tooltip={field.tooltip}
            placeholder={field.placeholder}
            value={text(field.key)}
            onChange={(e) => set(field.key, e.target.value)}
          />
        );
    }
  };

  const renderChecklist = (field: Extract<SectionField, { kind: "checklist" }>) => {
    const ticked = picked(field.key);
    const toggle = (value: string) =>
      set(
        field.key,
        ticked.includes(value) ? ticked.filter((v) => v !== value) : [...ticked, value],
      );
    return (
      <div key={field.key} className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-700">{field.label}</span>
            {field.help && <p className="text-[11px] text-slate-400 mt-0.5">{field.help}</p>}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            {ticked.length} of {field.options.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {field.options.map((option) => {
            const isOn = ticked.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="checkbox"
                aria-checked={isOn}
                onClick={() => toggle(option.value)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                  isOn
                    ? "border-[#0E5A60] bg-[#0E5A60]/5 text-[#0E5A60]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    isOn ? "bg-[#0E5A60] border-[#0E5A60] text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {isOn && <Check className="w-3 h-3" />}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderList = (field: ListField) => {
    const items = list(field.key);
    const update = (i: number, patch: Partial<ListItem>) =>
      set(
        field.key,
        items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)),
      );
    const move = (i: number, dir: -1 | 1) => {
      const next = [...items];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      set(field.key, next);
    };
    const canAdd = !field.max || items.length < field.max;

    return (
      <div key={field.key} className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-700">{field.label}</span>
            {field.help && <p className="text-[11px] text-slate-400 mt-0.5">{field.help}</p>}
          </div>
          <button
            type="button"
            onClick={() => set(field.key, [...items, { title: "", text: "" }])}
            disabled={!canAdd}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#0E5A60]/20 px-3 py-2 text-xs font-bold text-[#0E5A60] hover:bg-[#0E5A60]/5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add {field.itemLabel}
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
            No {field.itemLabel.toLowerCase()}s yet. This part of the page stays hidden until you
            add one.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96C2C]">
                  {field.itemLabel} {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Move ${field.itemLabel} ${i + 1} up`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Move ${field.itemLabel} ${i + 1} down`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        field.key,
                        items.filter((_, idx) => idx !== i),
                      )
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label={`Remove ${field.itemLabel} ${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <InputField
                label="Title"
                value={item.title}
                onChange={(e) => update(i, { title: e.target.value })}
              />
              <TextAreaField
                label="Text"
                rows={2}
                value={item.text}
                onChange={(e) => update(i, { text: e.target.value })}
                showLinkButton={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-6">
      <SectionHeader
        title={config.title}
        description={config.description}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        badge={config.badge}
      />

      {isOpen && (
        <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-300">
          {config.fields.map((field, i) => {
            if (!visible(field)) return null;
            switch (field.kind) {
              case "heading":
                return (
                  <div key={`h-${i}`} className={i > 0 ? "pt-5 border-t border-gray-100" : ""}>
                    <h4 className="text-sm font-bold text-slate-800">{field.label}</h4>
                    {field.help && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{field.help}</p>
                    )}
                  </div>
                );
              case "headline":
                return (
                  <div key={`headline-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label={field.label}
                      tooltip="Plain text at the start of the headline"
                      placeholder="e.g. Come solo,"
                      value={text("headline")}
                      onChange={(e) => set("headline", e.target.value)}
                    />
                    <InputField
                      label="Handwritten Words (underlined)"
                      tooltip="The end of the headline, in the handwritten font with the orange underline"
                      placeholder="e.g. leave with friends."
                      value={text("scriptAccent")}
                      onChange={(e) => set("scriptAccent", e.target.value)}
                    />
                  </div>
                );
              case "row": {
                const shown = field.fields.filter(visible);
                return (
                  <div
                    key={`row-${i}`}
                    className={`grid grid-cols-1 gap-4 ${
                      shown.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
                    }`}
                  >
                    {shown.map(renderBasic)}
                  </div>
                );
              }
              case "list":
                return renderList(field);
              case "checklist":
                return renderChecklist(field);
              default:
                return renderBasic(field);
            }
          })}

          <div className="pt-4 border-t border-gray-100">
            <SaveButton
              loading={loading}
              saved={saved}
              onClick={handleSave}
              label="Save Changes"
              className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      )}
    </article>
  );
}
