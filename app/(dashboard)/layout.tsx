import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/auth";
import { ensureCsrfToken } from "@/lib/csrf";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSession();
  await ensureCsrfToken();

  return (
    <DashboardShell role={session.role} name={session.name}>
      {children}
    </DashboardShell>
  );
}
