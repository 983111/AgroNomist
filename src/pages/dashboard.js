const districtSnapshots = {
  Nanded: {
    temp: '31°C',
    conditions: 'Partly cloudy with light breeze',
    humidity: '62%',
    alerts: [
      { severity: 'medium', type: 'heat stress', message: 'Afternoon heat may reduce flowering retention.', timeframe: 'Next 48 hours' },
      { severity: 'low', type: 'pest watch', message: 'Monitor whitefly activity in cotton fields.', timeframe: 'This week' },
    ],
    irrigationAdvice: 'Use short-duration irrigation in early morning to reduce evaporation loss.',
    yieldImpactScore: 74,
  },
  Nashik: {
    temp: '28°C',
    conditions: 'Mild winds with scattered clouds',
    humidity: '68%',
    alerts: [
      { severity: 'low', type: 'fungal risk', message: 'Keep canopy ventilation high for grape and onion plots.', timeframe: 'Next 3 days' },
    ],
    irrigationAdvice: 'Maintain moisture at root zone; avoid overwatering low-lying areas.',
    yieldImpactScore: 81,
  },
  Pune: {
    temp: '29°C',
    conditions: 'Warm day with clear morning sky',
    humidity: '59%',
    alerts: [
      { severity: 'low', type: 'wind advisory', message: 'Secure young vegetable saplings against evening gusts.', timeframe: 'Today evening' },
    ],
    irrigationAdvice: 'Shift fertigation to evening window for better nutrient uptake.',
    yieldImpactScore: 79,
  },
  Aurangabad: {
    temp: '32°C',
    conditions: 'Dry heat during daytime',
    humidity: '51%',
    alerts: [
      { severity: 'high', type: 'heatwave', message: 'Protect flowering crops during peak noon temperature.', timeframe: 'Next 24 hours' },
    ],
    irrigationAdvice: 'Prioritize mulching and drip cycles to preserve topsoil moisture.',
    yieldImpactScore: 64,
  },
  Latur: {
    temp: '33°C',
    conditions: 'Hot and dry with low cloud cover',
    humidity: '47%',
    alerts: [
      { severity: 'high', type: 'soil moisture', message: 'Rapid moisture depletion expected in open fields.', timeframe: 'Next 2 days' },
    ],
    irrigationAdvice: 'Increase watering frequency in sandy patches and monitor wilting.',
    yieldImpactScore: 61,
  },
};

const cropSnapshots = {
  Soybean: { currentPrice: 4820, trend: 'Stable', bestWindow: 'Hold 1-2 weeks', forecast: [4780, 4850, 4920] },
  Cotton: { currentPrice: 7220, trend: 'Upward', bestWindow: 'Sell in 2-3 weeks', forecast: [7150, 7300, 7420] },
  'Tur Dal': { currentPrice: 9450, trend: 'Upward', bestWindow: 'Sell this week', forecast: [9380, 9520, 9650] },
  Onion: { currentPrice: 1680, trend: 'Volatile', bestWindow: 'Staggered selling', forecast: [1600, 1740, 1690] },
  Wheat: { currentPrice: 2540, trend: 'Stable', bestWindow: 'Sell in 1 week', forecast: [2510, 2560, 2600] },
  Rice: { currentPrice: 3160, trend: 'Upward', bestWindow: 'Hold 2 weeks', forecast: [3120, 3190, 3260] },
};

const advisoryFeed = [
  'Seed treatment campaign expanded across Maharashtra districts for kharif preparedness.',
  'District cooperative societies announced new storage subsidy registration window.',
  'Farm extension teams recommend weekly pest scouting for early intervention.',
  'Water budgeting advisories released for canal and borewell users.',
];

export function renderDashboard() {
  return `<main class="ml-64 mt-16 p-8 min-h-screen page-enter">
    <div class="mb-10 flex justify-between items-end">
      <div>
        <h2 class="font-headline text-4xl font-extrabold tracking-tight text-primary">Territory Overview</h2>
        <p class="font-body text-outline mt-1 max-w-md text-sm">Farm intelligence dashboard with district-wise weather and market snapshots.</p>
      </div>
      <div class="flex gap-2">
        <select id="dash-district" class="px-4 py-2 bg-surface-container-low border-none rounded-xl text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20">
          <option value="Nanded">Nanded, Maharashtra</option>
          <option value="Nashik">Nashik</option>
          <option value="Pune">Pune</option>
          <option value="Aurangabad">Aurangabad</option>
          <option value="Latur">Latur</option>
        </select>
        <button id="refresh-dash" class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-sm">refresh</span> Refresh
        </button>
      </div>
    </div>

    <div id="live-weather-banner" class="mb-8 bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 text-white shadow-lg">
      <div class="flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-primary-fixed text-sm">satellite_alt</span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">District Weather Snapshot</span>
        <span class="ml-auto px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">Updated on refresh</span>
      </div>
      <div id="live-weather-content" class="grid grid-cols-4 gap-4"></div>
    </div>

    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4"><div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-lg">thunderstorm</span></div><span id="weather-badge" class="text-xs font-bold text-outline bg-surface-container px-2 py-1 rounded-lg">Loading…</span></div>
        <p class="text-sm text-outline mb-1">Weather Alerts</p><p id="weather-alerts-count" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4"><div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><span class="material-symbols-outlined text-lg">trending_up</span></div><span id="market-badge" class="text-xs font-bold text-outline bg-surface-container px-2 py-1 rounded-lg">Loading…</span></div>
        <p class="text-sm text-outline mb-1">Crop Price</p><p id="market-price" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4"><div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary"><span class="material-symbols-outlined text-lg">water_drop</span></div></div>
        <p class="text-sm text-outline mb-1">Yield Impact Score</p><p id="yield-score" class="font-headline text-3xl font-black text-primary">—</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex justify-between items-start mb-4"><div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-lg">bar_chart</span></div></div>
        <p class="text-sm text-outline mb-1">Best Sell Window</p><p id="sell-window" class="font-headline text-xl font-black text-primary">—</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-headline text-lg font-bold text-primary">Weather & Risk Intelligence</h3>
          <span class="text-xs text-outline">District advisories</span>
        </div>
        <div id="weather-content" class="space-y-3"></div>
      </div>

      <div class="col-span-4 space-y-4">
        <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary-fixed text-sm">smart_toy</span><span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">Farm Assistant</span></div>
          <p class="text-sm font-medium mb-4 text-primary-fixed-dim">Ask about crop health, market planning, weather and schemes.</p>
          <a href="#/research" class="block w-full py-3 bg-white text-primary rounded-xl font-bold text-sm text-center hover:bg-primary-fixed transition-colors">Open Assistant →</a>
        </div>
        <a href="#/disease" class="block bg-error/10 border border-error/20 p-5 rounded-2xl hover:bg-error/15 transition-colors"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-error">coronavirus</span><div><p class="text-sm font-bold text-error">Disease Scanner</p><p class="text-xs text-on-surface-variant">Upload crop photo for diagnosis</p></div></div></a>
        <a href="#/market" class="block bg-secondary/10 border border-secondary/20 p-5 rounded-2xl hover:bg-secondary/15 transition-colors"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-secondary">store</span><div><p class="text-sm font-bold text-secondary">Market Intelligence</p><p class="text-xs text-on-surface-variant">Mandi price trends and forecasts</p></div></div></a>
      </div>

      <div class="col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2"><h3 class="font-headline text-lg font-bold text-primary">Market Snapshot</h3><span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">DISTRICT VIEW</span></div>
          <select id="dash-crop-select" class="px-3 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option value="Soybean">Soybean</option><option value="Cotton">Cotton</option><option value="Tur Dal">Tur Dal</option><option value="Onion">Onion</option><option value="Wheat">Wheat</option><option value="Rice">Rice</option>
          </select>
        </div>
        <div id="serper-market-content" class="space-y-3"></div>
      </div>

      <div class="col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4"><h3 class="font-headline text-lg font-bold text-primary">Agri Updates</h3><span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">LOCAL FEED</span></div>
        <div id="news-feed" class="space-y-3 max-h-80 overflow-y-auto no-scrollbar"></div>
      </div>

      <div class="col-span-12 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div class="flex items-center justify-between mb-6"><h3 class="font-headline text-lg font-bold text-primary">Market Price Forecast</h3><span class="text-xs text-outline">3-month planning window</span></div>
        <div id="market-forecast-content"></div>
      </div>
    </div>
  </main>`;
}

export function initDashboard() {
  const districtSel = document.getElementById('dash-district');
  const cropSel = document.getElementById('dash-crop-select');
  const refreshBtn = document.getElementById('refresh-dash');

  const severityMap = {
    high: 'bg-error/20 text-error',
    medium: 'bg-tertiary-fixed/40 text-tertiary',
    low: 'bg-primary-fixed/30 text-primary',
  };

  function loadLiveWeather(district) {
    const d = districtSnapshots[district] || districtSnapshots.Nanded;
    document.getElementById('live-weather-content').innerHTML = `
      <div class="p-3 bg-white/10 rounded-xl"><p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Location</p><p class="font-headline text-lg font-black">${district}, MH</p></div>
      <div class="p-3 bg-white/10 rounded-xl"><p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Current</p><p class="font-headline text-lg font-black">${d.temp}</p></div>
      <div class="p-3 bg-white/10 rounded-xl"><p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Humidity</p><p class="font-headline text-lg font-black">${d.humidity}</p></div>
      <div class="p-3 bg-white/10 rounded-xl"><p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Conditions</p><p class="text-sm leading-relaxed">${d.conditions}</p></div>`;
  }

  function loadWeather(district) {
    const d = districtSnapshots[district] || districtSnapshots.Nanded;
    document.getElementById('weather-alerts-count').textContent = `${d.alerts.length}`;
    document.getElementById('yield-score').textContent = `${d.yieldImpactScore}/100`;
    document.getElementById('weather-badge').textContent = district;

    document.getElementById('weather-content').innerHTML = d.alerts.map(a => `
      <div class="flex items-start gap-3 p-4 ${severityMap[a.severity] || 'bg-surface-container-low'} rounded-xl">
        <span class="material-symbols-outlined text-lg mt-0.5">warning</span>
        <div class="flex-1">
          <p class="text-xs font-bold uppercase tracking-wider mb-1">${a.type} • ${a.severity}</p>
          <p class="text-sm">${a.message}</p>
          <p class="text-xs opacity-70 mt-1">${a.timeframe}</p>
        </div>
      </div>`).join('') + `
      <div class="p-4 bg-secondary/10 rounded-xl border border-secondary/20 mt-3">
        <p class="text-xs font-bold text-secondary mb-1">💧 Irrigation Advice</p>
        <p class="text-sm text-on-surface">${d.irrigationAdvice}</p>
      </div>`;
  }

  function loadMarket(crop) {
    const m = cropSnapshots[crop] || cropSnapshots.Soybean;
    document.getElementById('market-price').textContent = `₹${m.currentPrice}`;
    document.getElementById('market-badge').textContent = m.trend;
    document.getElementById('sell-window').textContent = m.bestWindow;

    document.getElementById('serper-market-content').innerHTML = `
      <div class="p-4 bg-primary-fixed/20 rounded-xl border border-primary/20">
        <p class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Current Market Pulse</p>
        <p class="text-sm font-bold text-on-surface">${crop}: ₹${m.currentPrice}/quintal • Trend: ${m.trend}</p>
      </div>
      ${m.forecast.map((price, index) => `<div class="p-3 bg-surface-container-low rounded-xl flex items-center justify-between"><p class="text-sm font-medium text-on-surface">Month ${index + 1}</p><p class="text-sm font-black text-primary">₹${price}</p></div>`).join('')}
    `;

    document.getElementById('market-forecast-content').innerHTML = `
      <div class="grid grid-cols-3 gap-4 mb-4">
        ${m.forecast.map((price, index) => `<div class="p-4 bg-surface-container-low rounded-xl text-center"><p class="text-xs font-bold text-outline uppercase tracking-wider mb-2">Month ${index + 1}</p><p class="text-xl font-headline font-black text-primary">₹${price}</p><p class="text-xs text-outline">/quintal</p></div>`).join('')}
      </div>
      <div class="p-4 bg-primary-fixed/20 rounded-xl"><p class="text-xs font-bold text-primary mb-1">📊 Planning Note</p><p class="text-sm text-on-surface">Use staggered selling to reduce volatility risk and track mandi arrivals weekly.</p></div>`;
  }

  function loadFeed() {
    document.getElementById('news-feed').innerHTML = advisoryFeed.map(item => `
      <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-xs font-semibold text-primary">${item}</p></div>`).join('');
  }

  function loadAll() {
    const district = districtSel?.value || 'Nanded';
    const crop = cropSel?.value || 'Soybean';
    loadLiveWeather(district);
    loadWeather(district);
    loadMarket(crop);
    loadFeed();
  }

  districtSel?.addEventListener('change', loadAll);
  cropSel?.addEventListener('change', loadAll);
  refreshBtn?.addEventListener('click', loadAll);
  loadAll();
}
