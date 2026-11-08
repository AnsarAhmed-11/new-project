import { NextResponse } from "next/server";
import { getProductBySlug } from "@/app/models/product.model.js";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    return NextResponse.json({ data: product }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ message: "Unable to load product." }, { status: 500 });
  }
}
