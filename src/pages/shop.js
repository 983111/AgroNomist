import { getMarketplace, getSerperPlaces, getSerperNews } from '../services/api.js';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps', query: 'agricultural shop farm supplies' },
  { id: 'seeds', label: 'Seeds', icon: 'eco', query: 'agricultural seeds shop dealer' },
  { id: 'fertilizers', label: 'Fertilizers', icon: 'compost', query: 'fertilizer dealer shop' },
  { id: 'pesticides', label: 'Pesticides', icon: 'pest_control', query: 'pesticides insecticides shop' },
  { id: 'equipment', label: 'Equipment', icon: 'agriculture', query: 'agricultural equipment tractor rental farm machinery' },
  { id: 'drone', label: 'Drone Services', icon: 'flight', query: 'drone spraying agricultural drone service' },
  { id: 'soil-testing', label: 'Soil Testing', icon: 'biotech', query: 'soil testing laboratory agriculture' },
  { id: 'mandi', label: 'Mandis', icon: 'store', query: 'APMC mandi agricultural market yard' },
  { id: 'logistics', label: 'Logistics', icon: 'local_shipping', query: 'farm produce transport logistics cold storage' },
];

export function renderShop() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Procurement Hub</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Marketplace & Services</h2>
          <p class="text-sm text-outline mt-1">Discover real local vendors, shops & services powered by Google Places</p>
        </div>
        <div class="flex gap-3 items-center">
          <select id="shop-district" class="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
            <option value="Nanded">Nanded</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Latur">Latur</option>
            <option value="Aurangabad">Aurangabad</option>
          </select>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        ${CATEGORIES.map(c => `
          <button data-cat="${c.id}" class="shop-cat-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${c.id === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}">
            <span class="material-symbols-outlined text-base">${c.icon}</span>${c.label}
          </button>`).join('')}
      </div>

      <!-- Search Bar -->
      <div class="bg-surface-container-lowest p-4 rounded-2xl shadow-sm mb-6 flex gap-3">
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input id="shop-query" type="text" placeholder="Search for specific products, services, or shops..." class="w-full pl-9 pr-4 bg-surface-container-low border-none rounded-xl text-sm py-2.5 focus:ring-2 focus:ring-primary/20"/>
        </div>
        <button id="shop-search-btn" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">travel_explore</span> Search Google
        </button>
      </div>

      <!-- Loading -->
      <div id="shop-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Scanning for local vendors & services…</p>
      </div>

      <!-- Real Vendors from Google Places -->
      <div id="shop-vendors" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Local Vendors & Services</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE PLACES</span>
        </div>
        <div id="vendors-grid" class="grid grid-cols-3 gap-4">
          ${[1,2,3,4,5,6].map(() => `<div class="p-5 bg-surface-container-lowest rounded-2xl animate-pulse h-40"></div>`).join('')}
        </div>
      </div>

      <!-- AI Recommendations -->
      <div id="shop-ai-section" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">AI Product Recommendations</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">K2 AI</span>
        </div>
        <div id="shop-ai-results">
          <div class="py-8 text-center text-outline">
            <span class="material-symbols-outlined text-4xl mb-2 block">smart_toy</span>
            <p class="text-sm font-bold">Loading AI recommendations…</p>
          </div>
        </div>
      </div>

      <!-- Local Agri News -->
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Local Agriculture News</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">GOOGLE NEWS</span>
        </div>
        <div id="shop-news" class="grid grid-cols-4 gap-4">
          ${[1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('')}
        </div>
      </div>
    </div>
  </main>`;
}

const availColor = { 'widely-available': 'text-primary bg-primary-fixed/20', limited: 'text-tertiary bg-tertiary-fixed/30', seasonal: 'text-secondary bg-secondary-fixed/20' };
const catIcon = { seeds: 'eco', fertilizers: 'compost', pesticides: 'pest_control', logistics: 'local_shipping', 'drone-spraying': 'flight', 'soil-testing': 'biotech', 'equipment-rental': 'agriculture' };

function renderStars(rating) {
  if (!rating) return '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  return stars;
}

export function initShop() {
  let activeCategory = 'all';

  function getDistrict() {
    return document.getElementById('shop-district')?.value || 'Nanded';
  }

  // ─── Google Places Vendors ─────────────────────────────────
  async function loadVendors(category, query) {
    const container = document.getElementById('vendors-grid');
    container.innerHTML = [1,2,3,4,5,6].map(() => `<div class="p-5 bg-surface-container-lowest rounded-2xl animate-pulse h-40 shadow-sm"></div>`).join('');

    const district = getDistrict();
    try {
      const data = await getSerperPlaces({
        query: query || undefined,
        district,
        category: category !== 'all' ? category : undefined,
      });

      if (data.places?.length) {
        container.innerHTML = data.places.map(p => `
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

            ${p.rating ? `
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-black text-primary">${p.rating}</span>
              <span class="text-xs text-yellow-600">${renderStars(p.rating)}</span>
              ${p.reviews ? `<span class="text-[10px] text-outline">(${p.reviews} reviews)</span>` : ''}
            </div>` : ''}

            ${p.address ? `
            <div class="flex items-start gap-2 mb-2">
              <span class="material-symbols-outlined text-outline text-xs mt-0.5">location_on</span>
              <p class="text-xs text-on-surface-variant line-clamp-2">${p.address}</p>
            </div>` : ''}

            ${p.phone ? `
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-outline text-xs">call</span>
              <a href="tel:${p.phone}" class="text-xs text-secondary font-medium hover:underline">${p.phone}</a>
            </div>` : ''}

            <div class="flex gap-2 mt-auto">
              ${p.cid ? `<a href="https://www.google.com/maps?cid=${p.cid}" target="_blank" rel="noopener" class="flex-1 py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-bold text-center hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">map</span>Maps</a>` : ''}
              ${p.phone ? `<a href="tel:${p.phone}" class="flex-1 py-2 bg-secondary/10 text-secondary rounded-lg text-[10px] font-bold text-center hover:bg-secondary/20 transition-colors flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">call</span>Call</a>` : ''}
              ${p.website ? `<a href="${p.website}" target="_blank" rel="noopener" class="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-lg text-[10px] font-bold text-center hover:bg-tertiary/20 transition-colors flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">language</span>Web</a>` : ''}
            </div>
          </div>`).join('');
      } else {
        container.innerHTML = `
          <div class="col-span-3 py-12 text-center text-outline">
            <span class="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p class="font-bold">No vendors found near ${district}.</p>
            <p class="text-sm mt-1">Try a different category or search term.</p>
          </div>`;
      }
    } catch (e) {
      container.innerHTML = `<div class="col-span-3 py-8 text-center"><p class="text-error font-bold">Error loading vendors: ${e.message}</p></div>`;
    }
  }

  // ─── AI Recommendations ────────────────────────────────────
  async function loadAI(category, query) {
    const container = document.getElementById('shop-ai-results');
    container.innerHTML = `<div class="py-8 text-center text-outline"><div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div><p class="text-sm font-bold">Generating AI recommendations…</p></div>`;

    const district = getDistrict();
    try {
      const data = await getMarketplace({
        query: query || category,
        category: category !== 'all' ? category : undefined,
        district,
      });

      let html = '';

      // Products Grid
      if (data.recommendations?.length) {
        html += `<div class="grid grid-cols-3 gap-4 mb-6">`;
        html += data.recommendations.map(r => `
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary text-base">${catIcon[r.category] || 'eco'}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-secondary uppercase tracking-wider mb-0.5">${r.category}</p>
                <h4 class="font-bold text-primary text-sm leading-tight">${r.name}</h4>
              </div>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed mb-3">${r.description}</p>
            <div class="flex items-center justify-between mb-3">
              <p class="font-headline font-black text-primary">${r.estimatedPrice}</p>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${availColor[r.availability] || 'text-outline bg-surface-container'}">${(r.availability||'').replace(/-/g,' ')}</span>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">How to Get</p>
              <p class="text-xs text-on-surface-variant">${r.procurementTip}</p>
            </div>
          </div>`).join('');
        html += `</div>`;
      }

      // Govt Schemes
      if (data.govtSchemes?.length) {
        html += `
          <div class="bg-primary text-white p-6 rounded-2xl shadow-lg mb-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary-fixed">account_balance</span>
              <h3 class="font-headline text-lg font-bold">Government Schemes & Subsidies</h3>
            </div>
            <div class="grid grid-cols-3 gap-4">
              ${data.govtSchemes.map(s => `
                <div class="p-4 bg-white/10 rounded-xl">
                  <h4 class="font-bold text-sm mb-1">${s.scheme}</h4>
                  <p class="text-xs text-primary-fixed-dim mb-2">${s.benefit}</p>
                  <p class="text-xs text-primary-fixed border-t border-white/10 pt-2 mt-2">${s.howToApply}</p>
                </div>`).join('')}
            </div>
          </div>`;
      }

      // Local Services
      if (data.localServiceProviders) {
        html += `
          <div class="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-secondary text-base">handyman</span>
              <p class="text-xs font-bold text-secondary uppercase tracking-wider">AI Service Provider Tips</p>
            </div>
            <p class="text-sm text-on-surface">${data.localServiceProviders}</p>
          </div>`;
      }

      // Real vendors from Serper (also attached to AI response)
      if (data.realVendors?.length) {
        html += `
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary text-sm">verified</span>
              <p class="text-xs font-bold text-primary uppercase tracking-wider">Verified Local Vendors (from Google)</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              ${data.realVendors.slice(0, 4).map(v => `
                <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <span class="material-symbols-outlined text-primary text-sm">storefront</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-primary truncate">${v.title}</p>
                    <p class="text-xs text-outline truncate">${v.address || ''}</p>
                  </div>
                  ${v.rating ? `<span class="text-xs font-bold text-primary">${v.rating}★</span>` : ''}
                </div>`).join('')}
            </div>
          </div>`;
      }

      container.innerHTML = html || '<p class="text-sm text-outline p-4">No AI recommendations available.</p>';
    } catch (e) {
      container.innerHTML = `<div class="py-8 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  // ─── Local News ────────────────────────────────────────────
  async function loadNews() {
    const container = document.getElementById('shop-news');
    container.innerHTML = [1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('');
    const district = getDistrict();
    try {
      const data = await getSerperNews({ district, topic: 'agriculture market farming' });
      if (data.news?.length) {
        container.innerHTML = data.news.slice(0, 4).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            <p class="text-xs font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">${n.title}</p>
            <p class="text-[10px] text-on-surface-variant mt-1 line-clamp-2">${n.snippet || ''}</p>
            <p class="text-[10px] text-outline mt-1">${n.source || ''} • ${n.date || ''}</p>
          </a>`).join('');
      } else {
        container.innerHTML = '<p class="text-sm text-outline col-span-4">No news available.</p>';
      }
    } catch {
      container.innerHTML = '<p class="text-sm text-error col-span-4">News unavailable.</p>';
    }
  }

  // ─── Category Tab Switching ────────────────────────────────
  function setActiveCategory(catId) {
    activeCategory = catId;
    document.querySelectorAll('.shop-cat-btn').forEach(btn => {
      const isActive = btn.dataset.cat === catId;
      btn.className = `shop-cat-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`;
    });
    const cat = CATEGORIES.find(c => c.id === catId);
    loadVendors(catId, cat?.query);
    loadAI(catId);
  }

  // Event Listeners
  document.querySelectorAll('.shop-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveCategory(btn.dataset.cat));
  });

  document.getElementById('shop-search-btn')?.addEventListener('click', () => {
    const query = document.getElementById('shop-query')?.value;
    if (query) {
      loadVendors(activeCategory, query);
      loadAI(activeCategory, query);
    }
  });

  document.getElementById('shop-query')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      if (query) {
        loadVendors(activeCategory, query);
        loadAI(activeCategory, query);
      }
    }
  });

  document.getElementById('shop-district')?.addEventListener('change', () => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    loadVendors(activeCategory, cat?.query);
    loadAI(activeCategory);
    loadNews();
  });

  // Initial Load
  loadVendors('all');
  loadAI('all');
  loadNews();
}
