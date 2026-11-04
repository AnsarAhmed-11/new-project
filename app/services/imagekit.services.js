const PRODUCT_IMAGE_FOLDER = "/products";

function safeFile() {
  return String(value || "product-image")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const imagekitConfiguration = () => {
  return {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  };
};
export function prepareProductImageUpload({ imageName, slug, productName }) {
  const extension = String(imageName || "")
    .split(".")
    .pop();
  const baseName = safeFileName(slug || productName || "product");
  const fileName =
    extension && extension !== imageName
      ? `${baseName}.${extension}`
      : baseName;

  return {
    fileName,
    originalFileName: imageName || null,
    folder: PRODUCT_IMAGE_FOLDER,
    tags: ["product"],
    useUniqueFileName: true,
    imageUrl: null,
    status: "pending-imagekit-upload",
  };
}
