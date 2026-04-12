"""
Seed Supermemory with all candidates in the database.

For each candidate:
  1. Derive a container tag via SupermemoryService.create_space()
  2. Update candidates.supermemory_id in PostgreSQL
  3. Seed the space with:
       - ai_summary (if set)
       - interview_notes (if set)
       - 3 realistic LinkedIn posts (first-person, candidate-specific)
       - 3 realistic tweets (first-person, candidate-specific)

Run:
    cd backend
    python3 seed_supermemory.py
"""

import asyncio
import os
import sys
from datetime import datetime, timezone

import asyncpg
from dotenv import load_dotenv

load_dotenv()

# Make sure local imports work when run from backend/
sys.path.insert(0, os.path.dirname(__file__))

from services.supermemory import SupermemoryService  # noqa: E402

DATABASE_URL = os.environ["DATABASE_URL"].replace(
    "postgresql+asyncpg://", "postgresql://"
)

# ---------------------------------------------------------------------------
# Per-candidate seed content
# Keys match the `name` column exactly as seeded in seed.py
# ---------------------------------------------------------------------------
CANDIDATE_CONTENT: dict[str, dict] = {
    "Aisha Patel": {
        "linkedin_posts": [
            {
                "date": "2026-03-15",
                "content": (
                    "Just shipped our new AI-powered search feature to 50k users 🚀 "
                    "Six months of work distilled into a single input box. "
                    "The trick was combining pgvector embeddings with a BM25 re-ranker — "
                    "relevance jumped 40% overnight. Huge thanks to the team. "
                    "Happy to chat if you're building something similar."
                ),
            },
            {
                "date": "2026-02-01",
                "content": (
                    "Finished Andrew Ng's LLM course on Coursera this weekend. "
                    "The fine-tuning section clicked in a way that reading papers never did. "
                    "Already sketching out how to apply RLHF concepts to our feedback loop at work. "
                    "Highly recommend to any engineer curious about the internals."
                ),
            },
            {
                "date": "2026-01-10",
                "content": (
                    "5 years in software and the thing I'm most proud of isn't a feature — "
                    "it's the PR review culture my team built. "
                    "We went from 3-day review cycles to same-day. "
                    "It's all about async comments, clear ownership, and zero ego. "
                    "Write-up coming soon."
                ),
            },
        ],
        "tweets": [
            {
                "date": "2026-03-20",
                "content": "hot take: the best RAG systems aren't about the retrieval — they're about what you do with the chunks after. cleaning > chunking > context. fight me.",
            },
            {
                "date": "2026-02-14",
                "content": "spent 3 hours debugging a prod issue today. turned out to be a timezone edge case in postgres. it's always the timezone. ALWAYS.",
            },
            {
                "date": "2026-01-05",
                "content": "just open-sourced a tiny react hook for debounced async search. built it for work, figured someone else could use it. link in bio 🔗",
            },
        ],
    },

    "Marcus Webb": {
        "linkedin_posts": [
            {
                "date": "2026-03-01",
                "content": (
                    "Led my team through a zero-downtime migration of a 200GB PostgreSQL database last week. "
                    "Blue-green deploy with logical replication — no user impact, no lost data. "
                    "The prep took 3 weeks; the actual cutover took 8 minutes. "
                    "That ratio is exactly how it should feel."
                ),
            },
            {
                "date": "2026-01-20",
                "content": (
                    "After 8 years of building, I've come to believe that the most important "
                    "engineering skill isn't technical — it's writing. "
                    "Clear design docs have saved my teams more time than any framework or tool. "
                    "If you can't explain it in prose, you don't understand it yet."
                ),
            },
            {
                "date": "2025-12-05",
                "content": (
                    "Gave a talk at our internal eng summit on distributed tracing with OpenTelemetry. "
                    "The room went from skeptical to sold in 20 minutes once I showed the flamegraphs. "
                    "Observability isn't optional at scale — it's the diff between a 5-min fix and a 5-hour war room."
                ),
            },
        ],
        "tweets": [
            {
                "date": "2026-03-10",
                "content": "if your microservices can't be deployed independently they're not microservices they're a distributed monolith and you should feel bad",
            },
            {
                "date": "2026-02-02",
                "content": "interviewed a senior engineer today who couldn't explain what a database index does. we're done here.",
            },
            {
                "date": "2026-01-15",
                "content": "postgres' EXPLAIN ANALYZE is the best debugging tool in existence. change my mind.",
            },
        ],
    },

    "Sofia Reyes": {
        "linkedin_posts": [
            {
                "date": "2026-03-22",
                "content": (
                    "Launched my third SaaS product solo last month 🎉 "
                    "React frontend, FastAPI backend, Stripe for billing. "
                    "Hit $200 MRR in week two — small, but real. "
                    "The fast.ai course fundamentally changed how I think about what software can do. "
                    "More ML features coming."
                ),
            },
            {
                "date": "2026-02-10",
                "content": (
                    "Unpopular opinion: most startups don't need a dedicated ML engineer. "
                    "They need a full-stack dev who understands when to call an API and when to train a model. "
                    "The line is blurrier than people think."
                ),
            },
            {
                "date": "2025-11-30",
                "content": (
                    "I track every hour I code outside of work. "
                    "This year: 620 hours on personal projects. "
                    "Not because I have to — because I genuinely can't stop. "
                    "Building things is the best feeling I know."
                ),
            },
        ],
        "tweets": [
            {
                "date": "2026-03-18",
                "content": "ships beat perfection. I've learned more from launching mediocre products than from architecting perfect ones I never shipped.",
            },
            {
                "date": "2026-02-28",
                "content": "next.js app router just saved me from writing 200 lines of data-fetching logic. ok fine. I'm a convert.",
            },
            {
                "date": "2026-01-03",
                "content": "my goal for 2026: build one thing per month. not big. just real. week 1 done ✅",
            },
        ],
    },

    "Daniel Kim": {
        "linkedin_posts": [
            {
                "date": "2026-03-05",
                "content": (
                    "Our engineering team shipped 94% test coverage this quarter — on a healthcare product. "
                    "I know coverage metrics are overrated, but in our domain, every missed branch is a risk. "
                    "Vitest + React Testing Library + Playwright. "
                    "Worth every hour we invested."
                ),
            },
            {
                "date": "2026-01-25",
                "content": (
                    "Just passed the AWS Solutions Architect Associate exam ☁️ "
                    "Third attempt. The networking section is brutal. "
                    "Genuinely useful cert — I understand our ECS + RDS setup at a much deeper level now."
                ),
            },
            {
                "date": "2025-12-15",
                "content": (
                    "Two years at a healthcare startup taught me that boring technology is a feature, not a bug. "
                    "Node.js, PostgreSQL, and a well-structured monorepo will take you very far. "
                    "Save the complexity budget for problems that actually need it."
                ),
            },
        ],
        "tweets": [
            {
                "date": "2026-03-12",
                "content": "a test that only passes in CI and fails locally is not a test. it's a haunting.",
            },
            {
                "date": "2026-02-08",
                "content": "spent today refactoring a 900-line React component into 7 components. it's like untangling headphones except satisfying.",
            },
            {
                "date": "2026-01-20",
                "content": "reminder that 'works on my machine' is a full-time villain origin story. use docker.",
            },
        ],
    },

    "Priya Nair": {
        "linkedin_posts": [
            {
                "date": "2026-03-28",
                "content": (
                    "Just shipped v1 of our internal LLM tooling platform — "
                    "a React dashboard that lets non-technical team members run structured prompts, "
                    "view outputs, and flag poor responses for retraining. "
                    "Closing the loop between ML and product has been the most interesting problem I've worked on."
                ),
            },
            {
                "date": "2026-02-15",
                "content": (
                    "The most underrated skill in ML engineering: knowing when NOT to use ML. "
                    "I've killed more model-based features than I've shipped — "
                    "because a regex or a lookup table was faster, cheaper, and more explainable. "
                    "Reach for the simple tool first."
                ),
            },
            {
                "date": "2026-01-08",
                "content": (
                    "Spoke at PyData this week on production ML pipelines with FastAPI + Celery. "
                    "The question I got most: how do you handle model versioning in prod? "
                    "Short answer: treat models like code. "
                    "Same branching, same review, same rollback strategy."
                ),
            },
        ],
        "tweets": [
            {
                "date": "2026-03-25",
                "content": "every time I see 'just fine-tune GPT' in a product spec I age 5 years",
            },
            {
                "date": "2026-02-20",
                "content": "fastapi + pydantic is genuinely the best DX I've ever had for building ML APIs. the automatic validation alone saves hours per week.",
            },
            {
                "date": "2026-01-11",
                "content": "pandas is fine. polars is better. but the best data tool is the one your whole team already knows how to debug at 2am.",
            },
        ],
    },
}


async def seed_candidate(
    conn: asyncpg.Connection,
    svc: SupermemoryService,
    row: asyncpg.Record,
) -> None:
    cid = str(row["id"])
    name = row["name"]
    ai_summary = row["ai_summary"]
    interview_notes = row["interview_notes"]

    content_data = CANDIDATE_CONTENT.get(name)
    if not content_data:
        print(f"  ⚠  No seed content defined for {name!r} — skipping")
        return

    # 1. Derive container tag
    space_id = svc.create_space(cid)

    # 2. Persist supermemory_id to DB
    await conn.execute(
        "UPDATE candidates SET supermemory_id = $1 WHERE id = $2",
        space_id,
        row["id"],
    )
    print(f"  ✓ space    {space_id}")

    # 3. Seed ai_summary
    if ai_summary:
        await svc.add_memory(
            space_id,
            ai_summary,
            metadata={"candidate_id": cid, "name": name, "source": "ai_summary"},
            custom_id=f"{cid}:ai_summary",
        )
        print(f"  ✓ ai_summary seeded")

    # 4. Seed interview_notes
    if interview_notes:
        await svc.add_memory(
            space_id,
            interview_notes,
            metadata={"candidate_id": cid, "name": name, "source": "interview_notes"},
            custom_id=f"{cid}:interview_notes",
        )
        print(f"  ✓ interview_notes seeded")

    # 5. Seed LinkedIn posts
    for i, post in enumerate(content_data["linkedin_posts"]):
        content = f"[LinkedIn — {post['date']}]\n{post['content']}"
        await svc.add_memory(
            space_id,
            content,
            metadata={
                "candidate_id": cid,
                "name": name,
                "source": "linkedin",
                "date": post["date"],
            },
            custom_id=f"{cid}:linkedin:{i}",
        )
    print(f"  ✓ {len(content_data['linkedin_posts'])} LinkedIn posts seeded")

    # 6. Seed tweets
    for i, tweet in enumerate(content_data["tweets"]):
        content = f"[Tweet — {tweet['date']}]\n{tweet['content']}"
        await svc.add_memory(
            space_id,
            content,
            metadata={
                "candidate_id": cid,
                "name": name,
                "source": "twitter",
                "date": tweet["date"],
            },
            custom_id=f"{cid}:tweet:{i}",
        )
    print(f"  ✓ {len(content_data['tweets'])} tweets seeded")


async def main() -> None:
    conn = await asyncpg.connect(DATABASE_URL)
    rows = await conn.fetch(
        "SELECT id, name, ai_summary, interview_notes FROM candidates ORDER BY created_at"
    )

    if not rows:
        print("No candidates found. Run seed.py first.")
        await conn.close()
        return

    print(f"Seeding {len(rows)} candidate(s) into Supermemory...\n")

    async with SupermemoryService() as svc:
        for row in rows:
            print(f"── {row['name']} ({row['id']})")
            await seed_candidate(conn, svc, row)
            print()

    await conn.close()
    print("✅ Supermemory seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
