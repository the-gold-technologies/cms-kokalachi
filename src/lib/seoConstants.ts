export interface SeoHeadingOption {
  value: string;
  label: string;
}

export const SEO_HEADING_OPTIONS: readonly SeoHeadingOption[] = [
  { value: "h1", label: "H1 (Recommended standard title tag)" },
  { value: "h2", label: "H2 (Secondary section tag)" },
  { value: "h3", label: "H3 (Subsection tag)" },
  { value: "h4", label: "H4 (Minor subsection tag)" },
  { value: "h5", label: "H5 (Deep nested tag)" },
  { value: "h6", label: "H6 (Smallest heading tag)" },
] as const;
