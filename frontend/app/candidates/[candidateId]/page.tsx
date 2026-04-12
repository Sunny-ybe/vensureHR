"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { candidates, roles } from "../../lib/data";

const API = "https://swarm-exemplify-verbalize.ngrok-free.dev";

type GithubRepo = {
  content: string;
  date: string;
  source: string;
};

function formatMonths(months: number) {
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

function buildEmailDraft(candidateName: string, roleTitle: string, currentTitle: string) {
  return {
    subject: `New opportunity for ${candidateName}`,
    body: `Hi ${candidateName},

I hope you have been doing well. We recently came across your profile again and wanted to reach out because we now have a new role that looks like a strong fit for your background.

Based on your experience as a ${currentTitle}, we think you may be well aligned with the ${roleTitle} opportunity. If you are open to it, we would love to share more details and see whether this could be a good next step for you.

Best,
Venture HR Team`,
  };
}

export default function CandidatePage() {
  const params = useParams<{ candidateId: string }>();
  const candidateId = params?.candidateId;

  const candidate = useMemo(
    () => candidates.find((c) => c.id === candidateId) ?? candidates[0],
    [candidateId]
  );

  const role = useMemo(
    () => roles.find((r) => r.id === candidate.roleId) ?? roles[0],
    [candidate.roleId]
  );

  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);

  useEffect(() => {
    if (!candidateId) return;
    setGithubLoading(true);
    fetch(`${API}/candidates/${candidateId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.github_repos)) setGithubRepos(data.github_repos);
      })
      .catch(() => {/* silently fall back to static data */})
      .finally(() => setGithubLoading(false));
  }, [candidateId]);

  const draft = buildEmailDraft(candidate.name, role.title, candidate.currentTitle);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}

${draft.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. You can still select and copy the text manually.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-200 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded-xl border border-orange-200 bg-white/60 px-4 py-2 text-sm font-medium text-orange-700 backdrop-blur-xl transition hover:bg-white/80"
        >
          ← Back to dashboard
        </Link>

        <header className="rounded-3xl border border-orange-200 bg-white/50 p-6 shadow-lg backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
            Candidate detail
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            {candidate.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {candidate.currentTitle} · {candidate.location}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Applied {formatMonths(candidate.appliedAgoMonths)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-3xl border border-orange-200 bg-white/70 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Match score
              </p>
              <p className="mt-2 text-4xl font-bold text-orange-600">
                {candidate.matchScore}
              </p>
            </div>
            <div className="rounded-3xl border border-orange-200 bg-white/70 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Growth
              </p>
              <p className="mt-2 text-4xl font-bold text-emerald-600">
                +{candidate.growthPercent}%
              </p>
            </div>
            <div className="rounded-3xl border border-orange-200 bg-white/70 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Track
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {role.title}
              </p>
            </div>
          </div>

          {candidate.githubUrl && (
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Open GitHub profile
              </a>
              {candidate.githubUsername && (
                <span className="rounded-xl border border-orange-200 bg-white/70 px-4 py-2 text-sm text-slate-700">
                  @{candidate.githubUsername}
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => setEmailOpen(true)}
            className="mt-6 inline-flex items-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            Email candidate
          </button>
        </header>

        <section className="mt-6 grid gap-6">
          <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-950">LinkedIn</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.linkedinUpdate}
            </p>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-950">GitHub</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.githubUpdate}
            </p>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-950">Twitter / X</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.twitterUpdate}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-slate-950">Skills learned</h2>
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

            <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-slate-950">
                Interview summary
              </h2>
              <div className="mt-4 rounded-2xl bg-white/70 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-orange-700">Candidate said:</span>{" "}
                  {candidate.interviewSummary.candidateSaid}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-orange-700">Company notes:</span>{" "}
                  {candidate.interviewSummary.companyNotes}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-white/50 p-5 shadow-lg backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-950">Role match</h2>
            <p className="mt-2 text-sm text-slate-700">{candidate.summary}</p>
            <p className="mt-3 text-sm text-slate-600">
              Matched to: <span className="font-semibold">{role.title}</span>
            </p>
          </div>
        </section>
      </div>

      {emailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-orange-700">
                  Email draft
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Outreach email for {candidate.name}
                </h2>
              </div>

              <button
                onClick={() => setEmailOpen(false)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
                Subject
              </p>
              <p className="mt-2 text-sm text-slate-900">{draft.subject}</p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
                Message
              </p>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                {draft.body}
              </pre>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
              >
                {copied ? "Copied!" : "Copy email"}
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
                className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
              >
                Open in mail app
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

