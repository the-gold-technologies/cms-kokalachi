import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PRIVACY_SLUG = "privacy-policy";

const DEFAULT_PRIVACY_DATA = {
  title: "Privacy Policy",
  lastUpdated: "August 2026",
  content: `
    <p>Welcome to <strong>Mahalaxmi Enterprises</strong> ("we", "our", or "us"). We are an Authorized Industrial Lube Distributor (ILD) master distributor for <strong>Hindustan Petroleum Corporation Limited (HPCL)</strong>.</p>
    <p>We are committed to protecting and respecting your personal privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you visit our website or interact with our enquiry, dealership, and quotation forms.</p>
    
    <h2>1. Information We Collect</h2>
    <p>We may collect and process the following personal and commercial information:</p>
    <ul>
      <li><strong>Contact Information:</strong> Name, business/firm name, email address, phone number, city, and state submitted via enquiry or distributor application forms.</li>
      <li><strong>Product Interests:</strong> Lubricant categories, Technical Data Sheet (TDS) / Material Safety Data Sheet (MSDS) download requests, and bulk procurement queries.</li>
      <li><strong>Technical Data:</strong> IP address, browser type, device details, and interaction logs through cookies and Google Analytics to improve website responsiveness.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <p>We utilize the collected information strictly for legitimate commercial and customer service purposes:</p>
    <ul>
      <li>To provide product specifications, quotation pricing, and technical lubrication recommendations.</li>
      <li>To process Industrial Lube Distributor (ILD) / Bazaar Lube Distributor (BLD) dealership applications.</li>
      <li>To coordinate dispatch, doorstep supply logistics, and after-sales support across Uttar Pradesh and North India.</li>
      <li>To enhance website performance, security, and user experience.</li>
    </ul>

    <h2>3. Information Sharing & Protection</h2>
    <p>We do <strong>not</strong> sell, rent, trade, or commercially exploit your personal contact data. Your information is only shared with authorized sales engineers, regional supply depots, or HPCL technical representatives solely to fulfill your product delivery and service requests.</p>

    <h2>4. Cookies & Analytics</h2>
    <p>We utilize standard cookies, Google Tag Manager (GTM), and Google Analytics to understand website traffic patterns and improve responsiveness. You can adjust your browser settings to decline cookies if preferred.</p>

    <h2>5. Contact Us Regarding Your Privacy</h2>
    <p>If you have any questions, feedback, or requests regarding this Privacy Policy or data retention, please contact our compliance desk at <strong>info@hplubricantscfa.com</strong>.</p>
  `.trim(),
};

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: PRIVACY_SLUG },
      include: { sections: true },
    });

    if (!page) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PRIVACY_DATA,
        seo: {
          title: "Privacy Policy | Mahalaxmi Enterprises",
          metaTitle: "Privacy Policy | Mahalaxmi Enterprises",
          metaDescription:
            "Read the Privacy Policy of Mahalaxmi Enterprises, authorized Industrial Lubricants Division (ILD) for HPCL lubricants and greases.",
          targetKeywords: "Privacy Policy, Mahalaxmi Enterprises, HP Lubricants data protection",
          canonicalUrl: "/privacy-policy",
          noIndex: false,
          headingOptions: "h1",
        },
      });
    }

    const sectionsMap: Record<string, any> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    const policyContent =
      sectionsMap["PrivacyPolicyContent"] || sectionsMap["content"] || DEFAULT_PRIVACY_DATA;

    const seo = {
      title: page.metaTitle || page.title,
      metaTitle: page.metaTitle || page.title,
      metaDescription: page.metaDescription,
      targetKeywords: page.targetKeywords,
      canonicalUrl: page.canonicalUrl,
      noIndex: page.noIndex,
      schema: page.schema,
      headingOptions: page.headingOptions,
    };

    return NextResponse.json({
      success: true,
      data: policyContent,
      seo,
    });
  } catch (error) {
    console.error("Error fetching privacy-policy:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const page = await prisma.page.upsert({
      where: { slug: PRIVACY_SLUG },
      create: {
        title: body.title || "Privacy Policy",
        slug: PRIVACY_SLUG,
        type: "legal",
        visibility: "published",
        order: 50,
      },
      update: {
        title: body.title || "Privacy Policy",
      },
    });

    const contentData = {
      title: body.title || "",
      lastUpdated: body.lastUpdated || "",
      content: body.content || "",
      isPublished: body.isPublished ?? true,
    };

    const existingSection = await prisma.section.findFirst({
      where: { pageId: page.id, type: "PrivacyPolicyContent" },
    });

    if (existingSection) {
      await prisma.section.update({
        where: { id: existingSection.id },
        data: { content: contentData as any },
      });
    } else {
      await prisma.section.create({
        data: {
          pageId: page.id,
          type: "PrivacyPolicyContent",
          content: contentData as any,
          order: 0,
        },
      });
    }

    return NextResponse.json({ success: true, data: contentData });
  } catch (error) {
    console.error("Error saving privacy-policy:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
