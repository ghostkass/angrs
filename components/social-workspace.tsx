"use client";

import { useState, useTransition } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { Member, SocialOperation } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function SocialWorkspace({
  operations,
  members,
  csrfToken,
}: {
  operations: SocialOperation[];
  members: Member[];
  csrfToken: string;
}) {
  const [form, setForm] = useState({
    memberId: members[0]?.id ?? "",
    type: "MEDICAL",
    description: "",
    amount: "0",
    date: "2026-04-26",
    status: "IN_PROGRESS",
  });
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="panel rounded-[30px] p-5">
        <h1 className="text-2xl font-semibold">Operations sociales</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Aides medicales, financieres, urgences, deces et soutiens exceptionnels.
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const response = await fetch("/api/social-operations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({
                  ...form,
                  amount: Number(form.amount) || null,
                }),
              });
              setMessage(response.ok ? "Operation enregistree." : "Enregistrement refuse.");
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
          <select
            value={form.type}
            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          >
            <option value="MEDICAL">Medical</option>
            <option value="FINANCIAL">Financier</option>
            <option value="SOCIAL">Social</option>
            <option value="EMERGENCY">Urgence</option>
            <option value="DEATH">Deces</option>
            <option value="EXCEPTIONAL">Exceptionnel</option>
          </select>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3"
            placeholder="Besoin et contexte"
          />
          <input
            type="number"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
            placeholder="Montant"
          />
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          >
            <option value="IN_PROGRESS">En cours</option>
            <option value="VALIDATED">Valide</option>
            <option value="REJECTED">Refuse</option>
          </select>
          <button className="h-11 w-full rounded-2xl bg-[var(--primary)] font-semibold text-white">
            {pending ? "Traitement..." : "Ajouter l'operation"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
      </aside>

      <section className="space-y-4">
        {operations.map((operation) => {
          const member = members.find((entry) => entry.id === operation.memberId);
          const tone =
            operation.status === "VALIDATED"
              ? "green"
              : operation.status === "REJECTED"
                ? "red"
                : "yellow";
          return (
            <article key={operation.id} className="panel rounded-[28px] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">
                    {member?.firstName} {member?.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{operation.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={tone}>{operation.status}</StatusBadge>
                  <StatusBadge tone="blue">{operation.type}</StatusBadge>
                  <span className="font-semibold">
                    {operation.amount ? formatCurrency(operation.amount) : "Nature"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Date {operation.date} | Porte par {operation.createdBy}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
