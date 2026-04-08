/**
 * AgriIntel K2 — API Service Layer
 * All requests pass location + language context for global support.
 */

const WORKER_URL = 'https://agriintel-worker.vishwajeetadkine705.workers.dev';
const RESEARCH_ASSISTANT_URL = 'https://researchassistant.vishwajeetadkine705.workers.dev';
const LAB_WORKER_URL = 'https://lab.vishwajeetadkine705.workers.dev';

// ─── Location & Language Store ────────────────────────────────────────────────

export const userPrefs = {
  city:     'Nanded',
  district: 'Nanded',
  state:    'Maharashtra',
  country:  'India',
  language: 'en',
  crop:     'Soybean',
};

export function setPrefs(patch) {
  Object.assign(userPrefs, patch);
  try { localStorage.setItem('agriintel_prefs', JSON.stringify(userPrefs)); } catch {}
  window.dispatchEvent(new CustomEvent('prefs-changed', { detail: userPrefs }));
}

export function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem('agriintel_prefs') || '{}');
    Object.assign(userPrefs, saved);
  } catch {}
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

async function post(path, body, baseUrl = WORKER_URL) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res;
}

// Inject common locale fields into every request
function withLocale(body) {
  return {
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
    ...body,
  };
}

// ─── K2 Endpoints ─────────────────────────────────────────────────────────────

export async function streamChat(message, context = '', language, mode = 'default') {
  const res = await post('/api/chat', withLocale({
    message,
    context,
    language: language || userPrefs.language,
    mode,
    location: [userPrefs.city, userPrefs.district, userPrefs.country].filter(Boolean).join(', '),
  }), RESEARCH_ASSISTANT_URL);
  return res.body;
}

export async function analyzeDisease({ base64Image, mimeType, crop }) {
  // Send full locale context so GLM/K2 know the farm location
  const res = await post('/api/analyze', {
    base64Image,
    mimeType,
    crop:     crop || userPrefs.crop || '',
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getMarketData({ crop, landAcres } = {}) {
  const res = await post('/api/market', withLocale({ crop: crop || userPrefs.crop, landAcres }));
  return res.json();
}

export async function runExperiment({ crop, soil, district, rainfall }) {
  const res = await post('/api/experiment', withLocale({ crop, soil, district, rainfall }), LAB_WORKER_URL);
  return res.json();
}

export async function getSoilIntelligence({ soilData, crop, season } = {}) {
  const res = await post('/api/soil', withLocale({ soilData, crop, season }));
  return res.json();
}

export async function getRecommendations({ state, season, soilType, farmSize, ph, n, p, k, rainfall, temperature } = {}) {
  const res = await post('/api/recommendations', withLocale({
    state: state || userPrefs.state,
    season,
    soilType,
    farmSize,
    soilData: { pH: ph, nitrogen: n, phosphorus: p, potassium: k },
    rainfall,
    temperature,
  }));
  return res.json();
}

export async function getWeatherRisk({ crop } = {}) {
  const res = await post('/api/weather', withLocale({ crop: crop || userPrefs.crop }));
  return res.json();
}

export async function getCommunityInsights({ crop, myYield, myPractices } = {}) {
  const res = await post('/api/community', withLocale({ crop: crop || userPrefs.crop, myYield, myPractices }));
  return res.json();
}

export async function getMarketplace({ query, category, budget } = {}) {
  const res = await post('/api/marketplace', withLocale({ query, category, budget }));
  return res.json();
}

export async function submitFeedback({ suggestionType, originalSuggestion, actualOutcome, crop }) {
  const res = await post('/api/feedback', withLocale({ suggestionType, originalSuggestion, actualOutcome, crop }));
  return res.json();
}

// ─── Serper Real-Time Endpoints ───────────────────────────────────────────────

export async function getSerperWeather() {
  const res = await post('/api/serper/weather', {
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperMarket({ crop } = {}) {
  const res = await post('/api/serper/market', {
    crop:     crop || userPrefs.crop,
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperNews({ crop, topic } = {}) {
  const res = await post('/api/serper/news', {
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    crop,
    topic,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperPlaces({ query, category } = {}) {
  const res = await post('/api/serper/places', {
    query,
    category,
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}
