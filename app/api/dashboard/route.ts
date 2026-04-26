import { NextResponse } from "next/server";

import { requireSession } from "@/lib/auth";
import { getDashboardMetrics, listAuditLogs } from "@/lib/store";

export async function GET() {
  await requireSession();
  return NextResponse.json({
    metrics: await getDashboardMetrics(),
    activities: await listAuditLogs(),
  });
}
