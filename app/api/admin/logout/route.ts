import { NextResponse } from "next/server";
import { clearAdminSession } from "@/app/lib/auth";
export async function POST() { await clearAdminSession(); return NextResponse.json({ ok: true }); }
