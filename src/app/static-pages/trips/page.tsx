"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  ALL_TRIPS_SECTION,
  TRIPS_SECTIONS,
  TRIPS_SUB_PAGE_CONFIG,
  type TripsSectionKey,
} from "@/lib/tripsPageContent";
import { SectionFieldsEditor, type SectionValues } from "@/components/SectionFieldsEditor";
import { SharedSectionLink } from "@/components/SharedSectionLink";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, "");

interface SubPage {
  slug: string;
  order: number;
  content: SectionValues;
}

// Tabs: All Trips, then each sub-page (by its tab order)
const ALL_TAB = "all";
const pageTab = (slug: string) => `page-${slug}`;

async function request<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.error || "Something went wrong");
  return json.data;
}

const sectionConfig = (key: TripsSectionKey) => TRIPS_SECTIONS.find((s) => s.key === key)!;

function TripsPagesEditor() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<Record<string, SectionValues> | null>(null);
  const [pages, setPages] = useState<SubPage[]>([]);
  const [busy, setBusy] = useState(false);

  // The open tab lives in the URL (?tab=page-upcoming), so a refresh or shared link keeps it
  const tabParam = searchParams.get("tab") ?? ALL_TAB;
  const activePage = pages.find((p) => pageTab(p.slug) === tabParam);
  const activeTab = activePage ? tabParam : ALL_TAB;
  const selectTab = useCallback(
    (id: string) => router.replace(`${pathname}?tab=${id}`, { scroll: false }),
    [router, pathname],
  );

  useEffect(() => {
    request<{ sections: Record<string, SectionValues>; pages: SubPage[] }>(
      "/api/trips-pages",
      "GET",
    )
      .then((data) => {
        setSections(data.sections ?? {});
        setPages(data.pages ?? []);
      })
      .catch((err) => {
        console.error("Failed to load trips pages content:", err);
        toast.error("Failed to load trips pages");
        setSections({});
      });
  }, []);

  const saveSection = (key: TripsSectionKey) => async (values: SectionValues) => {
    const saved = await request<SectionValues>("/api/trips-pages", "PUT", {
      section: key,
      content: values,
    });
    setSections((prev) => ({ ...(prev ?? {}), [key]: saved }));
    return saved;
  };

  const savePage = (slug: string) => async (values: SectionValues) => {
    const saved = await request<SectionValues>(`/api/trips-pages/pages/${slug}`, "PUT", {
      content: values,
    });
    setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, content: saved } : p)));
    return saved;
  };

  const movePage = async (slug: string, dir: -1 | 1) => {
    const i = pages.findIndex((p) => p.slug === slug);
    const next = [...pages];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setBusy(true);
    try {
      setPages(
        await request<SubPage[]>("/api/trips-pages/pages", "PATCH", {
          slugs: next.map((p) => p.slug),
        }),
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const tabName = (page: SubPage) => (page.content.tabLabel as string) || page.slug;

  const tabClass = (isActive: boolean) =>
    `shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
      isActive
        ? "bg-[#0E5A60] text-white shadow-md"
        : "bg-white border border-slate-200 text-slate-700 hover:border-[#0E5A60]/40 hover:text-[#0E5A60]"
    }`;

  const viewLink = (path: string) =>
    WEBSITE_URL && (
      <a
        href={`${WEBSITE_URL}${path}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-[#0E5A60] hover:text-[#D96C2C] transition-colors"
      >
        View page <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );

  const activeIndex = activePage ? pages.indexOf(activePage) : -1;

  return (
    <section className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      <PageHeader
        title="Trips Pages"
        description="Manage the website's /trips pages. Each tab is one page, in the same order as the tabs on the website, with its own hero photo. The Upcoming Journeys strip at the bottom is in Static Pages → Shared Sections. Trips themselves are managed in Journeys, and each page's SEO in SEO → Page Settings."
      />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Trips pages"
        className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === ALL_TAB}
          onClick={() => selectTab(ALL_TAB)}
          className={tabClass(activeTab === ALL_TAB)}
        >
          All Trips
        </button>
        {pages.map((page) => (
          <button
            key={page.slug}
            type="button"
            role="tab"
            aria-selected={activeTab === pageTab(page.slug)}
            onClick={() => selectTab(pageTab(page.slug))}
            className={tabClass(activeTab === pageTab(page.slug))}
          >
            {tabName(page)}
          </button>
        ))}
      </div>

      {sections === null ? (
        <div className="py-12 text-center text-xs font-medium text-slate-400">
          Loading trips pages...
        </div>
      ) : (
        <div role="tabpanel" className="flex flex-col gap-6">
          {/* All Trips */}
          {activeTab === ALL_TAB && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500">
                <span>
                  Editing <span className="font-mono text-slate-700">/trips</span>
                </span>
                {viewLink("/trips")}
              </div>
              <SectionFieldsEditor
                key={ALL_TAB}
                config={sectionConfig(ALL_TRIPS_SECTION)}
                initialData={sections[ALL_TRIPS_SECTION]}
                defaultOpen
                onSave={saveSection(ALL_TRIPS_SECTION)}
              />
              <SharedSectionLink
                page="trips"
                placement="At the bottom of this page, as on every trips page"
              />
            </>
          )}

          {/* A sub-page */}
          {activePage && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  Editing <span className="font-mono text-slate-700">/trips/{activePage.slug}</span>
                </span>
                <span className="flex items-center gap-2">
                  {viewLink(`/trips/${activePage.slug}`)}
                  <span className="mx-1 h-4 w-px bg-slate-200" />
                  <button
                    type="button"
                    onClick={() => movePage(activePage.slug, -1)}
                    disabled={busy || activeIndex <= 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 hover:text-[#0E5A60] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move this tab left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Move left
                  </button>
                  <button
                    type="button"
                    onClick={() => movePage(activePage.slug, 1)}
                    disabled={busy || activeIndex === pages.length - 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 hover:text-[#0E5A60] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move this tab right"
                  >
                    Move right <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
              <SectionFieldsEditor
                key={pageTab(activePage.slug)}
                config={TRIPS_SUB_PAGE_CONFIG}
                initialData={activePage.content}
                defaultOpen
                onSave={savePage(activePage.slug)}
              />
              <SharedSectionLink
                page="trips"
                placement="At the bottom of this page, as on every trips page"
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default function TripsPagesCMSPage() {
  return (
    <Suspense fallback={null}>
      <TripsPagesEditor />
    </Suspense>
  );
}
