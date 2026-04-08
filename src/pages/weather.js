export function renderWeather() {
  return `<main class="ml-64 pt-24 px-8 pb-12 fallow-ground min-h-screen page-enter">
    <!-- Risk Alert -->
    <section class="mb-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 relative overflow-hidden bg-error text-on-error rounded-xl p-8 shadow-xl flex items-center gap-8">
          <div class="absolute top-0 right-0 p-12 opacity-10 rotate-12"><span class="material-symbols-outlined text-9xl">warning</span></div>
          <div class="relative z-10">
            <div class="inline-flex items-center px-3 py-1 bg-on-error/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Critical Alert: Frost Risk</div>
            <h2 class="font-headline text-4xl font-extrabold mb-4 leading-tight">Extreme Temperature Drop Predicted <br/><span class="opacity-80">ETA: 14h 22m</span></h2>
            <div class="flex gap-4">
              <button class="bg-surface-container-lowest text-error px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all"><span class="material-symbols-outlined">history_edu</span> View Mitigation Protocol</button>
              <button class="border border-on-error px-6 py-3 rounded-full font-bold hover:bg-on-error/10 transition-all">Dismiss for 1h</button>
            </div>
          </div>
        </div>
        <div class="bg-primary text-on-primary rounded-xl p-8 shadow-xl flex flex-col justify-between border-l-8 border-primary-container">
          <div><p class="text-primary-fixed text-xs font-bold uppercase tracking-widest mb-2">AI-Driven Action Plan</p><h3 class="font-headline text-2xl font-bold mb-6 italic leading-snug">"Delay harvest due to frost risk. Activate thermal blankets in Block 42 within 12 hours."</h3></div>
          <div class="flex items-center gap-4"><div class="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center"><span class="material-symbols-outlined text-primary-fixed" style="font-variation-settings: 'FILL' 1;">robot_2</span></div><p class="text-sm font-medium text-primary-fixed-dim">Action required to preserve 85% of pending yield.</p></div>
        </div>
      </div>
    </section>
    <!-- 7-Day Forecast -->
    <section class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div class="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        ${[
          {day:'Mon',icon:'wb_sunny',temp:'24°',s1:'62',s2:'4.2',s2w:'42',highlight:false},
          {day:'Tue',icon:'partly_cloudy_day',temp:'21°',s1:'58',s2:'3.8',s2w:'38',highlight:false},
          {day:'Wed',icon:'ac_unit',temp:'-2°',s1:'92',s2:'88',s2w:'88',highlight:true,s1l:'FROST',s2l:'HUMID'},
          {day:'Thu',icon:'cloudy_snowing',temp:'4°',s1:'74',s2:'1.2',s2w:'12',highlight:false},
          {day:'Fri',icon:'rainy',temp:'12°',s1:'88',s2:'0.8',s2w:'8',highlight:false},
          {day:'Sat',icon:'sunny',temp:'18°',s1:'82',s2:'2.4',s2w:'24',highlight:false},
          {day:'Sun',icon:'sunny',temp:'22°',s1:'76',s2:'3.1',s2w:'31',highlight:false},
        ].map(d => `
          <div class="bg-surface-container-lowest p-5 rounded-xl flex flex-col items-center justify-between h-80 shadow-sm ${d.highlight ? 'border-2 border-error/20 ring-4 ring-error/5' : 'hover:shadow-md transition-shadow'}">
            <span class="text-xs font-bold ${d.highlight ? 'text-error' : 'text-outline'} uppercase tracking-widest">${d.day}</span>
            <div class="flex flex-col items-center gap-2 py-4">
              <span class="material-symbols-outlined ${d.highlight ? 'text-error text-4xl animate-pulse' : 'text-secondary text-4xl'}">${d.icon}</span>
              <span class="text-2xl font-headline font-extrabold ${d.highlight ? 'text-error' : ''}">${d.temp}</span>
            </div>
            <div class="w-full space-y-4 pt-4 border-t ${d.highlight ? 'border-error/10' : 'border-surface-variant/50'}">
              <div class="space-y-1"><div class="flex justify-between text-[10px] font-bold text-outline"><span>${d.s1l||'SOIL'}</span><span class="${d.highlight ? 'text-error' : 'text-primary'}">${d.s1}%</span></div><div class="h-1 w-full bg-surface-variant rounded-full overflow-hidden"><div class="${d.highlight ? 'bg-error' : 'bg-primary'} h-full" style="width:${d.s1}%"></div></div></div>
              <div class="space-y-1"><div class="flex justify-between text-[10px] font-bold text-outline"><span>${d.s2l||'EVAPO'}</span><span class="text-secondary">${d.s2}</span></div><div class="h-1 w-full bg-surface-variant rounded-full overflow-hidden"><div class="bg-secondary h-full" style="width:${d.s2w}%"></div></div></div>
            </div>
          </div>
        `).join('')}
      </div>
      <!-- Yield Impact -->
      <div class="xl:col-span-4 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col gap-8">
        <div><h3 class="font-headline text-xl font-bold mb-2">Yield Impact Analysis</h3><p class="text-sm text-outline">Correlating weather variance to harvest quality metrics.</p></div>
        <div class="relative h-48 w-full bg-surface-container-low rounded-lg p-4 flex items-end justify-between gap-1 overflow-hidden">
          <div class="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none"><div class="border-t border-outline-variant/20 w-full"></div><div class="border-t border-outline-variant/40 w-full flex justify-between"><span class="text-[8px] font-mono text-outline uppercase tracking-tighter">Baseline Target</span></div><div class="border-t border-outline-variant/20 w-full"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-32 bg-primary rounded-t-sm"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-28 bg-primary opacity-90 rounded-t-sm"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-20 bg-primary opacity-80 rounded-t-sm"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-12 bg-error rounded-t-sm shadow-[0_0_15px_rgba(186,26,26,0.3)]"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-8 bg-error rounded-t-sm shadow-[0_0_15px_rgba(186,26,26,0.3)]"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-16 bg-primary opacity-60 rounded-t-sm"></div></div>
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-24 bg-primary opacity-70 rounded-t-sm"></div></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-surface-container-low rounded-lg"><p class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Sugar Potential</p><p class="text-2xl font-headline font-extrabold text-primary">-4.2%</p><p class="text-[10px] text-error mt-1 font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">arrow_downward</span> High variance</p></div>
          <div class="p-4 bg-surface-container-low rounded-lg"><p class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Acidity Stability</p><p class="text-2xl font-headline font-extrabold text-primary">+1.8%</p><p class="text-[10px] text-primary mt-1 font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">arrow_upward</span> Optimal range</p></div>
        </div>
      </div>
    </section>
    <!-- Bottom Detail -->
    <section class="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div class="bg-surface-container-lowest/60 backdrop-blur-xl border border-white/40 p-8 rounded-xl shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
        <div class="flex justify-between items-start mb-6"><div><h4 class="font-bold text-lg">Soil Moisture Profile</h4><p class="text-sm text-outline">Sensor Array B-12</p></div><span class="material-symbols-outlined text-secondary">water_drop</span></div>
        <div class="space-y-6">
          <div class="flex items-center gap-6"><div class="flex-1"><p class="text-xs font-bold text-outline uppercase tracking-wider mb-2">Surface (15cm)</p><div class="h-2 w-full bg-surface-variant rounded-full overflow-hidden"><div class="bg-secondary h-full w-[45%]"></div></div></div><span class="text-xl font-headline font-extrabold">45%</span></div>
          <div class="flex items-center gap-6"><div class="flex-1"><p class="text-xs font-bold text-outline uppercase tracking-wider mb-2">Sub-Root (60cm)</p><div class="h-2 w-full bg-surface-variant rounded-full overflow-hidden"><div class="bg-secondary h-full w-[68%]"></div></div></div><span class="text-xl font-headline font-extrabold">68%</span></div>
        </div>
        <div class="mt-8 pt-6 border-t border-outline-variant/20"><button class="w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-sm">opacity</span> Schedule Irrigation</button></div>
      </div>
      <div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-8 border-tertiary">
        <div class="flex justify-between items-start mb-6"><div><h4 class="font-bold text-lg">Risk Intelligence</h4><p class="text-sm text-outline">Predictive Anomaly Detection</p></div><span class="material-symbols-outlined text-tertiary">psychology</span></div>
        <div class="space-y-4">
          <div class="p-3 bg-tertiary-fixed rounded-lg flex gap-3 items-start"><span class="material-symbols-outlined text-tertiary text-sm mt-1">info</span><div><p class="text-xs font-bold text-on-tertiary-fixed">Historical Anomaly Detected</p><p class="text-[10px] text-on-tertiary-fixed-variant">Current weather patterns match 2012 drought precursors.</p></div></div>
          <div class="p-3 bg-surface-container-low rounded-lg flex gap-3 items-start"><span class="material-symbols-outlined text-outline text-sm mt-1">trending_down</span><div><p class="text-xs font-bold text-on-surface">Yield Probability Drop</p><p class="text-[10px] text-outline">12% decrease in harvest volume if no irrigation in 48h.</p></div></div>
        </div>
      </div>
      <div class="relative rounded-xl shadow-sm overflow-hidden min-h-[300px] group">
        <img alt="Aerial Vineyard View" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSJLaf7uI-n1WHJEzO_uwHD2rQBvM4ROCrGuLkRoZe2wAl1ALQmWQoWJuCJ4C1oDyQNPNlFHJ60RUhifVYIErMGDGWu9SRwxGS9ef6DTcu-iYVNilxNnofvGsVAe5XtO-nxiQ4J53i_FtS6MeVgucSz0qkTCwxsFcxBTjklFxPYlo768E0FtaEji8iSnvOjIIzVAxtC7YLiiC1LnugKZnUtGrQzVnsHbDbGmK4YWD-uH7u7SRqffr8aJ9toH1eC-5-ye4QplTSjv4"/>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8">
          <div class="flex items-center gap-2 mb-2"><div class="h-2 w-2 rounded-full bg-[#ff0000] animate-pulse"></div><span class="text-xs font-bold text-white uppercase tracking-widest">Live Radar Feedback</span></div>
          <h4 class="text-white font-headline text-2xl font-bold">Storm Cell Tracking</h4>
          <p class="text-primary-fixed-dim text-sm mt-2">Napa East corridor showing increased cloud density. Probable rain in 6 hours.</p>
        </div>
      </div>
    </section>
  </main>
  <button class="fixed bottom-8 right-8 h-16 w-16 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50"><span class="material-symbols-outlined text-3xl">emergency</span><span class="absolute right-full mr-4 bg-surface-container-lowest text-primary px-4 py-2 rounded-lg shadow-xl text-xs font-black uppercase tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Emergency Response Mode</span></button>`;
}
