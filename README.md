# Kokalachi CMS — Headless Content Management System

A dedicated, enterprise-grade Headless Content Management System and Administration Portal engineered for **Kokalachi** ([kokalachi.com](https://kokalachi.com)). The platform provides editorial control over slow-travel journeys, departure calendars, journal publications, static page sections with 1-to-1 website component parity, SEO directives, media assets, and customer travel submissions.

---

## 🌟 Key Capabilities & Modules

### 1. Curated Journeys & Departures (`/trips`)

- **Complete Itinerary Management**: Multi-day schedule, inclusions, exclusions, packing lists, weather notes, and FAQs.
- **Departures Calendar**: Schedule upcoming dates, manage spots left, pricing, discounts, and booking status (`open`, `sold_out`, `waitlist`).
- **Pricing & Tax Structure**: Base price, original price, GST rate, and TCS calculation options.
- **Vibe & Category Filters**: Multi-tag categorisation (e.g., _Road Trips_, _Weekend Gateways_, _Slow Travel_).
- **Google Doc Itinerary Importer**: Direct parser tool to import structured itinerary documents into database trips.

### 2. Journal & Storytelling Engine (`/blogs`)

- **Chapter & Story Builder**: Visual modular blocks for narrative travelogues, image interludes, pull quotes, and tips.
- **Rich Text Editor**: Powered by `react-quill-new` featuring custom inline link editing ("Word-as-Link").
- **CTA & Social Hooks**: Contextual call-to-actions, WhatsApp share triggers, and author attributions.

### 3. Visual Page Sections with 1-to-1 Component Parity (`/static-pages`)

Every CMS section maps directly to its corresponding frontend component on the live website:

- **Home**: `HeroSection`, `WhyWeExistSection`, `HowItWorksSection`, `DifferenceSection`, `GoodCompanySection`, `MomentsThatStayedSection`, `WhoTravelsSection`, `UpcomingJourneysSection`, `BehindKokalachiSection`.
- **About Us**: `AboutHeroSection`, `WhyWeStartedSection`, `WhatWeBelieveSection`, `MeetFounderSection`, `ExploreJourneysSection`, `JoinTribeSection`.
- **Contact Us**: `ContactHeroSection`, `ContactFormSection`, `ContactSidebarSection`.
- **FAQs**: `FaqsHeroSection`, `FaqsAccordionSection`, `FaqsCtaSection`.
- **Community**: `CommunityHeroSection`, `CommunityChaptersSection`, `CommunityCtaSection`, `CommunitySeoSection`.
- **Legal**: Markdown/Rich-text editors for `Privacy Policy` and `Terms & Conditions`.

### 4. Automated Image Optimization & Cloudinary Pipeline

- **Sharp WebP Compression**: Images are automatically downscaled (max 2000px) and converted into modern **WebP** format prior to transmission.
- **Cloudinary Integration**: Direct streaming of optimized buffers into designated folders with automatic asset invalidation.
- **Automatic Asset Cleanup**: Detects removed or replaced image URLs on form submission and automatically deletes obsolete assets from Cloudinary to eliminate storage waste.
- **Local Fallback**: Gracefully saves compressed WebP files to `/public/uploads/` if cloud credentials are absent.

### 5. Enterprise SEO & Indexing Controls (`/seo`)

- **Global SEO**: Site title, meta description, favicon, logo, Google Analytics (GA4), Google Tag Manager (GTM), Google Search Console verification tokens, and custom head/body injection scripts.
- **Per-Page Directives**: Custom page slugs, meta titles, descriptions, target keywords, canonical URLs, OpenGraph previews (`og:image`, `og:title`), JSON-LD schema, and `noIndex` toggles.
- **Dynamic Robots & Sitemap**: Real-time configuration of `robots.txt` directives and automated XML sitemap feeds.

### 6. Submissions & Lead Ingestion (`/submissions`)

- **Travel Inquiries**: Track traveler inquiries, travel dates, preferred journeys, group sizes, and referral sources.
- **Direct Bookings**: Log booking requests with guest counts, selected departure dates, and payment statuses.
- **Automated Email Notifications**: Instant administrative alerts dispatched via secure SMTP transport (Nodemailer) on new submissions.

### 7. Global Brand & Navigation (`/navigation`)

- **Header & Footer Menus**: Drag-and-drop order, label customization, and target URL routing.
- **Social Media Profiles**: Instagram, YouTube, Facebook, LinkedIn, and WhatsApp channels.

---

## 🛠️ Technology Stack

| Layer                     | Technology                                           |
| :------------------------ | :--------------------------------------------------- |
| **Framework**             | Next.js 16 (App Router)                              |
| **Language**              | TypeScript                                           |
| **Styling**               | Tailwind CSS v4                                      |
| **Database & ORM**        | PostgreSQL with Prisma ORM                           |
| **Authentication**        | NextAuth.js v5 (Auth.js Beta - Credentials Provider) |
| **Image Processing**      | Sharp (WebP compression & resize engine)             |
| **Cloud Storage**         | Cloudinary SDK v2                                    |
| **Rich Text Editor**      | React Quill New                                      |
| **Icons & Notifications** | Lucide React & React Hot Toast                       |
| **Email Service**         | Nodemailer (SMTP transport)                          |

---

## 📂 Project Directory Structure

```text
kokalachi-cms/
├── prisma/
│   ├── schema.prisma            # Relational database schema
│   ├── seed.js                  # Database seeder (admin, journeys, blogs, pages)
│   ├── trips-seed.json          # Seed journeys and itineraries
│   ├── blogs-seed.json          # Seed blog articles
│   └── community-seed.json      # Seed community chapters data
├── public/
│   ├── brand/                   # Official brand graphics & logos
│   └── uploads/                 # Local image upload fallback storage
├── src/
│   ├── app/
│   │   ├── (auth)/login/        # Admin authentication page
│   │   ├── api/                 # Secure REST API routes
│   │   │   ├── auth/            # NextAuth API endpoints
│   │   │   ├── blogs/           # Journal CRUD
│   │   │   ├── bookings/        # Booking submissions
│   │   │   ├── enquiries/       # Travel inquiries & SMTP notification
│   │   │   ├── trips/           # Journey & departure management
│   │   │   ├── upload/          # Sharp compression + Cloudinary upload stream
│   │   │   ├── seo/             # Global & per-page SEO management
│   │   │   └── static-pages/    # Home, About, Contact, Community, FAQs routes
│   │   ├── blogs/               # Journal manager & chapter editor
│   │   ├── navigation/          # Menu links & social channels
│   │   ├── seo/                 # Global SEO & sitemap/robots directives
│   │   ├── settings/            # Admin credentials & profile management
│   │   ├── static-pages/        # Visual editors matching website components
│   │   ├── submissions/         # Enquiries & booking lead tables
│   │   ├── trips/               # Journey catalog & itinerary builder
│   │   ├── layout.tsx           # Dashboard layout shell with responsive sidebar
│   │   └── page.tsx             # CMS executive dashboard & quick stats
│   ├── components/              # Modular UI components (ImagePicker, RichText, etc.)
│   ├── lib/
│   │   ├── auth-check.ts        # Admin session verification guard
│   │   ├── cloudinaryCleanup.ts # Obsolete asset garbage collection
│   │   ├── journeyDocParser.ts  # Document itinerary parsing utility
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── websiteMail.ts       # Nodemailer SMTP transmission utility
│   ├── auth.ts                  # NextAuth credentials authentication provider
│   └── middleware.ts            # Route protection guard & CORS headers
├── .env.example                 # Sanitized environment template
├── package.json                 # Project dependencies & npm scripts
└── tsconfig.json                # TypeScript compiler configuration
```

---

## ⚙️ Getting Started & Installation

### 1. Prerequisites

- **Node.js**: `v20.x` or higher (LTS recommended)
- **PostgreSQL**: Local PostgreSQL instance (or cloud database such as Supabase / Neon)
- **Package Manager**: `npm` (or `pnpm` / `yarn`)

### 2. Clone and Install Dependencies

```bash
git clone <repository-url>
cd kokalachi-cms
npm install
```

### 3. Environment Configuration

Copy the sanitized environment template to create your local `.env`:

```bash
cp .env.example .env
```

Populate `.env` with your environment credentials:

```env
# =========================================================================
# Kokalachi CMS - Environment Configuration Template
# =========================================================================

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"
DIRECT_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"

# NextAuth Authentication
AUTH_SECRET="<GENERATE_A_STRONG_RANDOM_SECRET>"
NEXTAUTH_URL="http://localhost:3001"

# Client Frontend Website URL
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"

# Cloudinary Media Storage (Optional: Falls back to /public/uploads/ if omitted)
CLOUDINARY_URL=""
CLOUDINARY_CLOUD_NAME="<YOUR_CLOUDINARY_CLOUD_NAME>"
CLOUDINARY_API_KEY="<YOUR_CLOUDINARY_API_KEY>"
CLOUDINARY_API_SECRET="<YOUR_CLOUDINARY_API_SECRET>"
CLOUDINARY_FOLDER="kokalachi"

# SMTP Configuration (For Inquiry & Booking Notifications)
SMTP_HOST="<YOUR_SMTP_HOST>"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="<YOUR_SMTP_USERNAME>"
SMTP_PASS="<YOUR_SMTP_PASSWORD>"
SMTP_FROM="Kokalachi <hello@kokalachi.com>"
ADMIN_NOTIFICATION_EMAIL="<YOUR_NOTIFICATION_RECEIVER_EMAIL>"

# Shared Webhook Secret (Cross-site revalidation & API sync)
CMS_SHARED_SECRET="<GENERATE_A_SHARED_SECRET_STRING>"
```

> **Security Note:** Never commit `.env` or sensitive credentials to source control. Production secrets must be configured via environment settings on your deployment host.

### 4. Database Setup & Seeding

Push the Prisma schema to your PostgreSQL database and seed the system:

```bash
# Generate the Prisma Client
npx prisma generate

# Apply schema migrations to your database
npx prisma db push

# Seed default admin user, journeys, journal entries, and static sections
npm run seed
```

### 5. Running the Application

Launch the development server:

```bash
npm run dev
```

The CMS portal will be accessible at:

```text
http://localhost:3001
```

---

## 🔒 Security & Architectural Standards

- **Server-Side Isolation**: Sensitive API credentials, database strings, and SMTP credentials never reach client-side bundles.
- **Session Verification**: All mutations and administrative routes are protected by `checkAdminSession()` and NextAuth edge middleware.
- **Zero Default Data Pattern**: Form states initialize cleanly with empty defaults (`""`, `[]`, `null`) and populate strictly from dynamic API responses.
- **Asset Lifecycle Management**: Replaced or deleted image URLs are automatically tracked and removed from Cloudinary storage to prevent orphaned media build-up.
- **XSS & SVG Sanitization**: Uploaded SVGs are inspected on the server to block embedded executable `<script>` tags, event handlers, or malicious payloads.

---

## 📦 Available Scripts

| Command                | Description                                                   |
| :--------------------- | :------------------------------------------------------------ |
| `npm run dev`          | Boots the Next.js development server on port 3001             |
| `npm run build`        | Builds the Prisma client and compiles production assets       |
| `npm run start`        | Starts the production server build                            |
| `npm run seed`         | Seeds database with journeys, static pages, and initial admin |
| `npm run lint`         | Runs ESLint analysis for code quality                         |
| `npm run format`       | Auto-formats all codebase files using Prettier                |
| `npm run format:check` | Verifies codebase compliance with Prettier formatting         |

---

## 📄 License & Confidentiality

© **Kokalachi Travel**. All rights reserved.  
This software, documentation, and underlying assets are proprietary and confidential. Unauthorized duplication, distribution, or reverse engineering is strictly prohibited.
