import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { getEnquiryStats } from "@/app/models/enquiryModel";
export async function GET() {
    try {
        await requireAdmin();
        return NextResponse.json(await getEnquiryStats());
    }
    catch (error) {
        return NextResponse.json(
            {
                message: error instanceof Error && error.message === "UNAUTHORIZED" ?
                    "Unauthorized" : "Unable to load statistics."
            },
            { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 });
    }
}
