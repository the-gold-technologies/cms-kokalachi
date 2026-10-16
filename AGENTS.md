# Kokalachi CMS Development Rules & Guidelines

## 1. Zero Default Data in useState
- Never initialize component `useState` with hardcoded mock, placeholder, or demo data.
- All form inputs, filters, and records MUST initialize with clean empty states:
  - String fields: `""`
  - Array fields: `[]`
  - Number fields: `0` or `undefined`
  - Object / nullable fields: `null`
  - Boolean flags: `false`
- Content should only be loaded dynamically from the API/Database.

## 2. No Redundant Fallbacks or Duplicate OR Options (||)
- Never use `||` fallbacks for environment variables or database URLs (e.g., NO `process.env.DATABASE_URL || "..."`). Secrets and connection strings MUST strictly originate from the environment.
- Maintain a single source of truth for all select dropdowns, categories, and enum lists.
- Avoid repeating option lists or chaining unnecessary fallback `||` conditions across files.

## 3. Save Changes Button Standard
- In every form created across the CMS, the save button:
  - MUST be named **"Save Changes"**.
  - MUST take **full width** of the form (`w-full`).

## 4. Component Name Parity with Website
- Component names in the CMS must match the corresponding website component names 1-to-1:
  - **Home Page**: `HeroSection`, `WhyWeExistSection`, `HowItWorksSection`, `DifferenceSection`, `GoodCompanySection`, `MomentsThatStayedSection`, `WhoTravelsSection`, `UpcomingJourneysSection`
  - **About Page**: `AboutHeroSection`, `WhyWeStartedSection`, `WhatWeBelieveSection`, `MeetFounderSection`, `ExploreJourneysSection`, `JoinTribeSection`
  - **Contact Page**: `ContactHeroSection`, `ContactFormSection`

## 5. Rich Text Editing with Word-as-Link Feature
- Use `react-quill-new` with the link tool enabled.
- Allow users to highlight any word or phrase and convert it to a link with URL targets.
- Ensure proper styling and sanitization.

## 6. Technology Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- Prisma ORM with PostgreSQL (local pgAdmin 4: kokalachi_cms)
- NextAuth.js v5 (Credentials & Sessions)
