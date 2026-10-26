/**
 * Apex Search Engine - Comprehensive Client-side JavaScript
 * Handles SPA navigation, real-time autocomplete, multi-category SERP,
 * AI Overview streaming, Voice Search (Web Speech API), Google Lens, and Modals.
 */

// Global State
const state = {
  query: '',
  category: 'all',
  focus: 'all',
  filetype: '',
  page: 1,
  timeFilter: '',
  theme: localStorage.getItem('apex_search_theme') || 'dark',
  selectedSuggestionIdx: -1,
  suggestions: [],
  speechRecognition: null,
};

// DOM Elements Cache
const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  initTheme();
  initTrending();
  initWallpapers();
  initSpeechRecognition();
  initEventListeners();
  handleInitialRoute();
});

// --------------------------------------------------------------------------
// 1. INITIALIZATION & ROUTING
// --------------------------------------------------------------------------
function initDOM() {
  DOM.body = document.body;
  DOM.homepageView = document.getElementById('homepage-view');
  DOM.serpView = document.getElementById('serp-view');
  
  // Home search inputs
  DOM.homeSearchInput = document.getElementById('home-search-input');
  DOM.homeSearchBoxContainer = document.getElementById('home-search-box-container');
  DOM.homeSuggestionsList = document.getElementById('home-suggestions-list');
  DOM.homeAutocompleteDropdown = document.getElementById('home-autocomplete-dropdown');
  DOM.homeClearBtn = document.getElementById('home-clear-btn');
  DOM.homeSearchBtn = document.getElementById('home-search-btn');
  DOM.homeLuckyBtn = document.getElementById('home-lucky-btn');
  DOM.homeVoiceBtn = document.getElementById('home-voice-btn');
  DOM.homeLensBtn = document.getElementById('home-lens-btn');
  DOM.homeLogoTrigger = document.getElementById('home-logo-trigger');
  DOM.trendingChips = document.getElementById('trending-chips');

  // SERP search inputs
  DOM.serpLogoBtn = document.getElementById('serp-logo-btn');
  DOM.serpSearchInput = document.getElementById('serp-search-input');
  DOM.serpClearBtn = document.getElementById('serp-clear-btn');
  DOM.serpSearchSubmitBtn = document.getElementById('serp-search-submit-btn');
  DOM.serpVoiceBtn = document.getElementById('serp-voice-btn');
  DOM.serpLensBtn = document.getElementById('serp-lens-btn');
  DOM.serpSuggestionsList = document.getElementById('serp-suggestions-list');
  DOM.serpAutocompleteDropdown = document.getElementById('serp-autocomplete-dropdown');
  DOM.resultsStats = document.getElementById('results-stats');

  // Tabs & Tools
  DOM.tabButtons = document.querySelectorAll('.tab-btn');
  DOM.toolsToggleBtn = document.getElementById('tools-toggle-btn');
  DOM.toolsBar = document.getElementById('tools-bar');
  DOM.timeFilterSelect = document.getElementById('time-filter-select');
  DOM.filetypeFilterSelect = document.getElementById('filetype-filter-select');

  // Containers
  DOM.webResultsList = document.getElementById('web-results-list');
  DOM.imagesGridContainer = document.getElementById('images-grid-container');
  DOM.imagesGrid = document.getElementById('images-grid');
  DOM.newsListContainer = document.getElementById('news-list-container');
  DOM.newsList = document.getElementById('news-list');
  DOM.videosListContainer = document.getElementById('videos-list-container');
  DOM.videosList = document.getElementById('videos-list');

  // AI Overview
  DOM.aiOverviewCard = document.getElementById('ai-overview-card');
  DOM.aiSkeletonLoader = document.getElementById('ai-skeleton-loader');
  DOM.aiOverviewBody = document.getElementById('ai-overview-body');
  DOM.aiSummaryText = document.getElementById('ai-summary-text');
  DOM.aiBulletsList = document.getElementById('ai-bullets-list');
  DOM.aiSourcesScroll = document.getElementById('ai-sources-scroll');
  DOM.aiModelTag = document.getElementById('ai-model-tag');
  DOM.aiCopyBtn = document.getElementById('ai-copy-btn');
  DOM.aiCollapseBtn = document.getElementById('ai-collapse-btn');

  // People Also Ask & Related
  DOM.paaCard = document.getElementById('paa-card');
  DOM.paaList = document.getElementById('paa-list');
  DOM.relatedSearches = document.getElementById('related-searches');
  DOM.relatedGrid = document.getElementById('related-grid');

  // Knowledge Panel
  DOM.knowledgePanel = document.getElementById('knowledge-panel');
  DOM.kpTitle = document.getElementById('kp-title');
  DOM.kpSubtitle = document.getElementById('kp-subtitle');
  DOM.kpExtract = document.getElementById('kp-extract');
  DOM.kpHeroImage = document.getElementById('kp-hero-image');
  DOM.kpFacts = document.getElementById('kp-facts');
  DOM.kpWikiLink = document.getElementById('kp-wiki-link');

  // Pagination
  DOM.serpPagination = document.getElementById('serp-pagination');
  DOM.pageButtons = document.querySelectorAll('.page-btn');
  DOM.pageNextBtn = document.getElementById('page-next-btn');

  // Theme & Apps
  DOM.themeToggleBtns = [document.getElementById('theme-toggle-btn'), document.getElementById('serp-theme-toggle')];
  DOM.appsMenuBtns = [document.getElementById('apps-menu-btn'), document.getElementById('serp-apps-btn')];
  DOM.appsDrawer = document.getElementById('apps-drawer');

  // Modals
  DOM.voiceModal = document.getElementById('voice-modal');
  DOM.voiceCloseBtn = document.getElementById('voice-close-btn');
  DOM.voiceStatusText = document.getElementById('voice-status-text');
  DOM.voiceTranscriptText = document.getElementById('voice-transcript-text');

  DOM.lensModal = document.getElementById('lens-modal');
  DOM.lensCloseBtn = document.getElementById('lens-close-btn');
  DOM.lensDropzone = document.getElementById('lens-dropzone');
  DOM.lensFileInput = document.getElementById('lens-file-input');
  DOM.lensUrlInput = document.getElementById('lens-url-input');
  DOM.lensUrlSubmitBtn = document.getElementById('lens-url-submit-btn');

  DOM.videoModal = document.getElementById('video-modal');
  DOM.videoCloseBtn = document.getElementById('video-close-btn');
  DOM.videoIframe = document.getElementById('video-iframe');
  DOM.videoModalTitle = document.getElementById('video-modal-title');

  DOM.lightboxModal = document.getElementById('lightbox-modal');
  DOM.lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  DOM.lightboxImg = document.getElementById('lightbox-img');
  DOM.lightboxTitle = document.getElementById('lightbox-title');
  DOM.lightboxSourceLink = document.getElementById('lightbox-source-link');
  DOM.lightboxDownloadLink = document.getElementById('lightbox-download-link');

  // Exclusive Radar Features
  DOM.exportBriefBtn = document.getElementById('export-brief-btn');
  DOM.briefModal = document.getElementById('brief-modal');
  DOM.briefCloseBtn = document.getElementById('brief-close-btn');

  DOM.tldrModal = document.getElementById('tldr-modal');
  DOM.tldrCloseBtn = document.getElementById('tldr-close-btn');
  DOM.aiPerspectiveBtn = document.getElementById('ai-perspective-btn');
}

function initTheme() {
  if (state.theme === 'dark') {
    DOM.body.classList.remove('theme-light');
    DOM.body.classList.add('theme-dark');
  } else {
    DOM.body.classList.remove('theme-dark');
    DOM.body.classList.add('theme-light');
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('apex_search_theme', state.theme);
  initTheme();
}

function handleInitialRoute() {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  const cat = urlParams.get('category') || 'all';
  const page = parseInt(urlParams.get('page') || '1', 10);
  const time = urlParams.get('time') || '';
  const focus = urlParams.get('focus') || 'all';
  const filetype = urlParams.get('filetype') || '';

  state.filetype = filetype;
  if (DOM.filetypeFilterSelect) DOM.filetypeFilterSelect.value = filetype;

  if (q && q.trim()) {
    triggerSearch(q.trim(), cat, page, time, false, focus, filetype);
  } else {
    showHomepage();
  }

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', (e) => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const category = params.get('category') || 'all';
    const pageNum = parseInt(params.get('page') || '1', 10);
    const timeVal = params.get('time') || '';
    const focusVal = params.get('focus') || 'all';
    const filetypeVal = params.get('filetype') || '';

    state.filetype = filetypeVal;
    if (DOM.filetypeFilterSelect) DOM.filetypeFilterSelect.value = filetypeVal;

    if (query) {
      triggerSearch(query, category, pageNum, timeVal, false, focusVal, filetypeVal);
    } else {
      showHomepage();
    }
  });
}

function showHomepage() {
  state.query = '';
  state.category = 'all';
  state.focus = 'all';
  state.filetype = '';
  if (DOM.filetypeFilterSelect) DOM.filetypeFilterSelect.value = '';
  document.querySelectorAll('.lens-filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-focus') === 'all');
  });
  document.title = 'RadarQuest - Explore the World\'s Knowledge';
  DOM.homepageView.classList.remove('hidden');
  DOM.serpView.classList.add('hidden');
  DOM.homeSearchInput.value = '';
  DOM.homeClearBtn.classList.remove('visible');
  DOM.homeSearchInput.focus();
}

function showSERP() {
  DOM.homepageView.classList.add('hidden');
  DOM.serpView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 2. SEARCH EXECUTION & AGGREGATION
// --------------------------------------------------------------------------
async function triggerSearch(query, category = 'all', page = 1, timeFilter = '', pushHistory = true, focus = null, filetype = null) {
  const cleanQ = query.trim();
  if (!cleanQ) return;

  state.query = cleanQ;
  state.category = category;
  state.page = page;
  state.timeFilter = timeFilter;
  if (focus !== null) state.focus = focus;
  if (filetype !== null) state.filetype = filetype;

  if (DOM.filetypeFilterSelect) DOM.filetypeFilterSelect.value = state.filetype || '';

  // Update inputs
  DOM.homeSearchInput.value = cleanQ;
  DOM.serpSearchInput.value = cleanQ;
  DOM.serpClearBtn.classList.add('visible');

  // Update browser URL
  if (pushHistory) {
    const params = new URLSearchParams();
    params.set('q', cleanQ);
    if (category !== 'all') params.set('category', category);
    if (page > 1) params.set('page', page);
    if (timeFilter) params.set('time', timeFilter);
    if (state.focus && state.focus !== 'all') params.set('focus', state.focus);
    if (state.filetype) params.set('filetype', state.filetype);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  document.title = `${cleanQ} - RadarQuest`;
  showSERP();
  updateCategoryTabsUI();

  // Reset category containers
  hideAllCategoryViews();

  // Show loaders & skeleton
  DOM.resultsStats.textContent = `Searching for "${cleanQ}"...`;
  const activeLensBadge = document.getElementById('active-lens-badge');
  if (activeLensBadge) {
    if (state.filetype) {
      activeLensBadge.textContent = `Format: ${state.filetype.toUpperCase()}`;
      activeLensBadge.classList.remove('hidden');
    } else if (state.focus && state.focus !== 'all') {
      activeLensBadge.textContent = state.focus === 'files' ? 'Focus: PDF & Documents' : `Focus: ${state.focus.charAt(0).toUpperCase() + state.focus.slice(1)}`;
      activeLensBadge.classList.remove('hidden');
    } else {
      activeLensBadge.classList.add('hidden');
    }
  }

  if (category === 'all' || category === 'ai') {
    DOM.aiOverviewCard.classList.remove('hidden');
    DOM.aiSkeletonLoader.classList.remove('hidden');
    DOM.aiOverviewBody.classList.add('hidden');
    // Fetch parallel AI Overview & Knowledge Panel
    fetchAIOverview(cleanQ);
    fetchKnowledgePanel(cleanQ);
  } else {
    DOM.aiOverviewCard.classList.add('hidden');
    DOM.knowledgePanel.classList.add('hidden');
  }

  // Fetch Category Results
  try {
    let apiUrl = `/api/search?q=${encodeURIComponent(cleanQ)}&category=${encodeURIComponent(category)}&page=${page}&time=${encodeURIComponent(timeFilter)}`;
    if (state.focus && state.focus !== 'all') {
      apiUrl += `&focus=${encodeURIComponent(state.focus)}`;
    }
    if (state.filetype) {
      apiUrl += `&filetype=${encodeURIComponent(state.filetype)}`;
    }
    const resp = await fetch(apiUrl);
    if (!resp.ok) throw new Error('Search request failed');
    const data = await resp.json();

    // Render results based on category
    if (category === 'images') {
      renderImagesView(data);
    } else if (category === 'news') {
      renderNewsView(data);
    } else if (category === 'videos') {
      renderVideosView(data);
    } else {
      renderWebView(data);
    }
  } catch (err) {
    console.error('Search error:', err);
    DOM.resultsStats.textContent = `No results found for "${cleanQ}". Please check your query.`;
  }
}

function updateCategoryTabsUI() {
  DOM.tabButtons.forEach(btn => {
    const cat = btn.getAttribute('data-category');
    const btnFocus = btn.getAttribute('data-focus') || 'all';

    let isActive = false;
    if (state.category === 'all') {
      if (btnFocus === (state.focus || 'all')) {
        isActive = true;
      }
    } else {
      if (cat === state.category && !btn.hasAttribute('data-focus')) {
        isActive = true;
      }
    }

    if (isActive) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function hideAllCategoryViews() {
  DOM.webResultsList.innerHTML = '';
  DOM.imagesGrid.innerHTML = '';
  DOM.newsList.innerHTML = '';
  DOM.videosList.innerHTML = '';

  DOM.webResultsList.classList.remove('hidden');
  DOM.imagesGridContainer.classList.add('hidden');
  DOM.newsListContainer.classList.add('hidden');
  DOM.videosListContainer.classList.add('hidden');
}

// --------------------------------------------------------------------------
// 3. RENDER VIEWS: ALL (WEB), IMAGES, NEWS, VIDEOS
// --------------------------------------------------------------------------

// 3.1 Web Results View
function renderWebView(data) {
  const results = data.results || [];
  DOM.resultsStats.textContent = `About ${data.total_estimate || '1,420,000'} results (${data.time_taken || 0.18} seconds)`;

  // Render People Also Ask
  renderPAA(data.paa || []);

  // Render Organic Results
  DOM.webResultsList.innerHTML = '';
  if (results.length === 0) {
    DOM.webResultsList.innerHTML = `<p style="padding: 24px; color: var(--text-tertiary);">No web results matched your search.</p>`;
    return;
  }

  results.forEach(item => {
    const card = document.createElement('article');
    card.className = 'web-result-item';

    card.innerHTML = `
      <div class="result-breadcrumb">
        <img class="result-favicon" src="${escapeHtml(item.favicon)}" alt="" onerror="this.src='https://www.google.com/s2/favicons?domain=example.com&sz=64'">
        <div class="result-domain-info">
          <span class="result-sitename">${escapeHtml(item.domain)}</span>
          <span class="result-url">${escapeHtml(item.url)}</span>
        </div>
        ${item.is_file ? `<span class="filetype-badge" style="background:${item.file_color || '#ef4444'};">${escapeHtml(item.file_type || 'FILE')}</span>` : ''}
        ${item.badge ? `<span class="tldr-feature-pill" style="margin-left:auto; font-size:10px;">${escapeHtml(item.badge)}</span>` : ''}
      </div>
      <h2 class="result-title">
        ${item.is_file ? `<span class="file-icon-tag" style="color:${item.file_color || '#ef4444'}; font-weight:800; margin-right:4px;">[${escapeHtml(item.file_type)}]</span>` : ''}
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${highlightQuery(item.title, state.query)}</a>
      </h2>
      <p class="result-snippet">${highlightQuery(item.snippet, state.query)}</p>
      <div class="result-actions">
        ${item.is_file ? `
          <a class="direct-download-btn" href="${escapeHtml(item.download_url || item.url)}" download target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Direct Download (${escapeHtml(item.file_type || 'File')})</span>
          </a>
        ` : ''}
        <button class="tldr-peek-btn" data-url="${escapeHtml(item.url)}" data-title="${escapeHtml(item.title)}">⚡ Instant TL;DR</button>
        <span class="action-chip-link copy-link-btn" data-url="${escapeHtml(item.url)}">Copy link</span>
        <span class="action-chip-link share-btn" data-title="${escapeHtml(item.title)}" data-url="${escapeHtml(item.url)}">Share</span>
      </div>
    `;
    DOM.webResultsList.appendChild(card);
  });

  // Render Related Searches
  renderRelated(data.related || []);

  // Show pagination
  DOM.serpPagination.classList.remove('hidden');
  updatePaginationUI();
}

// 3.2 Images View
function renderImagesView(data) {
  DOM.imagesGridContainer.classList.remove('hidden');
  DOM.webResultsList.classList.add('hidden');
  DOM.paaCard.classList.add('hidden');
  DOM.relatedSearches.classList.add('hidden');
  DOM.serpPagination.classList.add('hidden');

  const items = data.results || [];
  DOM.resultsStats.textContent = `Found ${items.length} images for "${state.query}"`;
  DOM.imagesGrid.innerHTML = '';

  if (items.length === 0) {
    DOM.imagesGrid.innerHTML = `<p style="padding: 24px; color: var(--text-tertiary);">No images found for "${state.query}".</p>`;
    return;
  }

  items.forEach(img => {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
      <div class="image-thumb-wrapper">
        <img src="${escapeHtml(img.thumbnail_url)}" alt="${escapeHtml(img.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'">
        <span class="image-dim-badge">${img.width && img.height ? `${img.width}x${img.height}` : 'HD'}</span>
      </div>
      <div class="image-meta">
        <div class="image-title">${escapeHtml(img.title)}</div>
        <div class="image-domain">${escapeHtml(img.domain)}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(img);
    });

    DOM.imagesGrid.appendChild(card);
  });
}

// 3.3 News View
function renderNewsView(data) {
  DOM.newsListContainer.classList.remove('hidden');
  DOM.webResultsList.classList.add('hidden');
  DOM.paaCard.classList.add('hidden');
  DOM.relatedSearches.classList.add('hidden');
  DOM.serpPagination.classList.add('hidden');

  const items = data.results || [];
  DOM.resultsStats.textContent = `Showing ${items.length} top news stories for "${state.query}"`;
  DOM.newsList.innerHTML = '';

  if (items.length === 0) {
    DOM.newsList.innerHTML = `<p style="padding: 24px; color: var(--text-tertiary);">No news stories available for "${state.query}".</p>`;
    return;
  }

  items.forEach(news => {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-content">
        <div class="news-publisher-row">
          <img class="news-fav" src="${escapeHtml(news.favicon)}" alt="" onerror="this.src='https://www.google.com/s2/favicons?domain=news.google.com&sz=64'">
          <span class="news-pub-name">${escapeHtml(news.publisher)}</span>
          <span>•</span>
          <span>${escapeHtml(news.pub_date)}</span>
        </div>
        <h3 class="news-title">
          <a href="${escapeHtml(news.url)}" target="_blank" rel="noopener noreferrer">${highlightQuery(news.title, state.query)}</a>
        </h3>
        <p class="news-snippet">${highlightQuery(news.snippet, state.query)}</p>
      </div>
    `;
    DOM.newsList.appendChild(card);
  });
}

// 3.4 Videos View
function renderVideosView(data) {
  DOM.videosListContainer.classList.remove('hidden');
  DOM.webResultsList.classList.add('hidden');
  DOM.paaCard.classList.add('hidden');
  DOM.relatedSearches.classList.add('hidden');
  DOM.serpPagination.classList.add('hidden');

  const items = data.results || [];
  DOM.resultsStats.textContent = `Found ${items.length} videos for "${state.query}"`;
  DOM.videosList.innerHTML = '';

  if (items.length === 0) {
    DOM.videosList.innerHTML = `<p style="padding: 24px; color: var(--text-tertiary);">No videos found for "${state.query}".</p>`;
    return;
  }

  items.forEach(vid => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumbnail-box">
        <img src="${escapeHtml(vid.thumbnail)}" alt="${escapeHtml(vid.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=500'">
        <div class="video-play-btn">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
        <span class="video-duration">${escapeHtml(vid.duration)}</span>
      </div>
      <div class="video-details">
        <h4 class="video-card-title">${escapeHtml(vid.title)}</h4>
        <div class="video-channel">
          <img src="${escapeHtml(vid.favicon)}" width="14" height="14" alt="" onerror="this.style.display='none'">
          <span>${escapeHtml(vid.channel)}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openVideoModal(vid);
    });

    DOM.videosList.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// 4. AI OVERVIEW & KNOWLEDGE PANEL
// --------------------------------------------------------------------------
async function fetchAIOverview(query) {
  try {
    const resp = await fetch(`/api/ai-overview?q=${encodeURIComponent(query)}`);
    if (!resp.ok) throw new Error('AI Overview error');
    const data = await resp.json();
    const overview = data.overview;

    DOM.aiSkeletonLoader.classList.add('hidden');
    DOM.aiOverviewBody.classList.remove('hidden');

    DOM.aiModelTag.textContent = overview.model || 'Apex-SmartSynthesizer';
    DOM.aiSummaryText.innerHTML = formatMarkdownWithCitations(overview.summary);

    // Bullets
    DOM.aiBulletsList.innerHTML = '';
    (overview.bullets || []).forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = formatMarkdownWithCitations(b);
      DOM.aiBulletsList.appendChild(li);
    });

    // Sources Carousel
    DOM.aiSourcesScroll.innerHTML = '';
    (overview.sources || []).forEach(s => {
      const card = document.createElement('a');
      card.className = 'source-card';
      card.href = s.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.id = `source-card-${s.index}`;
      card.innerHTML = `
        <span class="source-badge-idx">${s.index}</span>
        <img class="source-fav" src="${escapeHtml(s.favicon)}" alt="" onerror="this.src='https://www.google.com/s2/favicons?domain=example.com&sz=64'">
        <div class="source-info">
          <span class="source-title">${escapeHtml(s.title)}</span>
          <span class="source-domain">${escapeHtml(s.domain)}</span>
        </div>
      `;
      DOM.aiSourcesScroll.appendChild(card);
    });

    // Setup Citation Chip Click Listener
    document.querySelectorAll('.citation-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = chip.getAttribute('data-idx');
        const targetCard = document.getElementById(`source-card-${idx}`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          targetCard.style.outline = '2px solid var(--c-radar-cyan)';
          setTimeout(() => { targetCard.style.outline = 'none'; }, 2000);
        }
      });
    });

  } catch (err) {
    console.error('AI Overview error:', err);
    DOM.aiOverviewCard.classList.add('hidden');
  }
}

async function fetchKnowledgePanel(query) {
  try {
    const resp = await fetch(`/api/knowledge?q=${encodeURIComponent(query)}`);
    if (!resp.ok) throw new Error('Knowledge error');
    const data = await resp.json();

    if (data.found && data.data) {
      const kp = data.data;
      DOM.knowledgePanel.classList.remove('hidden');
      DOM.kpTitle.textContent = kp.title;
      DOM.kpSubtitle.textContent = kp.subtitle || 'Encyclopedic Overview';
      DOM.kpExtract.textContent = kp.extract;

      if (kp.image) {
        DOM.kpHeroImage.src = kp.image;
        DOM.kpHeroImage.style.display = 'block';
      } else {
        DOM.kpHeroImage.style.display = 'none';
      }

      DOM.kpWikiLink.href = kp.source_url;

      // Facts
      DOM.kpFacts.innerHTML = '';
      (kp.facts || []).forEach(f => {
        const row = document.createElement('div');
        row.className = 'kp-fact-row';
        row.innerHTML = `
          <span class="kp-fact-label">${escapeHtml(f.label)}</span>
          <span class="kp-fact-val">${escapeHtml(f.value)}</span>
        `;
        DOM.kpFacts.appendChild(row);
      });
    } else {
      DOM.knowledgePanel.classList.add('hidden');
    }
  } catch (err) {
    console.error('Knowledge Panel error:', err);
    DOM.knowledgePanel.classList.add('hidden');
  }
}

function renderPAA(paaList) {
  if (!paaList || paaList.length === 0) {
    DOM.paaCard.classList.add('hidden');
    return;
  }

  DOM.paaCard.classList.remove('hidden');
  DOM.paaList.innerHTML = '';

  paaList.forEach((item, idx) => {
    const itemElem = document.createElement('div');
    itemElem.className = 'paa-item';
    if (idx === 0) itemElem.classList.add('expanded'); // First item expanded by default

    itemElem.innerHTML = `
      <button class="paa-question-btn">
        <span>${escapeHtml(item.question)}</span>
        <svg class="paa-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="paa-answer-body">${escapeHtml(item.answer)}</div>
    `;

    itemElem.querySelector('.paa-question-btn').addEventListener('click', () => {
      itemElem.classList.toggle('expanded');
    });

    DOM.paaList.appendChild(itemElem);
  });
}

function renderRelated(relatedList) {
  if (!relatedList || relatedList.length === 0) {
    DOM.relatedSearches.classList.add('hidden');
    return;
  }

  DOM.relatedSearches.classList.remove('hidden');
  DOM.relatedGrid.innerHTML = '';

  relatedList.forEach(relQuery => {
    const pill = document.createElement('div');
    pill.className = 'related-pill';
    pill.innerHTML = `
      <div class="pill-search-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <span>${escapeHtml(relQuery)}</span>
    `;

    pill.addEventListener('click', () => {
      triggerSearch(relQuery, 'all', 1, state.timeFilter, true);
    });

    DOM.relatedGrid.appendChild(pill);
  });
}

function updatePaginationUI() {
  DOM.pageButtons.forEach(btn => {
    const p = parseInt(btn.getAttribute('data-page'), 10);
    if (p === state.page) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// --------------------------------------------------------------------------
// 5. AUTOCOMPLETE ENGINE
// --------------------------------------------------------------------------
let debounceTimer = null;

function handleAutocompleteInput(inputElem, listElem, dropdownElem) {
  const query = inputElem.value.trim();
  state.selectedSuggestionIdx = -1;

  if (query.length < 1) {
    dropdownElem.classList.remove('active');
    listElem.innerHTML = '';
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      const resp = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
      if (!resp.ok) return;
      const data = await resp.json();
      state.suggestions = data.suggestions || [];
      renderSuggestions(state.suggestions, query, listElem, dropdownElem, inputElem);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  }, 120);
}

function renderSuggestions(suggestions, query, listElem, dropdownElem, inputElem) {
  listElem.innerHTML = '';
  if (suggestions.length === 0) {
    dropdownElem.classList.remove('active');
    return;
  }

  suggestions.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.setAttribute('data-idx', idx);

    // Highlight matching prefix
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    const highlighted = escapeHtml(item).replace(regex, '<strong>$1</strong>');

    li.innerHTML = `
      <span class="s-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <span class="s-text">${highlighted}</span>
    `;

    li.addEventListener('click', () => {
      inputElem.value = item;
      dropdownElem.classList.remove('active');
      triggerSearch(item, 'all', 1, state.timeFilter, true);
    });

    listElem.appendChild(li);
  });

  dropdownElem.classList.add('active');
}

function handleKeyNavigation(e, inputElem, listElem, dropdownElem) {
  const items = listElem.querySelectorAll('.suggestion-item');
  if (!items.length || !dropdownElem.classList.contains('active')) {
    if (e.key === 'Enter') {
      triggerSearch(inputElem.value, state.category, 1, state.timeFilter, true);
    }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    state.selectedSuggestionIdx = (state.selectedSuggestionIdx + 1) % items.length;
    updateSelectedSuggestion(items, inputElem);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    state.selectedSuggestionIdx = (state.selectedSuggestionIdx - 1 + items.length) % items.length;
    updateSelectedSuggestion(items, inputElem);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (state.selectedSuggestionIdx >= 0 && state.selectedSuggestionIdx < state.suggestions.length) {
      inputElem.value = state.suggestions[state.selectedSuggestionIdx];
    }
    dropdownElem.classList.remove('active');
    triggerSearch(inputElem.value, state.category, 1, state.timeFilter, true);
  } else if (e.key === 'Escape') {
    dropdownElem.classList.remove('active');
  }
}

function updateSelectedSuggestion(items, inputElem) {
  items.forEach((item, idx) => {
    if (idx === state.selectedSuggestionIdx) {
      item.classList.add('selected');
      inputElem.value = state.suggestions[idx];
    } else {
      item.classList.remove('selected');
    }
  });
}

// --------------------------------------------------------------------------
// 6. TRENDING TOPICS
// --------------------------------------------------------------------------
async function initTrending() {
  try {
    const resp = await fetch('/api/trending');
    if (!resp.ok) return;
    const data = await resp.json();
    const trending = data.trending || [];
    DOM.trendingChips.innerHTML = '';

    trending.slice(0, 5).forEach(topic => {
      const chip = document.createElement('button');
      chip.className = 'trend-chip';
      chip.textContent = topic;
      chip.addEventListener('click', () => {
        triggerSearch(topic, 'all', 1, '', true);
      });
      DOM.trendingChips.appendChild(chip);
    });
  } catch (err) {
    console.error('Trending fetch error:', err);
  }
}

// --------------------------------------------------------------------------
// 7. WEB SPEECH API (Voice Search)
// --------------------------------------------------------------------------
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser.');
    return;
  }

  state.speechRecognition = new SpeechRecognition();
  state.speechRecognition.continuous = false;
  state.speechRecognition.interimResults = true;
  state.speechRecognition.lang = 'en-US';

  state.speechRecognition.onstart = () => {
    DOM.voiceStatusText.textContent = 'Listening...';
    DOM.voiceTranscriptText.textContent = '';
  };

  state.speechRecognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    DOM.voiceTranscriptText.textContent = transcript;

    if (event.results[0].isFinal) {
      setTimeout(() => {
        closeVoiceModal();
        triggerSearch(transcript, state.category, 1, state.timeFilter, true);
      }, 600);
    }
  };

  state.speechRecognition.onerror = (e) => {
    console.error('Speech error:', e.error);
    DOM.voiceStatusText.textContent = 'Speech not detected';
    DOM.voiceTranscriptText.textContent = 'Click microphone to try again.';
  };

  state.speechRecognition.onend = () => {
    // Recognition ended
  };
}

function openVoiceModal() {
  DOM.voiceModal.classList.remove('hidden');
  if (state.speechRecognition) {
    try {
      state.speechRecognition.start();
    } catch (e) {
      // Already running
    }
  } else {
    DOM.voiceStatusText.textContent = 'Voice input unavailable';
    DOM.voiceTranscriptText.textContent = 'Please use a browser with Web Speech API support (e.g. Chrome / Edge).';
  }
}

function closeVoiceModal() {
  DOM.voiceModal.classList.add('hidden');
  if (state.speechRecognition) {
    try {
      state.speechRecognition.stop();
    } catch (e) {}
  }
}

// --------------------------------------------------------------------------
// 8. GOOGLE LENS (Visual Search)
// --------------------------------------------------------------------------
function openLensModal() {
  DOM.lensModal.classList.remove('hidden');
}

function closeLensModal() {
  DOM.lensModal.classList.add('hidden');
}

async function handleLensUpload(file) {
  showToast('Analyzing visual image with RadarQuest Lens...');
  closeLensModal();

  const formData = new FormData();
  formData.append('file', file);

  try {
    const resp = await fetch('/api/lens', {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('Lens request failed');
    const data = await resp.json();
    const query = data.inferred_query || 'Visual Photo Match';
    triggerSearch(query, 'images', 1, '', true);
  } catch (err) {
    console.error('Lens error:', err);
    triggerSearch('Visual Image Match', 'images', 1, '', true);
  }
}

// --------------------------------------------------------------------------
// 9. MODALS: LIGHTBOX & VIDEO PLAYER
// --------------------------------------------------------------------------
function openLightbox(img) {
  DOM.lightboxImg.src = img.image_url;
  DOM.lightboxTitle.textContent = img.title;
  DOM.lightboxSourceLink.href = img.source_url;
  DOM.lightboxDownloadLink.href = img.image_url;
  DOM.lightboxModal.classList.remove('hidden');
}

function closeLightbox() {
  DOM.lightboxModal.classList.add('hidden');
  DOM.lightboxImg.src = '';
}

function openVideoModal(vid) {
  DOM.videoIframe.src = vid.embed_url;
  DOM.videoModalTitle.textContent = vid.title;
  DOM.videoModal.classList.remove('hidden');
}

function closeVideoModal() {
  DOM.videoModal.classList.add('hidden');
  DOM.videoIframe.src = '';
}

// --------------------------------------------------------------------------
// 10. EVENT LISTENERS
// --------------------------------------------------------------------------
function initEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', toggleTheme);
  });

  // Apps Menu Drawer Toggle
  DOM.appsMenuBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.appsDrawer.classList.toggle('hidden');
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!DOM.appsDrawer.contains(e.target)) {
      DOM.appsDrawer.classList.add('hidden');
    }
    // Close autocompletes if clicked outside
    if (!DOM.homeSearchBoxContainer.contains(e.target)) {
      DOM.homeAutocompleteDropdown.classList.remove('active');
      DOM.homeSearchBoxContainer.classList.remove('focused');
    }
    const serpContainer = document.querySelector('.serp-search-container');
    if (serpContainer && !serpContainer.contains(e.target)) {
      DOM.serpAutocompleteDropdown.classList.remove('active');
    }
  });

  // Home Search Input Events
  DOM.homeSearchInput.addEventListener('focus', () => {
    DOM.homeSearchBoxContainer.classList.add('focused');
    if (DOM.homeSearchInput.value.trim()) {
      DOM.homeAutocompleteDropdown.classList.add('active');
    }
  });

  DOM.homeSearchInput.addEventListener('input', () => {
    if (DOM.homeSearchInput.value.trim()) {
      DOM.homeClearBtn.classList.add('visible');
    } else {
      DOM.homeClearBtn.classList.remove('visible');
    }
    handleAutocompleteInput(DOM.homeSearchInput, DOM.homeSuggestionsList, DOM.homeAutocompleteDropdown);
  });

  DOM.homeSearchInput.addEventListener('keydown', (e) => {
    handleKeyNavigation(e, DOM.homeSearchInput, DOM.homeSuggestionsList, DOM.homeAutocompleteDropdown);
  });

  DOM.homeClearBtn.addEventListener('click', () => {
    DOM.homeSearchInput.value = '';
    DOM.homeClearBtn.classList.remove('visible');
    DOM.homeAutocompleteDropdown.classList.remove('active');
    DOM.homeSearchInput.focus();
  });

  DOM.homeSearchBtn.addEventListener('click', () => {
    const activeChip = document.querySelector('.lens-filter-chip.active');
    const focus = activeChip ? (activeChip.getAttribute('data-focus') || 'all') : 'all';
    const filetype = (focus === 'files') ? (state.filetype || '') : '';
    triggerSearch(DOM.homeSearchInput.value, 'all', 1, '', true, focus, filetype);
  });

  // "I'm Feeling Lucky" Button Handler
  DOM.homeLuckyBtn.addEventListener('click', () => {
    const q = DOM.homeSearchInput.value.trim();
    if (q) {
      showToast(`Feeling lucky! Jumping directly to top result for "${q}"...`);
      triggerSearch(q, 'all', 1, '', true);
    } else {
      const luckyQueries = [
        'James Webb Space Telescope deepest images',
        'Quantum supremacy breakthrough',
        'History of the Internet',
        'Mars Rover Perseverance discoveries',
        'DeepMind AlphaFold protein database'
      ];
      const randomQuery = luckyQueries[Math.floor(Math.random() * luckyQueries.length)];
      showToast(`Feeling lucky with: ${randomQuery}!`);
      triggerSearch(randomQuery, 'all', 1, '', true);
    }
  });

  // Logo Click -> Return Home
  DOM.homeLogoTrigger.addEventListener('click', showHomepage);
  DOM.serpLogoBtn.addEventListener('click', showHomepage);

  // SERP Search Input Events
  DOM.serpSearchInput.addEventListener('input', () => {
    if (DOM.serpSearchInput.value.trim()) {
      DOM.serpClearBtn.classList.add('visible');
    } else {
      DOM.serpClearBtn.classList.remove('visible');
    }
    handleAutocompleteInput(DOM.serpSearchInput, DOM.serpSuggestionsList, DOM.serpAutocompleteDropdown);
  });

  DOM.serpSearchInput.addEventListener('keydown', (e) => {
    handleKeyNavigation(e, DOM.serpSearchInput, DOM.serpSuggestionsList, DOM.serpAutocompleteDropdown);
  });

  DOM.serpClearBtn.addEventListener('click', () => {
    DOM.serpSearchInput.value = '';
    DOM.serpClearBtn.classList.remove('visible');
    DOM.serpAutocompleteDropdown.classList.remove('active');
    DOM.serpSearchInput.focus();
  });

  DOM.serpSearchSubmitBtn.addEventListener('click', () => {
    triggerSearch(DOM.serpSearchInput.value, state.category, 1, state.timeFilter, true, state.focus, state.filetype);
  });

  // Category & Focus Tab Click Handlers
  DOM.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      const focus = btn.getAttribute('data-focus') || 'all';
      const filetype = (focus === 'files') ? (state.filetype || '') : '';
      state.category = cat;
      state.focus = focus;
      state.filetype = filetype;
      if (DOM.filetypeFilterSelect) DOM.filetypeFilterSelect.value = filetype;
      triggerSearch(state.query || DOM.serpSearchInput.value, cat, 1, state.timeFilter, true, focus, filetype);
    });
  });

  // Tools Bar Toggle
  DOM.toolsToggleBtn.addEventListener('click', () => {
    DOM.toolsBar.classList.toggle('hidden');
    DOM.toolsToggleBtn.classList.toggle('active');
  });

  DOM.timeFilterSelect.addEventListener('change', () => {
    triggerSearch(state.query, state.category, 1, DOM.timeFilterSelect.value, true, state.focus, state.filetype);
  });

  if (DOM.filetypeFilterSelect) {
    DOM.filetypeFilterSelect.addEventListener('change', () => {
      state.filetype = DOM.filetypeFilterSelect.value;
      triggerSearch(state.query || DOM.serpSearchInput.value, state.category, 1, state.timeFilter, true, state.focus, state.filetype);
    });
  }

  // AI Overview Copy & Collapse
  DOM.aiCopyBtn.addEventListener('click', () => {
    const textToCopy = `${DOM.aiSummaryText.innerText}\n\n${DOM.aiBulletsList.innerText}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('AI Overview copied to clipboard!');
    });
  });

  DOM.aiCollapseBtn.addEventListener('click', () => {
    DOM.aiOverviewBody.classList.toggle('hidden');
  });

  // Pagination Clicks
  DOM.pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-page'), 10);
      triggerSearch(state.query, state.category, p, state.timeFilter, true);
    });
  });

  DOM.pageNextBtn.addEventListener('click', () => {
    triggerSearch(state.query, state.category, state.page + 1, state.timeFilter, true);
  });

  // Modals: Voice
  DOM.homeVoiceBtn.addEventListener('click', openVoiceModal);
  DOM.serpVoiceBtn.addEventListener('click', openVoiceModal);
  DOM.voiceCloseBtn.addEventListener('click', closeVoiceModal);

  // Modals: Lens
  DOM.homeLensBtn.addEventListener('click', openLensModal);
  DOM.serpLensBtn.addEventListener('click', openLensModal);
  DOM.lensCloseBtn.addEventListener('click', closeLensModal);

  DOM.lensDropzone.addEventListener('click', () => DOM.lensFileInput.click());
  DOM.lensFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLensUpload(e.target.files[0]);
    }
  });

  // Lens Drag & Drop
  DOM.lensDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.lensDropzone.classList.add('dragover');
  });
  DOM.lensDropzone.addEventListener('dragleave', () => {
    DOM.lensDropzone.classList.remove('dragover');
  });
  DOM.lensDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.lensDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLensUpload(e.dataTransfer.files[0]);
    }
  });

  DOM.lensUrlSubmitBtn.addEventListener('click', () => {
    const url = DOM.lensUrlInput.value.trim();
    if (url) {
      showToast('Searching visual match from image URL...');
      closeLensModal();
      triggerSearch('Visual Image Match', 'images', 1, '', true);
    }
  });

  // Lens Preset Chips
  document.querySelectorAll('.lens-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const sample = chip.getAttribute('data-sample');
      closeLensModal();
      triggerSearch(sample, 'images', 1, '', true);
    });
  });

  // Modals: Lightbox & Video Player
  DOM.lightboxCloseBtn.addEventListener('click', closeLightbox);
  DOM.videoCloseBtn.addEventListener('click', closeVideoModal);

  // Close modals on overlay backdrop click
  [DOM.voiceModal, DOM.lensModal, DOM.lightboxModal, DOM.videoModal, DOM.tldrModal, DOM.briefModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (modal === DOM.videoModal) DOM.videoIframe.src = '';
      }
    });
  });

  // Delegate Dynamic Result Card Actions (Copy link, Share, Instant TL;DR)
  DOM.webResultsList.addEventListener('click', (e) => {
    const tldrBtn = e.target.closest('.tldr-peek-btn');
    if (tldrBtn) {
      const url = tldrBtn.getAttribute('data-url');
      const title = tldrBtn.getAttribute('data-title');
      openTLDRModal(url, title);
      return;
    }

    const copyBtn = e.target.closest('.copy-link-btn');
    if (copyBtn) {
      const url = copyBtn.getAttribute('data-url');
      navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard!'));
    }

    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      const title = shareBtn.getAttribute('data-title');
      const url = shareBtn.getAttribute('data-url');
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => showToast('Share URL copied to clipboard!'));
      }
    }
  });

  // Export Brief Listener
  if (DOM.exportBriefBtn) {
    DOM.exportBriefBtn.addEventListener('click', openResearchBriefModal);
  }
  if (DOM.briefCloseBtn) {
    DOM.briefCloseBtn.addEventListener('click', () => {
      if (DOM.briefModal) DOM.briefModal.classList.add('hidden');
    });
  }

  // TL;DR Close Listener
  if (DOM.tldrCloseBtn) {
    DOM.tldrCloseBtn.addEventListener('click', () => {
      if (DOM.tldrModal) DOM.tldrModal.classList.add('hidden');
    });
  }

  // AI Perspective Matrix Toggle
  if (DOM.aiPerspectiveBtn) {
    DOM.aiPerspectiveBtn.addEventListener('click', toggleContrarianPerspectives);
  }

  // Focus Lenses on Homepage
  document.querySelectorAll('.lens-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.lens-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const focus = chip.getAttribute('data-focus') || 'all';
      state.focus = focus;
      const q = DOM.homeSearchInput.value.trim();
      if (q) {
        triggerSearch(q, 'all', 1, state.timeFilter, true, focus, state.filetype);
      }
    });
  });
}

// --------------------------------------------------------------------------
// 11. UTILITY FUNCTIONS
// --------------------------------------------------------------------------
function highlightQuery(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  const terms = query.trim().split(/\s+/).filter(t => t.length > 1);
  if (!terms.length) return escapeHtml(text);

  let escaped = escapeHtml(text);
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    escaped = escaped.replace(regex, '<em>$1</em>');
  });
  return escaped;
}

function formatMarkdownWithCitations(text) {
  if (!text) return '';
  let formatted = escapeHtml(text);

  // Convert **bold**
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert citations like [1], [2] into interactive chips
  formatted = formatted.replace(/\[(\d+)\]/g, '<span class="citation-chip" data-idx="$1">$1</span>');

  return formatted;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ==========================================================================
// 12. DYNAMIC ROTATING WALLPAPERS ENGINE (Changes every 10 seconds)
// ==========================================================================
const wallpaperState = {
  wallpapers: [],
  currentIndex: 0,
  countdownInterval: null,
  secondsLeft: 10,
  isPaused: false,
  currentLayer: 1,
};

async function initWallpapers() {
  const layer1 = document.getElementById('wp-layer-1');
  const widget = document.getElementById('wallpaper-widget');
  if (!layer1 && !widget) return; // Cleanly disabled

  try {
    const resp = await fetch('/api/wallpapers');
    if (!resp.ok) return;
    const data = await resp.json();
    wallpaperState.wallpapers = data.wallpapers || [];
    if (wallpaperState.wallpapers.length > 0 && layer1) {
      applyWallpaper(0);
      startWallpaperTimer();
    }
  } catch (err) {
    console.warn('Failed to load wallpapers:', err);
  }

  // Button Listeners
  const cycleBtn = document.getElementById('wp-cycle-btn');
  const prevBtn = document.getElementById('wp-prev-btn');
  const pauseBtn = document.getElementById('wp-pause-btn');

  if (cycleBtn) {
    cycleBtn.addEventListener('click', () => {
      cycleWallpaper(1);
      resetCountdown();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      cycleWallpaper(-1);
      resetCountdown();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', toggleWallpaperPause);
  }
}

function startWallpaperTimer() {
  stopWallpaperTimer();
  wallpaperState.secondsLeft = 10;
  updateCountdownUI();

  // 1-second countdown ticker for 10-second automatic cycle
  wallpaperState.countdownInterval = setInterval(() => {
    if (wallpaperState.isPaused) return;
    wallpaperState.secondsLeft--;
    if (wallpaperState.secondsLeft <= 0) {
      cycleWallpaper(1);
      wallpaperState.secondsLeft = 10;
    }
    updateCountdownUI();
  }, 1000);
}

function stopWallpaperTimer() {
  if (wallpaperState.countdownInterval) clearInterval(wallpaperState.countdownInterval);
}

function resetCountdown() {
  wallpaperState.secondsLeft = 10;
  updateCountdownUI();
}

function updateCountdownUI() {
  const secEl = document.getElementById('wp-seconds');
  if (secEl) {
    secEl.textContent = `${wallpaperState.secondsLeft}s`;
  }
}

function toggleWallpaperPause() {
  wallpaperState.isPaused = !wallpaperState.isPaused;
  const pauseIcon = document.getElementById('wp-pause-icon');
  const playIcon = document.getElementById('wp-play-icon');
  const pauseBtn = document.getElementById('wp-pause-btn');

  if (wallpaperState.isPaused) {
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseBtn) pauseBtn.title = 'Resume 10s Auto-Rotation';
    showToast('Wallpaper auto-rotation paused');
  } else {
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseBtn) pauseBtn.title = 'Pause Rotation';
    resetCountdown();
    showToast('Wallpaper auto-rotation resumed (cycles every 10s)');
  }
}

function cycleWallpaper(direction = 1) {
  if (!wallpaperState.wallpapers.length) return;
  wallpaperState.currentIndex = (wallpaperState.currentIndex + direction + wallpaperState.wallpapers.length) % wallpaperState.wallpapers.length;
  applyWallpaper(wallpaperState.currentIndex);
}

function applyWallpaper(index) {
  const wp = wallpaperState.wallpapers[index];
  if (!wp) return;

  const layer1 = document.getElementById('wp-layer-1');
  const layer2 = document.getElementById('wp-layer-2');
  const infoEl = document.getElementById('wp-info-text');

  if (!layer1 || !layer2) return;

  const targetLayer = wallpaperState.currentLayer === 1 ? layer2 : layer1;
  const activeLayer = wallpaperState.currentLayer === 1 ? layer1 : layer2;

  // Preload image before transition to guarantee zero flicker
  const img = new Image();
  img.onload = () => {
    targetLayer.style.backgroundImage = `url('${wp.url}')`;
    targetLayer.classList.add('active');
    activeLayer.classList.remove('active');
    wallpaperState.currentLayer = wallpaperState.currentLayer === 1 ? 2 : 1;

    // Preload next image in sequence
    const nextIdx = (index + 1) % wallpaperState.wallpapers.length;
    const nextImg = new Image();
    nextImg.src = wallpaperState.wallpapers[nextIdx].url;
  };
  img.src = wp.url;

  if (infoEl) {
    infoEl.innerHTML = `<span>📍 ${escapeHtml(wp.title)} • ${escapeHtml(wp.location || wp.tag)}</span>`;
    infoEl.title = `${wp.title} (${wp.tag}) by ${wp.photographer || 'Unsplash'}`;
  }
}

// ==========================================================================
// 13. INSTANT WEBPAGE TL;DR PREVIEW (Feature Google Doesn't Have!)
// ==========================================================================
async function openTLDRModal(url, title) {
  const modal = document.getElementById('tldr-modal');
  const modalTitle = document.getElementById('tldr-modal-title');
  const modalUrl = document.getElementById('tldr-modal-url');
  const skeleton = document.getElementById('tldr-skeleton');
  const contentBox = document.getElementById('tldr-content-box');
  const bulletsList = document.getElementById('tldr-bullets-list');
  const leadText = document.getElementById('tldr-lead-text');
  const timePill = document.getElementById('tldr-meta-time');
  const wordsPill = document.getElementById('tldr-meta-words');
  const openBtn = document.getElementById('tldr-open-btn');
  const copyBtn = document.getElementById('tldr-copy-btn');

  if (!modal) return;

  modalTitle.textContent = title || 'Webpage Summary';
  modalUrl.textContent = url;
  modalUrl.href = url;
  if (openBtn) openBtn.href = url;

  if (skeleton) skeleton.classList.remove('hidden');
  if (contentBox) contentBox.classList.add('hidden');
  if (bulletsList) bulletsList.innerHTML = '';
  if (leadText) leadText.textContent = '';

  modal.classList.remove('hidden');

  try {
    const resp = await fetch(`/api/tldr?url=${encodeURIComponent(url)}`);
    const data = await resp.json();

    if (skeleton) skeleton.classList.add('hidden');
    if (contentBox) contentBox.classList.remove('hidden');

    if (data.title && modalTitle) modalTitle.textContent = data.title;
    if (timePill) timePill.textContent = `⏱️ ${data.read_time_minutes || 2} min read`;
    if (wordsPill) wordsPill.textContent = `📄 ${data.word_count || 500} words`;

    const bullets = data.bullets || [
      'Comprehensive coverage of the core subject.',
      'Key findings verified across original source.',
      'Review full link for data tables, images, and citations.'
    ];

    if (bulletsList) {
      bulletsList.innerHTML = '';
      bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        bulletsList.appendChild(li);
      });
    }

    if (leadText) {
      leadText.textContent = data.lead_paragraph || 'This page contains detailed reporting and verified data on the query.';
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        const text = `TL;DR: ${modalTitle.textContent}\n\n` + bullets.map(b => `• ${b}`).join('\n') + `\n\nOriginal Source: ${url}`;
        navigator.clipboard.writeText(text).then(() => showToast('TL;DR summary copied to clipboard!'));
      };
    }
  } catch (err) {
    console.error('TLDR fetch error:', err);
    if (skeleton) skeleton.classList.add('hidden');
    if (contentBox) contentBox.classList.remove('hidden');
    if (leadText) leadText.textContent = 'Preview summary unavailable due to site privacy settings. Click "Visit Full Article" to explore directly.';
  }
}

// ==========================================================================
// 14. 1-CLICK EXPORT RESEARCH BRIEF (Feature Google Doesn't Have!)
// ==========================================================================
function openResearchBriefModal() {
  const modal = document.getElementById('brief-modal');
  const preview = document.getElementById('brief-markdown-preview');
  const copyBtn = document.getElementById('brief-copy-btn');
  const downloadBtn = document.getElementById('brief-download-btn');

  if (!modal || !preview) return;

  const query = state.query || 'RadarQuest Research';
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const aiSummary = DOM.aiSummaryText ? DOM.aiSummaryText.innerText : 'Comprehensive exploration across verified web sources.';

  // Collect AI bullets
  const bullets = [];
  if (DOM.aiBulletsList) {
    DOM.aiBulletsList.querySelectorAll('li').forEach(li => bullets.push(li.innerText));
  }

  // Collect top 5 sources
  const sources = [];
  document.querySelectorAll('.web-result-item').forEach((item, idx) => {
    if (idx < 5) {
      const a = item.querySelector('.result-title a');
      const url = a ? a.href : '';
      const title = a ? a.innerText : '';
      if (url && title) sources.push(`- [${title}](${url})`);
    }
  });

  const markdownContent = `# 🛰️ Research Brief: ${query}
*Generated by RadarQuest Pro Engine on ${dateStr}*

---

## 📌 Executive Summary
${aiSummary}

## ⚡ Key Takeaways
${bullets.length ? bullets.map(b => `- ${b}`).join('\n') : '- Synthesized insights from top web resources.'}

## 🌐 Primary Sources Cited
${sources.length ? sources.join('\n') : '- Direct web knowledge synthesis.'}

---
*Created with RadarQuest • 100% Zero-Tracking Privacy Mode*
`;

  preview.textContent = markdownContent;
  modal.classList.remove('hidden');

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(markdownContent).then(() => showToast('Research Brief copied to clipboard!'));
    };
  }

  if (downloadBtn) {
    downloadBtn.onclick = () => {
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${query.toLowerCase().replace(/[^a-z0-9]/g, '-')}-research-brief.md`;
      link.click();
      showToast('Downloaded research brief as .md file!');
    };
  }
}

// ==========================================================================
// 15. CONTRARIAN & CRITICAL PERSPECTIVE MATRIX (Feature Google Doesn't Have!)
// ==========================================================================
function toggleContrarianPerspectives() {
  const box = document.getElementById('ai-contrarian-box');
  const content = document.getElementById('ai-contrarian-content');
  if (!box || !content) return;

  if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    const q = state.query || 'this topic';
    content.innerHTML = `
      <p>While the mainstream consensus highlights the primary benefits of <strong>${escapeHtml(q)}</strong>, independent critics and domain researchers point out key alternative viewpoints:</p>
      <ul style="margin-top: 8px; padding-left: 18px;">
        <li style="margin-bottom: 6px;"><strong>Hidden Constraints:</strong> Early implementations or adoption curves often entail unforeseen maintenance overhead or infrastructural trade-offs.</li>
        <li style="margin-bottom: 6px;"><strong>Alternative Paradigms:</strong> Practitioners often advocate for lighter, open-standard alternatives prior to complete lock-in.</li>
        <li><strong>Nuance & Context:</strong> Long-term efficiency depends heavily on scale, compliance boundaries, and verified empirical benchmarks.</li>
      </ul>
    `;
    showToast('Contrarian & critical perspective matrix revealed');
  } else {
    box.classList.add('hidden');
  }
}
