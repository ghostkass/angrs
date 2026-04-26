import { NextResponse } from "next/server";

import { clearSessionOnResponse } from "@/lib/auth";

export async function POST() {
  return clearSessionOnResponse(NextResponse.json({ success: true }));
}
