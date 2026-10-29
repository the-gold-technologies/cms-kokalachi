"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleItemCard } from "@/components/CollapsibleItemCard";
import { Plus } from "lucide-react";

interface PhotoItem {
  image: string;
  alt: string;
  captionTitle: string;
  captionSub: string;
  badge: string;
}

interface ChatMessageItem {
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isSilent?: boolean;
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
  const [callout1Text, setCallout1Text] = useState("");
  const [callout2Text, setCallout2Text] = useState("");
  const [callout3Text, setCallout3Text] = useState("");
  const [chatGroupImage, setChatGroupImage] = useState("");
  const [chatMembersCount, setChatMembersCount] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [newWayBadge, setNewWayBadge] = useState("");
  const [newWayTitle, setNewWayTitle] = useState("");
  const [conclusionTitle, setConclusionTitle] = useState("");
  const [conclusionDescription, setConclusionDescription] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Card collapse state for Left & Right comparison cards
  const [isLeftCardOpen, setIsLeftCardOpen] = useState(true);
  const [isRightCardOpen, setIsRightCardOpen] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setOldWayBadge(initialData.oldWayBadge ?? "");
      setOldWayTitle(initialData.oldWayTitle ?? "");
      setCallout1Text(initialData.callout1Text ?? "");
      setCallout2Text(initialData.callout2Text ?? "");
      setCallout3Text(initialData.callout3Text ?? "");
      setChatGroupImage(initialData.chatGroupImage ?? "");
      setChatMembersCount(initialData.chatMembersCount ?? "");
      if (Array.isArray(initialData.chatMessages)) {
        setChatMessages(
          initialData.chatMessages.map((m: any) => ({
            sender: m.sender ?? "",
            avatar: m.avatar ?? "",
            text: m.text ?? "",
            time: m.time ?? "",
            isSilent: Boolean(m.isSilent),
          })),
        );
      }
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
  const [openChatIndices, setOpenChatIndices] = useState<number[]>([]);

  const togglePhoto = (idx: number) => {
    setOpenPhotoIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const addPhoto = () => {
    const nextIdx = photos.length;
    setPhotos([...photos, { image: "", alt: "", captionTitle: "", captionSub: "", badge: "" }]);
    setOpenPhotoIndices((prev) => [...prev, nextIdx]);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setOpenPhotoIndices((prev) => prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
  };

  const updatePhoto = (idx: number, field: keyof PhotoItem, value: string) => {
    const updated = [...photos];
    updated[idx] = { ...updated[idx], [field]: value };
    setPhotos(updated);
  };

  const toggleChat = (idx: number) => {
    setOpenChatIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const addChat = () => {
    const nextIdx = chatMessages.length;
    setChatMessages([
      ...chatMessages,
      { sender: "", avatar: "", text: "", time: "", isSilent: false },
    ]);
    setOpenChatIndices((prev) => [...prev, nextIdx]);
  };

  const removeChat = (idx: number) => {
    setChatMessages(chatMessages.filter((_, i) => i !== idx));
    setOpenChatIndices((prev) => prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
  };

  const updateChat = (idx: number, field: keyof ChatMessageItem, value: any) => {
    const updated = [...chatMessages];
    updated[idx] = { ...updated[idx], [field]: value };
    setChatMessages(updated);
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
        callout1Text,
        callout2Text,
        callout3Text,
        chatGroupImage,
        chatMembersCount,
        chatMessages,
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
                label="Section Tagline"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. WHY WE EXIST"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. You've been in that group chat."
                />
                <InputField
                  label="Script Font Accent Word"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. We all have."
                  tooltip="Rendered in handwritten script"
                />
              </div>

              <TextAreaField
                label="Section Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Someone creates the group. Everyone says yes..."
                rows={3}
              />

              {/* Side-by-Side Comparison Config (Collapsible Cards) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Comparison Cards (The Old Way vs. The Kokalachi Way)
                    </h4>
                    <p className="text-xs text-gray-500">
                      Collapsible cards for Left Card (The Flaky Chat) and Right Card (The Kokalachi
                      Way)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const allOpen = isLeftCardOpen && isRightCardOpen;
                      setIsLeftCardOpen(!allOpen);
                      setIsRightCardOpen(!allOpen);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isLeftCardOpen && isRightCardOpen ? "Collapse all cards" : "Expand all cards"}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Left Card: The Old Way (Collapsible) */}
                  <CollapsibleItemCard
                    title="Left Card — The Flaky Chat"
                    subtitle={oldWayTitle}
                    badge={oldWayBadge || "THE OLD WAY"}
                    isOpen={isLeftCardOpen}
                    onToggle={() => setIsLeftCardOpen(!isLeftCardOpen)}
                    className="border-rose-200/80 bg-rose-50/20"
                    headerClassName="bg-rose-50/70 border-rose-100"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="Badge Text"
                          value={oldWayBadge}
                          onChange={(e) => setOldWayBadge(e.target.value)}
                          placeholder="e.g. THE OLD WAY"
                        />
                        <InputField
                          label="Card Title"
                          value={oldWayTitle}
                          onChange={(e) => setOldWayTitle(e.target.value)}
                          placeholder="e.g. Goa Trip 2024 (11)"
                        />
                      </div>

                      {/* Callout Annotations in a clean 2-row layout */}
                      <div className="p-3 bg-white/70 rounded-xl border border-rose-100/80 space-y-3">
                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                          Handwritten Callout Annotations
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            label="Callout 1"
                            value={callout1Text}
                            onChange={(e) => setCallout1Text(e.target.value)}
                            placeholder="e.g. Excitement"
                          />
                          <InputField
                            label="Callout 2"
                            value={callout2Text}
                            onChange={(e) => setCallout2Text(e.target.value)}
                            placeholder="e.g. Plans change"
                          />
                        </div>
                        <InputField
                          label="Callout 3"
                          value={callout3Text}
                          onChange={(e) => setCallout3Text(e.target.value)}
                          placeholder="e.g. The trip never happens"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ImagePickerField
                          label="Group Icon Image"
                          value={chatGroupImage}
                          onChange={setChatGroupImage}
                        />
                        <InputField
                          label="Members Label"
                          value={chatMembersCount}
                          onChange={(e) => setChatMembersCount(e.target.value)}
                          placeholder="e.g. 10 members"
                        />
                      </div>

                      {/* Chat Messages List */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-900">Chat Messages</span>
                          <div className="flex items-center gap-2">
                            {chatMessages.length > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenChatIndices(
                                    openChatIndices.length === chatMessages.length
                                      ? []
                                      : chatMessages.map((_, i) => i),
                                  )
                                }
                                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                {openChatIndices.length === chatMessages.length
                                  ? "Collapse all"
                                  : "Expand all"}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={addChat}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-700 text-white text-xs font-medium hover:bg-rose-800 transition-colors"
                            >
                              <Plus size={12} /> Add Message
                            </button>
                          </div>
                        </div>

                        {chatMessages.map((msg, idx) => (
                          <CollapsibleItemCard
                            key={idx}
                            title={`Message #${idx + 1}: ${msg.sender || (msg.isSilent ? "System / Silence" : "Message")}`}
                            subtitle={msg.text}
                            badge={msg.time}
                            image={msg.avatar}
                            isOpen={openChatIndices.includes(idx)}
                            onToggle={() => toggleChat(idx)}
                            onDelete={() => removeChat(idx)}
                            deleteTitle="Remove Message"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <InputField
                                label="Sender Name"
                                value={msg.sender}
                                onChange={(e) => updateChat(idx, "sender", e.target.value)}
                                placeholder="e.g. Rohit"
                              />
                              <InputField
                                label="Timestamp"
                                value={msg.time}
                                onChange={(e) => updateChat(idx, "time", e.target.value)}
                                placeholder="e.g. 10:42 AM"
                              />
                            </div>
                            <ImagePickerField
                              label="Sender Avatar"
                              value={msg.avatar}
                              onChange={(url) => updateChat(idx, "avatar", url)}
                            />
                            <TextAreaField
                              label="Message Text"
                              value={msg.text}
                              onChange={(e) => updateChat(idx, "text", e.target.value)}
                              placeholder="e.g. Guys! Goa this long weekend? Flight prices are low right now 🌴"
                              rows={2}
                            />
                            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={Boolean(msg.isSilent)}
                                onChange={(e) => updateChat(idx, "isSilent", e.target.checked)}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                              />
                              <span>Render as silent / no replies callout style</span>
                            </label>
                          </CollapsibleItemCard>
                        ))}
                      </div>
                    </div>
                  </CollapsibleItemCard>

                  {/* Right Card: The Kokalachi Way (Collapsible) */}
                  <CollapsibleItemCard
                    title="Right Card — The Kokalachi Way"
                    subtitle={newWayTitle}
                    badge={newWayBadge || "THE KOKALACHI WAY"}
                    isOpen={isRightCardOpen}
                    onToggle={() => setIsRightCardOpen(!isRightCardOpen)}
                    className="border-teal-200/80 bg-teal-50/20"
                    headerClassName="bg-teal-50/70 border-teal-100"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="Badge Text"
                          value={newWayBadge}
                          onChange={(e) => setNewWayBadge(e.target.value)}
                          placeholder="e.g. THE KOKALACHI WAY"
                        />
                        <InputField
                          label="Card Title"
                          value={newWayTitle}
                          onChange={(e) => setNewWayTitle(e.target.value)}
                          placeholder="e.g. Curated groups. Fixed dates. Verified travellers."
                        />
                      </div>

                      {/* Photo Collage Items inside Right Card */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-teal-900 block">
                              Right Card Photo Collage / Carousel
                            </span>
                            <p className="text-[11px] text-gray-500">
                              Images displayed in the dynamic card on the right
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
                                      : photos.map((_, i) => i),
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
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E5A60] text-white text-xs font-medium hover:bg-[#0c4e53] transition-colors"
                            >
                              <Plus size={12} /> Add Photo
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    </div>
                  </CollapsibleItemCard>
                </div>
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
