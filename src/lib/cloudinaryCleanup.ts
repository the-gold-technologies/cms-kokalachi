import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts all Cloudinary URLs belonging to mahalaxmi uploads from any string, array, or object
 */
export function extractCloudinaryUrls(data: any, collected: Set<string> = new Set()): Set<string> {
  if (!data) return collected;

  if (typeof data === "string") {
    const matches = data.match(/https?:\/\/[^\s"'<>]*(?:res\.cloudinary\.com)[^\s"'<>]*/gi);
    if (matches) {
      for (const m of matches) {
        // Only target uploaded assets in the mahalaxmi upload folder
        if (m.includes("/mahalaxmi/uploads/")) {
          collected.add(m);
        }
      }
    }
  } else if (Array.isArray(data)) {
    for (const item of data) {
      extractCloudinaryUrls(item, collected);
    }
  } else if (typeof data === "object") {
    for (const val of Object.values(data)) {
      extractCloudinaryUrls(val, collected);
    }
  }

  return collected;
}

/**
 * Permanently deletes a single Cloudinary asset by URL
 */
export async function deleteCloudinaryAsset(url: string | null | undefined): Promise<boolean> {
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes("cloudinary.com") ||
    !url.includes("/mahalaxmi/uploads/")
  ) {
    return false;
  }

  try {
    const isRaw = url.includes("/raw/upload/");
    const isVideo = url.includes("/video/upload/");
    const resourceType = isRaw ? "raw" : isVideo ? "video" : "image";

    let publicId = "";
    if (isRaw) {
      // Raw assets preserve their full filename and extension in public_id
      const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/i);
      if (match) publicId = match[1];
    } else {
      // Images & videos typically strip file extension in public_id
      const match = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/i);
      if (match) publicId = match[1];
    }

    if (!publicId) return false;

    let res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    // If image deletion returned not_found, try with full extension included
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
      console.log(`[Cloudinary Cleanup] Deleted obsolete asset: ${publicId} (${resourceType})`);
    }
    return success;
  } catch (error) {
    console.error(`[Cloudinary Cleanup] Failed to delete asset from URL ${url}:`, error);
    return false;
  }
}

/**
 * Compares old data against new data, finding Cloudinary URLs that were replaced or removed,
 * and deletes them from Cloudinary.
 */
export async function cleanupObsoleteCloudinaryAssets(oldData: any, newData: any): Promise<void> {
  try {
    const oldUrls = Array.from(extractCloudinaryUrls(oldData));
    const newUrls = Array.from(extractCloudinaryUrls(newData));

    const obsoleteUrls = oldUrls.filter((url) => !newUrls.includes(url));

    if (obsoleteUrls.length > 0) {
      console.log(`[Cloudinary Cleanup] Cleaning up ${obsoleteUrls.length} obsolete asset(s)...`);
      await Promise.allSettled(obsoleteUrls.map((url) => deleteCloudinaryAsset(url)));
    }
  } catch (err) {
    console.error("[Cloudinary Cleanup] Error during obsolete assets cleanup:", err);
  }
}

/**
 * Deletes all Cloudinary URLs found in data (used when an entire entity is deleted)
 */
export async function deleteCloudinaryAssetsFromData(data: any): Promise<void> {
  try {
    const urls = Array.from(extractCloudinaryUrls(data));
    if (urls.length > 0) {
      console.log(`[Cloudinary Cleanup] Deleting ${urls.length} asset(s) on entity removal...`);
      await Promise.allSettled(urls.map((url) => deleteCloudinaryAsset(url)));
    }
  } catch (err) {
    console.error("[Cloudinary Cleanup] Error deleting entity assets:", err);
  }
}
