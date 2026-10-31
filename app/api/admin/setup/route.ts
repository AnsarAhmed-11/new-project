import { NextResponse } from "next/server";
import { createInitialAdmin } from "@/app/models/adminModel";
export async function POST(request: Request) {
  if (!process.env.ADMIN_SETUP_TOKEN || request.headers.get("x-setup-token") !== process.env.ADMIN_SETUP_TOKEN)
    return NextResponse.json(
      { message: "Not found" },
      { status: 404 });
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
    return NextResponse.json(
      { message: "ADMIN_EMAIL and ADMIN_PASSWORD are required." },
      { status: 500 });
  try {
    const id = await createInitialAdmin(process.env.ADMIN_NAME || "Merciful Tools Admin", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    return NextResponse.json(
      { id },
      { status: 201 });
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code; 
    return NextResponse.json(
      { message: code === "ER_DUP_ENTRY" ? "Admin already exists." : "Unable to create admin." },
       { status: code === "ER_DUP_ENTRY" ? 409 : 500 });
  }
}
