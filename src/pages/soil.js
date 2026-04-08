import { getSoilIntelligence, getSerperNews, getSerperPlaces } from '../services/api.js';

export function renderSoil() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Crop & Soil Intelligence</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Soil Analyzer</h2>
        </div>
      </div>

      <!-- Input Form -->
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
        <h3 class="font-headline text-base font-bold text-primary mb-4">Enter Farm Details</h3>
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">District</label>
            <select id="soil-district" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Nanded</option><option>Nashik</option><option>Pune</option><option>Latur</option>
              <option>Aurangabad</option><option>Amravati</option><option>Akola</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Target Crop</label>
            <select id="soil-crop" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option value="">Auto recommend</option>
              <option>Soybean</option><option>Cotton</option><option>Wheat</option><option>Rice</option>
              <option>Tur Dal</option><option>Onion</option><option>Pomegranate</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Season</label>
            <select id="soil-season" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
              <option>Kharif</option><option>Rabi</option><option>Zaid</option>
            </select>
          </div>
          <div class="flex items-end">
            <button id="analyze-soil" class="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">science</span> Analyze Soil
            </button>
          </div>
        </div>
        <!-- Optional sensor data -->
        <details class="group">
          <summary class="text-xs font-bold text-secondary cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-sm group-open:rotate-90 transition-transform">chevron_right</span>
            Add Manual / Sensor Soil Data (optional)
          </summary>
          <div class="mt-3 grid grid-cols-4 gap-3">
            ${[
              ['pH', 'soil-ph', '6.5'],
              ['Nitrogen (mg/kg)', 'soil-n', ''],
              ['Phosphorus (mg/kg)', 'soil-p', ''],
              ['Potassium (mg/kg)', 'soil-k', ''],
            ].map(([label, id, placeholder]) => `
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">${label}</label>
                <input id="${id}" type="number" placeholder="${placeholder}" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20"/>
              </div>`).join('')}
          </div>
        </details>
      </div>

      <!-- Crop Intelligence News -->
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Crop Intelligence News</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">GOOGLE NEWS</span>
        </div>
        <div id="crop-news" class="grid grid-cols-4 gap-4">
          ${[1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('')}
        </div>
      </div>

      <!-- Nearby Soil Testing Labs -->
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 mb-8">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="font-headline text-lg font-bold text-primary">Nearby Soil Testing Labs</h3>
          <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">GOOGLE PLACES</span>
        </div>
        <div id="soil-labs" class="grid grid-cols-3 gap-4">
          ${[1,2,3].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-32"></div>`).join('')}
        </div>
      </div>

      <!-- Loading -->
      <div id="soil-loading" class="hidden py-20 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="font-bold text-primary">Analyzing soil intelligence…</p>
      </div>

      <!-- Results -->
      <div id="soil-results">
        <div class="py-12 text-center text-outline">
          <span class="material-symbols-outlined text-5xl mb-3 block">layers</span>
          <p class="font-bold">Enter your farm details and click Analyze Soil</p>
        </div>
      </div>
    </div>
  </main>`;
}

function renderStars(rating) {
  if (!rating) return '';
  const full = Math.floor(rating);
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (rating % 1 >= 0.5) stars += '½';
  return stars;
}

export function initSoil() {
  function getDistrict() {
    return document.getElementById('soil-district')?.value || 'Nanded';
  }
  function getCrop() {
    return document.getElementById('soil-crop')?.value || '';
  }

  // ─── Crop News from Serper ─────────────────────────────────
  async function loadCropNews() {
    const container = document.getElementById('crop-news');
    container.innerHTML = [1,2,3,4].map(() => `<div class="p-3 bg-surface-container-low rounded-xl animate-pulse h-24"></div>`).join('');
    const district = getDistrict();
    const crop = getCrop();
    try {
      const data = await getSerperNews({
        district,
        crop: crop || undefined,
        topic: 'soil crop agriculture farming advisory',
      });
      if (data.news?.length) {
        container.innerHTML = data.news.slice(0, 4).map(n => `
          <a href="${n.link}" target="_blank" rel="noopener" class="block p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group">
            ${n.imageUrl ? `<img src="${n.imageUrl}" class="w-full h-20 rounded-lg object-cover mb-2" alt="" onerror="this.style.display='none'"/>` : ''}
            <p class="text-xs font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">${n.title}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-[10px] text-outline">${n.source || ''}</span>
              <span class="text-[10px] text-outline">•</span>
              <span class="text-[10px] text-outline">${n.date || ''}</span>
            </div>
          </a>`).join('');
      } else {
        container.innerHTML = '<p class="text-sm text-outline col-span-4">No crop news available.</p>';
      }
    } catch {
      container.innerHTML = '<p class="text-sm text-error col-span-4">News unavailable.</p>';
    }
  }

  // ─── Nearby Soil Testing Labs from Serper ──────────────────
  async function loadSoilLabs() {
    const container = document.getElementById('soil-labs');
    container.innerHTML = [1,2,3].map(() => `<div class="p-4 bg-surface-container-low rounded-xl animate-pulse h-32"></div>`).join('');
    const district = getDistrict();
    try {
      const data = await getSerperPlaces({ district, category: 'soil-testing' });
      if (data.places?.length) {
        container.innerHTML = data.places.slice(0, 6).map(p => `
          <div class="bg-surface-container-low p-4 rounded-xl hover:shadow-md transition-shadow">
            <div class="flex items-start gap-3 mb-2">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary text-sm">biotech</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-primary line-clamp-1">${p.title}</h4>
                ${p.rating ? `<div class="flex items-center gap-1 mt-0.5"><span class="text-xs font-bold text-primary">${p.rating}</span><span class="text-[10px] text-yellow-600">${renderStars(p.rating)}</span>${p.reviews ? `<span class="text-[10px] text-outline">(${p.reviews})</span>` : ''}</div>` : ''}
              </div>
            </div>
            ${p.address ? `<p class="text-xs text-on-surface-variant mb-2 line-clamp-2"><span class="material-symbols-outlined text-[10px] mr-1">location_on</span>${p.address}</p>` : ''}
            <div class="flex gap-2">
              ${p.phone ? `<a href="tel:${p.phone}" class="flex-1 py-1.5 bg-secondary/10 text-secondary rounded-lg text-[10px] font-bold text-center hover:bg-secondary/20 transition-colors">Call</a>` : ''}
              ${p.cid ? `<a href="https://www.google.com/maps?cid=${p.cid}" target="_blank" rel="noopener" class="flex-1 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold text-center hover:bg-primary/20 transition-colors">Maps</a>` : ''}
            </div>
          </div>`).join('');
      } else {
        container.innerHTML = '<p class="text-sm text-outline col-span-3">No soil testing labs found nearby. Try selecting a different district.</p>';
      }
    } catch {
      container.innerHTML = '<p class="text-sm text-error col-span-3">Could not load nearby labs.</p>';
    }
  }

  // ─── AI Soil Analysis ──────────────────────────────────────
  document.getElementById('analyze-soil')?.addEventListener('click', async () => {
    const district = getDistrict();
    const crop = getCrop();
    const season = document.getElementById('soil-season')?.value;
    const ph = document.getElementById('soil-ph')?.value;
    const n = document.getElementById('soil-n')?.value;
    const p = document.getElementById('soil-p')?.value;
    const k = document.getElementById('soil-k')?.value;
    const soilData = (ph || n || p || k) ? { pH: ph, nitrogen: n, phosphorus: p, potassium: k } : undefined;

    document.getElementById('soil-loading').classList.remove('hidden');
    document.getElementById('soil-results').innerHTML = '';

    try {
      const data = await getSoilIntelligence({ district, soilData, crop, season });
      document.getElementById('soil-loading').classList.add('hidden');
      const sp = data.soilProfile || {};
      const fp = data.fertilizerPlan || {};

      document.getElementById('soil-results').innerHTML = `
        <div class="grid grid-cols-12 gap-6">
          <!-- Soil Profile -->
          <div class="col-span-5 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-4">Soil Profile</h3>
            <div class="space-y-3 mb-4">
              ${[
                ['Soil Type', sp.type],
                ['pH Range', sp.ph],
                ['Organic Carbon', sp.organicCarbon],
              ].map(([l, v]) => `
                <div class="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span class="text-sm text-outline">${l}</span>
                  <span class="text-sm font-bold text-on-surface">${v || '—'}</span>
                </div>`).join('')}
            </div>
            ${sp.majorDeficiencies?.length ? `
              <div class="mb-4">
                <p class="text-[10px] font-bold text-error uppercase tracking-wider mb-2">Major Deficiencies</p>
                <div class="flex flex-wrap gap-2">
                  ${sp.majorDeficiencies.map(d => `<span class="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-lg">${d}</span>`).join('')}
                </div>
              </div>` : ''}
            ${sp.suitableCrops?.length ? `
              <div>
                <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Suitable Crops</p>
                <div class="flex flex-wrap gap-2">
                  ${sp.suitableCrops.map(c => `<span class="px-2 py-1 bg-primary-fixed/30 text-primary text-xs font-bold rounded-lg">${c}</span>`).join('')}
                </div>
              </div>` : ''}
            ${data.districtInsights ? `
              <div class="mt-4 p-3 bg-surface-container-low rounded-xl">
                <p class="text-xs text-on-surface-variant leading-relaxed">${data.districtInsights}</p>
              </div>` : ''}
          </div>

          <!-- Fertilizer Plan -->
          <div class="col-span-7 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-4">Fertilizer Plan</h3>
            ${fp.basalDose?.length ? `
              <div class="mb-4">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Basal Dose (At Sowing)</p>
                <div class="space-y-2">
                  ${fp.basalDose.map(f => `
                    <div class="flex items-center gap-3 p-3 bg-primary-fixed/10 rounded-xl text-sm">
                      <span class="material-symbols-outlined text-primary text-base">compost</span>
                      <span class="font-medium flex-1">${f.fertilizer}</span>
                      <span class="font-bold text-primary">${f.quantity}</span>
                    </div>`).join('')}
                </div>
              </div>` : ''}
            ${fp.topDress?.length ? `
              <div class="mb-4">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Top Dressing</p>
                <div class="space-y-2">
                  ${fp.topDress.map(f => `
                    <div class="flex items-center gap-3 p-3 bg-secondary-fixed/20 rounded-xl text-sm">
                      <span class="material-symbols-outlined text-secondary text-base">eco</span>
                      <span class="font-medium flex-1">${f.fertilizer}</span>
                      <span class="font-bold text-secondary">${f.quantity}</span>
                      <span class="text-xs text-outline">${f.timing}</span>
                    </div>`).join('')}
                </div>
              </div>` : ''}
            ${data.organicAlternatives ? `
              <div class="p-3 bg-tertiary-fixed/30 rounded-xl">
                <p class="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Organic Alternative</p>
                <p class="text-xs text-on-surface-variant">${data.organicAlternatives}</p>
              </div>` : ''}
          </div>

          <!-- Seasonal Calendar -->
          ${data.seasonalCalendar?.length ? `
          <div class="col-span-12 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-4">Seasonal Activity Calendar</h3>
            <div class="grid grid-cols-4 gap-3">
              ${data.seasonalCalendar.map((item, i) => `
                <div class="p-4 bg-surface-container-low rounded-xl border-t-4 border-primary" style="border-top-color: hsl(${(i * 40) % 360}, 50%, 35%)">
                  <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1">${item.month}</p>
                  <p class="text-sm font-medium text-on-surface mb-1">${item.activity}</p>
                  <p class="text-xs text-outline">${item.inputs || ''}</p>
                </div>`).join('')}
            </div>
          </div>` : ''}
        </div>
      `;
    } catch (e) {
      document.getElementById('soil-loading').classList.add('hidden');
      document.getElementById('soil-results').innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  });

  // Reload serper data on district change
  document.getElementById('soil-district')?.addEventListener('change', () => {
    loadCropNews();
    loadSoilLabs();
  });

  // Initial load of serper data
  loadCropNews();
  loadSoilLabs();
}
