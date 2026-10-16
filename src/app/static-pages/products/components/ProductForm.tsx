"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Sparkles,
  Layers,
  FileText,
  FlaskConical,
  ShieldCheck,
  Plus,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SelectField } from "@/components/SelectField";
import { ImageUploadField } from "@/components/ImageUploadField";
import { PropertiesTableEditor, PropertyRow } from "@/components/PropertiesTableEditor";
import { StringListEditor } from "@/components/StringListEditor";
import { PdfUploadField } from "@/components/PdfUploadField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  productId?: string;
  isNew?: boolean;
}

export function ProductForm({ productId, isNew = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryTitle, setSubCategoryTitle] = useState("");
  const [containerImages, setContainerImages] = useState<(File | string | null)[]>([]);
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [applicationAreasTitle, setApplicationAreasTitle] = useState("");
  const [applicationAreas, setApplicationAreas] = useState("");
  const [performanceBenefitsTitle, setPerformanceBenefitsTitle] = useState("");
  const [performanceBenefits, setPerformanceBenefits] = useState<string[]>([]);
  const [specialFeaturesTitle, setSpecialFeaturesTitle] = useState("");
  const [specialFeatures, setSpecialFeatures] = useState<string[]>([]);
  const [specsText, setSpecsText] = useState("");
  const [propertiesTableTitle, setPropertiesTableTitle] = useState("");
  const [propertiesTable, setPropertiesTable] = useState<PropertyRow[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [msdsUrl, setMsdsUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [headingOptions, setHeadingOptions] = useState("h1");

  // Load Categories & Product Data
  useEffect(() => {
    async function loadData() {
      try {
        setFetching(true);
        // 1. Fetch categories
        const catRes = await fetch("/api/products/categories", { cache: "no-store" });
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data)) {
          setCategories(catJson.data);
          if (isNew && catJson.data.length > 0) {
            setCategorySlug(catJson.data[0].slug);
            setCategoryName(catJson.data[0].name);
          }
        }

        // 2. Fetch product if editing
        if (!isNew && productId) {
          const prodRes = await fetch(`/api/products?id=${productId}`, { cache: "no-store" });
          const prodJson = await prodRes.json();
          if (prodJson.success && prodJson.data) {
            const p = prodJson.data;
            setName(p.name || "");
            setSlug(p.slug || "");
            setSubtitle(p.subtitle || "");
            setCategorySlug(p.categorySlug || "");
            setCategoryName(p.categoryName || "");
            setSubCategoryTitle(p.subCategoryTitle || "");
            setContainerImages(p.containerImage ? [p.containerImage] : []);
            setDescriptionTitle(p.descriptionTitle || "");
            setDescription(p.description || "");
            setApplicationAreasTitle(p.applicationAreasTitle || "");
            setApplicationAreas(p.applicationAreas || "");
            setPerformanceBenefitsTitle(p.performanceBenefitsTitle || "");
            setPerformanceBenefits(
              Array.isArray(p.performanceBenefits) ? p.performanceBenefits : [],
            );
            setSpecialFeaturesTitle(p.specialFeaturesTitle || "");
            setSpecialFeatures(Array.isArray(p.specialFeatures) ? p.specialFeatures : []);
            setSpecsText(p.specsText || "");
            setPropertiesTableTitle(p.propertiesTableTitle || "");
            setPropertiesTable(Array.isArray(p.propertiesTable) ? p.propertiesTable : []);
            setPdfUrl(p.pdfUrl || "");
            setMsdsUrl(p.msdsUrl || "");
            setIsFeatured(!!p.isFeatured);
            setMetaTitle(p.metaTitle || "");
            setMetaDescription(p.metaDescription || "");
            setTargetKeywords(p.targetKeywords || "");
            setCanonicalUrl(p.canonicalUrl || "");
            setHeadingOptions(p.headingOptions || "h1");
          } else {
            toast.error("Product not found");
            router.push("/static-pages/products");
          }
        }
      } catch (err) {
        console.error("Error loading product data:", err);
        toast.error("Failed to load product");
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [productId, isNew, router]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Product name and URL slug are required");
      return;
    }

    setLoading(true);

    try {
      let finalContainerImageUrl = "";
      const validImages = containerImages.filter((img): img is File | string => !!img);
      if (validImages.length > 0) {
        const [uploaded] = await uploadFiles(validImages);
        finalContainerImageUrl = uploaded || "";
      }

      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        subtitle: subtitle.trim(),
        categorySlug,
        categoryName: categories.find((c) => c.slug === categorySlug)?.name || categoryName,
        subCategoryTitle: subCategoryTitle.trim(),
        containerImage: finalContainerImageUrl,
        descriptionTitle: descriptionTitle.trim(),
        description: description.trim(),
        applicationAreasTitle: applicationAreasTitle.trim(),
        applicationAreas: applicationAreas.trim(),
        performanceBenefitsTitle: performanceBenefitsTitle.trim(),
        performanceBenefits: performanceBenefits.map((s) => s.trim()).filter(Boolean),
        specialFeaturesTitle: specialFeaturesTitle.trim(),
        specialFeatures: specialFeatures.map((s) => s.trim()).filter(Boolean),
        specsText: specsText.trim(),
        propertiesTableTitle: propertiesTableTitle.trim(),
        propertiesTable,
        pdfUrl: pdfUrl.trim(),
        msdsUrl: msdsUrl.trim(),
        isFeatured,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        targetKeywords: targetKeywords.trim(),
        canonicalUrl: canonicalUrl.trim(),
        headingOptions: headingOptions || "h1",
      };

      const url = "/api/products";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? payload : { ...payload, id: productId }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(isNew ? "Product created successfully!" : "Product updated successfully!");
        router.push("/static-pages/products");
      } else {
        toast.error(json.error || "Failed to save product");
      }
    } catch {
      toast.error("Network error saving product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 text-center text-gray-400 text-sm animate-pulse flex flex-col items-center justify-center gap-3">
        <Package className="w-8 h-8 text-[#D8232A] animate-spin" />
        <span>Loading product details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-16">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/static-pages/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#D8232A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isNew ? "Add New Product" : `Edit Product: ${name || "Untitled"}`}
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Configure product classification, container graphics, formulation specifications, and
            technical datasheets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/static-pages/products"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <SaveButton loading={loading} label="Save Changes" className="w-auto px-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Core Product Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D8232A]" />
              1. Commercial Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Product Commercial Name *"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. HP Milcy Turbo 15W-40"
                required
              />
              <InputField
                label="URL Slug *"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. hp-milcy-turbo-15w-40"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SelectField
                label="Main Category *"
                value={categorySlug}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategorySlug(val);
                  const match = categories.find((c) => c.slug === val);
                  if (match) setCategoryName(match.name);
                }}
                options={
                  categories.length > 0
                    ? categories.map((c) => ({
                        value: c.slug,
                        label: c.name,
                      }))
                    : [
                        {
                          value: "industrial-oils",
                          label: "Industrial Oils",
                        },
                        {
                          value: "industrial-greases",
                          label: "Industrial Greases",
                        },
                      ]
                }
              />
              <InputField
                label="Sub-Classification"
                value={subCategoryTitle}
                onChange={(e) => setSubCategoryTitle(e.target.value)}
                placeholder="e.g. Hydraulic Oils / Diesel Oils"
              />
              <InputField
                label="Tagline / Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Premium Heavy Duty Engine Oil"
              />
            </div>
          </div>

          {/* Card 2: Narrative & Application Scope */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D8232A]" />
              2. Description & Application Scope
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Description Section Heading"
                value={descriptionTitle}
                onChange={(e) => setDescriptionTitle(e.target.value)}
                placeholder="Description (default)"
              />
              <InputField
                label="Application Areas Section Heading"
                value={applicationAreasTitle}
                onChange={(e) => setApplicationAreasTitle(e.target.value)}
                placeholder="Application Areas (default)"
              />
            </div>

            <TextAreaField
              label="General Formulation Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Base oil formulation, additive chemistry, and primary advantages..."
            />

            <TextAreaField
              label="Application Areas & Machinery Compatibility"
              rows={3}
              value={applicationAreas}
              onChange={(e) => setApplicationAreas(e.target.value)}
              placeholder="Recommended vehicle fleets, equipment types, industrial duty cycles..."
            />
          </div>

          {/* Card 3: Performance Benefits & Features */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D8232A]" />
              3. Benefits & OEM Approvals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Benefits Section Heading"
                value={performanceBenefitsTitle}
                onChange={(e) => setPerformanceBenefitsTitle(e.target.value)}
                placeholder="Performance Benefits (default)"
              />
              <InputField
                label="Special Features Section Heading"
                value={specialFeaturesTitle}
                onChange={(e) => setSpecialFeaturesTitle(e.target.value)}
                placeholder="Special Features (default)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StringListEditor
                label="Performance Benefits"
                items={performanceBenefits}
                onChange={setPerformanceBenefits}
                placeholder="e.g. Superior soot dispersancy..."
                accentColor="red"
              />
              <StringListEditor
                label="OEM Approvals & Special Features"
                items={specialFeatures}
                onChange={setSpecialFeatures}
                placeholder="e.g. API CI-4 / SL Certified..."
                accentColor="red"
              />
            </div>

            <InputField
              label="Specifications Summary String"
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder="API CI-4/SL, ACEA E7, MB 228.3, Cummins CES 20078"
            />
          </div>

          {/* Card 4: Physico-Chemical Lab Properties */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#D8232A]" />
              4. Physico-Chemical Test Specifications
            </h3>

            <InputField
              label="Table Display Title"
              value={propertiesTableTitle}
              onChange={(e) => setPropertiesTableTitle(e.target.value)}
              placeholder="Physico-Chemical Properties (default)"
            />

            <PropertiesTableEditor properties={propertiesTable} onChange={setPropertiesTable} />
          </div>
        </div>

        {/* Right Column (1 Col): Packaging Graphics, Datasheets & Publish Settings */}
        <div className="flex flex-col gap-6">
          {/* Card 5: Container Packaging Image */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D8232A]" />
              Packaging Graphic
            </h3>

            <ImageUploadField
              label="Can / Barrel / Drum Graphic"
              images={containerImages}
              onImagesChange={setContainerImages}
              maxImages={1}
              tooltip="Upload container pack visual (PNG or JPG with transparent or clean background)."
            />
          </div>

          {/* Card 6: Technical Datasheets Upload */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D8232A]" />
              Datasheet Downloads (PDF)
            </h3>

            <PdfUploadField
              label="TDS (Technical Data Sheet) PDF"
              value={pdfUrl}
              onChange={setPdfUrl}
              tooltip="Upload product TDS document (.pdf) or edit direct URL."
            />

            <PdfUploadField
              label="MSDS (Material Safety Data) PDF"
              value={msdsUrl}
              onChange={setMsdsUrl}
              tooltip="Upload product MSDS safety sheet (.pdf) or edit direct URL."
            />
          </div>

          {/* Card: Search Engine Optimization (SEO) */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D8232A]" />
              Product SEO Metadata
            </h3>

            <InputField
              label="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title..."
              tooltip="The title tag appearing in Google search results and browser tabs."
            />

            <TextAreaField
              label="Meta Description"
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description..."
              tooltip="The description displayed underneath the link in search results."
            />

            <InputField
              label="Target Keywords"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="Enter target keywords (comma separated)..."
              tooltip="Comma-separated focus keywords for SEO indexing."
            />

            <InputField
              label="Canonical URL"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="Enter canonical URL..."
              tooltip="Canonical URL link tag to avoid duplicate content penalty."
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Hero Heading Tag
              </label>
              <select
                value={headingOptions}
                onChange={(e) => setHeadingOptions(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D8232A]/20 focus:border-[#D8232A] transition-all"
              >
                <option value="h1">H1 (Default primary tag)</option>
                <option value="h2">H2 (Alternative heading tag)</option>
                <option value="h3">H3 (Sub-heading tag)</option>
                <option value="h4">H4 (Sub-heading tag)</option>
                <option value="h5">H5 (Sub-heading tag)</option>
                <option value="h6">H6 (Sub-heading tag)</option>
              </select>
            </div>
          </div>

          {/* Card 7: Visibility & Featured */}
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Promotion & Visibility
            </h3>

            <label className="flex items-start gap-3 p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="mt-0.5 rounded text-[#D8232A] focus:ring-[#D8232A] cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Feature on Homepage</span>
                <span className="text-[11px] text-gray-500 leading-snug">
                  Displays this lubricant grade in the featured catalog spotlight.
                </span>
              </div>
            </label>

            <div className="pt-3 border-t border-gray-100">
              <SaveButton
                loading={loading}
                label="Save Changes"
                className="w-full py-3.5 text-sm font-bold shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
