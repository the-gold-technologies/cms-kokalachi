"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Search,
  Loader2,
  Mail,
  Calendar,
  MessageSquare,
  Phone,
  Compass,
  Users,
  Sparkles,
  X,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { InputField } from "@/components/InputField";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  journey?: string | null;
  travelDate?: string | null;
  groupSize?: string | null;
  message: string;
  hearAboutUs?: string | null;
  status: string;
  createdAt: string;
}

export default function EnquiriesCMSPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/enquiries");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data || []);
      } else {
        toast.error(json.error || "Failed to fetch enquiries");
      }
    } catch {
      toast.error("Network error while loading enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
        if (activeEnquiry && activeEnquiry.id === id) {
          setActiveEnquiry({ ...activeEnquiry, status: newStatus });
        }
      } else {
        toast.error(json.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!enquiryToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/enquiries?id=${enquiryToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Enquiry deleted successfully");
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id));
        if (activeEnquiry?.id === enquiryToDelete.id) setActiveEnquiry(null);
        setEnquiryToDelete(null);
      } else {
        toast.error(json.error || "Failed to delete enquiry");
      }
    } catch {
      toast.error("Network error deleting enquiry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.journey && e.journey.toLowerCase().includes(q)) ||
      (e.message && e.message.toLowerCase().includes(q)) ||
      (e.hearAboutUs && e.hearAboutUs.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "contacted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "archived":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Guest Enquiries & Messages"
        description="View, manage, and follow up with travellers who reached out through the contact form or requested custom journey details."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by guest name, email, phone, journey, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          containerClassName="flex-1 w-full"
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E5A60]/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          <span className="text-xs font-bold text-gray-400 shrink-0 px-2">
            {filtered.length} {filtered.length === 1 ? "Enquiry" : "Enquiries"}
          </span>
        </div>
      </div>

      {/* Enquiries Table - No Horizontal Scroll, Clean & Balanced */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-8 w-[35%]">
                Guest & Contact
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[28%]">
                Interested Journey
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[14%]">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[11%]">
                Received
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8 w-[12%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0E5A60]" />
                  <p className="text-gray-400 text-xs mt-3">Loading guest enquiries...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20">
                  <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-gray-600 font-semibold text-sm">No enquiries found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search query or filter"
                      : "Submissions from the Contact Page will appear here."}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Guest Column */}
                  <td className="px-6 py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] font-bold text-sm flex items-center justify-center shrink-0">
                        {e.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{e.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 truncate">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{e.email}</span>
                          </span>
                        </div>
                        {e.phone ? (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{e.phone}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Journey Column */}
                  <td className="px-6 py-4">
                    {e.journey ? (
                      <div className="flex items-center gap-2 font-semibold text-[#0E5A60]">
                        <Compass className="w-4 h-4 shrink-0 text-[#D96C2C]" />
                        <span className="line-clamp-2 leading-snug">{e.journey}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">General Question</span>
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <select
                      value={e.status}
                      onChange={(evt) => handleUpdateStatus(e.id, evt.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadge(
                        e.status,
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>

                  {/* Received Date Column */}
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right pr-8 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveEnquiry(e)}
                        className="px-3.5 py-2 rounded-xl bg-[#0E5A60]/10 hover:bg-[#0E5A60] text-[#0E5A60] hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() =>
                          setEnquiryToDelete({
                            id: e.id,
                            name: `Enquiry from ${e.name || "User"} (${e.journey || "General"})`,
                          })
                        }
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Detail & Message Modal - Houses All Additional Details */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0E5A60]/10 text-[#0E5A60] font-bold text-lg flex items-center justify-center shrink-0">
                  {activeEnquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{activeEnquiry.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Received on{" "}
                    {new Date(activeEnquiry.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <a
                  href={`mailto:${activeEnquiry.email}`}
                  className="text-sm font-semibold text-[#0E5A60] hover:underline flex items-center gap-1"
                >
                  <span className="truncate">{activeEnquiry.email}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </span>
                {activeEnquiry.phone ? (
                  <a
                    href={`tel:${activeEnquiry.phone}`}
                    className="text-sm font-semibold text-[#0E5A60] hover:underline flex items-center gap-1"
                  >
                    <span>{activeEnquiry.phone}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">Not provided</span>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Journey of Interest
                </span>
                <div className="text-sm font-semibold text-gray-800">
                  {activeEnquiry.journey ? activeEnquiry.journey : "General Inquiry"}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Group & Travel Date
                </span>
                <div className="text-sm font-semibold text-gray-800">
                  {activeEnquiry.groupSize ? activeEnquiry.groupSize : "1 traveller"}
                  {activeEnquiry.travelDate ? ` • ${activeEnquiry.travelDate}` : " • Date Flexible"}
                </div>
              </div>
            </div>

            {/* How did you hear about us */}
            {activeEnquiry.hearAboutUs ? (
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center gap-2 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-[#D96C2C] shrink-0" />
                <span>
                  Discovered Kokalachi through:{" "}
                  <strong className="font-semibold">{activeEnquiry.hearAboutUs}</strong>
                </span>
              </div>
            ) : null}

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#0E5A60]" /> Traveller Message
              </span>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {activeEnquiry.message ? activeEnquiry.message : "No message content provided."}
              </div>
            </div>

            {/* Status Control & Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-500">Status:</span>
                <select
                  value={activeEnquiry.status}
                  disabled={isUpdatingStatus}
                  onChange={(evt) => handleUpdateStatus(activeEnquiry.id, evt.target.value)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border cursor-pointer focus:outline-none transition-colors ${getStatusBadge(
                    activeEnquiry.status,
                  )}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {activeEnquiry.phone ? (
                  <a
                    href={`tel:${activeEnquiry.phone}`}
                    className="px-4 py-2.5 rounded-xl bg-[#0E5A60] hover:bg-[#061C29] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                ) : null}
                <a
                  href={`mailto:${activeEnquiry.email}?subject=Re: Your Kokalachi Travel Enquiry`}
                  className="px-4 py-2.5 rounded-xl bg-[#D96C2C] hover:bg-[#b8561d] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply Email
                </a>
                <button
                  onClick={() => setActiveEnquiry(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={!!enquiryToDelete}
        title="Delete Enquiry"
        itemName={enquiryToDelete?.name}
        message="Are you sure you want to permanently delete this enquiry record? This action cannot be undone."
        confirmLabel="Yes, Delete Enquiry"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleteLoading) setEnquiryToDelete(null);
        }}
      />
    </div>
  );
}
