"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  Compass,
  BookOpen,
  Layers,
  LucideIcon,
  ChevronDown,
  LogOut,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

type SidebarLink = {
  title: string;
  icon: LucideIcon;
  href?: string;
  sublinks?: { title: string; href: string }[];
  badge?: string | number;
};

const sidebarLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Navigation & Links",
    icon: Compass,
    sublinks: [
      { title: "Menu Links", href: "/navigation/menu-links" },
      { title: "Social Media & Footer", href: "/navigation/social-media" },
    ],
  },
  {
    title: "Journeys",
    icon: Compass,
    sublinks: [{ title: "All Journeys", href: "/trips" }],
  },
  {
    title: "Pages",
    icon: BookOpen,
    sublinks: [
      { title: "Home", href: "/static-pages/home" },
      { title: "About Us", href: "/static-pages/about" },
      { title: "Contact Us", href: "/static-pages/contact" },
      { title: "FAQs", href: "/static-pages/faqs" },
    ],
  },
  {
    title: "Submissions",
    icon: Layers,
    sublinks: [
      { title: "Bookings", href: "/submissions/bookings" },
      { title: "Enquiries", href: "/submissions/enquiries" },
    ],
  },
  {
    title: "SEO Management",
    icon: Globe,
    sublinks: [
      { title: "Global Settings", href: "/seo/global" },
      { title: "Page Settings", href: "/seo/pages" },
      { title: "Sitemap & Robots", href: "/seo/sitemap-robots" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    sublinks: [{ title: "Profile", href: "/settings/profile" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    return sidebarLinks
      .filter((item) => item.sublinks?.some((sublink) => pathname.startsWith(sublink.href)))
      .map((item) => item.title);
  });

  useEffect(() => {
    const activeGroups = sidebarLinks
      .filter((item) => item.sublinks?.some((sublink) => pathname.startsWith(sublink.href)))
      .map((item) => item.title);

    setOpenGroups((prev) => {
      const newGroups = [...prev];
      activeGroups.forEach((group) => {
        if (!newGroups.includes(group)) {
          newGroups.push(group);
        }
      });
      return newGroups;
    });
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    <div className="flex h-full w-[280px] flex-col bg-[#0B2A3D] text-white overflow-hidden rounded-l-[2.5rem] border-l border-white/5 shrink-0">
      {/* Logo Area */}
      <div className="flex h-24 items-center px-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#0E5A60] font-black italic shadow-sm text-lg">
            K
          </div>
          <span className="font-bold text-lg tracking-tight">
            Kokalachi <span className="text-[#D97745] font-semibold">CMS</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <nav className="space-y-1.5 px-6">
          {sidebarLinks.map((item, index) => {
            const isActive = pathname === item.href;
            const isOpen = openGroups.includes(item.title);

            if (item.sublinks) {
              return (
                <div key={index} className="pt-4 first:pt-0">
                  <div
                    className="flex items-center justify-between cursor-pointer group mb-2 pr-4 pl-4"
                    onClick={() => toggleGroup(item.title)}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                      <item.icon className="w-3.5 h-3.5" />
                      {item.title}
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-500 transition-transform group-hover:text-gray-300",
                        isOpen ? "rotate-180" : "",
                      )}
                    />
                  </div>
                  {isOpen && (
                    <div className="space-y-1 pl-4 ml-2 border-l border-gray-800 py-1">
                      {item.sublinks.map((sublink, subIndex) => {
                        const isSubActive = pathname === sublink.href;
                        return (
                          <Link
                            key={subIndex}
                            href={sublink.href}
                            className={cn(
                              "block px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200",
                              isSubActive
                                ? "bg-[#0E5A60] text-white shadow-sm shadow-[#D8232A]/20 transform scale-[1.02]"
                                : "text-gray-400 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            {sublink.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                href={item.href!}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 mt-2",
                  isActive
                    ? "bg-[#0E5A60] text-white shadow-sm shadow-[#D8232A]/20 transform scale-[1.02]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.title}
                </div>
                {item.badge && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0E5A60]/80 text-white text-[10px] font-bold">
                    {item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-8 border-t border-gray-800 pt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-[14px] font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
