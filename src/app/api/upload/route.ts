import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/auth-check";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts publicId and resourceType from a Cloudinary URL
 */
function extractCloudinaryAsset(
  url: string,
): { publicId: string; resourceType: "image" | "raw" | "video" } | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const match = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (!match) return null;

    const resourceType = match[1] as "image" | "raw" | "video";
    let publicId = match[2];

    if (
      resourceType === "raw" &&
      url.toLowerCase().endsWith(".pdf") &&
      !publicId.endsWith(".pdf")
    ) {
      publicId = `${publicId}.pdf`;
    }

    return { publicId, resourceType };
  } catch (err) {
    console.error("Error extracting Cloudinary asset:", err);
    return null;
  }
}

/**
 * Deletes previous asset from Cloudinary or local storage securely
 */
async function deletePreviousAsset(urlOrPublicId: string) {
  if (!urlOrPublicId || typeof urlOrPublicId !== "string") return;

  const hasCloudinaryCredentials =
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryCredentials) {
    if (urlOrPublicId.startsWith("/uploads/")) {
      try {
        const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
        const cleanRelPath = urlOrPublicId.replace(/^\/+/, "");
        const localPath = path.resolve(process.cwd(), "public", cleanRelPath);
        // Prevent path traversal outside public/uploads
        if (localPath.startsWith(uploadsDir)) {
          await fs.unlink(localPath);
          console.log(`[Local Uploads] Deleted previous local file: ${localPath}`);
        } else {
          console.warn(`[Security] Blocked path traversal attempt on delete: ${urlOrPublicId}`);
        }
      } catch (e) {
        // ignore if already deleted
      }
    }
    return;
  }

  const asset = extractCloudinaryAsset(urlOrPublicId);
  const publicId = asset ? asset.publicId : urlOrPublicId;
  const resourceType = asset ? asset.resourceType : "image";

  try {
    console.log(`[Cloudinary] Deleting previous asset: ${publicId} (${resourceType})`);
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    console.log(`[Cloudinary] Delete result:`, res);
    return res;
  } catch (err) {
    console.warn(`[Cloudinary] Could not delete previous asset ${publicId}:`, err);
  }
}

/**
 * Compresses raster images using sharp before uploading to Cloudinary
 */
async function compressImageBuffer(
  inputBuffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<{ buffer: Buffer; format: string; extension: string }> {
  const isSvg = mimeType === "image/svg+xml" || fileName.toLowerCase().endsWith(".svg");
  const isIco = mimeType === "image/x-icon" || fileName.toLowerCase().endsWith(".ico");
  const isPdf = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

  if (isSvg || isIco || isPdf) {
    return {
      buffer: inputBuffer,
      format: isPdf ? "pdf" : isSvg ? "svg" : "ico",
      extension: isPdf ? ".pdf" : isSvg ? ".svg" : ".ico",
    };
  }

  try {
    const sharpInstance = sharp(inputBuffer, { animated: false });
    const metadata = await sharpInstance.metadata();

    let pipeline = sharpInstance;
    if ((metadata.width && metadata.width > 2000) || (metadata.height && metadata.height > 2000)) {
      pipeline = pipeline.resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const compressedBuffer = await pipeline
      .webp({
        quality: 80,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    return {
      buffer: compressedBuffer,
      format: "webp",
      extension: ".webp",
    };
  } catch (err) {
    console.warn(
      `[Image Compression] Sharp compression failed for ${fileName}, using original:`,
      err,
    );
    return {
      buffer: inputBuffer,
      format: mimeType.split("/")[1] || "jpeg",
      extension: `.${mimeType.split("/")[1] || "jpg"}`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const folder = (data.get("folder") as string) || "kokalachi/uploads";
    const previousUrl = (data.get("previousUrl") || data.get("oldImageUrl")) as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // 1. File size validation (15 MB max)
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds maximum size limit of 15MB" },
        { status: 400 }
      );
    }

    // 2. Extension validation
    const ext = path.extname(file.name).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".ico"];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Please upload images or PDFs." },
        { status: 400 }
      );
    }

    // 3. Delete previous asset if replacing
    if (previousUrl) {
      await deletePreviousAsset(previousUrl);
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // 4. SVG XSS check: block embedded script tags or events
    const isSvg = file.type === "image/svg+xml" || ext === ".svg";
    if (isSvg) {
      const svgText = rawBuffer.toString("utf-8");
      if (
        /<script[\s>]/i.test(svgText) ||
        /javascript:/i.test(svgText) ||
        /onload\s*=/i.test(svgText) ||
        /onerror\s*=/i.test(svgText)
      ) {
        return NextResponse.json(
          { success: false, error: "Malicious executable script detected in SVG file." },
          { status: 400 }
        );
      }
    }

    // 5. Compress image
    const compressed = await compressImageBuffer(rawBuffer, file.type, file.name);

    const isPdf = file.type === "application/pdf" || ext === ".pdf";
    const cleanBaseName = file.name
      .replace(/\.[a-zA-Z0-9]+$/i, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 80);

    const hasCloudinaryCredentials = Boolean(
      (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_CLOUDINARY_CLOUD_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
    );

    // 6. Upload to Cloudinary if configured
    if (hasCloudinaryCredentials) {
      const publicId = isPdf
        ? `${cleanBaseName}_${Date.now()}.pdf`
        : `${cleanBaseName}_${Date.now()}`;

      const result = await new Promise<any>((resolve, reject) => {
        const uploadOptions: any = {
          folder,
          resource_type: isPdf ? "raw" : "image",
          public_id: publicId,
          overwrite: true,
        };

        if (!isPdf) {
          uploadOptions.format = "webp";
          uploadOptions.transformation = [{ quality: "auto:good", fetch_format: "webp" }];
        }

        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        uploadStream.end(compressed.buffer);
      });

      let secureUrl = result.secure_url;
      if (!isPdf && !secureUrl.endsWith(".webp") && secureUrl.includes("/image/upload/")) {
        secureUrl = secureUrl.replace(/\.[a-zA-Z0-9]+$/, ".webp");
      }

      return NextResponse.json({
        success: true,
        url: secureUrl,
        publicId: result.public_id,
        name: file.name,
        format: isPdf ? "pdf" : "webp",
        size: compressed.buffer.length,
        originalSize: file.size,
        sizeKb: (compressed.buffer.length / 1024).toFixed(1),
        originalSizeKb: (file.size / 1024).toFixed(1),
        compressionRatio: `${((1 - compressed.buffer.length / file.size) * 100).toFixed(0)}%`,
      });
    }

    // 7. Local storage fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const localFileName = `${cleanBaseName}_${Date.now()}${compressed.extension}`;
    const localFilePath = path.join(uploadDir, localFileName);
    await fs.writeFile(localFilePath, compressed.buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${localFileName}`,
      publicId: localFileName,
      name: file.name,
      format: isPdf ? "pdf" : "webp",
      size: compressed.buffer.length,
      originalSize: file.size,
      sizeKb: (compressed.buffer.length / 1024).toFixed(1),
      originalSizeKb: (file.size / 1024).toFixed(1),
      compressionRatio: `${((1 - compressed.buffer.length / file.size) * 100).toFixed(0)}%`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const body = await request.json();
    const target = body.url || body.publicId;

    if (!target) {
      return NextResponse.json({ success: false, error: "Target URL or publicId required" }, { status: 400 });
    }

    await deletePreviousAsset(target);
    return NextResponse.json({ success: true, message: "Asset deleted" });
  } catch (error: any) {
    console.error("Delete asset error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Delete failed" },
      { status: 500 },
    );
  }
}
