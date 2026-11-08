import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdmin } from "@/app/lib/auth";
import { createProduct, getProducts } from "@/app/models/product.model.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  if (!(await getAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ data: await getProducts() });
  } catch {
    return NextResponse.json(
      { message: "Unable to load products." },
      { status: 500 },
    );
  }
}
//save image 
export async function POST(request: Request) {
  if (!(await getAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();
    const slug = slugify(String(formData.get("slug") || name));
    const sku = String(formData.get("sku") || "").trim();
    const image = formData.get("image");
    if (!name)
      return NextResponse.json(
        { message: "Product name is required." },
        { status: 400 },
      );
    if (!(image instanceof File) || image.size === 0)
      return NextResponse.json(
        { message: "Product image is required." },
        { status: 400 },
      );
    if (!allowedTypes.has(image.type))
      return NextResponse.json(
        { message: "Use a JPG, PNG, or WebP image." },
        { status: 400 },
      );
    if (image.size > MAX_IMAGE_SIZE)
      return NextResponse.json(
        { message: "Image must be 5 MB or smaller." },
        { status: 400 },
      );

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
    );
    await mkdir(uploadDirectory, { recursive: true });
    const fileName = `${randomUUID()}${allowedTypes.get(image.type)}`;
    await writeFile(
      path.join(uploadDirectory, fileName),
      Buffer.from(await image.arrayBuffer()),
    );
    const id = await createProduct({
      name,
      description,
      imageUrl: `/uploads/products/${fileName}`,
      sourceUrl,
      slug,
      sku,
    });
    return NextResponse.json(
      { id, message: "Product added successfully." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to save product." },
      { status: 500 },
    );
  }
}
