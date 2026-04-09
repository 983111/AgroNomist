import { userPrefs, getRecommendations, getSerperNews } from '../services/api.js';

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh',
  'Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

const SOIL_TYPES = [
  'Alluvial','Black (Regur)','Red','Laterite','Desert (Arid)','Mountain',
  'Saline/Alkaline','Peaty/Marshy','Clay','Sandy','Loamy','Silt',
];

const SEASONS = [
  { value: 'kharif', label: 'Kharif (June–October)' },
  { value: 'rabi',   label: 'Rabi (November–March)'  },
  { value: 'zaid',   label: 'Zaid (March–June)'      },
];

// ── NPK bar — defined here so renderRecommendations() can call it ─────────────
function npkBar(label, value, color) {
  const pct = Math.min(100, (value / 120) * 100);
  return `<div class="flex items-center gap-3">
    <span class="text-sm font-black w-4 text-center" style="color:${color}">${label}</span>
    <div class="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all duration-700" style="width:${pct}%;background:${color}"></div>
    </div>
    <span class="text-xs font-bold text-on-surface-variant w-14 text-right">${value} kg/ha</span>
  </div>`;
}

export function renderRecommendations() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight">AI Recommendations</h2>
          <p class="text-sm text-outline mt-1">K2-powered crop, soil &amp; fertilizer intelligence</p>
        </div>
        <button id="rec-refresh" class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors" title="Refresh news">
          <span class="material-symbols-outlined text-primary">refresh</span>
        </button>
      </div>

      <!-- Input Panels -->
      <div class="grid grid-cols-2 gap-6 mb-8">

        <!-- Location & Season -->
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-lg">location_on</span>
            </div>
            <h3 class="font-headline text-base font-bold text-primary">Location &amp; Season</h3>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">State / Region</label>
              <select id="rec-state" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                <option value="">— Select State —</option>
                ${STATES.map(s => `<option value="${s}" ${s === userPrefs.state ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">District</label>
              <input id="rec-district" type="text" value="${userPrefs.district || userPrefs.city || ''}"
                placeholder="e.g. Nanded, Pune"
                class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Crop Season</label>
              <select id="rec-season" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                ${SEASONS.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Soil Type</label>
              <select id="rec-soil-type" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                <option value="">— Select Soil Type —</option>
                ${SOIL_TYPES.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Farm Size (acres)</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">straighten</span>
                <input id="rec-farm-size" type="number" value="5" min="0.5" step="0.5"
                  class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-primary/20"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Soil & Climate Data -->
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-error text-lg">science</span>
            </div>
            <h3 class="font-headline text-base font-bold text-primary">Soil &amp; Climate Data</h3>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Soil pH</label>
              <input id="rec-ph" type="number" value="6.5" min="0" max="14" step="0.1"
                class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Nitrogen (kg/ha)</label>
              <input id="rec-n" type="number" value="50" min="0"
                class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Phosphorus (kg/ha)</label>
              <input id="rec-p" type="number" value="40" min="0"
                class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Potassium (kg/ha)</label>
              <input id="rec-k" type="number" value="60" min="0"
                class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Annual Rainfall (mm)</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">water_drop</span>
                <input id="rec-rainfall" type="number" value="800" min="0"
                  class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-primary/20"/>
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Avg Temperature (°C)</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">thermostat</span>
                <input id="rec-temp" type="number" value="25" min="-10" max="55"
                  class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-primary/20"/>
              </div>
            </div>
          </div>
          <!-- NPK bars -->
          <div class="p-4 bg-surface-container-low rounded-xl">
            <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">NPK Status</p>
            <div class="space-y-2.5" id="npk-bars">
              ${npkBar('N', 50, '#16a34a')}
              ${npkBar('P', 40, '#f97316')}
              ${npkBar('K', 60, '#0ea5e9')}
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex justify-center mb-8">
        <button id="get-recommendations"
          class="px-10 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all">
          <span class="material-symbols-outlined text-base">psychology</span>
          Get AI Recommendations
        </button>
      </div>

      <!-- Loading -->
      <div id="rec-loading" class="hidden py-16 text-center">
        <div class="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary text-lg">K2 is analyzing your farm data…</p>
        <p class="text-sm text-outline mt-1">This may take 15–25 seconds</p>
      </div>

      <!-- Results -->
      <div id="rec-results"></div>

      <!-- Agriculture News -->
      <div class="mt-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Agriculture Advisory News</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">LIVE</span>
        </div>
        <div id="rec-news" class="grid grid-cols-4 gap-4">
          ${[1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('')}
        </div>
      </div>
    </div>
  </main>`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initRecommendations() {
  const nInput = document.getElementById('rec-n');
  const pInput = document.getElementById('rec-p');
  const kInput = document.getElementById('rec-k');

  // Live NPK bar update
  function updateNPK() {
    const el = document.getElementById('npk-bars');
    if (!el) return;
    el.innerHTML =
      npkBar('N', parseFloat(nInput?.value) || 0, '#16a34a') +
      npkBar('P', parseFloat(pInput?.value) || 0, '#f97316') +
      npkBar('K', parseFloat(kInput?.value) || 0, '#0ea5e9');
  }
  nInput?.addEventListener('input', updateNPK);
  pInput?.addEventListener('input', updateNPK);
  kInput?.addEventListener('input', updateNPK);

  // News loader
  async function loadNews() {
    const el = document.getElementById('rec-news');
    if (!el) return;
    el.innerHTML = [1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('');
    try {
      const d = await getSerperNews({ topic: 'agriculture crop advisory soil fertilizer' });
      el.innerHTML = d.news?.length
        ? d.news.slice(0, 4).map(n => `
            <a href="${n.link}" target="_blank" rel="noopener"
              class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
              ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-full h-20 rounded-lg object-cover mb-2" onerror="this.style.display='none'"/>` : ''}
              <p class="text-xs font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">${n.title}</p>
              <p class="text-[10px] text-outline mt-2">${n.source || ''} • ${n.date || ''}</p>
            </a>`).join('')
        : '<p class="text-sm text-outline col-span-4 p-4">No news available.</p>';
    } catch {
      el.innerHTML = '<p class="text-sm text-error col-span-4 p-4">News unavailable.</p>';
    }
  }

  // Main fetch
  async function fetchRecommendations() {
    const state    = document.getElementById('rec-state')?.value     || userPrefs.state    || '';
    const district = document.getElementById('rec-district')?.value  || userPrefs.district || '';
    const season   = document.getElementById('rec-season')?.value    || 'kharif';
    const soilType = document.getElementById('rec-soil-type')?.value || '';
    const farmSize = parseFloat(document.getElementById('rec-farm-size')?.value) || 5;
    const ph       = parseFloat(document.getElementById('rec-ph')?.value)        || 6.5;
    const n        = parseFloat(nInput?.value) || 50;
    const p        = parseFloat(pInput?.value) || 40;
    const k        = parseFloat(kInput?.value) || 60;
    const rainfall = parseFloat(document.getElementById('rec-rainfall')?.value)  || 800;
    const temp     = parseFloat(document.getElementById('rec-temp')?.value)      || 25;

    const loadEl    = document.getElementById('rec-loading');
    const resultsEl = document.getElementById('rec-results');
    const btnEl     = document.getElementById('get-recommendations');

    loadEl.classList.remove('hidden');
    resultsEl.innerHTML = '';
    if (btnEl) { btnEl.disabled = true; btnEl.classList.add('opacity-60'); }

    try {
      const data = await getRecommendations({
        state, district, season, soilType, farmSize,
        soilData: { pH: ph, nitrogen: n, phosphorus: p, potassium: k },
        rainfall, temperature: temp,
      });

      loadEl.classList.add('hidden');
      if (btnEl) { btnEl.disabled = false; btnEl.classList.remove('opacity-60'); }

      if (data.error && !data.recommendedCrops?.length) {
        resultsEl.innerHTML = errorBox(data.error);
        return;
      }

      renderResults(resultsEl, data);
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (e) {
      loadEl.classList.add('hidden');
      if (btnEl) { btnEl.disabled = false; btnEl.classList.remove('opacity-60'); }
      resultsEl.innerHTML = errorBox(e.message);
    }
  }

  function errorBox(msg) {
    return `<div class="py-8 px-6 bg-error/10 border border-error/20 rounded-2xl text-center">
      <span class="material-symbols-outlined text-error text-4xl mb-3 block">error_outline</span>
      <p class="font-bold text-error mb-2">Could not generate recommendations</p>
      <p class="text-sm text-on-surface-variant mb-4">${msg}</p>
      <button onclick="document.getElementById('get-recommendations').click()"
        class="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Retry</button>
    </div>`;
  }

  function renderResults(el, data) {
    const crops    = data.recommendedCrops || [];
    const fert     = data.fertilizerPlan   || {};
    const practices = data.bestPractices   || [];
    let html = '';

    // Crops
    if (crops.length) {
      const suitColor = {
        'highly-suitable': 'text-primary bg-primary-fixed/30',
        'suitable':        'text-secondary bg-secondary-fixed/20',
        'moderate':        'text-tertiary bg-tertiary-fixed/20',
      };
      html += `<div class="mb-8">
        <h3 class="font-headline text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">eco</span>Recommended Crops
        </h3>
        <div class="grid grid-cols-3 gap-4">
          ${crops.map((c, i) => `
            <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style="background:hsl(${120 + i * 30},40%,35%)">${i + 1}</div>
                <div class="min-w-0">
                  <h4 class="font-bold text-primary text-base truncate">${c.name || 'Crop'}</h4>
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${suitColor[c.suitability] || 'text-outline bg-surface-container'}">
                    ${(c.suitability || 'suitable').replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
              <p class="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-3">${c.reason}</p>
              <div class="grid grid-cols-2 gap-2">
                ${c.expectedYield && c.expectedYield !== '—' ? `<div class="p-2 bg-primary-fixed/20 rounded-lg text-center"><p class="text-[10px] font-bold text-outline uppercase">Yield</p><p class="text-xs font-bold text-primary">${c.expectedYield}</p></div>` : ''}
                ${c.marketPrice   && c.marketPrice   !== '—' ? `<div class="p-2 bg-secondary-fixed/20 rounded-lg text-center"><p class="text-[10px] font-bold text-outline uppercase">Price</p><p class="text-xs font-bold text-secondary">${c.marketPrice}</p></div>` : ''}
                ${c.waterNeeds    && c.waterNeeds    !== '—' ? `<div class="p-2 bg-tertiary-fixed/20 rounded-lg text-center"><p class="text-[10px] font-bold text-outline uppercase">Water</p><p class="text-xs font-bold text-tertiary">${c.waterNeeds}</p></div>` : ''}
                ${c.duration      && c.duration      !== '—' ? `<div class="p-2 bg-surface-container-low rounded-lg text-center"><p class="text-[10px] font-bold text-outline uppercase">Duration</p><p class="text-xs font-bold text-on-surface">${c.duration}</p></div>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`;
    }

    // Fertilizer Plan
    const hasBasal = fert.basalDose?.length > 0;
    const hasTop   = fert.topDress?.length  > 0;
    const hasMicro = fert.micronutrients?.length > 0;
    if (hasBasal || hasTop || hasMicro) {
      html += `<div class="mb-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <h3 class="font-headline text-xl font-bold text-primary mb-5 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">compost</span>Fertilizer Plan
        </h3>
        <div class="grid grid-cols-3 gap-6">
          ${hasBasal ? `<div><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Basal Dose (At Sowing)</p><div class="space-y-2">${fert.basalDose.map(f => `<div class="p-3 bg-primary-fixed/10 rounded-xl"><p class="text-sm font-bold text-primary">${f.fertilizer}</p><p class="text-xs text-on-surface-variant">${f.quantity}${f.timing ? ` • ${f.timing}` : ''}</p></div>`).join('')}</div></div>` : '<div></div>'}
          ${hasTop   ? `<div><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Top Dressing</p><div class="space-y-2">${fert.topDress.map(f => `<div class="p-3 bg-secondary-fixed/10 rounded-xl"><p class="text-sm font-bold text-secondary">${f.fertilizer}</p><p class="text-xs text-on-surface-variant">${f.quantity}${f.timing ? ` • ${f.timing}` : ''}</p></div>`).join('')}</div></div>` : '<div></div>'}
          ${hasMicro ? `<div><p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Micronutrients</p><div class="space-y-2">${fert.micronutrients.map(m => `<div class="p-3 bg-tertiary-fixed/10 rounded-xl"><p class="text-sm font-bold text-tertiary">${m.nutrient}</p><p class="text-xs text-on-surface-variant">${m.application ? `${m.application} • ` : ''}${m.quantity}</p></div>`).join('')}</div></div>` : '<div></div>'}
        </div>
      </div>`;
    }

    // Best Practices
    if (practices.length) {
      html += `<div class="mb-8 bg-primary text-white p-6 rounded-2xl shadow-lg">
        <h3 class="font-headline text-xl font-bold mb-5 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-fixed">tips_and_updates</span>Best Practices
        </h3>
        <div class="grid grid-cols-2 gap-4">
          ${practices.map((p, i) => `
            <div class="p-4 bg-white/10 rounded-xl">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">${i + 1}</span>
                <p class="text-sm font-bold">${p.title || ''}</p>
              </div>
              <p class="text-xs text-primary-fixed-dim leading-relaxed">${p.description || ''}</p>
            </div>`).join('')}
        </div>
      </div>`;
    }

    // Soil Summary
    if (data.soilHealthSummary) {
      html += `<div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 mb-8">
        <h3 class="font-headline text-lg font-bold text-primary mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">layers</span>Soil Health Summary
        </h3>
        <p class="text-sm text-on-surface-variant leading-relaxed">${data.soilHealthSummary}</p>
      </div>`;
    }

    el.innerHTML = html || '<p class="text-sm text-outline text-center py-8">No recommendations generated. Try adjusting inputs and retry.</p>';
  }

  // Events
  document.getElementById('get-recommendations')?.addEventListener('click', fetchRecommendations);

  document.getElementById('rec-refresh')?.addEventListener('click', () => {
    document.getElementById('rec-results').innerHTML = '';
    loadNews();
  });

  window.addEventListener('prefs-changed', () => {
    const stateEl    = document.getElementById('rec-state');
    const districtEl = document.getElementById('rec-district');
    if (stateEl    && userPrefs.state)    stateEl.value    = userPrefs.state;
    if (districtEl && userPrefs.district) districtEl.value = userPrefs.district;
    loadNews();
  });

  loadNews();
}
