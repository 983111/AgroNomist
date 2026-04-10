import { analyzeDisease, userPrefs } from '../services/api.js';

export function renderDisease() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-12 gap-8 items-start">
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <div class="flex justify-between items-end">
            <div>
              <span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Diagnostic Module</span>
              <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Disease Detection</h2>
              <p class="text-xs text-outline mt-1">GLM-4V vision → K2 agronomic reasoning</p>
            </div>
            <div class="flex gap-2">
              <input id="disease-crop" type="text" placeholder="Your Crop" value="${userPrefs.crop || ''}" class="px-3 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-32">
            </div>
          </div>

          <!-- Upload Zone -->
          <div id="upload-zone" class="group relative overflow-hidden bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-primary/50 hover:bg-surface-container-low min-h-[320px] cursor-pointer">
            <div id="upload-content">
              <div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-on-primary text-3xl">upload_file</span>
              </div>
              <h3 class="font-headline text-xl font-bold text-primary mb-2">Upload Crop Image</h3>
              <p class="text-outline text-sm max-w-sm mb-6">Take a clear photo of the affected plant leaf, stem, or fruit for AI diagnosis</p>
              <div class="flex gap-3 justify-center">
                <label class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity text-sm">
                  Browse Files
                  <input type="file" id="image-upload" accept="image/*" class="hidden">
                </label>
                <label class="px-6 py-2.5 bg-surface-container border border-outline-variant font-bold rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors text-sm text-on-surface">
                  Take Photo
                  <input type="file" id="camera-upload" accept="image/*" capture="environment" class="hidden">
                </label>
              </div>
            </div>
            <div id="preview-content" class="hidden w-full">
              <img id="preview-img" class="max-h-48 mx-auto rounded-2xl shadow-lg mb-4 object-contain" />
              <p id="preview-name" class="text-sm text-outline mb-3"></p>
              <div class="flex gap-3 justify-center">
                <button id="analyze-btn" class="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">biotech</span> Analyze with K2 AI
                </button>
                <button id="clear-image" class="px-6 py-3 bg-surface-container border border-outline-variant font-bold rounded-xl hover:bg-surface-container-high text-sm">Clear</button>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div id="disease-results" class="hidden space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div id="result-diagnosis" class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-l-4 border-primary">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Diagnosis</p>
                <p class="font-headline text-lg font-extrabold text-primary" id="diag-text">—</p>
              </div>
              <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-l-4 border-secondary">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Confidence</p>
                <p class="font-headline text-lg font-extrabold text-primary" id="conf-text">—</p>
              </div>
              <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border-l-4 border-tertiary">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Severity (1-10)</p>
                <p class="font-headline text-lg font-extrabold text-tertiary" id="sev-text">—</p>
              </div>
            </div>

            <!-- Pipeline badge -->
            <div id="pipeline-badge" class="hidden flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-xs text-outline border border-outline-variant/20">
              <span class="material-symbols-outlined text-sm text-secondary">account_tree</span>
              <span id="pipeline-text"></span>
            </div>

            <!-- GLM visual observation (collapsible) -->
            <details id="glm-observation-block" class="hidden bg-secondary/5 border border-secondary/20 rounded-2xl">
              <summary class="px-5 py-3 cursor-pointer text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">visibility</span>
                GLM-4V Visual Observation Report
                <span class="ml-auto text-[10px] text-outline font-normal">Click to expand</span>
              </summary>
              <div id="glm-observation-text" class="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap font-mono"></div>
            </details>

            <!-- GLM error notice -->
            <div id="glm-error-notice" class="hidden p-4 bg-error/10 border border-error/20 rounded-xl">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-error text-sm">warning</span>
                <p class="text-xs font-bold text-error uppercase tracking-wider">Vision Stage Failed</p>
              </div>
              <p class="text-xs text-on-surface-variant" id="glm-error-text"></p>
              <p class="text-xs text-outline mt-1">Diagnosis below is based on crop type and location only — accuracy may be lower. Please re-upload a clearer photo.</p>
            </div>

            <div id="treatment-content" class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm prose-sm max-w-none"></div>
          </div>

          <!-- Loading -->
          <div id="disease-loading" class="hidden p-8 bg-surface-container-lowest rounded-2xl shadow-sm">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              <div>
                <p class="font-bold text-primary" id="loading-stage">Stage 1: GLM-4V analysing image…</p>
                <p class="text-sm text-outline mt-0.5">Checking for diseases, pests &amp; nutrient deficiencies</p>
              </div>
            </div>
            <div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div id="loading-bar" class="h-full bg-primary rounded-full transition-all duration-700" style="width:20%"></div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <div class="bg-surface-container-low p-6 rounded-2xl">
            <h3 class="font-headline text-base font-bold text-primary mb-4">How to get best results</h3>
            <div class="space-y-3">
              ${[
                ['photo_camera','Take close-up photos of affected leaves'],
                ['wb_sunny','Shoot in natural daylight'],
                ['center_focus_strong','Keep the damaged area in focus'],
                ['multiple_stop','Multiple angles help accuracy'],
              ].map(([icon, tip]) => `
                <div class="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-base">${icon}</span>
                  <span>${tip}</span>
                </div>`).join('')}
            </div>
          </div>

          <!-- Pipeline explanation -->
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-secondary text-base">account_tree</span>
              <h3 class="font-headline text-sm font-bold text-primary">AI Pipeline</h3>
            </div>
            <div class="space-y-3 text-xs text-on-surface-variant">
              <div class="flex items-start gap-3 p-3 bg-secondary/5 rounded-xl">
                <span class="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p class="font-bold text-secondary">GLM-4V — Visual Observer</p>
                  <p class="mt-0.5">Examines the image and describes symptoms: colours, textures, patterns, affected area.</p>
                </div>
              </div>
              <div class="flex items-center justify-center text-outline">
                <span class="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
              <div class="flex items-start gap-3 p-3 bg-primary/5 rounded-xl">
                <span class="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p class="font-bold text-primary">K2-Think — Agronomic Reasoner</p>
                  <p class="mt-0.5">Reads the visual report and diagnoses disease, severity, causal agent, treatment plan.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-primary text-white p-6 rounded-2xl shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-fixed">emergency</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">Urgency Guide</span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-error flex-shrink-0"></span><span>Severity 8-10: Treat immediately</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></span><span>Severity 4-7: Act within 48h</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-primary-fixed flex-shrink-0"></span><span>Severity 1-3: Monitor weekly</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

function parseMarkdownBasic(md) {
  return md
    .replace(/## (.+)/g, '<h2 class="text-base font-bold text-primary mt-4 mb-2">$1</h2>')
    .replace(/### (.+)/g, '<h3 class="text-sm font-bold text-secondary mt-3 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n- (.+)/g, '<li class="ml-4 list-disc text-sm text-on-surface-variant">$1</li>')
    .replace(/\n\d+\. (.+)/g, '<li class="ml-4 list-decimal text-sm text-on-surface-variant">$1</li>')
    .replace(/\n/g, '<br>');
}

function extractInfo(text) {
  const diagMatch = text.match(/## Diagnosis\s*\n+([\s\S]+?)(?=##|$)/);
  const confMatch = text.match(/## Confidence Level\s*\n+([\s\S]+?)(?=##|$)/);
  const sevMatch  = text.match(/## Severity Score[^#\n]*\n+([\s\S]+?)(?=##|$)/);
  return {
    diagnosis:  diagMatch?.[1]?.trim().split('\n')[0] || 'See full report',
    confidence: confMatch?.[1]?.trim().split('\n')[0] || '—',
    severity:   sevMatch?.[1]?.trim().match(/\d+/)?.[0]  || '—',
  };
}

export function initDisease() {
  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('upload-content').classList.add('hidden');
      document.getElementById('preview-content').classList.remove('hidden');
      document.getElementById('preview-img').src = e.target.result;
      document.getElementById('preview-name').textContent = file.name;
      // Reset results from previous analysis
      document.getElementById('disease-results').classList.add('hidden');
      document.getElementById('glm-error-notice').classList.add('hidden');
      document.getElementById('glm-observation-block').classList.add('hidden');
      document.getElementById('pipeline-badge').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('image-upload')?.addEventListener('change',  e => handleFile(e.target.files[0]));
  document.getElementById('camera-upload')?.addEventListener('change', e => handleFile(e.target.files[0]));

  document.getElementById('clear-image')?.addEventListener('click', () => {
    document.getElementById('upload-content').classList.remove('hidden');
    document.getElementById('preview-content').classList.add('hidden');
    document.getElementById('disease-results').classList.add('hidden');
    document.getElementById('glm-error-notice').classList.add('hidden');
    document.getElementById('glm-observation-block').classList.add('hidden');
    document.getElementById('pipeline-badge').classList.add('hidden');
    document.getElementById('image-upload').value = '';
  });

  document.getElementById('analyze-btn')?.addEventListener('click', async () => {
    const img = document.getElementById('preview-img');
    if (!img.src) return;

    // Reset UI
    document.getElementById('disease-results').classList.add('hidden');
    document.getElementById('glm-error-notice').classList.add('hidden');
    document.getElementById('glm-observation-block').classList.add('hidden');
    document.getElementById('pipeline-badge').classList.add('hidden');
    document.getElementById('disease-loading').classList.remove('hidden');

    // Animate loading bar: stage 1 (GLM) → stage 2 (K2)
    const loadingStage = document.getElementById('loading-stage');
    const loadingBar   = document.getElementById('loading-bar');
    loadingStage.textContent = 'Stage 1: GLM-4V analysing image…';
    loadingBar.style.width = '20%';
    const stageTimer = setTimeout(() => {
      loadingStage.textContent = 'Stage 2: K2 applying agronomic reasoning…';
      loadingBar.style.width = '65%';
    }, 3500);

    try {
      const response = await fetch(img.src);
      const blob     = await response.blob();
      const reader   = new FileReader();

      reader.onloadend = async () => {
        const base64   = reader.result.split(',')[1];
        const mimeType = blob.type;
        const crop     = document.getElementById('disease-crop')?.value || '';

        clearTimeout(stageTimer);
        loadingBar.style.width = '90%';

        try {
          const data = await analyzeDisease({ base64Image: base64, mimeType, crop });

          loadingBar.style.width = '100%';
          document.getElementById('disease-loading').classList.add('hidden');

          // ── Populate KPI cards ──
          const info = extractInfo(data.result || '');
          document.getElementById('diag-text').textContent = info.diagnosis;
          document.getElementById('conf-text').textContent = info.confidence;
          document.getElementById('sev-text').textContent  = info.severity;

          // ── Pipeline badge ──
          if (data.pipeline) {
            document.getElementById('pipeline-text').textContent = `Pipeline: ${data.pipeline}`;
            document.getElementById('pipeline-badge').classList.remove('hidden');
          }

          // ── GLM visual observation (show only if GLM succeeded) ──
          if (data.visualObservation && !data.glmError) {
            document.getElementById('glm-observation-text').textContent = data.visualObservation;
            document.getElementById('glm-observation-block').classList.remove('hidden');
          }

          // ── GLM error notice ──
          if (data.glmError) {
            document.getElementById('glm-error-text').textContent = `GLM error: ${data.glmError}`;
            document.getElementById('glm-error-notice').classList.remove('hidden');
          }

          // ── Full diagnosis report ──
          document.getElementById('treatment-content').innerHTML = parseMarkdownBasic(data.result || '');
          document.getElementById('disease-results').classList.remove('hidden');

        } catch (e) {
          clearTimeout(stageTimer);
          document.getElementById('disease-loading').classList.add('hidden');
          document.getElementById('treatment-content').innerHTML =
            `<p class="text-error text-sm font-bold">Error: ${e.message}</p>`;
          document.getElementById('disease-results').classList.remove('hidden');
        }
      };

      reader.readAsDataURL(blob);
    } catch (e) {
      clearTimeout(stageTimer);
      document.getElementById('disease-loading').classList.add('hidden');
      alert('Failed to process image: ' + e.message);
    }
  });
}
