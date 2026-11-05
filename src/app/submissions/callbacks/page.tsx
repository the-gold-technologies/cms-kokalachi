"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Search,
  Loader2,
  Calendar,
  Phone,
  Clock,
  Compass,
  X,
  Trash2,
  ExternalLink,
  MessageCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { InputField } from "@/components/InputField";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";

interface CallBack {
  id: string;
  name: string;
  phone: string;
  bestTime: string;
  tripId?: string | null;
  tripName?: string | null;
  tripUrl?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
}

export default function CallbacksCMSPage() {
  const [callBacks, setCallBacks] = useState<CallBack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeCallBack, setActiveCallBack] = useState<CallBack | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [callBackToDelete, setCallBackToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCallBacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/callbacks");
      const json = await res.json();
      if (json.success) {
        setCallBacks(json.data || []);
      } else {
        toast.error(json.error || "Failed to fetch call-back requests");
      }
    } catch {
      toast.error("Network error while loading call-back requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallBacks();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/callbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        setCallBacks((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
        if (activeCallBack && activeCallBack.id === id) {
          setActiveCallBack({ ...activeCallBack, status: newStatus });
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

  const handleSaveNotes = async () => {
    if (!activeCallBack) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch("/api/callbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeCallBack.id, notes: notesDraft }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Notes saved successfully");
        setCallBacks((prev) =>
          prev.map((c) => (c.id === activeCallBack.id ? { ...c, notes: notesDraft } : c)),
        );
        setActiveCallBack({ ...activeCallBack, notes: notesDraft });
      } else {
        toast.error(json.error || "Failed to save notes");
      }
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!callBackToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/callbacks?id=${callBackToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Call-back request deleted");
        setCallBacks((prev) => prev.filter((c) => c.id !== callBackToDelete.id));
        if (activeCallBack?.id === callBackToDelete.id) setActiveCallBack(null);
        setCallBackToDelete(null);
      } else {
        toast.error(json.error || "Failed to delete request");
      }
    } catch {
      toast.error("Network error deleting request");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDrawer = (cb: CallBack) => {
    setActiveCallBack(cb);
    setNotesDraft(cb.notes ?? "");
  };

  const filtered = callBacks.filter((cb) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      cb.name.toLowerCase().includes(q) ||
      cb.phone.toLowerCase().includes(q) ||
      (cb.tripName && cb.tripName.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || cb.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "called":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const cleanPhone = (phone: string) => phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Call Me Back Requests"
        description="View and follow up with travellers who requested a phone callback directly from journey detail pages."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by caller name, phone number, or journey name..."
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
            <option value="called">Called</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <span className="text-xs font-bold text-gray-400 shrink-0 px-2">
            {filtered.length} {filtered.length === 1 ? "Request" : "Requests"}
          </span>
        </div>
      </div>

      {/* Callbacks Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-8 w-[32%]">
                Caller &amp; Phone
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[26%]">
                Journey Inquired
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[16%]">
                Best Time to Call
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[14%]">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8 w-[12%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0E5A60]" />
                    <span className="text-sm font-semibold">Loading call-back requests...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Phone className="w-10 h-10 stroke-[1.5] text-gray-300 mb-1" />
                    <span className="text-sm font-semibold text-gray-600">No call-back requests found</span>
                    <span className="text-xs text-gray-400">
                      Requests submitted on journey pages will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((cb) => (
                <tr
                  key={cb.id}
                  onClick={() => openDrawer(cb)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 pl-8">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#0E5A60] transition-colors">
                        {cb.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${cb.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E5A60] hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {cb.phone}
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone(cb.phone)}?text=${encodeURIComponent(
                            `Hi ${cb.name}, this is Kokalachi Travel regarding your trip inquiry!`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"
                          title="Open WhatsApp chat"
                        >
                          <MessageCircle className="w-2.5 h-2.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-[#0E5A60] shrink-0" />
                      <span className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {cb.tripName || "General Consultation"}
                      </span>
                    </div>
                    {cb.tripUrl && (
                      <a
                        href={cb.tripUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#0E5A60] mt-0.5 underline"
                      >
                        <span>View Trip</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Clock className="w-3 h-3 text-[#D96C2C]" />
                      <span>{cb.bestTime}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(
                        cb.status,
                      )}`}
                    >
                      {cb.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right pr-8" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setCallBackToDelete({ id: cb.id, name: cb.name })}
                      className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail & Notes Slide-over Drawer */}
      {activeCallBack && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E5A60] bg-[#0E5A60]/10 px-2.5 py-1 rounded-full">
                  Call-Back Details
                </span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-2">
                  {activeCallBack.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCallBack(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Request Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Pending", "Called", "Resolved", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(activeCallBack.id, st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        activeCallBack.status.toLowerCase() === st.toLowerCase()
                          ? "bg-[#0E5A60] text-white border-[#0E5A60] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#0E5A60]/40"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${activeCallBack.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#0E5A60] hover:bg-[#0B2A3D] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {activeCallBack.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanPhone(activeCallBack.phone)}?text=${encodeURIComponent(
                    `Hi ${activeCallBack.name}, this is Kokalachi Travel regarding your trip inquiry!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Information Cards */}
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                    Best Time to Call
                  </span>
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D96C2C]" />
                    {activeCallBack.bestTime}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                    Journey Inquired
                  </span>
                  <span className="font-bold text-[#0E5A60] text-right">
                    {activeCallBack.tripName || "General Inquiry"}
                  </span>
                </div>

                {activeCallBack.tripUrl && (
                  <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                    <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                      Trip Page
                    </span>
                    <a
                      href={activeCallBack.tripUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0E5A60] font-semibold underline flex items-center gap-1"
                    >
                      <span>Open Journey</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                    Received At
                  </span>
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(activeCallBack.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Admin Internal Follow-up Notes */}
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Internal Follow-up Notes</span>
                </label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record call outcomes, guest preferences, or next steps..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-[#0E5A60] focus:ring-1 focus:ring-[#0E5A60] transition-colors"
                />
                <button
                  type="button"
                  disabled={isSavingNotes}
                  onClick={handleSaveNotes}
                  className="self-end px-4 py-2 bg-[#0E5A60] hover:bg-[#0B2A3D] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() =>
                  setCallBackToDelete({ id: activeCallBack.id, name: activeCallBack.name })
                }
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Request</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCallBack(null)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!callBackToDelete}
        title="Delete Call-Back Request"
        itemName={callBackToDelete?.name}
        message={`Are you sure you want to delete the call-back request for "${callBackToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setCallBackToDelete(null)}
      />
    </div>
  );
}

