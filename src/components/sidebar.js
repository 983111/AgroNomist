import { navigateTo } from '../router.js';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'Research', icon: 'science', path: '/research' },
  { label: 'Lab', icon: 'biotech', path: '/lab' },
  { label: 'Soil', icon: 'layers', path: '/soil' },
  { label: 'Disease', icon: 'coronavirus', path: '/disease' },
  { label: 'Weather', icon: 'cloudy_snowing', path: '/weather' },
  { label: 'Market', icon: 'trending_up', path: '/market' },
  { label: 'Network', icon: 'hub', path: '/network' },
  { label: 'Shop', icon: 'shopping_basket', path: '/shop' },
  { label: 'Feedback', icon: 'chat_bubble', path: '/feedback' },
];

export function renderSidebar(activePath) {
  const navHTML = navItems.map(item => {
    const isActive = item.path === activePath;
    if (isActive) {
      return `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 bg-[#ffffff] text-[#123b2a] rounded-r-full shadow-sm font-label text-sm tracking-wide uppercase font-semibold">
        <span class="material-symbols-outlined">${item.icon}</span>
        ${item.label}
      </a>`;
    }
    return `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 text-[#414941] hover:translate-x-1 transition-transform font-label text-sm tracking-wide uppercase font-semibold hover:text-[#123b2a]">
      <span class="material-symbols-outlined">${item.icon}</span>
      ${item.label}
    </a>`;
  }).join('');

  return `<aside id="sidebar" class="fixed left-0 top-0 h-screen w-64 z-50 bg-[#f2f4f2] flex flex-col py-8 pr-4 tonal-shift-right">
    <div class="px-6 mb-10">
      <h1 class="font-headline text-xl font-black text-[#123b2a] tracking-tighter">Digital Agronomist</h1>
      <p class="font-body text-[10px] tracking-widest uppercase font-semibold text-[#414941] opacity-70">Precision Viticulture</p>
    </div>
    <nav class="flex-1 space-y-1">
      ${navHTML}
    </nav>
    <div class="mt-auto px-6">
      <button onclick="window.location.hash='#/research'" class="w-full py-4 bg-[#123b2a] text-white rounded-xl font-headline font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
        <span class="material-symbols-outlined text-sm">smart_toy</span>
        K2 v2 Assistant
      </button>
    </div>
  </aside>`;
}
