"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Phone,
  Building,
  X,
} from "lucide-react";
import { InputField } from "@/components/InputField";
import toast from "react-hot-toast";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interestedIn?: string | null;
  product?: string | null;
  budget?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

export default function EnquiriesCMSPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMessage, setActiveMessage] = useState<Enquiry | null>(null);

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
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase();
    const comp = (e.company || e.message?.match(/Company:\s*([^\n\r]+)/i)?.[1] || "").toLowerCase();
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      comp.includes(q) ||
      (e.product && e.product.toLowerCase().includes(q)) ||
      (e.interestedIn && e.interestedIn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="Customer & Fleet Inquiries"
        description="View and manage quotation requests, bulk barrel inquiries, and technical support questions."
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by name, email, company, or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          containerClassName="flex-1 w-full"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-8">
                  Name & Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Interested In / Product
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pr-8 text-right">
                  View Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D8232A]" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-400 italic">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 pl-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {enquiry.name}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {enquiry.email}
                        </span>
                        {enquiry.phone && (
                          <span className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {enquiry.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#D8232A] text-[11px] font-bold uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        {enquiry.product || enquiry.interestedIn || "General Quote"}
                      </div>
                      {(() => {
                        const comp =
                          enquiry.company ||
                          enquiry.message?.match(/Company:\s*([^\n\r]+)/i)?.[1]?.trim();
                        return comp ? (
                          <p className="text-xs text-gray-700 font-semibold mt-1 flex items-center gap-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            {comp}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic mt-1 flex items-center gap-1">
                            <Building className="w-3 h-3 text-gray-300" />
                            Company: —
                          </p>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-5 text-[13px] text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 pr-8 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveMessage(enquiry)}
                        title="View Full Message"
                        className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-[#D8232A] transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                      >
                        <MessageSquare className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0B0F29]">{activeMessage.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeMessage.email} &bull; {activeMessage.phone || "No phone"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Company / Firm
                </span>
                <span className="font-semibold text-gray-800">
                  {activeMessage.company ||
                    activeMessage.message?.match(/Company:\s*([^\n\r]+)/i)?.[1]?.trim() ||
                    "—"}
                </span>
              </div>
              {activeMessage.product && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Product / Grade
                  </span>
                  <span className="font-semibold text-gray-800">{activeMessage.product}</span>
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Inquiry Message
                </span>
                <p className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 leading-relaxed text-sm">
                  {activeMessage.message || "No custom message provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="px-6 py-2.5 bg-[#0B0F29] text-white rounded-full font-bold text-xs hover:bg-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
