import json

from fastapi import APIRouter
from pydantic import BaseModel

from services.supermemory import SupermemoryService
from services.openai import chat_completion

router = APIRouter()


class QueryRequest(BaseModel):
    q: str


class CandidateMatch(BaseModel):
    id: str
    name: str
    reason: str
    score: float


@router.post("", response_model=list[CandidateMatch])
async def query(payload: QueryRequest):
    async with SupermemoryService() as svc:
        memories = await svc.query_space(
            space_id="candidate:",  # searches across all candidate containers
            query=payload.q,
            limit=10
        )

    context = "\n\n".join(
        f"ID: {m.get('metadata', {}).get('candidate_id', 'unknown')}\n"
        f"Name: {m.get('metadata', {}).get('name', 'unknown')}\n"
        f"Content: {m.get('chunk', '') or m.get('content', '')}"
        for m in memories
    )

    prompt = (
        "You are an HR assistant. Given the query and candidate context below, "
        "return a JSON array of the best matching candidates.\n"
        "Each item must have: id (string), name (string), reason (string), score (float 0-1).\n"
        "Return ONLY the JSON array, no extra text.\n\n"
        f"Query: {payload.q}\n\n"
        f"Candidates:\n{context}"
    )

    raw = await chat_completion(
        prompt,
        system="You are an HR ranking assistant. Return only valid JSON."
    )

    try:
        results = json.loads(raw)
    except json.JSONDecodeError:
        results = []

    return results