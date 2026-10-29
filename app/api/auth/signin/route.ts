import { verifyPassword } from "@/app/api/auth/password";
import { findUserByEmail } from "@/app/api/auth/user-model";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return Response.json({ message: "Invalid email or password." }, { status: 401 });
  }

  return Response.json({
    message: "Signed in successfully.",
    user: { name: user.name, email: user.email },
  });
}
