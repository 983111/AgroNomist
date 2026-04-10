import { userPrefs, getSoilIntelligenceDashboard } from '../services/api.js';

const SEASONS = [
  { value: 'kharif', label: 'Kharif 2024' },
  { value: 'rabi', label: 'Rabi 2024-25' },
  { value: 'zaid', label: 'Zaid 2025' },
];

const CROP_EMOJI = {
  grape: 'eco', pomegranate: 'filter_vintage', cotton: 'spa', soybean: 'grain', maize: 'agriculture', sugarcane: 'grass',
};

function nutrientLabel(value, low, high) {
  if (value < low) return 'LOW';
  if (value > high) return 'HIGH';
  return 'NORMAL';
}

function nutrientBar(label, value, low, high, color = '#123b2a') {
  const pct = Math.max(0, Math.min(100, (value / (high * 1.2 || 1)) * 100));
  const status = nutrientLabel(value, low, high);
  const statusColor = status === 'LOW' ? 'text-secondary' : status === 'HIGH' ? 'text-primary' : 'text-on-surface';

  return `<div>
    <div class="flex justify-between items-baseline mb-1.5">
      <p class="text-[28px] font-extrabold leading-none ${status === 'LOW' ? 'text-secondary' : 'text-primary'}">${label}</p>
      <p class="text-sm font-bold text-on-surface">${Math.round(value)} mg/kg</p>
    </div>
    <div class="h-24 bg-surface-container rounded-md overflow-hidden border border-outline-variant/20">
      <div class="h-full transition-all duration-700" style="width:${pct}%; background:${color}"></div>
    </div>
    <p class="text-xs font-extrabold tracking-[0.12em] mt-2 ${statusColor}">${label === 'P' ? 'PHOSPHORUS' : label === 'N' ? 'NITROGEN' : 'POTASSIUM'} (${status})</p>
  </div>`;
}

function recommendationItem(crop, idx) {
  const icon = CROP_EMOJI[(crop?.name || '').toLowerCase()] || 'eco';
  const prob = Math.max(45, Math.min(99, Math.round((crop?.confidence || 0.85) * 100)));
  return `<div class="flex items-center gap-3 bg-white/10 rounded-xl p-3">
    <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-primary-fixed text-[20px]">${icon}</span></div>
    <div class="flex-1 min-w-0">
      <p class="font-bold text-lg text-white leading-tight">${crop?.name || `Crop ${idx + 1}`}</p>
      <p class="text-xs text-primary-fixed-dim">Match Probability: ${prob}%</p>
    </div>
  </div>`;
}

function statTile(icon, label, value) {
  return `<div class="bg-surface-container-lowest rounded-xl px-5 py-4 border border-outline-variant/20 shadow-sm">
    <div class="flex items-center gap-3">
      <span class="material-symbols-outlined text-outline">${icon}</span>
      <div>
        <p class="text-[11px] tracking-[0.15em] font-bold text-outline uppercase">${label}</p>
        <p class="text-xl font-extrabold text-primary mt-1">${value}</p>
      </div>
    </div>
  </div>`;
}

export function renderRecommendations() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter bg-background">
    <div class="px-8 py-7 max-w-[1320px] mx-auto space-y-6">
      <div class="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 class="font-headline text-5xl leading-tight font-extrabold text-primary">Soil Intelligence <span class="text-secondary">&amp; Analytics</span></h2>
          <p class="text-2xl mt-2 text-on-surface-variant">Integrating hyperspectral soil analysis with predictive yield modeling.</p>
        </div>
        <div class="text-right">
          <p class="text-xs tracking-[0.25em] font-bold text-outline uppercase">Last Sensor Sync</p>
          <p class="text-3xl font-extrabold text-primary" id="soil-last-sync">--:--</p>
        </div>
      </div>

      <section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 shadow-sm">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">State</label><input id="soil-state" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="${userPrefs.state || 'Maharashtra'}"/></div>
          <div class="col-span-3"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">District</label><input id="soil-district" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="${userPrefs.district || userPrefs.city || 'Nashik'}"/></div>
          <div class="col-span-2"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">Season</label><select id="soil-season" class="w-full mt-1 rounded-xl border-none bg-surface-container-low">${SEASONS.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}</select></div>
          <div class="col-span-2"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">pH</label><input id="soil-ph" type="number" step="0.1" min="0" max="14" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="6.8"/></div>
          <div class="col-span-2"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">Farm Size (acre)</label><input id="soil-farm-size" type="number" step="0.5" min="0.5" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="5"/></div>

          <div class="col-span-3"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">Nitrogen</label><input id="soil-n" type="number" min="0" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="42"/></div>
          <div class="col-span-3"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">Phosphorus</label><input id="soil-p" type="number" min="0" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="18"/></div>
          <div class="col-span-3"><label class="text-xs font-bold uppercase tracking-[0.12em] text-outline">Potassium</label><input id="soil-k" type="number" min="0" class="w-full mt-1 rounded-xl border-none bg-surface-container-low" value="245"/></div>
          <div class="col-span-3 flex items-end"><button id="soil-generate" class="w-full rounded-xl bg-primary text-white py-3 font-bold hover:opacity-90 transition">Generate Full Report</button></div>
        </div>
      </section>

      <div id="soil-loading" class="hidden bg-primary/5 rounded-xl p-4 text-primary text-sm font-bold">Analyzing live soil data…</div>
      <div id="soil-error"></div>

      <section id="soil-results" class="grid grid-cols-12 gap-6">
        <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <div class="flex items-center justify-between mb-4"><h3 class="font-headline text-[42px] font-extrabold text-primary">Macronutrient Profile</h3><p class="px-3 py-2 rounded-lg text-base font-bold bg-primary-fixed text-primary" id="soil-optimal-ph">Optimal pH: 6.8</p></div>
          <p class="text-xs font-bold tracking-[0.2em] text-outline uppercase mb-5">Chemical Composition Analysis</p>
          <div class="grid grid-cols-3 gap-6" id="soil-nutrients"></div>
          <div class="mt-6 bg-surface-container-low rounded-xl p-4 border-l-4 border-secondary">
            <p class="font-bold text-lg text-primary" id="soil-insight-title">AI Insight</p>
            <p class="text-on-surface-variant mt-1.5 text-sm" id="soil-insight-text">Generate report to see optimized nutrient and yield guidance.</p>
          </div>
        </div>

        <div class="col-span-4 rounded-2xl p-6 bg-gradient-to-b from-primary to-[#0c5a3d] text-white shadow-xl">
          <p class="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold tracking-[0.14em]">India Context</p>
          <h3 class="font-headline text-4xl font-extrabold mt-3">Crop Recommendation</h3>
          <div class="mt-4 space-y-3" id="soil-recommendations"></div>
          <button id="soil-report-btn" class="w-full mt-5 py-3 rounded-xl bg-white text-primary text-sm font-extrabold tracking-[0.12em] uppercase">Generate Full Report</button>
        </div>

        <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
          <h3 class="font-headline text-[42px] font-extrabold text-primary">Fertilizer Planner</h3>
          <p class="text-xs font-bold tracking-[0.2em] text-outline uppercase">Interactive Cost vs Yield Optimizer</p>
          <div class="mt-6">
            <label class="block text-sm font-bold mb-1.5">Fertilizer Intensity (<span id="soil-intensity-text">85</span>%)</label>
            <input id="soil-intensity" type="range" min="40" max="120" value="85" class="w-full"/>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-5">
            <div class="bg-surface-container rounded-xl p-4"><p class="text-xs uppercase tracking-[0.12em] font-bold text-outline">Projected Cost</p><p class="text-3xl mt-2 font-extrabold text-primary" id="soil-projected-cost">₹24,500/acre</p></div>
            <div class="bg-secondary-fixed/40 rounded-xl p-4"><p class="text-xs uppercase tracking-[0.12em] font-bold text-outline">Estimated Yield Gain</p><p class="text-3xl mt-2 font-extrabold text-secondary" id="soil-yield-gain">+18.4%</p></div>
          </div>
        </div>

        <div class="col-span-4 space-y-4" id="soil-stats"></div>
      </section>
    </div>
  </main>`;
}

export function initRecommendations() {
  const defaults = {
    recommendedCrops: [{ name: 'Table Grapes' }, { name: 'Pomegranate' }],
    soilHealthSummary: 'Potassium saturation is above target. Reduce K-rich fertilization for the next 14-day cycle to improve moisture retention.',
    fertilizerPlan: { totalCostPerAcre: 24500, projectedYieldGainPct: 18.4 },
  };

  const errorEl = document.getElementById('soil-error');
  const loadingEl = document.getElementById('soil-loading');
  const intensitySlider = document.getElementById('soil-intensity');
  const intensityText = document.getElementById('soil-intensity-text');

  function updateLastSync() {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' });
    const syncEl = document.getElementById('soil-last-sync');
    if (syncEl) syncEl.textContent = formatted;
  }

  function renderDashboard(data, inputs) {
    const n = inputs.n;
    const p = inputs.p;
    const k = inputs.k;

    const nutrientEl = document.getElementById('soil-nutrients');
    nutrientEl.innerHTML = [
      nutrientBar('N', n, 30, 70, '#0f5132'),
      nutrientBar('P', p, 24, 50, '#2b5bb5'),
      nutrientBar('K', k, 90, 180, '#0f5132'),
    ].join('');

    document.getElementById('soil-optimal-ph').textContent = `Optimal pH: ${Math.max(6, Math.min(7.2, inputs.ph)).toFixed(1)}`;
    document.getElementById('soil-insight-title').textContent = 'AI Insight';
    document.getElementById('soil-insight-text').textContent = data.soilHealthSummary || defaults.soilHealthSummary;

    const recommendations = (data.recommendedCrops || defaults.recommendedCrops).slice(0, 2);
    document.getElementById('soil-recommendations').innerHTML = recommendations.map(recommendationItem).join('');

    const intensity = parseInt(intensitySlider?.value || '85', 10);
    const baseCost = Number(data.fertilizerPlan?.totalCostPerAcre || defaults.fertilizerPlan.totalCostPerAcre);
    const baseYield = Number(data.fertilizerPlan?.projectedYieldGainPct || defaults.fertilizerPlan.projectedYieldGainPct);

    const projectedCost = Math.round((baseCost * intensity) / 85);
    const projectedYield = ((baseYield * intensity) / 85).toFixed(1);
    document.getElementById('soil-projected-cost').textContent = `₹${projectedCost.toLocaleString('en-IN')}/acre`;
    document.getElementById('soil-yield-gain').textContent = `+${projectedYield}%`;

    const statsEl = document.getElementById('soil-stats');
    statsEl.innerHTML = [
      statTile('thermostat', 'Soil Temp', `${Number(inputs.temperature || 24.2).toFixed(1)}°C`),
      statTile('water_drop', 'Moisture', `${Number(inputs.moisture || 12.5).toFixed(1)}% VWC`),
      statTile('bolt', 'EC Content', `${Number(inputs.ec || 0.82).toFixed(2)} dS/m`),
      statTile('texture', 'Texture', inputs.texture || 'Silty Loam'),
    ].join('');
  }

  function collectInputs() {
    return {
      state: document.getElementById('soil-state')?.value?.trim() || userPrefs.state,
      district: document.getElementById('soil-district')?.value?.trim() || userPrefs.district || userPrefs.city,
      season: document.getElementById('soil-season')?.value || 'kharif',
      farmSize: Number(document.getElementById('soil-farm-size')?.value || 5),
      ph: Number(document.getElementById('soil-ph')?.value || 6.8),
      n: Number(document.getElementById('soil-n')?.value || 42),
      p: Number(document.getElementById('soil-p')?.value || 18),
      k: Number(document.getElementById('soil-k')?.value || 245),
      rainfall: 780,
      temperature: 24.2,
      moisture: 12.5,
      ec: 0.82,
      texture: 'Silty Loam',
    };
  }

  async function runIntelligence() {
    errorEl.innerHTML = '';
    loadingEl.classList.remove('hidden');
    const inputs = collectInputs();

    try {
      const result = await getSoilIntelligenceDashboard({
        state: inputs.state,
        district: inputs.district,
        season: inputs.season,
        farmSize: inputs.farmSize,
        soilType: inputs.texture,
        rainfall: inputs.rainfall,
        temperature: inputs.temperature,
        soilData: { pH: inputs.ph, nitrogen: inputs.n, phosphorus: inputs.p, potassium: inputs.k },
      });
      renderDashboard(result, inputs);
      updateLastSync();
    } catch (error) {
      errorEl.innerHTML = `<div class="bg-error/10 border border-error/20 rounded-xl p-4 text-error font-semibold">${error.message || 'Unable to generate intelligence report.'}</div>`;
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  intensitySlider?.addEventListener('input', () => {
    intensityText.textContent = intensitySlider.value;
    renderDashboard(defaults, collectInputs());
  });

  document.getElementById('soil-generate')?.addEventListener('click', runIntelligence);
  document.getElementById('soil-report-btn')?.addEventListener('click', runIntelligence);

  renderDashboard(defaults, collectInputs());
  updateLastSync();
}
