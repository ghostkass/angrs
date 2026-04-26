import { requireRole } from "@/lib/auth";
import { getUsers } from "./actions";
import { UsersWorkspace } from "@/components/users-workspace";

export default async function UsersPage() {
  await requireRole(["ADMIN"]);
  const users = await getUsers();

  return (
    <UsersWorkspace users={users} />
  );
}
