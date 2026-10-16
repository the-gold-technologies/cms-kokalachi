"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { SaveButton } from "@/components/SaveButton";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setName(json.data.name || session?.user?.name || "");
          setEmail(json.data.email || session?.user?.email || "");
        } else if (session?.user) {
          setName(session.user.name || "");
          setEmail(session.user.email || "");
        }
      } catch (err) {
        if (session?.user) {
          setName(session.user.name || "");
          setEmail(session.user.email || "");
        }
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (!currentPassword) {
        toast.error("Please enter your current password to set a new password");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
    }

    setLoading(true);
    setSaved(false);
    const tid = toast.loading("Updating profile...");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(json.message || "Profile updated successfully!", { id: tid });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (update) {
          await update({ name, email });
        }
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to update profile", { id: tid });
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error updating profile", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">Loading profile details...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <PageHeader
        title="Admin Profile & Account Settings"
        description="Update your administrator credentials, email address, and dashboard security password."
      />

      <form
        onSubmit={handleSave}
        className="w-full bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-8"
      >
        {/* 1. Administrator Information */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-[#002B5C] rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B0F29]">1. Administrator Information</h2>
              <p className="text-xs text-slate-400">
                Primary contact details for this administrator account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Mahalaxmi Admin"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@mahalaxmi.com"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 2. Change Password */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-red-50 text-[#D8232A] rounded-2xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B0F29]">2. Change Password</h2>
              <p className="text-xs text-slate-400">
                Update your login password. Leave blank if you do not want to change it.
              </p>
            </div>
          </div>

          {/* Current Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                CONFIRM NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B5C] transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
          <SaveButton
            loading={loading}
            saved={saved}
            type="submit"
            label="Update Profile"
            className="w-auto px-10"
          />
        </div>
      </form>
    </div>
  );
}
