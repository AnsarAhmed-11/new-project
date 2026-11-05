import { NextResponse } from "next/server";
import { createEnquiry } from "@/app/models/enquiryModel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, product, message, phone, company } = body;

    if (
      !name ||
      !email ||
      !product ||
      !phone ||
      !message ||
      !/^\S+@\S+\.\S+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 },
      );
    }

    const result=await createEnquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      product: product.trim(),
      phone: phone.trim(),
      message: message.trim(),
      company: company?.trim(),
    });
    console.log(result);
    
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
