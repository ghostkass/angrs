import { cookies } from "next/headers";

import { MembersWorkspace } from "@/components/members-workspace";
import { requireSession } from "@/lib/auth";
import { CSRF_COOKIE_NAME } from "@/lib/constants";
import { listMembers } from "@/lib/store";

export default async function MembersPage() {
  const session = await requireSession();
  const csrfToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? "";
  return (
    <MembersWorkspace
      members={await listMembers()}
      csrfToken={csrfToken}
      role={session.role}
    />
  );
}
