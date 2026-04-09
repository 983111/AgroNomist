const navItems = [
  { label: 'Dashboard',         icon: 'dashboard',        path: '/' },
  { label: 'Multi-Agent AI',    icon: 'account_tree',     path: '/multiagent',  badge: 'NEW' },
  { label: 'Research',          icon: 'science',           path: '/research' },
  { label: 'Lab',               icon: 'biotech',           path: '/lab' },
  { label: 'AI Recommendations',icon: 'psychology',        path: '/soil' },
  { label: 'Disease',           icon: 'coronavirus',       path: '/disease' },
  { label: 'Weather',           icon: 'cloudy_snowing',    path: '/weather' },
  { label: 'Market',            icon: 'trending_up',       path: '/market' },
  { label: 'Network',           icon: 'hub',               path: '/network' },
  { label: 'Shop',              icon: 'shopping_basket',   path: '/shop' },
  { label: 'Feedback',          icon: 'chat_bubble',       path: '/feedback' },
];

export function renderSidebar(activePath) {
  const navHTML = navItems.map(item => {
    const isActive = item.path === activePath;
    return isActive
      ? `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 bg-white text-primary rounded-r-full shadow-sm font-label text-sm tracking-wide uppercase font-semibold">
           <span class="material-symbols-outlined text-lg">${item.icon}</span>
           <span class="flex-1">${item.label}</span>
           ${item.badge ? `<span class="text-[9px] font-black bg-secondary text-white px-1.5 py-0.5 rounded-full">${item.badge}</span>` : ''}
         </a>`
      : `<a href="#${item.path}" class="flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:translate-x-1 transition-transform font-label text-sm tracking-wide uppercase font-semibold hover:text-primary">
           <span class="material-symbols-outlined text-lg">${item.icon}</span>
           <span class="flex-1">${item.label}</span>
           ${item.badge ? `<span class="text-[9px] font-black bg-secondary text-white px-1.5 py-0.5 rounded-full">${item.badge}</span>` : ''}
         </a>`;
  }).join('');

  return `
  <div id="mobile-sidebar-overlay" class="fixed inset-0 bg-black/30 z-40 hidden lg:hidden"></div>
  <aside id="app-sidebar" class="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-low flex flex-col py-8 pr-4 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.08)] transition-transform duration-300 lg:translate-x-0 -translate-x-full">
    <div class="px-6 mb-8">
      <div class="flex items-center gap-2 mb-1">
        <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings:'FILL' 1">agriculture</span>
        <h1 class="font-headline text-xl font-black text-primary tracking-tighter">AgriIntel</h1>
      </div>
      <p class="font-body text-[10px] tracking-widest uppercase font-semibold text-outline">K2 Multi-Agent Platform</p>
      <div class="mt-2 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        <span class="text-[10px] text-outline">5 agents • global</span>
      </div>
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto">${navHTML}</nav>
    <div class="mt-auto px-6 space-y-3">
      <a href="#/multiagent" class="w-full py-4 bg-primary text-white rounded-xl font-headline font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm">
        <span class="material-symbols-outlined text-sm">account_tree</span> Multi-Agent Mode
      </a>
      <button id="signout-btn" class="w-full py-2.5 border border-outline-variant text-outline rounded-xl font-label text-xs font-semibold flex items-center justify-center gap-2 hover:bg-error/10 hover:text-error hover:border-error/20 transition-colors">
        <span class="material-symbols-outlined text-sm">logout</span> Sign Out
      </button>
    </div>
  </aside>`;
}
