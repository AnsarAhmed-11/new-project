import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.email !== "string" || typeof body.password !== "string")
      return NextResponse.json({ message: "Email and password are required." },
        { status: 400 });
    const admin = await authenticateAdmin(body.email, body.password);
    if (!admin)
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }); return NextResponse.json({ admin });
  }
  catch {
    return NextResponse.json(
      { message: "Unable to sign in." },
      { status: 500 });
  }
}
