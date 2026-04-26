import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

import { CSRF_COOKIE_NAME } from "@/lib/constants";

export async function getCsrfToken() {
  return (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? "";
}

export async function ensureCsrfToken() {
  const jar = await cookies();
  const existing = jar.get(CSRF_COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }

  const token = randomUUID();
  jar.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return token;
}

export async function assertCsrf(request: Request) {
  const headerValue = request.headers.get("x-csrf-token");
  const token = await getCsrfToken();
  if (!headerValue || !token || headerValue !== token) {
    throw new Error("Jeton CSRF invalide.");
  }
}
