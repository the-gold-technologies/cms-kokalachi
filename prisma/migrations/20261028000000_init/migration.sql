-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "siteTitle" TEXT NOT NULL DEFAULT 'Kokalachi - Journeys Become Friendships',
    "siteDescription" TEXT NOT NULL DEFAULT 'Curated group travel experiences designed to turn journeys into lasting friendships.',
    "favicon" TEXT,
    "logo" TEXT,
    "phone" TEXT DEFAULT '+91 98765 43210',
    "email" TEXT DEFAULT 'hello@kokalachi.com',
    "address" TEXT DEFAULT 'India',
    "instagramUrl" TEXT DEFAULT 'https://instagram.com/kokalachi',
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "linkedinUrl" TEXT,
    "googleAnalyticsId" TEXT,
    "gtmId" TEXT,
    "searchConsoleId" TEXT,
    "customHeaderScripts" TEXT,
    "customFooterScripts" TEXT,
    "socialLinks" JSONB,
    "canonicalOrdering" TEXT NOT NULL DEFAULT 'default',
    "sitemapEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sitemapCustomContent" TEXT,
    "robotsTxt" TEXT DEFAULT 'User-agent: *
Allow: /

Sitemap: https://kokalachi.com/sitemap.xml',
    "schema" TEXT,
    "headingOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "destinationSlug" TEXT,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gstIncluded" BOOLEAN NOT NULL DEFAULT false,
    "tcsPercent" DOUBLE PRECISION,
    "offerLabel" TEXT,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Trending',
    "categories" JSONB DEFAULT '[]',
    "tag" TEXT,
    "tagColor" TEXT,
    "hook" TEXT,
    "groupSize" TEXT NOT NULL DEFAULT 'Intimate Group',
    "overview" JSONB DEFAULT '[]',
    "itinerary" JSONB DEFAULT '[]',
    "inclusions" JSONB DEFAULT '[]',
    "exclusions" JSONB DEFAULT '[]',
    "meals" JSONB DEFAULT '[]',
    "whatToPack" JSONB DEFAULT '[]',
    "weather" JSONB DEFAULT '[]',
    "faqs" JSONB DEFAULT '[]',
    "highlights" JSONB DEFAULT '[]',
    "gallery" JSONB DEFAULT '[]',
    "vibeTags" JSONB DEFAULT '[]',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "targetKeywords" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "schema" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "originalPrice" DOUBLE PRECISION,
    "spotsLeft" INTEGER NOT NULL DEFAULT 10,
    "status" TEXT NOT NULL DEFAULT 'open',
    "label" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "tripName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "avatarImage" TEXT,
    "landmark" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "tripId" TEXT NOT NULL,
    "tripName" TEXT NOT NULL,
    "departureId" TEXT,
    "departureDate" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "journey" TEXT,
    "travelDate" TEXT,
    "groupSize" TEXT,
    "message" TEXT NOT NULL,
    "hearAboutUs" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "parent" TEXT NOT NULL DEFAULT '-',
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'standard',
    "visibility" TEXT NOT NULL DEFAULT 'published',
    "isStatic" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "targetKeywords" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "featuredImage" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "schema" TEXT,
    "headingOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Main Link',
    "parent" TEXT NOT NULL DEFAULT '-',
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "title" TEXT,
    "isStatic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heroLead" TEXT NOT NULL,
    "heroAccent" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'First-Timer Guide',
    "publishedAt" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Team Kokalachi',
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "ogImage" TEXT,
    "marginNote" TEXT,
    "intro" JSONB DEFAULT '[]',
    "sections" JSONB DEFAULT '[]',
    "ctaEyebrow" TEXT DEFAULT 'Your first chai stop is waiting',
    "ctaTitle" TEXT DEFAULT 'Ready to take the first step?',
    "ctaText" TEXT DEFAULT 'Browse our upcoming journeys and find the one that makes you a little excited and a little nervous. That''s usually the right one.',
    "ctaPrimaryBtnText" TEXT DEFAULT 'Explore Upcoming Trips',
    "ctaPrimaryBtnUrl" TEXT DEFAULT '/#upcoming-journeys',
    "ctaSecondaryBtnText" TEXT DEFAULT 'Read our FAQs',
    "ctaSecondaryBtnUrl" TEXT DEFAULT '/faqs',
    "shareBtnText" TEXT DEFAULT 'Share on WhatsApp',
    "relatedCategory" TEXT DEFAULT 'FirstTimers',
    "sidebarBadge" TEXT DEFAULT 'First-timer pick',
    "shareTitle" TEXT DEFAULT 'psst…',
    "shareNote" TEXT DEFAULT 'Know a nervous first-timer? Send this their way.',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "targetKeywords" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "schema" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_slug_key" ON "Trip"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_destinationSlug_fkey" FOREIGN KEY ("destinationSlug") REFERENCES "Destination"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

