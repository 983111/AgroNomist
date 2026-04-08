import { userPrefs, getMarketData, getSerperMarket, getSerperNews } from '../services/api.js';

const CROPS = ['Soybean','Cotton','Tur Dal','Onion','Wheat','Rice','Sugarcane','Pomegranate','Grapes','Tomato','Corn','Potato','Millet','Sorghum'];

export function renderMarket() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Intelligence Engine</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Market Intelligence</h2>
          <p class="text-sm text-outline mt-1" id="mkt-loc-label">${userPrefs.city||userPrefs.district}, ${userPrefs.country}</p>
        </div>
        <div class="flex gap-3 items-center">
          <select id="market-crop" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
            ${CROPS.map(c => `<option value="${c}" ${c === userPrefs.crop ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
          <input id="market-acres" type="number" placeholder="Acres (optional)" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm w-36 focus:ring-2 focus:ring-primary/20" min="1"/>
          <button id="fetch-market" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">insights</span> Analyze
          </button>
        </div>
      </div>

      <!-- Live Prices -->
      <div class="mb-8 bg-gradient-to-r from-secondary/10 to-primary/5 rounded-2xl p-6 border border-secondary/20">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-secondary text-sm">travel_explore</span>
          <h3 class="font-headline text-lg font-bold text-primary">Live Market Data</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE SEARCH</span>
          <span class="ml-auto px-2 py-0.5 bg-secondary/20 rounded-full text-[10px] font-bold text-secondary animate-pulse">● LIVE</span>
        </div>
        <div id="serper-price-results" class="space-y-3">
          ${skels(3,'bg-white/60 h-16')}
        </div>
      </div>

      <!-- Market News -->
      <div class="mb-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Commodity Market News</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">LIVE</span>
        </div>
        <div id="market-news-feed" class="grid grid-cols-3 gap-4">${skels(3,'h-28')}</div>
      </div>

      <div id="market-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Fetching AI market intelligence with real-time data…</p>
      </div>

      <div id="market-results" class="space-y-8">
        <div class="py-8 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">bar_chart</span>
          <p class="font-bold">Loading AI analysis enriched with live market data…</p>
        </div>
      </div>
    </div>
  </main>`;
}

function skels(n,cls='h-12') {
  return Array(n).fill(`<div class="bg-surface-container-low rounded-xl animate-pulse ${cls}"></div>`).join('');
}

const TREND_ICON  = { up:'↑', down:'↓', stable:'→' };
const TREND_COLOR = { up:'text-primary', down:'text-error', stable:'text-secondary' };

export function initMarket() {
  function getCrop()  { return document.getElementById('market-crop')?.value || userPrefs.crop; }
  function getAcres() { return document.getElementById('market-acres')?.value; }

  async function loadSerperPrices() {
    const el = document.getElementById('serper-price-results');
    el.innerHTML = skels(3,'bg-white/60 h-16');
    try {
      const d = await getSerperMarket({ crop: getCrop() });
      let html = '';
      if (d.priceAnswerBox) {
        html += `<div class="p-4 bg-white rounded-xl border-l-4 border-secondary shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <span class="material-symbols-outlined text-secondary text-sm">verified</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-secondary">Google Price Data</span>
          </div>
          <p class="text-base font-bold">${d.priceAnswerBox.answer||d.priceAnswerBox.snippet||d.priceAnswerBox.title||''}</p>
        </div>`;
      }
      if (d.priceResults?.length) {
        html += `<div class="grid grid-cols-2 gap-3">`;
        html += d.priceResults.slice(0,6).map(r => `
          <a href="${r.link}" target="_blank" rel="noopener" class="block p-3 bg-white rounded-xl hover:shadow-md transition-shadow group border border-outline-variant/10">
            <p class="text-sm font-bold text-primary group-hover:text-secondary line-clamp-1">${r.title}</p>
            <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${r.snippet||''}</p>
            ${r.date ? `<p class="text-[10px] text-outline mt-1">${r.date}</p>` : ''}
          </a>`).join('');
        html += `</div>`;
      }
      el.innerHTML = html || '<p class="text-sm text-outline p-4">No live price data found.</p>';
    } catch { el.innerHTML = '<p class="text-sm text-error p-4">Could not fetch live prices.</p>'; }
  }

  async function loadMarketNews() {
    const el = document.getElementById('market-news-feed');
    el.innerHTML = skels(3,'h-28');
    try {
      const d = await getSerperNews({ crop: getCrop(), topic: 'market price' });
      if (d.news?.length) {
        el.innerHTML = d.news.slice(0,6).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-full h-24 rounded-lg object-cover mb-2" onerror="this.style.display='none'"/>` : ''}
            <p class="text-xs font-bold text-primary group-hover:text-secondary line-clamp-2">${n.title}</p>
            <p class="text-[10px] text-outline mt-2">${n.source||''} • ${n.date||''}</p>
          </a>`).join('');
      } else {
        el.innerHTML = '<p class="text-sm text-outline col-span-3">No market news available.</p>';
      }
    } catch { el.innerHTML = '<p class="text-sm text-error col-span-3">News unavailable.</p>'; }
  }

  async function loadAI() {
    document.getElementById('market-loading').classList.remove('hidden');
    document.getElementById('market-results').innerHTML = '';
    try {
      const d = await getMarketData({ crop: getCrop(), landAcres: getAcres()||undefined });
      document.getElementById('market-loading').classList.add('hidden');

      const tc = TREND_COLOR[d.trend]||'text-on-surface';
      const ti = TREND_ICON[d.trend]||'→';

      document.getElementById('market-results').innerHTML = `
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-secondary">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">MSP Price</p>
            <p class="font-headline text-3xl font-black text-secondary">${d.mspPrice ? `₹${d.mspPrice}` : '—'}</p>
            <p class="text-xs text-outline mt-1">Support price</p>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-${d.trend==='up'?'primary':d.trend==='down'?'error':'secondary'}">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Trend</p>
            <p class="font-headline text-3xl font-black ${tc}">${ti} ${(d.trend||'').toUpperCase()}</p>
          </div>
          ${d.profitEstimate ? `
          <div class="bg-primary p-6 rounded-2xl shadow-lg text-white">
            <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Est. Profit</p>
            <p class="font-headline text-3xl font-black">₹${Number(d.profitEstimate).toLocaleString()}</p>
            <p class="text-xs text-primary-fixed-dim mt-1">for your farm</p>
          </div>` : `
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-tertiary">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Best Sell Time</p>
            <p class="font-headline text-xl font-black text-tertiary">${d.profitMaximizer?.bestTimeToSell||'—'}</p>
          </div>`}
        </div>

        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h3 class="font-headline text-lg font-bold text-primary mb-6">3-Month Price Forecast</h3>
          <div class="grid grid-cols-3 gap-6 mb-6">
            ${(d.forecast||[]).map(f => `
              <div class="p-5 bg-surface-container-low rounded-2xl text-center">
                <p class="text-xs font-bold text-outline uppercase tracking-wider mb-3">${f.month}</p>
                <p class="font-headline text-3xl font-black text-primary">₹${f.price||'—'}</p>
                <p class="text-xs text-outline mt-1">/quintal</p>
              </div>`).join('')}
          </div>
          <div class="p-4 bg-primary-fixed/20 rounded-xl">
            <p class="text-sm leading-relaxed">${d.analysis||''}</p>
          </div>
        </div>

        ${d.profitMaximizer ? `
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-secondary">auto_awesome</span>
              <h3 class="font-headline text-lg font-bold text-primary">Profit Maximizer</h3>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="p-4 bg-secondary-fixed/20 rounded-xl">
                <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Best Time to Sell</p>
                <p class="font-bold text-primary">${d.profitMaximizer.bestTimeToSell}</p>
              </div>
              <div class="p-4 bg-primary-fixed/20 rounded-xl">
                <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Expected Price</p>
                <p class="font-bold text-primary">${d.profitMaximizer.expectedPriceAtBestTime ? `₹${d.profitMaximizer.expectedPriceAtBestTime}` : '—'}</p>
              </div>
              <div class="p-4 bg-surface-container-low rounded-xl">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Storage Advice</p>
                <p class="text-xs leading-relaxed">${d.profitMaximizer.storageAdvice||'—'}</p>
              </div>
            </div>
            ${d.profitMaximizer.alternativeCrops?.length ? `
            <div>
              <p class="text-xs font-bold text-outline uppercase tracking-wider mb-3">Alternative Crops</p>
              <div class="space-y-2">
                ${d.profitMaximizer.alternativeCrops.map(c => `
                  <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span class="material-symbols-outlined text-primary text-sm">eco</span>
                    <span class="text-sm font-bold text-primary">${c.crop}</span>
                    <span class="text-xs text-outline ml-2">Est. ₹${c.estimatedProfit}/acre</span>
                    <span class="text-xs text-on-surface-variant ml-auto">${c.reason}</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}
          </div>
          <div class="col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-base font-bold text-primary mb-4">Nearby Markets</h3>
            <div class="space-y-2">
              ${(d.nearbyMandis||[]).map((m,i) => `
                <div class="flex items-center gap-3 p-3 rounded-xl ${i===0?'bg-primary-fixed/20 border border-primary/20':'bg-surface-container-low'}">
                  <span class="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span class="text-sm ${i===0?'font-bold text-primary':'text-on-surface-variant'}">${m}</span>
                  ${i===0?'<span class="ml-auto text-[10px] font-bold text-primary">Best ★</span>':''}
                </div>`).join('')}
            </div>
          </div>
        </div>` : ''}`;
    } catch(e) {
      document.getElementById('market-loading').classList.add('hidden');
      document.getElementById('market-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  function loadAll() {
    const loc = document.getElementById('mkt-loc-label');
    if (loc) loc.textContent = `${userPrefs.city||userPrefs.district}, ${userPrefs.country}`;
    loadSerperPrices();
    loadMarketNews();
    loadAI();
  }

  document.getElementById('fetch-market')?.addEventListener('click', loadAll);
  loadAll();
}
