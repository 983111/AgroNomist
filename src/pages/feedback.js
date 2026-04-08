import { submitFeedback } from '../services/api.js';

export function renderFeedback() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Continuous Learning System</span>
          <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Feedback Loop</h2>
          <p class="text-on-surface-variant mt-1">Verify AI suggestions against real-world outcomes. Your data makes the model smarter.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">AI Accuracy</p>
          <p class="font-headline text-3xl font-black text-primary">94.2%</p>
          <p class="text-xs text-primary mt-1">+2.4% this season</p>
        </div>
        <div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Verified Predictions</p>
          <p class="font-headline text-3xl font-black text-primary">1,247</p>
          <div class="mt-2 h-1.5 bg-surface-container-high rounded-full"><div class="bg-primary h-full" style="width:78%"></div></div>
        </div>
        <div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Contributions</p>
          <p class="font-headline text-3xl font-black text-primary">3,842</p>
          <p class="text-xs text-secondary mt-1">From 847 farmers</p>
        </div>
        <div class="bg-primary text-white p-5 rounded-xl shadow-lg">
          <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-1">Model Version</p>
          <p class="font-headline text-3xl font-black">K2 v2</p>
          <p class="text-xs text-primary-fixed-dim mt-1">MBZUAI K2-Think-v2</p>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <!-- Form -->
        <div class="col-span-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary-container">edit_note</span>
            </div>
            <div>
              <h3 class="font-headline text-xl font-bold text-primary">Log Outcome & Verify AI</h3>
              <p class="text-xs text-outline">Tell K2 how the suggestion worked in reality</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Suggestion Type</label>
                <select id="fb-type" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                  <option value="soil">Soil / Fertilizer</option>
                  <option value="experiment">Experiment / Method</option>
                  <option value="market">Market / Selling</option>
                  <option value="disease">Disease Treatment</option>
                  <option value="weather">Weather Advisory</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Crop</label>
                <select id="fb-crop" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                  <option>Soybean</option><option>Cotton</option><option>Wheat</option><option>Rice</option>
                  <option>Tur Dal</option><option>Onion</option><option>Pomegranate</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">District</label>
                <select id="fb-district" class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary/20">
                  <option>Nanded</option><option>Nashik</option><option>Pune</option><option>Latur</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Original AI Suggestion (optional)</label>
                <textarea id="fb-original" rows="3" placeholder="Paste the AI suggestion here..." class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 resize-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Actual Outcome <span class="text-error">*</span></label>
                <textarea id="fb-outcome" rows="4" placeholder="Describe what actually happened: yield, quality, effectiveness of treatment, actual market price..." class="w-full bg-surface-container-low border-none rounded-xl text-sm py-2.5 px-3 resize-none focus:ring-2 focus:ring-primary/20" required></textarea>
              </div>
              <button id="submit-fb" class="w-full py-4 bg-primary text-white rounded-xl font-headline font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">upload</span> Submit Feedback to K2
              </button>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="col-span-4 space-y-4">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 class="font-headline text-base font-bold text-primary mb-4">Season Performance</h3>
            <div class="space-y-3">
              ${[
                { season: 'Kharif 2024', pred: '12.4', actual: '11.8', acc: '95.2', color: 'primary' },
                { season: 'Rabi 2023-24', pred: '10.2', actual: '10.8', acc: '94.1', color: 'secondary' },
                { season: 'Kharif 2023', pred: '9.8', actual: '8.4', acc: '85.7', color: 'tertiary' },
              ].map(s => `
                <div class="p-4 bg-surface-container-low rounded-xl">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-${s.color} uppercase tracking-wider">${s.season}</span>
                    <span class="text-[10px] font-bold text-outline">${s.acc}%</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="bg-surface-container-lowest p-2 rounded-lg">
                      <p class="text-[10px] text-outline uppercase">Predicted</p>
                      <p class="text-sm font-headline font-black text-${s.color}">${s.pred}</p>
                    </div>
                    <div class="bg-surface-container-lowest p-2 rounded-lg">
                      <p class="text-[10px] text-outline uppercase">Actual</p>
                      <p class="text-sm font-headline font-black text-on-surface">${s.actual}</p>
                    </div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
          <div id="fb-response" class="hidden bg-primary text-white p-6 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-fixed">psychology</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">K2 Analysis</span>
            </div>
            <div id="fb-response-content" class="text-sm text-primary-fixed-dim leading-relaxed space-y-2"></div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

export function initFeedback() {
  document.getElementById('submit-fb')?.addEventListener('click', async () => {
    const outcome = document.getElementById('fb-outcome')?.value?.trim();
    if (!outcome) { alert('Please describe the actual outcome.'); return; }

    const btn = document.getElementById('submit-fb');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Submitting…';

    try {
      const data = await submitFeedback({
        suggestionType: document.getElementById('fb-type')?.value,
        originalSuggestion: document.getElementById('fb-original')?.value || '',
        actualOutcome: outcome,
        crop: document.getElementById('fb-crop')?.value,
        district: document.getElementById('fb-district')?.value,
      });

      const respEl = document.getElementById('fb-response');
      const contEl = document.getElementById('fb-response-content');
      const accMap = { accurate: '✅ Accurate', 'partially-accurate': '⚠️ Partially Accurate', inaccurate: '❌ Inaccurate' };
      contEl.innerHTML = `
        <p class="font-bold text-white mb-2">${accMap[data.accuracyAssessment] || data.accuracyAssessment}</p>
        ${data.gap ? `<p><span class="font-bold">Gap: </span>${data.gap}</p>` : ''}
        ${data.revisedRecommendation ? `<p class="mt-2"><span class="font-bold">Revised advice: </span>${data.revisedRecommendation}</p>` : ''}
        ${data.learningNote ? `<p class="mt-2 text-primary-fixed-dim">${data.learningNote}</p>` : ''}
      `;
      respEl.classList.remove('hidden');
      document.getElementById('fb-outcome').value = '';
      document.getElementById('fb-original').value = '';
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-sm">upload</span> Submit Feedback to K2';
    }
  });
}
