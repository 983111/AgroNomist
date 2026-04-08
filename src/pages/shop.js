import { getMarketplace } from '../services/api.js';

export function renderShop() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Procurement Hub</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Marketplace & Services</h2>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
        <div class="grid grid-cols-5 gap-4">
          <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Search</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input id="shop-query" type="text" placeholder="e.g. fungicide for cotton, drip irrigation..." class="w-full pl-9 pr-4 bg-surface-container-low border-none rounded-xl text-sm py-2.5 focus:ring-2 focus:ring-primary/20"/>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Category</label>
            <select id="shop-category" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option value="all">All Categories</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizers">Fertilizers</option>
              <option value="pesticides">Pesticides</option>
              <option value="equipment-rental">Equipment</option>
              <option value="drone-spraying">Drone Spraying</option>
              <option value="soil-testing">Soil Testing</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Budget (INR)</label>
            <input id="shop-budget" type="number" placeholder="Max budget" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div class="flex items-end">
            <button id="fetch-shop" class="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">shopping_basket</span> Find Products
            </button>
          </div>
        </div>
      </div>

      <div id="shop-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Finding best products & services for you…</p>
      </div>

      <div id="shop-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">shopping_basket</span>
          <p class="font-bold">Search for agricultural inputs, services & govt schemes</p>
        </div>
      </div>
    </div>
  </main>`;
}

const availColor = { 'widely-available': 'text-primary bg-primary-fixed/20', limited: 'text-tertiary bg-tertiary-fixed/30', seasonal: 'text-secondary bg-secondary-fixed/20' };
const catIcon = { seeds: 'eco', fertilizers: 'compost', pesticides: 'pest_control', logistics: 'local_shipping', 'drone-spraying': 'flight', 'soil-testing': 'biotech', 'equipment-rental': 'agriculture' };

export function initShop() {
  document.getElementById('fetch-shop')?.addEventListener('click', async () => {
    const query = document.getElementById('shop-query')?.value;
    const category = document.getElementById('shop-category')?.value;
    const budget = document.getElementById('shop-budget')?.value;

    document.getElementById('shop-loading').classList.remove('hidden');
    document.getElementById('shop-results').innerHTML = '';

    try {
      const data = await getMarketplace({ query, category, district: 'Maharashtra', budget });
      document.getElementById('shop-loading').classList.add('hidden');

      document.getElementById('shop-results').innerHTML = `
        <!-- Products Grid -->
        <div class="mb-8">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Recommended Products & Services</h3>
          <div class="grid grid-cols-3 gap-6">
            ${(data.recommendations || []).map(r => `
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
              </div>`).join('')}
          </div>
        </div>

        <!-- Govt Schemes -->
        ${data.govtSchemes?.length ? `
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
        </div>` : ''}

        <!-- Local Services -->
        ${data.localServiceProviders ? `
        <div class="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-secondary text-base">handyman</span>
            <p class="text-xs font-bold text-secondary uppercase tracking-wider">Local Service Providers</p>
          </div>
          <p class="text-sm text-on-surface">${data.localServiceProviders}</p>
        </div>` : ''}

        ${data.budgetNote ? `
        <div class="mt-4 p-4 bg-tertiary-fixed/30 rounded-xl">
          <p class="text-sm text-tertiary"><span class="font-bold">Budget Note: </span>${data.budgetNote}</p>
        </div>` : ''}
      `;
    } catch (e) {
      document.getElementById('shop-loading').classList.add('hidden');
      document.getElementById('shop-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  });
}
