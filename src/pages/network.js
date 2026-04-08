import { getCommunityInsights } from '../services/api.js';

export function renderNetwork() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Crowdsourced Intelligence</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Farmer Network</h2>
        </div>
      </div>

      <!-- Benchmark Form -->
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
        <h3 class="font-headline text-base font-bold text-primary mb-4">Benchmark Your Farm</h3>
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">District</label>
            <select id="net-district" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Nanded</option><option>Nashik</option><option>Pune</option><option>Latur</option><option>Aurangabad</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Crop</label>
            <select id="net-crop" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Soybean</option><option>Cotton</option><option>Wheat</option><option>Rice</option>
              <option>Tur Dal</option><option>Onion</option><option>Pomegranate</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">My Yield (quintal/acre)</label>
            <input id="net-yield" type="number" placeholder="e.g. 8" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">My Practices</label>
            <input id="net-practices" type="text" placeholder="e.g. drip irrigation, DAP..." class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div class="flex items-end">
            <button id="fetch-network" class="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">hub</span> Benchmark
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        ${[
          ['group', '12,847', 'Active Farmers'],
          ['database', '2.4M', 'Data Points'],
          ['verified', '8,421', 'Verified Tips'],
          ['location_on', '48', 'Regions Covered'],
        ].map(([icon, val, label]) => `
          <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">${icon}</span>
            </div>
            <div>
              <p class="font-headline text-xl font-black text-primary">${val}</p>
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider">${label}</p>
            </div>
          </div>`).join('')}
      </div>

      <div id="net-loading" class="hidden py-16 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Analyzing community insights…</p>
      </div>
      <div id="net-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">hub</span>
          <p class="font-bold">Enter your farm details to benchmark against top performers in your district</p>
        </div>
      </div>
    </div>
  </main>`;
}

export function initNetwork() {
  document.getElementById('fetch-network')?.addEventListener('click', async () => {
    const district = document.getElementById('net-district')?.value;
    const crop = document.getElementById('net-crop')?.value;
    const myYield = document.getElementById('net-yield')?.value;
    const myPractices = document.getElementById('net-practices')?.value;

    document.getElementById('net-loading').classList.remove('hidden');
    document.getElementById('net-results').innerHTML = '';

    try {
      const data = await getCommunityInsights({ district, crop, myYield, myPractices });
      document.getElementById('net-loading').classList.add('hidden');
      const b = data.benchmarks || {};

      document.getElementById('net-results').innerHTML = `
        <div class="grid grid-cols-12 gap-6">
          <!-- Benchmarks -->
          <div class="col-span-5 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-4">Your Benchmark</h3>
            <div class="space-y-4">
              ${[
                ['District Average', b.districtAvgYield, 'text-outline'],
                ['Top Performer', b.topPerformerYield, 'text-primary font-bold'],
                ['Your Yield', myYield ? `${myYield} quintal/acre` : 'Not provided', 'text-secondary'],
                ['Gap to Top', b.gapToTopPerformer, 'text-error'],
              ].map(([label, val, cls]) => `
                <div class="flex justify-between items-center py-2.5 border-b border-outline-variant/10">
                  <span class="text-sm text-outline">${label}</span>
                  <span class="text-sm ${cls}">${val || '—'}</span>
                </div>`).join('')}
            </div>
            ${b.yourYieldPercentile != null ? `
              <div class="mt-4 p-4 bg-surface-container-low rounded-xl text-center">
                <p class="text-[10px] font-bold text-outline uppercase mb-1">Your Percentile</p>
                <p class="font-headline text-4xl font-black text-primary">${b.yourYieldPercentile}<span class="text-xl">%</span></p>
                <div class="w-full h-2 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width:${b.yourYieldPercentile}%"></div>
                </div>
              </div>` : ''}
          </div>

          <!-- Top Practices -->
          <div class="col-span-7 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-4">What Top Farmers Do</h3>
            <p class="text-sm text-on-surface-variant mb-4">${data.communityInsights || ''}</p>
            <div class="space-y-3">
              ${(data.topPractices || []).map(p => `
                <div class="p-4 bg-surface-container-low rounded-xl">
                  <div class="flex justify-between items-start mb-1">
                    <p class="text-sm font-bold text-primary">${p.practice}</p>
                    <span class="text-xs font-bold text-secondary">${p.adoptionRate} of top farmers</span>
                  </div>
                  <p class="text-xs text-on-surface-variant">Yield lift: <span class="font-bold text-primary">${p.yieldLift}</span></p>
                </div>`).join('')}
            </div>
          </div>

          <!-- Improvement Actions -->
          ${data.improvementActions?.length ? `
          <div class="col-span-12 bg-primary text-white p-6 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary-fixed">lightbulb</span>
              <h3 class="font-headline text-lg font-bold">Recommended Improvement Actions</h3>
            </div>
            <div class="grid grid-cols-3 gap-4">
              ${data.improvementActions.map(a => {
                const effortColor = { low: 'text-primary-fixed bg-primary-container/30', medium: 'text-yellow-200 bg-yellow-900/30', high: 'text-red-200 bg-red-900/30' };
                return `
                  <div class="p-4 bg-white/10 rounded-xl">
                    <div class="flex justify-between items-start mb-2">
                      <p class="text-sm font-bold">${a.action}</p>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${effortColor[a.effort] || ''} uppercase">${a.effort}</span>
                    </div>
                    <p class="text-xs text-primary-fixed-dim">${a.expectedImpact}</p>
                  </div>`;
              }).join('')}
            </div>
          </div>` : ''}
        </div>
      `;
    } catch (e) {
      document.getElementById('net-loading').classList.add('hidden');
      document.getElementById('net-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  });
}
