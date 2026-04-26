"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,107,62,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(243,196,77,0.2),transparent_28%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel flex flex-col justify-between rounded-[36px] p-8 lg:p-12">
          <div>
            <Image
              src="/Logo_ANGRS.png"
              alt="Logo ANGRS"
              width={140}
              height={140}
              priority
              className="mb-8"
            />
            <h1 className="mt-8 max-w-2xl font-serif text-4xl leading-tight text-[var(--foreground)] lg:text-6xl">
              Une administration claire, durable et digne des parcours qu&apos;elle protege.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Centralisez les membres, suivez les cotisations, tracez les aides sociales et gardez un audit complet de chaque action.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
              <p className="text-sm text-[var(--muted)]">Controle</p>
              <p className="mt-3 text-2xl font-semibold">RBAC</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Roles Admin, Gestionnaire et Membre avec traces d&apos;audit.</p>
            </article>
            <article className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
              <p className="text-sm text-[var(--muted)]">Continuite</p>
              <p className="mt-3 text-2xl font-semibold">Cotisations</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Calendrier annuel, historisation et export metier.</p>
            </article>
            <article className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
              <p className="text-sm text-[var(--muted)]">Soutien</p>
              <p className="mt-3 text-2xl font-semibold">Social</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Operations sensibles, documents et suivi des familles.</p>
            </article>
          </div>
        </section>

        <section className="panel flex flex-col rounded-[36px] p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--primary)] p-3 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-semibold">Acces securise</p>
              <p className="text-sm text-[var(--muted)]">Session JWT, CSRF et journalisation des actions</p>
            </div>
          </div>

          <form className="mt-8 space-y-4" action="/api/auth/login?redirect=/dashboard" method="post">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--muted)]">Email</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="username"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 outline-none transition focus:border-[var(--primary)]"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--muted)]">Mot de passe</span>
              <input
                required
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 outline-none transition focus:border-[var(--primary)]"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 font-semibold text-white transition hover:brightness-110"
            >
              <LockKeyhole size={18} />
              Ouvrir la plateforme
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {/* Espace reserve si besoin */}
          </div>
        </section>
      </div>
    </div>
  );
}
