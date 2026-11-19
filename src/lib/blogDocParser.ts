import { blocksToStoryText, storyTextToBlocks, BlogBlockItem } from "./blogContentParser";

export interface ParsedBlogDoc {
  title?: string;
  slug?: string;
  heroLead?: string;
  heroAccent?: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  author?: string;
  heroImage?: string;
  heroAlt?: string;
  marginNote?: string;
  intro?: string[];
  introText?: string;
  sections?: Array<{
    id?: string;
    number?: number | null;
    kicker?: string;
    title: string;
    content?: string;
    blocks?: BlogBlockItem[];
  }>;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryBtnText?: string;
  ctaPrimaryBtnUrl?: string;
  ctaSecondaryBtnText?: string;
  ctaSecondaryBtnUrl?: string;
  shareBtnText?: string;
  relatedCategory?: string;
  sidebarBadge?: string;
  shareTitle?: string;
  shareNote?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  canonicalUrl?: string;
}

/**
 * Parses a JSON or Markdown document into structured blog form state.
 */
export function parseBlogDocument(rawText: string): ParsedBlogDoc {
  const trimmed = rawText.trim();
  if (!trimmed) return {};

  // 1. Try parsing as JSON first
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const data = JSON.parse(trimmed);
      return sanitizeParsedBlogJson(data);
    } catch {
      // Fall through to markdown parser
    }
  }

  // 2. Parse as Markdown (with optional frontmatter)
  return parseBlogMarkdown(trimmed);
}

function sanitizeParsedBlogJson(data: any): ParsedBlogDoc {
  const doc: ParsedBlogDoc = {};

  if (typeof data.title === "string") doc.title = data.title.trim();
  if (typeof data.slug === "string") doc.slug = data.slug.trim();
  if (typeof data.heroLead === "string") doc.heroLead = data.heroLead.trim();
  if (typeof data.heroAccent === "string") doc.heroAccent = data.heroAccent.trim();
  if (typeof data.excerpt === "string") doc.excerpt = data.excerpt.trim();
  if (typeof data.category === "string") doc.category = data.category.trim();
  if (typeof data.publishedAt === "string") doc.publishedAt = data.publishedAt.trim();
  if (typeof data.author === "string") doc.author = data.author.trim();
  if (typeof data.heroImage === "string") doc.heroImage = data.heroImage.trim();
  if (typeof data.heroAlt === "string") doc.heroAlt = data.heroAlt.trim();
  if (typeof data.marginNote === "string") doc.marginNote = data.marginNote.trim();

  // Intro
  if (Array.isArray(data.intro)) {
    const list = data.intro.map((p: any) => String(p).trim()).filter(Boolean);
    doc.intro = list;
    doc.introText = list.join("\n\n");
  } else if (typeof data.intro === "string") {
    const text: string = data.intro.trim();
    doc.introText = text;
    doc.intro = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  } else if (typeof data.introText === "string") {
    const text: string = data.introText.trim();
    doc.introText = text;
    doc.intro = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  }

  // Chapters / Sections
  if (Array.isArray(data.sections)) {
    doc.sections = data.sections.map((sec: any, idx: number) => {
      let content = "";
      if (typeof sec.content === "string") {
        content = sec.content.trim();
      } else if (Array.isArray(sec.blocks)) {
        content = blocksToStoryText(sec.blocks);
      }

      const num =
        sec.number != null && !isNaN(Number(sec.number))
          ? Number(sec.number)
          : null;

      return {
        id: sec.id || `chapter-${idx + 1}`,
        number: num,
        kicker: typeof sec.kicker === "string" ? sec.kicker.trim() : "",
        title: typeof sec.title === "string" ? sec.title.trim() : `Chapter ${idx + 1}`,
        content,
      };
    });
  }

  // CTA
  if (data.cta && typeof data.cta === "object") {
    if (data.cta.eyebrow) doc.ctaEyebrow = String(data.cta.eyebrow).trim();
    if (data.cta.title) doc.ctaTitle = String(data.cta.title).trim();
    if (data.cta.text) doc.ctaText = String(data.cta.text).trim();
    if (data.cta.primaryText) doc.ctaPrimaryBtnText = String(data.cta.primaryText).trim();
    if (data.cta.primaryUrl) doc.ctaPrimaryBtnUrl = String(data.cta.primaryUrl).trim();
    if (data.cta.secondaryText) doc.ctaSecondaryBtnText = String(data.cta.secondaryText).trim();
    if (data.cta.secondaryUrl) doc.ctaSecondaryBtnUrl = String(data.cta.secondaryUrl).trim();
  } else {
    if (data.ctaEyebrow) doc.ctaEyebrow = String(data.ctaEyebrow).trim();
    if (data.ctaTitle) doc.ctaTitle = String(data.ctaTitle).trim();
    if (data.ctaText) doc.ctaText = String(data.ctaText).trim();
    if (data.ctaPrimaryBtnText) doc.ctaPrimaryBtnText = String(data.ctaPrimaryBtnText).trim();
    if (data.ctaPrimaryBtnUrl) doc.ctaPrimaryBtnUrl = String(data.ctaPrimaryBtnUrl).trim();
    if (data.ctaSecondaryBtnText) doc.ctaSecondaryBtnText = String(data.ctaSecondaryBtnText).trim();
    if (data.ctaSecondaryBtnUrl) doc.ctaSecondaryBtnUrl = String(data.ctaSecondaryBtnUrl).trim();
  }

  // Share
  if (data.share && typeof data.share === "object") {
    if (data.share.title) doc.shareTitle = String(data.share.title).trim();
    if (data.share.note) doc.shareNote = String(data.share.note).trim();
    if (data.share.buttonText) doc.shareBtnText = String(data.share.buttonText).trim();
  } else {
    if (data.shareTitle) doc.shareTitle = String(data.shareTitle).trim();
    if (data.shareNote) doc.shareNote = String(data.shareNote).trim();
    if (data.shareBtnText) doc.shareBtnText = String(data.shareBtnText).trim();
  }

  if (typeof data.relatedCategory === "string") doc.relatedCategory = data.relatedCategory.trim();
  if (typeof data.sidebarBadge === "string") doc.sidebarBadge = data.sidebarBadge.trim();
  if (typeof data.isPublished === "boolean") doc.isPublished = data.isPublished;
  if (typeof data.isFeatured === "boolean") doc.isFeatured = data.isFeatured;

  // SEO
  if (data.seo && typeof data.seo === "object") {
    if (data.seo.metaTitle) doc.metaTitle = String(data.seo.metaTitle).trim();
    if (data.seo.metaDescription) doc.metaDescription = String(data.seo.metaDescription).trim();
    if (data.seo.targetKeywords) doc.targetKeywords = String(data.seo.targetKeywords).trim();
    if (data.seo.canonicalUrl) doc.canonicalUrl = String(data.seo.canonicalUrl).trim();
  } else {
    if (data.metaTitle) doc.metaTitle = String(data.metaTitle).trim();
    if (data.metaDescription) doc.metaDescription = String(data.metaDescription).trim();
    if (data.targetKeywords) doc.targetKeywords = String(data.targetKeywords).trim();
    if (data.canonicalUrl) doc.canonicalUrl = String(data.canonicalUrl).trim();
  }

  return doc;
}

function parseBlogMarkdown(markdown: string): ParsedBlogDoc {
  const doc: ParsedBlogDoc = {};
  let body = markdown;

  // 1. Parse YAML Frontmatter (between --- and ---)
  if (markdown.startsWith("---")) {
    const endMatch = markdown.indexOf("---", 3);
    if (endMatch !== -1) {
      const frontmatter = markdown.substring(3, endMatch).trim();
      body = markdown.substring(endMatch + 3).trim();

      const lines = frontmatter.split("\n");
      for (const line of lines) {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;
        const key = line.substring(0, colonIdx).trim().toLowerCase();
        const val = line.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, "");

        if (key === "title") doc.title = val;
        else if (key === "slug") doc.slug = val;
        else if (key === "herolead" || key === "hero_lead" || key === "lead") doc.heroLead = val;
        else if (key === "heroaccent" || key === "hero_accent" || key === "accent") doc.heroAccent = val;
        else if (key === "excerpt" || key === "description" || key === "teaser") doc.excerpt = val;
        else if (key === "category") doc.category = val;
        else if (key === "author") doc.author = val;
        else if (key === "publishedat" || key === "date") doc.publishedAt = val;
        else if (key === "heroimage" || key === "image") doc.heroImage = val;
        else if (key === "heroalt" || key === "alt") doc.heroAlt = val;
        else if (key === "marginnote" || key === "note") doc.marginNote = val;
        else if (key === "ctatitle") doc.ctaTitle = val;
        else if (key === "ctatext") doc.ctaText = val;
        else if (key === "ctaeyebrow") doc.ctaEyebrow = val;
        else if (key === "metatitle") doc.metaTitle = val;
        else if (key === "metadescription") doc.metaDescription = val;
        else if (key === "keywords") doc.targetKeywords = val;
      }
    }
  }

  // 2. Parse main title if not in frontmatter (# Title)
  if (!doc.title) {
    const h1Match = body.match(/^#\s+(.+)$/m);
    if (h1Match) {
      doc.title = h1Match[1].trim();
      // Remove H1 line from body
      body = body.replace(h1Match[0], "").trim();
    }
  }

  // 3. Split sections by "## " headers
  const chapterRegex = /^##\s+(.+)$/gm;
  const chapterIndices: { index: number; heading: string; fullMatch: string }[] = [];
  let m: RegExpExecArray | null;

  while ((m = chapterRegex.exec(body)) !== null) {
    chapterIndices.push({
      index: m.index,
      heading: m[1].trim(),
      fullMatch: m[0],
    });
  }

  if (chapterIndices.length === 0) {
    // Whole body is the intro if no ## chapters
    doc.introText = body.trim();
    doc.intro = doc.introText.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
    return doc;
  }

  // Text before the first ## chapter is the Intro!
  const introPart = body.substring(0, chapterIndices[0].index).trim();
  if (introPart) {
    doc.introText = introPart;
    doc.intro = introPart.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  }

  // Parse each chapter section
  const parsedSections: ParsedBlogDoc["sections"] = [];
  let chapterCounter = 1;

  for (let i = 0; i < chapterIndices.length; i++) {
    const current = chapterIndices[i];
    const startIndex = current.index + current.fullMatch.length;
    const endIndex = i + 1 < chapterIndices.length ? chapterIndices[i + 1].index : body.length;
    let sectionBody = body.substring(startIndex, endIndex).trim();

    // Check if this is a CTA section (e.g. ## Call To Action or ## Next Steps)
    if (/call to action|cta|upcoming journeys/i.test(current.heading)) {
      if (!doc.ctaTitle) doc.ctaTitle = current.heading;
      if (!doc.ctaText) doc.ctaText = sectionBody;
      continue;
    }

    let chapterTitle = current.heading;
    let kicker = "";
    let chapterNum: number | null = null;

    // Check if heading has "01: Title" or "Chapter 1: Title"
    const numPrefixMatch = chapterTitle.match(/^(?:chapter\s+)?(\d{1,2})[:.]?\s+(.+)$/i);
    if (numPrefixMatch) {
      chapterNum = parseInt(numPrefixMatch[1], 10);
      chapterTitle = numPrefixMatch[2].trim();
    } else {
      chapterNum = chapterCounter++;
    }

    // Check for "kicker: ..." line at top of sectionBody
    const kickerMatch = sectionBody.match(/^kicker:\s*(.+)$/im);
    if (kickerMatch) {
      kicker = kickerMatch[1].trim();
      sectionBody = sectionBody.replace(kickerMatch[0], "").trim();
    }

    parsedSections.push({
      id: chapterTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `chapter-${i + 1}`,
      number: chapterNum,
      kicker,
      title: chapterTitle,
      content: sectionBody,
    });
  }

  doc.sections = parsedSections;
  return doc;
}
