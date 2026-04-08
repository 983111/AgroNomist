import { getMarketData } from '../services/api.js';

export function renderMarket() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Intelligence Engine</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Market Intelligence</h2>
        </div>
        <div class="flex gap-3 items-center">
          <select id="market-crop" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
            <option value="Soybean">Soybean</option>
            <option value="Cotton">Cotton</option>
            <option value="Tur Dal">Tur Dal</option>
            <option value="Onion">Onion</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Pomegranate">Pomegranate</option>
            <option value="Grapes">Grapes</option>
            <option value="Tomato">Tomato</option>
          </select>
          <select id="market-district" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
            <option value="Nanded">Nanded</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Latur">Latur</option>
            <option value="Aurangabad">Aurangabad</option>
          </select>
          <input id="market-acres" type="number" placeholder="Acres (optional)" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm w-36 focus:ring-2 focus:ring-primary/20" min="1"/>
          <button id="fetch-market" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">insights</span> Analyze
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div id="market-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Fetching market intelligence…</p>
      </div>

      <!-- Results -->
      <div id="market-results" class="space-y-8">
        <div class="py-16 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">bar_chart</span>
          <p class="font-bold">Select a crop and click Analyze to get live market data</p>
        </div>
      </div>
    </div>
  </main>`;
}

export function initMarket() {
  const trendIcon = { up: '↑', down: '↓', stable: '→' };
  const trendColor = { up: 'text-primary', down: 'text-error', stable: 'text-secondary' };

  async function load() {
    const crop = document.getElementById('market-crop')?.value;
    const district = document.getElementById('market-district')?.value;
    const acres = document.getElementById('market-acres')?.value;

    document.getElementById('market-loading').classList.remove('hidden');
    document.getElementById('market-results').innerHTML = '';

    try {
      const data = await getMarketData({ crop, district, landAcres: acres || undefined });
      document.getElementById('market-loading').classList.add('hidden');

      const tc = trendColor[data.trend] || 'text-on-surface';
      const ti = trendIcon[data.trend] || '→';

      document.getElementById('market-results').innerHTML = `
        <!-- Price Overview -->
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Current Price</p>
            <p class="font-headline text-3xl font-black text-primary">₹${data.currentPrice || '—'}</p>
            <p class="text-xs text-outline mt-1">/quintal</p>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-secondary">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">MSP Price</p>
            <p class="font-headline text-3xl font-black text-secondary">₹${data.mspPrice || 'N/A'}</p>
            <p class="text-xs text-outline mt-1">Govt. support price</p>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-${data.trend === 'up' ? 'primary' : data.trend === 'down' ? 'error' : 'secondary'}">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Trend</p>
            <p class="font-headline text-3xl font-black ${tc}">${ti} ${(data.trend || '').toUpperCase()}</p>
          </div>
          ${data.profitEstimate ? `
          <div class="bg-primary p-6 rounded-2xl shadow-lg text-white">
            <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Est. Profit</p>
            <p class="font-headline text-3xl font-black">₹${data.profitEstimate?.toLocaleString('en-IN')}</p>
            <p class="text-xs text-primary-fixed-dim mt-1">for your farm</p>
          </div>` : `
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-tertiary">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Best Sell Time</p>
            <p class="font-headline text-xl font-black text-tertiary">${data.profitMaximizer?.bestTimeToSell || '—'}</p>
          </div>`}
        </div>

        <!-- Forecast -->
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h3 class="font-headline text-lg font-bold text-primary mb-6">3-Month Price Forecast</h3>
          <div class="grid grid-cols-3 gap-6 mb-6">
            ${(data.forecast || []).map(f => `
              <div class="p-5 bg-surface-container-low rounded-2xl text-center">
                <p class="text-xs font-bold text-outline uppercase tracking-wider mb-3">${f.month}</p>
                <p class="font-headline text-3xl font-black text-primary">₹${f.price}</p>
                <p class="text-xs text-outline mt-1">/quintal</p>
              </div>`).join('')}
          </div>
          <div class="p-4 bg-primary-fixed/20 rounded-xl">
            <p class="text-sm text-on-surface leading-relaxed">${data.analysis || ''}</p>
          </div>
        </div>

        <!-- Profit Maximizer -->
        ${data.profitMaximizer ? `
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-secondary">auto_awesome</span>
              <h3 class="font-headline text-lg font-bold text-primary">Profit Maximizer</h3>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="p-4 bg-secondary-fixed/20 rounded-xl">
                <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Best Time to Sell</p>
                <p class="font-bold text-primary">${data.profitMaximizer.bestTimeToSell}</p>
              </div>
              <div class="p-4 bg-primary-fixed/20 rounded-xl">
                <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Expected Price Then</p>
                <p class="font-bold text-primary">₹${data.profitMaximizer.expectedPriceAtBestTime || '—'}</p>
              </div>
              <div class="p-4 bg-surface-container-low rounded-xl">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Storage Advice</p>
                <p class="text-xs text-on-surface leading-relaxed">${data.profitMaximizer.storageAdvice || '—'}</p>
              </div>
            </div>
            ${data.profitMaximizer.alternativeCrops?.length ? `
            <div>
              <p class="text-xs font-bold text-outline uppercase tracking-wider mb-3">Alternative Crops Worth Considering</p>
              <div class="space-y-2">
                ${data.profitMaximizer.alternativeCrops.map(c => `
                  <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span class="material-symbols-outlined text-primary text-sm">eco</span>
                    <div class="flex-1">
                      <span class="text-sm font-bold text-primary">${c.crop}</span>
                      <span class="text-xs text-outline ml-2">Est. ₹${c.estimatedProfit}/acre</span>
                    </div>
                    <span class="text-xs text-on-surface-variant">${c.reason}</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}
          </div>
          <div class="col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-base font-bold text-primary mb-4">Nearby Mandis</h3>
            <div class="space-y-2">
              ${(data.nearbyMandis || []).map((m, i) => `
                <div class="flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-primary-fixed/20 border border-primary/20' : 'bg-surface-container-low'}">
                  <span class="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span class="text-sm ${i === 0 ? 'font-bold text-primary' : 'text-on-surface-variant'}">${m}</span>
                  ${i === 0 ? '<span class="ml-auto text-[10px] font-bold text-primary">Best ★</span>' : ''}
                </div>`).join('')}
            </div>
          </div>
        </div>` : ''}
      `;
    } catch (e) {
      document.getElementById('market-loading').classList.add('hidden');
      document.getElementById('market-results').innerHTML = `
        <div class="py-12 text-center">
          <span class="material-symbols-outlined text-error text-4xl mb-3 block">error</span>
          <p class="font-bold text-error">Error: ${e.message}</p>
        </div>`;
    }
  }

  document.getElementById('fetch-market')?.addEventListener('click', load);
  // Auto-load on page open
  load();
}
