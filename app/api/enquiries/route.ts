
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import {
  createEnquiry,
  listEnquiries,
} from "@/app/models/enquiryModel";
import { getProductById } from "@/app/models/product.model.js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim();

    const productId =
      body.productId == null || body.productId === ""
        ? null
        : Number(body.productId);

    // Validate enquiry fields
    if (
      name.length < 2 ||
      name.length > 160 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone ||
      phone.length > 30 ||
      message.length < 10 ||
      message.length > 3000 ||
      company.length > 160
    ) {
      return NextResponse.json(
        { message: "Please provide valid enquiry details." },
        { status: 400 }
      );
    }

    // Validate selected product
    if (productId !== null) {
      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        return NextResponse.json(
          { message: "Invalid product selected." },
          { status: 400 }
        );
      }

      const product = await getProductById(productId);

      if (!product) {
        return NextResponse.json(
          { message: "The selected product could not be found." },
          { status: 400 }
        );
      }
    }

    // Save enquiry in database
    await createEnquiry({
      name,
      email,
      phone,
      message,
      company,
      productId,
    });

    return NextResponse.json(
      {
        message: "Enquiry submitted successfully!",
        status: "ok",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission failed:", error);

    return NextResponse.json(
      { message: "Unable to submit enquiry." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Admin authentication
    await requireAdmin();

    const url = new URL(request.url);

    // Pagination validation
    const rawPage = Number(url.searchParams.get("page"));
    const rawLimit = Number(url.searchParams.get("limit"));

    const page =
      Number.isSafeInteger(rawPage) && rawPage > 0
        ? rawPage
        : 1;

    const limit =
      Number.isSafeInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, 100)
        : 10;

    // Fetch enquiries
    const result = await listEnquiries({
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
      date: url.searchParams.get("date") || undefined,
      sort: url.searchParams.get("sort") || undefined,
      page,
      limit,
    });

    return NextResponse.json(
      { result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Unable to load enquiries:", error);

    return NextResponse.json(
      { message: "Unable to load enquiries." },
      { status: 500 }
    );
  }
}
