import { prisma } from "@/lib/prisma";
import { monthLabels, socialOperationLabels } from "@/lib/constants";
import type {
  AppSettings,
  AuditLog,
  Contribution,
  DashboardMetrics,
  DocumentRecord,
  Member,
  MemberDetail,
  SocialOperation,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers : serialise Prisma rows to the app-level types            */
/* ------------------------------------------------------------------ */

function toMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    cardNumber: row.cardNumber as string,
    photoUrl: (row.photoUrl as string) ?? null,
    firstName: row.firstName as string,
    lastName: row.lastName as string,
    functionTitle: row.functionTitle as string,
    grade: row.grade as string,
    birthDate:
      row.birthDate instanceof Date
        ? row.birthDate.toISOString().slice(0, 10)
        : String(row.birthDate),
    phone: row.phone as string,
    address: row.address as string,
    retirementDate:
      row.retirementDate instanceof Date
        ? row.retirementDate.toISOString().slice(0, 10)
        : String(row.retirementDate),
    monthlyContributionTarget: row.monthlyContributionTarget as number,
    qrValue: row.qrValue as string,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  };
}

function toContribution(row: Record<string, unknown>): Contribution {
  return {
    id: row.id as string,
    memberId: row.memberId as string,
    year: row.year as number,
    month: row.month as number,
    amount: row.amount as number,
    status: row.status as Contribution["status"],
    paidAt: row.paidAt instanceof Date ? row.paidAt.toISOString() : (row.paidAt as string | null),
    receiptNumber: row.receiptNumber as string,
    recordedBy: row.recordedBy as string,
  };
}

function toDocument(row: Record<string, unknown>): DocumentRecord {
  return {
    id: row.id as string,
    memberId: row.memberId as string,
    title: row.title as string,
    category: row.category as DocumentRecord["category"],
    mimeType: row.mimeType as string,
    size: row.size as number,
    storagePath: row.storagePath as string,
    uploadedAt:
      row.uploadedAt instanceof Date
        ? row.uploadedAt.toISOString()
        : String(row.uploadedAt),
    accessLevel: row.accessLevel as DocumentRecord["accessLevel"],
    uploadedBy: row.uploadedBy as string,
  };
}

function toSocialOperation(row: Record<string, unknown>): SocialOperation {
  return {
    id: row.id as string,
    memberId: row.memberId as string,
    type: row.type as SocialOperation["type"],
    description: row.description as string,
    amount: (row.amount as number) ?? null,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date),
    status: row.status as SocialOperation["status"],
    createdBy: row.createdBy as string,
  };
}

function toAuditLog(row: Record<string, unknown>): AuditLog {
  return {
    id: row.id as string,
    actor: row.actor as string,
    action: row.action as string,
    entity: row.entity as string,
    entityLabel: row.entityLabel as string,
    timestamp:
      row.timestamp instanceof Date
        ? row.timestamp.toISOString()
        : String(row.timestamp),
    ip: row.ip as string,
    details: (row.details as string) ?? undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Members                                                           */
/* ------------------------------------------------------------------ */

export async function listMembers(): Promise<Member[]> {
  const rows = await prisma.member.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  return rows.map((r) => toMember(r as unknown as Record<string, unknown>));
}

export async function getMember(memberId: string): Promise<Member | null> {
  const row = await prisma.member.findUnique({ where: { id: memberId } });
  return row ? toMember(row as unknown as Record<string, unknown>) : null;
}

export async function getMemberDetail(memberId: string): Promise<MemberDetail | null> {
  const row = await prisma.member.findUnique({
    where: { id: memberId },
    include: { contributions: true, documents: true, socialOperations: true },
  });
  if (!row) return null;

  return {
    member: toMember(row as unknown as Record<string, unknown>),
    contributions: row.contributions.map((c) =>
      toContribution(c as unknown as Record<string, unknown>),
    ),
    documents: row.documents.map((d) =>
      toDocument(d as unknown as Record<string, unknown>),
    ),
    operations: row.socialOperations.map((s) =>
      toSocialOperation(s as unknown as Record<string, unknown>),
    ),
  };
}

export async function upsertMember(
  member: Omit<Member, "id" | "createdAt" | "qrValue" | "monthlyContributionTarget"> & {
    id?: string;
    monthlyContributionTarget?: number;
  },
): Promise<Member> {
  const qrValue = `ANGRS|${member.cardNumber}|${member.firstName.toUpperCase()} ${member.lastName.toUpperCase()}`;

  if (member.id) {
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        cardNumber: member.cardNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        functionTitle: member.functionTitle,
        grade: member.grade,
        birthDate: new Date(member.birthDate),
        phone: member.phone,
        address: member.address,
        retirementDate: new Date(member.retirementDate),
        photoUrl: member.photoUrl,
        monthlyContributionTarget: member.monthlyContributionTarget,
        qrValue,
      },
    });
    return toMember(updated as unknown as Record<string, unknown>);
  }

  const settings = await getSettings();
  const created = await prisma.member.create({
    data: {
      cardNumber: member.cardNumber,
      firstName: member.firstName,
      lastName: member.lastName,
      functionTitle: member.functionTitle,
      grade: member.grade,
      birthDate: new Date(member.birthDate),
      phone: member.phone,
      address: member.address,
      retirementDate: new Date(member.retirementDate),
      photoUrl: member.photoUrl ?? null,
      monthlyContributionTarget:
        member.monthlyContributionTarget ?? settings.monthlyContributionAmount,
      qrValue,
    },
  });
  return toMember(created as unknown as Record<string, unknown>);
}

export async function deleteMember(memberId: string): Promise<void> {
  await prisma.member.delete({ where: { id: memberId } });
}

/* ------------------------------------------------------------------ */
/*  Contributions                                                     */
/* ------------------------------------------------------------------ */

export async function listContributions(): Promise<Contribution[]> {
  const rows = await prisma.contribution.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
  return rows.map((r) => toContribution(r as unknown as Record<string, unknown>));
}

export async function addContribution(
  input: Omit<Contribution, "id" | "receiptNumber" | "status" | "paidAt">,
): Promise<Contribution> {
  const receiptNumber = `RCT-${input.year}-${String(input.month).padStart(2, "0")}-${input.memberId.slice(-3)}`;

  const row = await prisma.contribution.upsert({
    where: {
      memberId_year_month: {
        memberId: input.memberId,
        year: input.year,
        month: input.month,
      },
    },
    update: {
      amount: input.amount,
      status: "PAID",
      paidAt: new Date(),
      receiptNumber,
      recordedBy: input.recordedBy,
    },
    create: {
      memberId: input.memberId,
      year: input.year,
      month: input.month,
      amount: input.amount,
      status: "PAID",
      paidAt: new Date(),
      receiptNumber,
      recordedBy: input.recordedBy,
    },
  });
  return toContribution(row as unknown as Record<string, unknown>);
}

/* ------------------------------------------------------------------ */
/*  Documents                                                         */
/* ------------------------------------------------------------------ */

export async function listDocuments(): Promise<DocumentRecord[]> {
  const rows = await prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  return rows.map((r) => toDocument(r as unknown as Record<string, unknown>));
}

export async function addDocument(
  document: Omit<DocumentRecord, "id" | "uploadedAt">,
): Promise<DocumentRecord> {
  const row = await prisma.document.create({ data: document });
  return toDocument(row as unknown as Record<string, unknown>);
}

/* ------------------------------------------------------------------ */
/*  Social operations                                                 */
/* ------------------------------------------------------------------ */

export async function listSocialOperations(): Promise<SocialOperation[]> {
  const rows = await prisma.socialOperation.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map((r) => toSocialOperation(r as unknown as Record<string, unknown>));
}

export async function addSocialOperation(
  operation: Omit<SocialOperation, "id">,
): Promise<SocialOperation> {
  const row = await prisma.socialOperation.create({
    data: {
      memberId: operation.memberId,
      type: operation.type,
      description: operation.description,
      amount: operation.amount,
      date: new Date(operation.date),
      status: operation.status,
      createdBy: operation.createdBy,
    },
  });
  return toSocialOperation(row as unknown as Record<string, unknown>);
}

/* ------------------------------------------------------------------ */
/*  Audit                                                             */
/* ------------------------------------------------------------------ */

export async function addAuditEntry(
  entry: Omit<AuditLog, "id" | "timestamp">,
): Promise<AuditLog> {
  const row = await prisma.auditLog.create({ data: entry });
  return toAuditLog(row as unknown as Record<string, unknown>);
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 8,
  });
  return rows.map((r) => toAuditLog(r as unknown as Record<string, unknown>));
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const settings = await getSettings();
  const fiscalYear = settings.fiscalYear;
  const currentMonth = new Date().getMonth() + 1;

  const [
    totalMembers,
    monthlyContribs,
    yearlyContribs,
    paidThisMonth,
    socialOps,
    allMembers,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.contribution.findMany({
      where: { year: fiscalYear, month: currentMonth },
    }),
    prisma.contribution.findMany({ where: { year: fiscalYear } }),
    prisma.contribution.findMany({
      where: { year: fiscalYear, month: currentMonth, status: "PAID" },
      select: { memberId: true },
    }),
    prisma.socialOperation.findMany(),
    prisma.member.findMany({ select: { id: true } }),
  ]);

  const monthlyCollected = monthlyContribs.reduce((sum, c) => sum + c.amount, 0);
  const yearlyCollected = yearlyContribs.reduce((sum, c) => sum + c.amount, 0);
  const paidMemberIds = new Set(paidThisMonth.map((c) => c.memberId));
  const membersUpToDate = allMembers.filter((m) => paidMemberIds.has(m.id)).length;
  const membersLate = totalMembers - membersUpToDate;
  const socialBudget = socialOps
    .filter((o) => o.status === "VALIDATED")
    .reduce((sum, o) => sum + (o.amount ?? 0), 0);

  const contributionTrend = monthLabels.map((month, index) => ({
    month,
    total: yearlyContribs
      .filter((c) => c.month === index + 1)
      .reduce((sum, c) => sum + c.amount, 0),
  }));

  const aidBreakdown = Object.entries(socialOperationLabels).map(([value, label]) => ({
    label,
    value: socialOps
      .filter((o) => o.type === value && o.status !== "REJECTED")
      .reduce((sum, o) => sum + (o.amount ?? 0), 0),
  }));

  return {
    totalMembers,
    monthlyCollected,
    yearlyCollected,
    membersUpToDate,
    membersLate,
    socialBudget,
    alerts: [
      {
        id: "alert-1",
        label: `${membersLate} membres accusent un retard sur la cotisation du mois.`,
        severity: "high",
      },
      {
        id: "alert-2",
        label: "2 dossiers medicaux ne sont visibles que par l'administration.",
        severity: "medium",
      },
      {
        id: "alert-3",
        label: "Le dernier export de sauvegarde remonte a cette semaine.",
        severity: "low",
      },
    ],
    contributionTrend,
    aidBreakdown,
  };
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export async function exportMembers() {
  const members = await listMembers();
  return members.map((member) => ({
    Carte: member.cardNumber,
    Prenom: member.firstName,
    Nom: member.lastName,
    Grade: member.grade,
    Fonction: member.functionTitle,
    Telephone: member.phone,
    Adresse: member.address,
    Retraite: member.retirementDate,
  }));
}

/* ------------------------------------------------------------------ */
/*  Settings                                                          */
/* ------------------------------------------------------------------ */

export async function getSettings(): Promise<AppSettings> {
  const row = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  if (!row) {
    return { monthlyContributionAmount: 5000, fiscalYear: 2026 };
  }
  return {
    monthlyContributionAmount: row.monthlyContributionAmount,
    fiscalYear: row.fiscalYear,
  };
}
