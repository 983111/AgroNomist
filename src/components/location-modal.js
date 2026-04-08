import { userPrefs, setPrefs } from '../services/api.js';

export function renderLocationModal() {
  return `
    <div id="location-modal-backdrop" class="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300">
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div id="location-modal-panel" class="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/20 w-full max-w-md scale-95 transition-transform duration-300">
          <div class="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">public</span>
              <h2 class="font-headline text-xl font-bold text-primary">Global Settings</h2>
            </div>
            <button id="close-modal-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
              <span class="material-symbols-outlined text-outline">close</span>
            </button>
          </div>
          
          <form id="location-form" class="p-6 space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Country</label>
              <input type="text" id="modal-country" required class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary" placeholder="e.g. India, USA, Kenya" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">City / District</label>
                <input type="text" id="modal-city" required class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary" placeholder="e.g. Pune, Nairobi" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">State (Optional)</label>
                <input type="text" id="modal-state" class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary" placeholder="e.g. Maharashtra" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Language</label>
                <select id="modal-language" class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary">
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="sw">Swahili</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">Primary Crop</label>
                <input type="text" id="modal-crop" required class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-primary" placeholder="e.g. Wheat, Soybean" />
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3 bg-primary text-white rounded-xl font-bold font-headline hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">save</span> Apply & Reload Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initLocationModal() {
  const backdrop = document.getElementById('location-modal-backdrop');
  const panel = document.getElementById('location-modal-panel');
  const settingsBtn = document.getElementById('settings-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('location-form');

  const inCity = document.getElementById('modal-city');
  const inState = document.getElementById('modal-state');
  const inCountry = document.getElementById('modal-country');
  const inLanguage = document.getElementById('modal-language');
  const inCrop = document.getElementById('modal-crop');

  function openModal() {
    inCity.value = userPrefs.city || userPrefs.district || '';
    inState.value = userPrefs.state || '';
    inCountry.value = userPrefs.country || '';
    inLanguage.value = userPrefs.language || 'en';
    inCrop.value = userPrefs.crop || '';

    backdrop.classList.remove('hidden');
    // small delay to allow display:block to apply before transition
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
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }

  settingsBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    setPrefs({
      city: inCity.value.trim(),
      district: inCity.value.trim(),
      state: inState.value.trim(),
      country: inCountry.value.trim(),
      language: inLanguage.value,
      crop: inCrop.value.trim(),
    });
    
    // Update topbar visuals directly
    const locLabel = document.getElementById('topbar-location');
    if (locLabel) locLabel.textContent = [inCity.value.trim(), inCountry.value.trim()].filter(Boolean).join(', ');
    
    closeModal();
  });
}
