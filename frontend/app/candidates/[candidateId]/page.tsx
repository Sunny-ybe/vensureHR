"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { candidates, roles } from "../../lib/data";

const API = "https://swarm-exemplify-verbalize.ngrok-free.dev";

const REAL_CANDIDATE_IDS = [
  "83cbc69d-8a56-47e2-8426-8317d1dc87fb",
  "d897df48-928f-4486-bd71-a08c1e20620e",
  "52da3164-f14a-4f66-b3c0-97eb78b2fb18",
  "cdae9e51-65a1-4163-9e0f-26b9a1d3b71c",
  "7c275e3b-32e9-41ea-9a31-386367c1ae4a",
];

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
VensureHR Team`,
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
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [linkedinExpanded, setLinkedinExpanded] = useState(false);
  const [tweetsExpanded, setTweetsExpanded] = useState(false);
  const [commitsExpanded, setCommitsExpanded] = useState(false);

  const isRealCandidate = REAL_CANDIDATE_IDS.includes(candidate.id);

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

  // Feed LinkedIn posts and tweets into Supermemory on page load for real candidates
  useEffect(() => {
    if (!isRealCandidate) return;
    if (!candidate.linkedinPosts?.length && !candidate.tweets?.length) return;

    const feedToSupermemory = async () => {
      for (const post of candidate.linkedinPosts ?? []) {
        await fetch(`${API}/candidates/${candidate.id}/feed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedin_post: post.content }),
        }).catch(() => {});
      }
      for (const tweet of candidate.tweets ?? []) {
        await fetch(`${API}/candidates/${candidate.id}/feed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tweet: tweet.content }),
        }).catch(() => {});
      }
    };

    feedToSupermemory();
  }, [candidate.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChat = async () => {
    if (!question.trim() || !isRealCandidate) return;
    setChatLoading(true);
    setChatAnswer("");
    try {
      const res = await fetch(`${API}/candidates/${candidate.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      setChatAnswer(data.answer ?? data.response ?? JSON.stringify(data));
    } catch {
      setChatAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const draft = buildEmailDraft(candidate.name, role.title, candidate.currentTitle);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. You can still select and copy the text manually.");
    }
  };

  const visibleLinkedinPosts = linkedinExpanded
    ? (candidate.linkedinPosts ?? [])
    : (candidate.linkedinPosts ?? []).slice(0, 1);

  const visibleTweets = tweetsExpanded
    ? (candidate.tweets ?? [])
    : (candidate.tweets ?? []).slice(0, 1);

  const visibleCommits = commitsExpanded
    ? (candidate.githubCommits ?? [])
    : (candidate.githubCommits ?? []).slice(0, 5);

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-block rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
        >
          ← Back to dashboard
        </Link>

        <header className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
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
            <div className="rounded-3xl border border-orange-200 bg-gray-50 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Match score
              </p>
              <p className="mt-2 text-4xl font-bold text-orange-600">
                {candidate.matchScore}
              </p>
            </div>
            <div className="rounded-3xl border border-orange-200 bg-gray-50 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Growth
              </p>
              <p className="mt-2 text-4xl font-bold text-orange-600">
                +{candidate.growthPercent}%
              </p>
            </div>
            <div className="rounded-3xl border border-orange-200 bg-gray-50 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-700">
                Track
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {role.title}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {candidate.linkedinUrl && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
              >
                LinkedIn ↗
              </a>
            )}
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                GitHub ↗
              </a>
            )}
            {candidate.twitterUrl && (
              <a
                href={candidate.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                X / Twitter ↗
              </a>
            )}
            {candidate.githubUsername && (
              <span className="rounded-xl border border-orange-200 bg-gray-50 px-4 py-2 text-sm text-slate-700">
                @{candidate.githubUsername}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEmailOpen(true)}
              className="inline-flex items-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              Email candidate
            </button>
            {candidate.resumeUrl && (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border border-orange-200 bg-gray-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-white"
              >
                View resume ↗
              </a>
            )}
            <span className={`rounded-xl px-4 py-2 text-sm font-medium ${
              candidate.willingToRelocate
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              Relocate: {candidate.willingToRelocate ? "Yes" : "No"}
            </span>
          </div>
        </header>

        <section className="mt-6 grid gap-6">

          {/* LinkedIn */}
          <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-950">LinkedIn</h2>
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-orange-700 hover:underline"
                >
                  View profile ↗
                </a>
              )}
            </div>

            {visibleLinkedinPosts.length > 0 ? (
              <div className="mt-3 space-y-4">
                {visibleLinkedinPosts.map((post, i) => (
                  <div key={i} className="rounded-2xl bg-gray-50 p-4">
                    <p className="mb-2 text-xs text-slate-400">{post.date}</p>
                    <p className="text-sm leading-6 text-slate-700">{post.content}</p>
                  </div>
                ))}
                {!linkedinExpanded && (candidate.linkedinPosts?.length ?? 0) > 1 && (
                  <button
                    onClick={() => setLinkedinExpanded(true)}
                    className="text-sm text-orange-700 hover:underline"
                  >
                    Read more posts ({(candidate.linkedinPosts?.length ?? 1) - 1} more) →
                  </button>
                )}
                {linkedinExpanded && (
                  <button
                    onClick={() => setLinkedinExpanded(false)}
                    className="text-sm text-slate-500 hover:underline"
                  >
                    Show less
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {candidate.linkedinUpdate}
              </p>
            )}
          </div>

          {/* GitHub */}
          <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-950">GitHub</h2>
              {candidate.githubUrl && (
                <a
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-700 hover:underline"
                >
                  View profile ↗
                </a>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.githubUpdate}
            </p>
            {githubLoading && (
              <p className="mt-2 text-xs text-slate-400">Loading live repos…</p>
            )}
            {githubRepos.length > 0 && (
              <div className="mt-3 space-y-2">
                {githubRepos.map((repo, i) => (
                  <div key={i} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-slate-700">
                    {repo.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Commits — real candidates only */}
          {isRealCandidate && (candidate.githubCommits?.length ?? 0) > 0 && (
            <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">GitHub Commits</h2>
              <div className="mt-3 space-y-3">
                {visibleCommits.map((commit, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border-l-4 border-orange-300 bg-gray-50 py-3 pl-4 pr-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 font-mono text-xs font-medium text-orange-700">
                        {commit.repo}
                      </span>
                      <span className="text-xs text-slate-400">{commit.date}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-sm text-slate-800">{commit.message}</p>
                  </div>
                ))}
              </div>
              {!commitsExpanded && (candidate.githubCommits?.length ?? 0) > 5 && (
                <button
                  onClick={() => setCommitsExpanded(true)}
                  className="mt-3 text-sm text-orange-700 hover:underline"
                >
                  See all {candidate.githubCommits?.length} commits →
                </button>
              )}
              {commitsExpanded && (
                <button
                  onClick={() => setCommitsExpanded(false)}
                  className="mt-3 text-sm text-slate-500 hover:underline"
                >
                  Show less
                </button>
              )}
            </div>
          )}

          {/* Twitter / X */}
          <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-950">Twitter / X</h2>
              {candidate.twitterUrl && (
                <a
                  href={candidate.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-700 hover:underline"
                >
                  View profile ↗
                </a>
              )}
            </div>

            {visibleTweets.length > 0 ? (
              <div className="mt-3 space-y-3">
                {visibleTweets.map((tweet, i) => (
                  <div key={i} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm leading-6 text-slate-800">{tweet.content}</p>
                    <p className="mt-1 text-xs text-slate-400">{tweet.date}</p>
                  </div>
                ))}
                {!tweetsExpanded && (candidate.tweets?.length ?? 0) > 1 && (
                  <button
                    onClick={() => setTweetsExpanded(true)}
                    className="text-sm text-orange-700 hover:underline"
                  >
                    See more tweets ({(candidate.tweets?.length ?? 1) - 1} more) →
                  </button>
                )}
                {tweetsExpanded && (
                  <button
                    onClick={() => setTweetsExpanded(false)}
                    className="text-sm text-slate-500 hover:underline"
                  >
                    Show less
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {candidate.twitterUpdate}
              </p>
            )}
          </div>

          {/* Chat with Supermemory — real candidates only */}
          {isRealCandidate && (
            <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">Ask about this candidate</h2>
              <p className="mt-1 text-xs text-slate-500">
                Powered by Supermemory — queries real LinkedIn posts, GitHub activity, and tweets.
              </p>
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChat()}
                  placeholder="e.g. What projects has this candidate built?"
                  className="flex-1 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  onClick={handleChat}
                  disabled={chatLoading || !question.trim()}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:opacity-50"
                >
                  {chatLoading ? "Thinking…" : "Ask"}
                </button>
              </div>
              {chatAnswer && (
                <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {chatAnswer}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">Skills learned</h2>
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
            </div>

            <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">
                Interview summary
              </h2>
              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
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

          <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
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
