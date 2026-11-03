"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Share2 } from "lucide-react";
import { STRIP_PAGES, type StripPageKey } from "@/lib/sharedSections";

// A placeholder card in a page editor for the Upcoming Journeys strip, which is shared across
// the site and edited in Static Pages → Shared Sections. It sits where the strip appears on the
// page, says whether this page shows it, and links to where it's edited.

type StripContent = {
  tag?: string;
  headline?: string;
  scriptAccent?: string;
  showOn?: string[];
};

// One request per screen, however many cards it has
let stripRequest: Promise<StripContent | null> | null = null;
const loadStrip = () =>
  (stripRequest ??= fetch("/api/shared-sections")
    .then((res) => res.json())
    .then((json) => (json.success ? (json.data?.UpcomingJourneysStripSection ?? null) : null))
    .catch(() => null)
    .finally(() => {
      // Fetch again next time the editor opens, so a change made meanwhile shows up
      setTimeout(() => (stripRequest = null), 0);
    }));

export function SharedSectionLink({
  page,
  placement,
}: {
  page: StripPageKey; // this page's key in Shared Sections → Show on
  placement: string; // where it sits, e.g. "Between the Chapters and the bottom CTA"
}) {
  const [strip, setStrip] = useState<StripContent | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    loadStrip().then((data) => active && setStrip(data));
    return () => {
      active = false;
    };
  }, []);

  const pageLabel = STRIP_PAGES.find((p) => p.value === page)?.label ?? page;
  const isShown = !!strip?.showOn?.includes(page);
  const headline = [strip?.headline, strip?.scriptAccent].filter(Boolean).join(" ");

  return (
    <article className="rounded-3xl border border-dashed border-[#0E5A60]/30 bg-[#0E5A60]/[0.03] p-6 sm:p-8 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upcoming Journeys Strip
              </h3>
              <span className="rounded-full bg-[#0E5A60]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0E5A60]">
                Shared section
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {placement}. It&apos;s shared across the site, so its text and the pages it shows on
              are edited in one place: Static Pages → Shared Sections.
            </p>
          </div>
        </div>

        <Link
          href="/static-pages/shared-sections"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E5A60] hover:bg-[#0A4347] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors shrink-0"
        >
          Edit in Shared Sections <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white border border-slate-100 px-4 py-3 text-xs">
        {strip === undefined ? (
          <span className="text-slate-400">Loading…</span>
        ) : strip === null ? (
          <span className="text-amber-700">Not set up yet in Shared Sections</span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold ${
                isShown ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isShown ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {isShown ? `Shown on ${pageLabel}` : `Hidden on ${pageLabel}`}
            </span>
            {headline && (
              <span className="text-slate-600 min-w-0 truncate">
                {strip.tag && (
                  <span className="font-bold uppercase tracking-wider text-[#C85A24] mr-2">
                    {strip.tag}
                  </span>
                )}
                “{headline}”
              </span>
            )}
          </>
        )}
      </div>
    </article>
  );
}
