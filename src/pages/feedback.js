import { submitFeedback, userPrefs } from '../services/api.js';

export function renderFeedback() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter bg-background">
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-6">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Continuous Learning System</span>
          <div class="mt-1">
            <h2 class="font-headline text-3xl font-extrabold text-primary tracking-tight">Your Farm is the Teacher.</h2>
            <h2 class="font-headline text-3xl font-extrabold text-on-surface-variant tracking-tight">K2 v2 is the Student.</h2>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Model Accuracy</p>
          <p class="font-headline text-5xl font-black text-primary" id="model-accuracy">94.8%</p>
          <p class="text-xs text-primary flex items-center justify-end gap-1" id="accuracy-trend">
            <span class="material-symbols-outlined text-sm">trending_up</span> +2.1% this month
          </p>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-12 gap-5">
        <!-- LEFT: Log Harvest + Intelligence Growth -->
        <div class="col-span-5 space-y-5">

          <!-- Log Harvest Result -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-on-primary-container">edit_note</span>
              </div>
              <div>
                <h3 class="font-headline text-lg font-bold text-primary">Log Harvest Result</h3>
                <p class="text-xs text-outline">Feed real data to improve K2's predictions</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Total Weight (Tons)</label>
                <input id="fb-weight" type="number" step="0.1" min="0" placeholder="0.0"
                  class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Quality Grade (Brix)</label>
                <div class="flex gap-2" id="quality-grade-btns">
                  <button data-grade="Elite" class="grade-btn flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">Elite</button>
                  <button data-grade="Prime" class="grade-btn flex-1 py-2.5 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container transition-colors">Prime</button>
                  <button data-grade="Standard" class="grade-btn flex-1 py-2.5 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container transition-colors">Standard</button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Total Revenue ($)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-outline">$</span>
                  <input id="fb-revenue" type="number" placeholder="50,000"
                    class="w-full pl-8 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Actual Outcome Description <span class="text-error">*</span></label>
                <textarea id="fb-outcome" rows="3" placeholder="Describe what actually happened: yield quality, disease outcomes, market prices achieved..."
                  class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary/20" required></textarea>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1.5">Suggestion Type</label>
                <select id="fb-type" class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
                  <option value="soil">Soil / Fertilizer</option>
                  <option value="experiment">Experiment / Method</option>
                  <option value="market">Market / Selling</option>
                  <option value="disease">Disease Treatment</option>
                  <option value="weather">Weather Advisory</option>
                  <option value="irrigation">Irrigation Schedule</option>
                </select>
              </div>

              <div id="fb-error" class="hidden p-3 bg-error/10 border border-error/20 rounded-xl text-sm text-error font-medium"></div>

              <button id="submit-fb" class="w-full py-3.5 bg-primary text-white rounded-xl font-headline font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
                <span class="material-symbols-outlined text-sm">upload</span> Submit Feedback Loop
              </button>
            </div>
          </div>

          <!-- Intelligence Growth -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-headline text-base font-bold text-primary">Intelligence Growth</h3>
                <p class="text-sm text-on-surface-variant mt-1" id="intel-growth-text">
                  K2 v2 has processed 42 new soil data points from your last harvest, improving nitrogen prediction by 14%.
                </p>
              </div>
            </div>
            <!-- Growth bar chart -->
            <div class="flex items-end gap-1.5 h-20 mt-4">
              ${Array(8).fill(0).map((_, i) => {
                const h = 20 + (i * 8) + (i > 5 ? 20 : 0);
                const isRecent = i >= 6;
                return `<div class="flex-1 rounded-t-sm ${isRecent ? 'bg-primary' : 'bg-surface-container-high'} transition-all" style="height:${h}%"></div>`;
              }).join('')}
            </div>
            <div class="mt-3 flex items-center gap-2">
              <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Learning Progress</p>
              <span class="text-xs font-black text-primary">Level 12 / Master</span>
            </div>
          </div>
        </div>

        <!-- CENTER: Soil Sensei + Prediction Fidelity -->
        <div class="col-span-3 space-y-5">
          <!-- Soil Sensei -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div class="flex flex-col items-center text-center mb-4">
              <div class="w-16 h-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-tertiary text-3xl" style="font-variation-settings:'FILL' 1">emoji_events</span>
              </div>
              <h3 class="font-headline text-xl font-bold text-primary" id="achievement-title">Soil Sensei</h3>
              <p class="text-xs text-on-surface-variant mt-2 leading-relaxed" id="achievement-desc">
                You've provided enough feedback to calibrate the K2 sensor array for Block 4B perfectly.
              </p>
            </div>
            <div class="h-px bg-outline-variant/20 mb-4"></div>
            <div class="flex items-center gap-2 text-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-sm text-primary">lock_open</span>
              <span class="font-bold" id="achievement-date">UNLOCKED FEB 12</span>
              <span class="material-symbols-outlined text-outline text-sm ml-auto">chevron_right</span>
            </div>
          </div>

          <!-- Prediction Fidelity -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Prediction Fidelity</p>
            <div class="space-y-4" id="prediction-fidelity">
              ${fidelityRow('Yield Estimation', 98)}
              ${fidelityRow('Sugar Concentration', 91, 'bg-error')}
            </div>
          </div>

          <!-- K2 Response (shows after submission) -->
          <div id="fb-response" class="hidden bg-primary text-white p-5 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-fixed">psychology</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Analysis</span>
            </div>
            <div id="fb-response-content" class="text-sm text-primary-fixed-dim leading-relaxed space-y-2"></div>
          </div>
        </div>

        <!-- RIGHT: Intelligence Timeline -->
        <div class="col-span-4">
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 h-full">
            <div class="flex items-center justify-between mb-5">
              <h3 class="font-headline text-base font-bold text-primary">Intelligence Timeline</h3>
              <div class="flex gap-2">
                <button id="btn-all-entries" class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold">ALL ENTRIES</button>
                <button id="btn-high-variance" class="px-3 py-1.5 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors">HIGH VARIANCE</button>
              </div>
            </div>

            <div id="timeline-content" class="space-y-4">
              <!-- Timeline entries populated by JS -->
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="mt-8 flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary-container text-sm">lab_profile</span>
          </div>
          <div>
            <p class="text-xs font-bold text-primary">AgriIntel K2 v2.4.1</p>
            <p class="text-[10px] text-outline">NEURAL CORE ONLINE • SYNCED WITH FIELD ARRAY</p>
          </div>
        </div>
        <div class="flex gap-4">
          <button onclick="alert('Exporting learning log...')" class="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Export Learning Log</button>
          <button onclick="alert('Neural calibration initiated...')" class="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Neural Calibration</button>
        </div>
      </div>
    </div>
  </main>`;
}

function fidelityRow(label, pct, barClass = 'bg-primary') {
  return `
    <div>
      <div class="flex justify-between mb-1.5">
        <span class="text-sm text-on-surface">${label}</span>
        <span class="text-sm font-bold text-primary">${pct}% Match</span>
      </div>
      <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div class="${barClass} h-full rounded-full" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function renderTimelineEntry(entry) {
  const isSuccess = entry.variance === 'low';
  const isHigh = entry.variance === 'high';
  return `
    <div class="border border-outline-variant/10 rounded-xl overflow-hidden">
      <div class="flex items-center gap-3 p-4">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isHigh ? 'bg-error/20' : 'bg-secondary/10'}">
          <span class="w-3 h-3 rounded-full ${isHigh ? 'bg-error' : 'bg-secondary'} block"></span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold text-outline uppercase tracking-wider">${entry.period}</p>
          <p class="text-sm font-bold text-primary leading-tight">${entry.title}</p>
        </div>
      </div>
      <div class="px-4 pb-3 grid grid-cols-2 gap-2 bg-surface-container-low/50">
        <div>
          <p class="text-[10px] text-outline uppercase">AI PREDICTION</p>
          <p class="text-sm font-bold text-on-surface-variant">${entry.predicted}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] text-outline uppercase">ACTUAL RESULT</p>
          <p class="text-sm font-bold ${isHigh ? 'text-error' : 'text-on-surface'}">${entry.actual}</p>
        </div>
      </div>
      <div class="px-4 pb-4 pt-2">
        <blockquote class="text-xs text-on-surface-variant italic border-l-2 border-outline-variant/30 pl-3 leading-relaxed">
          "${entry.note}"
        </blockquote>
      </div>
    </div>`;
}

const TIMELINE_ENTRIES = [
  {
    period: 'HARVEST CYCLE: AUTUMN 2023',
    title: 'Block 7 - Syrah Yield',
    predicted: '12.4 t/ha',
    actual: '12.2 t/ha',
    variance: 'low',
    note: 'K2 accurately predicted the late-season heat stress impact. Model adjusted irrigation parameters for next cycle.'
  },
  {
    period: 'DISEASE ANALYSIS: JUL 2023',
    title: 'Mildew Outbreak Sensitivity',
    predicted: 'Low Risk',
    actual: 'Moderate',
    variance: 'high',
    note: 'Variance caused by localized micro-climate moisture K2 sensors missed. User manual override applied. System learning local humidity patterns.'
  },
  {
    period: 'MARKET FORECAST: MAY 2023',
    title: 'Cotton Price Prediction',
    predicted: '₹8,200/q',
    actual: '₹8,450/q',
    variance: 'low',
    note: 'Price exceeded prediction by 3.1% due to export demand surge. Model updated with trade data sources.'
  }
];

export function initFeedback() {
  let selectedGrade = 'Elite';
  let showHighVariance = false;

  // Grade button selection
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGrade = btn.dataset.grade;
      document.querySelectorAll('.grade-btn').forEach(b => {
        b.className = b.dataset.grade === selectedGrade
          ? 'grade-btn flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity'
          : 'grade-btn flex-1 py-2.5 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container transition-colors';
      });
    });
  });

  // Timeline filter
  function renderTimeline(highVarianceOnly) {
    const entries = highVarianceOnly ? TIMELINE_ENTRIES.filter(e => e.variance === 'high') : TIMELINE_ENTRIES;
    const el = document.getElementById('timeline-content');
    if (el) el.innerHTML = entries.map(renderTimelineEntry).join('');
  }

  document.getElementById('btn-all-entries')?.addEventListener('click', () => {
    showHighVariance = false;
    renderTimeline(false);
    document.getElementById('btn-all-entries').className = 'px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold';
    document.getElementById('btn-high-variance').className = 'px-3 py-1.5 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors';
  });

  document.getElementById('btn-high-variance')?.addEventListener('click', () => {
    showHighVariance = true;
    renderTimeline(true);
    document.getElementById('btn-high-variance').className = 'px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold';
    document.getElementById('btn-all-entries').className = 'px-3 py-1.5 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors';
  });

  // Submit feedback
  document.getElementById('submit-fb')?.addEventListener('click', async () => {
    const outcome = document.getElementById('fb-outcome')?.value?.trim();
    const weight = document.getElementById('fb-weight')?.value;
    const revenue = document.getElementById('fb-revenue')?.value;
    const errEl = document.getElementById('fb-error');

    if (!outcome) {
      errEl.textContent = 'Please describe the actual outcome.';
      errEl.classList.remove('hidden');
      return;
    }
    errEl.classList.add('hidden');

    const btn = document.getElementById('submit-fb');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Submitting to K2…';

    try {
      const data = await submitFeedback({
        suggestionType: document.getElementById('fb-type')?.value,
        actualOutcome: outcome,
        crop: userPrefs.crop,
        district: userPrefs.district || userPrefs.city,
        additionalContext: `Grade: ${selectedGrade}, Weight: ${weight}t, Revenue: $${revenue}`
      });

      // Update timeline with new entry
      const newEntry = {
        period: `HARVEST CYCLE: ${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}`,
        title: `${userPrefs.crop || 'Crop'} - ${selectedGrade} Grade`,
        predicted: 'K2 prediction',
        actual: weight ? `${weight}t` : outcome.substring(0, 20),
        variance: data.accuracyAssessment === 'accurate' ? 'low' : 'high',
        note: data.learningNote || 'Feedback submitted and processed by K2.'
      };
      TIMELINE_ENTRIES.unshift(newEntry);
      renderTimeline(showHighVariance);

      // Show K2 response
      const respEl = document.getElementById('fb-response');
      const contEl = document.getElementById('fb-response-content');
      const accMap = { accurate: '✅ Accurate', 'partially-accurate': '⚠️ Partially Accurate', inaccurate: '❌ Inaccurate' };
      contEl.innerHTML = `
        <p class="font-bold text-white mb-2">${accMap[data.accuracyAssessment] || data.accuracyAssessment}</p>
        ${data.gap ? `<p><span class="font-bold text-primary-fixed">Gap: </span>${data.gap}</p>` : ''}
        ${data.revisedRecommendation ? `<p class="mt-2"><span class="font-bold text-primary-fixed">Revised advice: </span>${data.revisedRecommendation}</p>` : ''}
        ${data.learningNote ? `<p class="mt-2 text-primary-fixed-dim">${data.learningNote}</p>` : ''}`;
      respEl.classList.remove('hidden');

      // Update accuracy
      const accuracyEl = document.getElementById('model-accuracy');
      if (accuracyEl && data.accuracyAssessment === 'accurate') {
        const current = parseFloat(accuracyEl.textContent) || 94.8;
        accuracyEl.textContent = `${Math.min(99.9, current + 0.1).toFixed(1)}%`;
      }

      // Clear form
      document.getElementById('fb-outcome').value = '';
      document.getElementById('fb-weight').value = '';
      document.getElementById('fb-revenue').value = '';

    } catch (e) {
      errEl.textContent = `Error: ${e.message}`;
      errEl.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-sm">upload</span> Submit Feedback Loop';
    }
  });

  // Render initial timeline
  renderTimeline(false);

  // Update prediction fidelity based on actual model accuracy
  const fidelityEl = document.getElementById('prediction-fidelity');
  if (fidelityEl) {
    fidelityEl.innerHTML = [
      fidelityRow('Yield Estimation', 98),
      fidelityRow('Sugar Concentration', 91, 'bg-error'),
      fidelityRow('Disease Prediction', 87, 'bg-secondary'),
    ].join('');
  }
}
