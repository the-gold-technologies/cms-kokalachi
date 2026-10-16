"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Search,
  Loader2,
  Mail,
  Calendar,
  User,
  Building,
  MapPin,
  MessageSquare,
  Phone,
  X,
  ShieldCheck,
} from "lucide-react";
import { InputField } from "@/components/InputField";
import toast from "react-hot-toast";

interface DistributorApplication {
  id: string;
  name: string;
  firmName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  existingBusiness?: string;
  annualTurnover?: string;
  experienceYears?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export default function DistributorLeadsCMSPage() {
  const [leads, setLeads] = useState<DistributorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLead, setActiveLead] = useState<DistributorApplication | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/distributor-leads");
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
      }
    } catch {
      toast.error("Failed to load distributor applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.firmName.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="Distributor &amp; Dealership Applications"
        description="Review incoming dealership requests, turnover history, and territories from applicant firms."
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search applicant name, firm, city, state..."
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
                  Applicant & Firm
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Location / Territory
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Turnover & Exp
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pr-8 text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D8232A]" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 italic">
                    No dealership applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 pl-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {lead.name}
                        </span>
                        <span className="text-xs font-semibold text-[#D8232A] flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          {lead.firmName}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {lead.email} &bull; {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {lead.city}, {lead.state}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-600 font-medium">
                      <div>{lead.annualTurnover || "N/A"}</div>
                      <div className="text-gray-400 text-[11px]">
                        {lead.experienceYears || "0"} yrs in business
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[13px] text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 pr-8 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveLead(lead)}
                        title="View Application Details"
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

      {/* Detail Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0B0F29]">{activeLead.firmName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Applicant: {activeLead.name} &bull; {activeLead.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Location
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {activeLead.city}, {activeLead.state}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Annual Turnover
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {activeLead.annualTurnover || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Experience
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {activeLead.experienceYears || "0"} Years
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Existing Lines
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {activeLead.existingBusiness || "Lubricant retail"}
                </span>
              </div>
            </div>

            {activeLead.message && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Applicant Note
                </span>
                <p className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 text-sm leading-relaxed">
                  {activeLead.message}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
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
