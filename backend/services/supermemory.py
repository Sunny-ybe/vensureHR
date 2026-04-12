"""
Supermemory service using the official supermemory Python SDK (v3).

Container tags partition memories per candidate — no separate "create space"
call is needed; tags are created implicitly on first write.

SDK docs: https://supermemory.ai/docs/memory-api/sdks/python
"""

from __future__ import annotations

import logging
import os
import uuid
from typing import Any

from supermemory import AsyncSupermemory
from supermemory._exceptions import APIStatusError, RateLimitError

logger = logging.getLogger(__name__)


class SupermemoryService:
    """
    Async Supermemory client.

    Usage (context manager — recommended):
        async with SupermemoryService() as svc:
            tag = svc.create_space(candidate_id)
            await svc.add_memory(tag, "John shipped...", {"source": "linkedin"})
            results = await svc.query_space(tag, "recent projects")

    Usage (manual):
        svc = SupermemoryService()
        await svc.open()
        ...
        await svc.close()
    """

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ["SUPERMEMORY_API_KEY"]
        self._client: AsyncSupermemory | None = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def open(self) -> None:
        self._client = AsyncSupermemory(api_key=self._api_key)

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None

    async def __aenter__(self) -> "SupermemoryService":
        await self.open()
        return self

    async def __aexit__(self, *_: Any) -> None:
        await self.close()

    def _ensure_client(self) -> AsyncSupermemory:
        if self._client is None:
            raise RuntimeError(
                "SupermemoryService is not open. "
                "Use `async with SupermemoryService() as svc:` or call `await svc.open()`."
            )
        return self._client

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def create_space(self, candidate_id: uuid.UUID | str) -> str:
        """
        Return a deterministic container tag for a candidate.

        Supermemory has no separate create-space endpoint; tags are created
        implicitly on first write. Store this tag in candidates.supermemory_id.
        """
        return f"candidate:{candidate_id}"

    async def add_memory(
        self,
        space_id: str,
        content: str,
        metadata: dict[str, str | float | bool | list[str]] | None = None,
        custom_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Add a document to a candidate's container.

        Args:
            space_id:   Container tag from create_space().
            content:    Raw text (post, repo description, resume chunk, etc.)
            metadata:   Flat key-value pairs. Values: str, float, bool, or list[str].
            custom_id:  Idempotency key (e.g. "linkedin:post:abc123").
                        Re-submitting the same custom_id is a no-op.

        Returns:
            {"id": "...", "status": "queued"}
        """
        client = self._ensure_client()
        kwargs: dict[str, Any] = {
            "content": content,
            "container_tags": [space_id],
        }
        if metadata:
            kwargs["metadata"] = metadata
        if custom_id:
            kwargs["custom_id"] = custom_id

        try:
            resp = await client.documents.add(**kwargs)
            return resp.model_dump()
        except RateLimitError:
            logger.warning("Supermemory rate limit hit on add_memory — SDK will retry automatically.")
            raise
        except APIStatusError as exc:
            logger.error("Supermemory add_memory failed: %s %s", exc.status_code, exc.message)
            raise

    async def query_space(
        self,
        space_id: str,
        query: str,
        limit: int = 10,
        rerank: bool = False,
    ) -> list[dict[str, Any]]:
        """
        Semantic search within a candidate's container.

        Args:
            space_id:  Container tag from create_space().
            query:     Natural language search query.
            limit:     Max results (default 10).
            rerank:    Re-score for higher relevance (~100ms overhead).

        Returns:
            List of result dicts with keys: id, similarity, memory/chunk, metadata.
        """
        client = self._ensure_client()
        try:
            resp = await client.search.execute(
                q=query,
                container_tags=[space_id],
                limit=limit,
                rerank=rerank,
            )
            results = resp.results or []
            return [r.model_dump() for r in results]
        except RateLimitError:
            logger.warning("Supermemory rate limit hit on query_space — SDK will retry automatically.")
            raise
        except APIStatusError as exc:
            logger.error("Supermemory query_space failed: %s %s", exc.status_code, exc.message)
            raise

    async def get_document_status(self, document_id: str) -> dict[str, Any]:
        """Poll ingestion status for a document. Status: queued → processing → done."""
        client = self._ensure_client()
        resp = await client.documents.get(document_id)
        return resp.model_dump()
