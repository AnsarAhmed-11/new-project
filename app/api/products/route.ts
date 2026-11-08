import { NextResponse } from "next/server";
import { getProducts } from "@/app/models/product.model.js";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ data: products }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ message: "Unable to load products." }, { status: 500 });
  }
}
