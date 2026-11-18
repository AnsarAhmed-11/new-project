
import { NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { requireAdmin } from "@/app/lib/auth";

export async function GET() {
  try {
    // Only authenticated admins can upload
    await requireAdmin();

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      throw new Error("ImageKit credentials are missing");
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
      expire: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
          { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ImageKit authentication error:", error);

    return NextResponse.json(
      { message: "Unable to authorize ImageKit upload" },
      { status: 500 }
    );
  }
}
