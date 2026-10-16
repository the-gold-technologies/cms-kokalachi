"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Search,
  Loader2,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Eye,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  tripId: string;
  tripName: string;
  departureId?: string | null;
  departureDate?: string | null;
  totalAmount: number;
  specialRequests?: string | null;
  status: string;
  createdAt: string;
}

export default function BookingsCMSPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [searchQuery, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Booking status changed to ${newStatus}`);
        setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
        if (activeBooking && activeBooking.id === id) {
          setActiveBooking({ ...activeBooking, status: newStatus });
        }
      } else {
        toast.error(json.error ?? "Failed to update status");
      }
    } catch {
      toast.error("Network error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Booking deleted successfully");
        setBookings(bookings.filter((b) => b.id !== id));
        if (activeBooking && activeBooking.id === id) setActiveBooking(null);
      } else {
        toast.error(json.error ?? "Failed to delete");
      }
    } catch {
      toast.error("Network error deleting booking");
    }
  };

  return (
    <section className="flex flex-col gap-8 pb-16">
      <PageHeader
        title="Trip Bookings"
        description="Monitor guest reservations, confirmed departures, guest counts, and booking statuses."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by guest, email, phone, trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#0E5A60] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {["ALL", "Pending", "Confirmed", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-[#0E5A60] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center text-gray-400 gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#0E5A60]" />
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            No bookings found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-6">Guest</th>
                  <th className="py-3.5 px-6">Journey / Destination</th>
                  <th className="py-3.5 px-6">Departure Date</th>
                  <th className="py-3.5 px-6">Guests</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{b.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{b.email}</span> &bull; <span>{b.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#0E5A60]">{b.tripName}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                      {b.departureDate ?? "Flexible / Unassigned"}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700">
                      {b.guests} traveller{b.guests > 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setActiveBooking(b)}
                        className="p-2 text-gray-400 hover:text-[#0E5A60] rounded-lg hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative space-y-6">
            <button
              onClick={() => setActiveBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">Booking Details</span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">{activeBooking.tripName}</h3>
            </div>

            <div className="space-y-3 p-4 bg-gray-50/80 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Lead Guest:</span>
                <span className="font-bold text-gray-800">{activeBooking.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-mono text-gray-800">{activeBooking.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-mono text-gray-800">{activeBooking.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Travellers:</span>
                <span className="font-bold text-gray-800">{activeBooking.guests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Departure:</span>
                <span className="font-bold text-gray-800">{activeBooking.departureDate ?? "Not specified"}</span>
              </div>
              {activeBooking.specialRequests && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">Special Notes / Requests:</span>
                  <p className="text-gray-700 italic">{activeBooking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Change Status Controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Update Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["Pending", "Confirmed", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(activeBooking.id, st)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeBooking.status === st
                        ? "bg-[#0E5A60] text-white border-[#0E5A60]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
