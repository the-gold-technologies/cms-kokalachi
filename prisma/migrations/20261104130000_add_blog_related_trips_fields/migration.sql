-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "relatedTripsKicker" TEXT DEFAULT 'Made for first-timers',
ADD COLUMN IF NOT EXISTS "relatedTripsTitle" TEXT DEFAULT 'Trips to say yes to';

