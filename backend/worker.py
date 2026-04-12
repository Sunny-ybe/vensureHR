import os

from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery("vensurehr", broker=REDIS_URL, backend=REDIS_URL)
celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"
celery_app.conf.accept_content = ["json"]


@celery_app.task(name="process_resume_task")
def process_resume_task(candidate_id: int, resume_text: str) -> dict:
    """Parse and embed a candidate's resume, then store in Supermemory."""
    from services.openai import parse_resume
    from services.supermemory import add_memory

    parsed = parse_resume(resume_text)
    add_memory(
        content=resume_text,
        metadata={"candidate_id": candidate_id, "parsed": parsed},
    )
    return {"candidate_id": candidate_id, "status": "processed"}


@celery_app.task(name="scrape_job_task")
def scrape_job_task(job_id: int, url: str) -> dict:
    """Scrape a job posting URL and store content in Supermemory."""
    import asyncio

    from services.scraper import scrape_url
    from services.supermemory import add_memory

    content = asyncio.run(scrape_url(url))
    add_memory(
        content=content,
        metadata={"job_id": job_id, "source_url": url},
    )
    return {"job_id": job_id, "status": "scraped"}
