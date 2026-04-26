import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { addAuditEntry, addDocument, listDocuments } from "@/lib/store";
import { saveUpload } from "@/lib/storage";
import { documentSchema } from "@/lib/validation";

export async function GET() {
  await requireRole(["ADMIN", "MANAGER", "MEMBER"]);
  return NextResponse.json({ items: await listDocuments() });
}

export async function POST(request: Request) {
  const session = await requireRole(["ADMIN", "MANAGER"]);
  await assertCsrf(request);
  const formData = await request.formData();

  const raw = {
    memberId: String(formData.get("memberId") ?? ""),
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    accessLevel: String(formData.get("accessLevel") ?? ""),
  };
  const result = documentSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ error: "Metadonnees document invalides." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  const upload = await saveUpload(file, "documents");
  const record = await addDocument({
    ...result.data,
    mimeType: file.type || "application/octet-stream",
    size: upload.size,
    storagePath: upload.relativePath,
    uploadedBy: session.name,
  });

  await addAuditEntry({
    actor: session.name,
    action: "Upload document",
    entity: "document",
    entityLabel: record.title,
    ip: "127.0.0.1",
    details: `Document rattache au membre ${record.memberId}.`,
  });

  return NextResponse.json({ item: record }, { status: 201 });
}
