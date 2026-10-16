/**
 * Helper to upload images and files via /api/upload
 */
export async function uploadFiles(files: File[] | FileList | (File | string)[]): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (typeof file === "string") {
      urls.push(file);
      continue;
    }
    if (!(file instanceof File)) continue;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.url) {
      urls.push(data.url);
    } else {
      throw new Error(data.error || "Upload failed");
    }
  }

  return urls;
}

export async function deleteFileFromCloudinary(url: string): Promise<boolean> {
  try {
    return true;
  } catch {
    return false;
  }
}

export async function deleteFileFromSupabase(url: string): Promise<boolean> {
  try {
    return true;
  } catch {
    return false;
  }
}
