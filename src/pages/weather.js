import { getWeatherRisk, getSerperWeather, getSerperNews } from '../services/api.js';

export function renderWeather() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Weather & Risk Engine</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Risk Intelligence</h2>
        </div>
        <div class="flex gap-3 items-center">
          <select id="wx-district" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option>Nanded</option><option>Nashik</option><option>Pune</option><option>Latur</option><option>Aurangabad</option>
          </select>
          <select id="wx-crop" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option value="mixed crops">All crops</option>
            <option>Soybean</option><option>Cotton</option><option>Wheat</option><option>Sugarcane</option>
          </select>
          <button id="fetch-weather" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">cloudy_snowing</span> Get Forecast
          </button>
        </div>
      </div>

      <!-- Live Weather from Google -->
      <div id="live-wx-banner" class="mb-8 bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-outlined text-primary-fixed text-sm">satellite_alt</span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Live Weather — Google Search</span>
          <span class="ml-auto px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold animate-pulse">● LIVE</span>
        </div>
        <div id="live-wx-content" class="grid grid-cols-3 gap-4">
          ${[1,2,3].map(() => `<div class="p-4 bg-white/10 rounded-xl animate-pulse h-20"></div>`).join('')}
        </div>
      </div>

      <!-- Weather News -->
      <div id="wx-news-section" class="mb-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Weather & Agriculture News</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE NEWS</span>
        </div>
        <div id="wx-news-content" class="grid grid-cols-3 gap-4">
          ${[1,2,3].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('')}
        </div>
      </div>

      <div id="wx-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Fetching AI weather intelligence…</p>
      </div>

      <div id="wx-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">cloudy_snowing</span>
          <p class="font-bold">Loading AI-powered weather risk analysis with real-time data…</p>
        </div>
      </div>
    </div>
  </main>`;
}

export function initWeather() {
  const severityStyle = {
    critical: 'bg-error text-white',
    high: 'bg-error/15 text-error border border-error/30',
    medium: 'bg-tertiary-fixed/40 text-tertiary border border-tertiary/30',
    low: 'bg-primary-fixed/30 text-primary border border-primary/20',
  };

  const wxIcon = {
    drought: 'water_off', frost: 'ac_unit', flood: 'flood',
    heatwave: 'local_fire_department', 'pest-favorable': 'pest_control',
  };

  // ─── Live Weather from Serper ──────────────────────────────
  async function loadLiveWeather(district) {
    const container = document.getElementById('live-wx-content');
    container.innerHTML = [1,2,3].map(() => `<div class="p-4 bg-white/10 rounded-xl animate-pulse h-20"></div>`).join('');
    try {
      const data = await getSerperWeather({ district });
      const ab = data.answerBox || {};
      const snippets = data.weatherSnippets || [];
      const searchResults = data.searchResults || [];

      const temp = ab.answer || ab.title || '';
      const conditions = ab.snippet || '';
      const details = snippets.map(s => s.snippet).join(' ') || searchResults.map(r => r.snippet).filter(Boolean).join(' ');

      container.innerHTML = `
        <div class="p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Current Weather</p>
          <p class="font-headline text-2xl font-black">${temp || 'Data loading...'}</p>
          <p class="text-sm text-primary-fixed-dim mt-1">${district}, Maharashtra</p>
        </div>
        <div class="col-span-2 p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Forecast & Conditions</p>
          <p class="text-sm leading-relaxed">${conditions || details.slice(0, 300) || 'Fetching weather data...'}</p>
        </div>
      `;

      // Show source links
      if (searchResults.length > 0) {
        container.innerHTML += `
          <div class="col-span-3 flex gap-2 flex-wrap mt-1">
            ${searchResults.slice(0, 3).map(r => `
              <a href="${r.link}" target="_blank" rel="noopener" class="text-[10px] text-primary-fixed/80 hover:text-white transition-colors underline">${r.title?.slice(0, 40)}…</a>
            `).join('•')}
          </div>`;
      }
    } catch {
      container.innerHTML = `<div class="col-span-3 p-4 bg-white/10 rounded-xl"><p class="text-sm">Live weather unavailable. Using AI forecast below.</p></div>`;
    }
  }

  // ─── Weather News ──────────────────────────────────────────
  async function loadWeatherNews(district) {
    const container = document.getElementById('wx-news-content');
    container.innerHTML = [1,2,3].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('');
    try {
      const data = await getSerperNews({ district, topic: 'weather monsoon rainfall' });
      if (data.news?.length) {
        container.innerHTML = data.news.slice(0, 6).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-full h-24 rounded-lg object-cover mb-2" alt="" onerror="this.style.display='none'"/>` : ''}
            <p class="text-xs font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">${n.title}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-[10px] text-outline">${n.source || ''}</span>
              <span class="text-[10px] text-outline">•</span>
              <span class="text-[10px] text-outline">${n.date || ''}</span>
            </div>
          </a>`).join('');
      } else {
        container.innerHTML = '<p class="text-sm text-outline col-span-3">No weather news available.</p>';
      }
    } catch {
      container.innerHTML = '<p class="text-sm text-error col-span-3">Could not load weather news.</p>';
    }
  }

  // ─── K2 AI Weather Risk ────────────────────────────────────
  async function loadAI() {
    const district = document.getElementById('wx-district')?.value;
    const crop = document.getElementById('wx-crop')?.value;

    document.getElementById('wx-loading').classList.remove('hidden');
    document.getElementById('wx-results').innerHTML = '';

    try {
      const data = await getWeatherRisk({ district, crop });
      document.getElementById('wx-loading').classList.add('hidden');

      const yis = data.yieldImpactScore || 0;
      const yisColor = yis >= 80 ? 'text-primary' : yis >= 50 ? 'text-tertiary' : 'text-error';
      const priorityOrder = { immediate: 0, 'this-week': 1, 'this-month': 2 };

      document.getElementById('wx-results').innerHTML = `
        <!-- Current Conditions from AI -->
        ${data.currentConditions ? `
        <div class="grid grid-cols-4 gap-4 mb-6">
          ${data.currentConditions.temperature ? `<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm text-center"><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Temperature</p><p class="font-headline text-3xl font-black text-primary">${data.currentConditions.temperature}</p></div>` : ''}
          ${data.currentConditions.humidity ? `<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm text-center"><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Humidity</p><p class="font-headline text-3xl font-black text-secondary">${data.currentConditions.humidity}</p></div>` : ''}
          ${data.currentConditions.conditions ? `<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm text-center"><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Conditions</p><p class="font-headline text-xl font-black text-tertiary">${data.currentConditions.conditions}</p></div>` : ''}
          ${data.currentConditions.wind ? `<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm text-center"><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Wind</p><p class="font-headline text-xl font-black text-on-surface">${data.currentConditions.wind}</p></div>` : ''}
        </div>` : ''}

        <!-- Impact Score Banner -->
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="col-span-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-center">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Yield Impact Score</p>
            <p class="font-headline text-5xl font-black ${yisColor}">${yis}<span class="text-2xl">/100</span></p>
            <p class="text-xs text-outline mt-2">${data.yieldImpactExplanation || ''}</p>
          </div>
          <div class="col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Active Alerts (${data.alerts?.length || 0})</p>
            <div class="space-y-2">
              ${(data.alerts || []).slice(0, 3).map(a => `
                <div class="flex items-start gap-3 p-3 ${severityStyle[a.severity] || severityStyle.low} rounded-xl">
                  <span class="material-symbols-outlined text-lg mt-0.5">${wxIcon[a.type] || 'warning'}</span>
                  <div class="flex-1">
                    <p class="text-xs font-bold uppercase tracking-wider mb-0.5">${(a.type || '').replace(/-/g, ' ')} • ${a.severity}</p>
                    <p class="text-sm">${a.message}</p>
                    <p class="text-xs opacity-70 mt-0.5">${a.timeframe || ''}</p>
                  </div>
                </div>`).join('') || '<p class="text-sm text-outline">No active alerts.</p>'}
            </div>
          </div>
        </div>

        <!-- Advisories -->
        ${data.advisories?.length ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-6">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Action Advisories</h3>
          <div class="space-y-3">
            ${[...(data.advisories || [])].sort((a,b) => (priorityOrder[a.priority]||2) - (priorityOrder[b.priority]||2)).map(a => {
              const pc = { immediate: 'text-error bg-error/10 border-error/20', 'this-week': 'text-tertiary bg-tertiary-fixed/30 border-tertiary/20', 'this-month': 'text-primary bg-primary-fixed/20 border-primary/20' };
              return `
                <div class="flex items-center gap-4 p-4 ${pc[a.priority] || pc['this-month']} border rounded-xl">
                  <span class="text-[10px] font-black uppercase tracking-widest border px-2 py-1 rounded-lg border-current whitespace-nowrap">${(a.priority || '').replace(/-/g,' ')}</span>
                  <p class="text-sm font-medium">${a.action}</p>
                </div>`;
            }).join('')}
          </div>
        </div>` : ''}

        <!-- Sowing & Irrigation -->
        <div class="grid grid-cols-2 gap-6">
          ${data.optimalSowingWindow ? `
          <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-fixed">calendar_month</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">Optimal Sowing Window</span>
            </div>
            <p class="font-headline text-2xl font-black">${data.optimalSowingWindow}</p>
          </div>` : '<div></div>'}
          ${data.irrigationAdvice ? `
          <div class="bg-secondary/10 border border-secondary/20 p-6 rounded-2xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-secondary">water_drop</span>
              <span class="text-xs font-bold uppercase tracking-widest text-secondary">Irrigation Advice</span>
            </div>
            <p class="text-sm text-on-surface">${data.irrigationAdvice}</p>
          </div>` : '<div></div>'}
        </div>
      `;
    } catch (e) {
      document.getElementById('wx-loading').classList.add('hidden');
      document.getElementById('wx-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  function loadAll() {
    const district = document.getElementById('wx-district')?.value;
    loadLiveWeather(district);
    loadWeatherNews(district);
    loadAI();
  }

  document.getElementById('fetch-weather')?.addEventListener('click', loadAll);
  loadAll();
}
