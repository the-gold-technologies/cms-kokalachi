"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Layout, BadgeCheck, ShieldAlert, Eye } from "lucide-react";

interface PageListItem {
  id: string;
  title: string;
  slug: string;
  visibility: string;
  type: string;
  sectionsCount: number;
}

interface PageStructureProps {
  stats?: {
    pagesList?: PageListItem[];
  };
  loading?: boolean;
}

function getEditorUrl(slug: string): string {
  switch (slug) {
    case "blogs":
      return "/blogs";
    case "journeys":
      return "/trips";
    case "home":
      return "/static-pages/home";
    case "about":
      return "/static-pages/about";
    case "contact":
      return "/static-pages/contact";
    case "community":
      return "/static-pages/community";
    case "faqs":
      return "/static-pages/faqs";
    case "terms":
      return "/static-pages/terms";
    case "privacy-policy":
      return "/static-pages/privacy-policy";
    default:
      return `/static-pages/${slug}`;
  }
}

function getPublicRoute(slug: string): string {
  if (slug === "home") return "/";
  return `/${slug}`;
}

export function PageStructure({ stats, loading }: PageStructureProps) {
  const pagesList = stats?.pagesList || [];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#0B0F29]">Kokalachi Website Pages</h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Overview of static pages, layout editors, and section configurations.
          </p>
        </div>
        <Link
          href="/seo/pages"
          className="text-xs font-bold text-[#D8232A] hover:text-black flex items-center gap-1 bg-red-50/50 px-3 py-1.5 rounded-xl transition-all"
        >
          Manage SEO <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#D8232A]" />
        </div>
      ) : pagesList.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs italic">
          No website pages found in database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 pb-2">
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                  Page Name
                </th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                  Route Path
                </th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                  Status
                </th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                  Sections Count
                </th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pagesList.map((page) => {
                const isPublic = page.visibility === "published" || page.visibility === "public";
                const editorUrl = getEditorUrl(page.slug);
                const publicRoute = getPublicRoute(page.slug);
                const pageTypeDisplay = page.type?.toLowerCase().endsWith("page")
                  ? page.type
                  : `${page.type || "Main"} Page`;

                return (
                  <tr key={page.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="py-3.5">
                      <Link href={editorUrl} className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#0E5A60]/10 group-hover:text-[#0E5A60] transition-colors">
                          <Layout className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-[#0E5A60] transition-colors">
                            {page.title}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                            {pageTypeDisplay}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 font-mono text-xs text-gray-600 font-semibold">
                      {publicRoute}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPublic ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {isPublic ? (
                          <>
                            <BadgeCheck className="w-3 h-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-800">
                      {page.sectionsCount} content block{page.sectionsCount === 1 ? "" : "s"}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={editorUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black font-semibold text-[11px] transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        Edit Layout
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
