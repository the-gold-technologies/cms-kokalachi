"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SaveButton } from "@/components/SaveButton";
import { Globe, FileText, CheckCircle2, ExternalLink, Upload, X, FileCode } from "lucide-react";
import toast from "react-hot-toast";

export default function SitemapRobotsPage() {
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
  const [robotsTxt, setRobotsTxt] = useState(
    "User-agent: *\nAllow: /\n\nSitemap: https://mahalaxmilubricants.com/sitemap.xml",
  );
  const [customSitemapFileName, setCustomSitemapFileName] = useState("");
  const [sitemapCustomContent, setSitemapCustomContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const xmlInputRef = useRef<HTMLInputElement>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.sitemapEnabled !== undefined) {
            setSitemapEnabled(!!json.data.sitemapEnabled);
          }
          if (json.data.robotsTxt) {
            setRobotsTxt(json.data.robotsTxt);
          }
          if (json.data.sitemapCustomContent) {
            setSitemapCustomContent(json.data.sitemapCustomContent);
            setCustomSitemapFileName("custom-sitemap.xml");
          }
        }
      } catch (err) {
        console.error("Failed to load sitemap/robots config:", err);
        toast.error("Failed to load sitemap settings");
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const tid = toast.loading("Saving Sitemap & Robots.txt rules...");
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitemapEnabled,
          robotsTxt,
          sitemapCustomContent,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Sitemap & Robots.txt settings saved successfully!", {
          id: tid,
        });
      } else {
        toast.error(json.error || "Failed to save directives", { id: tid });
      }
    } catch (err: any) {
      console.error("Error saving sitemap:", err);
      toast.error(err?.message || "Network error while saving", { id: tid });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle XML sitemap upload
  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.name.endsWith(".xml") &&
      file.type !== "text/xml" &&
      file.type !== "application/xml"
    ) {
      toast.error("Please upload a valid .XML file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || "";
      setSitemapCustomContent(text);
      setCustomSitemapFileName(file.name);
      toast.success(`${file.name} imported successfully!`);
    };
    reader.readAsText(file);
    if (xmlInputRef.current) xmlInputRef.current.value = "";
  };

  // Handle TXT robots upload
  const handleTxtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || "";
      setRobotsTxt(text);
      toast.success(`${file.name} imported into Robots.txt editor!`);
    };
    reader.readAsText(file);
    if (txtInputRef.current) txtInputRef.current.value = "";
  };

  const clearCustomXml = () => {
    setSitemapCustomContent("");
    setCustomSitemapFileName("");
    toast.success("Custom XML sitemap removed, using auto-generated version.");
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">
          Loading Sitemap & Robots directives...
        </div>
      </div>
    );
  }

  const websiteBaseUrl = (process.env.NEXT_PUBLIC_WEBSITE_URL || "").replace(/\/$/, "");

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          title="Sitemap & Robots.txt"
          description="Configure search engine crawler visibility, robots rules, and dynamic sitemap options."
        />
        <div className="mb-2 shrink-0">
          <SaveButton onClick={handleSave} disabled={isSaving} className="w-auto px-10" />
        </div>
      </div>

      {/* 1. Live SEO Endpoints Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            LIVE SEO ENDPOINTS
          </span>
          <p className="text-xs text-gray-500 mt-1 font-normal">
            These are crawled automatically by search bots like Googlebot. Click below to inspect
            your live files:
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={`${websiteBaseUrl}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-gray-200/80 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
            title="Inspect live sitemap.xml"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>sitemap.xml</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </a>

          <a
            href={`${websiteBaseUrl}/robots.txt`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-gray-200/80 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
            title="Inspect live robots.txt"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </a>
        </div>
      </div>

      {/* 2. Sitemap Options Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-[#002B5C] rounded-2xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B0F29]">Sitemap Options</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              A sitemap tells search engines which pages and files you think are important in your
              site, and provides valuable information about them.
            </p>
          </div>
        </div>

        {/* Option 1: Generate sitemap.xml Toggle */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Generate sitemap.xml</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically compiles static links and published blogs into a sitemap format.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={sitemapEnabled}
              onChange={(e) => setSitemapEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002B5C]"></div>
          </label>
        </div>

        {/* Option 2: Custom Sitemap XML File Upload */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Custom Sitemap XML File</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a custom XML sitemap to override the automatically generated version.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="file"
              ref={xmlInputRef}
              onChange={handleXmlUpload}
              accept=".xml,text/xml,application/xml"
              className="hidden"
            />

            {customSitemapFileName ? (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[140px]">{customSitemapFileName}</span>
                <button
                  type="button"
                  onClick={clearCustomXml}
                  className="p-0.5 text-emerald-600 hover:text-red-600 rounded transition-colors"
                  title="Remove custom XML"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => xmlInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload .XML</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Robots.txt Rules Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B0F29]">Robots.txt Rules</h2>
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={txtInputRef}
              onChange={handleTxtUpload}
              accept=".txt,text/plain"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => txtInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload Rules (.txt)</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 -mt-2">
          Robots.txt file tells search engine crawlers which URLs the crawler can access on your
          site. This is used mainly to avoid overloading your site with requests.
        </p>

        {/* Textarea Label & Editor */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 lowercase">robots.txt rules</label>
          <textarea
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            rows={8}
            className="w-full p-4 bg-slate-50/70 border border-gray-200 rounded-2xl font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs leading-relaxed"
            placeholder="User-agent: *&#10;Allow: /"
          />
        </div>
      </div>
    </div>
  );
}
