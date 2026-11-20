// Destination Chapter data shapes (CMS → Community), shared by the chapter form and the
// document importer. Kept outside the form so the importer can use them without a circular import.

export type HighlightIcon =
  | "guide"
  | "welcome"
  | "hotel"
  | "bus"
  | "visa"
  | "transfer"
  | "tours"
  | "support"
  | "plan"
  | "place"
  | "friends";

export const HIGHLIGHT_ICON_OPTIONS: { id: HighlightIcon; label: string; emoji: string }[] = [
  { id: "guide", label: "Trip Leader / Guide", emoji: "👤" },
  { id: "welcome", label: "Warm Welcome / Host", emoji: "🤝" },
  { id: "hotel", label: "Hotel / Boutique Stay", emoji: "🏨" },
  { id: "bus", label: "Transport / Tempo", emoji: "🚐" },
  { id: "visa", label: "Visa / Documentation", emoji: "🛂" },
  { id: "transfer", label: "Transfers & Logistics", emoji: "🚗" },
  { id: "tours", label: "Tours & Excursions", emoji: "🎟️" },
  { id: "support", label: "Team Support / Reachable", emoji: "🎧" },
  { id: "plan", label: "Flawless Planning", emoji: "✨" },
  { id: "place", label: "Scenic Place / Views", emoji: "🏔️" },
  { id: "friends", label: "Friendship & Tribe", emoji: "🎉" },
];

export interface CommunityMediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
}

export interface StoryHighlightItem {
  icon: HighlightIcon;
  label: string;
  detail: string;
}

export interface StoryAuthorItem {
  name: string;
  role?: string;
}

export interface TravellerStoryItem {
  id: string;
  title: string;
  pullQuote: string;
  travelledAs: string;
  summary: string;
  highlights: StoryHighlightItem[];
  paragraphs: string[];
  signoff?: string;
  authors: StoryAuthorItem[];
}

export interface CommunityTripChapter {
  slug: string;
  destination: string;
  country: string;
  tripType: string;
  travelledOn: string;
  tagline: string;
  journeySlug?: string;
  coverImage: string;
  media: CommunityMediaItem[];
  stories: TravellerStoryItem[];
}
