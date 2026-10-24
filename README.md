# 🛰️ RadarQuest Search Engine

A modern, high-performance search engine featuring live web results, AI Overviews (Perplexity & Google AI style), rich Knowledge Panels, multi-category tabs (Web, Images, News, Videos), real-time autocomplete, RadarQuest Lens visual search, and Web Speech API voice search.

---

## ✨ Features

- **Intuitive Modern Experience**:
  - Centered homepage with vibrant multi-color **RadarQuest** branding.
  - Minimalist search bar with instant autocomplete suggestions (powered by Google Suggest API).
  - "RadarQuest Search" and "I'm Feeling Lucky" buttons.
  - "RadarQuest offered in" multi-language bar and trending searches ticker.
  - Dark / Light mode toggle with smooth animated transitions.
  - 9-Dot Apps grid drawer and user account avatar.

- **Next-Gen Search Results Page (SERP)**:
  - **✨ AI Overview**: Generates structured overviews answering queries with bulleted takeaways and interactive citations `[1]`, `[2]` linking directly to sources.
  - **📖 Knowledge Panel**: Automatically retrieves entity summaries, high-resolution imagery, and key facts from Wikipedia.
  - **❓ People Also Ask (PAA)**: Expandable accordion questions and direct answers.
  - **🌐 Web Results**: Clean breadcrumbs, site favicons, snippets with keyword highlighting, copy link, and share triggers.
  - **🖼️ Images Search**: Responsive Pinterest-style grid with hover zoom, source badges, image dimensions, and full lightbox preview.
  - **📰 News Search**: Real-time headlines from Google News RSS with publisher logos and relative timestamps.
  - **🎬 Videos Search**: Video thumbnail cards with channel names, duration badges, and playable modal player.
  - **🔍 RadarQuest Lens**: Drag-and-drop or upload images and paste image URLs for visual subject matching.
  - **🎙️ Voice Search**: Web Speech API integration with animated pulsing multi-colored listening ring.
  - **RadarQuest Pagination**: Numbered page buttons with Next / Previous navigation.

---

## 🚀 How to Run

1. Open your terminal in the `search_engine` folder:
   ```bash
   cd search_engine
   ```

2. Run the server using Python:
   ```bash
   python run.py
   ```
   Or directly with Uvicorn:
   ```bash
   python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

3. Open your browser and visit:
   ```
   http://127.0.0.1:8000
   ```

---

## 🤖 Optional: Gemini AI Integration

Apex Search works 100% out of the box with zero configuration using its built-in smart extractive and abstractive NLP synthesis engine. 

To enable generative answers with Google's latest Gemini model, simply set your API key in your terminal before launching:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
python run.py
```

---

## 📂 Project Structure

```
search_engine/
├── app.py                # FastAPI server exposing search, autocomplete, knowledge, & lens endpoints
├── search_service.py     # Multi-source search aggregators (Web, News, Images, Videos, Wikipedia)
├── ai_summarizer.py      # AI Overview engine (Gemini API + smart local citation synthesizer)
├── run.py                # One-click startup script
├── requirements.txt      # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Google-inspired design system with CSS custom properties & dark/light mode
│   └── js/
│       └── app.js        # Client-side SPA routing, autocomplete, speech recognition, & SERP logic
└── templates/
    └── index.html        # Semantic HTML5 Google homepage & SERP interface
```
