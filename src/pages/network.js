export function renderNetwork() {
  return `<main class="ml-64 pt-24 px-8 pb-12 min-h-screen page-enter">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-12">
        <div>
          <span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary block mb-2">Crowdsourced Intelligence</span>
          <h2 class="font-headline text-5xl font-extrabold text-primary tracking-tight">Farmer Network</h2>
        </div>
        <div class="flex gap-3">
          <button class="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-sm">filter_list</span> Filter Feed
          </button>
          <button class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity">
            <span class="material-symbols-outlined text-sm">edit</span> Create Post
          </button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8">
        <!-- Data Engine Stats -->
        <div class="col-span-12 grid grid-cols-4 gap-4 mb-4">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-primary">group</span></div>
            <div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Active Farmers</p><p class="text-2xl font-headline font-black text-primary">12,847</p></div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-secondary">database</span></div>
            <div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Data Points</p><p class="text-2xl font-headline font-black text-primary">2.4M</p></div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-tertiary">verified</span></div>
            <div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Verified Tips</p><p class="text-2xl font-headline font-black text-primary">8,421</p></div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-primary">location_on</span></div>
            <div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Regions Covered</p><p class="text-2xl font-headline font-black text-primary">48</p></div>
          </div>
        </div>
        <!-- Feed -->
        <div class="col-span-8 space-y-6">
          <!-- Post 1 -->
          <article class="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start gap-4 mb-6">
              <img alt="Farmer" class="w-12 h-12 rounded-full object-cover border-2 border-primary-fixed" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_3PHbf9S8MAElbDO4M1qyFRPvV8jTIWYqsmN73chqyZH5oainnIlMTfmkz6gXRLEZwW5vxC4XN28Z68dQViwg6MJDQ98ptd1B--Xyuw1dl0CzNUZb3kMAEYu9ttBucB6mmRl0wZdOQhqF27Xc7lv6rbgXT4Ga8PhLWOdfMy4AG2U9P3YPqsIyjkcBw92oyUtw0BHqdP8z4SD3-drZIIa16BKaTQBxIkWBnFaDTa1HJZiP4zY8bXTk8Sfsr1BOZYYZkz8yviRNyKo"/>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-primary">Elara Vance</h4>
                  <span class="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full">Top Contributor</span>
                </div>
                <p class="text-[10px] text-outline">Nashik, Maharashtra • 2 hours ago</p>
              </div>
              <button class="material-symbols-outlined text-outline hover:text-primary">more_horiz</button>
            </div>
            <p class="text-sm text-on-surface leading-relaxed mb-6">Brix levels exceeding 24.5 in early pick from Block 7. Best season in a decade. Applied the K2 recommended irrigation schedule and seeing incredible results. The AI-optimized nitrogen cycle suggestion was game-changing! 🍇</p>
            <div class="rounded-xl overflow-hidden mb-6 h-56 relative">
              <img alt="Vineyard harvest" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw1p7TdyiSJxl_WDa2AUJIMzNiNO0GlcGN6JQ3cUvoqdHrjo-WD43oJgmNeGQeO0JbB86NlHXgQ6eMZukUFe_UsxSz7u5dm8Csz0c3qIzF20kUJ1G-P535BLGwusz5qil90iE6ACm40wiCYl5S_oIYA3Lske1I8wgWxjmXEGE0eyLS6luqDKJbnd3HRKvvFmxMPWb48WcSgi-hwCWHA-EUX8M6Giv8PPd1_HIQSJiDEE0ImzCemBtCCQGr3XOK7QTNXnNb4dc0B_0"/>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <span class="text-white text-xs font-bold">📊 Yield Report Attached</span>
              </div>
            </div>
            <div class="flex gap-6 text-sm text-outline">
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">thumb_up</span> 142</button>
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">comment</span> 28</button>
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">share</span> Share</button>
              <button class="ml-auto flex items-center gap-2 hover:text-secondary transition-colors"><span class="material-symbols-outlined text-sm">bookmark</span> Save</button>
            </div>
          </article>
          <!-- Post 2 -->
          <article class="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">MK</div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-primary">Marcus Kane</h4>
                  <span class="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-full">Data Scientist</span>
                </div>
                <p class="text-[10px] text-outline">Pune, Maharashtra • 5 hours ago</p>
              </div>
              <button class="material-symbols-outlined text-outline hover:text-primary">more_horiz</button>
            </div>
            <p class="text-sm text-on-surface leading-relaxed mb-6">Sharing my soil moisture data from Sector B. The correlation between morning dew point and afternoon evapotranspiration is fascinating. Anyone else seeing similar patterns in the Western Ghats foothills?</p>
            <div class="bg-surface-container-low p-6 rounded-xl mb-6">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs font-bold text-primary">Moisture Trend - 14 Days</span>
                <span class="text-[10px] text-outline">Sensor Array B-12</span>
              </div>
              <div class="h-24 flex items-end gap-1">
                ${[65,72,68,74,80,76,82,78,85,82,88,84,90,87].map((v,i) => 
                  `<div class="flex-1 bg-secondary rounded-t-sm transition-all hover:bg-primary" style="height:${v}%"></div>`
                ).join('')}
              </div>
            </div>
            <div class="flex gap-6 text-sm text-outline">
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">thumb_up</span> 89</button>
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">comment</span> 14</button>
              <button class="flex items-center gap-2 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">share</span> Share</button>
              <button class="ml-auto flex items-center gap-2 hover:text-secondary transition-colors"><span class="material-symbols-outlined text-sm">bookmark</span> Save</button>
            </div>
          </article>
        </div>
        <!-- Leaderboard & Trending -->
        <div class="col-span-4 space-y-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-6">Top Contributors</h3>
            <div class="space-y-4">
              ${[
                {name:'Elara Vance',pts:'2,847',rank:'1',badge:'🏆'},
                {name:'Raj Mehta',pts:'2,102',rank:'2',badge:'🥈'},
                {name:'Priya Sharma',pts:'1,856',rank:'3',badge:'🥉'},
                {name:'Marcus Kane',pts:'1,643',rank:'4',badge:''},
                {name:'Lakshmi Devi',pts:'1,420',rank:'5',badge:''},
              ].map(u => `
                <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span class="text-sm font-black text-outline w-6">${u.badge || '#'+u.rank}</span>
                  <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-bold">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div class="flex-1"><p class="text-xs font-bold text-primary">${u.name}</p><p class="text-[10px] text-outline">${u.pts} pts</p></div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="bg-primary text-on-primary p-6 rounded-xl shadow-xl relative overflow-hidden">
            <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-container/30 rounded-full blur-xl"></div>
            <div class="relative z-10">
              <h3 class="font-headline text-lg font-bold mb-4">🔥 Trending Topics</h3>
              <div class="space-y-3">
                <div class="p-3 bg-on-primary/10 rounded-lg hover:bg-on-primary/20 transition-colors cursor-pointer">
                  <p class="text-xs font-bold">#DroughtResistantVarieties</p>
                  <p class="text-[10px] text-primary-fixed-dim">1,247 discussions</p>
                </div>
                <div class="p-3 bg-on-primary/10 rounded-lg hover:bg-on-primary/20 transition-colors cursor-pointer">
                  <p class="text-xs font-bold">#KharifPriceForecasts</p>
                  <p class="text-[10px] text-primary-fixed-dim">892 discussions</p>
                </div>
                <div class="p-3 bg-on-primary/10 rounded-lg hover:bg-on-primary/20 transition-colors cursor-pointer">
                  <p class="text-xs font-bold">#OrganicCertification</p>
                  <p class="text-[10px] text-primary-fixed-dim">654 discussions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
