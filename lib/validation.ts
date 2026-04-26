import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const memberSchema = z.object({
  cardNumber: z.string().min(4),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  functionTitle: z.string().min(2),
  grade: z.string().min(2),
  birthDate: z.string().min(4),
  phone: z.string().min(7),
  address: z.string().min(4),
  retirementDate: z.string().min(4),
});

export const contributionSchema = z.object({
  memberId: z.string().min(1),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  amount: z.number().positive(),
});

export const socialOperationSchema = z.object({
  memberId: z.string().min(1),
  type: z.enum(["MEDICAL", "FINANCIAL", "SOCIAL", "EMERGENCY", "DEATH", "EXCEPTIONAL"]),
  description: z.string().min(8),
  amount: z.number().nullable(),
  date: z.string().min(4),
  status: z.enum(["IN_PROGRESS", "VALIDATED", "REJECTED"]),
});

export const documentSchema = z.object({
  memberId: z.string().min(1),
  title: z.string().min(2),
  category: z.enum(["ADMINISTRATIVE", "MEDICAL", "PROOF"]),
  accessLevel: z.enum(["ADMIN_ONLY", "MANAGER", "MEMBER"]),
});
