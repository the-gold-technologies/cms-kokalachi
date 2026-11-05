-- AlterTable Trip: add region column
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "region" TEXT DEFAULT 'domestic';

-- CreateTable CallBackRequest
CREATE TABLE IF NOT EXISTS "CallBackRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bestTime" TEXT NOT NULL,
    "tripId" TEXT,
    "tripName" TEXT,
    "tripUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallBackRequest_pkey" PRIMARY KEY ("id")
);

-- Rename Trip Slugs to new SEO format (-group-trip)
UPDATE "Trip" SET "slug" = 'udaipur-group-trip' WHERE "slug" = 'udaipur';
UPDATE "Trip" SET "slug" = 'kashmir-group-trip' WHERE "slug" = 'kashmir';
UPDATE "Trip" SET "slug" = 'manali-group-trip' WHERE "slug" = 'manali';
UPDATE "Trip" SET "slug" = 'kerala-group-trip' WHERE "slug" = 'kerala';
UPDATE "Trip" SET "slug" = 'meghalaya-group-trip' WHERE "slug" = 'meghalaya';
UPDATE "Trip" SET "slug" = 'sri-lanka-group-trip' WHERE "slug" = 'sri-lanka';
UPDATE "Trip" SET "slug" = 'bhutan-group-trip' WHERE "slug" = 'bhutan';
UPDATE "Trip" SET "slug" = 'almaty-kazakhstan-group-trip' WHERE "slug" = 'almaty';

-- Mark International Journeys
UPDATE "Trip" SET "region" = 'international' WHERE "slug" IN ('sri-lanka-group-trip', 'sri-lanka', 'bhutan-group-trip', 'bhutan', 'almaty-kazakhstan-group-trip', 'almaty', 'the-island-diaries-thailand');
