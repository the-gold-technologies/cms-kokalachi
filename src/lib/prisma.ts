import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaInstance: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

// In development, ensure we pick up fresh generated schemas if ctaEyebrow was newly added
if (process.env.NODE_ENV !== "production") {
  const dmmf = (global.prismaInstance as any)?._dmmf;
  const blogFields = dmmf?.modelMap?.BlogPost?.fields;
  const hasCta = blogFields?.some((f: any) => f.name === "ctaEyebrow");
  if (!hasCta && global.prismaInstance) {
    try {
      (global.prismaInstance as any).$disconnect();
    } catch {}
    global.prismaInstance = undefined;
  }
}

export const prisma =
  global.prismaInstance && (global.prismaInstance as any).blogPost
    ? global.prismaInstance
    : new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prismaInstance = prisma;
}
