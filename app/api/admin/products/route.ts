
import { NextResponse } from "next/server";
import { getAdmin } from "@/app/lib/auth";
import {
  createProduct,
  getProducts,
} from "@/app/models/product.model.js";
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

export async function GET() {
  if (!(await getAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    return NextResponse.json({
      data: await getProducts(),
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { message: "Unable to load products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
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

    const imageUrl = String(formData.get("imageUrl") || "").trim();
    imageKitFileId = String(
      formData.get("imageKitFileId") || ""
    ).trim();
    const imageKitFilePath = String(
      formData.get("imageKitFilePath") || ""
    ).trim();

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
        { status: 400 }
      );
    }

    if (!["inStock", "outOfStock"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid product status." },
        { status: 400 }
      );
    }

    // Validate ImageKit metadata
    if (
      !isValidProductImage({
        url: imageUrl,
        fileId: imageKitFileId,
        filePath: imageKitFilePath,
      })
    ) {
      return NextResponse.json(
        { message: "Invalid ImageKit image information." },
        { status: 400 }
      );
    }

    // Save product in database
    const id = await createProduct({
      name,
      description,
      imageUrl,
      imageKitFileId,
      imageKitFilePath,
      sourceUrl,
      slug,
      sku,
      status,
    });

    return NextResponse.json(
      {
        id,
        message: "Product added successfully.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create product error:", error);

    const code = (error as { code?: string })?.code;

    // Remove newly uploaded ImageKit file if DB save failed
    if (imageKitFileId) {
      try {
        await deleteImageKitFile(imageKitFileId);
      } catch (cleanupError) {
        console.error(
          "ImageKit cleanup failed:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        message:
          code === "ER_DUP_ENTRY"
            ? "Slug or SKU already exists."
            : "Unable to save product.",
      },
      {
        status: code === "ER_DUP_ENTRY" ? 409 : 500,
      }
    );
  }
}
