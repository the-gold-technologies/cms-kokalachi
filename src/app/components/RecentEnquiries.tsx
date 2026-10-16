"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Tag, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  interestedIn?: string | null;
  product?: string | null;
  budget?: string | null;
  createdAt: string;
}

export function RecentEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/enquiries?limit=5");
        const json = await res.json();
        if (json.success) {
          setEnquiries(json.data);
        }
      } catch (error) {
        console.error("Error fetching recent enquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#0B0F29]">Recent Enquiries</h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Latest incoming messages from the contact page and product modals.
          </p>
        </div>
        <Link
          href="/submissions/enquiries"
          className="text-xs font-bold text-[#D8232A] hover:text-black flex items-center gap-1 bg-red-50/50 px-3 py-1.5 rounded-xl transition-all"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#D8232A]" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs italic">
          No enquiries received yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50/30 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                  {enquiry.name ? (
                    enquiry.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B0F29] group-hover:text-[#D8232A] transition-colors">
                    {enquiry.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      {enquiry.email}
                    </span>
                    {(enquiry.product || enquiry.interestedIn) && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-300" />
                        {enquiry.product || enquiry.interestedIn}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pl-14 md:pl-0">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
