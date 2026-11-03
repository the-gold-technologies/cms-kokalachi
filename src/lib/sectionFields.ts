// Building blocks for config-driven section editors (Trips Pages, Shared Sections).
// A section config lists its fields once; the same list renders the form
// (src/components/SectionFieldsEditor.tsx) and cleans what the API saves (normalizeSection).

// Show a field only when another field has a given value (e.g. steps only for enquiry pages)
export type When = { when?: { key: string; equals: string } };
export type WhenValue = When["when"];

export type BasicField = When & {
  key: string;
  label: string;
  help?: string; // shown under the field
  tooltip?: string; // shown on the (i) icon
  placeholder?: string;
};

export type FieldOption = { value: string; label: string };

export type SelectField = { kind: "select"; options: FieldOption[] } & BasicField;
export type RowItem = ({ kind: "text" | "image" } & BasicField) | SelectField;

export type SectionField =
  | ({ kind: "text" } & BasicField)
  | ({ kind: "textarea" } & BasicField)
  | ({ kind: "image" } & BasicField)
  | SelectField
  // Tick boxes; saves the ticked values as a list, e.g. the pages a section shows on
  | ({ kind: "checklist"; options: FieldOption[] } & BasicField)
  // Headline + handwritten underlined words, side by side. Saves headline and scriptAccent.
  | ({ kind: "headline"; label: string } & When)
  // Fields shown side by side
  | ({ kind: "row"; fields: RowItem[] } & When)
  // A list of { title, text } cards, e.g. the custom trip steps
  | ({
      kind: "list";
      key: string;
      label: string;
      itemLabel: string;
      help?: string;
      max?: number;
    } & When)
  // A sub-heading between groups of fields
  | ({ kind: "heading"; label: string; help?: string } & When);

export interface SectionConfig {
  key: string;
  title: string;
  badge: string;
  description: string;
  fields: SectionField[];
}

export const HEADLINE_KEYS = ["headline", "scriptAccent"] as const;

// ---------- Field helpers ----------

export const heading = (label: string, help?: string, when?: WhenValue): SectionField => ({
  kind: "heading",
  label,
  help,
  when,
});
export const text = (key: string, label: string, extra: Partial<BasicField> = {}) =>
  ({ kind: "text", key, label, ...extra }) as const;
export const textarea = (
  key: string,
  label: string,
  extra: Partial<BasicField> = {},
): SectionField => ({ kind: "textarea", key, label, ...extra });
export const image = (key: string, label: string, extra: Partial<BasicField> = {}) =>
  ({ kind: "image", key, label, ...extra }) as const;
export const row = (fields: RowItem[], when?: WhenValue): SectionField => ({
  kind: "row",
  fields,
  when,
});

/**
 * Keeps only the fields the section has: text as trimmed strings, choices limited to their
 * options, lists as { title, text } items (empty ones dropped). Stops stray fields being saved.
 */
export function normalizeSection(config: SectionConfig, input: unknown): Record<string, unknown> {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const out: Record<string, unknown> = {};

  const basic = (field: RowItem | Extract<SectionField, { kind: "textarea" }>) => {
    if (field.kind === "select") {
      const value = str(source[field.key]);
      out[field.key] = field.options.some((o) => o.value === value)
        ? value
        : field.options[0].value;
    } else {
      out[field.key] = str(source[field.key]);
    }
  };

  for (const field of config.fields) {
    switch (field.kind) {
      case "heading":
        break;
      case "headline":
        for (const k of HEADLINE_KEYS) out[k] = str(source[k]);
        break;
      case "row":
        field.fields.forEach(basic);
        break;
      case "checklist": {
        const picked = Array.isArray(source[field.key]) ? (source[field.key] as unknown[]) : [];
        // Kept in the options' order, so saves don't reshuffle the list
        out[field.key] = field.options.map((o) => o.value).filter((v) => picked.includes(v));
        break;
      }
      case "list": {
        const items = Array.isArray(source[field.key]) ? (source[field.key] as unknown[]) : [];
        out[field.key] = items
          .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
          .map((item) => ({ title: str(item.title), text: str(item.text) }))
          .filter((item) => item.title || item.text)
          .slice(0, field.max ?? Infinity);
        break;
      }
      default:
        basic(field);
    }
  }
  return out;
}
