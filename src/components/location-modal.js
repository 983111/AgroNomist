/**
 * AgriIntel K2 — Global Location Modal (no hardcoded countries/districts)
 * Users type their own location for any country on Earth.
 */
import { userPrefs, setPrefs } from '../services/api.js';

export function renderLocationModal() {
  return `
    <div id="location-modal-backdrop" class="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300">
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div id="location-modal-panel" class="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/20 w-full max-w-lg scale-95 transition-transform duration-300">
          <div class="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">public</span>
              <h2 class="font-headline text-xl font-bold text-primary">Global Farm Settings</h2>
              <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">🌍 ANY LOCATION</span>
            </div>
            <button id="close-modal-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
              <span class="material-symbols-outlined text-outline">close</span>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Country — free text, truly global -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Country</label>
              <input type="text" id="modal-country" required
                class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary"
                placeholder="e.g. India, USA, Kenya, Brazil, Indonesia, Nigeria…"/>
              <p class="text-[10px] text-outline mt-1">Any country on Earth — AI adapts automatically</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">State / Province / Region</label>
                <input type="text" id="modal-state"
                  class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary"
                  placeholder="e.g. Maharashtra, California, Punjab…"/>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">City / District / Village</label>
                <input type="text" id="modal-city" required
                  class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary"
                  placeholder="e.g. Nanded, Nairobi, São Paulo…"/>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Language</label>
                <select id="modal-language" class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary">
                  <option value="en">🇺🇸 English</option>
                  <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                  <option value="mr">🇮🇳 Marathi (मराठी)</option>
                  <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                  <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
                  <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                  <option value="gu">🇮🇳 Gujarati (ગુજરાતી)</option>
                  <option value="pa">🇮🇳 Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="bn">🇧🇩 Bengali (বাংলা)</option>
                  <option value="ur">🇵🇰 Urdu (اردو)</option>
                  <option value="es">🇪🇸 Spanish (Español)</option>
                  <option value="fr">🇫🇷 French (Français)</option>
                  <option value="pt">🇧🇷 Portuguese (Português)</option>
                  <option value="sw">🇰🇪 Swahili (Kiswahili)</option>
                  <option value="ha">🇳🇬 Hausa</option>
                  <option value="yo">🇳🇬 Yoruba</option>
                  <option value="am">🇪🇹 Amharic (አማርኛ)</option>
                  <option value="id">🇮🇩 Indonesian (Bahasa)</option>
                  <option value="vi">🇻🇳 Vietnamese (Tiếng Việt)</option>
                  <option value="th">🇹🇭 Thai (ภาษาไทย)</option>
                  <option value="zh">🇨🇳 Chinese (中文)</option>
                  <option value="ja">🇯🇵 Japanese (日本語)</option>
                  <option value="ko">🇰🇷 Korean (한국어)</option>
                  <option value="ar">🇸🇦 Arabic (العربية)</option>
                  <option value="tr">🇹🇷 Turkish (Türkçe)</option>
                  <option value="de">🇩🇪 German (Deutsch)</option>
                  <option value="it">🇮🇹 Italian (Italiano)</option>
                  <option value="nl">🇳🇱 Dutch (Nederlands)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Primary Crop</label>
                <input type="text" id="modal-crop" required
                  class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary"
                  placeholder="e.g. Wheat, Corn, Coffee, Cassava…"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Farm Size (acres)</label>
              <input type="number" id="modal-farm-size" min="0.1" step="0.5"
                class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary"
                placeholder="e.g. 5"/>
            </div>

            <!-- Location Preview -->
            <div id="location-preview" class="hidden p-3 bg-primary-fixed/20 rounded-xl">
              <p class="text-xs font-bold text-primary">📍 Your farm location:</p>
              <p id="location-preview-text" class="text-sm text-on-surface mt-0.5"></p>
            </div>

            <button type="button" id="save-location-btn" class="w-full py-3 bg-primary text-white rounded-xl font-bold font-headline hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">save</span> Apply & Reload Intelligence
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initLocationModal() {
  const backdrop  = document.getElementById('location-modal-backdrop');
  const panel     = document.getElementById('location-modal-panel');
  const settingsBtn = document.getElementById('settings-btn');
  const closeBtn  = document.getElementById('close-modal-btn');
  const saveBtn   = document.getElementById('save-location-btn');
  const preview   = document.getElementById('location-preview');
  const previewText = document.getElementById('location-preview-text');

  const inCity     = document.getElementById('modal-city');
  const inState    = document.getElementById('modal-state');
  const inCountry  = document.getElementById('modal-country');
  const inLanguage = document.getElementById('modal-language');
  const inCrop     = document.getElementById('modal-crop');
  const inFarmSize = document.getElementById('modal-farm-size');

  // Live location preview
  function updatePreview() {
    const parts = [inCity?.value?.trim(), inState?.value?.trim(), inCountry?.value?.trim()].filter(Boolean);
    if (parts.length > 0) {
      previewText.textContent = parts.join(', ');
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  }

  [inCity, inState, inCountry].forEach(el => el?.addEventListener('input', updatePreview));

  function openModal() {
    inCity.value     = userPrefs.city     || userPrefs.district || '';
    inState.value    = userPrefs.state    || '';
    inCountry.value  = userPrefs.country  || '';
    inLanguage.value = userPrefs.language || 'en';
    inCrop.value     = userPrefs.crop     || '';
    inFarmSize.value = userPrefs.farmSize || '';
    updatePreview();

    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      panel.classList.remove('scale-95');
      panel.classList.add('scale-100');
    });
  }

  function closeModal() {
    backdrop.classList.add('opacity-0');
    panel.classList.remove('scale-100');
    panel.classList.add('scale-95');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }

  settingsBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  saveBtn?.addEventListener('click', () => {
    const country = inCountry.value.trim();
    const city    = inCity.value.trim();
    if (!country || !city) {
      alert('Please enter at least your country and city/district.');
      return;
    }

    setPrefs({
      city:     city,
      district: city,
      state:    inState.value.trim(),
      country:  country,
      language: inLanguage.value,
      crop:     inCrop.value.trim(),
      farmSize: parseFloat(inFarmSize.value) || 5,
    });

    // Update topbar display
    const locLabel = document.getElementById('topbar-location');
    if (locLabel) locLabel.textContent = [city, country].filter(Boolean).join(', ');

    // Update language badge
    const langBadge = document.getElementById('topbar-lang');
    if (langBadge) langBadge.textContent = inLanguage.value;

    closeModal();
  });
}
