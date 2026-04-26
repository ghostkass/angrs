"use client";

import { Download, FilePlus2 } from "lucide-react";
import { useState, useTransition } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { DocumentRecord, Member } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function DocumentsWorkspace({
  documents,
  members,
  csrfToken,
}: {
  documents: DocumentRecord[];
  members: Member[];
  csrfToken: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    memberId: members[0]?.id ?? "",
    title: "",
    category: "ADMINISTRATIVE",
    accessLevel: "MANAGER",
  });
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="panel rounded-[30px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Gestion documentaire</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Upload classe par membre, categorie et niveau d&apos;acces.
            </p>
          </div>
          <span className="rounded-2xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">
            <FilePlus2 size={18} />
          </span>
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!file) {
              setMessage("Selectionnez un document.");
              return;
            }

            startTransition(async () => {
              const formData = new FormData();
              Object.entries(form).forEach(([key, value]) => formData.append(key, value));
              formData.append("file", file);

              const response = await fetch("/api/documents", {
                method: "POST",
                headers: { "x-csrf-token": csrfToken },
                body: formData,
              });
              setMessage(response.ok ? "Document verse au dossier." : "Upload impossible.");
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
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Titre du document"
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          />
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          >
            <option value="ADMINISTRATIVE">Administrative</option>
            <option value="MEDICAL">Medicale</option>
            <option value="PROOF">Justificatif</option>
          </select>
          <select
            value={form.accessLevel}
            onChange={(event) => setForm((current) => ({ ...current, accessLevel: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4"
          >
            <option value="ADMIN_ONLY">Admin only</option>
            <option value="MANAGER">Gestionnaire</option>
            <option value="MEMBER">Membre</option>
          </select>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
          />
          <button className="h-11 w-full rounded-2xl bg-[var(--primary)] font-semibold text-white">
            {pending ? "Traitement..." : "Verser au dossier"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
      </aside>

      <section className="space-y-4">
        {documents.map((document) => {
          const member = members.find((entry) => entry.id === document.memberId);
          return (
            <article
              key={document.id}
              className="panel rounded-[28px] p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{document.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {member?.firstName} {member?.lastName} | {formatDate(document.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={document.category === "MEDICAL" ? "red" : "blue"}>
                    {document.category}
                  </StatusBadge>
                  <StatusBadge tone="yellow">{document.accessLevel}</StatusBadge>
                  <a
                    href={document.storagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
