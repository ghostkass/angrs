import { apiEndpoints } from "@/lib/constants";

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-6">
        <h1 className="text-2xl font-semibold">API REST documentee</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Document OpenAPI disponible sur <code>/api/openapi</code>, compatible Swagger.
        </p>
      </section>

      <section className="grid gap-4">
        {apiEndpoints.map((endpoint) => (
          <article key={`${endpoint.method}-${endpoint.path}`} className="panel rounded-[28px] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {endpoint.method}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{endpoint.path}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{endpoint.summary}</p>
              </div>
              <a
                href="/api/openapi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 font-semibold"
              >
                Ouvrir le schema
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
