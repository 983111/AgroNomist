/**
 * AgriIntel K2 — Local Authentication
 * Handles: sign up, sign in, session management, onboarding (localStorage only)
 */

const STORAGE_KEYS = {
  USERS: 'agriintel_users_v1',
  SESSION: 'agriintel_session_v1',
  PREFS: 'agriintel_prefs',
};

let currentUser = null;

function makeId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readJSON(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
  writeJSON(STORAGE_KEYS.USERS, users);
}

function getSessionData() {
  return readJSON(STORAGE_KEYS.SESSION, null);
}

function setSessionData(session) {
  writeJSON(STORAGE_KEYS.SESSION, session);
}

function clearSessionData() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
}

function loadProfilePrefs(profile) {
  const prefs = {
    city: profile.city || profile.district || '',
    district: profile.district || profile.city || '',
    state: profile.state || '',
    country: profile.country || '',
    language: profile.language || 'en',
    crop: profile.primary_crop || '',
    farmSize: profile.farm_size_acres || 5,
    fullName: profile.full_name || '',
  };
  localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
}

export async function getUser() {
  const session = getSessionData();
  if (!session?.user) return null;
  currentUser = session.user;
  return currentUser;
}

export async function getSession() {
  return getSessionData();
}

export async function signOut() {
  clearSessionData();
  currentUser = null;
  window.location.href = '/auth.html';
}

export function renderAuth() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>AgriIntel K2 — Sign In</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <style>
      body { font-family: 'Inter', sans-serif; }
      .font-headline { font-family: 'Manrope', sans-serif; }
      .fade-in { animation: fadeIn 0.4s ease-out both; }
      @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
    </style>
  </head>
  <body class="min-h-screen bg-[#f0f4f0] flex items-center justify-center p-4">
    <div id="auth-root" class="w-full max-w-md"></div>
    <script type="module">
      import { initAuth } from '/src/auth.js';
      initAuth();
    </script>
  </body>
  </html>
  `;
}

function getAuthHTML(mode = 'signin') {
  const isSignIn = mode === 'signin';
  const isSignUp = mode === 'signup';
  const isOnboard = mode === 'onboard';
  const isForgot = mode === 'forgot';

  if (isOnboard) {
    return `
    <div class="bg-white rounded-3xl shadow-xl p-8 fade-in">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-[#123b2a] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings:'FILL' 1">agriculture</span>
        </div>
        <h1 class="font-headline text-2xl font-black text-[#123b2a]">Setup Your Farm Profile</h1>
        <p class="text-sm text-gray-500 mt-1">Tell us about your farm so we can personalize intelligence</p>
      </div>

      <form id="onboard-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Full Name</label>
            <input id="ob-name" type="text" required placeholder="Your name"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Phone (optional)</label>
            <input id="ob-phone" type="tel" placeholder="+1 234 567 8900"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Country</label>
          <input id="ob-country" type="text" required placeholder="e.g. India, USA, Kenya, Brazil"
            class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">State / Province</label>
            <input id="ob-state" type="text" placeholder="e.g. Maharashtra, California"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">City / District</label>
            <input id="ob-city" type="text" required placeholder="Your city or district"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Primary Crop</label>
            <input id="ob-crop" type="text" required placeholder="e.g. Wheat, Corn, Soybean"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Farm Size (acres)</label>
            <input id="ob-farm-size" type="number" min="0.5" step="0.5" placeholder="e.g. 5"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Language</label>
          <select id="ob-lang" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none">
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="sw">Swahili (Kiswahili)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="id">Indonesian (Bahasa Indonesia)</option>
            <option value="vi">Vietnamese (Tiếng Việt)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="tr">Turkish (Türkçe)</option>
            <option value="ha">Hausa</option>
            <option value="yo">Yoruba</option>
            <option value="am">Amharic (አማርኛ)</option>
          </select>
        </div>

        <div id="ob-error" class="hidden p-3 bg-red-50 rounded-xl text-sm text-red-600 font-medium"></div>

        <button type="submit" id="ob-btn"
          class="w-full py-4 bg-[#123b2a] text-white rounded-xl font-headline font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">rocket_launch</span>
          Launch AgriIntel Dashboard
        </button>
      </form>
    </div>`;
  }

  if (isForgot) {
    return `
    <div class="bg-white rounded-3xl shadow-xl p-8 fade-in">
      <button id="back-to-signin" class="flex items-center gap-2 text-sm text-gray-500 hover:text-[#123b2a] mb-6 transition-colors">
        <span class="material-symbols-outlined text-base">arrow_back</span> Back to Sign In
      </button>
      <h1 class="font-headline text-2xl font-black text-[#123b2a] mb-2">Reset Password</h1>
      <p class="text-sm text-gray-500 mb-6">Local mode: password reset by email is unavailable.</p>
      <form id="forgot-form" class="space-y-4">
        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Email Address</label>
          <input id="forgot-email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/>
        </div>
        <div id="forgot-error" class="hidden p-3 bg-red-50 rounded-xl text-sm text-red-600 font-medium"></div>
        <div id="forgot-success" class="hidden p-3 bg-green-50 rounded-xl text-sm text-green-700 font-medium"></div>
        <button type="submit" id="forgot-btn"
          class="w-full py-4 bg-[#123b2a] text-white rounded-xl font-headline font-bold hover:opacity-90 transition-opacity">
          Show Recovery Help
        </button>
      </form>
    </div>`;
  }

  return `
  <div class="bg-white rounded-3xl shadow-xl overflow-hidden fade-in">
    <div class="bg-gradient-to-br from-[#123b2a] to-[#2a5240] p-8 text-white">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1">agriculture</span>
        </div>
        <div>
          <h1 class="font-headline text-xl font-black">AgriIntel K2</h1>
          <p class="text-xs text-white/70">Global Precision Agriculture AI</p>
        </div>
      </div>
      <p class="text-white/80 text-sm">5-agent AI system for smarter farming decisions, worldwide.</p>
    </div>

    <div class="flex border-b border-gray-100">
      <button data-tab="signin" class="tab-btn flex-1 py-4 text-sm font-bold transition-colors ${isSignIn ? 'text-[#123b2a] border-b-2 border-[#123b2a]' : 'text-gray-400 hover:text-gray-600'}">Sign In</button>
      <button data-tab="signup" class="tab-btn flex-1 py-4 text-sm font-bold transition-colors ${isSignUp ? 'text-[#123b2a] border-b-2 border-[#123b2a]' : 'text-gray-400 hover:text-gray-600'}">Create Account</button>
    </div>

    <div class="p-8">
      <form id="signin-form" class="space-y-4 ${isSignIn ? '' : 'hidden'}">
        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Email Address</label>
          <input id="signin-email" type="email" required placeholder="you@example.com" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none transition-all"/>
        </div>
        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Password</label>
          <div class="relative">
            <input id="signin-password" type="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none transition-all pr-12"/>
            <button type="button" id="toggle-signin-pw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><span class="material-symbols-outlined text-lg">visibility</span></button>
          </div>
        </div>
        <div class="flex justify-end"><button type="button" id="forgot-pw-btn" class="text-xs text-[#123b2a] hover:underline font-medium">Forgot password?</button></div>
        <div id="signin-error" class="hidden p-3 bg-red-50 rounded-xl text-sm text-red-600 font-medium"></div>
        <button type="submit" id="signin-btn" class="w-full py-4 bg-[#123b2a] text-white rounded-xl font-headline font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><span class="material-symbols-outlined text-sm">login</span>Sign In to Dashboard</button>
      </form>

      <form id="signup-form" class="space-y-4 ${isSignUp ? '' : 'hidden'}">
        <div><label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Email Address</label><input id="signup-email" type="email" required placeholder="you@example.com" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/></div>
        <div>
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Password</label>
          <div class="relative">
            <input id="signup-password" type="password" required placeholder="Minimum 8 characters" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none pr-12"/>
            <button type="button" id="toggle-signup-pw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><span class="material-symbols-outlined text-lg">visibility</span></button>
          </div>
          <div id="pw-strength" class="mt-1.5 flex gap-1">${['', '', '', ''].map((_, i) => `<div data-bar="${i}" class="h-1 flex-1 rounded-full bg-gray-200 transition-all"></div>`).join('')}</div>
        </div>
        <div><label class="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Confirm Password</label><input id="signup-confirm" type="password" required placeholder="Repeat password" class="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#123b2a]/20 outline-none"/></div>
        <div id="signup-error" class="hidden p-3 bg-red-50 rounded-xl text-sm text-red-600 font-medium"></div>
        <button type="submit" id="signup-btn" class="w-full py-4 bg-[#123b2a] text-white rounded-xl font-headline font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><span class="material-symbols-outlined text-sm">person_add</span>Create Free Account</button>
      </form>
    </div>
  </div>`;
}

export async function initAuth() {
  const root = document.getElementById('auth-root');
  if (!root) return;

  const session = await getSession();
  if (session?.user && session?.profile?.onboarding_complete) {
    window.location.href = '/';
    return;
  }

  renderMode(session?.user ? 'onboard' : 'signin');

  function renderMode(mode) {
    root.innerHTML = getAuthHTML(mode);
    attachHandlers(mode);
  }

  function attachHandlers(mode) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => renderMode(btn.dataset.tab));
    });

    ['signin', 'signup'].forEach((prefix) => {
      const toggle = document.getElementById(`toggle-${prefix}-pw`);
      const input = document.getElementById(`${prefix}-password`);
      toggle?.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        toggle.querySelector('.material-symbols-outlined').textContent =
          input.type === 'password' ? 'visibility' : 'visibility_off';
      });
    });

    const pwInput = document.getElementById('signup-password');
    pwInput?.addEventListener('input', () => {
      const val = pwInput.value;
      const score = [val.length >= 8, /[A-Z]/.test(val), /[0-9]/.test(val), /[^A-Za-z0-9]/.test(val)].filter(Boolean).length;
      const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
      document.querySelectorAll('[data-bar]').forEach((bar, i) => {
        bar.className = `h-1 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-gray-200'}`;
      });
    });

    document.getElementById('forgot-pw-btn')?.addEventListener('click', () => renderMode('forgot'));
    document.getElementById('back-to-signin')?.addEventListener('click', () => renderMode('signin'));

    document.getElementById('forgot-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();
      const errEl = document.getElementById('forgot-error');
      const sucEl = document.getElementById('forgot-success');
      errEl.classList.add('hidden');
      sucEl.classList.add('hidden');
      const userExists = getUsers().some((user) => user.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        errEl.textContent = 'No local account found for that email.';
        errEl.classList.remove('hidden');
        return;
      }
      sucEl.textContent = 'Local mode active: create a new account with a new email if password is lost.';
      sucEl.classList.remove('hidden');
    });

    document.getElementById('signin-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim().toLowerCase();
      const password = document.getElementById('signin-password').value;
      const errEl = document.getElementById('signin-error');
      const btn = document.getElementById('signin-btn');
      errEl.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing in…';

      const user = getUsers().find((item) => item.email.toLowerCase() === email && item.password === password);
      if (!user) {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">login</span> Sign In to Dashboard';
        errEl.textContent = 'Invalid email or password.';
        errEl.classList.remove('hidden');
        return;
      }

      const cleanUser = sanitizeUser(user);
      currentUser = cleanUser;
      setSessionData({ user: cleanUser, profile: user.profile || null });

      if (user.profile?.onboarding_complete) {
        loadProfilePrefs(user.profile);
        window.location.href = '/';
      } else {
        renderMode('onboard');
      }
    });

    document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      const errEl = document.getElementById('signup-error');
      const btn = document.getElementById('signup-btn');
      errEl.classList.add('hidden');

      if (password !== confirm) {
        errEl.textContent = 'Passwords do not match.';
        errEl.classList.remove('hidden');
        return;
      }
      if (password.length < 8) {
        errEl.textContent = 'Password must be at least 8 characters.';
        errEl.classList.remove('hidden');
        return;
      }
      if (getUsers().some((item) => item.email.toLowerCase() === email)) {
        errEl.textContent = 'This email is already registered.';
        errEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating account…';

      const user = {
        id: makeId(),
        email,
        password,
        created_at: new Date().toISOString(),
        profile: null,
      };
      const users = getUsers();
      users.push(user);
      saveUsers(users);

      const cleanUser = sanitizeUser(user);
      currentUser = cleanUser;
      setSessionData({ user: cleanUser, profile: null });

      renderMode('onboard');
    });

    document.getElementById('onboard-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('ob-btn');
      const errEl = document.getElementById('ob-error');
      errEl.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Setting up your farm…';

      const sessionData = getSessionData();
      if (!sessionData?.user?.id) {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">rocket_launch</span> Launch AgriIntel Dashboard';
        errEl.textContent = 'Session expired. Please sign in again.';
        errEl.classList.remove('hidden');
        return;
      }

      const profileData = {
        id: sessionData.user.id,
        full_name: document.getElementById('ob-name').value.trim(),
        phone: document.getElementById('ob-phone').value.trim(),
        country: document.getElementById('ob-country').value.trim(),
        state: document.getElementById('ob-state').value.trim(),
        city: document.getElementById('ob-city').value.trim(),
        district: document.getElementById('ob-city').value.trim(),
        primary_crop: document.getElementById('ob-crop').value.trim(),
        farm_size_acres: parseFloat(document.getElementById('ob-farm-size').value) || 5,
        language: document.getElementById('ob-lang').value,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      };

      const users = getUsers();
      const userIndex = users.findIndex((item) => item.id === sessionData.user.id);
      if (userIndex === -1) {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">rocket_launch</span> Launch AgriIntel Dashboard';
        errEl.textContent = 'Account not found. Please sign in again.';
        errEl.classList.remove('hidden');
        return;
      }

      users[userIndex] = { ...users[userIndex], profile: profileData };
      saveUsers(users);
      setSessionData({ user: sanitizeUser(users[userIndex]), profile: profileData });
      loadProfilePrefs(profileData);
      window.location.href = '/';
    });
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    window.location.href = '/auth.html';
    return null;
  }

  const user = getUsers().find((item) => item.id === session.user.id);
  if (!user?.profile?.onboarding_complete) {
    window.location.href = '/auth.html';
    return null;
  }

  loadProfilePrefs(user.profile);
  return { user: sanitizeUser(user), profile: user.profile };
}

export async function updateProfile(updates) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const users = getUsers();
  const userIndex = users.findIndex((item) => item.id === session.user.id);
  if (userIndex === -1) return { data: null, error: { message: 'User not found' } };

  const existingProfile = users[userIndex].profile || {};
  const profile = {
    ...existingProfile,
    ...updates,
    id: session.user.id,
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  };

  users[userIndex] = { ...users[userIndex], profile };
  saveUsers(users);
  setSessionData({ user: sanitizeUser(users[userIndex]), profile });
  loadProfilePrefs(profile);

  return { data: profile, error: null };
}
