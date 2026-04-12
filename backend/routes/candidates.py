import asyncio
import os
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Candidate, CandidateSnapshot, Job, Match, ScrapeLog, UpskillRecommendation
from services.openai import chat_completion
from services.supermemory import SupermemoryService

router = APIRouter()


# ------------------------------------------------------------
# Response schemas
# ------------------------------------------------------------

class CandidateSummary(BaseModel):
    id: uuid.UUID
    name: str
    current_title: str | None
    interviewed_at: datetime | None
    ai_summary: str | None
    match_score: int | None
    linkedin_url: str | None

    model_config = {"from_attributes": True}


class LinkedInPost(BaseModel):
    date: str | None = None
    content: str | None = None
    model_config = {"extra": "allow"}


class GitHubRepo(BaseModel):
    name: str | None = None
    description: str | None = None
    language: str | None = None
    updated_at: str | None = None
    model_config = {"extra": "allow"}


class Tweet(BaseModel):
    date: str | None = None
    content: str | None = None
    model_config = {"extra": "allow"}


class UpskillItem(BaseModel):
    skill: str | None = None
    course: str | None = None
    url: str | None = None
    model_config = {"extra": "allow"}


class MemoryItem(BaseModel):
    content: str
    date: str
    source: str


class CandidateDetail(BaseModel):
    id: uuid.UUID
    name: str
    current_title: str | None
    interviewed_at: datetime | None
    interview_notes: str | None
    linkedin_posts: list[MemoryItem]
    github_repos: list[MemoryItem]
    tweets: list[MemoryItem]
    ai_summary: str | None
    upskilling: list[dict[str, Any]]


# ------------------------------------------------------------
# Write schemas
# ------------------------------------------------------------

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    company_id: uuid.UUID
    current_title: str | None = None
    linkedin_url: str | None = None
    github_handle: str | None = None
    twitter_handle: str | None = None


class CandidateUpdate(BaseModel):
    name: str | None = None
    current_title: str | None = None
    ai_summary: str | None = None
    linkedin_url: str | None = None
    github_handle: str | None = None
    twitter_handle: str | None = None
    interview_notes: str | None = None
    interviewed_at: datetime | None = None


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def _normalize_memory_results(results: list[dict], source: str) -> list[MemoryItem]:
    """
    Normalize raw Supermemory search results into MemoryItem shape.
    Content lives in chunks[0]["content"] — top-level content is always null.
    """
    items: list[MemoryItem] = []
    for r in results:
        # Primary: first relevant chunk
        chunks = r.get("chunks") or []
        text = chunks[0]["content"].strip() if chunks and chunks[0].get("content") else ""
        # Fallback: top-level content (future-proofing)
        if not text:
            text = (r.get("content") or "").strip()
        if not text:
            continue
        meta = r.get("metadata") or {}
        date = meta.get("date") or ""
        src = meta.get("source") or source
        items.append(MemoryItem(content=text, date=date, source=src))
    return items


# ------------------------------------------------------------
# Routes
# ------------------------------------------------------------

@router.get("", response_model=list[CandidateSummary])
async def list_candidates(
    company_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_db),
):
    """
    List all candidates with their best match score.
    Optionally filter by company_id.
    """
    # Subquery: best match score per candidate
    best_score_sq = (
        select(Match.candidate_id, func.max(Match.score).label("match_score"))
        .group_by(Match.candidate_id)
        .subquery()
    )

    stmt = (
        select(Candidate, best_score_sq.c.match_score)
        .outerjoin(best_score_sq, Candidate.id == best_score_sq.c.candidate_id)
        .order_by(Candidate.created_at.desc())
    )
    if company_id:
        stmt = stmt.where(Candidate.company_id == company_id)

    rows = (await db.execute(stmt)).all()

    return [
        CandidateSummary(
            id=c.id,
            name=c.name,
            current_title=c.current_title,
            interviewed_at=c.interviewed_at,
            ai_summary=c.ai_summary,
            match_score=score,
            linkedin_url=c.linkedin_url,
        )
        for c, score in rows
    ]


@router.get("/{candidate_id}", response_model=CandidateDetail)
async def get_candidate(candidate_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Return full candidate profile.
    Social data (LinkedIn posts, tweets, GitHub repos) is pulled live from
    Supermemory using the candidate's container tag. Falls back to empty
    lists if supermemory_id is not yet set.
    """
    # Load candidate + upskill recommendations eagerly (snapshots no longer needed)
    stmt = (
        select(Candidate)
        .where(Candidate.id == candidate_id)
        .options(selectinload(Candidate.upskill_recommendations))
    )
    candidate = (await db.execute(stmt)).scalar_one_or_none()
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Query Supermemory for social memories
    linkedin_posts: list[MemoryItem] = []
    github_repos: list[MemoryItem] = []
    tweets: list[MemoryItem] = []

    if candidate.supermemory_id:
        async with SupermemoryService() as svc:
            raw_linkedin, raw_github, raw_tweets = await asyncio.gather(
                svc.query_space(candidate.supermemory_id, "linkedin posts", limit=10),
                svc.query_space(candidate.supermemory_id, "github repositories", limit=10),
                svc.query_space(candidate.supermemory_id, "tweets", limit=10),
            )
        linkedin_posts = _normalize_memory_results(raw_linkedin, "linkedin")
        github_repos   = _normalize_memory_results(raw_github,   "github")
        tweets         = _normalize_memory_results(raw_tweets,   "twitter")

    # Upskilling: merge across jobs, deduplicated by skill name
    seen: set[str] = set()
    upskilling: list[dict] = []
    for rec in sorted(candidate.upskill_recommendations, key=lambda r: r.generated_at, reverse=True):
        for item in rec.recommendations or []:
            skill = item.get("skill", "")
            if skill not in seen:
                seen.add(skill)
                upskilling.append(item)

    return CandidateDetail(
        id=candidate.id,
        name=candidate.name,
        current_title=candidate.current_title,
        interviewed_at=candidate.interviewed_at,
        interview_notes=candidate.interview_notes,
        linkedin_posts=linkedin_posts,
        github_repos=github_repos,
        tweets=tweets,
        ai_summary=candidate.ai_summary,
        upskilling=upskilling,
    )


@router.post("", status_code=201)
async def create_candidate(payload: CandidateCreate, db: AsyncSession = Depends(get_db)):
    candidate = Candidate(**payload.model_dump())
    db.add(candidate)
    await db.commit()
    await db.refresh(candidate)
    return candidate


@router.patch("/{candidate_id}")
async def update_candidate(
    candidate_id: uuid.UUID,
    payload: CandidateUpdate,
    db: AsyncSession = Depends(get_db),
):
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(candidate, field, value)
    await db.commit()
    await db.refresh(candidate)
    return candidate



@router.delete("/{candidate_id}", status_code=204)
async def delete_candidate(candidate_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    await db.delete(candidate)
    await db.commit()


# ------------------------------------------------------------
# POST /candidates/{id}/chat
# ------------------------------------------------------------

class ChatRequest(BaseModel):
    q: str


@router.post("/{candidate_id}/chat")
async def chat_with_candidate(
    candidate_id: uuid.UUID,
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """Query a candidate's Supermemory space and answer via GPT-4o."""
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not candidate.supermemory_id:
        raise HTTPException(status_code=400, detail="Candidate has no Supermemory space yet")

    async with SupermemoryService() as svc:
        results = await svc.query_space(candidate.supermemory_id, payload.q, limit=5)

    context = "\n\n".join(
        r["chunks"][0]["content"]
        for r in results
        if r.get("chunks") and r["chunks"][0].get("content")
    )

    answer = await chat_completion(
        prompt=f"{payload.q}\n\nCandidate data:\n{context}",
        system=(
            f"You are an HR assistant answering questions about a specific candidate "
            f"named {candidate.name}. Be concise and factual."
        ),
    )
    return {"answer": answer}


# ------------------------------------------------------------
# POST /candidates/{id}/sync-github
# ------------------------------------------------------------

@router.post("/{candidate_id}/sync-github")
async def sync_github(
    candidate_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Fetch GitHub repos + recent commits and store in Supermemory."""
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not candidate.github_handle:
        raise HTTPException(status_code=400, detail="Candidate has no github_handle set")

    handle = candidate.github_handle
    space_id = candidate.supermemory_id or SupermemoryService().create_space(candidate_id)

    headers = {"Accept": "application/vnd.github+json"}
    gh_token = os.getenv("GITHUB_TOKEN")
    if gh_token:
        headers["Authorization"] = f"Bearer {gh_token}"

    async with httpx.AsyncClient(headers=headers, timeout=15) as http:
        repos_resp = await http.get(
            f"https://api.github.com/users/{handle}/repos",
            params={"sort": "updated", "per_page": 10},
        )
        if repos_resp.status_code == 404:
            raise HTTPException(status_code=400, detail=f"GitHub user '{handle}' not found")
        repos_resp.raise_for_status()
        repos = repos_resp.json()

        # Fetch last 5 commits per repo concurrently
        async def _fetch_commits(repo_name: str) -> list[str]:
            r = await http.get(
                f"https://api.github.com/repos/{handle}/{repo_name}/commits",
                params={"per_page": 5},
            )
            if r.status_code != 200:
                return []
            return [c["commit"]["message"].splitlines()[0] for c in r.json()]

        commit_lists = await asyncio.gather(
            *[_fetch_commits(repo["name"]) for repo in repos]
        )

    # Build memory text + push to Supermemory
    async with SupermemoryService() as svc:
        for repo, commits in zip(repos, commit_lists):
            text = (
                f"Repo: {repo['name']} | "
                f"Language: {repo.get('language') or 'unknown'} | "
                f"Description: {repo.get('description') or 'none'} | "
                f"Stars: {repo.get('stargazers_count', 0)} | "
                f"Commits: {'; '.join(commits) or 'none'}"
            )
            await svc.add_memory(
                space_id,
                text,
                metadata={
                    "source": "github",
                    "candidate_id": str(candidate_id),
                    "name": candidate.name,
                    "repo": repo["name"],
                },
                custom_id=f"{candidate_id}:github:{repo['name']}",
            )

    # Persist supermemory_id if it wasn't set
    if not candidate.supermemory_id:
        candidate.supermemory_id = space_id
        await db.commit()

    # Insert scrape log
    log = ScrapeLog(
        candidate_id=candidate_id,
        platform="github",
        status="success",
    )
    db.add(log)
    await db.commit()

    return {"status": "synced", "repos_count": len(repos)}


# ------------------------------------------------------------
# POST /candidates/{id}/feed
# ------------------------------------------------------------

class FeedRequest(BaseModel):
    linkedin_post: str | None = None
    tweet: str | None = None


@router.post("/{candidate_id}/feed")
async def add_feed(
    candidate_id: uuid.UUID,
    payload: FeedRequest,
    db: AsyncSession = Depends(get_db),
):
    """Add a LinkedIn post or tweet to the candidate's Supermemory space."""
    if not payload.linkedin_post and not payload.tweet:
        raise HTTPException(status_code=400, detail="Provide linkedin_post or tweet")

    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    space_id = candidate.supermemory_id or SupermemoryService().create_space(candidate_id)
    today = datetime.now(timezone.utc).date().isoformat()

    async with SupermemoryService() as svc:
        if payload.linkedin_post:
            await svc.add_memory(
                space_id,
                f"[LinkedIn — {today}]\n{payload.linkedin_post}",
                metadata={
                    "source": "linkedin",
                    "candidate_id": str(candidate_id),
                    "name": candidate.name,
                    "date": today,
                },
            )
            db.add(ScrapeLog(candidate_id=candidate_id, platform="linkedin", status="success"))

        if payload.tweet:
            await svc.add_memory(
                space_id,
                f"[Tweet — {today}]\n{payload.tweet}",
                metadata={
                    "source": "twitter",
                    "candidate_id": str(candidate_id),
                    "name": candidate.name,
                    "date": today,
                },
            )
            db.add(ScrapeLog(candidate_id=candidate_id, platform="twitter", status="success"))

    if not candidate.supermemory_id:
        candidate.supermemory_id = space_id

    await db.commit()
    return {"status": "ok"}


# ------------------------------------------------------------
# POST /candidates/{id}/transcript
# ------------------------------------------------------------

class TranscriptRequest(BaseModel):
    transcript: str


@router.post("/{candidate_id}/transcript")
async def save_transcript(
    candidate_id: uuid.UUID,
    payload: TranscriptRequest,
    db: AsyncSession = Depends(get_db),
):
    """Save interview transcript to DB and Supermemory."""
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    space_id = candidate.supermemory_id or SupermemoryService().create_space(candidate_id)

    async with SupermemoryService() as svc:
        await svc.add_memory(
            space_id,
            f"[Interview Transcript]\n{payload.transcript}",
            metadata={
                "source": "interview_transcript",
                "candidate_id": str(candidate_id),
                "name": candidate.name,
            },
            custom_id=f"{candidate_id}:transcript:latest",
        )

    # Persist to DB (interview_notes column)
    candidate.interview_notes = payload.transcript
    if not candidate.supermemory_id:
        candidate.supermemory_id = space_id

    # Scrape log — 'resume' is the closest allowed platform for documents
    db.add(ScrapeLog(candidate_id=candidate_id, platform="resume", status="success"))
    await db.commit()

    return {"status": "ok"}


# ------------------------------------------------------------
# POST /candidates/{id}/reengage
# ------------------------------------------------------------

class ReengageRequest(BaseModel):
    job_id: uuid.UUID
    send: bool = False


@router.post("/{candidate_id}/reengage")
async def reengage_candidate(
    candidate_id: uuid.UUID,
    payload: ReengageRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate (and optionally send) a personalised re-engagement email."""
    candidate = await db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    job = await db.get(Job, payload.job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    # Pull recent activity from Supermemory
    recent_activity = ""
    if candidate.supermemory_id:
        async with SupermemoryService() as svc:
            results = await svc.query_space(
                candidate.supermemory_id,
                "summarize recent activity and skills",
                limit=8,
            )
        recent_activity = "\n\n".join(
            r["chunks"][0]["content"]
            for r in results
            if r.get("chunks") and r["chunks"][0].get("content")
        )

    prompt = (
        f"Write a warm, personalized re-engagement email to {candidate.name} "
        f"({candidate.email}) for the role of {job.title}.\n\n"
        f"Job description: {job.description}\n\n"
        f"Candidate's recent activity and skills:\n{recent_activity or 'Not available'}\n\n"
        f"The email should:\n"
        f"- Open by referencing something specific from their recent work\n"
        f"- Briefly explain why they are a strong fit for {job.title}\n"
        f"- Include a clear call to action (reply to schedule a call)\n"
        f"- Be 150-200 words, professional but warm\n"
        f"- Sign off as 'The VensureHR Team'\n\n"
        f"Return only the email body, no subject line."
    )

    draft = await chat_completion(
        prompt=prompt,
        system="You are a senior technical recruiter writing personalized outreach emails.",
    )

    sent = False
    if payload.send:
        resend_key = os.getenv("RESEND_API_KEY")
        if not resend_key:
            raise HTTPException(status_code=500, detail="RESEND_API_KEY not configured")

        async with httpx.AsyncClient() as http:
            resp = await http.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "VensureHR <noreply@vensurehr.com>",
                    "to": [candidate.email],
                    "subject": f"Re: {job.title} opportunity",
                    "text": draft,
                },
            )
            if resp.status_code not in (200, 201):
                raise HTTPException(
                    status_code=502,
                    detail=f"Resend API error: {resp.text}",
                )
        sent = True

    return {"draft": draft, "sent": sent}
