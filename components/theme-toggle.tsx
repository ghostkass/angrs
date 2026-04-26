"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--foreground)] transition hover:border-[var(--primary)]"
      aria-label="Changer de theme"
      title="Changer de theme"
    >
      {dark ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
