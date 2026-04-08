export function renderMarket() {
  return `<main class="ml-64 pt-24 px-8 pb-12 min-h-screen page-enter">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-12">
        <div>
          <span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary block mb-2">Intelligence Engine v3.1</span>
          <h2 class="font-headline text-5xl font-extrabold text-primary tracking-tight">Market Intelligence</h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-[10px] font-bold uppercase tracking-wider text-outline">Data Refreshed</p>
            <p class="text-sm font-headline font-bold text-primary">12 min ago</p>
          </div>
          <div class="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>
      <!-- Market Ticker -->
      <div class="grid grid-cols-4 gap-6 mb-12">
        <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute bottom-0 left-0 right-0 h-16 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none"><path d="M0 40 Q 30 10, 60 30 T 120 20 T 200 10" fill="none" stroke="#123b2a" stroke-width="3"/></svg>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Thompson Grapes</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-headline font-black text-primary">₹82</span>
            <span class="text-sm font-bold text-primary">/kg</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
            <span class="text-xs font-bold text-primary">+8.4%</span>
            <span class="text-[10px] text-outline ml-1">vs last week</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute bottom-0 left-0 right-0 h-16 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none"><path d="M0 20 Q 40 35, 80 25 T 160 40 T 200 30" fill="none" stroke="#ba1a1a" stroke-width="3"/></svg>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Pomegranate</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-headline font-black text-primary">₹145</span>
            <span class="text-sm font-bold text-primary">/kg</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <span class="material-symbols-outlined text-error text-sm">trending_down</span>
            <span class="text-xs font-bold text-error">-3.2%</span>
            <span class="text-[10px] text-outline ml-1">vs last week</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute bottom-0 left-0 right-0 h-16 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none"><path d="M0 30 Q 50 15, 100 20 T 200 10" fill="none" stroke="#123b2a" stroke-width="3"/></svg>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Onion (Nashik Red)</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-headline font-black text-primary">₹28</span>
            <span class="text-sm font-bold text-primary">/kg</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
            <span class="text-xs font-bold text-primary">+12.1%</span>
            <span class="text-[10px] text-outline ml-1">vs last week</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute bottom-0 left-0 right-0 h-16 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none"><path d="M0 25 Q 50 20, 100 25 T 200 22" fill="none" stroke="#2b5bb5" stroke-width="3"/></svg>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Sugarcane</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-headline font-black text-primary">₹315</span>
            <span class="text-sm font-bold text-primary">/quintal</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <span class="material-symbols-outlined text-secondary text-sm">trending_flat</span>
            <span class="text-xs font-bold text-secondary">+0.4%</span>
            <span class="text-[10px] text-outline ml-1">stable</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8">
        <!-- Profit Analyzer -->
        <div class="col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h3 class="font-headline text-2xl font-bold text-primary">Profit Analyzer</h3>
              <p class="text-sm text-outline mt-1">ML-based price forecasting for optimal sell window</p>
            </div>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold">3M</button>
              <button class="px-4 py-2 bg-surface-container-high text-outline rounded-lg text-xs font-bold">6M</button>
              <button class="px-4 py-2 bg-surface-container-high text-outline rounded-lg text-xs font-bold">1Y</button>
            </div>
          </div>
          <div class="relative h-64 w-full bg-surface-container-low rounded-lg overflow-hidden p-8">
            <svg class="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#123b2a" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#123b2a" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 160 Q 50 140, 100 120 T 200 100 T 300 60 T 400 80 T 500 40 T 600 20" fill="none" stroke="#123b2a" stroke-width="3" stroke-linecap="round"/>
              <path d="M0 160 Q 50 140, 100 120 T 200 100 T 300 60 T 400 80 T 500 40 T 600 20 V 200 H 0 Z" fill="url(#profitGrad)"/>
              <line x1="400" y1="0" x2="400" y2="200" stroke="#2b5bb5" stroke-width="1" stroke-dasharray="4"/>
              <circle cx="400" cy="80" r="6" fill="#2b5bb5" stroke="white" stroke-width="2"/>
            </svg>
            <div class="absolute top-4 right-8 glass-panel px-4 py-3 rounded-xl border border-white/40">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider">AI Sell Signal</p>
              <p class="text-lg font-headline font-black text-primary">₹92/kg</p>
              <p class="text-[10px] text-outline">Predicted: Oct 18</p>
            </div>
          </div>
          <div class="mt-8 grid grid-cols-3 gap-6">
            <div class="p-4 bg-primary-fixed/20 rounded-lg text-center">
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Current Revenue</p>
              <p class="text-xl font-headline font-black text-primary">₹4.2L</p>
            </div>
            <div class="p-4 bg-secondary-fixed/20 rounded-lg text-center border-2 border-secondary/20">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Potential If Held</p>
              <p class="text-xl font-headline font-black text-secondary">₹5.8L</p>
            </div>
            <div class="p-4 bg-tertiary-fixed/20 rounded-lg text-center">
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Risk-Adjusted Gain</p>
              <p class="text-xl font-headline font-black text-tertiary">+38%</p>
            </div>
          </div>
        </div>
        <!-- Mandi Prices -->
        <div class="col-span-4 space-y-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-headline text-lg font-bold text-primary">Mandi Price Comparison</h3>
              <span class="material-symbols-outlined text-outline">tune</span>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-primary-fixed/10 rounded-xl border-l-4 border-primary">
                <div>
                  <p class="text-sm font-bold text-primary">Nashik (Pimpalgaon)</p>
                  <p class="text-[10px] text-outline font-medium">Modal Price Today</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-headline font-black text-primary">₹82</p>
                  <p class="text-[10px] text-primary font-bold">Best Price ★</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p class="text-sm font-bold text-on-surface">Pune (Gultekdi)</p>
                  <p class="text-[10px] text-outline font-medium">Modal Price Today</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-headline font-black text-on-surface">₹76</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p class="text-sm font-bold text-on-surface">Sangli (Main Mandi)</p>
                  <p class="text-[10px] text-outline font-medium">Modal Price Today</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-headline font-black text-on-surface">₹71</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p class="text-sm font-bold text-on-surface">Mumbai (APMC Vashi)</p>
                  <p class="text-[10px] text-outline font-medium">Modal Price Today</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-headline font-black text-on-surface">₹88</p>
                  <p class="text-[10px] text-secondary font-bold">+Transport Cost</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Demand Forecast -->
          <div class="bg-primary text-on-primary p-6 rounded-xl shadow-xl relative overflow-hidden">
            <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-container/30 rounded-full blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary-fixed">auto_awesome</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">AI Demand Forecast</span>
              </div>
              <h4 class="font-headline text-xl font-bold mb-4">Export Demand Surge Expected</h4>
              <p class="text-sm text-primary-fixed-dim leading-relaxed mb-6">Middle East markets signal 22% increase in grape import orders for Q4. Recommend cold-chain pre-booking.</p>
              <button class="w-full py-3 bg-on-primary text-primary rounded-xl font-bold text-sm hover:bg-primary-fixed transition-colors">View Export Intelligence</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
