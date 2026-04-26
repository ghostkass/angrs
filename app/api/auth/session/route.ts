import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getSession } from "@/lib/auth";
import { CSRF_COOKIE_NAME } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  const csrfToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? null;
  return NextResponse.json({ session, csrfToken });
}
