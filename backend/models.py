import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


class Base(DeclarativeBase):
    pass


# ------------------------------------------------------------
# COMPANIES
# ------------------------------------------------------------
class Company(Base):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    clerk_org_id: Mapped[str | None] = mapped_column(Text, unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    candidates: Mapped[list["Candidate"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )
    jobs: Mapped[list["Job"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )


# ------------------------------------------------------------
# CANDIDATES
# ------------------------------------------------------------
class Candidate(Base):
    __tablename__ = "candidates"
    __table_args__ = (
        UniqueConstraint("company_id", "email", name="uq_candidates_company_email"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Identity
    email: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)

    # Current role (updated by scraper)
    current_title: Mapped[str | None] = mapped_column(Text, nullable=True)

    # AI-generated candidate summary (regenerated after each scrape cycle)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Social profiles
    linkedin_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    github_handle: Mapped[str | None] = mapped_column(Text, nullable=True)
    twitter_handle: Mapped[str | None] = mapped_column(Text, nullable=True)
    resume_s3_key: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Supermemory
    supermemory_id: Mapped[str | None] = mapped_column(Text, unique=True, nullable=True)

    # Consent
    consent_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    consent_ip: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Interview
    interviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    interview_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    company: Mapped["Company"] = relationship(back_populates="candidates")
    scrape_logs: Mapped[list["ScrapeLog"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )
    snapshots: Mapped[list["CandidateSnapshot"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )
    matches: Mapped[list["Match"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )
    upskill_recommendations: Mapped[list["UpskillRecommendation"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )


# ------------------------------------------------------------
# JOBS
# ------------------------------------------------------------
class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        CheckConstraint("status IN ('open', 'closed', 'draft')", name="ck_jobs_status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(10), nullable=False, default="open")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    # relationships
    company: Mapped["Company"] = relationship(back_populates="jobs")
    matches: Mapped[list["Match"]] = relationship(
        back_populates="job", cascade="all, delete-orphan"
    )
    upskill_recommendations: Mapped[list["UpskillRecommendation"]] = relationship(
        back_populates="job", cascade="all, delete-orphan"
    )


# ------------------------------------------------------------
# SCRAPE LOGS
# ------------------------------------------------------------
_PLATFORMS = ("linkedin", "github", "twitter", "resume")


class ScrapeLog(Base):
    __tablename__ = "scrape_logs"
    __table_args__ = (
        CheckConstraint(
            "platform IN ('linkedin', 'github', 'twitter', 'resume')",
            name="ck_scrape_logs_platform",
        ),
        CheckConstraint(
            "status IN ('success', 'failed', 'skipped')",
            name="ck_scrape_logs_status",
        ),
        Index("idx_scrape_logs_candidate_platform", "candidate_id", "platform", "scraped_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )

    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False)
    data_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    scraped_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    candidate: Mapped["Candidate"] = relationship(back_populates="scrape_logs")
    snapshots: Mapped[list["CandidateSnapshot"]] = relationship(
        back_populates="scrape_log", cascade="all, delete-orphan"
    )


# ------------------------------------------------------------
# CANDIDATE SNAPSHOTS
# ------------------------------------------------------------
class CandidateSnapshot(Base):
    __tablename__ = "candidate_snapshots"
    __table_args__ = (
        CheckConstraint(
            "platform IN ('linkedin', 'github', 'twitter', 'resume')",
            name="ck_snapshots_platform",
        ),
        Index(
            "idx_snapshots_candidate_platform", "candidate_id", "platform", "scraped_at"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    scrape_log_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("scrape_logs.id", ondelete="CASCADE"),
        nullable=False,
    )

    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    scraped_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    candidate: Mapped["Candidate"] = relationship(back_populates="snapshots")
    scrape_log: Mapped["ScrapeLog"] = relationship(back_populates="snapshots")


# ------------------------------------------------------------
# MATCHES
# ------------------------------------------------------------
class Match(Base):
    __tablename__ = "matches"
    __table_args__ = (
        CheckConstraint("score BETWEEN 0 AND 100", name="ck_matches_score"),
        UniqueConstraint("job_id", "candidate_id", name="uq_matches_job_candidate"),
        Index("idx_matches_job_score", "job_id", "score"),
        Index("idx_matches_candidate", "candidate_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )

    score: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)

    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    job: Mapped["Job"] = relationship(back_populates="matches")
    candidate: Mapped["Candidate"] = relationship(back_populates="matches")


# ------------------------------------------------------------
# UPSKILLING RECOMMENDATIONS
# ------------------------------------------------------------
class UpskillRecommendation(Base):
    __tablename__ = "upskill_recommendations"
    __table_args__ = (
        UniqueConstraint(
            "candidate_id", "job_id", name="uq_upskill_candidate_job"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=_uuid
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
    )

    recommendations: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False)

    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now
    )

    # relationships
    candidate: Mapped["Candidate"] = relationship(back_populates="upskill_recommendations")
    job: Mapped["Job"] = relationship(back_populates="upskill_recommendations")
