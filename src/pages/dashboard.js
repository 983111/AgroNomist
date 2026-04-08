import { getWeatherRisk, getMarketData } from '../services/api.js';

export function renderDashboard() {
  return `<main class="ml-64 mt-16 p-8 min-h-screen page-enter">
    <div class="mb-10 flex justify-between items-end">
      <div>
        <h2 class="font-headline text-4xl font-extrabold tracking-tight text-primary">Territory Overview</h2>
        <p class="font-body text-outline mt-1 max-w-md text-sm">Real-time agriculture intelligence for your farm. AI-powered insights updated live.</p>
      </div>
      <div class="flex gap-2">
        <select id="dash-district" class="px-4 py-2 bg-surface-container-low border-none rounded-xl text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20">
          <option value="Nanded">Nanded, Maharashtra</option>
          <option value="Nashik">Nashik</option>
          <option value="Pune">Pune</option>
          <option value="Aurangabad">Aurangabad</option>
          <option value="Latur">Latur</option>
        </select>
        <button id="refresh-dash" class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-sm">refresh</span> Refresh
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-lg">thunderstorm</span>
          </div>
          <span id="weather-badge" class="text-xs font-bold text-outline bg-surface-container px-2 py-1 rounded-lg">Loading…</span>
        </div>
        <p class="text-sm text-outline mb-1">Weather Alerts</p>
        <p id="weather-alerts-count" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-lg">trending_up</span>
          </div>
          <span id="market-badge" class="text-xs font-bold text-outline bg-surface-container px-2 py-1 rounded-lg">Loading…</span>
        </div>
        <p class="text-sm text-outline mb-1">Soybean Price</p>
        <p id="market-price" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined text-lg">water_drop</span>
          </div>
        </div>
        <p class="text-sm text-outline mb-1">Yield Impact Score</p>
        <p id="yield-score" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-lg">bar_chart</span>
          </div>
        </div>
        <p class="text-sm text-outline mb-1">Best Sell Window</p>
        <p id="sell-window" class="font-headline text-xl font-black text-primary">—</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Weather Panel -->
      <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-headline text-lg font-bold text-primary">Weather & Risk Intelligence</h3>
          <span class="text-xs text-outline">Auto-updates on district change</span>
        </div>
        <div id="weather-content" class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl animate-pulse">
            <div class="w-8 h-8 rounded-full bg-surface-container-high"></div>
            <div class="flex-1 h-4 bg-surface-container-high rounded"></div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl animate-pulse">
            <div class="w-8 h-8 rounded-full bg-surface-container-high"></div>
            <div class="flex-1 h-4 bg-surface-container-high rounded"></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-span-4 space-y-4">
        <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary-fixed text-sm">smart_toy</span>
            <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Assistant</span>
          </div>
          <p class="text-sm font-medium mb-4 text-primary-fixed-dim">Ask anything about your farm — crop disease, market prices, weather, loans…</p>
          <a href="#/research" class="block w-full py-3 bg-white text-primary rounded-xl font-bold text-sm text-center hover:bg-primary-fixed transition-colors">
            Open Assistant →
          </a>
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
              <p class="text-xs text-on-surface-variant">Live mandi prices & forecasts</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Market Ticker -->
      <div class="col-span-12 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-headline text-lg font-bold text-primary">Market Price Forecast</h3>
          <select id="dash-crop-select" class="px-3 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option value="Soybean">Soybean</option>
            <option value="Cotton">Cotton</option>
            <option value="Tur Dal">Tur Dal</option>
            <option value="Onion">Onion</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
          </select>
        </div>
        <div id="market-forecast-content">
          <div class="grid grid-cols-4 gap-4">
            ${[1,2,3,4].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-20"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

export function initDashboard() {
  const districtSel = document.getElementById('dash-district');
  const cropSel = document.getElementById('dash-crop-select');
  const refreshBtn = document.getElementById('refresh-dash');

  async function loadWeather(district) {
    document.getElementById('weather-content').innerHTML = `
      <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl animate-pulse">
        <div class="w-8 h-8 rounded-full bg-surface-container-high"></div>
        <div class="flex-1 h-4 bg-surface-container-high rounded"></div>
      </div>`;
    try {
      const data = await getWeatherRisk({ district, crop: 'mixed' });
      document.getElementById('weather-alerts-count').textContent = data.alerts?.length || '0';
      document.getElementById('yield-score').textContent = data.yieldImpactScore ? `${data.yieldImpactScore}/100` : 'N/A';
      const severityMap = { critical: 'bg-error text-on-error', high: 'bg-error/20 text-error', medium: 'bg-tertiary-fixed text-tertiary', low: 'bg-primary-fixed text-primary' };
      document.getElementById('weather-badge').textContent = district;
      document.getElementById('weather-content').innerHTML = (data.alerts || []).map(a => `
        <div class="flex items-start gap-3 p-4 ${severityMap[a.severity] || 'bg-surface-container-low text-on-surface'} rounded-xl">
          <span class="material-symbols-outlined text-lg mt-0.5">warning</span>
          <div class="flex-1">
            <p class="text-xs font-bold uppercase tracking-wider mb-1">${a.type?.replace(/-/g,' ')} • ${a.severity}</p>
            <p class="text-sm">${a.message}</p>
            <p class="text-xs opacity-70 mt-1">${a.timeframe || ''}</p>
          </div>
        </div>
      `).join('') || '<p class="text-sm text-outline p-4">No active alerts for this district.</p>';
      if (data.irrigationAdvice) {
        document.getElementById('weather-content').innerHTML += `
          <div class="p-4 bg-secondary/10 rounded-xl border border-secondary/20 mt-3">
            <p class="text-xs font-bold text-secondary mb-1">💧 Irrigation Advice</p>
            <p class="text-sm text-on-surface">${data.irrigationAdvice}</p>
          </div>`;
      }
    } catch (e) {
      document.getElementById('weather-content').innerHTML = `<p class="text-sm text-error p-4">Error: ${e.message}</p>`;
    }
  }

  async function loadMarket(crop, district) {
    document.getElementById('market-forecast-content').innerHTML = `<div class="grid grid-cols-4 gap-4">${[1,2,3,4].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-20"></div>`).join('')}</div>`;
    try {
      const data = await getMarketData({ crop, district });
      document.getElementById('market-price').textContent = data.currentPrice ? `₹${data.currentPrice}` : '—';
      document.getElementById('market-badge').textContent = data.trend || '—';
      document.getElementById('sell-window').textContent = data.profitMaximizer?.bestTimeToSell || '—';
      const trendColor = { up: 'text-primary', down: 'text-error', stable: 'text-secondary' };
      document.getElementById('market-forecast-content').innerHTML = `
        <div class="grid grid-cols-3 gap-4 mb-4">
          ${(data.forecast || []).map(f => `
            <div class="p-4 bg-surface-container-low rounded-xl text-center">
              <p class="text-xs font-bold text-outline uppercase tracking-wider mb-2">${f.month}</p>
              <p class="text-xl font-headline font-black text-primary">₹${f.price}</p>
              <p class="text-xs text-outline">/quintal</p>
            </div>
          `).join('')}
        </div>
        <div class="p-4 bg-primary-fixed/20 rounded-xl">
          <p class="text-xs font-bold text-primary mb-1">📊 Market Analysis</p>
          <p class="text-sm text-on-surface">${data.analysis || ''}</p>
          ${data.profitMaximizer ? `<p class="text-xs text-secondary mt-2 font-medium">💡 ${data.profitMaximizer.storageAdvice}</p>` : ''}
        </div>`;
    } catch (e) {
      document.getElementById('market-forecast-content').innerHTML = `<p class="text-sm text-error p-4">Error: ${e.message}</p>`;
    }
  }

  const district = () => districtSel?.value || 'Nanded';
  const crop = () => cropSel?.value || 'Soybean';

  loadWeather(district());
  loadMarket(crop(), district());

  districtSel?.addEventListener('change', () => { loadWeather(district()); loadMarket(crop(), district()); });
  cropSel?.addEventListener('change', () => loadMarket(crop(), district()));
  refreshBtn?.addEventListener('click', () => { loadWeather(district()); loadMarket(crop(), district()); });
}
