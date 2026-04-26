"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            setError("");
            const response = await fetch("/api/auth/logout", { method: "POST" });
            if (!response.ok) {
              setError("Deconnexion impossible.");
              return;
            }
            router.push("/login");
            router.refresh();
          })
        }
        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--danger)]"
      >
        <LogOut size={16} />
        {pending ? "Sortie..." : "Deconnexion"}
      </button>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
