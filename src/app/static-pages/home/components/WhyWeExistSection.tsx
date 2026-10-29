"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";
import { Plus, Trash2 } from "lucide-react";

interface PhotoItem {
  image: string;
  alt: string;
  captionTitle: string;
  captionSub: string;
  badge: string;
}

export function WhyWeExistSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [oldWayBadge, setOldWayBadge] = useState("");
  const [oldWayTitle, setOldWayTitle] = useState("");
  const [newWayBadge, setNewWayBadge] = useState("");
  const [newWayTitle, setNewWayTitle] = useState("");
  const [conclusionTitle, setConclusionTitle] = useState("");
  const [conclusionDescription, setConclusionDescription] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setOldWayBadge(initialData.oldWayBadge ?? "");
      setOldWayTitle(initialData.oldWayTitle ?? "");
      setNewWayBadge(initialData.newWayBadge ?? "");
      setNewWayTitle(initialData.newWayTitle ?? "");
      setConclusionTitle(initialData.conclusionTitle ?? "");
      setConclusionDescription(initialData.conclusionDescription ?? "");
      if (Array.isArray(initialData.photos)) {
        setPhotos(
          initialData.photos.map((p: any) => ({
            image: p.image ?? (typeof p === "string" ? p : ""),
            alt: p.alt ?? "",
            captionTitle: p.captionTitle ?? "",
            captionSub: p.captionSub ?? "",
            badge: p.badge ?? "",
          })),
        );
      }
    }
  }, [initialData]);

  const [openPhotoIndices, setOpenPhotoIndices] = useState<number[]>([]);

  const togglePhoto = (idx: number) => {
    setOpenPhotoIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const addPhoto = () => {
    const nextIdx = photos.length;
    setPhotos([...photos, { image: "", alt: "", captionTitle: "", captionSub: "", badge: "" }]);
    setOpenPhotoIndices((prev) => [...prev, nextIdx]);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setOpenPhotoIndices((prev) =>
      prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i))
    );
  };

  const updatePhoto = (idx: number, field: keyof PhotoItem, value: string) => {
    const updated = [...photos];
    updated[idx] = { ...updated[idx], [field]: value };
    setPhotos(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tag,
        headline,
        scriptAccent,
        description,
        oldWayBadge,
        oldWayTitle,
        newWayBadge,
        newWayTitle,
        conclusionTitle,
        conclusionDescription,
        photos,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "WhyWeExistSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Why We Exist section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving Why We Exist section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="WhyWeExistSection"
          description="Comparison section highlighting the frustration of flaky planning vs. curated group travel."
          badge="Section 2"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="flex flex-col gap-6 pt-4">
              <InputField
                label="Section Category Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. WHY WE EXIST"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Why do so many dream trips never"
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. happen?"
                />
              </div>

              <TextAreaField
                label="Intro Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem of solo trip planning..."
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/60 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Left Card (The Old Way)
                  </h4>
                  <InputField
                    label="Old Way Badge"
                    value={oldWayBadge}
                    onChange={(e) => setOldWayBadge(e.target.value)}
                    placeholder="e.g. THE OLD WAY"
                  />
                  <InputField
                    label="Old Way Sub-title"
                    value={oldWayTitle}
                    onChange={(e) => setOldWayTitle(e.target.value)}
                    placeholder="e.g. Kashmir Trip? 🏔️"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Right Card (The Kokalachi Way)
                  </h4>
                  <InputField
                    label="New Way Badge"
                    value={newWayBadge}
                    onChange={(e) => setNewWayBadge(e.target.value)}
                    placeholder="e.g. THE KOKALACHI WAY"
                  />
                  <InputField
                    label="New Way Title"
                    value={newWayTitle}
                    onChange={(e) => setNewWayTitle(e.target.value)}
                    placeholder="e.g. Curated groups. Fixed dates. Real people."
                  />
                </div>
              </div>

              {/* Photos Carousel Management */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      The Kokalachi Way Photo Carousel
                    </h4>
                    <p className="text-xs text-gray-500">
                      Curated photos displayed in the right-side animated phone card
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {photos.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPhotoIndices(
                            openPhotoIndices.length === photos.length
                              ? []
                              : photos.map((_, i) => i)
                          )
                        }
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {openPhotoIndices.length === photos.length
                          ? "Collapse all"
                          : "Expand all"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E5A60] text-white text-xs font-medium hover:bg-[#0c4e53] transition-colors"
                    >
                      <Plus size={14} /> Add Photo
                    </button>
                  </div>
                </div>

                {photos.map((item, idx) => (
                  <CollapsibleItemCard
                    key={idx}
                    title={`Photo #${idx + 1}`}
                    subtitle={item.captionTitle || item.alt}
                    badge={item.badge}
                    image={item.image}
                    isOpen={openPhotoIndices.includes(idx)}
                    onToggle={() => togglePhoto(idx)}
                    onDelete={() => removePhoto(idx)}
                    deleteTitle="Remove Photo"
                  >
                    <ImagePickerField
                      label="Image"
                      value={item.image}
                      onChange={(url) => updatePhoto(idx, "image", url)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Caption Title"
                        value={item.captionTitle}
                        onChange={(e) => updatePhoto(idx, "captionTitle", e.target.value)}
                        placeholder="e.g. Real people."
                      />
                      <InputField
                        label="Caption Subtitle"
                        value={item.captionSub}
                        onChange={(e) => updatePhoto(idx, "captionSub", e.target.value)}
                        placeholder="e.g. Real connections."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Badge Pill"
                        value={item.badge}
                        onChange={(e) => updatePhoto(idx, "badge", e.target.value)}
                        placeholder="e.g. Kashmir Circle"
                      />
                      <InputField
                        label="Alt Text"
                        value={item.alt}
                        onChange={(e) => updatePhoto(idx, "alt", e.target.value)}
                        placeholder="e.g. Kashmir Houseboat & Mountains"
                      />
                    </div>
                  </CollapsibleItemCard>
                ))}
              </div>

              {/* Bottom Emphasis Conclusion */}
              <div className="space-y-4 pt-2">
                <div className="p-5 bg-gray-50/60 rounded-2xl border border-gray-100 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                      Bottom Emphasis Conclusion
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Closing message shown below the comparison cards
                    </p>
                  </div>
                  <InputField
                    label="Conclusion Heading"
                    value={conclusionTitle}
                    onChange={(e) => setConclusionTitle(e.target.value)}
                    placeholder="e.g. So, we decided to build a better way to do it."
                  />
                  <TextAreaField
                    label="Conclusion Description"
                    value={conclusionDescription}
                    onChange={(e) => setConclusionDescription(e.target.value)}
                    placeholder="e.g. At Kokalachi, we bring together people who share a love for travel so you can stop waiting and start exploring."
                    rows={3}
                  />
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
    </section>
  );
}
