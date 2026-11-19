import { NextResponse } from "next/server";
import { getAdmin } from "@/app/lib/auth";
import { createProduct, getProducts } from "@/app/models/product.model.js";
import {
  deleteImageKitFile,
  isValidProductImage,
} from "@/app/lib/imagekitServer";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ProductPriceInput = { size: string; price: number; currency: "INR" };
class ProductValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePrices(value: FormDataEntryValue | null): ProductPriceInput[] {
  if (value === null) return [];

  try {
    const parsed: unknown = JSON.parse(String(value));
    if (!Array.isArray(parsed)) throw new Error("Prices must be an array.");

    const seen = new Set<string>();
    return parsed.map((entry): ProductPriceInput => {
      if (!isRecord(entry)) {
        throw new Error("Invalid price row.");
      }
      const size = typeof entry.size === "string" ? entry.size.trim() : "";
      const price = Number(entry.price);
      const key = size.toLocaleLowerCase();
      if (!size || size.length > 80 || !Number.isFinite(price) || price <= 0) {
        throw new Error("Each size must have a positive price.");
      }
      if (seen.has(key)) throw new Error("Product sizes must be unique.");
      seen.add(key);
      return { size, price, currency: "INR" };
    });
  } catch (error) {
    throw new ProductValidationError(
      error instanceof Error ? error.message : "Invalid prices.",
    );
  }
}

export async function GET() {
  if (!(await getAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({
      data: await getProducts(),
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { message: "Unable to load products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let imageKitFileId = "";

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();
    const slug = slugify(String(formData.get("slug") || name));
    const sku = String(formData.get("sku") || "").trim();
    const status = String(formData.get("status") || "inStock");
    const prices = parsePrices(formData.get("prices"));

    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const submittedFileId = String(formData.get("imageKitFileId") || "").trim();
    const imageKitFilePath = String(
      formData.get("imageKitFilePath") || "",
    ).trim();
    console.log("IMAGE VALIDATION INPUT:", {
      imageUrl,
      imageKitFileIdExists: Boolean(imageKitFileId),
      imageKitFilePath,
      configuredEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    // Validate product fields
    if (
      !name ||
      name.length > 160 ||
      !sku ||
      sku.length > 80 ||
      !slug ||
      slug.length > 180
    ) {
      return NextResponse.json(
        {
          message:
            "Name, slug, and SKU are required and must be within their limits.",
        },
        { status: 400 },
      );
    }

    if (status !== "inStock" && status !== "outOfStock") {
      return NextResponse.json(
        { message: "Invalid product status." },
        { status: 400 },
      );
    }

    if (sourceUrl) {
      try {
        const parsedSourceUrl = new URL(sourceUrl);
        if (!["http:", "https:"].includes(parsedSourceUrl.protocol))
          throw new Error();
      } catch {
        return NextResponse.json(
          { message: "Source URL must be a valid HTTP or HTTPS URL." },
          { status: 400 },
        );
      }
    }

    // Validate ImageKit metadata
    if (
      !isValidProductImage({
        url: imageUrl,
        fileId: submittedFileId,
        filePath: imageKitFilePath,
      })
    ) {
      return NextResponse.json(
        { message: "Invalid ImageKit image information." },
        { status: 400 },
      );
    }

    imageKitFileId = submittedFileId;

    // Save product in database
    const id = await createProduct({
      name,
      description,
      imageUrl,
      imageKitFileId: imageKitFileId || null,
      imageKitFilePath: imageKitFilePath || null,
      sourceUrl,
      slug,
      sku,
      status,
      prices,
    });

    return NextResponse.json(
      {
        id,
        message: "Product added successfully.",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create product error:", error);

    const code =
      isRecord(error) && typeof error.code === "string"
        ? error.code
        : undefined;

    // Remove newly uploaded ImageKit file if DB save failed
    if (imageKitFileId) {
      try {
        await deleteImageKitFile(imageKitFileId);
      } catch (cleanupError) {
        console.error("ImageKit cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message:
          error instanceof ProductValidationError
            ? error.message
            : code === "ER_DUP_ENTRY"
              ? "Slug or SKU already exists."
              : "Unable to save product.",
      },
      {
        status:
          error instanceof ProductValidationError
            ? 400
            : code === "ER_DUP_ENTRY"
              ? 409
              : 500,
      },
    );
  }
}
