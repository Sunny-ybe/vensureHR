import os

from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

EMBED_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"


async def embed_text(text: str) -> list[float]:
    response = await client.embeddings.create(input=text, model=EMBED_MODEL)
    return response.data[0].embedding


async def chat_completion(prompt: str, system: str = "You are a helpful HR assistant.") -> str:
    response = await client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


async def parse_resume(resume_text: str) -> dict:
    prompt = (
        "Extract the following fields from this resume as JSON: "
        "name, email, skills (list), experience_years (int), education.\n\n"
        f"Resume:\n{resume_text}"
    )
    raw = await chat_completion(prompt, system="You are a resume parser. Return only valid JSON.")
    import json

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"raw": raw}
