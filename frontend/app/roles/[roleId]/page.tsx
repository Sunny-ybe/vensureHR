import Link from "next/link";
import { candidates, roles } from "../../lib/data";

function formatMonths(months: number) {
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = await params;

  const role = roles.find((r) => r.id === roleId) ?? roles[0];
  const roleCandidates = candidates
    .filter((c) => c.roleId === role.id)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-200 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded-xl border border-orange-200 bg-white/60 px-4 py-2 text-sm font-medium text-orange-700 backdrop-blur-xl transition hover:bg-white/80"
        >
          ← Back to dashboard
        </Link>

        <header className="rounded-3xl border border-orange-200 bg-white/50 p-6 shadow-lg backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Role detail
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">{role.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{role.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {role.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-slate-950">
                Ranked candidates
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {role.description}
              </p>
            </div>

            {roleCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className={`rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl ${
                  index === 0 ? "ring-2 ring-orange-300/70" : ""
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-950">
                        {candidate.name}
                      </h3>
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                        {candidate.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {candidate.currentTitle} · {candidate.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Applied {formatMonths(candidate.appliedAgoMonths)}
                    </p>
                    <p className="mt-3 text-sm text-slate-700">{candidate.summary}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-bold text-orange-600">
                      {candidate.matchScore}
                    </div>
                    <p className="text-sm text-slate-600">Match Score</p>
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="mt-3 inline-block rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                    >
                      Open candidate →
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl border border-orange-200 bg-white/50 p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
              Role insights
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Why this role matters
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This view helps recruiters understand which candidates have the strongest fit, which skills are missing, and who is ready to be re-engaged now.
            </p>

            <div className="mt-6 rounded-3xl border border-orange-200 bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Company is looking for
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-orange-200 bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Re-engagement
              </p>
              <p className="mt-2 text-sm text-slate-700">
                The top candidate can be reopened immediately with a personalized outreach message.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}