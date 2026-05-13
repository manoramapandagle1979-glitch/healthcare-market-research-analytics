"""
generate-summaries.py

Reads lib/wp-data/reports.catalog.json, calls OpenRouter (gemini-2.0-flash)
for each report that doesn't already have a summary, and writes results to
lib/wp-data/reports.summaries.json incrementally so the script is resumable.

Usage:
    python scripts/generate-summaries.py

Environment:
    OPENROUTER_API_KEY  — required
    CONCURRENCY         — parallel requests (default: 8)
    SITE_URL            — HTTP-Referer header (default: https://curator.intelligence)
"""

import asyncio
import json
import os
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

_root = Path(__file__).parent.parent
load_dotenv(_root / ".env")
load_dotenv(_root / ".env.local", override=True)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
CATALOG_PATH   = Path("lib/wp-data/reports.catalog.json")
OUTPUT_PATH    = Path("lib/wp-data/reports.summaries.json")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL          = "google/gemini-2.0-flash-001"
CONCURRENCY    = int(os.getenv("CONCURRENCY", "8"))
SITE_URL       = os.getenv("SITE_URL", "https://curator.intelligence")

SYSTEM_PROMPT = (
    "You are a sharp market intelligence writer. Given structured data about a market "
    "research report, write a flowing, blog-style overview of 300-400 words.\n\n"
    "Guidelines:\n"
    "- Write in plain prose — no bullet points, no headers, no markdown formatting.\n"
    "- Open with a compelling first sentence that names the market and its headline figure "
    "(size or CAGR).\n"
    "- Cover: what the market is, what's driving growth, any notable challenges, and which "
    "region or segment leads.\n"
    "- Use an authoritative but readable tone — like a well-written analyst note, not a "
    "press release.\n"
    "- Weave in specific numbers wherever the source provides them.\n"
    "- End with a forward-looking sentence about the forecast period.\n"
    "- Output only the overview text, nothing else."
)

# ---------------------------------------------------------------------------
# Context builder (mirrors the TypeScript buildContext function)
# ---------------------------------------------------------------------------
def build_context(r: dict) -> str:
    lines = []
    if r.get("title"):        lines.append(f"Title: {r['title']}")
    if r.get("industry"):     lines.append(f"Industry: {r['industry']}")
    if r.get("studyPeriod"):  lines.append(f"Study period: {r['studyPeriod']}")
    if r.get("baseYear"):     lines.append(f"Base year: {r['baseYear']}")
    if r.get("cagr"):         lines.append(f"CAGR: {r['cagr']}%")
    if r.get("pages"):        lines.append(f"Report pages: {r['pages']}")
    tags = r.get("tags") or []
    if tags:                  lines.append(f"Key topics: {', '.join(tags)}")
    if r.get("excerpt"):      lines.append(f"\nExcerpt: {r['excerpt']}")
    return "\n".join(lines)

# ---------------------------------------------------------------------------
# Single report summariser
# ---------------------------------------------------------------------------
async def summarise(
    client: httpx.AsyncClient,
    report: dict,
    api_key: str,
    sem: asyncio.Semaphore,
) -> tuple[str, str | None]:
    """Returns (slug, summary_text | None)."""
    slug = report["slug"]
    context = build_context(report)
    if not context.strip():
        return slug, None

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": context},
        ],
        "max_tokens": 600,
        "temperature": 0.3,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type":  "application/json",
        "HTTP-Referer":  SITE_URL,
        "X-Title":       "Curator Intelligence - HMRA",
    }

    async with sem:
        for attempt in range(4):
            try:
                resp = await client.post(
                    OPENROUTER_URL,
                    json=payload,
                    headers=headers,
                    timeout=60,
                )
                if resp.status_code == 429:
                    wait = 2 ** (attempt + 2)
                    print(f"  [rate-limit] {slug} — waiting {wait}s", flush=True)
                    await asyncio.sleep(wait)
                    continue
                if resp.status_code != 200:
                    print(f"  [error {resp.status_code}] {slug}: {resp.text[:120]}", flush=True)
                    return slug, None
                data = resp.json()
                summary = data["choices"][0]["message"]["content"]
                return slug, summary.strip()
            except Exception as exc:
                wait = 2 ** (attempt + 1)
                print(f"  [exception attempt {attempt+1}] {slug}: {exc} — retry in {wait}s", flush=True)
                await asyncio.sleep(wait)
        return slug, None

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
async def main() -> None:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit("ERROR: OPENROUTER_API_KEY environment variable is not set.")

    print(f"Loading catalog from {CATALOG_PATH} …", flush=True)
    with open(CATALOG_PATH, encoding="utf-8") as f:
        catalog: list[dict] = json.load(f)
    print(f"  {len(catalog)} reports loaded.", flush=True)

    # Load existing summaries (for resumption)
    summaries: dict[str, str] = {}
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, encoding="utf-8") as f:
            existing = json.load(f)
        # Support both list-of-objects and dict formats on disk
        if isinstance(existing, list):
            summaries = {e["slug"]: e["summary"] for e in existing if e.get("summary")}
        elif isinstance(existing, dict):
            summaries = existing
        print(f"  Resuming — {len(summaries)} summaries already done.", flush=True)

    pending = [r for r in catalog if r["slug"] not in summaries]
    print(f"  {len(pending)} reports to summarise (concurrency={CONCURRENCY}).\n", flush=True)

    if not pending:
        print("Nothing to do — all reports already summarised.")
        return

    sem = asyncio.Semaphore(CONCURRENCY)
    done = 0
    failed = 0
    start = time.monotonic()

    async with httpx.AsyncClient() as client:
        tasks = [summarise(client, r, api_key, sem) for r in pending]

        for coro in asyncio.as_completed(tasks):
            slug, summary = await coro
            done += 1
            if summary:
                summaries[slug] = summary
                status = "ok"
            else:
                failed += 1
                status = "FAILED"

            elapsed = time.monotonic() - start
            rate = done / elapsed if elapsed > 0 else 0
            remaining = (len(pending) - done) / rate if rate > 0 else 0
            print(
                f"[{done}/{len(pending)}] {status:6s}  {slug[:60]:<60}  "
                f"{rate:.1f} r/s  ETA {remaining/60:.1f} min",
                flush=True,
            )

            # Save every 25 completions
            if done % 25 == 0 or done == len(pending):
                _save(summaries)

    _save(summaries)
    print(f"\nDone. {len(summaries)} summaries written to {OUTPUT_PATH}. ({failed} failed)")

def _save(summaries: dict[str, str]) -> None:
    output = [{"slug": slug, "summary": text} for slug, text in summaries.items()]
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if "--test" in sys.argv:
        # Summarise only the first report and print the result — no file written
        async def _test() -> None:
            api_key = os.getenv("OPENROUTER_API_KEY")
            if not api_key:
                sys.exit("ERROR: OPENROUTER_API_KEY not set.")
            with open(CATALOG_PATH, encoding="utf-8") as f:
                catalog = json.load(f)
            report = catalog[0]
            print(f"Testing with: {report['slug']}\n")
            print("--- Context ---")
            print(build_context(report))
            print("\n--- Calling OpenRouter … ---\n")
            sem = asyncio.Semaphore(1)
            async with httpx.AsyncClient() as client:
                slug, summary = await summarise(client, report, api_key, sem)
            if summary:
                print("--- Summary ---")
                print(summary)
                print(f"\n[{len(summary.split())} words]")
            else:
                print("FAILED — check errors above.")
        asyncio.run(_test())
    else:
        asyncio.run(main())
