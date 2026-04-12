"""
Seed script — inserts a company, a job, and 5 realistic candidates.
Run: python3 seed.py
"""

import asyncio
import os
from datetime import datetime, timedelta, timezone

import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"].replace(
    "postgresql+asyncpg://", "postgresql://"
)


async def main() -> None:
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        # ----------------------------------------------------------------
        # Company
        # ----------------------------------------------------------------
        company_id = await conn.fetchval(
            """
            INSERT INTO companies (name, domain)
            VALUES ($1, $2)
            ON CONFLICT (domain) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            "VensureHR",
            "vensurehr.com",
        )
        print(f"✓ company   {company_id}")

        # ----------------------------------------------------------------
        # Job
        # ----------------------------------------------------------------
        job_id = await conn.fetchval(
            """
            INSERT INTO jobs (company_id, title, description, requirements, status)
            VALUES ($1, $2, $3, $4, 'open')
            RETURNING id
            """,
            company_id,
            "Senior Full Stack Engineer",
            "We need a senior engineer with React, Node.js, PostgreSQL, and AI/ML experience.",
            "React, Node.js, PostgreSQL, Python, REST APIs, AI/ML, Docker, AWS",
        )
        print(f"✓ job       {job_id}")

        # ----------------------------------------------------------------
        # Candidates
        # ----------------------------------------------------------------
        now = datetime.now(timezone.utc)

        candidates = [
            {
                "name": "Aisha Patel",
                "email": "aisha.patel@gmail.com",
                "current_title": "Senior Software Engineer",
                "linkedin_url": "https://linkedin.com/in/aishapatel",
                "github_handle": "aishapatel",
                "twitter_handle": "aisha_codes",
                "ai_summary": (
                    "5+ years building full-stack products with React and Node.js. "
                    "Recently shipped an AI-powered search feature at a Series B startup. "
                    "Strong PostgreSQL background with a growing interest in LLMs."
                ),
                "match_score": 91,
                "interviewed_at": now - timedelta(days=45),
            },
            {
                "name": "Marcus Webb",
                "email": "marcus.webb@outlook.com",
                "current_title": "Lead Engineer",
                "linkedin_url": "https://linkedin.com/in/marcuswebb",
                "github_handle": "mwebb-dev",
                "twitter_handle": "marcuswebb_io",
                "ai_summary": (
                    "8 years of experience across the full stack. Led a team of 6 engineers "
                    "at a fintech company. Deep expertise in distributed systems and PostgreSQL. "
                    "Contributed to several open-source React libraries."
                ),
                "match_score": 87,
                "interviewed_at": now - timedelta(days=90),
            },
            {
                "name": "Sofia Reyes",
                "email": "sofia.reyes@proton.me",
                "current_title": "Full Stack Developer",
                "linkedin_url": "https://linkedin.com/in/sofiareyes",
                "github_handle": "sofiabuilds",
                "twitter_handle": "sofiar_dev",
                "ai_summary": (
                    "4 years of product-focused full-stack development. "
                    "Built and deployed 3 SaaS products end-to-end using React and Python. "
                    "Recently completed a fast.ai course — actively exploring ML integrations."
                ),
                "match_score": 78,
                "interviewed_at": now - timedelta(days=210),
            },
            {
                "name": "Daniel Kim",
                "email": "daniel.kim@hey.com",
                "current_title": "Software Engineer II",
                "linkedin_url": "https://linkedin.com/in/danielkimeng",
                "github_handle": "dkim-eng",
                "twitter_handle": "danielkimtech",
                "ai_summary": (
                    "3 years at a healthcare startup working on React dashboards and Node.js APIs. "
                    "Solid PostgreSQL skills. Comfortable with AWS (ECS, RDS, S3). "
                    "Methodical engineer who writes thorough tests."
                ),
                "match_score": 72,
                "interviewed_at": now - timedelta(days=310),
            },
            {
                "name": "Priya Nair",
                "email": "priya.nair@fastmail.com",
                "current_title": "AI/ML Engineer",
                "linkedin_url": "https://linkedin.com/in/priyanair",
                "github_handle": "priyanair-ml",
                "twitter_handle": "priya_builds",
                "ai_summary": (
                    "ML engineer with 6 years of experience bridging data science and production "
                    "engineering. Strong Python and FastAPI background. Recently moved into full-stack "
                    "roles — built a React front-end for an internal LLM tooling platform."
                ),
                "match_score": 84,
                "interviewed_at": now - timedelta(days=120),
            },
        ]

        for c in candidates:
            cid = await conn.fetchval(
                """
                INSERT INTO candidates (
                    company_id, name, email,
                    linkedin_url, github_handle, twitter_handle,
                    consent_at, consent_ip,
                    interviewed_at
                ) VALUES (
                    $1, $2, $3,
                    $4, $5, $6,
                    NOW(), '127.0.0.1',
                    $7
                )
                ON CONFLICT (company_id, email) DO UPDATE
                    SET name = EXCLUDED.name
                RETURNING id
                """,
                company_id,
                c["name"],
                c["email"],
                c["linkedin_url"],
                c["github_handle"],
                c["twitter_handle"],
                c["interviewed_at"],
            )

            # Insert a match score for the seeded job
            await conn.execute(
                """
                INSERT INTO matches (job_id, candidate_id, score, reasoning)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (job_id, candidate_id) DO UPDATE
                    SET score = EXCLUDED.score, reasoning = EXCLUDED.reasoning
                """,
                job_id,
                cid,
                c["match_score"],
                c["ai_summary"],
            )

            print(f"✓ candidate {cid}  —  {c['name']}")

        print("\n✅ Seed complete.")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
