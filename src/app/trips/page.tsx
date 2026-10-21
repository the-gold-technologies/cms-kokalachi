"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { VibeFiltersSection } from "./components/VibeFiltersSection";
import {
  Search,
  Plus,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Compass,
  Edit,
  Trash2,
  ExternalLink,
  Flame,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

function formatDepartureChip(departures: any[]): string {
  if (!departures || !Array.isArray(departures) || departures.length === 0) return "Upcoming";
  const openDeps = departures.filter((d: any) => d.status !== "closed");
  if (openDeps.length === 0) return "Upcoming";

  const first = openDeps[0];
  if (!first.startDate || !first.endDate) return "Upcoming";

  try {
    const s = new Date(`${first.startDate}T00:00:00Z`);
    const e = new Date(`${first.endDate}T00:00:00Z`);
    const sDay = s.getUTCDate();
    const eDay = e.getUTCDate();
    const sMonth = s.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
    const eMonth = e.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
    const year = e.getUTCFullYear();

    let dateText = "";
    if (sMonth === eMonth) {
      dateText = `${sDay} – ${eDay} ${eMonth} ${year}`;
    } else {
      dateText = `${sDay} ${sMonth} – ${eDay} ${eMonth} ${year}`;
    }

    if (openDeps.length > 1) {
      return `${dateText} (+${openDeps.length - 1} more)`;
    }
    return dateText;
  } catch {
    return first.startDate;
  }
}

export default function AllJourneysCMSPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [tripToDelete, setTripToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [vibeCategories, setVibeCategories] = useState<{ id: string; label: string }[]>([]);
  const [vibeData, setVibeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Hero Banner Section State
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [tagline, setTagline] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  const fetchTripsAndPageConfig = async () => {
    setLoading(true);
    try {
      const [tripsRes, pageRes] = await Promise.all([fetch("/api/trips"), fetch("/api/journeys")]);
      const tripsJson = await tripsRes.json();
      const pageJson = await pageRes.json();

      if (tripsJson.success && Array.isArray(tripsJson.data)) {
        setTrips(tripsJson.data);
      } else {
        toast.error(tripsJson.error ?? "Failed to load journeys");
      }

      if (pageJson.success && pageJson.data?.sections) {
        const sections = pageJson.data.sections;
        if (sections.JourneysHeroSection) {
          const h = sections.JourneysHeroSection;
          setTagline(h.tagline ?? "");
          setBannerTitle(h.title ?? "");
          setScriptAccent(h.scriptAccent ?? "");
          setDescription(h.description ?? "");
          setBannerImage(h.bannerImage ?? "");
        }
        if (sections.JourneysFilterSection) {
          setVibeData(sections.JourneysFilterSection);
          if (Array.isArray(sections.JourneysFilterSection.categories)) {
            setVibeCategories(sections.JourneysFilterSection.categories);
          }
        }
      }
    } catch {
      toast.error("Network error loading journeys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsAndPageConfig();
  }, []);

  const handleSaveBanner = async () => {
    setHeroLoading(true);
    setHeroSaved(false);
    try {
      const payload = {
        tagline,
        title: bannerTitle,
        scriptAccent,
        description,
        bannerImage,
      };

      const res = await fetch("/api/journeys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "JourneysHeroSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setHeroSaved(true);
        toast.success("Journeys page banner updated successfully!");
        setTimeout(() => setHeroSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save banner");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving page banner");
    } finally {
      setHeroLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success(`"${tripToDelete.title}" deleted successfully`);
        setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
        setTripToDelete(null);
      } else {
        toast.error(json.error ?? "Failed to delete journey");
      }
    } catch {
      toast.error("Failed to delete journey");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTrips = trips.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.destinationSlug?.toLowerCase().includes(q) ||
      t.slug?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === "All" || t.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="All Journeys & Tours"
          description="Manage your curated group travel experiences. Configure card visuals, live booking batches, pricing, vibe categories, and internal detail itineraries in one central place."
        />

        <Link
          href="/trips/create"
          className="px-5 py-3 rounded-2xl bg-[#0E5A60] hover:bg-[#061C29] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Journey
        </Link>
      </div>

      {/* Expandable Section 1: Public Page Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300">
        <SectionHeader
          title="Public Page Header Banner"
          description="Controls the visual banner headline, description, and hero photo on the public /journeys page."
          isOpen={isHeroOpen}
          onToggle={() => setIsHeroOpen(!isHeroOpen)}
        />

        {isHeroOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveBanner();
            }}
            className="mt-6 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Tagline / Badge"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Find Your Next Adventure"
              />
              <InputField
                label="Main Title Word"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="e.g. All"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Script Accent Text (Underlined)"
                value={scriptAccent}
                onChange={(e) => setScriptAccent(e.target.value)}
                placeholder="e.g. Journeys"
              />
              <ImagePickerField
                label="Hero Background Image"
                value={bannerImage}
                onChange={(val) => setBannerImage(val)}
                placeholder="https://..."
              />
            </div>

            <TextAreaField
              label="Hero Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="From the misty mountains of Meghalaya to the backwaters of Kerala..."
            />

            <div className="pt-4 border-t border-gray-100">
              <SaveButton loading={heroLoading} saved={heroSaved} onClick={handleSaveBanner} />
            </div>
          </form>
        )}
      </div>

      {/* Expandable Section 2: Manage Vibe Filters (Centralized Filter by Vibe) */}
      <VibeFiltersSection
        initialData={vibeData}
        onSaved={(updatedCategories) => setVibeCategories(updatedCategories)}
      />

      {/* Filter and Search Bar (NO Table Toggle - Pure Card Type Structure) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search journeys by title, location, or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          containerClassName="flex-1 w-full"
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-52 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 cursor-pointer"
          >
            <option value="All">All Vibe Categories</option>
            {vibeCategories
              .filter((c) => c.id !== "All")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label || c.id}
                </option>
              ))}
          </select>

          <span className="text-xs font-bold text-gray-400 shrink-0 px-2 whitespace-nowrap">
            {filteredTrips.length} {filteredTrips.length === 1 ? "Journey Card" : "Journey Cards"}
          </span>
        </div>
      </div>

      {/* CARD TYPE STRUCTURE ONLY */}
      {loading ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0E5A60]" />
          <p className="text-gray-400 text-xs mt-3">Loading journeys...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <p className="text-gray-700 font-bold text-base">No journeys found</p>
          <p className="text-gray-400 text-xs mt-1">
            {search || categoryFilter !== "All"
              ? "Try adjusting your search query or vibe filter."
              : "Click Create New Journey to add your first curated experience."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const openDepartures = Array.isArray(trip.departures)
              ? trip.departures.filter((d: any) => d.status === "open")
              : [];
            const spotsLeft = openDepartures.reduce(
              (acc: number, d: any) => acc + (d.spotsLeft || 0),
              0,
            );

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative"
              >
                {/* Image Section with Badges */}
                <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-3 bg-slate-100">
                  {trip.image ? (
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-slate-50">
                      <Compass className="w-10 h-10 opacity-30" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-60" />

                  {/* Destination Tag */}
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#D96C2C]" />
                    <span>{trip.destinationSlug || "India"}</span>
                  </div>

                  {/* Spots Left Pill */}
                  {spotsLeft > 0 ? (
                    <div className="absolute top-3 right-3 z-10 bg-[#0E5A60]/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#D96C2C] fill-[#D96C2C]" />
                      <span>{spotsLeft} Spots</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 z-10 bg-slate-800/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                      Sold Out
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D96C2C] text-white uppercase tracking-wider shadow-sm">
                      {trip.category || "Trending"}
                    </span>
                  </div>

                  {/* Slideshow Indicator Dots */}
                  {Array.isArray(trip.gallery) && trip.gallery.length > 0 && (
                    <div className="absolute bottom-3.5 left-0 right-0 z-10 flex justify-center gap-1.5 pointer-events-none">
                      <span className="w-4 h-1.5 rounded-full bg-white opacity-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 opacity-60" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 opacity-60" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 px-2 pb-2">
                  <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#0E5A60] transition-colors line-clamp-1 mb-1">
                    {trip.title}
                  </h3>

                  {trip.subtitle ? (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-3">{trip.subtitle}</p>
                  ) : null}

                  {/* Key Stats Chips */}
                  <div className="flex flex-col gap-2 my-2 py-2 border-y border-gray-100 text-xs text-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0E5A60] shrink-0" />
                        <span className="truncate font-semibold">
                          {trip.duration || "Flexible"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0E5A60] shrink-0" />
                        <span className="truncate">{trip.groupSize || "Intimate Group"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="inline-flex items-center gap-1.5 bg-[#0E5A60]/[0.08] border border-[#0E5A60]/15 text-[#0E5A60] px-2.5 py-1 rounded-md text-[11px] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#0E5A60] shrink-0" />
                        <span>{formatDepartureChip(trip.departures)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vibe Tags */}
                  {Array.isArray(trip.vibeTags) && trip.vibeTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-1">
                      {trip.vibeTags.slice(0, 3).map((tagStr: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-gray-100 text-gray-600"
                        >
                          #{tagStr}
                        </span>
                      ))}
                      {trip.vibeTags.length > 3 ? (
                        <span className="text-[10px] text-gray-400 self-center">
                          +{trip.vibeTags.length - 3} more
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Price & Action Buttons */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        Starting From
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#D96C2C]">
                          {typeof trip.price === "number" && trip.price > 0
                            ? `₹${Number(trip.price).toLocaleString("en-IN")}`
                            : "Price TBA"}
                        </span>
                        {trip.originalPrice && trip.originalPrice > 0 ? (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{Number(trip.originalPrice).toLocaleString("en-IN")}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`${websiteUrl}/journeys/${trip.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-[#0E5A60] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        title="View on Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/trips/edit/${trip.id}`}
                        className="px-3.5 py-2 rounded-xl bg-[#0E5A60] hover:bg-[#061C29] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setTripToDelete({ id: trip.id, title: trip.title })}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Journey"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Delete Confirmation Popup Modal */}
      <DeleteConfirmModal
        isOpen={!!tripToDelete}
        title="Delete Journey"
        itemName={tripToDelete?.title}
        message="Are you sure you want to permanently delete this journey? All its departures, itinerary days, inclusions, and bookings will be removed. This action cannot be undone."
        confirmLabel="Yes, Delete Journey"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleteLoading) setTripToDelete(null);
        }}
      />
    </div>
  );
}
