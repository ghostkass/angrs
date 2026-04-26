"use client";

import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  FileArchive,
  LayoutDashboard,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Membres", icon: Users },
  { href: "/contributions", label: "Cotisations", icon: WalletCards },
  { href: "/documents", label: "Documents", icon: FileArchive },
  { href: "/social-operations", label: "Social", icon: CreditCard },
  { href: "/users", label: "Utilisateurs", icon: ShieldCheck },
];

export function DashboardShell({
  role,
  name,
  children,
}: {
  role: string;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="panel rounded-[32px] p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="flex items-center gap-3 rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
            <div className="flex items-center justify-center rounded-2xl bg-white p-1">
              <Image 
                src="/Logo_ANGRS.png" 
                alt="Logo ANGRS" 
                width={40} 
                height={40} 
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">ANGRS</p>
              <p className="text-xs text-[var(--muted)]">Gestion institutionnelle</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">
                <BadgeCheck size={18} />
              </div>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{role}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </aside>

        <main className="space-y-6 py-2">{children}</main>
      </div>
    </div>
  );
}
