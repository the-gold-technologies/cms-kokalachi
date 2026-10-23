import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

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

    const resourceType = (match[1] as any) || "image";
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
 * Deletes previous asset from Cloudinary
 */
async function deletePreviousAsset(urlOrPublicId: string) {
  if (!urlOrPublicId) return;

  const hasCloudinaryCredentials =
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryCredentials) {
    // If stored locally, remove local file
    if (urlOrPublicId.startsWith("/uploads/")) {
      try {
        const localPath = path.join(process.cwd(), "public", urlOrPublicId);
        await fs.unlink(localPath);
        console.log(`[Local Uploads] Deleted previous local file: ${localPath}`);
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
    const originalSizeKb = (inputBuffer.length / 1024).toFixed(1);
    const sharpInstance = sharp(inputBuffer, { animated: false });
    const metadata = await sharpInstance.metadata();

    let pipeline = sharpInstance;
    // Resize down if excessively large, keeping aspect ratio without upscaling
    if ((metadata.width && metadata.width > 2000) || (metadata.height && metadata.height > 2000)) {
      pipeline = pipeline.resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to optimized WebP for massive KB savings with premium visual quality
    const compressedBuffer = await pipeline
      .webp({
        quality: 80,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    const compressedSizeKb = (compressedBuffer.length / 1024).toFixed(1);
    console.log(
      `[Image Compression] ${fileName}: ${originalSizeKb} KB -> ${compressedSizeKb} KB (WebP quality 82)`,
    );

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
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const folder = (data.get("folder") as string) || "kokalachi/uploads";
    const previousUrl = (data.get("previousUrl") || data.get("oldImageUrl")) as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Delete previous asset if re-uploading / replacing
    if (previousUrl) {
      await deletePreviousAsset(previousUrl);
    }

    // 2. Read array buffer
    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // 3. Compress image before sending to Cloudinary
    const compressed = await compressImageBuffer(rawBuffer, file.type, file.name);

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const cleanBaseName = file.name.replace(/\.[a-zA-Z0-9]+$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    const hasCloudinaryCredentials = Boolean(
      (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_CLOUDINARY_CLOUD_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
    );

    // 4. Upload to Cloudinary if credentials are configured
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

    // 5. Local Fallback for offline development when credentials are unset
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
    const body = await request.json();
    const target = body.url || body.publicId;

    if (!target) {
      return NextResponse.json({ error: "Target URL or publicId required" }, { status: 400 });
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
