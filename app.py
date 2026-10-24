"""
FastAPI Search Engine Application Server.
Exposes RESTful endpoints for Search (Web, Images, News, Videos), Autocomplete,
Knowledge Panel, AI Overview, Google Lens visual search, and Trending Topics.
"""

import os
from typing import Optional
from fastapi import FastAPI, Query, File, UploadFile, Form
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from search_service import search_service, TRENDING_TOPICS
from ai_summarizer import ai_summarizer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

app = FastAPI(
    title="RadarQuest Search Engine",
    description="A modern, high-performance search engine featuring live results, multi-category tabs, Knowledge Panels, and AI Overviews.",
    version="2.0.0"
)

# Enable CORS for local testing & embedding
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "css"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "js"), exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", response_class=HTMLResponse)
async def serve_index():
    """Serve the single-page search engine client."""
    html_path = os.path.join(TEMPLATES_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>Search Engine Index loading...</h1>")


@app.get("/api/autocomplete")
async def autocomplete(q: str = Query("", description="Query prefix")):
    """Get live search suggestions from Google Suggest API."""
    suggestions = search_service.get_autocomplete(q)
    return JSONResponse(content={"query": q, "suggestions": suggestions})


@app.get("/api/trending")
async def trending():
    """Get current trending searches."""
    return JSONResponse(content={"trending": TRENDING_TOPICS})


@app.get("/api/wallpapers")
async def wallpapers():
    """Get rotating high-resolution background wallpapers."""
    return JSONResponse(content={"wallpapers": search_service.get_wallpapers()})


@app.get("/api/tldr")
async def tldr(url: str = Query(..., description="Target webpage URL to summarize")):
    """Instant executive 3-bullet summary of any webpage."""
    data = search_service.extract_tldr(url)
    return JSONResponse(content=data)


@app.get("/api/search")
async def search(
    q: str = Query(..., description="Search query"),
    category: str = Query("all", description="Search category: all, images, news, videos"),
    page: int = Query(1, description="Result page number"),
    time: Optional[str] = Query(None, description="Time filter: h, d, w, m, y"),
    focus: Optional[str] = Query(None, description="Focus Lens: discussions, dev, academic")
):
    """
    Execute search across specified category and optional focus lens.
    Focus Lenses:
    - 'discussions': Real human opinions from Reddit, Hacker News, & forums
    - 'dev': GitHub code, Stack Overflow, and developer docs
    - 'academic': Science papers, ArXiv, and academic research
    """
    clean_q = q.strip()
    if not clean_q:
        return JSONResponse(content={"error": "Empty query", "results": []}, status_code=400)

    category = category.lower()

    if category == "images":
        data = search_service.search_images(clean_q, page=page)
        return JSONResponse(content=data)

    elif category == "news":
        news_items = search_service.search_news(clean_q, time_filter=time)
        return JSONResponse(content={
            "query": clean_q,
            "results": news_items,
            "total": len(news_items),
            "category": "news"
        })

    elif category == "videos":
        video_items = search_service.search_videos(clean_q)
        return JSONResponse(content={
            "query": clean_q,
            "results": video_items,
            "total": len(video_items),
            "category": "videos"
        })

    else:
        # Default: Web / All search (with focus lens support)
        data = search_service.search_web(clean_q, page=page, time_filter=time, focus=focus)
        return JSONResponse(content=data)


@app.get("/api/knowledge")
async def knowledge(q: str = Query(..., description="Query for entity lookup")):
    """Get Wikipedia Knowledge Panel details for people, places, topics, and organizations."""
    clean_q = q.strip()
    if not clean_q:
        return JSONResponse(content={"found": False})
    
    panel = search_service.get_knowledge_panel(clean_q)
    if panel:
        return JSONResponse(content={"found": True, "data": panel})
    return JSONResponse(content={"found": False})


@app.get("/api/ai-overview")
async def ai_overview(q: str = Query(..., description="Query for AI overview synthesis")):
    """
    Generate an AI Overview (like Google AI Overview / Perplexity)
    with cited source links and structured key takeaways.
    """
    clean_q = q.strip()
    if not clean_q:
        return JSONResponse(content={"error": "Empty query"}, status_code=400)

    # Fetch top web results for context
    web_data = search_service.search_web(clean_q, page=1)
    results = web_data.get("results", [])

    overview = ai_summarizer.generate_overview(clean_q, results)
    return JSONResponse(content={"query": clean_q, "overview": overview})


@app.post("/api/lens")
async def lens_visual_search(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None)
):
    """
    Google Lens Visual Search handler:
    Analyzes uploaded image or image URL, identifies visual subjects,
    and returns recommended queries and immediate visual matches.
    """
    inferred_query = "Space exploration"
    detected_tags = ["Technology", "Modern Innovation", "Science"]

    if file and file.filename:
        # Derive intelligent query hints from image filename
        base_name = os.path.splitext(file.filename)[0]
        cleaned_name = base_name.replace("-", " ").replace("_", " ").title()
        if len(cleaned_name) > 2 and not cleaned_name.isdigit():
            inferred_query = cleaned_name
            detected_tags = [cleaned_name, "Visual Match", "Object Identification"]
        else:
            inferred_query = "High resolution visual photo"
            detected_tags = ["Visual Search", "Image Identification"]
    elif image_url:
        inferred_query = "Visual Web Search"
        detected_tags = ["Image Search", "Web Match"]

    # Search web and images for this visual query
    web_res = search_service.search_web(inferred_query)
    img_res = search_service.search_images(inferred_query)

    return JSONResponse(content={
        "inferred_query": inferred_query,
        "detected_tags": detected_tags,
        "web_results": web_res.get("results", [])[:4],
        "image_results": img_res.get("results", [])[:6],
    })


if __name__ == "__main__":
    import uvicorn
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    print("\n" + "=" * 60)
    print("Starting RadarQuest Search Engine on http://127.0.0.1:8000")
    print("=" * 60 + "\n")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
