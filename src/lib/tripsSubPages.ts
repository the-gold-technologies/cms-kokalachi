import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import {
  TRIPS_PAGE_SLUG,
  TRIPS_SUB_PAGE_PREFIX,
  TRIPS_SUB_PAGE_SECTION,
} from "@/lib/tripsPageContent";

// Sub-pages of /trips are pages whose slug is "trips/<slug>", each with one TripsSubPageSection.

// A page's SEO (SEO → Page Settings), in the same shape the website reads for every page
export const PAGE_SEO_SELECT = {
  title: true,
  metaTitle: true,
  metaDescription: true,
  targetKeywords: true,
  canonicalUrl: true,
  noIndex: true,
  schema: true,
  ogTitle: true,
  ogDescription: true,
  ogImage: true,
  featuredImage: true,
  headingOptions: true,
} as const;

export interface TripsSubPage {
  slug: string; // the part after /trips/, e.g. "upcoming"
  order: number;
  content: Record<string, unknown>;
  seo: Record<string, unknown>;
}

export const subPageSlug = (slug: string) => `${TRIPS_SUB_PAGE_PREFIX}${slug}`;

export async function listTripsSubPages(): Promise<TripsSubPage[]> {
  const pages = await prisma.page.findMany({
    where: { slug: { startsWith: TRIPS_SUB_PAGE_PREFIX } },
    select: {
      slug: true,
      order: true,
      ...PAGE_SEO_SELECT,
      sections: { where: { type: TRIPS_SUB_PAGE_SECTION }, select: { content: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return pages.map(({ slug, order, sections, ...seo }) => ({
    slug: slug.slice(TRIPS_SUB_PAGE_PREFIX.length),
    order,
    content: (sections[0]?.content as Record<string, unknown>) ?? {},
    seo,
  }));
}

// A sub-page change shows on its own page, the tabs on every trips page, the navbar and footer
export function revalidateTripsPages(slug?: string) {
  revalidateWebsite(
    WebsiteTag.page(TRIPS_PAGE_SLUG),
    WebsiteTag.site,
    ...(slug ? [WebsiteTag.page(subPageSlug(slug))] : []),
  );
}
