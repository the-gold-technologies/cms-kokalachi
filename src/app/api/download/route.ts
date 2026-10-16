import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const customName = searchParams.get("name") || "document.pdf";

    if (!fileUrl || fileUrl === "#") {
      return NextResponse.json({ error: "No PDF file specified or uploaded" }, { status: 400 });
    }

    const sanitizedName = customName.endsWith(".pdf") ? customName : customName + ".pdf";
    const cleanFilename = sanitizedName.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const responseHeaders: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="' + cleanFilename + '"',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, max-age=3600",
    };

    // Case 1: Local / Relative path (e.g. /docs/... or /uploads/...)
    const isRelative = !fileUrl.startsWith("http://") && !fileUrl.startsWith("https://");

    if (isRelative) {
      const cleanPath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
      const fileName = path.basename(fileUrl);

      const candidatePaths = [
        path.join(process.cwd(), "public", cleanPath),
        path.join(process.cwd(), "public", "docs", fileName),
        path.join(process.cwd(), "..", "mahalaxmi-enterprises ", "public", cleanPath),
        path.join(process.cwd(), "..", "mahalaxmi-enterprises ", "public", "docs", fileName),
      ];

      for (const candidate of candidatePaths) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          const fileBuffer = fs.readFileSync(candidate);
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: responseHeaders,
          });
        }
      }

      return NextResponse.json(
        { error: "Requested PDF file does not exist on the server" },
        { status: 404 },
      );
    }

    // Case 2: Remote URL (Cloudinary uploaded file or external URL)
    let downloadTarget = fileUrl;

    if (fileUrl.includes("cloudinary.com")) {
      try {
        const isRaw = fileUrl.includes("/raw/upload/");
        if (isRaw) {
          const match = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/i);
          if (match && match[1]) {
            const publicId = match[1];
            downloadTarget = cloudinary.utils.private_download_url(publicId, "", {
              resource_type: "raw",
              type: "upload",
              attachment: true,
            });
          }
        } else {
          const match = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.pdf)?$/i);
          if (match && match[1]) {
            const publicId = match[1];
            downloadTarget = cloudinary.utils.private_download_url(publicId, "pdf", {
              resource_type: "image",
              type: "upload",
              attachment: true,
            });
          }
        }
      } catch (err) {
        console.error("Error generating Cloudinary private download URL:", err);
      }
    }

    let fileBuffer: ArrayBuffer | null = null;

    // 1. Try fetching from Cloudinary signed private download URL
    if (downloadTarget) {
      try {
        const response = await fetch(downloadTarget);
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
        }
      } catch (err) {
        console.warn("Signed Cloudinary download fetch failed:", err);
      }
    }

    // 2. If signed URL failed or wasn't available, try direct fileUrl
    if (!fileBuffer && downloadTarget !== fileUrl) {
      try {
        const response = await fetch(fileUrl);
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
        }
      } catch (err) {
        console.warn("Direct fileUrl fetch failed:", err);
      }
    }

    // 3. Try with fl_attachment transformation if still not retrieved
    if (!fileBuffer && fileUrl.includes("cloudinary.com")) {
      try {
        const attachmentUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
        const response = await fetch(attachmentUrl);
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
        }
      } catch (err) {
        console.warn("Cloudinary attachment URL fetch failed:", err);
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        {
          error:
            "Failed to download the uploaded PDF from Cloudinary. Please verify the uploaded file.",
        },
        { status: 502 },
      );
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("PDF download proxy error:", error);
    return NextResponse.json({ error: error?.message || "Download failed" }, { status: 500 });
  }
}
