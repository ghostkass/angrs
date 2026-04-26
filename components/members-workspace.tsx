"use client";

import {
  Eye,
  FileDown,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState, useTransition } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { Member, Role } from "@/lib/types";
import { cn, formatDate, initials } from "@/lib/utils";

type MemberFormState = {
  id?: string;
  cardNumber: string;
  firstName: string;
  lastName: string;
  functionTitle: string;
  grade: string;
  birthDate: string;
  phone: string;
  address: string;
  retirementDate: string;
};

const emptyForm: MemberFormState = {
  cardNumber: "",
  firstName: "",
  lastName: "",
  functionTitle: "",
  grade: "",
  birthDate: "",
  phone: "",
  address: "",
  retirementDate: "",
};

const pageSize = 5;

export function MembersWorkspace({
  members,
  csrfToken,
  role,
}: {
  members: Member[];
  csrfToken: string;
  role: Role;
}) {
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<MemberFormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const grades = useMemo(
    () => ["ALL", ...new Set(members.map((member) => member.grade))],
    [members],
  );

  const filtered = useMemo(() => {
    const normalized = deferredQuery.toLowerCase();
    return members.filter((member) => {
      const matchesQuery =
        !normalized ||
        `${member.firstName} ${member.lastName} ${member.grade} ${member.cardNumber}`
          .toLowerCase()
          .includes(normalized);
      const matchesGrade = gradeFilter === "ALL" || member.grade === gradeFilter;
      return matchesQuery && matchesGrade;
    });
  }, [deferredQuery, gradeFilter, members]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const resetForm = () => {
    setEditing(emptyForm);
    setFile(null);
  };

  const submitLabel = editing.id ? "Mettre a jour" : "Enregistrer";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="panel rounded-[30px] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Registre des membres</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Recherche multicritere, pagination et export du registre ANGRS.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/members/export?format=xlsx"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm font-semibold transition hover:border-[var(--primary)]"
              >
                <FileDown size={16} />
                Excel
              </Link>
              <Link
                href="/api/members/export?format=pdf"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm font-semibold transition hover:border-[var(--primary)]"
              >
                <FileDown size={16} />
                PDF
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Nom, grade ou numero de carte"
                className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] pl-11 pr-4 outline-none transition focus:border-[var(--primary)]"
              />
            </label>
            <select
              value={gradeFilter}
              onChange={(event) => {
                setGradeFilter(event.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 outline-none transition focus:border-[var(--primary)]"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === "ALL" ? "Tous les grades" : grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="panel overflow-hidden rounded-[30px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-strong)]">
                <tr className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-5 py-4">Membre</th>
                  <th className="px-5 py-4">Carte</th>
                  <th className="px-5 py-4">Grade</th>
                  <th className="px-5 py-4">Fonction</th>
                  <th className="px-5 py-4">Retraite</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((member) => (
                  <tr key={member.id} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] font-semibold text-[var(--primary)]">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="h-11 w-11 rounded-2xl object-cover"
                            />
                          ) : (
                            initials(member.firstName, member.lastName)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-[var(--muted)]">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{member.cardNumber}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone="green">{member.grade}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-sm">{member.functionTitle}</td>
                    <td className="px-5 py-4 text-sm">{formatDate(member.retirementDate)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/members/${member.id}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] transition hover:border-[var(--primary)]"
                          title="Voir"
                        >
                          <Eye size={16} />
                        </Link>
                        {role !== "MEMBER" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(member);
                              setMessage("");
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] transition hover:border-[var(--primary)]"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                        ) : null}
                        {role === "ADMIN" ? (
                          <button
                            type="button"
                            onClick={() =>
                              startTransition(async () => {
                                setMessage("");
                                const response = await fetch(`/api/members/${member.id}`, {
                                  method: "DELETE",
                                  headers: { "x-csrf-token": csrfToken },
                                });
                                setMessage(
                                  response.ok
                                    ? "Membre supprime."
                                    : "Suppression impossible.",
                                );
                                if (response.ok) {
                                  window.location.reload();
                                }
                              })
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] transition hover:border-[var(--danger)]"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-4 text-sm text-[var(--muted)]">
            <p>
              {filtered.length} membres trouves. Page {page} / {pageCount}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className={cn(
                  "rounded-2xl px-4 py-2 transition",
                  page === 1
                    ? "cursor-not-allowed bg-black/5 text-[var(--muted)]"
                    : "bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--primary)]",
                )}
              >
                Precedent
              </button>
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                className={cn(
                  "rounded-2xl px-4 py-2 transition",
                  page === pageCount
                    ? "cursor-not-allowed bg-black/5 text-[var(--muted)]"
                    : "bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--primary)]",
                )}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="panel rounded-[30px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editing.id ? "Modifier un membre" : "Nouveau membre"}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Creation et mise a jour avec photo et validation stricte.
            </p>
          </div>
          <span className="rounded-2xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">
            <UserRound size={18} />
          </span>
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const formData = new FormData();
              Object.entries(editing).forEach(([key, value]) => {
                if (value) {
                  formData.append(key, value);
                }
              });
              if (file) {
                formData.append("photo", file);
              }

              const endpoint = editing.id ? `/api/members/${editing.id}` : "/api/members";
              const method = editing.id ? "PATCH" : "POST";
              const response = await fetch(endpoint, {
                method,
                headers: { "x-csrf-token": csrfToken },
                body: formData,
              });

              setMessage(
                response.ok ? "Fiche enregistree." : "Enregistrement impossible.",
              );

              if (response.ok) {
                resetForm();
                window.location.reload();
              }
            });
          }}
        >
          {(
            [
              ["cardNumber", "Numero de carte"],
              ["firstName", "Prenom"],
              ["lastName", "Nom"],
              ["functionTitle", "Fonction"],
              ["grade", "Grade"],
              ["birthDate", "Date de naissance"],
              ["phone", "Telephone"],
              ["address", "Adresse"],
              ["retirementDate", "Date de retraite"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
              <input
                type={key.includes("Date") ? "date" : "text"}
                value={editing[key] ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, [key]: event.target.value }))
                }
                className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 outline-none transition focus:border-[var(--primary)]"
              />
            </label>
          ))}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--muted)]">Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 font-semibold text-white transition hover:brightness-110"
            >
              <Plus size={16} />
              {pending ? "Traitement..." : submitLabel}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="h-11 rounded-2xl border border-[var(--line)] px-4 font-semibold"
            >
              Vider
            </button>
          </div>
        </form>

        {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
      </aside>
    </div>
  );
}
