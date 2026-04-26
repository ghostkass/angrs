import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { addAuditEntry, addSocialOperation, listSocialOperations } from "@/lib/store";
import { socialOperationSchema } from "@/lib/validation";

export async function GET() {
  await requireRole(["ADMIN", "MANAGER"]);
  return NextResponse.json({ items: await listSocialOperations() });
}

export async function POST(request: Request) {
  const session = await requireRole(["ADMIN", "MANAGER"]);
  await assertCsrf(request);

  const body = await request.json();
  const result = socialOperationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Operation sociale invalide." }, { status: 400 });
  }

  const record = await addSocialOperation({
    ...result.data,
    createdBy: session.name,
  });

  await addAuditEntry({
    actor: session.name,
    action: "Creation operation sociale",
    entity: "social_operation",
    entityLabel: record.id,
    ip: "127.0.0.1",
    details: `${record.type} pour ${record.memberId}.`,
  });

  return NextResponse.json({ item: record }, { status: 201 });
}
