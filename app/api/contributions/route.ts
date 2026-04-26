import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { addAuditEntry, addContribution, getDashboardMetrics, listContributions } from "@/lib/store";
import { contributionSchema } from "@/lib/validation";

export async function GET() {
  await requireRole(["ADMIN", "MANAGER", "MEMBER"]);
  return NextResponse.json({
    items: await listContributions(),
    metrics: await getDashboardMetrics(),
  });
}

export async function POST(request: Request) {
  const session = await requireRole(["ADMIN", "MANAGER"]);
  await assertCsrf(request);

  const body = await request.json();
  const result = contributionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Paiement invalide." }, { status: 400 });
  }

  const record = await addContribution({
    ...result.data,
    recordedBy: session.name,
  });

  await addAuditEntry({
    actor: session.name,
    action: "Enregistrement cotisation",
    entity: "contribution",
    entityLabel: record.receiptNumber,
    ip: "127.0.0.1",
    details: `Paiement ${record.amount} XOF pour ${record.memberId}.`,
  });

  return NextResponse.json({ item: record }, { status: 201 });
}
