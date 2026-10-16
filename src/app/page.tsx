"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/app/components/AdminHeader";
import { OverviewStats } from "@/app/components/OverviewStats";
import { PageStructure } from "@/app/components/PageStructure";
import { RecentEnquiries } from "@/app/components/RecentEnquiries";
import { AdminRightSidebar } from "@/app/components/AdminRightSidebar";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Full-width Top Welcome Header */}
      <AdminHeader />

      {/* Grid Content Below Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Main Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <OverviewStats stats={stats} loading={loading} />

          <PageStructure stats={stats} loading={loading} />

          <RecentEnquiries />
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AdminRightSidebar stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
}
