import Link from "next/link";
import { notFound } from "next/navigation";

import { MemberQr } from "@/components/member-qr";
import { StatusBadge } from "@/components/status-badge";
import { getMemberDetail, getSettings } from "@/lib/store";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const detail = await getMemberDetail(memberId);
  const settings = await getSettings();

  if (!detail) {
    notFound();
  }

  const paidMonths = new Set(
    detail.contributions
      .filter((entry) => entry.status === "PAID" && entry.year === settings.fiscalYear)
      .map((entry) => entry.month),
  );
  const totalContributions = detail.contributions.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="panel rounded-[32px] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--primary-soft)] text-2xl font-semibold text-[var(--primary)]">
                {detail.member.photoUrl ? (
                  <img
                    src={detail.member.photoUrl}
                    alt={`${detail.member.firstName} ${detail.member.lastName}`}
                    className="h-24 w-24 rounded-[28px] object-cover"
                  />
                ) : (
                  initials(detail.member.firstName, detail.member.lastName)
                )}
              </div>
              <div>
                <StatusBadge tone="green">{detail.member.cardNumber}</StatusBadge>
                <h1 className="mt-3 text-3xl font-semibold">
                  {detail.member.firstName} {detail.member.lastName}
                </h1>
                <p className="mt-2 text-[var(--muted)]">
                  {detail.member.grade} | {detail.member.functionTitle}
                </p>
              </div>
            </div>
            <Link
              href={`/members/${detail.member.id}/card`}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 font-semibold text-white"
            >
              Imprimer la carte
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Info label="Telephone" value={detail.member.phone} />
            <Info label="Date de naissance" value={formatDate(detail.member.birthDate)} />
            <Info label="Date de retraite" value={formatDate(detail.member.retirementDate)} />
            <Info label="Adresse" value={detail.member.address} />
            <Info label="Objectif mensuel" value={formatCurrency(detail.member.monthlyContributionTarget)} />
            <Info label="Total cotise" value={formatCurrency(totalContributions)} />
          </div>
        </article>

        <article className="panel flex items-center justify-center rounded-[32px] p-6">
          <div className="text-center">
            <MemberQr value={detail.member.qrValue} />
            <p className="mt-3 text-sm text-[var(--muted)]">QR code membre</p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="panel rounded-[32px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Calendrier annuel des cotisations</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Lecture mois par mois avec statut et montant cumule.
              </p>
            </div>
            <StatusBadge tone={paidMonths.size >= 4 ? "green" : "yellow"}>
              {paidMonths.size}/12
            </StatusBadge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1;
              const contribution = detail.contributions.find(
                (entry) => entry.year === settings.fiscalYear && entry.month === month,
              );
              const paid = paidMonths.has(month);
              return (
                <div
                  key={month}
                  className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Mois {month}</p>
                    <StatusBadge tone={paid ? "green" : "red"}>
                      {paid ? "Cotise" : "Non cotise"}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {contribution ? formatCurrency(contribution.amount) : formatCurrency(0)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {contribution?.paidAt ? formatDate(contribution.paidAt) : "En attente"}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <div className="space-y-6">
          <article className="panel rounded-[32px] p-6">
            <h2 className="text-xl font-semibold">Documents</h2>
            <div className="mt-4 space-y-3">
              {detail.documents.length ? (
                detail.documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                  >
                    <p className="font-semibold">{document.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {document.category} | {formatDate(document.uploadedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">Aucun document verse pour ce membre.</p>
              )}
            </div>
          </article>

          <article className="panel rounded-[32px] p-6">
            <h2 className="text-xl font-semibold">Historique social</h2>
            <div className="mt-4 space-y-3">
              {detail.operations.length ? (
                detail.operations.map((operation) => (
                  <div
                    key={operation.id}
                    className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{operation.type}</p>
                      <StatusBadge
                        tone={
                          operation.status === "VALIDATED"
                            ? "green"
                            : operation.status === "REJECTED"
                              ? "red"
                              : "yellow"
                        }
                      >
                        {operation.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{operation.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">Aucune operation sociale rattachee.</p>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
