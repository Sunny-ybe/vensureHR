"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { candidates, roles } from "./lib/data";

type DashboardRole = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type RoleDraft = {
  title: string;
  description: string;
  skills: string;
};

function formatMonths(months: number) {
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);
  const [draft, setDraft] = useState<RoleDraft>({
    title: "",
    description: "",
    skills: "",
  });

  const [rolesState, setRolesState] = useState<DashboardRole[]>(
    roles.map((role) => ({
      id: role.id,
      title: role.title,
      description: role.description,
      skills: role.skills,
    }))
  );

  const [customRoles, setCustomRoles] = useState<DashboardRole[]>([]);

  const allRoles = [...rolesState, ...customRoles];

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;

    return candidates.filter((c) =>
      [
        c.name,
        c.currentTitle,
        c.location,
        c.summary,
        c.reason,
        c.roleId,
        c.status,
        c.interviewSummary.candidateSaid,
        c.interviewSummary.companyNotes,
        ...c.skills,
        c.linkedinUpdate,
        c.githubUpdate,
        c.twitterUpdate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  const grouped = {
    software: filteredCandidates.filter((c) => c.roleId === "software-dev"),
    ai: filteredCandidates.filter((c) => c.roleId === "ai-dev"),
    payroll: filteredCandidates.filter((c) => c.roleId === "payroll"),
    sales: filteredCandidates.filter((c) => c.roleId === "sales"),
    rediscovered: filteredCandidates.filter((c) => c.status === "Rediscovered"),
  };

  const newRoleSkills = draft.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const roleMatches = useMemo(() => {
    if (!newRoleSkills.length) return [];

    return candidates
      .map((candidate) => {
        const overlap = candidate.skills.filter((skill) =>
          newRoleSkills.some(
            (wanted) => wanted.toLowerCase() === skill.toLowerCase()
          )
        ).length;

        return { candidate, overlap };
      })
      .filter((item) => item.overlap > 0)
      .sort(
        (a, b) =>
          b.overlap - a.overlap || b.candidate.matchScore - a.candidate.matchScore
      );
  }, [draft.skills]);

  const handleAddRole = () => {
    const title = draft.title.trim();
    const description = draft.description.trim();
    const skills = draft.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title || !description || !skills.length) return;

    const newRole: DashboardRole = {
      id: slugify(title),
      title,
      description,
      skills,
    };

    setCustomRoles((prev) => [newRole, ...prev]);
    setDraft({ title: "", description: "", skills: "" });
    setShowAddRole(false);
  };

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Venture HR
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950 md:text-5xl">
            Talent intelligence for faster hiring
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Search candidates, review interview summaries, and discover people who are already qualified for a new role before a fresh hiring round starts.
          </p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Software" value={grouped.software.length} note="Candidates" />
          <StatCard label="AI" value={grouped.ai.length} note="Candidates" />
          <StatCard label="Payroll" value={grouped.payroll.length} note="Candidates" />
          <StatCard label="Sales" value={grouped.sales.length} note="Candidates" />
          <StatCard
            label="Rediscovered"
            value={grouped.rediscovered.length}
            note="Improved talent"
          />
        </section>

        <section className="mb-8 rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-orange-400">
                ⌕
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates by name, skill, role, company, or summary..."
                className="w-full rounded-2xl border border-orange-200 bg-white/85 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700">
                Software Dev
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700">
                AI Dev
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700">
                Payroll
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700">
                Sales
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAddRole((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            + Add new role
          </button>

          {showAddRole && (
            <div className="mt-5 rounded-3xl border border-orange-200 bg-white p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
                    Role name
                  </span>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Sales Consultant"
                    className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
                    Skills
                  </span>
                  <input
                    value={draft.skills}
                    onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
                    placeholder="Communication, CRM, Negotiation"
                    className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
                  Short description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Small description of the role"
                  className="min-h-28 w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </label>

              <div className="mt-5 rounded-3xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-orange-700">
                  Already qualified candidates
                </p>
                {roleMatches.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Add skills to see matching candidates.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {roleMatches.map(({ candidate, overlap }) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-slate-950">{candidate.name}</p>
                          <p className="text-xs text-slate-500">
                            {candidate.currentTitle} · {overlap} matching skill(s)
                          </p>
                        </div>
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className="font-medium text-orange-700"
                        >
                          Open →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleAddRole}
                  className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                >
                  Save role
                </button>
              </div>
            </div>
          )}
        </section>

        <SectionBlock
          title="Software Development candidates"
          items={grouped.software}
        />

        <SectionBlock title="AI Development candidates" items={grouped.ai} />
        <SectionBlock title="Payroll candidates" items={grouped.payroll} />
        <SectionBlock title="Sales candidates" items={grouped.sales} />

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              Rediscovered talent
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Candidates who applied about 8 months ago and have improved since then.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grouped.rediscovered.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">Talent pool</h2>
            <p className="mt-1 text-sm text-slate-600">
              Every candidate in one place.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </section>

        {allRoles.length > roles.length && (
          <section className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-950">Newly added roles</h2>
              <p className="mt-1 text-sm text-slate-600">
                Added locally in this session.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {customRoles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-slate-950">{role.title}</h3>
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
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-orange-700">{label}</p>
      <p className="mt-2 text-4xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}

function SectionBlock({
  title,
  items,
}: {
  title: string;
  items: (typeof candidates)[number][];
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <span className="text-sm text-slate-600">{items.length} candidates</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </section>
  );
}

function CandidateCard({
  candidate,
}: {
  candidate: (typeof candidates)[number];
}) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{candidate.name}</h3>
          <p className="text-sm text-slate-600">{candidate.currentTitle}</p>
          <p className="mt-1 text-xs text-slate-500">
            Applied {formatMonths(candidate.appliedAgoMonths)}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">
            {candidate.matchScore}
          </div>
          <p className="text-xs text-slate-500">Match</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          {candidate.status}
        </span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          {candidate.roleId}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          candidate.willingToRelocate
            ? "bg-orange-100 text-orange-700"
            : "bg-gray-100 text-gray-500"
        }`}>
          Relocate: {candidate.willingToRelocate ? "Yes" : "No"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{candidate.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-700">
          Interview summary
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-medium text-slate-950">Candidate:</span>{" "}
          {candidate.interviewSummary.candidateSaid}
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-medium text-slate-950">Company:</span>{" "}
          {candidate.interviewSummary.companyNotes}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {candidate.location} · {candidate.appliedAgoMonths} months since interview
        </p>

        <Link
          href={`/candidates/${candidate.id}`}
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}