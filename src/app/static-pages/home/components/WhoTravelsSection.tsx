"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface PersonaCard {
  title: string;
  badge: string;
  age: string;
  description: string;
  image: string;
}

export function WhoTravelsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clean empty state (ZERO default data)
  const [tag, setTag] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [persona1, setPersona1] = useState<PersonaCard>({ title: "", badge: "", age: "", description: "", image: "" });
  const [persona2, setPersona2] = useState<PersonaCard>({ title: "", badge: "", age: "", description: "", image: "" });
  const [persona3, setPersona3] = useState<PersonaCard>({ title: "", badge: "", age: "", description: "", image: "" });
  const [persona4, setPersona4] = useState<PersonaCard>({ title: "", badge: "", age: "", description: "", image: "" });

  useEffect(() => {
    if (initialData) {
      setTag(initialData.tag ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");

      if (Array.isArray(initialData.personas)) {
        if (initialData.personas[0]) {
          setPersona1({
            title: initialData.personas[0].title ?? "",
            badge: initialData.personas[0].badge ?? "",
            age: initialData.personas[0].age ?? "",
            description: initialData.personas[0].description ?? "",
            image: initialData.personas[0].image ?? "",
          });
        }
        if (initialData.personas[1]) {
          setPersona2({
            title: initialData.personas[1].title ?? "",
            badge: initialData.personas[1].badge ?? "",
            age: initialData.personas[1].age ?? "",
            description: initialData.personas[1].description ?? "",
            image: initialData.personas[1].image ?? "",
          });
        }
        if (initialData.personas[2]) {
          setPersona3({
            title: initialData.personas[2].title ?? "",
            badge: initialData.personas[2].badge ?? "",
            age: initialData.personas[2].age ?? "",
            description: initialData.personas[2].description ?? "",
            image: initialData.personas[2].image ?? "",
          });
        }
        if (initialData.personas[3]) {
          setPersona4({
            title: initialData.personas[3].title ?? "",
            badge: initialData.personas[3].badge ?? "",
            age: initialData.personas[3].age ?? "",
            description: initialData.personas[3].description ?? "",
            image: initialData.personas[3].image ?? "",
          });
        }
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        tag,
        headline,
        scriptAccent,
        description,
        personas: [persona1, persona2, persona3, persona4],
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "WhoTravelsSection",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Who Travels With Us section saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error ?? "Failed to save");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Error saving section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="WhoTravelsSection"
          description="Highlight personas and traveller demographics (Women explorers, working pros, adventure lovers, creative souls)."
          badge="Section 7"
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
              <InputField
                label="Section Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. WHO TRAVELS WITH US"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Different stories, same"
                />
                <InputField
                  label="Script Accent"
                  value={scriptAccent}
                  onChange={(e) => setScriptAccent(e.target.value)}
                  placeholder="e.g. curiosity."
                />
              </div>

              <TextAreaField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="From solo explorers to busy professionals..."
                rows={2}
              />

              {/* 4 Personas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Persona 1</span>
                  <InputField label="Title" value={persona1.title} onChange={(e) => setPersona1({ ...persona1, title: e.target.value })} placeholder="e.g. Women Explorers" />
                  <InputField label="Badge" value={persona1.badge} onChange={(e) => setPersona1({ ...persona1, badge: e.target.value })} placeholder="e.g. Supportive & Safe" />
                  <InputField label="Age Group" value={persona1.age} onChange={(e) => setPersona1({ ...persona1, age: e.target.value })} placeholder="e.g. 20s - 45s" />
                  <TextAreaField label="Description" value={persona1.description} onChange={(e) => setPersona1({ ...persona1, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Persona Photo" value={persona1.image} onChange={(url) => setPersona1({ ...persona1, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Persona 2</span>
                  <InputField label="Title" value={persona2.title} onChange={(e) => setPersona2({ ...persona2, title: e.target.value })} placeholder="e.g. Working Professionals" />
                  <InputField label="Badge" value={persona2.badge} onChange={(e) => setPersona2({ ...persona2, badge: e.target.value })} placeholder="e.g. Weekend Getaways" />
                  <InputField label="Age Group" value={persona2.age} onChange={(e) => setPersona2({ ...persona2, age: e.target.value })} placeholder="e.g. 23s - 40s" />
                  <TextAreaField label="Description" value={persona2.description} onChange={(e) => setPersona2({ ...persona2, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Persona Photo" value={persona2.image} onChange={(url) => setPersona2({ ...persona2, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Persona 3</span>
                  <InputField label="Title" value={persona3.title} onChange={(e) => setPersona3({ ...persona3, title: e.target.value })} placeholder="e.g. Adventure Seekers" />
                  <InputField label="Badge" value={persona3.badge} onChange={(e) => setPersona3({ ...persona3, badge: e.target.value })} placeholder="e.g. Trails & High Passes" />
                  <InputField label="Age Group" value={persona3.age} onChange={(e) => setPersona3({ ...persona3, age: e.target.value })} placeholder="e.g. 20s - 38s" />
                  <TextAreaField label="Description" value={persona3.description} onChange={(e) => setPersona3({ ...persona3, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Persona Photo" value={persona3.image} onChange={(url) => setPersona3({ ...persona3, image: url })} />
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Persona 4</span>
                  <InputField label="Title" value={persona4.title} onChange={(e) => setPersona4({ ...persona4, title: e.target.value })} placeholder="e.g. Creative Souls" />
                  <InputField label="Badge" value={persona4.badge} onChange={(e) => setPersona4({ ...persona4, badge: e.target.value })} placeholder="e.g. Stories & Vibe" />
                  <InputField label="Age Group" value={persona4.age} onChange={(e) => setPersona4({ ...persona4, age: e.target.value })} placeholder="e.g. 22s - 42s" />
                  <TextAreaField label="Description" value={persona4.description} onChange={(e) => setPersona4({ ...persona4, description: e.target.value })} rows={2} />
                  <ImagePickerField label="Persona Photo" value={persona4.image} onChange={(url) => setPersona4({ ...persona4, image: url })} />
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
