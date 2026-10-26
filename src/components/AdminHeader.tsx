"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FileText, Compass, Settings, Shield, Inbox, X, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SearchItem {
  title: string;
  category: string;
  url: string;
  icon: any;
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  { title: "Home Page Sections", category: "Pages", url: "/static-pages/home", icon: FileText },
  { title: "About Us Page", category: "Pages", url: "/static-pages/about", icon: FileText },
  { title: "Contact Us Page", category: "Pages", url: "/static-pages/contact", icon: FileText },
  { title: "Community Page", category: "Pages", url: "/static-pages/community", icon: FileText },
  { title: "FAQs Page", category: "Pages", url: "/static-pages/faqs", icon: FileText },
  { title: "Blog Journal", category: "Pages", url: "/blogs", icon: FileText },
  { title: "All Trips & Journeys", category: "Trips", url: "/trips", icon: Package },
  { title: "Destinations", category: "Trips", url: "/destinations", icon: Compass },
  { title: "Bookings", category: "Submissions", url: "/submissions/bookings", icon: Inbox },
  {
    title: "Contact Enquiries",
    category: "Submissions",
    url: "/submissions/enquiries",
    icon: Inbox,
  },
  { title: "Menu Links", category: "Navigation", url: "/navigation/menu-links", icon: Compass },
  {
    title: "Social Media & Footer",
    category: "Navigation",
    url: "/navigation/social-media",
    icon: Compass,
  },
  { title: "Global SEO", category: "SEO", url: "/seo/global", icon: Shield },
  { title: "Page SEO", category: "SEO", url: "/seo/pages", icon: Shield },
  { title: "Sitemap & Robots", category: "SEO", url: "/seo/sitemap-robots", icon: Shield },
  { title: "Profile Settings", category: "Settings", url: "/settings/profile", icon: Settings },
];

export function AdminHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = STATIC_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query),
    );
    setResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0B0F29] flex items-center gap-2">
          Welcome back <span className="text-[#0E5A60]">{userName}</span>
          <span className="text-2xl animate-bounce origin-bottom-right delay-700">👋</span>
        </h1>

        <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=d9f969`}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
      </header>

      <div className="flex justify-between items-center relative">
        <div className="relative group w-[350px]" ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0B0F29] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search CMS pages & settings..."
            className="pl-10 pr-10 py-3.5 bg-white border-0 ring-1 ring-gray-100 w-full rounded-full text-sm font-medium focus:ring-2 focus:ring-[#0E5A60] focus:outline-none shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsOpen(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Results Dropdown */}
          {isOpen && searchQuery && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden z-50 py-2 max-h-[300px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-5 py-4 text-xs font-semibold text-gray-400 text-center italic">
                  No matching CMS items found
                </div>
              ) : (
                <div className="flex flex-col">
                  {results.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        router.push(item.url);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors w-full cursor-pointer"
                    >
                      <div className="p-2 rounded-xl bg-red-50 text-[#0E5A60]">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-800">{item.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
