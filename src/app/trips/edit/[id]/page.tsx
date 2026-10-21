"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import {
  JourneyCardSection,
  JourneyDeparturesSection,
  JourneyExperienceSection,
  JourneyLogisticsSection,
  JourneyFaqSection,
  JourneySeoSection,
} from "../../components";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Compass,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EditJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrip(json.data);
      } else {
        toast.error(json.error ?? "Failed to load journey details");
      }
    } catch (err) {
      toast.error("Network error loading journey");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E5A60]" />
        <p className="text-xs text-gray-400 font-semibold">Loading journey editor...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-2xl">
          !
        </div>
        <h3 className="text-xl font-bold text-gray-800">Journey Not Found</h3>
        <p className="text-xs text-gray-500 max-w-sm">
          The requested trip could not be found or may have been deleted.
        </p>
        <Link
          href="/trips"
          className="px-5 py-2.5 rounded-xl bg-[#0E5A60] text-white text-xs font-bold hover:bg-[#061C29] transition-colors"
        >
          Return to All Journeys
        </Link>
      </div>
    );
  }

  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-7xl mx-auto w-full">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0E5A60] transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journeys
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`${websiteUrl}/journeys/${trip.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-4 py-2 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Preview on Website
          </a>
        </div>
      </div>

      {/* Main Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-gray-200">
            {trip.image ? (
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Compass className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D96C2C]/10 text-[#D96C2C] uppercase tracking-wider">
                {trip.category || "Trending"}
              </span>
              {trip.destinationSlug && (
                <span className="text-xs font-semibold text-gray-400">
                  • {trip.destinationSlug}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 leading-tight">
              {trip.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {trip.duration || "Duration not set"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {trip.departures?.length || 0} Batches
              </span>
              <span className="font-bold text-[#D96C2C]">
                ₹{Number(trip.price).toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 6 Unified Sections */}
      <JourneyCardSection
        tripId={trip.id}
        initialData={trip}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, ...updated }))}
      />

      <JourneyDeparturesSection
        tripId={trip.id}
        initialDepartures={trip.departures}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, departures: updated.departures }))}
      />

      <JourneyExperienceSection
        tripId={trip.id}
        initialData={trip}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, ...updated }))}
      />

      <JourneyLogisticsSection
        tripId={trip.id}
        initialData={trip}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, ...updated }))}
      />

      <JourneyFaqSection
        tripId={trip.id}
        initialFaqs={trip.faqs}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, faqs: updated.faqs }))}
      />

      <JourneySeoSection
        tripId={trip.id}
        initialData={trip}
        onSaved={(updated) => setTrip((prev: any) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
