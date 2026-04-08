export function renderDashboard() {
  return `<main class="ml-64 mt-16 p-8 min-h-screen page-enter">
    <!-- Dashboard Header -->
    <div class="mb-12 flex justify-between items-end">
      <div>
        <h2 class="font-headline text-4xl font-extrabold tracking-tight text-primary">Territory Overview</h2>
        <p class="font-body text-outline mt-1 max-w-md">Real-time multispectral analysis of the North Valley Viticulture Zone. AI confidence at 98.4%.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-primary-fixed text-on-primary-fixed rounded-xl text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">download</span> Export Report
        </button>
        <button class="px-4 py-2 bg-secondary text-on-secondary rounded-xl text-sm font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">auto_awesome</span> Optimize Path
        </button>
      </div>
    </div>
    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Map Visualization -->
      <div class="col-span-8 bg-surface-container-low rounded-3xl overflow-hidden relative shadow-sm border border-outline-variant/10 min-h-[500px]">
        <div class="absolute inset-0 z-0 grayscale-[0.2]" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCw1p7TdyiSJxl_WDa2AUJIMzNiNO0GlcGN6JQ3cUvoqdHrjo-WD43oJgmNeGQeO0JbB86NlHXgQ6eMZukUFe_UsxSz7u5dm8Csz0c3qIzF20kUJ1G-P535BLGwusz5qil90iE6ACm40wiCYl5S_oIYA3Lske1I8wgWxjmXEGE0eyLS6luqDKJbnd3HRKvvFmxMPWb48WcSgi-hwCWHA-EUX8M6Giv8PPd1_HIQSJiDEE0ImzCemBtCCQGr3XOK7QTNXnNb4dc0B_0'); background-size: cover; background-position: center;"></div>
        <div class="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        <div class="absolute top-6 left-6 flex flex-col gap-3 z-10">
          <div class="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border-l-4 border-primary">
            <span class="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
            <div>
              <p class="text-[10px] font-label uppercase tracking-widest text-primary/60 font-bold leading-none">Scanning Zone</p>
              <p class="text-sm font-headline font-extrabold text-primary">Block 7 - Cabernet</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
          <div class="flex gap-2">
            <button class="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-white transition-colors">
              <span class="material-symbols-outlined">layers</span>
            </button>
            <button class="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-white transition-colors">
              <span class="material-symbols-outlined">satellite_alt</span>
            </button>
          </div>
          <div class="glass-panel p-4 rounded-2xl flex gap-8 border border-white/40">
            <div>
              <p class="text-[10px] font-label uppercase tracking-tighter text-primary/60 font-bold mb-1">Leaf Area Index</p>
              <div class="flex items-center gap-2">
                <span class="text-xl font-headline font-black text-primary">2.4</span>
                <span class="text-xs font-bold text-[#123b2a] bg-primary-fixed px-1.5 py-0.5 rounded-md">+0.3</span>
              </div>
            </div>
            <div class="w-[1px] bg-primary/10"></div>
            <div>
              <p class="text-[10px] font-label uppercase tracking-tighter text-primary/60 font-bold mb-1">Moisture Flux</p>
              <div class="flex items-center gap-2">
                <span class="text-xl font-headline font-black text-primary">82%</span>
                <span class="material-symbols-outlined text-primary text-sm">water_drop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- K2 v2 Insights Panel -->
      <div class="col-span-4 flex flex-col gap-6">
        <div class="glass-panel p-8 rounded-3xl border border-white/40 shadow-[0px_12px_32px_rgba(25,28,27,0.04)] bg-gradient-to-br from-white/80 to-[#c1ecd4]/20 relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-secondary mb-6">
              <span class="material-symbols-outlined">auto_awesome</span>
              <span class="font-label text-xs uppercase font-bold tracking-widest">K2 v2 Intelligence</span>
            </div>
            <h3 class="font-headline text-2xl font-extrabold text-primary leading-tight mb-4">Strategic Harvest Window Detected</h3>
            <p class="font-body text-sm text-on-surface-variant leading-relaxed mb-6">Based on spectral browning and soil nitrate levels, Block 4 will reach peak phenolic maturity in <span class="text-primary font-bold">72 hours</span>. Recommend shifting harvesting logistics.</p>
            <div class="space-y-3">
              <div class="bg-white/60 p-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-colors cursor-pointer group">
                <span class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined">bolt</span>
                </span>
                <div>
                  <p class="text-xs font-bold text-primary">Optimize Irrigation</p>
                  <p class="text-[10px] text-outline">Reduce flow in Zone A by 12%</p>
                </div>
              </div>
              <div class="bg-white/60 p-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-colors cursor-pointer group">
                <span class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined">warning</span>
                </span>
                <div>
                  <p class="text-xs font-bold text-primary">Mildew Pre-alert</p>
                  <p class="text-[10px] text-outline">Humidity spike expected tomorrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Farmer Network Feed -->
        <div class="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-label text-xs uppercase font-bold tracking-widest text-primary">Farmer Network</h4>
            <span class="text-[10px] font-bold text-secondary">Live Feed</span>
          </div>
          <div class="space-y-6">
            <div class="flex gap-4">
              <img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_3PHbf9S8MAElbDO4M1qyFRPvV8jTIWYqsmN73chqyZH5oainnIlMTfmkz6gXRLEZwW5vxC4XN28Z68dQViwg6MJDQ98ptd1B--Xyuw1dl0CzNUZb3kMAEYu9ttBucB6mmRl0wZdOQhqF27Xc7lv6rbgXT4Ga8PhLWOdfMy4AG2U9P3YPqsIyjkcBw92oyUtw0BHqdP8z4SD3-drZIIa16BKaTQBxIkWBnFaDTa1HJZiP4zY8bXTk8Sfsr1BOZYYZkz8yviRNyKo"/>
              <div>
                <p class="text-xs font-bold text-primary">Elara Vance <span class="font-normal text-outline ml-1">posted a yields report</span></p>
                <p class="text-[10px] text-outline mt-1">"Brix levels exceeding 24.5 in early pick. Best season in a decade."</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-bold">MK</div>
              <div>
                <p class="text-xs font-bold text-primary">Marcus Kane <span class="font-normal text-outline ml-1">shared data from Sector B</span></p>
                <div class="mt-2 h-1 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div class="bg-secondary h-full" style="width: 70%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Key Metrics Bar -->
      <div class="col-span-12 grid grid-cols-4 gap-8">
        <div class="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex flex-col justify-between h-48">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">compost</span>
            </div>
            <span class="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-lg">High Health</span>
          </div>
          <div>
            <p class="text-sm font-medium text-outline">Average Soil Health</p>
            <div class="flex items-baseline gap-2">
              <h5 class="font-headline text-4xl font-black text-primary">94.2%</h5>
              <span class="text-xs font-bold text-primary-container">+1.2%</span>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex flex-col justify-between h-48">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-secondary-container/10 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined">thunderstorm</span>
            </div>
            <span class="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-lg">Moderate</span>
          </div>
          <div>
            <p class="text-sm font-medium text-outline">Active Weather Alerts</p>
            <div class="flex items-baseline gap-2">
              <h5 class="font-headline text-4xl font-black text-primary">02</h5>
              <span class="text-xs font-medium text-outline">Wind/Storm</span>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex flex-col justify-between h-48 relative overflow-hidden">
          <div class="absolute bottom-0 right-0 left-0 h-16 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 400 100">
              <path d="M0 80 Q 50 20 100 50 T 200 40 T 300 10 T 400 30" fill="none" stroke="#2b5bb5" stroke-width="4"></path>
            </svg>
          </div>
          <div class="flex justify-between items-start relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined">trending_up</span>
            </div>
            <span class="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-lg">Bullish</span>
          </div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-outline">Market Price Trends</p>
            <div class="flex items-baseline gap-2">
              <h5 class="font-headline text-4xl font-black text-primary">$4.8k</h5>
              <span class="text-xs font-bold text-primary-container">/Ton</span>
            </div>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex flex-col justify-between h-48">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-tertiary/5 flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined">bar_chart</span>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-outline">Predicted Yield vs Target</p>
            <div class="flex items-baseline gap-2 mb-2">
              <h5 class="font-headline text-4xl font-black text-primary">108%</h5>
            </div>
            <div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div class="bg-primary h-full" style="width: 85%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <button class="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50">
    <span class="material-symbols-outlined text-3xl">forum</span>
    <span class="absolute right-full mr-4 bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ask K2 Assistant</span>
  </button>`;
}
