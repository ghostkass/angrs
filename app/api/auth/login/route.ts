import { NextResponse } from "next/server";

import { appendSessionCookies, authenticate } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
  }

  const user = await authenticate(result.data.email, result.data.password);
  if (!user) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  const redirectTo = new URL(request.url).searchParams.get("redirect");
  const response = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 })
    : NextResponse.json({ user });

  return appendSessionCookies(response, user);
}
