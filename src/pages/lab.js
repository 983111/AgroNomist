import { runExperiment } from '../services/api.js';

export function renderLab() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Virtual Experiment Lab</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Crop Simulator</h2>
        </div>
      </div>

      <!-- Config Form -->
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
        <h3 class="font-headline text-base font-bold text-primary mb-4">Configure Experiment</h3>
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Crop</label>
            <select id="exp-crop" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Soybean</option><option>Cotton</option><option>Wheat</option><option>Rice</option>
              <option>Tur Dal</option><option>Sugarcane</option><option>Onion</option><option>Pomegranate</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Soil Type</label>
            <select id="exp-soil" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Black cotton soil</option><option>Red soil</option><option>Alluvial soil</option>
              <option>Sandy loam</option><option>Clay loam</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">District</label>
            <select id="exp-district" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Nanded</option><option>Nashik</option><option>Pune</option><option>Latur</option><option>Aurangabad</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Rainfall (mm)</label>
            <input id="exp-rain" type="number" value="650" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div class="flex items-end">
            <button id="run-exp" class="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
              <span class="material-symbols-outlined text-sm">play_arrow</span> Run Simulation
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div id="exp-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Running virtual experiment simulation…</p>
        <p class="text-sm text-outline mt-1">Comparing AI-optimized vs traditional methods</p>
      </div>

      <!-- Results -->
      <div id="exp-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">biotech</span>
          <p class="font-bold">Configure and run a simulation to see AI vs traditional method comparison</p>
        </div>
      </div>
    </div>
  </main>`;
}

export function initLab() {
  document.getElementById('run-exp')?.addEventListener('click', async () => {
    const crop = document.getElementById('exp-crop')?.value;
    const soil = document.getElementById('exp-soil')?.value;
    const district = document.getElementById('exp-district')?.value;
    const rainfall = document.getElementById('exp-rain')?.value;

    document.getElementById('exp-loading').classList.remove('hidden');
    document.getElementById('exp-results').innerHTML = '';

    try {
      const data = await runExperiment({ crop, soil, district, rainfall });
      document.getElementById('exp-loading').classList.add('hidden');

      const ai = data.aiOptimized || {};
      const trad = data.traditional || {};

      document.getElementById('exp-results').innerHTML = `
        <!-- Method Comparison -->
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline font-bold text-primary text-lg">AI Optimized</h3>
              <span class="text-[10px] font-bold bg-primary-fixed px-2 py-1 rounded text-primary">K2 RECOMMENDED</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="p-3 bg-primary-fixed/20 rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Expected Yield</p>
                <p class="font-headline font-black text-primary">${ai.expectedYield || '—'}</p>
              </div>
              <div class="p-3 bg-primary-fixed/20 rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Confidence</p>
                <p class="font-headline font-black text-primary">${ai.confidenceInterval || '—'}</p>
              </div>
              <div class="p-3 bg-primary-fixed/20 rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Cost/Acre</p>
                <p class="font-headline font-black text-primary">₹${ai.estimatedCost?.toLocaleString('en-IN') || '—'}</p>
              </div>
              <div class="p-3 bg-primary-fixed/20 rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Profit/Acre</p>
                <p class="font-headline font-black text-primary">₹${ai.estimatedProfit?.toLocaleString('en-IN') || '—'}</p>
              </div>
            </div>
            ${ai.inputs?.length ? `
            <div>
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Input Schedule</p>
              <div class="space-y-2">
                ${ai.inputs.map(i => `
                  <div class="flex justify-between text-xs p-2 bg-surface-container-low rounded-lg">
                    <span class="font-medium text-on-surface">${i.name}</span>
                    <span class="text-outline">${i.quantity}</span>
                    <span class="text-primary font-medium">${i.timing}</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-outline">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline font-bold text-on-surface text-lg">Traditional Method</h3>
              <span class="text-[10px] font-bold bg-surface-container-high px-2 py-1 rounded text-outline">CONTROL</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="p-3 bg-surface-container-low rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Expected Yield</p>
                <p class="font-headline font-black text-on-surface">${trad.expectedYield || '—'}</p>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Cost/Acre</p>
                <p class="font-headline font-black text-on-surface">₹${trad.estimatedCost?.toLocaleString('en-IN') || '—'}</p>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl text-center col-span-2">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Profit/Acre</p>
                <p class="font-headline font-black text-on-surface">₹${trad.estimatedProfit?.toLocaleString('en-IN') || '—'}</p>
              </div>
            </div>
            ${trad.inputs?.length ? `
            <div>
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Input Schedule</p>
              <div class="space-y-2">
                ${trad.inputs.map(i => `
                  <div class="flex justify-between text-xs p-2 bg-surface-container rounded-lg">
                    <span class="font-medium text-on-surface">${i.name}</span>
                    <span class="text-outline">${i.quantity}</span>
                    <span class="text-on-surface-variant">${i.timing}</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}
          </div>
        </div>

        <!-- What-if Scenarios -->
        ${data.whatIfScenarios?.length ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-6">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">What-If Rainfall Scenarios</h3>
          <div class="grid grid-cols-3 gap-4">
            ${data.whatIfScenarios.map(s => {
              const riskColor = { low: 'bg-primary-fixed/20 border-primary/20 text-primary', medium: 'bg-tertiary-fixed/30 border-tertiary/20 text-tertiary', high: 'bg-error/10 border-error/20 text-error' };
              const rc = riskColor[s.riskLevel] || riskColor.medium;
              return `
                <div class="p-4 ${rc} border rounded-xl">
                  <p class="text-xs font-bold uppercase tracking-wider mb-2">${s.scenario}</p>
                  <p class="text-sm font-medium">Rainfall: ${s.rainfallMM}mm</p>
                  <p class="text-lg font-headline font-black">${s.yieldImpact}</p>
                  <p class="text-[10px] uppercase font-bold mt-1">Risk: ${s.riskLevel}</p>
                </div>`;
            }).join('')}
          </div>
        </div>` : ''}

        <!-- Recommendation -->
        <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary-fixed">smart_toy</span>
            <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Recommendation</span>
          </div>
          <p class="text-sm leading-relaxed mb-2">${data.recommendation || ''}</p>
          ${data.riskAnalysis ? `<p class="text-xs text-primary-fixed-dim">${data.riskAnalysis}</p>` : ''}
        </div>
      `;
    } catch (e) {
      document.getElementById('exp-loading').classList.add('hidden');
      document.getElementById('exp-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  });
}
