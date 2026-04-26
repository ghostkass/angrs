import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="panel rounded-[28px] p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <span className="rounded-full bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[var(--foreground)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p>
    </article>
  );
}
