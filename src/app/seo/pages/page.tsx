"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  CheckCircle,
  AlertCircle,
  FileText,
  Edit2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

interface PageSEOItem {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  type: string;
  visibility: string;
  parent?: string;
  order?: number;
}

export default function PageSEODashboard() {
  const [pages, setPages] = useState<PageSEOItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch("/api/seo/pages");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPages(json.data);
        }
      } catch (err) {
        console.error("Error loading SEO pages:", err);
        toast.error("Failed to load page directory");
      } finally {
        setIsLoading(false);
      }
    }
    loadPages();
  }, []);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(q) ||
      page.slug.toLowerCase().includes(q) ||
      (page.metaTitle && page.metaTitle.toLowerCase().includes(q))
    );
  });

  const rootLinks = filteredPages
    .filter((p) => p.parent === "-" || !p.parent)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const totalPages = pages.length;
  const configuredTitleCount = pages.filter(
    (p) => p.metaTitle && p.metaTitle.trim().length > 0,
  ).length;
  const configuredDescCount = pages.filter(
    (p) => p.metaDescription && p.metaDescription.trim().length > 0,
  ).length;

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
            SEO Page Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Configure metadata, open graph cards, and indexing targets across all site pages.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#002B5C] rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1528]">{totalPages}</div>
            <div className="text-xs text-gray-500 font-medium">Total Site Routes</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1528]">{configuredTitleCount}</div>
            <div className="text-xs text-gray-500 font-medium">Meta Titles Active</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1528]">{configuredDescCount}</div>
            <div className="text-xs text-gray-500 font-medium">Meta Descriptions Active</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Table Search Bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, route, or meta keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:bg-white transition-all"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Showing {filteredPages.length} of {totalPages} items
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/40">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Page / Section</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Route Path</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D8232A] mx-auto"></div>
                  </td>
                </tr>
              ) : rootLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    No pages found matching your search.
                  </td>
                </tr>
              ) : (
                rootLinks.map((root, rootIndex) => {
                  const children = filteredPages
                    .filter((c) => c.parent === root.id)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                  const hasChildren = children.length > 0;
                  const isExpanded = !!expandedParents[root.id];

                  const hasTitle = Boolean(root.metaTitle && root.metaTitle.trim().length > 0);
                  const hasDesc = Boolean(
                    root.metaDescription && root.metaDescription.trim().length > 0,
                  );

                  const isGroupContainer = root.type === "Dropdown" || root.slug === "products";

                  return (
                    <React.Fragment key={root.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-5 text-sm font-semibold text-gray-500 whitespace-nowrap">
                          {rootIndex + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleParent(root.id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                                )}
                              </button>
                            ) : (
                              <div className="w-6" />
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-gray-900 group-hover:text-[#002B5C] transition-colors whitespace-nowrap">
                                {root.title}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {isGroupContainer ? (
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap">
                              Group Container
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                  hasTitle
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-red-50 text-[#D8232A] border border-red-100"
                                }`}
                              >
                                {hasTitle ? "Title ✓" : "Title ✗"}
                              </span>
                              <span
                                className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                  hasDesc
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-red-50 text-[#D8232A] border border-red-100"
                                }`}
                              >
                                {hasDesc ? "Desc ✓" : "Desc ✗"}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                              root.type === "Main Link"
                                ? "bg-blue-50 text-[#002B5C]"
                                : root.type === "Dropdown"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {root.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-xs text-gray-500 break-words max-w-[260px] leading-relaxed">
                          /{root.slug}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex items-center gap-3 justify-end">
                            {!isGroupContainer && (
                              <Link
                                href={`/seo/pages/${root.slug}`}
                                className="p-2 bg-gray-50 text-slate-600 rounded-xl hover:bg-[#002B5C] hover:text-white transition-all group inline-flex items-center justify-center"
                                title="Edit Page SEO"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Render Children (Level 1: Categories or Blog Articles) */}
                      {isExpanded &&
                        children.map((child, childIndex) => {
                          const childHasTitle = !!child.metaTitle;
                          const childHasDesc = !!child.metaDescription;

                          const subChildren = filteredPages
                            .filter((sc) => sc.parent === child.id)
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                          const hasSubChildren = subChildren.length > 0;
                          const isSubExpanded = !!expandedParents[child.id];

                          return (
                            <React.Fragment key={child.id}>
                              <tr className="bg-[#fcfdff]/50 hover:bg-[#f5f8ff] transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium text-gray-400 pl-12 whitespace-nowrap">
                                  {rootIndex + 1}.{childIndex + 1}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3 pl-6 border-l-2 border-gray-100/50 min-w-0">
                                    {hasSubChildren ? (
                                      <button
                                        type="button"
                                        onClick={() => toggleParent(child.id)}
                                        className="p-1 hover:bg-gray-200/60 rounded-md transition-colors text-gray-400 cursor-pointer shrink-0"
                                        aria-label="Toggle sub-children"
                                      >
                                        {isSubExpanded ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-gray-300 text-lg shrink-0">↳</span>
                                    )}
                                    <span className="font-semibold text-xs sm:text-sm text-gray-700 group-hover:text-[#002B5C] transition-colors truncate">
                                      {child.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                        childHasTitle
                                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                          : "bg-red-50 text-[#D8232A] border border-red-100"
                                      }`}
                                    >
                                      {childHasTitle ? "Title ✓" : "Title ✗"}
                                    </span>
                                    <span
                                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                        childHasDesc
                                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                          : "bg-red-50 text-[#D8232A] border border-red-100"
                                      }`}
                                    >
                                      {childHasDesc ? "Desc ✓" : "Desc ✗"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100 whitespace-nowrap">
                                    {child.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-gray-400 break-words max-w-[260px] leading-relaxed">
                                  /{child.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center gap-3 justify-end">
                                    <Link
                                      href={`/seo/pages/${child.slug}`}
                                      className="p-1.5 bg-white border border-gray-100 text-gray-400 rounded-lg hover:border-[#002B5C] hover:text-[#002B5C] transition-all inline-flex items-center justify-center"
                                      title="Edit Page SEO"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>

                              {/* Render Sub-Children (Level 2: Products under Category) */}
                              {isSubExpanded &&
                                subChildren.map((sub, subIndex) => {
                                  const subHasTitle = !!sub.metaTitle;
                                  const subHasDesc = !!sub.metaDescription;

                                  return (
                                    <tr
                                      key={sub.id}
                                      className="bg-[#f8faff]/80 hover:bg-[#eff4fe] transition-colors group"
                                    >
                                      <td className="px-6 py-3 text-xs font-medium text-gray-300 pl-16 whitespace-nowrap">
                                        {rootIndex + 1}.{childIndex + 1}.{subIndex + 1}
                                      </td>
                                      <td className="px-6 py-3">
                                        <div className="flex items-center gap-2 pl-12 border-l-2 border-indigo-100/50 min-w-0">
                                          <span className="text-gray-300 text-xs shrink-0">↳</span>
                                          <span className="font-medium text-xs text-gray-600 group-hover:text-[#002B5C] transition-colors truncate">
                                            {sub.title}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                              subHasTitle
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : "bg-red-50 text-[#D8232A] border border-red-100"
                                            }`}
                                          >
                                            {subHasTitle ? "Title ✓" : "Title ✗"}
                                          </span>
                                          <span
                                            className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                              subHasDesc
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : "bg-red-50 text-[#D8232A] border border-red-100"
                                            }`}
                                          >
                                            {subHasDesc ? "Desc ✓" : "Desc ✗"}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                                          {sub.type}
                                        </span>
                                      </td>
                                      <td className="px-6 py-3 text-[11px] font-mono text-gray-400 break-words max-w-[260px] leading-relaxed">
                                        /{sub.slug}
                                      </td>
                                      <td className="px-6 py-3 whitespace-nowrap text-right">
                                        <div className="flex items-center gap-3 justify-end">
                                          <Link
                                            href={`/seo/pages/${sub.slug}`}
                                            className="p-1.5 bg-white border border-gray-100 text-gray-400 rounded-lg hover:border-[#002B5C] hover:text-[#002B5C] transition-all inline-flex items-center justify-center"
                                            title="Edit Page SEO"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </Link>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
