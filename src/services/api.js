/**
 * AgriIntel K2 — API Service Layer v4.0
 * Global support. All requests pass location + language context.
 * New: multi-agent, what-if, autonomous mode endpoints.
 */

const WORKER_URL = 'https://agriintel.vishwajeetadkine705.workers.dev';

// ─── Global Location & Language Store ────────────────────────────────────────

export const userPrefs = {
  city:     '',
  district: '',
  state:    '',
  country:  '',
  language: 'en',
  crop:     '',
  farmSize: 5,
  fullName: '',
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

function withLocale(body) {
  return {
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
    ...body,
  };
}

// ─── K2 / Multi-Agent Endpoints ───────────────────────────────────────────────

export async function streamChat(message, context = '', language, mode = 'default') {
  const res = await post('/api/chat', withLocale({
    message, context,
    language: language || userPrefs.language,
    mode,
    location: [userPrefs.city || userPrefs.district, userPrefs.state, userPrefs.country].filter(Boolean).join(', '),
  }));
  return res.body;
}

export async function analyzeDisease({ base64Image, mimeType, crop }) {
  const res = await post('/api/analyze', {
    base64Image, mimeType,
    crop:     crop || userPrefs.crop || '',
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function runMultiAgent({ crop, soil, rainfall, temperature, season, objective, agents } = {}) {
  const res = await post('/api/multiagent', withLocale({
    crop:        crop        || userPrefs.crop,
    soil,
    rainfall,
    temperature,
    season,
    objective,
    agents:      agents      || ['all'],
  }));
  return res.json();
}

export async function runAutonomous({ crop, soil, rainfall, temperature, farmSize, budget, constraints, objective } = {}) {
  const res = await post('/api/autonomous', withLocale({
    crop:        crop        || userPrefs.crop,
    soil,
    rainfall,
    temperature,
    farmSize:    farmSize    || userPrefs.farmSize,
    budget,
    constraints,
    objective,
  }));
  return res.json();
}

export async function runWhatIf({ scenario, crop, currentStrategy } = {}) {
  const res = await post('/api/whatif', withLocale({
    scenario,
    crop:            crop || userPrefs.crop,
    currentStrategy,
    location: [userPrefs.city || userPrefs.district, userPrefs.state, userPrefs.country].filter(Boolean).join(', '),
  }));
  return res.json();
}

export async function getMarketData({ crop, landAcres } = {}) {
  const res = await post('/api/market', withLocale({ crop: crop || userPrefs.crop, landAcres }));
  return res.json();
}

export async function runExperiment({ crop, soil, district, rainfall }) {
  const res = await post('/api/experiment', withLocale({ crop, soil, district, rainfall }));
  return res.json();
}

export async function getSoilIntelligence({ soilData, crop, season } = {}) {
  const res = await post('/api/soil', withLocale({ soilData, crop, season }));
  return res.json();
}


export async function getSoilIntelligenceDashboard({
  state, district, season, soilType, farmSize, rainfall, temperature, soilData,
} = {}) {
  const res = await post('/api/recommendations', {
    district: district || userPrefs.district || userPrefs.city,
    state: state || userPrefs.state,
    country: userPrefs.country,
    language: userPrefs.language,
    season: season || 'kharif',
    soilType: soilType || '',
    farmSize: farmSize || userPrefs.farmSize || 5,
    soilData: soilData || { pH: 6.8, nitrogen: 42, phosphorus: 18, potassium: 245 },
    rainfall: rainfall || 800,
    temperature: temperature || 25,
  });
  return res.json();
}

export async function getRecommendations({
  state, district, season, soilType, farmSize,
  soilData, rainfall, temperature,
} = {}) {
  const res = await post('/api/recommendations', {
    district:    district    || userPrefs.district || userPrefs.city,
    state:       state       || userPrefs.state,
    country:     userPrefs.country,
    language:    userPrefs.language,
    season:      season      || 'kharif',
    soilType:    soilType    || '',
    farmSize:    farmSize    || userPrefs.farmSize || 5,
    soilData:    soilData    || { pH: 6.5, nitrogen: 50, phosphorus: 40, potassium: 60 },
    rainfall:    rainfall    || 800,
    temperature: temperature || 25,
  });
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
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperMarket({ crop } = {}) {
  const res = await post('/api/serper/market', {
    crop:     crop || userPrefs.crop,
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperNews({ crop, topic } = {}) {
  const res = await post('/api/serper/news', {
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    crop, topic,
    language: userPrefs.language,
  });
  return res.json();
}

export async function getSerperPlaces({ query, category } = {}) {
  const res = await post('/api/serper/places', {
    query, category,
    district: userPrefs.district || userPrefs.city,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
  });
  return res.json();
}
