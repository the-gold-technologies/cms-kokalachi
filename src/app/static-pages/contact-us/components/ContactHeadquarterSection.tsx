"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface HeadquarterData {
  companyName?: string;
  badge?: string;
  description?: string;
  proprietor?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

interface ContactHeadquarterSectionProps {
  initialData?: HeadquarterData;
  onSave?: (data: HeadquarterData) => Promise<boolean | void>;
}

export function ContactHeadquarterSection({ initialData, onSave }: ContactHeadquarterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [proprietor, setProprietor] = useState(initialData?.proprietor || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.companyName !== undefined) setCompanyName(initialData.companyName || "");
      if (initialData.badge !== undefined) setBadge(initialData.badge || "");
      if (initialData.description !== undefined) setDescription(initialData.description || "");
      if (initialData.proprietor !== undefined) setProprietor(initialData.proprietor || "");
      if (initialData.address !== undefined) setAddress(initialData.address || "");
      if (initialData.phone !== undefined) setPhone(initialData.phone || "");
      if (initialData.email !== undefined) setEmail(initialData.email || "");
      if (initialData.whatsapp !== undefined) setWhatsapp(initialData.whatsapp || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: HeadquarterData = {
        companyName: companyName.trim(),
        badge: badge.trim(),
        description: description.trim(),
        proprietor: proprietor.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
      };

      if (onSave) {
        await onSave(payload);
      } else {
        const res = await fetch("/api/contact-us", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "ContactHeadquarter",
            content: payload,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Headquarter contact details updated successfully!");
        } else {
          toast.error(json.error || "Failed to update headquarter details");
        }
      }
    } catch {
      toast.error("Network error saving headquarter details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="2. Headquarter & Contact Details"
        description="Configure the primary enterprise identity, proprietor credentials, depot address, and business hours."
        badge="Official HQ"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Enterprise Name *"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Mahalaxmi Enterprises"
                required
              />
              <InputField
                label="Distributor Designation / Badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Authorized Industrial Lube Distributor"
              />
            </div>

            <TextAreaField
              label="Overview / Short Description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Connect with our team for HP Lubricants requirements, technical seminars, and bulk inquiries."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <InputField
                label="Proprietor / Key Contact"
                value={proprietor}
                onChange={(e) => setProprietor(e.target.value)}
                placeholder="Neha Goyal"
              />
              <InputField
                label="Direct Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 88007 78032"
                required
              />
              <InputField
                label="WhatsApp Number / Contact"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 88007 78032"
              />
              <InputField
                label="Official Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@hplubricantscfa.com"
                required
              />
            </div>

            <TextAreaField
              label="Depot Address *"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="HPCL Petrol Pump, Ground & 1st Floor, Kh No- 487/0048, Aggarwal Mandi Tatiri, Baghpat, Uttar Pradesh - 250601"
              required
            />

            <div className="pt-4 border-t border-gray-100">
              <SaveButton
                loading={loading}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
