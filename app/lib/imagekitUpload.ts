"use client";

import { upload } from "@imagekit/next";

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  filePath: string;
  name: string;
}

interface UploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
}

export async function uploadProductImage({
  file,
  onProgress,
}: UploadOptions): Promise<ImageKitUploadResult> {
  // Validate image type
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image.");
  }

  // Maximum image size: 10 MB
  const MAX_SIZE = 10 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    throw new Error("Image size must be less than 10 MB.");
  }

  // Get temporary upload authentication
  const authResponse = await fetch("/api/upload-auth", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!authResponse.ok) {
    throw new Error(`ImageKit authentication failed (${authResponse.status}).`);
  }

  const auth = await authResponse.json();

  if (!auth.token || !auth.signature || !auth.expire || !auth.publicKey) {
    throw new Error("Invalid ImageKit authentication response.");
  }

  // Generate a unique filename
  const extension = file.name.split(".").pop() || "jpg";
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "");

  const fileName = `product-${crypto.randomUUID()}.${safeExtension}`;

  // Upload directly to ImageKit
  const result = await upload({
    file,
    fileName,
    token: auth.token,
    signature: auth.signature,
    expire: auth.expire,
    publicKey: auth.publicKey,
    folder: "/merciful-tools/products",
    useUniqueFileName: true,
    onProgress: (event) => {
      if (event.total > 0) {
        const percentage = Math.round((event.loaded / event.total) * 100);

        onProgress?.(percentage);
      }
    },
  });
  const { url, fileId, filePath } = result;

  if (
    typeof url !== "string" ||
    typeof fileId !== "string" ||
    typeof filePath !== "string" ||
    !url ||
    !fileId ||
    !filePath
  ) {` `
    throw new Error("ImageKit did not return a valid image.");
  }

  const name = typeof result.name === "string" && result.name
    ? result.name
    : fileName;

  return {
    url,
    fileId,
    filePath,
    name,
  };
}
