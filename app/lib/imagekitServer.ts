
const IMAGEKIT_API_URL = "https://api.imagekit.io/v1";

function getPrivateKey() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing.");
  }

  return privateKey;
}

function getAuthHeader() {
  const credentials = Buffer.from(`${getPrivateKey()}:`).toString("base64");
  return `Basic ${credentials}`;
}

// Delete an ImageKit file using its fileId.
export async function deleteImageKitFile(fileId: string) {
  if (!fileId?.trim()) {
    throw new Error("ImageKit fileId is required.");
  }

  const response = await fetch(
    `${IMAGEKIT_API_URL}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeader(),
      },
      cache: "no-store",
    },
  );

  // Already deleted is also considered successful cleanup.
  if (response.status === 404) {
    return true;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`ImageKit deletion failed: ${details}`);
  }

  return true;
}

// Validate that an uploaded file belongs to our product folder.

export function isValidProductImage({
  url,
  fileId,
  filePath,
}: {
  url: string;
  fileId: string;
  filePath: string;
}) {
  if (!url?.trim() || !fileId?.trim() || !filePath?.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!endpoint || parsedUrl.protocol !== "https:") {
      return false;
    }

    const expectedUrl = new URL(endpoint);

    const validHost = parsedUrl.hostname === expectedUrl.hostname;

    const validFolder =
      filePath.replace(/^\/+/, "").startsWith(
        "merciful-tools/products/"
      );

    return validHost && validFolder;
  } catch {
    return false;
  }
}

