import { insertUser, findUserByEmail } from "@/app/api/auth/user-model";

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2) {
    return Response.json({ message: "Please enter your full name." }, { status: 400 });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ message: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (await findUserByEmail(email)) {
    return Response.json({ message: "An account with this email already exists." }, { status: 409 });
  }

  let user;

  try {
    user = await insertUser(name, email, password);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ER_DUP_ENTRY") {
      return Response.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    throw error;
  }

  return Response.json(
    { message: "Account created successfully.", user: { name: user.name, email: user.email } },
    { status: 201 },
  );
}
