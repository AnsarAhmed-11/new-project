import { NextResponse } from "next/server";
import { createEnquiry } from "@/app/models/enquiryModel";

export async function POST(request) {
    try {
        const body = await request.json();

        // Destructure data
        const {
            name,
            email,
            product,
            message,
            phone,
            company,
        } = body;

        // Validation
        if (!name || !email || !product || !phone || !message || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { message: "Please fill all required fields" },
                { status: 400 }
            );
        }

        await createEnquiry({ name: name.trim(), email: email.trim().toLowerCase(), product: product.trim(), phone: phone.trim(), message: message.trim(), company: company?.trim() });
        return NextResponse.json(
            {
                message: "Enquiry submitted successfully!",
                status: "ok",
                status: "ok",
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("API Error:", err);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
