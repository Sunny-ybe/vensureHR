import uuid
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Candidate, CandidateSnapshot, Match, UpskillRecommendation

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


class CandidateDetail(BaseModel):
    id: uuid.UUID
    name: str
    interviewed_at: datetime | None
    interview_notes: str | None
    linkedin_posts: list[dict[str, Any]]
    github_repos: list[dict[str, Any]]
    tweets: list[dict[str, Any]]
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

def _latest_snapshot_content(snapshots: list[CandidateSnapshot], platform: str) -> list[dict]:
    """Return the content list from the most recent snapshot for a platform."""
    platform_snaps = sorted(
        [s for s in snapshots if s.platform == platform],
        key=lambda s: s.scraped_at,
        reverse=True,
    )
    if not platform_snaps:
        return []
    content = platform_snaps[0].content
    # content may be a list directly or wrapped: {"posts": [...]}
    if isinstance(content, list):
        return content
    if isinstance(content, dict):
        for v in content.values():
            if isinstance(v, list):
                return v
    return []


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
    Return full candidate profile including latest social snapshots and upskilling.
    """
    # Load candidate + all snapshots + upskill recommendations eagerly
    stmt = (
        select(Candidate)
        .where(Candidate.id == candidate_id)
        .options(
            selectinload(Candidate.snapshots),
            selectinload(Candidate.upskill_recommendations),
        )
    )
    candidate = (await db.execute(stmt)).scalar_one_or_none()
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Latest snapshot content per platform
    linkedin_posts = _latest_snapshot_content(candidate.snapshots, "linkedin")
    github_repos = _latest_snapshot_content(candidate.snapshots, "github")
    tweets = _latest_snapshot_content(candidate.snapshots, "twitter")

    # Upskilling: merge recommendations from all jobs, deduplicated by skill
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
