
  import { NextResponse } from "next/server";
  import { getAdmin } from "@/app/lib/auth";
  import {
    deleteImageKitFile,
    isValidProductImage,
  } from "@/app/lib/imagekitServer";
  import {
    deleteProduct,
    getProductById,
    updateProduct,
  } from "@/app/models/product.model.js";

  type Context = {
    params: Promise<{ id: string }>;
  };

  async function idOf(context: Context) {
    const id = Number((await context.params).id);

    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function parsePrices(value: FormDataEntryValue | null) {
    if (value === null) return [];
    const parsed: unknown = JSON.parse(String(value));
    if (!Array.isArray(parsed)) throw new Error("Prices must be an array.");
    const seen = new Set<string>();
    return parsed.map((entry) => {
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
  }

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  export async function GET(_request: Request, context: Context) {
    if (!(await getAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = await idOf(context);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID." },
        { status: 400 },
      );
    }

    try {
      const product = await getProductById(id);

      return product
        ? NextResponse.json({ data: product })
        : NextResponse.json(
            { message: "Product not found." },
            { status: 404 },
          );
    } catch {
      return NextResponse.json(
        { message: "Unable to load product." },
        { status: 500 },
      );
    }
  }

  export async function PUT(request: Request, context: Context) {
    if (!(await getAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = await idOf(context);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID." },
        { status: 400 },
      );
    }

    let newFileId: string | null = null;

    try {
      const existing = await getProductById(id);

      if (!existing) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 404 },
        );
      }

      const formData = await request.formData();

      const name = String(formData.get("name") || "").trim();
      const slug = slugify(String(formData.get("slug") || name));
      const sku = String(formData.get("sku") || "").trim();
      const status = String(formData.get("status") || "inStock");

      if (
        !name ||
        name.length > 160 ||
        !slug ||
        slug.length > 180 ||
        !sku ||
        sku.length > 80 ||
        status !== "inStock" &&
        status !== "outOfStock"
      ) {
        return NextResponse.json(
          { message: "Valid name, slug, SKU, and status are required." },
          { status: 400 },
        );
      }

      const imageUrl = String(formData.get("imageUrl") || "").trim();
      const imageKitFileId = String(
        formData.get("imageKitFileId") || "",
      ).trim();
      const imageKitFilePath = String(
        formData.get("imageKitFilePath") || "",
      ).trim();

      const hasImageData =
        Boolean(imageUrl) ||
        Boolean(imageKitFileId) ||
        Boolean(imageKitFilePath);

      if (
        hasImageData &&
        !isValidProductImage({
          url: imageUrl,
          fileId: imageKitFileId,
          filePath: imageKitFilePath,
        })
      ) {
        return NextResponse.json(
          { message: "Invalid ImageKit product image information." },
          { status: 400 },
        );
      }

      let prices;
      try {
        prices = parsePrices(formData.get("prices"));
      } catch (error) {
        return NextResponse.json(
          { message: error instanceof Error ? error.message : "Invalid prices." },
          { status: 400 },
        );
      }

      if (hasImageData) {
        newFileId = imageKitFileId;
      }

      const sourceUrl = String(formData.get("sourceUrl") || "").trim();
      if (sourceUrl) {
        try {
          const parsedSourceUrl = new URL(sourceUrl);
          if (!["http:", "https:"].includes(parsedSourceUrl.protocol)) throw new Error();
        } catch {
          return NextResponse.json(
            { message: "Source URL must be a valid HTTP or HTTPS URL." },
            { status: 400 },
          );
        }
      }

      const updated = await updateProduct(id, {
        name,
        slug,
        sku,
        status,
        description: String(
          formData.get("description") || "",
        ).trim(),
        sourceUrl,
        imageUrl: hasImageData ? imageUrl : undefined,
        imageKitFileId: hasImageData ? imageKitFileId : undefined,
        imageKitFilePath: hasImageData ? imageKitFilePath : undefined,
        prices,
      });

      if (!updated) {
        throw new Error("PRODUCT_UPDATE_FAILED");
      }

      // Database is updated. Now remove the previous ImageKit image.
      if (
        hasImageData &&
        existing.imageKitFileId &&
        existing.imageKitFileId !== imageKitFileId &&
        isValidProductImage({
          url: existing.imageUrl,
          fileId: existing.imageKitFileId,
          filePath: existing.imageKitFilePath,
        })
      ) {
        try {
          await deleteImageKitFile(existing.imageKitFileId);
        } catch (error) {
          // Product update succeeded; old image cleanup can be retried.
          console.error("Old ImageKit image cleanup failed:", error);
        }
      }

      newFileId = null;

      return NextResponse.json({
        message: "Product updated successfully.",
      });
    } catch (error: unknown) {
      // If the database update fails, clean up the newly uploaded image.
      if (newFileId) {
        try {
          await deleteImageKitFile(newFileId);
        } catch (cleanupError) {
          console.error(
            "New ImageKit image cleanup failed:",
            cleanupError,
          );
        }
      }

      const code = isRecord(error) && typeof error.code === "string" ? error.code : undefined;

      return NextResponse.json(
        {
          message:
            code === "ER_DUP_ENTRY"
              ? "Slug or SKU already exists."
              : "Unable to update product.",
        },
        { status: code === "ER_DUP_ENTRY" ? 409 : 500 },
      );
    }
  }

  export async function DELETE(
    _request: Request,
    context: Context,
  ) {
    if (!(await getAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = await idOf(context);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID." },
        { status: 400 },
      );
    }

    try {
      const existing = await getProductById(id);

      if (!existing) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 404 },
        );
      }

      const deleted = await deleteProduct(id);

      if (!deleted) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 404 },
        );
      }

      // Delete the cloud image only after the database deletion succeeds.
      if (
        existing.imageKitFileId &&
        isValidProductImage({
          url: existing.imageUrl,
          fileId: existing.imageKitFileId,
          filePath: existing.imageKitFilePath,
        })
      ) {
        try {
          await deleteImageKitFile(existing.imageKitFileId);
        } catch (error) {
          console.error(
            "Deleted product image cleanup failed:",
            error,
          );

          return NextResponse.json({
            message: "Product deleted, but ImageKit cleanup needs retry.",
            cleanupPending: true,
          });
        }
      }

      return NextResponse.json({
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Product deletion error:", error);

      return NextResponse.json(
        { message: "Unable to delete product." },
        { status: 500 },
      );
    }
  }
