import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts all Cloudinary and local upload URLs from any string, array, or deeply nested object
 */
export function extractMediaUrls(data: any, collected: Set<string> = new Set()): Set<string> {
  if (!data) return collected;

  if (typeof data === "string") {
    // Cloudinary URLs
    if (data.includes("res.cloudinary.com")) {
      const cloudMatches = data.match(/https?:\/\/[^\s"'<>]*(?:res\.cloudinary\.com)[^\s"'<>]*/gi);
      if (cloudMatches) {
        for (const m of cloudMatches) {
          const cloudName =
            process.env.CLOUDINARY_CLOUD_NAME ||
            "kokalachi";
          if (m.includes("/kokalachi/") || m.includes(`/${cloudName}/`)) {
            collected.add(m);
          }
        }
      }
    } else {
      // Local /uploads/ files (only if not an external URL)
      const localMatches = data.match(/(?:^|["'\s])(\/uploads\/[^\s"'<>]+\.[a-zA-Z0-9]+)/g);
      if (localMatches) {
        for (const m of localMatches) {
          collected.add(m.trim().replace(/^["']/, ""));
        }
      }
    }
  } else if (Array.isArray(data)) {
    for (const item of data) {
      extractMediaUrls(item, collected);
    }
  } else if (typeof data === "object") {
    for (const val of Object.values(data)) {
      extractMediaUrls(val, collected);
    }
  }

  return collected;
}

export const extractCloudinaryUrls = extractMediaUrls;

/**
 * Permanently deletes a single asset by URL (Cloudinary or local /uploads/)
 */
export async function deleteCloudinaryAsset(url: string | null | undefined): Promise<boolean> {
  if (!url || typeof url !== "string") return false;

  // 1. Handle local /uploads/ file
  if (url.startsWith("/uploads/")) {
    try {
      const localPath = path.join(process.cwd(), "public", url);
      await fs.unlink(localPath);
      console.log(`[Media Cleanup on Save] Deleted obsolete local file: ${localPath}`);
      return true;
    } catch {
      return false;
    }
  }

  // 2. Handle Cloudinary
  if (!url.includes("cloudinary.com")) return false;

  const hasCredentials = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );

  if (!hasCredentials) {
    console.warn("[Cloudinary Cleanup on Save] Credentials missing; skipping deletion.");
    return false;
  }

  try {
    const isRaw = url.includes("/raw/upload/");
    const isVideo = url.includes("/video/upload/");
    const resourceType = isRaw ? "raw" : isVideo ? "video" : "image";

    let publicId = "";
    if (isRaw) {
      const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/i);
      if (match) publicId = match[1];
    } else {
      const match = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/i);
      if (match) publicId = match[1];
    }

    if (!publicId) return false;

    let res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (res?.result === "not found" && !isRaw) {
      const matchWithExt = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)$/i);
      if (matchWithExt && matchWithExt[1] !== publicId) {
        res = await cloudinary.uploader.destroy(matchWithExt[1], {
          resource_type: "image",
          invalidate: true,
        });
      }
    }

    const success = res?.result === "ok";
    if (success) {
      console.log(
        `[Cloudinary Cleanup on Save] Deleted obsolete asset: ${publicId} (${resourceType})`,
      );
    }
    return success;
  } catch (error) {
    console.error(`[Cloudinary Cleanup on Save] Failed to delete asset ${url}:`, error);
    return false;
  }
}

/**
 * Compares old data against new data upon clicking Save.
 * Finds Cloudinary URLs that were replaced or removed and deletes them,
 * while RETAINING all images that are still in the new data.
 */
export async function cleanupObsoleteCloudinaryAssets(oldData: any, newData: any): Promise<void> {
  try {
    if (!oldData) return;

    const oldUrls = Array.from(extractMediaUrls(oldData));
    const newUrls = Array.from(extractMediaUrls(newData));

    // Images in old data that are no longer retained in new data
    const obsoleteUrls = oldUrls.filter((url) => !newUrls.includes(url));

    if (obsoleteUrls.length > 0) {
      console.log(
        `[Cloudinary Cleanup on Save] Found ${obsoleteUrls.length} obsolete asset(s) to remove (Retained: ${newUrls.length}):`,
        obsoleteUrls,
      );
      await Promise.allSettled(obsoleteUrls.map((url) => deleteCloudinaryAsset(url)));
    }
  } catch (err) {
    console.error("[Cloudinary Cleanup on Save] Error during obsolete assets cleanup:", err);
  }
}

/**
 * Deletes all Cloudinary URLs found in data (used when an entire entity like a Trip is deleted)
 */
export async function deleteCloudinaryAssetsFromData(data: any): Promise<void> {
  try {
    if (!data) return;
    const urls = Array.from(extractMediaUrls(data));
    if (urls.length > 0) {
      console.log(
        `[Cloudinary Cleanup on Save] Deleting ${urls.length} asset(s) on entity removal:`,
        urls,
      );
      await Promise.allSettled(urls.map((url) => deleteCloudinaryAsset(url)));
    }
  } catch (err) {
    console.error("[Cloudinary Cleanup on Save] Error deleting entity assets:", err);
  }
}
