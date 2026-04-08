const navItems = [
  { label: 'Dashboard',  icon: 'dashboard',        path: '/' },
  { label: 'Research',   icon: 'science',           path: '/research' },
  { label: 'Lab',        icon: 'biotech',           path: '/lab' },
  { label: 'Soil',       icon: 'layers',            path: '/soil' },
  { label: 'Disease',    icon: 'coronavirus',       path: '/disease' },
  { label: 'Weather',    icon: 'cloudy_snowing',    path: '/weather' },
  { label: 'Market',     icon: 'trending_up',       path: '/market' },
  { label: 'Network',    icon: 'hub',               path: '/network' },
  { label: 'Shop',       icon: 'shopping_basket',   path: '/shop' },
  { label: 'Feedback',   icon: 'chat_bubble',       path: '/feedback' },
];

export function renderSidebar(activePath) {
  const navHTML = navItems.map(item => {
    const isActive = item.path === activePath;
    return isActive
      ? `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 bg-white text-primary rounded-r-full shadow-sm font-label text-sm tracking-wide uppercase font-semibold">
           <span class="material-symbols-outlined text-lg">${item.icon}</span>${item.label}
         </a>`
      : `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:translate-x-1 transition-transform font-label text-sm tracking-wide uppercase font-semibold hover:text-primary">
           <span class="material-symbols-outlined text-lg">${item.icon}</span>${item.label}
         </a>`;
  }).join('');

  return `<aside class="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-low flex flex-col py-8 pr-4 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.08)]">
    <div class="px-6 mb-10">
      <div class="flex items-center gap-2 mb-1">
        <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings:'FILL' 1">agriculture</span>
        <h1 class="font-headline text-xl font-black text-primary tracking-tighter">AgriIntel</h1>
      </div>
      <p class="font-body text-[10px] tracking-widest uppercase font-semibold text-outline">K2 Powered Platform</p>
    </div>
    <nav class="flex-1 space-y-1">${navHTML}</nav>
    <div class="mt-auto px-6">
      <a href="#/research" class="w-full py-4 bg-primary text-white rounded-xl font-headline font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm">
        <span class="material-symbols-outlined text-sm">smart_toy</span> K2 Assistant
      </a>
    </div>
  </aside>`;
}
