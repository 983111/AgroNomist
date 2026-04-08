import {
  userPrefs,
  getWeatherRisk,
  getMarketData,
  getSerperWeather,
  getSerperNews,
  getSerperMarket,
} from '../services/api.js';

export function renderDashboard() {
  return `<main class="ml-64 mt-16 p-8 min-h-screen page-enter">
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="font-headline text-4xl font-extrabold tracking-tight text-primary">Territory Overview</h2>
        <p class="font-body text-outline mt-1 text-sm" id="dash-location-label">Real-time intelligence • Set your location above</p>
      </div>
      <div class="flex gap-2">
        <select id="dash-crop" class="px-4 py-2 bg-surface-container-low border-none rounded-xl text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20">
          ${['Soybean','Cotton','Wheat','Rice','Corn','Tur Dal','Onion','Tomato','Potato','Sugarcane','Pomegranate','Grapes','Sorghum','Millet'].map(c =>
            `<option value="${c}" ${c === userPrefs.crop ? 'selected' : ''}>${c}</option>`
          ).join('')}
        </select>
        <button id="refresh-dash" class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90">
          <span class="material-symbols-outlined text-sm">refresh</span> Refresh
        </button>
      </div>
    </div>

    <!-- Live Weather Banner -->
    <div class="mb-8 bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 text-white shadow-lg">
      <div class="flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-primary-fixed text-sm">satellite_alt</span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Live Weather — Google Search</span>
        <span class="ml-auto px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold animate-pulse">● LIVE</span>
      </div>
      <div id="live-weather-content" class="grid grid-cols-4 gap-4">
        ${skeleton(4, 'bg-white/10 h-16')}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      ${kpiCard('thunderstorm','Weather Alerts','weather-alerts-count','weather-badge','text-primary')}
      ${kpiCard('trending_up','Market Price','market-price','market-badge','text-secondary','secondary')}
      ${kpiCard('water_drop','Yield Impact','yield-score','','text-tertiary','tertiary')}
      ${kpiCard('bar_chart','Best Sell Window','sell-window','','text-primary')}
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-12 gap-8">

      <!-- Weather Panel -->
      <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-center mb-5">
          <h3 class="font-headline text-lg font-bold text-primary">Weather & Risk Intelligence</h3>
          <span class="text-xs text-outline">K2 AI + Live Data</span>
        </div>
        <div id="weather-content" class="space-y-3">${skeleton(2, 'h-14')}</div>
      </div>

      <!-- Quick Actions -->
      <div class="col-span-4 space-y-4">
        <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary-fixed text-sm">smart_toy</span>
            <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Assistant</span>
          </div>
          <p class="text-sm mb-4 text-primary-fixed-dim">Ask anything about your farm — crop disease, prices, weather, loans…</p>
          <a href="#/research" class="block w-full py-3 bg-white text-primary rounded-xl font-bold text-sm text-center hover:bg-primary-fixed transition-colors">Open Assistant →</a>
        </div>
        <a href="#/disease" class="block bg-error/10 border border-error/20 p-5 rounded-2xl hover:bg-error/15 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-error">coronavirus</span>
            <div>
              <p class="text-sm font-bold text-error">Disease Scanner</p>
              <p class="text-xs text-on-surface-variant">Upload crop photo for AI diagnosis</p>
            </div>
          </div>
        </a>
        <a href="#/market" class="block bg-secondary/10 border border-secondary/20 p-5 rounded-2xl hover:bg-secondary/15 transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary">store</span>
            <div>
              <p class="text-sm font-bold text-secondary">Market Intelligence</p>
              <p class="text-xs text-on-surface-variant">Live prices & forecasts</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Live Market Prices -->
      <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <h3 class="font-headline text-lg font-bold text-primary">Live Market Prices</h3>
            <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE SEARCH</span>
          </div>
        </div>
        <div id="serper-market-content" class="space-y-3">${skeleton(3, 'h-16')}</div>
      </div>

      <!-- Agri News -->
      <div class="col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Agri News</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">LIVE</span>
        </div>
        <div id="news-feed" class="space-y-3 max-h-80 overflow-y-auto no-scrollbar">${skeleton(3, 'h-20')}</div>
      </div>

      <!-- AI Market Forecast -->
      <div class="col-span-12 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-headline text-lg font-bold text-primary">AI Market Price Forecast</h3>
          <span class="text-xs text-outline">K2 AI analysis + live data</span>
        </div>
        <div id="market-forecast-content">${skeleton(4)}</div>
      </div>

    </div>
  </main>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function skeleton(n, cls='h-12') {
  return Array(n).fill(`<div class="bg-surface-container-low rounded-xl animate-pulse ${cls}"></div>`).join('');
}

function kpiCard(icon, label, valueId, badgeId, valueClass, color='primary') {
  return `
  <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
    <div class="flex justify-between items-start mb-4">
      <div class="w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}">
        <span class="material-symbols-outlined text-lg">${icon}</span>
      </div>
      ${badgeId ? `<span id="${badgeId}" class="text-xs font-bold text-outline bg-surface-container px-2 py-1 rounded-lg">—</span>` : ''}
    </div>
    <p class="text-sm text-outline mb-1">${label}</p>
    <p id="${valueId}" class="font-headline text-2xl font-black ${valueClass} truncate">—</p>
  </div>`;
}

const SEV_STYLE = {
  critical: 'bg-error text-on-error',
  high:     'bg-error/20 text-error',
  medium:   'bg-tertiary-fixed text-tertiary',
  low:      'bg-primary-fixed text-primary',
};

// ─── Extract temperature from text ────────────────────────────────────────────

function extractTemperature(text) {
  if (!text) return '';
  // Match patterns like "25°C", "77°F", "25 °C", "25°", "25 degrees"
  const m = text.match(/(-?\d+(?:\.\d+)?)\s*°\s*[CF]?/i) ||
            text.match(/(-?\d+(?:\.\d+)?)\s*degrees/i) ||
            text.match(/temperature[:\s]+(-?\d+(?:\.\d+)?)/i);
  if (m) return m[0];
  return '';
}

function extractCondition(text) {
  if (!text) return '';
  const conditions = ['sunny','cloudy','overcast','rain','rainy','drizzle','storm','thunderstorm',
    'snow','fog','mist','haze','clear','partly cloudy','mostly cloudy','partly sunny','windy',
    'hot','cold','warm','humid','dry','scattered clouds','broken clouds','shower','hail'];
  const lower = text.toLowerCase();
  for (const c of conditions) {
    if (lower.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
  }
  return '';
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initDashboard() {
  const cropSel    = document.getElementById('dash-crop');
  const refreshBtn = document.getElementById('refresh-dash');
  const locLabel   = document.getElementById('dash-location-label');

  function crop() { return cropSel?.value || userPrefs.crop; }

  if (locLabel) {
    locLabel.textContent = `Real-time intelligence for ${userPrefs.city || userPrefs.district}, ${userPrefs.country}`;
  }

  // ── Live Weather (Serper) ──────────────────────────────────
  async function loadLiveWeather() {
    const el = document.getElementById('live-weather-content');
    el.innerHTML = skeleton(4, 'bg-white/10 h-16');
    try {
      const d  = await getSerperWeather();
      const ab = d.answerBox || {};
      const kg = d.knowledgeGraph || {};
      const snippets = d.weatherSnippets || d.searchResults || [];
      const topSnippet = snippets[0]?.snippet || '';
      const allSnippetText = snippets.map(s => s.snippet || '').join(' ');

      // Extract temperature from multiple sources
      let temp = ab.answer || ab.temperature || ab.title || '';
      if (!temp || temp === '—') {
        temp = extractTemperature(kg.description || '') ||
               extractTemperature(topSnippet) ||
               extractTemperature(allSnippetText) ||
               kg.title || '';
      }

      // Extract conditions
      let conditions = ab.snippet || ab.weather || '';
      if (!conditions) {
        conditions = topSnippet || kg.description || '';
      }
      // Make sure we have something meaningful
      if (!conditions && allSnippetText) {
        conditions = allSnippetText.slice(0, 200);
      }

      // Extract a short condition word for the badge
      const conditionWord = extractCondition(conditions) || extractCondition(allSnippetText);

      el.innerHTML = `
        <div class="p-3 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Location</p>
          <p class="font-headline text-base font-black">${userPrefs.city || userPrefs.district}, ${userPrefs.country}</p>
        </div>
        <div class="p-3 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Current</p>
          <p class="font-headline text-base font-black">${temp || 'Fetching…'}</p>
          ${conditionWord ? `<p class="text-xs text-primary-fixed-dim mt-0.5">${conditionWord}</p>` : ''}
        </div>
        <div class="col-span-2 p-3 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Conditions</p>
          <p class="text-sm leading-relaxed line-clamp-2">${conditions || 'Weather data loading…'}</p>
          ${snippets.length ? `<div class="flex gap-2 flex-wrap mt-2">${snippets.slice(0,3).map(r =>
            `<a href="${r.link}" target="_blank" rel="noopener" class="text-[10px] text-primary-fixed/80 hover:text-white underline truncate max-w-[180px]">${(r.title||'').slice(0,45)}…</a>`
          ).join(' • ')}</div>` : ''}
        </div>`;
    } catch {
      el.innerHTML = `<div class="col-span-4 p-3 bg-white/10 rounded-xl text-sm text-primary-fixed">Weather data unavailable</div>`;
    }
  }

  // ── K2 Weather Risk ────────────────────────────────────────
  async function loadWeather() {
    const el = document.getElementById('weather-content');
    el.innerHTML = skeleton(2, 'h-14');
    try {
      const d = await getWeatherRisk({ crop: crop() });
      document.getElementById('weather-alerts-count').textContent = d.alerts?.length ?? '0';
      document.getElementById('yield-score').textContent = d.yieldImpactScore ? `${d.yieldImpactScore}/100` : 'N/A';
      document.getElementById('weather-badge').textContent = `${userPrefs.city || userPrefs.district}`;

      let html = '';
      const alerts = d.alerts || [];
      html += alerts.map(a => `
        <div class="flex items-start gap-3 p-4 ${SEV_STYLE[a.severity] || 'bg-surface-container-low'} rounded-xl">
          <span class="material-symbols-outlined text-lg mt-0.5">warning</span>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider mb-0.5">${(a.type||'').replace(/-/g,' ')} • ${a.severity}</p>
            <p class="text-sm">${a.message}</p>
            <p class="text-xs opacity-70">${a.timeframe||''}</p>
          </div>
        </div>`).join('') || `<p class="text-sm text-outline p-4">No active alerts for ${userPrefs.city || userPrefs.district}.</p>`;

      if (d.irrigationAdvice) {
        html += `<div class="p-4 bg-secondary/10 rounded-xl border border-secondary/20 mt-2">
          <p class="text-xs font-bold text-secondary mb-1">💧 Irrigation Advice</p>
          <p class="text-sm">${d.irrigationAdvice}</p>
        </div>`;
      }
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = `<p class="text-sm text-error p-4">Weather error: ${e.message}</p>`;
    }
  }

  // ── Live Market (Serper) ───────────────────────────────────
  async function loadSerperMarket() {
    const el = document.getElementById('serper-market-content');
    el.innerHTML = skeleton(3, 'h-16');
    try {
      const d = await getSerperMarket({ crop: crop() });
      let html = '';

      if (d.priceAnswerBox) {
        const pab = d.priceAnswerBox;
        html += `<div class="p-4 bg-primary-fixed/20 rounded-xl border border-primary/20">
          <div class="flex items-center gap-2 mb-1">
            <span class="material-symbols-outlined text-primary text-sm">verified</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary">Google Price Data</span>
          </div>
          <p class="text-sm font-bold">${pab.answer || pab.snippet || pab.title || ''}</p>
        </div>`;
      }

      html += (d.priceResults||[]).slice(0,4).map(r => `
        <a href="${r.link}" target="_blank" rel="noopener" class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
          <p class="text-sm font-bold text-primary group-hover:text-secondary line-clamp-1">${r.title}</p>
          <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${r.snippet||''}</p>
          ${r.date ? `<p class="text-[10px] text-outline mt-1">${r.date}</p>` : ''}
        </a>`).join('');

      if (d.newsResults?.length) {
        html += `<p class="text-[10px] font-bold uppercase tracking-wider text-secondary mt-2 mb-1">Latest Market News</p>`;
        html += d.newsResults.slice(0,3).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="flex gap-3 p-3 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors group">
            ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" onerror="this.style.display='none'"/>` : ''}
            <div>
              <p class="text-sm font-bold group-hover:text-secondary line-clamp-2">${n.title}</p>
              <p class="text-[10px] text-outline mt-1">${n.source||''} • ${n.date||''}</p>
            </div>
          </a>`).join('');
      }

      el.innerHTML = html || '<p class="text-sm text-outline p-4">No market data found.</p>';
    } catch {
      el.innerHTML = '<p class="text-sm text-error p-4">Could not load live market data.</p>';
    }
  }

  // ── Agri News ──────────────────────────────────────────────
  async function loadNews() {
    const el = document.getElementById('news-feed');
    el.innerHTML = skeleton(3, 'h-20');
    try {
      const d = await getSerperNews();
      if (d.news?.length) {
        el.innerHTML = d.news.map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            <p class="text-xs font-bold text-primary group-hover:text-secondary line-clamp-2">${n.title}</p>
            <p class="text-[10px] text-on-surface-variant mt-1 line-clamp-2">${n.snippet||''}</p>
            <p class="text-[10px] text-outline mt-1">${n.source||''} • ${n.date||''}</p>
          </a>`).join('');
      } else {
        el.innerHTML = '<p class="text-sm text-outline p-3">No news available.</p>';
      }
    } catch {
      el.innerHTML = '<p class="text-sm text-error p-3">News unavailable.</p>';
    }
  }

  // ── K2 Market Forecast ─────────────────────────────────────
  async function loadMarket() {
    const el = document.getElementById('market-forecast-content');
    el.innerHTML = `<div class="grid grid-cols-4 gap-4">${skeleton(4, 'h-20')}</div>`;
    try {
      const d = await getMarketData({ crop: crop() });
      // Use mspPrice as the data field from the worker (not currentPrice)
      const price = d.mspPrice || (d.forecast?.[0]?.price) || null;
      document.getElementById('market-price').textContent  = price ? `₹${price}` : '—';
      document.getElementById('market-badge').textContent  = d.trend ? `↑↓ ${d.trend}` : '—';
      document.getElementById('sell-window').textContent   = d.profitMaximizer?.bestTimeToSell || '—';

      el.innerHTML = `
        <div class="grid grid-cols-3 gap-4 mb-4">
          ${(d.forecast||[]).map(f => `
            <div class="p-4 bg-surface-container-low rounded-xl text-center">
              <p class="text-xs font-bold text-outline uppercase tracking-wider mb-2">${f.month}</p>
              <p class="text-xl font-headline font-black text-primary">${f.price ? `₹${f.price}` : '—'}</p>
              <p class="text-xs text-outline">/quintal</p>
            </div>`).join('')}
        </div>
        <div class="p-4 bg-primary-fixed/20 rounded-xl">
          <p class="text-xs font-bold text-primary mb-1">📊 K2 AI Analysis</p>
          <p class="text-sm">${d.analysis||'Analysis not available.'}</p>
          ${d.profitMaximizer?.storageAdvice ? `<p class="text-xs text-secondary mt-2 font-medium">💡 ${d.profitMaximizer.storageAdvice}</p>` : ''}
        </div>`;
    } catch (e) {
      el.innerHTML = `<p class="text-sm text-error p-4">Market error: ${e.message}</p>`;
    }
  }

  // ── Load All ───────────────────────────────────────────────
  function loadAll() {
    if (locLabel) locLabel.textContent = `Real-time intelligence for ${userPrefs.city||userPrefs.district}, ${userPrefs.country}`;
    loadLiveWeather();
    loadSerperMarket();
    loadNews();
    loadWeather();
    loadMarket();
  }

  loadAll();

  cropSel?.addEventListener('change', () => { loadSerperMarket(); loadMarket(); });
  refreshBtn?.addEventListener('click', loadAll);

  // Refresh when user changes location
  window.addEventListener('prefs-changed', loadAll, { once: false });
}
