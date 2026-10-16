"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImageUploadField } from "@/components/ImageUploadField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface AboutMahalaxmiContentData {
  title?: string;
  subtitle?: string;
  proprietorRole?: string;
  distributorBadge?: string;
  distributorCompany?: string;
  proprietorPhoto?: string;
  proprietorPhotoAlt?: string;
  paragraphs?: string[];
  hpclOverview?: any;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  whyChooseItems?: WhyChooseItem[];
}

export function AboutMahalaxmiContentSection({
  initialData,
}: {
  initialData?: AboutMahalaxmiContentData;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [proprietorRole, setProprietorRole] = useState(initialData?.proprietorRole || "");
  const [distributorBadge, setDistributorBadge] = useState(initialData?.distributorBadge || "");
  const [distributorCompany, setDistributorCompany] = useState(
    initialData?.distributorCompany || "",
  );
  const [proprietorPhotos, setProprietorPhotos] = useState<(File | string | null)[]>(
    initialData?.proprietorPhoto ? [initialData.proprietorPhoto] : [],
  );
  const [proprietorPhotoAlt, setProprietorPhotoAlt] = useState(
    initialData?.proprietorPhotoAlt || "",
  );
  const [paragraphsText, setParagraphsText] = useState(
    Array.isArray(initialData?.paragraphs)
      ? initialData.paragraphs.join("\n\n")
      : typeof initialData?.paragraphs === "string"
        ? initialData.paragraphs
        : "",
  );
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialData?.whyChooseTitle || "");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialData?.whyChooseSubtitle || "");
  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseItem[]>(
    Array.isArray(initialData?.whyChooseItems) ? initialData.whyChooseItems : [],
  );

  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title || "");
      if (initialData.subtitle !== undefined) setSubtitle(initialData.subtitle || "");
      if (initialData.proprietorRole !== undefined)
        setProprietorRole(initialData.proprietorRole || "");
      if (initialData.distributorBadge !== undefined)
        setDistributorBadge(initialData.distributorBadge || "");
      if (initialData.distributorCompany !== undefined)
        setDistributorCompany(initialData.distributorCompany || "");
      if (initialData.proprietorPhoto !== undefined) {
        setProprietorPhotos(initialData.proprietorPhoto ? [initialData.proprietorPhoto] : []);
      }
      if (initialData.proprietorPhotoAlt !== undefined) {
        setProprietorPhotoAlt(initialData.proprietorPhotoAlt || "");
      }
      if (Array.isArray(initialData.paragraphs)) {
        setParagraphsText(initialData.paragraphs.join("\n\n"));
      } else if (typeof initialData.paragraphs === "string") {
        setParagraphsText(initialData.paragraphs);
      }
      if (initialData.whyChooseTitle !== undefined)
        setWhyChooseTitle(initialData.whyChooseTitle || "");
      if (initialData.whyChooseSubtitle !== undefined)
        setWhyChooseSubtitle(initialData.whyChooseSubtitle || "");
      if (Array.isArray(initialData.whyChooseItems)) {
        setWhyChooseItems(initialData.whyChooseItems);
      }
    }
  }, [initialData]);

  const handleWhyChooseChange = (index: number, field: keyof WhyChooseItem, val: string) => {
    setWhyChooseItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddWhyChooseItem = () => {
    setWhyChooseItems((prev) => [
      ...prev,
      {
        icon: "ShieldCheck",
        title: "New Feature",
        description: "Description of your key capability or advantage.",
      },
    ]);
  };

  const handleRemoveWhyChooseItem = (index: number) => {
    setWhyChooseItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const validImages = proprietorPhotos.filter((img): img is File | string => !!img);

      let finalProprietorPhoto = "";
      if (validImages.length > 0) {
        const [uploadedUrl] = await uploadFiles(validImages);
        finalProprietorPhoto =
          uploadedUrl || (typeof validImages[0] === "string" ? validImages[0] : "");
      }

      const parsedParagraphs = paragraphsText
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        proprietorRole: proprietorRole.trim(),
        distributorBadge: distributorBadge.trim(),
        distributorCompany: distributorCompany.trim(),
        proprietorPhoto: finalProprietorPhoto,
        proprietorPhotoAlt: proprietorPhotoAlt.trim(),
        paragraphs: parsedParagraphs,
        hpclOverview: (initialData as any)?.hpclOverview || undefined,
        whyChooseTitle: whyChooseTitle.trim(),
        whyChooseSubtitle: whyChooseSubtitle.trim(),
        whyChooseItems: whyChooseItems,
      };

      const res = await fetch("/api/about-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "AboutMahalaxmiContent",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        if (finalProprietorPhoto) {
          setProprietorPhotos([finalProprietorPhoto]);
        }
        toast.success("About Mahalaxmi section saved successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving About Mahalaxmi section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
      <SectionHeader
        title="2. About Mahalaxmi Enterprises & Why Choose Us"
        description="Manage proprietor introduction, corporate narrative paragraphs, proprietor photo, and Why Choose Us feature cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-6 pt-4">
            {/* Titles & Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                label="Main Section Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ABOUT MAHALAXMI ENTERPRISES"
              />
              <InputField
                label="Proprietor Name"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Neha Goyal"
              />
              <InputField
                label="Proprietor Role / Designation"
                value={proprietorRole}
                onChange={(e) => setProprietorRole(e.target.value)}
                placeholder="e.g. Proprietor, Mahalaxmi Enterprises"
              />
            </div>

            {/* Distributor Badge & Company Affiliation (ILD Card Footer) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Distributor Status Badge (ILD)"
                value={distributorBadge}
                onChange={(e) => setDistributorBadge(e.target.value)}
                placeholder="e.g. Authorized Industrial Lube Distributor (ILD)"
                helperText="Displayed inside the executive profile card status bar"
              />
              <InputField
                label="Affiliation / Parent Entity"
                value={distributorCompany}
                onChange={(e) => setDistributorCompany(e.target.value)}
                placeholder="e.g. Hindustan Petroleum Corporation Limited (HPCL)"
                helperText="Partner corporation name displayed alongside distributor status"
              />
            </div>

            {/* Proprietor Photo & Alt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <ImageUploadField
                label="Proprietor Photo"
                images={proprietorPhotos}
                onImagesChange={setProprietorPhotos}
                maxImages={1}
                tooltip="Upload proprietor photo (square or portrait aspect ratio recommended)."
              />
              <div className="flex flex-col gap-3">
                <InputField
                  label="Photo Alt Text (SEO & Accessibility)"
                  value={proprietorPhotoAlt}
                  onChange={(e) => setProprietorPhotoAlt(e.target.value)}
                  placeholder="e.g. Neha Goyal — Proprietor, Mahalaxmi Enterprises"
                />
                <p className="text-xs text-slate-500 leading-relaxed">
                  This photo and designation are loaded directly into the About Us page alongside
                  the proprietor&apos;s credentials.
                </p>
              </div>
            </div>

            {/* Narrative Paragraphs */}
            <TextAreaField
              label="Corporate Biography & Narrative (Separate paragraphs with double enter)"
              rows={7}
              value={paragraphsText}
              onChange={(e) => setParagraphsText(e.target.value)}
              placeholder="Enter biography and credentials text..."
              helperText="Each paragraph separated by a blank line will be rendered as a separate paragraph in the frontend."
            />

            {/* Why Choose Sub-Section */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#002b5c]" />
                    Why Choose Mahalaxmi Enterprises Cards
                  </h4>
                  <p className="text-xs text-slate-500">
                    Manage the 6 highlight value proposition cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddWhyChooseItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#002b5c] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Why Choose Section Title"
                  value={whyChooseTitle}
                  onChange={(e) => setWhyChooseTitle(e.target.value)}
                  placeholder="e.g. WHY CHOOSE MAHALAXMI ENTERPRISES"
                />
                <InputField
                  label="Why Choose Tagline"
                  value={whyChooseSubtitle}
                  onChange={(e) => setWhyChooseSubtitle(e.target.value)}
                  placeholder="e.g. Delivering Quality. Building Trust."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {whyChooseItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Card #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWhyChooseItem(index)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <InputField
                        label="Icon (Lucide Name)"
                        value={item.icon}
                        onChange={(e) => handleWhyChooseChange(index, "icon", e.target.value)}
                        placeholder="Building2, Boxes, Wrench, Truck..."
                      />
                      <InputField
                        label="Card Title"
                        value={item.title}
                        onChange={(e) => handleWhyChooseChange(index, "title", e.target.value)}
                        placeholder="e.g. Industrial Lube Distributor"
                      />
                      <TextAreaField
                        label="Description"
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          handleWhyChooseChange(index, "description", e.target.value)
                        }
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                ))}
              </div>
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
