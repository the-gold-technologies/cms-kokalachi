export interface ParsedJourneyDoc {
  title?: string;
  slug?: string;
  subtitle?: string;
  destinationSlug?: string;
  location?: string;
  duration?: string;
  groupSize?: string;
  rating?: number;
  price?: number | string;
  originalPrice?: number | string;
  gstAmount?: number | string;
  category?: string;
  tag?: string;
  hook?: string;
  vibeTags?: string[];
  image?: string;
  gallery?: string[];
  departures?: Array<{
    startDate: string;
    endDate: string;
    price?: number | string;
    originalPrice?: number | string;
    spotsLeft?: number | string;
    status?: "open" | "soldout" | "closed";
    label?: string;
    note?: string;
  }>;
  overview?: string[];
  overviewText?: string;
  highlights?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  itinerary?: Array<{
    day: string;
    title: string;
    journey: string;
    community: string;
    image?: string;
  }>;
  inclusions?: string[];
  exclusions?: string[];
  meals?: string[];
  whatToPack?: string[];
  weather?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
}

export function parseJourneyDocument(rawText: string): ParsedJourneyDoc {
  const trimmed = rawText.trim();
  if (!trimmed) return {};

  // 1. Try parsing as JSON first
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const data = JSON.parse(trimmed);
      return sanitizeParsedDoc(data);
    } catch {
      // Fall through to markdown parser if JSON.parse fails
    }
  }

  // 2. Parse as Markdown / structured text
  return parseMarkdownJourney(trimmed);
}

function sanitizeParsedDoc(raw: any): ParsedJourneyDoc {
  // Support nested tourPackage objects from seed / exported data
  const data =
    raw && typeof raw === "object" && raw.tourPackage ? { ...raw, ...raw.tourPackage } : { ...raw };
  const res: ParsedJourneyDoc = { ...data };

  // Overview normalization
  if (Array.isArray(res.overview)) {
    res.overviewText = res.overview.join("\n\n");
  } else if (typeof res.overview === "string") {
    res.overviewText = res.overview;
    res.overview = res.overview
      .split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean);
  }

  // Cover image and gallery
  if (!res.image && (res.coverImage || (Array.isArray(res.images) && res.images.length > 0))) {
    res.image = res.coverImage || res.images[0];
  }
  if (!res.gallery && Array.isArray(res.images) && res.images.length > 1) {
    res.gallery = res.images.slice(1);
  }

  // Highlights normalization
  if (Array.isArray(res.highlights)) {
    res.highlights = res.highlights.map((h: any) => {
      if (typeof h === "string") return { icon: "✨", title: h, description: "" };
      return {
        icon: h.icon || "✨",
        title: h.title || "",
        description: h.description || h.desc || "",
      };
    });
  }

  // Itinerary normalization
  if (Array.isArray(res.itinerary)) {
    res.itinerary = res.itinerary.map((it: any, idx: number) => {
      let journeyText = it.journey || it.description || it.desc || "";
      if (Array.isArray(it.schedule) && it.schedule.length > 0) {
        const scheduleStr = it.schedule
          .map((s: any) => `${s.time ? s.time + ": " : ""}${s.activity || s.title || ""}`)
          .join(" → ");
        if (scheduleStr) journeyText = (journeyText ? journeyText + "\n" : "") + scheduleStr;
      }
      return {
        day: it.day || `Day ${idx + 1}`,
        title: it.title || "",
        journey: journeyText,
        community: it.community || it.host || it.connection || "",
        image: it.image || it.photo || it.dayImage || "",
      };
    });
  }

  // Inclusions & Exclusions normalization
  if (typeof res.inclusions === "string")
    res.inclusions = res.inclusions
      .split("\n")
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);
  if (typeof res.exclusions === "string")
    res.exclusions = res.exclusions
      .split("\n")
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);

  // Meals provided normalization
  if (typeof res.meals === "string")
    res.meals = res.meals
      .split("\n")
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);

  // What to pack checklist normalization
  if (!res.whatToPack && (res.packingList || res.checklist)) {
    res.whatToPack = res.packingList || res.checklist;
  }
  if (typeof res.whatToPack === "string")
    res.whatToPack = res.whatToPack
      .split("\n")
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);

  // Weather and climate normalization
  if (!res.weather && (res.weatherAndClimate || res.climate)) {
    res.weather = res.weatherAndClimate || res.climate;
  }
  if (typeof res.weather === "string")
    res.weather = res.weather
      .split("\n")
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);

  // FAQs normalization
  if (Array.isArray(res.faqs)) {
    res.faqs = res.faqs
      .map((f: any) => ({
        question: f.question || f.q || f.title || "",
        answer: f.answer || f.a || f.desc || "",
      }))
      .filter((f: any) => f.question || f.answer);
  }

  // Departures normalization
  if (Array.isArray(res.departures)) {
    res.departures = res.departures.map((d: any) => ({
      startDate: d.startDate || "",
      endDate: d.endDate || "",
      price: d.price != null ? d.price : undefined,
      originalPrice: d.originalPrice != null ? d.originalPrice : undefined,
      spotsLeft: d.spotsLeft != null ? d.spotsLeft : 10,
      status: d.status || "open",
      label: d.label || "",
      note: d.note || "",
    }));
  }

  return res;
}

function parseMarkdownJourney(text: string): ParsedJourneyDoc {
  const result: ParsedJourneyDoc = {
    vibeTags: [],
    gallery: [],
    departures: [],
    overview: [],
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    meals: [],
    whatToPack: [],
    weather: [],
    faqs: [],
  };

  // Split into sections by Markdown ## headings
  const sections = text.split(/(?=^##\s+)/m);

  // Section 0 contains the top metadata and # Title
  const headerSection = sections[0] || "";
  parseHeaderMetadata(headerSection, result);

  for (let i = 1; i < sections.length; i++) {
    const sec = sections[i].trim();
    if (!sec) continue;

    const firstLineEnd = sec.indexOf("\n");
    const headingLine = firstLineEnd !== -1 ? sec.substring(0, firstLineEnd) : sec;
    const body = firstLineEnd !== -1 ? sec.substring(firstLineEnd + 1).trim() : "";

    const heading = headingLine
      .replace(/^##\s+/, "")
      .toLowerCase()
      .trim();

    if (heading.includes("departure")) {
      const deps = parseDepartures(body);
      if (deps.length > 0) result.departures = deps;
    } else if (
      heading.includes("overview") ||
      heading.includes("experience narrative") ||
      heading.includes("storytelling")
    ) {
      const lines = body
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      result.overview = lines;
      result.overviewText = body;
    } else if (heading.includes("highlight")) {
      result.highlights = parseHighlights(body);
    } else if (heading.includes("itinerary") || heading.includes("day-by-day")) {
      const days = parseItinerary(body);
      if (days.length > 0) result.itinerary = days;
    } else if (
      heading.includes("inclusion") ||
      heading.includes("what's included") ||
      heading.includes("what’s included")
    ) {
      result.inclusions = parseBulletList(body);
    } else if (
      heading.includes("exclusion") ||
      heading.includes("what's not included") ||
      heading.includes("what’s not included")
    ) {
      result.exclusions = parseBulletList(body);
    } else if (heading.includes("meal")) {
      result.meals = parseBulletList(body);
    } else if (heading.includes("pack") || heading.includes("packing")) {
      result.whatToPack = parseBulletList(body);
    } else if (heading.includes("weather") || heading.includes("climate")) {
      result.weather = parseBulletList(body);
    } else if (heading.includes("faq")) {
      result.faqs = parseFaqs(body);
    } else if (heading.includes("seo") || heading.includes("metadata")) {
      parseSeo(body, result);
    } else if (
      heading.includes("cms") ||
      heading.includes("admin") ||
      heading.includes("form detail")
    ) {
      // Check if CMS/Admin details section provides richer day cards or departures
      if (!result.itinerary || result.itinerary.length === 0) {
        result.itinerary = parseItinerary(body);
      } else {
        // Merge any day images or details that may be specified in admin details
        const adminDays = parseItinerary(body);
        if (adminDays.length > 0 && result.itinerary) {
          result.itinerary = result.itinerary.map((day, idx) => {
            const adminMatch =
              adminDays[idx] ||
              adminDays.find((ad) => ad.day.toLowerCase() === day.day.toLowerCase());
            return {
              ...day,
              image: day.image || adminMatch?.image || "",
            };
          });
        }
      }

      if (!result.departures || result.departures.length === 0) {
        const adminDeps = parseDepartures(body);
        if (adminDeps.length > 0) result.departures = adminDeps;
      }
    }
  }

  return result;
}

function parseHeaderMetadata(text: string, result: ParsedJourneyDoc) {
  const lines = text.split("\n");
  let inGallery = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(">")) continue;

    // Check gallery list
    if (inGallery) {
      if (line.startsWith("-") || line.startsWith("*")) {
        const urlMatch = line.match(/https?:\/\/[^\s)]+/);
        if (urlMatch) {
          result.gallery?.push(urlMatch[0]);
          continue;
        }
      } else {
        inGallery = false;
      }
    }

    if (line.startsWith("# ")) {
      result.title = line.replace(/^#\s+(Journey Title:\s*)?/i, "").trim();
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.substring(0, colonIdx).trim().toLowerCase();
    const val = line.substring(colonIdx + 1).trim();

    if (key === "title" || key === "journey title") {
      result.title = val;
    } else if (key === "slug" || key === "url slug") {
      result.slug = val;
    } else if (key === "subtitle" || key === "tagline") {
      result.subtitle = val;
    } else if (key === "destination" || key === "destination slug") {
      result.destinationSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    } else if (key === "location") {
      result.location = val;
    } else if (key === "duration") {
      result.duration = val;
    } else if (key === "group size" || key === "groupsize") {
      result.groupSize = val;
    } else if (key === "price") {
      result.price = parseFloat(val.replace(/[^0-9.]/g, "")) || val;
    } else if (key === "original price" || key === "originalprice") {
      result.originalPrice = parseFloat(val.replace(/[^0-9.]/g, "")) || val;
    } else if (key === "category" || key === "vibe category") {
      result.category = val;
    } else if (key === "tags" || key === "vibe tags") {
      result.vibeTags = val
        .split(",")
        .map((s) => s.trim().replace(/^#/, ""))
        .filter(Boolean);
    } else if (key === "cover image" || key === "image") {
      const urlMatch = val.match(/https?:\/\/[^\s)]+/);
      result.image = urlMatch ? urlMatch[0] : val;
    } else if (key === "gallery" || key === "gallery images") {
      inGallery = true;
    }
  }

  // If no slug provided, generate from title
  if (!result.slug && result.title) {
    result.slug = result.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
}

function parseDepartures(text: string): ParsedJourneyDoc["departures"] {
  const departures: ParsedJourneyDoc["departures"] = [];

  // 1. Check if text has batch blocks (e.g. #### Departure Batch or - Batch Name:)
  if (text.includes("####") || text.toLowerCase().includes("batch name:")) {
    const blocks = text.split(/(?=^#{3,4}\s+Departure\b|^#{3,4}\s+Batch\b)/im);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed.toLowerCase().includes("batch") && !trimmed.toLowerCase().includes("start date"))
        continue;

      let label = "";
      let startDate = "";
      let endDate = "";
      let spotsLeft = 10;
      let status: "open" | "soldout" | "closed" = "open";
      let price: number | undefined = undefined;
      let note = "";

      const lines = trimmed.split("\n");
      for (const line of lines) {
        const clean = line.replace(/^[-*•]\s*/, "").trim();
        const cIdx = clean.indexOf(":");
        if (cIdx === -1) {
          if (clean.startsWith("#")) {
            const hText = clean.replace(/^#+\s*/, "").trim();
            if (hText.toLowerCase().includes("batch")) label = hText;
          }
          continue;
        }

        const k = clean.substring(0, cIdx).trim().toLowerCase();
        const v = clean.substring(cIdx + 1).trim();

        if (k.includes("batch name") || k === "name" || k === "label") {
          label = v;
        } else if (k.includes("start date")) {
          const match = v.match(/\d{4}-\d{2}-\d{2}/);
          startDate = match
            ? match[0]
            : v.toLowerCase().includes("confirmed") || v.toLowerCase().includes("announced")
              ? ""
              : v;
        } else if (k.includes("end date")) {
          const match = v.match(/\d{4}-\d{2}-\d{2}/);
          endDate = match
            ? match[0]
            : v.toLowerCase().includes("confirmed") || v.toLowerCase().includes("announced")
              ? ""
              : v;
        } else if (k.includes("spots")) {
          const num = parseInt(v.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(num)) spotsLeft = num;
        } else if (k.includes("status")) {
          const lower = v.toLowerCase();
          if (lower.includes("sold")) status = "soldout";
          else if (lower.includes("close")) status = "closed";
          else status = "open";
        } else if (k.includes("price") && !k.includes("note") && !k.includes("base price")) {
          const p = parseFloat(v.replace(/[^0-9.]/g, ""));
          if (!isNaN(p)) price = p;
        } else if (
          k.includes("arrival") ||
          k.includes("departure") ||
          k.includes("time") ||
          k.includes("note")
        ) {
          note = v;
        }
      }

      if (label || startDate || note) {
        departures.push({ startDate, endDate, spotsLeft, status, label, note, price });
      }
    }

    if (departures.length > 0) return departures;
  }

  // 2. Parse line-by-line (pipe-separated or bullet list)
  const lines = text.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim().replace(/^[-*•]\s*/, "");
    if (!line || line.startsWith("#")) continue;

    const parts = line.split("|").map((p) => p.trim());
    const datePart = parts[0] || "";

    let startDate = "";
    let endDate = "";
    const dateMatches = datePart.match(/(\d{4}-\d{2}-\d{2})\s*(?:to|-|–)\s*(\d{4}-\d{2}-\d{2})/i);
    if (dateMatches) {
      startDate = dateMatches[1];
      endDate = dateMatches[2];
    } else {
      if (
        datePart.toLowerCase().includes("announced") ||
        datePart.toLowerCase().includes("confirmed") ||
        datePart.toLowerCase().includes("tba")
      ) {
        startDate = "";
        endDate = "";
      } else {
        startDate = datePart;
      }
    }

    let spotsLeft: number = 10;
    let status: "open" | "soldout" | "closed" = "open";
    let label: string | undefined = undefined;
    let note: string | undefined = undefined;
    let price: number | undefined = undefined;

    for (let j = 1; j < parts.length; j++) {
      const part = parts[j];
      const lower = part.toLowerCase();

      if (lower.includes("spot") || lower.includes("traveller") || lower.includes("group size")) {
        const num = parseInt(part.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(num)) spotsLeft = num;
      } else if (
        lower === "open" ||
        lower === "soldout" ||
        lower === "closed" ||
        lower === "planned"
      ) {
        status = lower === "planned" ? "open" : (lower as any);
      } else if (
        (lower.startsWith("₹") || lower.startsWith("rs") || lower.startsWith("price")) &&
        !lower.includes("base price")
      ) {
        const p = parseFloat(part.replace(/[^0-9.]/g, ""));
        if (!isNaN(p)) price = p;
      } else if (
        lower.includes("arrive") ||
        lower.includes("airport") ||
        lower.includes("flight") ||
        lower.includes("time") ||
        lower.includes("am") ||
        lower.includes("pm") ||
        lower.includes("departure")
      ) {
        note = part;
      } else if (lower.includes("batch") || lower.includes("special") || !label) {
        label = part;
      } else if (!note) {
        note = part;
      }
    }

    if (!label && parts[3]) label = parts[3];
    if (!note && parts[4]) note = parts[4];

    departures.push({
      startDate,
      endDate,
      spotsLeft,
      status,
      label,
      note,
      price,
    });
  }

  return departures;
}

function parseHighlights(text: string): ParsedJourneyDoc["highlights"] {
  const highlights: ParsedJourneyDoc["highlights"] = [];
  const lines = text.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim().replace(/^[-*•]\s*/, "");
    if (!line) continue;

    // Extract emoji/icon if present at start
    let icon = "✨";
    let rest = line;

    const emojiMatch = line.match(/^(\p{Extended_Pictographic}|\p{Emoji})\s*/u);
    if (emojiMatch) {
      icon = emojiMatch[1];
      rest = line.substring(emojiMatch[0].length).trim();
    }

    const colonIdx = rest.indexOf(":");
    if (colonIdx !== -1) {
      const title = rest.substring(0, colonIdx).trim();
      const description = rest.substring(colonIdx + 1).trim();
      highlights.push({ icon, title, description });
    } else {
      highlights.push({ icon, title: rest, description: "" });
    }
  }

  return highlights;
}

function parseItinerary(text: string): ParsedJourneyDoc["itinerary"] {
  const itinerary: ParsedJourneyDoc["itinerary"] = [];
  // Split by ### or #### Day headings
  const dayBlocks = text.split(/(?=^#{3,4}\s+Day\b|^###\s+)/im);

  for (const block of dayBlocks) {
    const trimmed = block.trim();
    if (!trimmed.match(/^#{3,4}\s+/i)) continue;

    const lines = trimmed.split("\n");
    const headingLine = lines[0].replace(/^#{3,4}\s+/, "").trim();

    let day = "Day 1";
    let title = headingLine;

    const colonIdx = headingLine.indexOf(":");
    if (colonIdx !== -1) {
      day = headingLine.substring(0, colonIdx).trim();
      title = headingLine.substring(colonIdx + 1).trim();
    } else {
      const match = headingLine.match(/^(Day\s*\d+)\s*[-–:]?\s*(.*)$/i);
      if (match) {
        day = match[1].trim();
        title = match[2].trim() || day;
      }
    }

    let journey = "";
    let community = "";
    let image = "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cleanLine = line.replace(/^[-*•]\s*/, "").trim();
      const cIdx = cleanLine.indexOf(":");

      if (cIdx !== -1) {
        const k = cleanLine.substring(0, cIdx).trim().toLowerCase();
        const v = cleanLine.substring(cIdx + 1).trim();

        if (k === "day label" || k === "label") {
          day = v;
          continue;
        }
        if (k === "day title") {
          title = v;
          continue;
        }
        // Skip alt text lines
        if (k.includes("alt") || k.includes("caption")) {
          continue;
        }
        // Image / Photo URL detection
        if (
          k.includes("image") ||
          k.includes("photo") ||
          k.includes("picture") ||
          k.includes("url") ||
          v.startsWith("http://") ||
          v.startsWith("https://")
        ) {
          const urlMatch = v.match(/https?:\/\/[^\s)]+/);
          if (urlMatch) {
            image = urlMatch[0];
            continue;
          }
        }
        // Journey / Narrative detection
        if (
          k.includes("journey") ||
          k.includes("narrative") ||
          k.includes("what happens") ||
          k.includes("description") ||
          k.includes("activity") ||
          k.includes("activities")
        ) {
          journey = journey ? journey + "\n\n" + v : v;
          continue;
        }
        // Community & Host connection
        if (
          k.includes("community") ||
          k.includes("connection") ||
          k.includes("local") ||
          k.includes("host")
        ) {
          community = community ? community + "\n\n" + v : v;
          continue;
        }

        // Check if v is an image URL
        const anyUrlMatch = v.match(/https?:\/\/[^\s)]+/);
        if (
          anyUrlMatch &&
          (anyUrlMatch[0].includes("unsplash") ||
            anyUrlMatch[0].match(/\.(jpg|jpeg|png|webp|avif)/i))
        ) {
          image = anyUrlMatch[0];
          continue;
        }

        journey = journey ? journey + "\n" + cleanLine : cleanLine;
      } else {
        const urlMatch = cleanLine.match(/https?:\/\/[^\s)]+/);
        if (
          urlMatch &&
          !image &&
          (cleanLine.toLowerCase().includes("image") ||
            cleanLine.toLowerCase().includes("photo") ||
            cleanLine.match(/\.(jpg|jpeg|png|webp|avif)/i) ||
            cleanLine.includes("unsplash"))
        ) {
          image = urlMatch[0];
        } else if (!cleanLine.toLowerCase().includes("alt text")) {
          journey = journey ? journey + "\n" + cleanLine : cleanLine;
        }
      }
    }

    if (day || title || journey) {
      itinerary.push({ day, title, journey, community, image });
    }
  }

  return itinerary;
}

function parseBulletList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
    .filter(Boolean);
}

function parseFaqs(text: string): ParsedJourneyDoc["faqs"] {
  const faqs: ParsedJourneyDoc["faqs"] = [];
  const lines = text.split("\n");

  let currentQ = "";
  let currentA = "";

  const commitFaq = () => {
    if (currentQ && currentA) {
      faqs.push({ question: currentQ.trim(), answer: currentA.trim() });
    }
    currentQ = "";
    currentA = "";
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.match(/^(Q|Question):\s*/i)) {
      commitFaq();
      currentQ = line.replace(/^(Q|Question):\s*/i, "");
    } else if (line.match(/^(A|Answer):\s*/i)) {
      currentA = line.replace(/^(A|Answer):\s*/i, "");
    } else if (line.startsWith("### ")) {
      commitFaq();
      currentQ = line.replace(/^###\s+/, "");
    } else if (currentA) {
      currentA += " " + line;
    } else if (currentQ) {
      currentQ += " " + line;
    }
  }

  commitFaq();
  return faqs;
}

function parseSeo(text: string, result: ParsedJourneyDoc) {
  const lines = text.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const k = line.substring(0, colonIdx).trim().toLowerCase();
    const v = line.substring(colonIdx + 1).trim();

    if (k.includes("title")) result.metaTitle = v;
    if (k.includes("description") || k.includes("desc")) result.metaDescription = v;
    if (k.includes("keyword") || k.includes("tags")) result.targetKeywords = v;
  }
}
