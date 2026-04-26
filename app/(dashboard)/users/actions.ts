"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { hashSync } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  await requireRole(["ADMIN"]);
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function createUser(data: any) {
  await requireRole(["ADMIN"]);
  const hashedPassword = hashSync(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role
    }
  });
  revalidatePath("/users");
}

export async function updateUser(id: string, data: any) {
  await requireRole(["ADMIN"]);
  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role
  };
  if (data.password) {
    updateData.password = hashSync(data.password, 10);
  }
  await prisma.user.update({
    where: { id },
    data: updateData
  });
  revalidatePath("/users");
}

export async function deleteUser(id: string) {
  await requireRole(["ADMIN"]);
  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
}
