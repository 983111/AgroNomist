import { userPrefs } from '../services/api.js';

export function renderTopbar(title = 'AgriIntel') {
  const location = [userPrefs.city, userPrefs.country].filter(Boolean).join(', ') || 'Set Location';
  return `<header class="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-8 border-b border-outline-variant/20 gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <button id="mobile-menu-btn" class="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" aria-label="Open menu">
        <span class="material-symbols-outlined text-primary">menu</span>
      </button>
      <div class="relative hidden md:block">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
        <input id="global-search" class="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full w-56 focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline/60" placeholder="Search anything..." type="text"/>
      </div>
    </div>
    <div class="flex items-center gap-2 lg:gap-3 min-w-0">
      <!-- Location display + settings -->
      <button id="settings-btn" title="Location & Language Settings"
        class="flex items-center gap-2 px-2.5 lg:px-3 py-1.5 bg-surface-container-low rounded-full hover:bg-surface-container transition-colors border border-outline-variant/20 text-xs font-bold text-on-surface-variant min-w-0">
        <span class="material-symbols-outlined text-primary text-sm">location_on</span>
        <span id="topbar-location" class="max-w-[110px] lg:max-w-[140px] truncate">${location}</span>
        <span class="material-symbols-outlined text-outline text-xs">edit</span>
      </button>

      <!-- Language badge -->
      <span class="hidden sm:flex w-8 h-8 items-center justify-center text-outline rounded-full bg-surface-container-low border border-outline-variant/30 text-xs font-bold uppercase" title="Current language">${userPrefs.language}</span>

      <button class="hidden sm:flex w-9 h-9 items-center justify-center text-outline rounded-full hover:bg-surface-container transition-colors relative">
        <span class="material-symbols-outlined text-xl">notifications</span>
        <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div class="hidden sm:block h-6 w-px bg-outline-variant/30"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">AG</div>
        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-primary leading-tight">AgriIntel</p>
          <p class="text-[10px] text-outline">K2 Powered</p>
        </div>
      </div>
    </div>
  </header>`;
}
