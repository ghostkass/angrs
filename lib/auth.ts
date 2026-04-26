import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import type { NextResponse } from "next/server";
import { compareSync } from "bcryptjs";

import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import type { Role, SessionUser } from "@/lib/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "angrs-development-secret-change-me",
);

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionUser;
}

export async function getSession() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireSession();
  if (!allowedRoles.includes(session.role)) {
    redirect("/dashboard");
  }
  return session;
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !compareSync(password, user.password)) {
    return null;
  }

  return {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    memberId: user.memberId ?? undefined,
  };
}

export async function setSessionCookies(user: SessionUser) {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  jar.set(CSRF_COOKIE_NAME, randomUUID(), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function appendSessionCookies(response: NextResponse, user: SessionUser) {
  const token = await signSession(user);
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  response.cookies.set(CSRF_COOKIE_NAME, randomUUID(), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE_NAME);
  jar.delete(CSRF_COOKIE_NAME);
}

export function clearSessionOnResponse(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(CSRF_COOKIE_NAME);
  return response;
}
