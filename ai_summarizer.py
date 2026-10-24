"""
AI Overview Synthesizer for Search Engine.
Supports Gemini API integration when GEMINI_API_KEY is available,
with a robust local NLP synthesis engine fallback that cites sources.
"""

import os
import re
import urllib.parse
from typing import Dict, List, Any, Optional
import httpx


class AISummarizer:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    def generate_overview(self, query: str, search_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate an AI Overview summary with citations.
        Uses Gemini API if key is present, otherwise falls back to smart extractive synthesis.
        """
        q = query.strip()
        if not search_results:
            return {
                "summary": f"No sufficient web context found to synthesize an AI overview for **{q}**.",
                "bullets": [],
                "sources": [],
                "model": "RadarQuest-SmartSynthesizer",
            }

        # Check for Gemini API Key
        if self.api_key:
            try:
                gemini_res = self._call_gemini(q, search_results)
                if gemini_res:
                    return gemini_res
            except Exception as e:
                print(f"[AISummarizer] Gemini API call error: {e}")

        # Smart local synthesis fallback
        return self._local_synthesis(q, search_results)

    def _call_gemini(self, query: str, search_results: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Call Gemini REST API for full AI overview generation."""
        context_snippets = []
        sources = []
        for i, item in enumerate(search_results[:5]):
            context_snippets.append(f"[{i+1}] Title: {item.get('title')}\nSource: {item.get('domain')}\nSnippet: {item.get('snippet')}")
            sources.append({
                "index": i + 1,
                "title": item.get("title"),
                "url": item.get("url"),
                "domain": item.get("domain"),
                "favicon": item.get("favicon"),
            })

        prompt = (
            f"You are the Google AI Overview engine. The user searched for: '{query}'.\n"
            f"Synthesize an accurate, concise, helpful overview based on these top web results:\n\n"
            f"{chr(10).join(context_snippets)}\n\n"
            "Format requirements:\n"
            "1. Start with a direct 2-3 sentence overview answering the query.\n"
            "2. Follow with 3-4 bullet points highlighting key details, facts, or steps.\n"
            "3. Use bracket citations like [1], [2] referencing the source indices when making factual claims.\n"
            "Keep the tone objective, informative, and authoritative."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 600,
            }
        }

        with httpx.Client(timeout=12.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    return self._parse_ai_text(raw_text, sources, "Gemini 2.5 Flash")

        return None

    def _local_synthesis(self, query: str, search_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Intelligent local synthesis engine.
        Extracts core sentences, removes redundant boilerplate,
        formats structured bullet points, and attaches citation chips.
        """
        sources = []
        extracted_sentences = []

        for i, item in enumerate(search_results[:5]):
            snip = item.get("snippet", "").strip()
            title = item.get("title", "")
            domain = item.get("domain", "")
            
            sources.append({
                "index": i + 1,
                "title": title,
                "url": item.get("url"),
                "domain": domain,
                "favicon": item.get("favicon"),
            })

            # Split snippet into sentences
            sents = re.split(r"(?<=[.!?])\s+", snip)
            for s in sents:
                clean_s = s.strip()
                # Exclude trivial fragments or timestamps
                if len(clean_s) > 25 and not clean_s.startswith("...") and not clean_s.startswith("http"):
                    extracted_sentences.append((clean_s, i + 1))

        if not extracted_sentences:
            return {
                "summary": f"**{query.title()}** is an actively researched topic across modern web sources.",
                "bullets": [
                    f"Relevant articles and documentation are detailed in the search results below [1].",
                    f"Explore official platforms and community insights for more verified updates [2]."
                ],
                "sources": sources[:4],
                "model": "RadarQuest-SmartSynthesizer",
            }

        # Build intro summary (first 1-2 distinct sentences)
        intro_parts = []
        used_indices = set()
        for s, idx in extracted_sentences[:2]:
            intro_parts.append(f"{s} [{idx}]")
            used_indices.add(idx)

        summary_text = " ".join(intro_parts)
        if not summary_text.endswith("."):
            summary_text += "."

        # Build structured bullet points
        bullets = []
        for s, idx in extracted_sentences[2:6]:
            # Make bullet clean and action-oriented
            clean_b = s
            # Format leading words in bold if appropriate
            words = clean_b.split(" ", 2)
            if len(words) >= 3:
                clean_b = f"**{words[0]} {words[1]}**: {words[2]} [{idx}]"
            else:
                clean_b = f"{clean_b} [{idx}]"
            bullets.append(clean_b)

        if not bullets and len(extracted_sentences) > 1:
            bullets.append(f"**Key Fact**: {extracted_sentences[1][0]} [{extracted_sentences[1][1]}]")

        return {
            "summary": summary_text,
            "bullets": bullets,
            "sources": sources[:4],
            "model": "RadarQuest-SmartSynthesizer (Offline & Fast)",
        }

    def _parse_ai_text(self, text: str, sources: List[Dict[str, Any]], model_name: str) -> Dict[str, Any]:
        """Parse structured text from Gemini output into summary and bullets."""
        lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
        summary_lines = []
        bullets = []

        is_bullet_mode = False
        for line in lines:
            if line.startswith(("- ", "* ", "• ")) or re.match(r"^\d+\.\s+", line):
                is_bullet_mode = True
                cleaned = re.sub(r"^[-*•\d.]+\s*", "", line)
                bullets.append(cleaned)
            elif not is_bullet_mode:
                summary_lines.append(line)
            else:
                bullets.append(line)

        summary = " ".join(summary_lines) if summary_lines else lines[0] if lines else ""

        return {
            "summary": summary,
            "bullets": bullets,
            "sources": sources[:4],
            "model": model_name,
        }


# Singleton instance
ai_summarizer = AISummarizer()
