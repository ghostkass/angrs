import { cookies } from "next/headers";

import { SocialWorkspace } from "@/components/social-workspace";
import { requireRole } from "@/lib/auth";
import { CSRF_COOKIE_NAME } from "@/lib/constants";
import { listMembers, listSocialOperations } from "@/lib/store";

export default async function SocialOperationsPage() {
  await requireRole(["ADMIN", "MANAGER"]);
  const csrfToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? "";
  return (
    <SocialWorkspace
      operations={await listSocialOperations()}
      members={await listMembers()}
      csrfToken={csrfToken}
    />
  );
}
