"use client";

import { useMemo, useState, useTransition } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { Contribution, DashboardMetrics, Member } from "@/lib/types";
import { formatCurrency, formatDate, monthKey } from "@/lib/utils";

export function ContributionsWorkspace({
  contributions,
  members,
  metrics,
  csrfToken,
}: {
  contributions: Contribution[];
  members: Member[];
  metrics: DashboardMetrics;
  csrfToken: string;
}) {
  const [form, setForm] = useState({
    memberId: members[0]?.id ?? "",
    month: 4,
    year: 2026,
    amount: 5000,
  });
  const [filters, setFilters] = useState({ memberId: "ALL", month: "ALL", year: "2026" });
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return contributions.filter((entry) => {
      if (filters.memberId !== "ALL" && entry.memberId !== filters.memberId) {
        return false;
      }
      if (filters.month !== "ALL" && entry.month !== Number(filters.month)) {
        return false;
      }
      if (filters.year !== "ALL" && entry.year !== Number(filters.year)) {
        return false;
      }
      return true;
    });
  }, [contributions, filters]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="panel rounded-[30px] p-5">
          <h1 className="text-2xl font-semibold">Gestion des cotisations</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Montant mensuel global de {formatCurrency(5000)}, suivi par membre, mois et annee.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--muted)]">Collecte du mois</p>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(metrics.monthlyCollected)}</p>
            </article>
            <article className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--muted)]">Membres a jour</p>
              <p className="mt-3 text-2xl font-semibold">{metrics.membersUpToDate}</p>
            </article>
            <article className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--muted)]">En retard</p>
              <p className="mt-3 text-2xl font-semibold">{metrics.membersLate}</p>
            </article>
          </div>
        </div>

        <div className="panel rounded-[30px] p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <select
              value={filters.memberId}
              onChange={(event) => setFilters((current) => ({ ...current, memberId: event.target.value }))}
              className="h-11 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            >
              <option value="ALL">Tous les membres</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
            <select
              value={filters.month}
              onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))}
              className="h-11 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            >
              <option value="ALL">Tous les mois</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  Mois {index + 1}
                </option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(event) => setFilters((current) => ({ ...current, year: event.target.value }))}
              className="h-11 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            >
              <option value="2026">2026</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {filtered.map((entry) => {
              const member = members.find((item) => item.id === entry.memberId);
              return (
                <article
                  key={entry.id}
                  className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">
                        {member?.firstName} {member?.lastName}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {monthKey(entry.year, entry.month)} | {entry.receiptNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge tone="green">Cotise</StatusBadge>
                      <p className="font-semibold">{formatCurrency(entry.amount)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Saisie le {entry.paidAt ? formatDate(entry.paidAt) : "-"} par {entry.recordedBy}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="panel rounded-[30px] p-5">
        <h2 className="text-xl font-semibold">Enregistrer un paiement</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Paiement manuel ou mise a jour d&apos;un mois existant.
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const response = await fetch("/api/contributions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-csrf-token": csrfToken,
                },
                body: JSON.stringify(form),
              });
              setMessage(response.ok ? "Paiement enregistre." : "Paiement refuse.");
              if (response.ok) {
                window.location.reload();
              }
            });
          }}
        >
          <select
            value={form.memberId}
            onChange={(event) => setForm((current) => ({ ...current, memberId: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={12}
            value={form.month}
            onChange={(event) => setForm((current) => ({ ...current, month: Number(event.target.value) }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            placeholder="Mois"
          />
          <input
            type="number"
            value={form.year}
            onChange={(event) => setForm((current) => ({ ...current, year: Number(event.target.value) }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            placeholder="Annee"
          />
          <input
            type="number"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            placeholder="Montant"
          />
          <button className="h-11 w-full rounded-2xl bg-[var(--primary)] font-semibold text-white">
            {pending ? "Traitement..." : "Valider"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
      </aside>
    </div>
  );
}
