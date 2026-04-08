import { userPrefs, getWeatherRisk, getSerperWeather, getSerperNews } from '../services/api.js';

export function renderWeather() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Weather & Risk Engine</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Risk Intelligence</h2>
          <p class="text-sm text-outline mt-1" id="wx-loc-label">${userPrefs.city||userPrefs.district}, ${userPrefs.country}</p>
        </div>
        <div class="flex gap-3 items-center">
          <select id="wx-crop" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            ${['mixed crops','Soybean','Cotton','Wheat','Rice','Corn','Sugarcane','Potato','Tomato'].map(c =>
              `<option value="${c}" ${c === userPrefs.crop ? 'selected' : ''}>${c}</option>`
            ).join('')}
          </select>
          <button id="fetch-weather" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">cloudy_snowing</span> Get Forecast
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
        <div id="live-wx-content" class="grid grid-cols-3 gap-4">
          ${skels(3,'bg-white/10 h-20')}
        </div>
      </div>

      <!-- Weather News -->
      <div class="mb-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Weather & Agriculture News</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">LIVE</span>
        </div>
        <div id="wx-news-content" class="grid grid-cols-3 gap-4">${skels(3,'h-24')}</div>
      </div>

      <div id="wx-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Fetching AI weather intelligence…</p>
      </div>

      <div id="wx-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">cloudy_snowing</span>
          <p class="font-bold">Loading AI-powered weather risk analysis…</p>
        </div>
      </div>
    </div>
  </main>`;
}

function skels(n, cls='h-16') {
  return Array(n).fill(`<div class="bg-surface-container-low rounded-xl animate-pulse ${cls}"></div>`).join('');
}

const SEV = {
  critical: 'bg-error text-white',
  high:     'bg-error/15 text-error border border-error/30',
  medium:   'bg-tertiary-fixed/40 text-tertiary border border-tertiary/30',
  low:      'bg-primary-fixed/30 text-primary border border-primary/20',
};

const WX_ICON = {
  drought: 'water_off', frost: 'ac_unit', flood: 'flood',
  heatwave: 'local_fire_department', 'pest-favorable': 'pest_control',
  storm: 'thunderstorm', wind: 'air', 'cold-wave': 'ac_unit',
};

// ─── Extract temperature from text ────────────────────────────────────────

function extractTemperature(text) {
  if (!text) return '';
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

export function initWeather() {
  async function loadLiveWeather() {
    const el = document.getElementById('live-wx-content');
    el.innerHTML = skels(3, 'bg-white/10 h-20');
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
      if (!conditions && allSnippetText) {
        conditions = allSnippetText.slice(0, 300);
      }

      const conditionWord = extractCondition(conditions) || extractCondition(allSnippetText);

      el.innerHTML = `
        <div class="p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Current Weather</p>
          <p class="font-headline text-2xl font-black">${temp || 'Fetching…'}</p>
          ${conditionWord ? `<p class="text-sm text-primary-fixed-dim mt-1">${conditionWord}</p>` : ''}
          <p class="text-sm text-primary-fixed-dim mt-1">${userPrefs.city||userPrefs.district}, ${userPrefs.country}</p>
        </div>
        <div class="col-span-2 p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Forecast & Conditions</p>
          <p class="text-sm leading-relaxed line-clamp-3">${conditions || 'Weather data loading…'}</p>
        </div>`;
      if (snippets.length) {
        el.innerHTML += `<div class="col-span-3 flex gap-2 flex-wrap mt-1">
          ${snippets.slice(0,3).map(r => `<a href="${r.link}" target="_blank" rel="noopener" class="text-[10px] text-primary-fixed/80 hover:text-white underline">${(r.title||'').slice(0,50)}…</a>`).join(' • ')}
        </div>`;
      }
    } catch {
      el.innerHTML = `<div class="col-span-3 p-4 bg-white/10 rounded-xl"><p class="text-sm">Live weather unavailable. Showing AI forecast below.</p></div>`;
    }
  }

  async function loadWeatherNews() {
    const el = document.getElementById('wx-news-content');
    el.innerHTML = skels(3, 'h-24');
    try {
      const d = await getSerperNews({ topic: 'weather monsoon rainfall agriculture' });
      if (d.news?.length) {
        el.innerHTML = d.news.slice(0,6).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-full h-24 rounded-lg object-cover mb-2" onerror="this.style.display='none'"/>` : ''}
            <p class="text-xs font-bold text-primary group-hover:text-secondary line-clamp-2">${n.title}</p>
            <p class="text-[10px] text-outline mt-2">${n.source||''} • ${n.date||''}</p>
          </a>`).join('');
      } else {
        el.innerHTML = '<p class="text-sm text-outline col-span-3">No weather news available.</p>';
      }
    } catch { el.innerHTML = '<p class="text-sm text-error col-span-3">News unavailable.</p>'; }
  }

  async function loadAI() {
    const crop = document.getElementById('wx-crop')?.value || userPrefs.crop;
    document.getElementById('wx-loading').classList.remove('hidden');
    document.getElementById('wx-results').innerHTML = '';
    try {
      const d = await getWeatherRisk({ crop });
      document.getElementById('wx-loading').classList.add('hidden');

      const yis = d.yieldImpactScore || 0;
      const yisColor = yis >= 80 ? 'text-primary' : yis >= 50 ? 'text-tertiary' : 'text-error';
      const prioOrder = { immediate:0, 'this-week':1, 'this-month':2 };

      document.getElementById('wx-results').innerHTML = `
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-center">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Yield Impact Score</p>
            <p class="font-headline text-5xl font-black ${yisColor}">${yis}<span class="text-2xl">/100</span></p>
            <p class="text-xs text-outline mt-2">${d.yieldImpactExplanation||''}</p>
          </div>
          <div class="col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Active Alerts (${d.alerts?.length||0})</p>
            <div class="space-y-2">
              ${(d.alerts||[]).slice(0,3).map(a => `
                <div class="flex items-start gap-3 p-3 ${SEV[a.severity]||SEV.low} rounded-xl">
                  <span class="material-symbols-outlined text-lg mt-0.5">${WX_ICON[a.type]||'warning'}</span>
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wider mb-0.5">${(a.type||'').replace(/-/g,' ')} • ${a.severity}</p>
                    <p class="text-sm">${a.message}</p>
                    <p class="text-xs opacity-70">${a.timeframe||''}</p>
                  </div>
                </div>`).join('')||'<p class="text-sm text-outline">No active alerts.</p>'}
            </div>
          </div>
        </div>

        ${d.advisories?.length ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-6">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Action Advisories</h3>
          <div class="space-y-3">
            ${[...(d.advisories||[])].sort((a,b)=>(prioOrder[a.priority]||2)-(prioOrder[b.priority]||2)).map(a => {
              const pc = { immediate:'text-error bg-error/10 border-error/20', 'this-week':'text-tertiary bg-tertiary-fixed/30 border-tertiary/20', 'this-month':'text-primary bg-primary-fixed/20 border-primary/20' };
              return `<div class="flex items-center gap-4 p-4 ${pc[a.priority]||pc['this-month']} border rounded-xl">
                <span class="text-[10px] font-black uppercase tracking-widest border px-2 py-1 rounded-lg border-current whitespace-nowrap">${(a.priority||'').replace(/-/g,' ')}</span>
                <p class="text-sm font-medium">${a.action}</p>
              </div>`;
            }).join('')}
          </div>
        </div>` : ''}

        <div class="grid grid-cols-2 gap-6">
          ${d.optimalSowingWindow ? `
          <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-fixed">calendar_month</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">Optimal Sowing Window</span>
            </div>
            <p class="font-headline text-2xl font-black">${d.optimalSowingWindow}</p>
          </div>` : '<div></div>'}
          ${d.irrigationAdvice ? `
          <div class="bg-secondary/10 border border-secondary/20 p-6 rounded-2xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-secondary">water_drop</span>
              <span class="text-xs font-bold uppercase tracking-widest text-secondary">Irrigation Advice</span>
            </div>
            <p class="text-sm">${d.irrigationAdvice}</p>
          </div>` : '<div></div>'}
        </div>`;
    } catch(e) {
      document.getElementById('wx-loading').classList.add('hidden');
      document.getElementById('wx-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  function loadAll() {
    const loc = document.getElementById('wx-loc-label');
    if (loc) loc.textContent = `${userPrefs.city||userPrefs.district}, ${userPrefs.country}`;
    loadLiveWeather();
    loadWeatherNews();
    loadAI();
  }

  document.getElementById('fetch-weather')?.addEventListener('click', loadAll);
  loadAll();
}
