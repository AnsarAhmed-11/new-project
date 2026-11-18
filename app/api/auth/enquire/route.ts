import { NextResponse } from "next/server";
import { createEnquiry } from "@/app/models/enquiryModel";
import { getProductById } from "@/app/models/product.model.js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, productId, message, phone, company } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !message ||
      !/^\S+@\S+\.\S+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 },
      );
    }

    const parsedProductId = productId == null || productId === "" ? null : Number(productId);
    if (parsedProductId !== null && (!Number.isSafeInteger(parsedProductId) || !(await getProductById(parsedProductId)))) {
      return NextResponse.json({ message: "The selected product could not be found." }, { status: 400 });
    }
    await createEnquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      productId: parsedProductId,
      phone: phone.trim(),
      message: message.trim(),
      company: company?.trim(),
    });
    return NextResponse.json(
      {
        message: "Enquiry submitted successfully!",
        status: "ok",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
