import { NextResponse } from "next/server";

import { requireRole, requireSession } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { addAuditEntry, listMembers, upsertMember } from "@/lib/store";
import { saveUpload } from "@/lib/storage";
import { memberSchema } from "@/lib/validation";

export async function GET() {
  await requireSession();
  return NextResponse.json({ items: await listMembers() });
}

async function parseMemberForm(request: Request) {
  const formData = await request.formData();
  const raw = {
    cardNumber: String(formData.get("cardNumber") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    functionTitle: String(formData.get("functionTitle") ?? ""),
    grade: String(formData.get("grade") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    retirementDate: String(formData.get("retirementDate") ?? ""),
  };

  const result = memberSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Champs membre invalides." as const };
  }

  const photoFile = formData.get("photo");
  let photoUrl: string | null = null;
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = (await saveUpload(photoFile, "photos")).relativePath;
  }

  return { data: { ...result.data, photoUrl } };
}

export async function POST(request: Request) {
  const session = await requireRole(["ADMIN", "MANAGER"]);
  await assertCsrf(request);

  const parsed = await parseMemberForm(request);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const record = await upsertMember(parsed.data);
  await addAuditEntry({
    actor: session.name,
    action: "Creation membre",
    entity: "member",
    entityLabel: record.cardNumber,
    ip: "127.0.0.1",
    details: `${record.firstName} ${record.lastName} ajoute au registre.`,
  });

  return NextResponse.json({ item: record }, { status: 201 });
}
