import { userPrefs, getSoilIntelligenceDashboard } from '../services/api.js';

const SEASONS = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
];

function nutrientStatus(value, low, high) {
  if (value < low) return { label: 'LOW', color: 'text-secondary', bgColor: 'bg-secondary' };
  if (value > high) return { label: 'HIGH', color: 'text-primary', bgColor: 'bg-primary' };
  return { label: 'NORMAL', color: 'text-on-surface', bgColor: 'bg-primary' };
}

export function renderRecommendations() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter bg-background">
    <div class="px-6 py-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="font-headline text-4xl font-extrabold tracking-tight">
            <span class="text-primary">Soil Intelligence</span>
            <span class="text-secondary"> &amp; Analytics</span>
          </h2>
          <p class="text-sm text-on-surface-variant mt-2 max-w-xl">
            Integrating hyperspectral soil analysis with predictive yield modeling for the ${userPrefs.district || userPrefs.city || 'local'} corridor.
          </p>
        </div>
        <div class="text-right flex items-center gap-3">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Last Sensor Sync</p>
            <p class="font-headline text-xl font-black text-primary" id="soil-last-sync">--:--</p>
          </div>
          <button id="soil-refresh" class="w-10 h-10 border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <span class="material-symbols-outlined text-outline">refresh</span>
          </button>
        </div>
      </div>

      <!-- Config Row -->
      <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 mb-6">
        <div class="grid grid-cols-8 gap-4">
          <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">District / Location</label>
            <input id="soil-district" type="text" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"
              value="${userPrefs.district || userPrefs.city || 'Nashik'}"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">State</label>
            <input id="soil-state" type="text" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"
              value="${userPrefs.state || 'Maharashtra'}"/>
          </div>
          <div>
            <input id="soil-season" type="text" placeholder="Season" value="Summer" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">pH</label>
            <input id="soil-ph" type="number" step="0.1" min="0" max="14" value="6.8"
              class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">N (mg/kg)</label>
            <input id="soil-n" type="number" min="0" value="42"
              class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">P (mg/kg)</label>
            <input id="soil-p" type="number" min="0" value="18"
              class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">K (mg/kg)</label>
            <input id="soil-k" type="number" min="0" value="245"
              class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button id="soil-generate" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2 shadow-md">
            <span class="material-symbols-outlined text-sm">analytics</span> Generate Full Report
          </button>
          <div id="soil-loading" class="hidden flex items-center gap-2 text-primary text-sm font-bold">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Analyzing live soil data…
          </div>
        </div>
      </div>

      <div id="soil-error" class="mb-4"></div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-12 gap-5">

        <!-- Macronutrient Profile -->
        <div class="col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-headline text-2xl font-extrabold text-primary">Macronutrient Profile</h3>
              <p class="text-[10px] font-bold uppercase tracking-widest text-outline mt-0.5">Chemical Composition Analysis</p>
            </div>
            <span id="soil-optimal-ph" class="px-3 py-1.5 bg-primary-fixed text-primary text-sm font-bold rounded-lg">Optimal pH: 6.8</span>
          </div>

          <!-- N P K Bars -->
          <div class="grid grid-cols-3 gap-6 mb-6" id="soil-nutrients">
            ${renderNutrientBar('N', 42, 30, 70, '#0f5132')}
            ${renderNutrientBar('P', 18, 24, 50, '#2b5bb5')}
            ${renderNutrientBar('K', 245, 90, 180, '#0f5132')}
          </div>

          <!-- AI Insight -->
          <div class="p-4 bg-surface-container-low rounded-xl border-l-4 border-secondary">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-secondary text-lg mt-0.5">lightbulb</span>
              <div>
                <p class="text-sm font-bold text-primary" id="soil-insight-title">AI Insight: Loading analysis…</p>
                <p class="text-xs text-on-surface-variant mt-1 leading-relaxed" id="soil-insight-text">
                  Generate a report to see optimized nutrient and yield guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Crop Recommendation -->
        <div class="col-span-5 bg-gradient-to-b from-primary to-primary-container rounded-2xl p-6 text-white shadow-xl">
          <div class="mb-2">
            <span class="inline-block px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider">Local Context - ${userPrefs.season || 'Current Season'}</span>
          </div>
          <h3 class="font-headline text-2xl font-extrabold mt-2 mb-4">Crop Recommendation</h3>
          <div id="soil-recommendations" class="space-y-3 mb-5">
            ${recPlaceholder('Table Grapes (Thomson Seedless)', 98)}
            ${recPlaceholder('Pomegranate (Bhagawa)', 84)}
          </div>
          <button id="soil-report-btn" class="w-full py-3 bg-white text-primary rounded-xl text-sm font-extrabold uppercase tracking-wider hover:opacity-90 transition-opacity">
            Generate Full Report
          </button>
        </div>

        <!-- Fertilizer Planner -->
        <div class="col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-headline text-2xl font-extrabold text-primary">Fertilizer Planner</h3>
              <p class="text-[10px] font-bold uppercase tracking-widest text-outline mt-0.5">Interactive Cost vs Yield Optimizer</p>
            </div>
            <div class="flex gap-2">
              <button id="view-quarterly" class="px-3 py-1.5 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold">Current View: Quarterly</button>
              <button id="optimize-now" class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">Optimize Now</button>
            </div>
          </div>

          <!-- Intensity Slider -->
          <div class="mb-5">
            <div class="flex justify-between mb-2">
              <label class="text-sm font-bold text-on-surface">Fertilizer Intensity (N-P-K)</label>
              <span class="text-sm font-bold text-primary">High (<span id="soil-intensity-text">85</span>%)</span>
            </div>
            <input id="soil-intensity" type="range" min="30" max="120" value="85"
              class="w-full accent-primary cursor-pointer"/>
          </div>

          <!-- Bar Chart -->
          <div class="flex items-end gap-1.5 h-24 mb-5 relative" id="fertilizer-chart">
            ${Array(6).fill(0).map((_, i) => {
              const h = [40, 60, 75, 100, 80, 65][i];
              const isPeak = i === 3;
              return `<div class="flex-1 rounded-t-sm ${isPeak ? 'bg-primary' : 'bg-surface-container-high'} transition-all relative" style="height:${h}%">
                ${isPeak ? `<div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-secondary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap">Optimal Peak</div>` : ''}
              </div>`;
            }).join('')}
          </div>

          <!-- Cost/Yield Display -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-surface-container rounded-xl p-4">
              <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Projected Cost</p>
              <p class="font-headline text-2xl font-black text-primary mt-1" id="soil-projected-cost">₹24,500/acre</p>
            </div>
            <div class="bg-secondary-fixed/30 rounded-xl p-4 border border-secondary/20">
              <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Estimated Yield</p>
              <p class="font-headline text-2xl font-black text-secondary mt-1" id="soil-yield-gain">+18.4%</p>
            </div>
          </div>
        </div>

        <!-- Optimization Heatmap -->
        <div class="col-span-5 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div class="p-5">
            <h3 class="font-headline text-base font-bold text-primary">Optimization Heatmap</h3>
            <p class="text-[10px] font-bold uppercase tracking-widest text-outline mt-0.5" id="heatmap-region">
              ${userPrefs.district || userPrefs.city || 'Nashik'} District Corridor
            </p>
          </div>
          <!-- Heatmap visualization -->
          <div class="relative h-40 bg-gradient-to-br from-surface-container-high to-surface-container-low mx-5 rounded-xl overflow-hidden mb-4">
            <!-- Grid pattern -->
            <div class="absolute inset-0" style="background-image: linear-gradient(rgba(18,59,42,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(18,59,42,0.15) 1px, transparent 1px); background-size: 20px 20px;"></div>
            <!-- Heat blobs -->
            <div class="absolute" style="top: 15%; left: 20%; width: 60%; height: 60%; background: radial-gradient(ellipse, rgba(18,59,42,0.5) 0%, transparent 70%); border-radius: 50%;"></div>
            <div class="absolute" style="top: 40%; left: 50%; width: 40%; height: 40%; background: radial-gradient(ellipse, rgba(43,91,181,0.3) 0%, transparent 70%); border-radius: 50%;"></div>
            <!-- Badge -->
            <div class="absolute top-3 right-3">
              <span class="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-primary-fixed rounded-full"></span>
                HIGH FERTILITY
              </span>
            </div>
          </div>
          <div class="px-5 pb-5">
            <div class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <div>
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Active Sector</p>
                <p class="text-sm font-bold text-primary" id="active-sector">Niphad Subdivision</p>
              </div>
              <button onclick="alert('Opening sector details...')" class="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <span class="material-symbols-outlined text-primary text-sm">info</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Stats Row -->
        <div class="col-span-12 grid grid-cols-4 gap-4">
          ${statTile('thermostat', 'Soil Temp', '24.2°C', 'soil-temp')}
          ${statTile('water_drop', 'Moisture', '12.5% VWC', 'soil-moisture')}
          ${statTile('bolt', 'EC Content', '0.82 dS/m', 'soil-ec')}
          ${statTile('texture', 'Texture', 'Silty Loam', 'soil-texture')}
        </div>

      </div>
    </div>
  </main>`;
}

function renderNutrientBar(label, value, low, high, color) {
  const pct = Math.max(5, Math.min(100, (value / (high * 1.3)) * 100));
  const st = nutrientStatus(value, low, high);
  const longLabel = { N: 'NITROGEN', P: 'PHOSPHORUS', K: 'POTASSIUM' }[label];

  return `<div id="nutrient-${label.toLowerCase()}">
    <div class="flex justify-between items-baseline mb-2">
      <p class="text-4xl font-extrabold ${st.color}" style="font-family:'Manrope',sans-serif">${label}</p>
      <p class="text-sm font-bold text-on-surface">${value} mg/kg</p>
    </div>
    <div class="h-28 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/10 relative" id="bar-${label.toLowerCase()}">
      <div class="absolute bottom-0 w-full rounded-lg transition-all duration-700" style="height:${pct}%; background:${color};"></div>
    </div>
    <p class="text-xs font-extrabold tracking-widest mt-2 ${st.color}">${longLabel} (${st.label})</p>
  </div>`;
}

function recPlaceholder(name, prob) {
  return `
    <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-colors cursor-pointer">
      <div class="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-primary-fixed text-lg" style="font-variation-settings:'FILL' 1">eco</span>
      </div>
      <div class="flex-1">
        <p class="font-bold text-white leading-tight text-sm">${name}</p>
        <p class="text-xs text-primary-fixed-dim">Match Probability: ${prob}%</p>
      </div>
      <span class="material-symbols-outlined text-primary-fixed text-base">verified</span>
    </div>`;
}

function statTile(icon, label, value, id) {
  return `
    <div class="bg-surface-container-lowest rounded-xl px-5 py-4 shadow-sm border border-outline-variant/10 flex items-center gap-3">
      <span class="material-symbols-outlined text-outline text-xl">${icon}</span>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-outline">${label}</p>
        <p class="font-headline text-lg font-extrabold text-primary mt-0.5" id="${id}">${value}</p>
      </div>
    </div>`;
}

function updateNutrientBar(label, value, low, high, color) {
  const pct = Math.max(5, Math.min(100, (value / (high * 1.3)) * 100));
  const st = nutrientStatus(value, low, high);
  const longLabel = { N: 'NITROGEN', P: 'PHOSPHORUS', K: 'POTASSIUM' }[label];

  const container = document.getElementById(`nutrient-${label.toLowerCase()}`);
  if (!container) return;
  const bar = document.getElementById(`bar-${label.toLowerCase()}`);
  if (bar) {
    const inner = bar.querySelector('div');
    if (inner) inner.style.height = `${pct}%`;
  }
  // Update labels
  const bigLabel = container.querySelector('p:first-child');
  const valueLbl = container.querySelector('p:nth-child(2)');
  const statusLbl = container.querySelector('p:last-child');
  if (bigLabel) bigLabel.className = `text-4xl font-extrabold ${st.color}`;
  if (valueLbl) valueLbl.textContent = `${value} mg/kg`;
  if (statusLbl) statusLbl.textContent = `${longLabel} (${st.label})`;
}

function updateFertilizerChart(intensity) {
  const el = document.getElementById('fertilizer-chart');
  if (!el) return;

  const baseHeights = [40, 60, 75, 100, 80, 65];
  const adjusted = baseHeights.map(h => Math.max(15, Math.min(100, (h * intensity) / 85)));
  const peakIdx = adjusted.indexOf(Math.max(...adjusted));

  el.innerHTML = adjusted.map((h, i) => {
    const isPeak = i === peakIdx;
    return `<div class="flex-1 rounded-t-sm ${isPeak ? 'bg-primary' : 'bg-surface-container-high'} transition-all relative" style="height:${h}%">
      ${isPeak ? `<div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-secondary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap">Optimal Peak</div>` : ''}
    </div>`;
  }).join('');
}

export function initRecommendations() {
  let lastData = null;

  function collectInputs() {
    return {
      state: document.getElementById('soil-state')?.value?.trim() || userPrefs.state || 'Maharashtra',
      district: document.getElementById('soil-district')?.value?.trim() || userPrefs.district || userPrefs.city || 'Nashik',
      season: document.getElementById('soil-season')?.value || 'kharif',
      ph: parseFloat(document.getElementById('soil-ph')?.value) || 6.8,
      n: parseFloat(document.getElementById('soil-n')?.value) || 42,
      p: parseFloat(document.getElementById('soil-p')?.value) || 18,
      k: parseFloat(document.getElementById('soil-k')?.value) || 245,
    };
  }

  // Intensity slider
  const slider = document.getElementById('soil-intensity');
  const sliderText = document.getElementById('soil-intensity-text');

  slider?.addEventListener('input', () => {
    const intensity = parseInt(slider.value);
    if (sliderText) sliderText.textContent = intensity;

    // Update cost/yield calculations dynamically
    const baseCost = lastData?.fertilizerPlan?.totalCostPerAcre || 24500;
    const baseYield = lastData?.fertilizerPlan?.projectedYieldGainPct || 18.4;

    const cost = Math.round((baseCost * intensity) / 85);
    const yieldGain = ((baseYield * intensity) / 85).toFixed(1);

    const costEl = document.getElementById('soil-projected-cost');
    const yieldEl = document.getElementById('soil-yield-gain');
    if (costEl) costEl.textContent = `₹${cost.toLocaleString('en-IN')}/acre`;
    if (yieldEl) yieldEl.textContent = `+${yieldGain}%`;

    updateFertilizerChart(intensity);
  });

  // Live update NPK bars as user types
  ['soil-n', 'soil-p', 'soil-k'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const inputs = collectInputs();
      updateNutrientBar('N', inputs.n, 30, 70, '#0f5132');
      updateNutrientBar('P', inputs.p, 24, 50, '#2b5bb5');
      updateNutrientBar('K', inputs.k, 90, 180, '#0f5132');
    });
  });

  // Optimal pH badge
  document.getElementById('soil-ph')?.addEventListener('input', (e) => {
    const phBadge = document.getElementById('soil-optimal-ph');
    if (phBadge) phBadge.textContent = `Optimal pH: ${parseFloat(e.target.value).toFixed(1)}`;
  });

  // Update time
  function updateSyncTime() {
    const el = document.getElementById('soil-last-sync');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' });
    }
  }

  async function runIntelligence() {
    const errEl = document.getElementById('soil-error');
    const loadingEl = document.getElementById('soil-loading');
    errEl.innerHTML = '';
    loadingEl.classList.remove('hidden');

    const inputs = collectInputs();

    // Immediately update NPK bars with user's values
    updateNutrientBar('N', inputs.n, 30, 70, '#0f5132');
    updateNutrientBar('P', inputs.p, 24, 50, '#2b5bb5');
    updateNutrientBar('K', inputs.k, 90, 180, '#0f5132');

    // Update pH badge
    const phBadge = document.getElementById('soil-optimal-ph');
    if (phBadge) phBadge.textContent = `Optimal pH: ${inputs.ph.toFixed(1)}`;

    // Update heatmap region
    const heatmapRegion = document.getElementById('heatmap-region');
    if (heatmapRegion) heatmapRegion.textContent = `${inputs.district} District Corridor`;
    const activeSector = document.getElementById('active-sector');
    if (activeSector) activeSector.textContent = `${inputs.district} Subdivision`;

    try {
      const result = await getSoilIntelligenceDashboard({
        state: inputs.state,
        district: inputs.district,
        season: inputs.season,
        soilType: 'Silty Loam',
        rainfall: 780,
        temperature: 24.2,
        soilData: { pH: inputs.ph, nitrogen: inputs.n, phosphorus: inputs.p, potassium: inputs.k },
      });
      lastData = result;

      // Update insight
      const insightTitle = document.getElementById('soil-insight-title');
      const insightText = document.getElementById('soil-insight-text');
      const summary = result.soilHealthSummary || result.primaryRecommendation?.reasoning || '';
      if (insightTitle) insightTitle.textContent = 'AI Insight: ' + (inputs.k > 180 ? 'Potassium saturation is above target.' : inputs.p < 24 ? 'Phosphorus levels are deficient.' : 'Nutrient levels are within acceptable range.');
      if (insightText) insightText.textContent = summary || `Reduce K-rich fertilization for the next 14-day cycle to maintain moisture retention.`;

      // Update recommendations
      const recsEl = document.getElementById('soil-recommendations');
      const crops = result.recommendedCrops || [];
      if (recsEl && crops.length > 0) {
        recsEl.innerHTML = crops.slice(0, 3).map(c => {
          const prob = Math.round((c.confidence || 0.85) * 100);
          const icon = c.name?.toLowerCase().includes('grape') ? 'eco' : c.name?.toLowerCase().includes('pomegranate') ? 'filter_vintage' : 'agriculture';
          return `
            <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary-fixed text-lg" style="font-variation-settings:'FILL' 1">${icon}</span>
              </div>
              <div class="flex-1">
                <p class="font-bold text-white text-sm leading-tight">${c.name}</p>
                <p class="text-xs text-primary-fixed-dim">Match Probability: ${prob}%</p>
              </div>
              ${prob >= 90 ? `<span class="material-symbols-outlined text-primary-fixed">verified</span>` : `<span class="material-symbols-outlined text-primary-fixed">chevron_right</span>`}
            </div>`;
        }).join('');
      }

      // Update fertilizer planner
      const intensity = parseInt(slider?.value || 85);
      const baseCost = result.fertilizerPlan?.totalCostPerAcre || 24500;
      const baseYield = result.fertilizerPlan?.projectedYieldGainPct || 18.4;
      const cost = Math.round((baseCost * intensity) / 85);
      const yieldGain = ((baseYield * intensity) / 85).toFixed(1);

      const costEl = document.getElementById('soil-projected-cost');
      const yieldEl = document.getElementById('soil-yield-gain');
      if (costEl) costEl.textContent = `₹${cost.toLocaleString('en-IN')}/acre`;
      if (yieldEl) yieldEl.textContent = `+${yieldGain}%`;

      updateSyncTime();
    } catch (error) {
      errEl.innerHTML = `<div class="bg-error/10 border border-error/20 rounded-xl p-4 text-error text-sm font-semibold">${error.message}</div>`;
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  document.getElementById('soil-generate')?.addEventListener('click', runIntelligence);
  document.getElementById('soil-report-btn')?.addEventListener('click', runIntelligence);
  document.getElementById('soil-refresh')?.addEventListener('click', runIntelligence);

  document.getElementById('optimize-now')?.addEventListener('click', () => {
    if (slider) {
      slider.value = 85;
      if (sliderText) sliderText.textContent = '85';
      slider.dispatchEvent(new Event('input'));
    }
    runIntelligence();
  });

  // Initialize
  updateSyncTime();
  updateFertilizerChart(85);

  // Auto-generate disabled to allow user input before AI simulation
  // setTimeout(runIntelligence, 300);
}
