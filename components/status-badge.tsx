import { cn } from "@/lib/utils";

export function StatusBadge({
  tone,
  children,
}: {
  tone: "green" | "yellow" | "red" | "blue";
  children: React.ReactNode;
}) {
  const styles = {
    green: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-300",
    yellow: "bg-amber-400/18 text-amber-700 dark:text-amber-300",
    red: "bg-rose-500/14 text-rose-700 dark:text-rose-300",
    blue: "bg-sky-500/14 text-sky-700 dark:text-sky-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}
