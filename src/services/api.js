const WORKER_URL = 'https://agriintel-worker.vishwajeetadkine705.workers.dev';

async function post(path, body) {
  const res = await fetch(`${WORKER_URL}${path}`, {
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

// Streaming chat — returns the EventSource-like readable stream
export async function streamChat(message, context = '', language = 'en', mode = 'default') {
  const res = await post('/api/chat', { message, context, language, mode });
  return res.body;
}

export async function analyzeDisease({ base64Image, mimeType, crop, language = 'en' }) {
  const res = await post('/api/analyze', { base64Image, mimeType, crop, language });
  return res.json();
}

export async function getMarketData({ crop, district, landAcres }) {
  const res = await post('/api/market', { crop, district, landAcres });
  return res.json();
}

export async function runExperiment({ crop, soil, rainfall, district, compareMethod }) {
  const res = await post('/api/experiment', { crop, soil, rainfall, district, compareMethod });
  return res.json();
}

export async function getSoilIntelligence({ district, soilData, crop, season }) {
  const res = await post('/api/soil', { district, soilData, crop, season });
  return res.json();
}

export async function getWeatherRisk({ district, crop, currentWeatherData }) {
  const res = await post('/api/weather', { district, crop, currentWeatherData });
  return res.json();
}

export async function getCommunityInsights({ district, crop, myYield, myPractices }) {
  const res = await post('/api/community', { district, crop, myYield, myPractices });
  return res.json();
}

export async function getMarketplace({ query, category, district, budget }) {
  const res = await post('/api/marketplace', { query, category, district, budget });
  return res.json();
}

export async function submitFeedback({ suggestionType, originalSuggestion, actualOutcome, crop, district }) {
  const res = await post('/api/feedback', { suggestionType, originalSuggestion, actualOutcome, crop, district });
  return res.json();
}
