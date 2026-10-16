"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";

export interface LocateDistributorData {
  contactTitle: string;
  logo: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  contactBtnText: string;
}

const initialLocateData: LocateDistributorData = {
  contactTitle: "",
  logo: "",
  companyName: "",
  address: "",
  phone: "",
  email: "",
  contactBtnText: "",
};

export function LocateDistributorSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<LocateDistributorData>(initialLocateData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        contactTitle: initialData.contactTitle || "",
        logo: initialData.logo || "",
        companyName: initialData.companyName || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        contactBtnText: initialData.contactBtnText || "",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        contactTitle: formData.contactTitle,
        logo: formData.logo,
        companyName: formData.companyName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        contactBtnText: formData.contactBtnText,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "LocateDistributorSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Contact details section saved!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Contact Details"
          description="Manage the company contact details shown on the homepage contact section."
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
              {/* Contact Title & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Contact Box Title"
                  value={formData.contactTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactTitle: e.target.value,
                    }))
                  }
                  placeholder="CONTACT DETAILS"
                />
                <InputField
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  placeholder="Mahalaxmi Enterprises"
                />
              </div>

              {/* Depot Address */}
              <InputField
                label="Depot Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India."
              />

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Direct Contact Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+91 98970 56000"
                />
                <InputField
                  label="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="info@hplubricantscfa.com"
                />
              </div>

              {/* Contact Button Text */}
              <InputField
                label="Contact Action Button Text"
                value={formData.contactBtnText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactBtnText: e.target.value,
                  }))
                }
                placeholder="CONTACT US"
              />

              {/* Save */}
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
    </section>
  );
}
