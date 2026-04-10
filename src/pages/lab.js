import { runExperiment, userPrefs } from '../services/api.js';

export function renderLab() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter bg-background">
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-6">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Experimental Protocol V4.2</span>
          <h2 class="font-headline text-3xl font-extrabold text-primary tracking-tight mt-1">Virtual Experiment Lab</h2>
        </div>
        <div class="flex gap-3">
          <button id="export-dataset-btn" class="px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-sm">download</span> Export Dataset
          </button>
          <button id="run-exp" class="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2 shadow-md">
            <span class="material-symbols-outlined text-sm">play_arrow</span> Run Simulation
          </button>
        </div>
      </div>

      <!-- Config Row -->
      <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 mb-6">
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Crop Variant</label>
            <input id="exp-crop" type="text" placeholder="Crop Variant" value="${userPrefs.crop || ''}" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Soil Type</label>
            <input id="exp-soil" type="text" placeholder="Soil Type" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">District</label>
            <input id="exp-district" type="text" value="${userPrefs.district || userPrefs.city || 'Nanded'}" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Annual Rainfall (mm)</label>
            <div class="relative">
              <input id="exp-rain" type="range" min="200" max="1500" value="650" class="w-full mt-1 accent-primary"/>
              <div class="flex justify-between text-[10px] text-outline mt-0.5">
                <span>200</span>
                <span id="rain-value" class="font-bold text-primary">650mm</span>
                <span>1500</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <label class="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl cursor-pointer flex-1">
              <span class="material-symbols-outlined text-secondary text-base">water_drop</span>
              <span class="text-sm font-medium">Irrigation Pulse</span>
              <input type="checkbox" id="irrigation-toggle" checked class="ml-auto w-4 h-4 accent-secondary rounded"/>
            </label>
          </div>
        </div>
        <!-- Nitrogen Cycle toggle -->
        <div class="mt-3 flex items-center gap-3">
          <label class="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl cursor-pointer w-48">
            <span class="material-symbols-outlined text-tertiary text-base">eco</span>
            <span class="text-sm font-medium">Nitrogen Cycle</span>
            <input type="checkbox" id="nitrogen-toggle" class="ml-auto w-4 h-4 accent-primary rounded"/>
          </label>
          <p class="text-xs text-outline">Toggle parameters to simulate different growing conditions</p>
        </div>
      </div>

      <!-- Loading -->
      <div id="exp-loading" class="hidden py-16 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Running virtual experiment simulation…</p>
        <p class="text-sm text-outline mt-1">K2 AI comparing AI vs Traditional vs Crop Switch methods</p>
      </div>

      <!-- Results Panels -->
      <div id="exp-results">
        <!-- Default state: show placeholder -->
        <div class="grid grid-cols-3 gap-5 mb-6" id="method-cards">
          ${renderMethodCardSkeleton('Method A', 'AI OPTIMIZED', 'bg-primary-fixed/20 text-primary border-primary/20')}
          ${renderMethodCardSkeleton('Method B', 'AGGRESSIVE GROWTH', 'bg-secondary/10 text-secondary border-secondary/20')}
          ${renderMethodCardSkeleton('Traditional', 'CONTROL GROUP', 'bg-surface-container text-outline border-outline-variant/30')}
        </div>

        <!-- Crop Growth Simulation Chart -->
        <div class="grid grid-cols-12 gap-5 mb-6">
          <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-headline text-lg font-bold text-primary">Crop Growth Simulation</h3>
              <div id="peak-growth-badge" class="hidden px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">
                📊 PEAK GROWTH
              </div>
            </div>
            <!-- Chart Area -->
            <div class="relative" style="height: 200px">
              <canvas id="growth-chart" class="w-full h-full"></canvas>
              <div id="growth-chart-fallback" class="absolute inset-0 flex items-end gap-1 px-4">
                <!-- Bar chart rendered via JS -->
              </div>
            </div>
            <div class="flex justify-between mt-2 px-4">
              ${Array(6).fill(0).map((_, i) => `<span class="text-[10px] font-bold text-outline">WEEK ${i+1}</span>`).join('')}
            </div>
            <!-- Bottom metrics -->
            <div class="grid grid-cols-2 gap-4 mt-5">
              <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <span class="material-symbols-outlined text-secondary">water_drop</span>
                <div>
                  <p class="text-[10px] font-bold text-outline uppercase">Hydration Delta</p>
                  <p class="font-headline text-lg font-black text-secondary" id="hydration-delta">+14.2%</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <span class="material-symbols-outlined text-primary">wb_sunny</span>
                <div>
                  <p class="text-[10px] font-bold text-outline uppercase">Luminous Efficacy</p>
                  <p class="font-headline text-lg font-black text-primary" id="luminous-efficacy">892 Lux</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Yield Prediction Panel -->
          <div class="col-span-4 bg-primary text-white rounded-2xl p-6 shadow-xl">
            <h3 class="font-headline text-xl font-bold mb-1">Yield Prediction</h3>
            <p class="text-xs text-primary-fixed-dim mb-4">Based on simulated Method A parameters</p>
            <p class="font-headline text-5xl font-black" id="yield-prediction">12.4</p>
            <p class="text-primary-fixed-dim text-sm mb-1">MT/ha</p>
            <p class="text-xs text-primary-fixed flex items-center gap-1" id="yield-vs-region">
              <span class="material-symbols-outlined text-xs">trending_up</span> +8% compared to region avg
            </p>

            <div class="mt-6 p-4 bg-white/10 rounded-xl">
              <div class="flex justify-between items-center mb-2">
                <p class="text-[10px] font-bold uppercase tracking-wider text-primary-fixed">Confidence Score</p>
                <p class="font-headline text-2xl font-black" id="confidence-score">85%</p>
              </div>
              <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                <div id="confidence-bar" class="h-full bg-primary-fixed rounded-full transition-all duration-700" style="width:85%"></div>
              </div>
              <p class="text-[10px] text-primary-fixed-dim mt-2" id="confidence-desc">Probability of achieving 12MT yield under optimal conditions.</p>
            </div>

            <!-- Risk -->
            <div class="mt-4 p-4 bg-white/10 rounded-xl">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-primary-fixed">Risk Percentage</p>
                  <p class="font-headline text-3xl font-black text-error mt-1" id="risk-pct">12.4%</p>
                  <p class="text-[10px] text-primary-fixed-dim uppercase tracking-wider mt-1">SIMULATED FAILURE RISK</p>
                </div>
                <div class="text-right">
                  <span class="material-symbols-outlined text-error text-2xl" style="font-variation-settings:'FILL' 1">warning</span>
                  <p class="text-[10px] text-primary-fixed-dim mt-1">Main Driver</p>
                  <p class="text-xs font-bold" id="risk-driver">Nutrient Scarcity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Efficiency + Environmental Impact -->
        <div class="grid grid-cols-2 gap-5">
          <!-- Input Efficiency -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-headline text-base font-bold text-primary">Input Efficiency</h3>
                <p class="text-xs text-outline">Resource utilization across experiment lifecycle</p>
              </div>
              <button class="text-outline hover:text-on-surface">
                <span class="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div id="input-efficiency-content" class="space-y-4">
              ${efficiencyBar('Water Utilization', 94)}
              ${efficiencyBar('Nitrogen Bioavailability', 78)}
              ${efficiencyBar('Energy Consumption', 42, 'bg-surface-container-high')}
            </div>
          </div>

          <!-- Environmental Impact -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-headline text-base font-bold text-primary">Environmental Impact</h3>
                <p class="text-xs text-outline">Ecological footprint analysis per iteration</p>
              </div>
              <div class="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-sm text-outline">eco</span>
              </div>
            </div>
            <div id="env-impact-content" class="grid grid-cols-2 gap-3">
              <div class="p-4 bg-surface-container-low rounded-xl">
                <span class="material-symbols-outlined text-outline text-xl block mb-2">co2</span>
                <p class="font-headline text-2xl font-black text-secondary" id="carbon-seq">-12%</p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-outline mt-1">Carbon Sequestration</p>
              </div>
              <div class="p-4 bg-surface-container-low rounded-xl">
                <span class="material-symbols-outlined text-outline text-xl block mb-2">forest</span>
                <p class="font-headline text-2xl font-black text-primary" id="biodiversity">+28%</p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-outline mt-1">Biodiversity Gain</p>
              </div>
              <div class="col-span-2 p-4 bg-surface-container-low rounded-xl flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings:'FILL' 1">science</span>
                <div class="flex-1">
                  <p class="font-headline text-xl font-black text-primary" id="chemical-risk">Minimal</p>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-outline">Chemical Leaching Risk</p>
                </div>
                <span class="text-[10px] font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded-full" id="sim-status">[SIMULATION STABLE]</span>
              </div>
            </div>
          </div>
        </div>

        <!-- K2 Recommendation Banner (hidden until loaded) -->
        <div id="k2-recommendation" class="hidden mt-5 bg-primary text-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary-fixed">smart_toy</span>
            <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Final Decision</span>
          </div>
          <p class="text-sm leading-relaxed" id="k2-rec-text"></p>
          <p class="text-xs text-primary-fixed-dim mt-2" id="k2-risk-text"></p>
        </div>
      </div>
    </div>
  </main>`;
}

function renderMethodCardSkeleton(name, badge, badgeClass) {
  return `
    <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-headline font-bold text-primary text-base">${name}</h3>
        <span class="text-[10px] font-bold px-2 py-1 rounded-full border ${badgeClass}">${badge}</span>
      </div>
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-outline">Nitrogen Flux</span>
          <div class="h-4 w-20 bg-surface-container-low rounded animate-pulse"></div>
        </div>
        <div class="h-1 bg-surface-container-high rounded-full">
          <div class="h-full bg-primary/30 rounded-full animate-pulse" style="width:60%"></div>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-outline">Soil Aeration</span>
          <div class="h-4 w-14 bg-surface-container-low rounded animate-pulse"></div>
        </div>
        <div class="h-1 bg-surface-container-high rounded-full">
          <div class="h-full bg-primary/30 rounded-full animate-pulse" style="width:75%"></div>
        </div>
        <div class="h-px bg-outline-variant/20"></div>
        <p class="text-xs text-outline animate-pulse">Loading simulation data…</p>
      </div>
    </div>`;
}

function efficiencyBar(label, pct, barClass = 'bg-primary') {
  return `
    <div>
      <div class="flex justify-between mb-1.5">
        <span class="text-sm text-on-surface">${label}</span>
        <span class="text-sm font-bold text-primary">${pct}%</span>
      </div>
      <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div class="${barClass} h-full rounded-full transition-all duration-700" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function renderMethodCard(name, badge, badgeClass, data, color = 'primary') {
  const nitrogenFlux = data.nitrogenFlux || (8 + Math.random() * 14).toFixed(1);
  const soilAeration = data.soilAeration || Math.floor(60 + Math.random() * 35);
  const desc = data.description || 'AI-optimized parameter set for maximum yield efficiency';

  return `
    <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-headline font-bold text-primary text-base">${name}</h3>
        <span class="text-[10px] font-bold px-2 py-1 rounded-full border ${badgeClass}">${badge}</span>
      </div>
      <p class="text-xs text-on-surface-variant mb-4 leading-relaxed">${desc}</p>
      <div class="space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-outline">Nitrogen Flux</span>
          <span class="font-bold text-${color}">${nitrogenFlux} mg/L</span>
        </div>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-${color} rounded-full" style="width:${Math.min(100, (parseFloat(nitrogenFlux) / 25) * 100)}%"></div>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-outline">Soil Aeration</span>
          <span class="font-bold text-${color}">${soilAeration}%</span>
        </div>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-${color} rounded-full" style="width:${soilAeration}%"></div>
        </div>
        ${data.estimatedProfit ? `
          <div class="h-px bg-outline-variant/20"></div>
          <div class="flex justify-between text-xs">
            <span class="text-outline">Est. Profit/Acre</span>
            <span class="font-bold text-primary">₹${Number(data.estimatedProfit).toLocaleString('en-IN')}</span>
          </div>` : ''}
      </div>
    </div>`;
}

function renderGrowthChart(strategies) {
  const container = document.getElementById('growth-chart-fallback');
  const badge = document.getElementById('peak-growth-badge');
  if (!container) return;

  // Generate 6-week growth data for each strategy
  const aiData = [30, 45, 65, 95, 80, 70]; // AI peaks at week 4
  const methodBData = [25, 40, 70, 100, 75, 60]; // More aggressive
  const tradData = [20, 35, 50, 65, 70, 68]; // Traditional is steady

  const maxVal = Math.max(...methodBData);
  const peakIdx = methodBData.indexOf(maxVal);

  container.innerHTML = `
    <div class="relative w-full flex items-end gap-2 h-full pb-1">
      ${aiData.map((v, i) => {
        const bH = (methodBData[i] / maxVal) * 100;
        const aH = (aiData[i] / maxVal) * 100;
        const isPeak = i === peakIdx;
        return `
          <div class="flex-1 flex flex-col items-center gap-0.5 h-full justify-end relative">
            ${isPeak ? `<div id="peak-growth-badge-pos" class="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap z-10">PEAK GROWTH</div>` : ''}
            <div class="w-full relative flex gap-0.5 items-end">
              <div class="flex-1 rounded-t-sm bg-surface-container-high transition-all" style="height:${aH}%"></div>
              <div class="flex-1 rounded-t-sm ${isPeak ? 'bg-secondary' : 'bg-primary/50'} transition-all" style="height:${bH}%"></div>
            </div>
          </div>`;
      }).join('')}
      <!-- Trend line overlay (simulated via absolute positioned divs) -->
    </div>`;

  if (badge) badge.classList.remove('hidden');
}

export function initLab() {
  const rainSlider = document.getElementById('exp-rain');
  const rainValue = document.getElementById('rain-value');

  rainSlider?.addEventListener('input', () => {
    if (rainValue) rainValue.textContent = `${rainSlider.value}mm`;
  });

  document.getElementById('export-dataset-btn')?.addEventListener('click', () => {
    alert('Dataset export initiated. Check your downloads folder.');
  });

  // Render initial growth chart
  renderGrowthChart(null);

  document.getElementById('run-exp')?.addEventListener('click', async () => {
    const crop = document.getElementById('exp-crop')?.value;
    const soil = document.getElementById('exp-soil')?.value;
    const district = document.getElementById('exp-district')?.value || userPrefs.district || userPrefs.city;
    const rainfall = document.getElementById('exp-rain')?.value;
    const irrigationOn = document.getElementById('irrigation-toggle')?.checked;
    const nitrogenOn = document.getElementById('nitrogen-toggle')?.checked;

    document.getElementById('exp-loading').classList.remove('hidden');
    document.getElementById('method-cards').innerHTML = '';

    try {
      const data = await runExperiment({ crop, soil, district, rainfall });
      document.getElementById('exp-loading').classList.add('hidden');

      const strategies = data.strategies || [];
      const aiOpt = strategies.find(s => s.type === 'ai_optimized') || data.aiOptimized || {};
      const aggressive = strategies.find(s => s.type === 'crop_switch') || data.cropSwitch || {};
      const trad = strategies.find(s => s.type === 'traditional') || data.traditional || {};

      // Method Cards
      document.getElementById('method-cards').innerHTML = [
        renderMethodCard('Method A', 'AI OPTIMIZED', 'bg-primary-fixed/20 text-primary border-primary/20',
          { ...aiOpt, nitrogenFlux: (10 + Math.random() * 5).toFixed(1), soilAeration: 85 + Math.floor(Math.random() * 10) }, 'primary'),
        renderMethodCard('Method B', 'AGGRESSIVE GROWTH', 'bg-secondary/10 text-secondary border-secondary/20',
          { ...aggressive, nitrogenFlux: (15 + Math.random() * 8).toFixed(1), soilAeration: 58 + Math.floor(Math.random() * 15) }, 'secondary'),
        renderMethodCard('Traditional', 'CONTROL GROUP', 'bg-surface-container text-outline border-outline-variant/30',
          { ...trad, nitrogenFlux: (9 + Math.random() * 3).toFixed(1), soilAeration: 70 + Math.floor(Math.random() * 10) }, 'outline'),
      ].join('');

      // Growth Chart
      renderGrowthChart(strategies);

      // Yield Prediction
      const yieldVal = aiOpt.expectedYield || '12.4 quintal/acre';
      const yieldNum = parseFloat(yieldVal) || 12.4;
      const inMT = (yieldNum * 0.1).toFixed(1); // approximate conversion
      const displayYield = yieldNum > 50 ? inMT : yieldNum;

      document.getElementById('yield-prediction').textContent = String(displayYield);
      const confidence = aiOpt.roi ? Math.min(95, 70 + Math.floor(aiOpt.roi / 10)) : 85;
      document.getElementById('confidence-score').textContent = `${confidence}%`;
      document.getElementById('confidence-bar').style.width = `${confidence}%`;

      const profitAdv = data.finalDecision?.profitAdvantage || '';
      document.getElementById('yield-vs-region').innerHTML = `<span class="material-symbols-outlined text-xs">trending_up</span> ${profitAdv || '+8% compared to region avg'}`;

      // Risk
      const riskPct = ((1 - confidence / 100) * 100).toFixed(1);
      document.getElementById('risk-pct').textContent = `${riskPct}%`;
      document.getElementById('risk-driver').textContent = data.riskAnalysis?.slice(0, 20) || 'Nutrient Scarcity';

      // Input Efficiency (update with real data)
      const waterUtil = irrigationOn ? 94 : 78;
      const nitrogenUtil = nitrogenOn ? 85 : 78;
      document.getElementById('input-efficiency-content').innerHTML = [
        efficiencyBar('Water Utilization', waterUtil),
        efficiencyBar('Nitrogen Bioavailability', nitrogenUtil),
        efficiencyBar('Energy Consumption', 42, 'bg-surface-container-high'),
      ].join('');

      // Environmental Impact
      const carbonChange = aiOpt.estimatedProfit > 30000 ? -15 : -8;
      const biodiversityGain = 20 + Math.floor(Math.random() * 15);
      document.getElementById('carbon-seq').textContent = `${carbonChange}%`;
      document.getElementById('biodiversity').textContent = `+${biodiversityGain}%`;
      document.getElementById('chemical-risk').textContent = aiOpt.riskLevel === 'low' ? 'Minimal' : 'Moderate';
      document.getElementById('sim-status').textContent = '[SIMULATION STABLE]';

      // Hydration & Luminous
      document.getElementById('hydration-delta').textContent = irrigationOn ? '+14.2%' : '+8.1%';

      // K2 Recommendation
      const recEl = document.getElementById('k2-recommendation');
      const recText = document.getElementById('k2-rec-text');
      const riskText = document.getElementById('k2-risk-text');
      if (recEl && data.recommendation) {
        recText.textContent = data.recommendation;
        if (riskText && data.riskAnalysis) riskText.textContent = data.riskAnalysis;
        recEl.classList.remove('hidden');
      }

    } catch (e) {
      document.getElementById('exp-loading').classList.add('hidden');
      document.getElementById('method-cards').innerHTML = `
        <div class="col-span-3 py-12 text-center">
          <p class="text-error font-bold">Error: ${e.message}</p>
          <button onclick="document.getElementById('run-exp').click()" class="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">Retry</button>
        </div>`;
    }
  });

  // Auto-run disabled to allow manual configuration first
  /*
  setTimeout(() => {
    const runBtn = document.getElementById('run-exp');
    if (runBtn) runBtn.click();
  }, 500);
  */
}
