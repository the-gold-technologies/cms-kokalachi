"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";

export interface LubesHeadquarterData {
  title?: string;
  badge?: string;
  proprietor?: string;
  servingRegion?: string;
  establishment?: string;
  phone?: string;
  email?: string;
}

export function LubesHeadquarterSection({ initialData }: { initialData?: LubesHeadquarterData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [proprietor, setProprietor] = useState(initialData?.proprietor || "");
  const [servingRegion, setServingRegion] = useState(initialData?.servingRegion || "");
  const [establishment, setEstablishment] = useState(initialData?.establishment || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");

  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title || "");
      if (initialData.badge !== undefined) setBadge(initialData.badge || "");
      if (initialData.proprietor !== undefined) setProprietor(initialData.proprietor || "");
      if (initialData.servingRegion !== undefined)
        setServingRegion(initialData.servingRegion || "");
      if (initialData.establishment !== undefined)
        setEstablishment(initialData.establishment || "");
      if (initialData.phone !== undefined) setPhone(initialData.phone || "");
      if (initialData.email !== undefined) setEmail(initialData.email || "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        title: title.trim(),
        badge: badge.trim(),
        proprietor: proprietor.trim(),
        servingRegion: servingRegion.trim(),
        establishment: establishment.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };

      const res = await fetch("/api/about-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "LubesHeadquarterSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Lubes Headquarters section saved successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving Lubes Headquarters section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="3. Industrial Lubes Headquarters & Regional ILD Info"
        description="Manage company branding, ILD badge, proprietor, serving region, track record, and direct contact details."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Company / Enterprise Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. MAHALAXMI ENTERPRISES"
              />
              <InputField
                label="ILD Badge / Designation"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. AUTHORIZED INDUSTRIAL LUBE DISTRIBUTOR (ILD)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Proprietor Name"
                value={proprietor}
                onChange={(e) => setProprietor(e.target.value)}
                placeholder="e.g. Neha Goyal"
              />
              <InputField
                label="Serving Region"
                value={servingRegion}
                onChange={(e) => setServingRegion(e.target.value)}
                placeholder="e.g. Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh"
              />
            </div>

            <InputField
              label="Establishment & Clientele Milestone"
              value={establishment}
              onChange={(e) => setEstablishment(e.target.value)}
              placeholder="e.g. Est. 2023 | 100+ Industrial Clients & Government Department Supplier"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Direct Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 88007 78032"
              />
              <InputField
                label="Contact Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. info@hplubricantscfa.com"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={loading}
                saved={saved}
                onClick={handleSave}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
