# Kokalachi — Headless Content Management System (CMS)

A dedicated, enterprise-grade Headless Content Management System and Administration Portal engineered for **Kokalachi** (Authorized Distributor for HP Lubricants). This system empowers content administrators to manage live website pages, SEO directives, the HP Lubricants product catalog, blog publications, corporate events, commercial inquiries, and email notification workflows.

---

## 🚀 Key Capabilities & Modules

- **Secure Administrative Authentication:**
  - Robust session management and password hashing powered by **NextAuth.js v5** (Credentials Provider).
  - Protected administrative dashboard routes with public exceptions for authentication and crawler feeds.
- **Visual Page & Section Customization:**
  - Full CRUD controls for Homepage, About Us, Events, Blogs, Contact Us, and Privacy Policy content blocks.
  - Granular control over page headings, hero banners, and brand value proposition sections.
- **Enterprise SEO & Crawler Directive Control:**
  - **Sitemap & Robots Management:** Configure dynamic XML sitemap options and upload custom rules directly from the admin UI.
  - **Live Endpoint Verification:** Inspect live `sitemap.xml` and `robots.txt` feeds with a single click.
  - **Per-Page SEO:** Meta title, description, keywords, OpenGraph tags, and indexing rules (`noIndex`).
  - **Dynamic Heading Tags:** Configure semantic heading tags (`h1`, `h2`, `h3`, `div`) per page section for search engine optimization.
- **HP Lubricants Product & Category Catalog:**
  - Hierarchical taxonomy: Categories, Subcategories, and detailed Product records.
  - Application areas, performance benefits, packaging sizes, and technical features management.
- **Commercial Inquiries & Lead Management:**
  - Ingestion of product quote requests, general contact enquiries, and dealership inquiries.
  - Live status tracking, resolution notes, and audit logs.
  - Automated SMTP notification dispatch to configured administrative emails upon new lead submissions.
- **Cloudinary Media Assets Management:**
  - High-performance cloud asset storage for product images, event photo galleries, and corporate banners.
- **Prisma Relational Database Architecture:**
  - Strongly-typed Prisma schemas with PostgreSQL compatibility (Supabase, Neon, or self-hosted PostgreSQL).
  - Automated seed scripts for rapid environment bootstrapping.

---

## 🛠️ Technology Stack

| Layer                   | Technologies                                                        |
| :---------------------- | :------------------------------------------------------------------ |
| **Framework**           | Next.js 16 (App Router)                                             |
| **Language**            | TypeScript                                                          |
| **ORM & Database**      | Prisma ORM, PostgreSQL (Compatible with Supabase / Neon / Local PG) |
| **Authentication**      | NextAuth.js v5 (Auth.js Beta)                                       |
| **Styling & UI**        | Tailwind CSS v4, Lucide React Icons, Radix UI Slot                  |
| **Media & Storage**     | Cloudinary SDK                                                      |
| **Email Service**       | Nodemailer (SMTP transport with automated alert dispatch)           |
| **Rich Text Editor**    | React Quill New                                                     |
| **Visual Charts**       | Recharts                                                            |

---

## 📂 Project Structure

```text
kokalachi-enterprises-cms/
├── prisma/
│   ├── schema.prisma       # Prisma relational data model definition
│   └── seed.js             # Initial database seeder script
├── public/                 # Static brand assets and icons
├── src/
│   ├── app/                # Next.js App Router endpoints & admin pages
│   │   ├── (auth)/         # Login and authentication views
│   │   ├── api/            # REST API endpoints
│   │   │   ├── auth/       # NextAuth handler routes
│   │   │   ├── blogs/      # Blog articles management API
│   │   │   ├── enquiries/  # Commercial leads and contact API
│   │   │   ├── events/     # Corporate events API
│   │   │   ├── products/   # Lubricant products and categories API
│   │   │   ├── pages/      # Dynamic site page content blocks API
│   │   │   └── seo/        # Global SEO, sitemap, and robots API
│   │   ├── blogs/          # Admin blog manager and article editor
│   │   ├── dashboard/      # Admin analytics and metrics overview
│   │   ├── enquiries/      # B2B leads, filter table, and detail drawer
│   │   ├── events/         # Event management and image gallery manager
│   │   ├── pages/          # Individual website page section editors
│   │   ├── products/       # Lubricant product and category manager
│   │   ├── robots.txt/     # Direct CMS-level robots.txt route
│   │   ├── sitemap.xml/    # Direct CMS-level sitemap.xml route
│   │   ├── seo/            # Global SEO, robots.txt, and sitemap configuration
│   │   ├── layout.tsx      # Admin dashboard shell, sidebar, and notifications
│   │   └── page.tsx        # Dashboard landing page
│   ├── components/         # Reusable admin UI components and forms
│   ├── lib/                # Prisma client, Cloudinary helper, and email utilities
│   ├── auth.ts             # NextAuth configuration and credentials provider
│   └── middleware.ts       # Edge middleware for route protection and CORS
├── .env.example            # Environment variables template
├── package.json            # Dependencies and npm scripts
└── tsconfig.json           # TypeScript configuration
```

---

## ⚙️ Getting Started & Local Development

### 1. Prerequisites

- **Node.js:** `v18.17.0` or higher (Node 20+ LTS recommended)
- **PostgreSQL Database:** Local instance or managed provider (e.g., Supabase / Neon)
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd kokalachi-enterprises-cms

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables using placeholders:

```env
# =========================================================================
# Kokalachi CMS - Environment Configuration
# =========================================================================

# Database Connections (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/kokalachi_cms?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/kokalachi_cms?schema=public"

# NextAuth Authentication
AUTH_SECRET="generate-a-secure-random-secret"
NEXTAUTH_URL="http://localhost:3001"
ALLOWED_ORIGINS="*"

# Client Frontend Website URL (For live sitemap and robots previews)
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"

# Cloudinary Media Storage
NEXT_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_URL="cloudinary://your_api_key:your_api_secret@your_cloud_name"

# SMTP Mail Dispatch Configuration (For automated inquiry alerts)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_smtp_username"
SMTP_PASS="your_smtp_password"
SMTP_FROM="Kokalachi <no-reply@kokalachi.com>"
ADMIN_NOTIFICATION_EMAIL="admin@kokalachi.com"
```

> **Security Warning:** Never commit real database connection strings, authentication secrets, Cloudinary API keys, or SMTP passwords to version control. Always store production secrets in your deployment platform's encrypted environment variables dashboard.

### 4. Database Setup & Migrations

Push the Prisma schema to your PostgreSQL database and generate the Prisma Client:

```bash
# Generate the Prisma Client
npx prisma generate

# Synchronize the database schema
npx prisma db push

# (Optional) Seed the database with default sections, initial pages, and an admin user
npm run seed
```

### 5. Running the Development Server

Start the CMS development server on port 3001:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to access the CMS portal.

---

## 📦 Available Scripts

| Command                | Description                                                |
| :--------------------- | :--------------------------------------------------------- |
| `npm run dev`          | Starts the Next.js development server on port 3001         |
| `npm run build`        | Generates the Prisma client and compiles production assets |
| `npm run start`        | Boots the compiled production server                       |
| `npm run seed`         | Executes `prisma/seed.js` to seed initial data             |
| `npm run lint`         | Runs ESLint code quality checks                            |
| `npm run format`       | Formats code with Prettier                                 |
| `npm run format:check` | Verifies code formatting across the repository             |

---

## 🛡️ Security & Best Practices

- **Client Environment Variables:** Only variables prefixed with `NEXT_PUBLIC_` are accessible to client components (such as `NEXT_PUBLIC_WEBSITE_URL`). All sensitive database, email, and authentication secrets remain strictly server-side.
- **Middleware Whitelist:** API endpoints (`/api/*`), authentication flows (`/login`, `/register`), and public crawlers (`/robots.txt`, `/sitemap.xml`) are accessible without authentication; all administrative pages require a valid session.
- **CORS Protection:** Cross-origin request headers are validated in `src/middleware.ts` to ensure secure communication between the frontend client and CMS API.

---

## 🚢 Deployment

The CMS is designed for deployment on modern platforms such as **Vercel**, **Railway**, or containerized Docker instances:

1. Configure all required environment variables in your hosting provider's dashboard.
2. Build command: `npm run build`
3. Output directory: `.next`
4. Ensure the database host allows incoming connections from your deployment IP ranges or connection pooler.

---

## 📄 License & Confidentiality

© **Kokalachi**. All rights reserved.  
This software, documentation, and data schemas are proprietary and confidential. Unauthorized duplication, dissemination, or distribution is strictly prohibited.
