export function renderTopbar(title = 'AgriIntel') {
  return `<header class="fixed top-0 right-0 left-64 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-8 border-b border-outline-variant/20">
    <div class="flex items-center gap-3">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
        <input id="global-search" class="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full w-56 focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline/60" placeholder="Search anything..." type="text"/>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button id="lang-toggle" title="Toggle Language" class="w-9 h-9 flex items-center justify-center text-outline rounded-full hover:bg-surface-container transition-colors text-xs font-bold border border-outline-variant/30">हि</button>
      <button class="w-9 h-9 flex items-center justify-center text-outline rounded-full hover:bg-surface-container transition-colors relative">
        <span class="material-symbols-outlined text-xl">notifications</span>
        <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div class="h-6 w-px bg-outline-variant/30"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">VA</div>
        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-primary leading-tight">Vishwajeet</p>
          <p class="text-[10px] text-outline">Farmer Pro</p>
        </div>
      </div>
    </div>
  </header>`;
}
