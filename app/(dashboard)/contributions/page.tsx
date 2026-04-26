import { cookies } from "next/headers";

import { ContributionsWorkspace } from "@/components/contributions-workspace";
import { requireRole } from "@/lib/auth";
import { CSRF_COOKIE_NAME } from "@/lib/constants";
import { getDashboardMetrics, listContributions, listMembers } from "@/lib/store";

export default async function ContributionsPage() {
  await requireRole(["ADMIN", "MANAGER", "MEMBER"]);
  const csrfToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? "";
  return (
    <ContributionsWorkspace
      contributions={await listContributions()}
      members={await listMembers()}
      metrics={await getDashboardMetrics()}
      csrfToken={csrfToken}
    />
  );
}
