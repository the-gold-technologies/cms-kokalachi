// Reads a Destination Chapter (CMS → Community) from an uploaded / pasted document, so the
// "Add Destination Chapter" form can be pre-filled. Two formats, same as the journey & blog imports:
//   - JSON: one chapter object, { "chapter": {...} }, or { "chapters": [...] } (first one is used)
//   - Markdown: see public/templates/community-template.md
import {
  HIGHLIGHT_ICON_OPTIONS,
  type CommunityMediaItem,
  type HighlightIcon,
  type StoryAuthorItem,
  type StoryHighlightItem,
  type TravellerStoryItem,
} from "@/lib/communityChapter";

export interface ParsedCommunityDoc {
  slug?: string;
  destination?: string;
  country?: string;
  tripType?: string;
  travelledOn?: string;
  tagline?: string;
  journeySlug?: string;
  coverImage?: string;
  media: CommunityMediaItem[];
  stories: TravellerStoryItem[];
}

const ICON_IDS = HIGHLIGHT_ICON_OPTIONS.map((o) => o.id);

// Accepts an icon id ("hotel"), its label ("Hotel / Boutique Stay") or its emoji ("🏨")
function toIcon(value: unknown): HighlightIcon {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  const match = HIGHLIGHT_ICON_OPTIONS.find(
    (o) => o.id === v || o.label.toLowerCase() === v || o.emoji === v,
  );
  return match ? match.id : ICON_IDS[0];
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const storyId = (title: string, index: number) =>
  `story-${slugify(title).slice(0, 40) || index + 1}-${Date.now().toString(36)}`;

export function parseCommunityDocument(rawText: string): ParsedCommunityDoc {
  const trimmed = rawText.trim();
  if (!trimmed) return { media: [], stories: [] };

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return fromJson(JSON.parse(trimmed));
    } catch {
      // Not valid JSON: fall through to the Markdown reader
    }
  }
  return fromMarkdown(trimmed);
}

/* ------------------------------------------------------------------ */
/* JSON                                                                */
/* ------------------------------------------------------------------ */

function fromJson(raw: any): ParsedCommunityDoc {
  const data =
    raw?.chapter ??
    (Array.isArray(raw?.chapters) ? raw.chapters[0] : undefined) ??
    raw?.CommunityChaptersSection?.chapters?.[0] ??
    raw;

  const media: CommunityMediaItem[] = (Array.isArray(data?.media) ? data.media : [])
    .map((m: any) => normaliseMedia(m))
    .filter((m: CommunityMediaItem) => m.src);

  const stories: TravellerStoryItem[] = (Array.isArray(data?.stories) ? data.stories : []).map(
    (s: any, i: number) => {
      const title = str(s?.title);
      return {
        id: str(s?.id) || storyId(title, i),
        title,
        pullQuote: str(s?.pullQuote ?? s?.quote),
        travelledAs: str(s?.travelledAs),
        summary: str(s?.summary),
        highlights: (Array.isArray(s?.highlights) ? s.highlights : [])
          .map((h: any): StoryHighlightItem => ({
            icon: toIcon(h?.icon),
            label: str(h?.label ?? h?.title),
            detail: str(h?.detail ?? h?.description),
          }))
          .filter((h: StoryHighlightItem) => h.label || h.detail),
        paragraphs: toParagraphs(s?.paragraphs ?? s?.letter ?? s?.body),
        signoff: str(s?.signoff),
        authors: (Array.isArray(s?.authors) ? s.authors : [])
          .map((a: any): StoryAuthorItem =>
            typeof a === "string"
              ? { name: a.trim(), role: "" }
              : { name: str(a?.name), role: str(a?.role) },
          )
          .filter((a: StoryAuthorItem) => a.name),
      };
    },
  );

  return {
    slug: str(data?.slug) || undefined,
    destination: str(data?.destination) || undefined,
    country: str(data?.country) || undefined,
    tripType: str(data?.tripType) || undefined,
    travelledOn: str(data?.travelledOn) || undefined,
    tagline: str(data?.tagline) || undefined,
    journeySlug: str(data?.journeySlug) || undefined,
    coverImage: str(data?.coverImage) || undefined,
    media,
    stories,
  };
}

function normaliseMedia(m: any): CommunityMediaItem {
  const type = str(m?.type).toLowerCase() === "video" ? "video" : "image";
  const item: CommunityMediaItem = {
    type,
    src: str(m?.src ?? m?.url),
    alt: str(m?.alt),
    caption: str(m?.caption),
  };
  if (type === "video" && str(m?.poster)) item.poster = str(m.poster);
  return item;
}

function toParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((p) => str(p)).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  return [];
}

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

// "Key: value" lines, case-insensitive; the key may be **bold**
function readFields(block: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^\s*[-*]?\s*\**([A-Za-z][A-Za-z /()-]*?)\**\s*:\s*(.*)$/);
    if (m && !/^https?$/i.test(m[1])) fields[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return fields;
}

const pick = (f: Record<string, string>, ...keys: string[]) => {
  for (const k of keys) if (f[k]) return f[k];
  return "";
};

// Splits "a | b | c" table-style bullet lines
const cells = (line: string) =>
  line
    .replace(/^\s*[-*•]\s*/, "")
    .split("|")
    .map((c) => c.trim());

function fromMarkdown(text: string): ParsedCommunityDoc {
  const result: ParsedCommunityDoc = { media: [], stories: [] };
  // Help notes in <!-- comments --> are not content
  const sections = text.replace(/<!--[\s\S]*?-->/g, "").split(/(?=^##\s+)/m);

  // Header: "# Destination name" plus Key: value lines
  const header = sections[0] ?? "";
  const titleLine = header.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  const hf = readFields(header);
  result.destination = pick(hf, "destination", "destination name") || titleLine || undefined;
  result.country = pick(hf, "country") || undefined;
  result.tripType = pick(hf, "trip type") || undefined;
  result.travelledOn = pick(hf, "travelled on", "traveled on", "date") || undefined;
  result.tagline = pick(hf, "tagline") || undefined;
  result.slug = pick(hf, "slug", "url slug") || undefined;
  result.journeySlug = pick(hf, "journey slug", "connected journey slug") || undefined;
  result.coverImage = pick(hf, "cover image", "cover photo", "cover") || undefined;

  for (const raw of sections.slice(1)) {
    const sec = raw.trim();
    const nl = sec.indexOf("\n");
    const heading = (nl === -1 ? sec : sec.slice(0, nl)).replace(/^##\s+/, "").trim();
    const body = nl === -1 ? "" : sec.slice(nl + 1);

    if (/^(media|photos?|gallery|photo\s*&\s*video wall)/i.test(heading)) {
      for (const line of body.split("\n")) {
        if (!/^\s*[-*•]/.test(line)) continue;
        const [first, ...rest] = cells(line);
        const hasType = /^(image|photo|video)$/i.test(first);
        const [src, caption = "", alt = "", poster = ""] = hasType ? rest : [first, ...rest];
        if (!src) continue;
        result.media.push(
          normaliseMedia({
            type: hasType && /^video$/i.test(first) ? "video" : "image",
            src,
            caption,
            alt,
            poster,
          }),
        );
      }
    } else if (/^story\b/i.test(heading)) {
      result.stories.push(
        storyFromMarkdown(heading.replace(/^story\s*[:\-–]?\s*/i, ""), body, result.stories.length),
      );
    }
  }
  return result;
}

function storyFromMarkdown(title: string, body: string, index: number): TravellerStoryItem {
  // Sub-sections: ### Highlights, ### Letter
  const parts = body.split(/(?=^###\s+)/m);
  const f = readFields(parts[0] ?? "");
  const story: TravellerStoryItem = {
    id: storyId(title, index),
    title: title || pick(f, "title", "headline"),
    pullQuote: pick(f, "pull quote", "quote"),
    travelledAs: pick(f, "travelled as", "traveled as"),
    summary: pick(f, "summary"),
    highlights: [],
    paragraphs: [],
    signoff: pick(f, "sign-off", "signoff", "sign off"),
    authors: pick(f, "authors", "author")
      .split(";")
      .map((a) => a.trim())
      .filter(Boolean)
      .map((a) => {
        // "Name (Role)" or "Name"
        const m = a.match(/^(.*?)\s*\((.*)\)\s*$/);
        return m ? { name: m[1].trim(), role: m[2].trim() } : { name: a, role: "" };
      }),
  };

  for (const part of parts.slice(1)) {
    const nl = part.indexOf("\n");
    const sub = (nl === -1 ? part : part.slice(0, nl))
      .replace(/^###\s+/, "")
      .trim()
      .toLowerCase();
    const subBody = nl === -1 ? "" : part.slice(nl + 1);
    if (sub.startsWith("highlight")) {
      story.highlights = subBody
        .split("\n")
        .filter((l) => /^\s*[-*•]/.test(l))
        .map((l) => {
          const [icon, label = "", detail = ""] = cells(l);
          return { icon: toIcon(icon), label, detail };
        })
        .filter((h) => h.label || h.detail);
    } else if (
      sub.startsWith("letter") ||
      sub.startsWith("full letter") ||
      sub.startsWith("story")
    ) {
      story.paragraphs = toParagraphs(subBody);
    }
  }
  return story;
}
