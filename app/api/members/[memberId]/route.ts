import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { addAuditEntry, deleteMember, getMember, upsertMember } from "@/lib/store";
import { saveUpload } from "@/lib/storage";
import { memberSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  await requireRole(["ADMIN", "MANAGER", "MEMBER"]);
  const { memberId } = await params;
  const member = await getMember(memberId);
  if (!member) {
    return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  }

  return NextResponse.json({ item: member });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const session = await requireRole(["ADMIN", "MANAGER"]);
  await assertCsrf(request);
  const { memberId } = await params;
  const existing = await getMember(memberId);
  if (!existing) {
    return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  }

  const formData = await request.formData();
  const raw = {
    cardNumber: String(formData.get("cardNumber") ?? existing.cardNumber),
    firstName: String(formData.get("firstName") ?? existing.firstName),
    lastName: String(formData.get("lastName") ?? existing.lastName),
    functionTitle: String(formData.get("functionTitle") ?? existing.functionTitle),
    grade: String(formData.get("grade") ?? existing.grade),
    birthDate: String(formData.get("birthDate") ?? existing.birthDate),
    phone: String(formData.get("phone") ?? existing.phone),
    address: String(formData.get("address") ?? existing.address),
    retirementDate: String(formData.get("retirementDate") ?? existing.retirementDate),
  };

  const result = memberSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ error: "Champs membre invalides." }, { status: 400 });
  }

  const photoFile = formData.get("photo");
  let photoUrl = existing.photoUrl;
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = (await saveUpload(photoFile, "photos")).relativePath;
  }

  const record = await upsertMember({ id: memberId, ...result.data, photoUrl });
  await addAuditEntry({
    actor: session.name,
    action: "Mise a jour membre",
    entity: "member",
    entityLabel: record.cardNumber,
    ip: "127.0.0.1",
    details: `Fiche mise a jour pour ${record.firstName} ${record.lastName}.`,
  });

  return NextResponse.json({ item: record });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const session = await requireRole(["ADMIN"]);
  await assertCsrf(request);

  const { memberId } = await params;
  const existing = await getMember(memberId);
  if (!existing) {
    return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  }

  await deleteMember(memberId);
  await addAuditEntry({
    actor: session.name,
    action: "Suppression membre",
    entity: "member",
    entityLabel: existing.cardNumber,
    ip: "127.0.0.1",
    details: `Suppression de ${existing.firstName} ${existing.lastName}.`,
  });

  return NextResponse.json({ success: true });
}
