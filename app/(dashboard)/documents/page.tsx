import { cookies } from "next/headers";

import { DocumentsWorkspace } from "@/components/documents-workspace";
import { requireRole } from "@/lib/auth";
import { CSRF_COOKIE_NAME } from "@/lib/constants";
import { listDocuments, listMembers } from "@/lib/store";

export default async function DocumentsPage() {
  await requireRole(["ADMIN", "MANAGER", "MEMBER"]);
  const csrfToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? "";
  return (
    <DocumentsWorkspace
      documents={await listDocuments()}
      members={await listMembers()}
      csrfToken={csrfToken}
    />
  );
}
