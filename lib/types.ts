export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export type ContributionStatus = "PAID" | "OVERDUE" | "PENDING";
export type SocialOperationType =
  | "MEDICAL"
  | "FINANCIAL"
  | "SOCIAL"
  | "EMERGENCY"
  | "DEATH"
  | "EXCEPTIONAL";
export type SocialOperationStatus = "IN_PROGRESS" | "VALIDATED" | "REJECTED";
export type DocumentCategory = "ADMINISTRATIVE" | "MEDICAL" | "PROOF";
export type DocumentAccess = "ADMIN_ONLY" | "MANAGER" | "MEMBER";

export type Member = {
  id: string;
  cardNumber: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  functionTitle: string;
  grade: string;
  birthDate: string;
  phone: string;
  address: string;
  retirementDate: string;
  monthlyContributionTarget: number;
  qrValue: string;
  createdAt: string;
};

export type Contribution = {
  id: string;
  memberId: string;
  year: number;
  month: number;
  amount: number;
  status: ContributionStatus;
  paidAt: string | null;
  receiptNumber: string;
  recordedBy: string;
};

export type DocumentRecord = {
  id: string;
  memberId: string;
  title: string;
  category: DocumentCategory;
  mimeType: string;
  size: number;
  storagePath: string;
  uploadedAt: string;
  accessLevel: DocumentAccess;
  uploadedBy: string;
};

export type SocialOperation = {
  id: string;
  memberId: string;
  type: SocialOperationType;
  description: string;
  amount: number | null;
  date: string;
  status: SocialOperationStatus;
  createdBy: string;
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityLabel: string;
  timestamp: string;
  ip: string;
  details?: string;
};

export type AppSettings = {
  monthlyContributionAmount: number;
  fiscalYear: number;
};

export type SessionUser = {
  sub: string;
  email: string;
  name: string;
  role: Role;
  memberId?: string;
};

export type DashboardMetrics = {
  totalMembers: number;
  monthlyCollected: number;
  yearlyCollected: number;
  membersUpToDate: number;
  membersLate: number;
  socialBudget: number;
  alerts: Array<{
    id: string;
    label: string;
    severity: "high" | "medium" | "low";
  }>;
  contributionTrend: Array<{
    month: string;
    total: number;
  }>;
  aidBreakdown: Array<{
    label: string;
    value: number;
  }>;
};

export type MemberDetail = {
  member: Member;
  contributions: Contribution[];
  documents: DocumentRecord[];
  operations: SocialOperation[];
};
