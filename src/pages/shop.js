import { userPrefs, getMarketplace, getSerperPlaces, getSerperNews } from '../services/api.js';

const CATEGORIES = [
  { id: 'all',          label: 'All',          icon: 'apps',             query: 'agricultural inputs farming supplies dealer' },
  { id: 'seeds',        label: 'Seeds',         icon: 'eco',              query: 'certified seeds agricultural dealer' },
  { id: 'fertilizers',  label: 'Fertilizers',   icon: 'compost',          query: 'fertilizer NPK urea DAP dealer' },
  { id: 'pesticides',   label: 'Pesticides',    icon: 'pest_control',     query: 'pesticide insecticide fungicide agricultural dealer' },
  { id: 'equipment',    label: 'Equipment',     icon: 'agriculture',      query: 'farm equipment tractor sprayer agricultural dealer' },
  { id: 'drone',        label: 'Drone Services',icon: 'flight',           query: 'agricultural drone spraying service provider' },
  { id: 'soil-testing', label: 'Soil Testing',  icon: 'biotech',          query: 'soil testing laboratory ICAR accredited' },
  { id: 'mandi',        label: 'Mandis / Market', icon: 'store',          query: 'APMC market yard agricultural produce market' },
  { id: 'logistics',    label: 'Logistics',     icon: 'local_shipping',   query: 'cold storage farm produce logistics warehouse' },
];

export function renderShop() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Procurement Hub</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Marketplace & Services</h2>
          <p class="text-sm text-outline mt-1">Real local agri-vendors powered by Google Places • <span id="shop-location-label">${userPrefs.city||userPrefs.district}, ${userPrefs.country}</span></p>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        ${CATEGORIES.map(c => `
          <button data-cat="${c.id}" data-query="${c.query}" class="shop-cat-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${c.id === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}">
            <span class="material-symbols-outlined text-base">${c.icon}</span>${c.label}
          </button>`).join('')}
      </div>

      <!-- Search -->
      <div class="bg-surface-container-lowest p-4 rounded-2xl shadow-sm mb-6 flex gap-3">
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input id="shop-query" type="text" placeholder="Search for agri products, seeds, fertilizers, services…" class="w-full pl-9 pr-4 bg-surface-container-low border-none rounded-xl text-sm py-2.5 focus:ring-2 focus:ring-primary/20"/>
        </div>
        <button id="shop-search-btn" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">travel_explore</span> Search
        </button>
      </div>

      <!-- Local Vendors -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Local Agri Vendors & Services</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE PLACES</span>
        </div>
        <div id="vendors-grid" class="grid grid-cols-3 gap-4">
          ${skeletonCards(6, 'h-44')}
        </div>
      </div>

      <!-- AI Recommendations -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">AI Product Recommendations</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">K2 AI</span>
        </div>
        <div id="shop-ai-results">
          <div class="py-8 text-center text-outline">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-sm font-bold">Loading AI recommendations…</p>
          </div>
        </div>
      </div>

      <!-- Agri News -->
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Local Agriculture News</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">LIVE</span>
        </div>
        <div id="shop-news" class="grid grid-cols-4 gap-4">
          ${skeletonCards(4, 'h-24')}
        </div>
      </div>
    </div>
  </main>`;
}

function skeletonCards(n, cls='h-40') {
  return Array(n).fill(`<div class="p-5 bg-surface-container-lowest rounded-2xl animate-pulse shadow-sm ${cls}"></div>`).join('');
}

function stars(r) {
  if (!r) return '';
  return '★'.repeat(Math.floor(r)) + (r%1>=0.5?'½':'');
}

const AVAIL_COLORS = {
  'widely-available': 'text-primary bg-primary-fixed/20',
  limited:            'text-tertiary bg-tertiary-fixed/30',
  seasonal:           'text-secondary bg-secondary-fixed/20',
};

const CAT_ICON = {
  seeds:           'eco',
  fertilizers:     'compost',
  pesticides:      'pest_control',
  logistics:       'local_shipping',
  drone:           'flight',
  'soil-testing':  'biotech',
  equipment:       'agriculture',
  mandi:           'store',
  general:         'storefront',
};

export function initShop() {
  let activeCat = 'all';
  let activeQuery = '';

  // ── Google Places Vendors ──────────────────────────────────
  async function loadVendors(category, query) {
    const el = document.getElementById('vendors-grid');
    el.innerHTML = skeletonCards(6, 'h-44');
    try {
      const d = await getSerperPlaces({ category: category !== 'all' ? category : undefined, query });
      if (d.places?.length) {
        el.innerHTML = d.places.map(p => `
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary text-base">storefront</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-primary text-sm leading-tight line-clamp-2">${p.title}</h4>
                ${p.category ? `<p class="text-[10px] font-bold text-secondary uppercase tracking-wider mt-0.5">${p.category}</p>` : ''}
              </div>
            </div>
            ${p.rating ? `<div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-black text-primary">${p.rating}</span>
              <span class="text-xs text-yellow-600">${stars(p.rating)}</span>
              ${p.reviews ? `<span class="text-[10px] text-outline">(${p.reviews})</span>` : ''}
            </div>` : ''}
            ${p.address ? `<div class="flex items-start gap-2 mb-2">
              <span class="material-symbols-outlined text-outline text-xs mt-0.5">location_on</span>
              <p class="text-xs text-on-surface-variant line-clamp-2">${p.address}</p>
            </div>` : ''}
            ${p.phone ? `<div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-outline text-xs">call</span>
              <a href="tel:${p.phone}" class="text-xs text-secondary font-medium hover:underline">${p.phone}</a>
            </div>` : ''}
            <div class="flex gap-2 mt-auto pt-2">
              ${p.cid ? `<a href="https://www.google.com/maps?cid=${p.cid}" target="_blank" rel="noopener" class="flex-1 py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-bold text-center hover:bg-primary/20 flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">map</span>Maps</a>` : ''}
              ${p.phone ? `<a href="tel:${p.phone}" class="flex-1 py-2 bg-secondary/10 text-secondary rounded-lg text-[10px] font-bold text-center hover:bg-secondary/20 flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">call</span>Call</a>` : ''}
              ${p.website ? `<a href="${p.website}" target="_blank" rel="noopener" class="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-lg text-[10px] font-bold text-center hover:bg-tertiary/20 flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">language</span>Web</a>` : ''}
            </div>
          </div>`).join('');
      } else {
        el.innerHTML = `<div class="col-span-3 py-12 text-center text-outline">
          <span class="material-symbols-outlined text-4xl mb-2 block">search_off</span>
          <p class="font-bold">No agri vendors found in ${userPrefs.city||userPrefs.district}.</p>
          <p class="text-sm mt-1">Try a different category or search term.</p>
        </div>`;
      }
    } catch(e) {
      el.innerHTML = `<div class="col-span-3 py-8 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  // ── K2 AI Recommendations ──────────────────────────────────
  async function loadAI(category, query) {
    const el = document.getElementById('shop-ai-results');
    el.innerHTML = `<div class="py-8 text-center text-outline"><div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div><p class="text-sm font-bold">Loading K2 recommendations…</p></div>`;
    try {
      const effectiveCategory = category || 'all';
      const effectiveQuery = query || (effectiveCategory === 'all' ? 'agricultural inputs farming supplies' : undefined);
      const d = await getMarketplace({ category: effectiveCategory, query: effectiveQuery });
      let html = '';

      if (d.recommendations?.length) {
        html += `<div class="grid grid-cols-3 gap-4 mb-6">`;
        html += d.recommendations.map(r => `
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary text-base">${CAT_ICON[r.category]||'eco'}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-secondary uppercase tracking-wider mb-0.5">${r.category||'agricultural'}</p>
                <h4 class="font-bold text-primary text-sm leading-tight">${r.name}</h4>
              </div>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed mb-3">${r.description}</p>
            <div class="flex items-center justify-between mb-3">
              <p class="font-headline font-black text-primary">${r.estimatedPrice}</p>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${AVAIL_COLORS[r.availability]||'text-outline bg-surface-container'}">${(r.availability||'').replace(/-/g,' ')}</span>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">How to Get</p>
              <p class="text-xs text-on-surface-variant">${r.procurementTip}</p>
            </div>
          </div>`).join('');
        html += `</div>`;
      }

      if (d.govtSchemes?.length) {
        html += `<div class="bg-primary text-white p-6 rounded-2xl shadow-lg mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary-fixed">account_balance</span>
            <h3 class="font-headline text-lg font-bold">Government Schemes & Subsidies</h3>
          </div>
          <div class="grid grid-cols-3 gap-4">
            ${d.govtSchemes.map(s => `
              <div class="p-4 bg-white/10 rounded-xl">
                <h4 class="font-bold text-sm mb-1">${s.scheme}</h4>
                <p class="text-xs text-primary-fixed-dim mb-2">${s.benefit}</p>
                <p class="text-xs text-primary-fixed border-t border-white/10 pt-2">${s.howToApply}</p>
              </div>`).join('')}
          </div>
        </div>`;
      }

      if (d.localServiceProviders) {
        html += `<div class="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-secondary text-base">handyman</span>
            <p class="text-xs font-bold text-secondary uppercase tracking-wider">K2 Service Tips</p>
          </div>
          <p class="text-sm">${d.localServiceProviders}</p>
        </div>`;
      }

      // Real vendors from places (secondary display)
      if (d.realVendors?.length) {
        html += `<div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary text-sm">verified</span>
            <p class="text-xs font-bold text-primary uppercase tracking-wider">Verified Local Vendors (Google Places)</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            ${d.realVendors.slice(0,4).map(v => `
              <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <span class="material-symbols-outlined text-primary text-sm">storefront</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-primary truncate">${v.title}</p>
                  <p class="text-xs text-outline truncate">${v.address||''}</p>
                </div>
                ${v.rating ? `<span class="text-xs font-bold text-primary flex-shrink-0">${v.rating}★</span>` : ''}
              </div>`).join('')}
          </div>
        </div>`;
      }

      el.innerHTML = html || '<p class="text-sm text-outline p-4">No recommendations available.</p>';
    } catch(e) {
      el.innerHTML = `<div class="py-8 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  // ── Local Agri News ────────────────────────────────────────
  async function loadNews() {
    const el = document.getElementById('shop-news');
    el.innerHTML = skeletonCards(4, 'h-24');
    try {
      const d = await getSerperNews({ topic: 'agriculture market farming' });
      if (d.news?.length) {
        el.innerHTML = d.news.slice(0,4).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            <p class="text-xs font-bold text-primary group-hover:text-secondary line-clamp-2">${n.title}</p>
            <p class="text-[10px] text-on-surface-variant mt-1 line-clamp-2">${n.snippet||''}</p>
            <p class="text-[10px] text-outline mt-1">${n.source||''} • ${n.date||''}</p>
          </a>`).join('');
      } else {
        el.innerHTML = '<p class="text-sm text-outline col-span-4">No news available.</p>';
      }
    } catch { el.innerHTML = '<p class="text-sm text-error col-span-4">News unavailable.</p>'; }
  }

  // ── Tab Switching ──────────────────────────────────────────
  function setCategory(catId, query) {
    activeCat = catId;
    activeQuery = query || '';
    document.querySelectorAll('.shop-cat-btn').forEach(btn => {
      const active = btn.dataset.cat === catId;
      btn.className = `shop-cat-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${active ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`;
    });
    const catData = CATEGORIES.find(c => c.id === catId);
    loadVendors(catId, query || catData?.query);
    loadAI(catId, query);
  }

  document.querySelectorAll('.shop-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat, btn.dataset.query));
  });

  document.getElementById('shop-search-btn')?.addEventListener('click', () => {
    const q = document.getElementById('shop-query')?.value?.trim();
    if (q) setCategory(activeCat, q);
  });

  document.getElementById('shop-query')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const q = e.target.value?.trim();
      if (q) setCategory(activeCat, q);
    }
  });

  // Initial load
  const initCat = CATEGORIES[0];
  loadVendors('all', initCat.query);
  loadAI('all');
  loadNews();
}
