import { ContributionTrendChart, AidBreakdownChart } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardMetrics, listAuditLogs } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const activities = await listAuditLogs();

  return (
    <div className="space-y-6">
      <section className="panel rounded-[34px] p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Tableau de bord executif
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-4xl leading-tight lg:text-5xl">
              Tout est sous controle, des cotisations aux gestes solidaires.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              Vue centrale de l&apos;association avec alertes, progression mensuelle, repartition des aides et historique des actions recentes.
            </p>
          </div>
          <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-4">
            <p className="text-sm text-[var(--muted)]">Collecte annuelle</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(metrics.yearlyCollected)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Membres"
          value={String(metrics.totalMembers)}
          detail={`${metrics.membersLate} dossiers attendent une regularisation de cotisation.`}
        />
        <StatCard
          label="Cotisations du mois"
          value={formatCurrency(metrics.monthlyCollected)}
          detail={`${metrics.membersUpToDate} membres sont a jour en avril.`}
        />
        <StatCard
          label="Budget social"
          value={formatCurrency(metrics.socialBudget)}
          detail="Montants valides et traces d'affectation."
        />
        <StatCard
          label="Alerte suivi"
          value={String(metrics.alerts.length)}
          detail="Notifications de retard, acces sensible et sauvegarde."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="panel rounded-[30px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Evolution des cotisations</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Lecture mensuelle des encaissements.</p>
            </div>
            <StatusBadge tone="green">Exercice 2026</StatusBadge>
          </div>
          <div className="mt-6 h-[260px]">
            <ContributionTrendChart data={metrics.contributionTrend} />
          </div>
        </article>

        <article className="panel rounded-[30px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Repartition des aides</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Lecture budgetaire des operations sociales.</p>
            </div>
            <StatusBadge tone="yellow">Social</StatusBadge>
          </div>
          <div className="mt-6 h-[260px]">
            <AidBreakdownChart data={metrics.aidBreakdown} />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="panel rounded-[30px] p-5">
          <h2 className="text-xl font-semibold">Alertes prioritaires</h2>
          <div className="mt-5 space-y-3">
            {metrics.alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{alert.label}</p>
                  <StatusBadge
                    tone={
                      alert.severity === "high"
                        ? "red"
                        : alert.severity === "medium"
                          ? "yellow"
                          : "blue"
                    }
                  >
                    {alert.severity}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel rounded-[30px] p-5">
          <h2 className="text-xl font-semibold">Activites recentes</h2>
          <div className="mt-5 space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{activity.action}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {activity.actor} | {activity.entityLabel}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{formatDate(activity.timestamp)}</p>
                </div>
                {activity.details ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">{activity.details}</p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
