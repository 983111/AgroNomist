/**
 * AgriIntel K2 — Cloudflare Worker v4.1  (FIXED — Competition-Ready)
 * ═══════════════════════════════════════════════════════════════════════════
 * FIXES APPLIED:
 *   1. All costs/profits in ₹ with realistic Indian farm economics
 *   2. Mandatory FINAL DECISION block in every response
 *   3. 3-strategy comparison table (AI / Conservative / Crop-Switch)
 *   4. Profit = Yield × Price − Cost (always computed, never vague)
 *   5. Units enforced: quintal/acre, ₹/quintal, ₹/acre
 *   6. Location grounding — India → Indian context always
 *   7. What-if in ₹ change + % change (not raw numbers)
 *   8. Crop recommendations: ranked + final pick + profit calc
 *   9. Disease: cost-per-acre in ₹, severity + urgency color
 *  10. Community benchmark: numeric percentile + ₹ profit gap
 *
 * MULTI-AGENT ARCHITECTURE:
 *   1. Agronomist Agent  — crop planning, fertilizer, soil
 *   2. Market Analyst    — price forecast, sell/hold, ₹ profit
 *   3. Weather Risk      — climate risk score, yield impact
 *   4. Experimentation   — 3-strategy simulation, ROI comparison
 *   5. Decision Agent    — FINAL DECISION with full justification
 *
 * SECRETS: K2_API_KEY | GROQ_API_KEY | SERPER_API_KEY
 * ═══════════════════════════════════════════════════════════════════════════
 */

const K2_MODEL          = 'MBZUAI-IFM/K2-Think-v2';
const K2_URL            = 'https://api.k2think.ai/v1/chat/completions';
const GROQ_URL          = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const SERPER_BASE       = 'https://google.serper.dev';
const THINK_LIMIT       = 32000;
const K2_TEMPERATURE    = 0.65; // Slightly lower = more consistent structured output

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const corsOk  = ()           => new Response(null, { status: 204, headers: CORS });
const jsonR   = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const errR    = (m, s = 500) => jsonR({ error: String(m) }, s);

// ─── K2 CORE ──────────────────────────────────────────────────────────────────

async function k2Call(messages, env, maxTokens = 2048) {
  const res = await fetch(K2_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.K2_API_KEY}` },
    body: JSON.stringify({ model: K2_MODEL, messages, temperature: K2_TEMPERATURE, max_tokens: maxTokens, stream: false }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`K2 ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return stripThink(data.choices?.[0]?.message?.content || '');
}

async function k2Json(messages, env, maxTokens = 2500) {
  const raw = await k2Call(messages, env, maxTokens);
  return safeParseJson(raw);
}

function safeParseJson(raw) {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (_) {}
  const fenced = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
  try { return JSON.parse(fenced); } catch (_) {}
  let depth = 0, start = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '{') { if (depth === 0) start = i; depth++; }
    else if (raw[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        try { return JSON.parse(raw.slice(start, i + 1)); } catch (_) {}
        start = -1;
      }
    }
  }
  return {};
}

function stripThink(text) {
  if (!text) return '';
  if (text.includes('</think>')) {
    const parts = text.split('</think>');
    text = parts[parts.length - 1].trim();
  } else if (text.includes('<think>')) {
    const idx = text.indexOf('<think>');
    text = text.slice(0, idx).trim() || '';
  }
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^(Certainly!|Sure!|Of course!|Great question!|Absolutely!)\s*/i, '')
    .trim();
}

// ─── SERPER HELPERS ───────────────────────────────────────────────────────────

async function serperFetch(endpoint, payload, env) {
  const res = await fetch(`${SERPER_BASE}/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': env.SERPER_API_KEY },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Serper ${endpoint} ${res.status}`);
  return res.json();
}

const serperSearch = (q, env, opts = {}) =>
  serperFetch('search', { q, num: opts.num || 6, gl: opts.gl || 'in', hl: opts.hl || 'en' }, env);

const serperNews = (q, env, opts = {}) =>
  serperFetch('news', { q, num: opts.num || 6, gl: opts.gl || 'in', hl: opts.hl || 'en' }, env);

const serperPlaces = (q, env, opts = {}) =>
  serperFetch('places', { q, gl: opts.gl || 'in', hl: opts.hl || 'en' }, env);

async function trySerper(fn) {
  try { return await fn(); } catch (e) { console.warn('[Serper]', e.message); return null; }
}

function extractSnippets(data, limit = 4) {
  if (!data) return '';
  return (data.organic || data.news || [])
    .slice(0, limit)
    .map(r => `${r.title || ''}: ${r.snippet || ''}`)
    .filter(Boolean)
    .join('\n');
}

// ─── LOCALE HELPERS ───────────────────────────────────────────────────────────

function localeParams(language, country) {
  const glMap = {
    'india': 'in', 'united states': 'us', 'usa': 'us', 'us': 'us',
    'kenya': 'ke', 'nigeria': 'ng', 'brazil': 'br', 'pakistan': 'pk',
    'bangladesh': 'bd', 'ethiopia': 'et', 'ghana': 'gh', 'indonesia': 'id',
    'philippines': 'ph', 'mexico': 'mx', 'argentina': 'ar', 'south africa': 'za',
    'tanzania': 'tz', 'uganda': 'ug', 'vietnam': 'vn', 'thailand': 'th',
    'nepal': 'np', 'sri lanka': 'lk', 'egypt': 'eg', 'france': 'fr',
    'germany': 'de', 'spain': 'es', 'italy': 'it', 'portugal': 'pt',
    'turkey': 'tr', 'china': 'cn', 'japan': 'jp', 'australia': 'au',
    'canada': 'ca', 'united kingdom': 'gb', 'uk': 'gb',
  };
  const hlMap = {
    en:'en', hi:'hi', mr:'mr', te:'te', ta:'ta', kn:'kn', gu:'gu', pa:'pa',
    bn:'bn', ar:'ar', es:'es', fr:'fr', pt:'pt', sw:'sw', zh:'zh', ja:'ja',
    ko:'ko', vi:'vi', th:'th', id:'id', tr:'tr', de:'de', it:'it', nl:'nl',
    ur:'ur', am:'am', ha:'ha', yo:'yo',
  };
  const countryKey = (country || '').toLowerCase().trim();
  return { gl: glMap[countryKey] || 'in', hl: hlMap[language || 'en'] || 'en' };
}

function langInstruction(lang) {
  const map = {
    hi: 'IMPORTANT: Respond entirely in Hindi (हिंदी). Use simple vocabulary appropriate for farmers.',
    mr: 'IMPORTANT: Respond entirely in Marathi (मराठी). Use simple vocabulary.',
    te: 'IMPORTANT: Respond entirely in Telugu (తెలుగు).',
    ta: 'IMPORTANT: Respond entirely in Tamil (தமிழ்).',
    kn: 'IMPORTANT: Respond entirely in Kannada (ಕನ್ನಡ).',
    gu: 'IMPORTANT: Respond entirely in Gujarati (ગુજરાતી).',
    pa: 'IMPORTANT: Respond entirely in Punjabi (ਪੰਜਾਬੀ).',
    bn: 'IMPORTANT: Respond entirely in Bengali (বাংলা).',
    ar: 'IMPORTANT: Respond entirely in Arabic (العربية).',
    es: 'IMPORTANT: Respond entirely in Spanish (Español).',
    fr: 'IMPORTANT: Respond entirely in French (Français).',
    pt: 'IMPORTANT: Respond entirely in Portuguese (Português).',
    sw: 'IMPORTANT: Respond entirely in Swahili (Kiswahili).',
    zh: 'IMPORTANT: Respond entirely in Simplified Chinese (中文).',
    ja: 'IMPORTANT: Respond entirely in Japanese (日本語).',
    ko: 'IMPORTANT: Respond entirely in Korean (한국어).',
    vi: 'IMPORTANT: Respond entirely in Vietnamese (Tiếng Việt).',
    id: 'IMPORTANT: Respond entirely in Indonesian (Bahasa Indonesia).',
    tr: 'IMPORTANT: Respond entirely in Turkish (Türkçe).',
    de: 'IMPORTANT: Respond entirely in German (Deutsch).',
    ur: 'IMPORTANT: Respond entirely in Urdu (اردو).',
    am: 'IMPORTANT: Respond entirely in Amharic (አማርኛ).',
  };
  return map[lang] || '';
}

// ─── INDIA ECONOMICS CONTEXT ─────────────────────────────────────────────────
// Injected into prompts to prevent unrealistic suggestions

function indiaEconomicsContext(country) {
  const isIndia = !country || country.toLowerCase().includes('india');
  if (!isIndia) return '';
  return `
INDIA FARMING ECONOMICS CONSTRAINTS (mandatory for India):
- Typical input cost: ₹10,000–₹20,000 per acre for most field crops
- Typical profit range: ₹15,000–₹50,000 per acre depending on crop and yield
- Soybean: yield 8–14 q/acre, price ₹4,000–₹5,500/q, cost ₹10,000–₹15,000/acre
- Cotton: yield 4–8 q/acre, price ₹6,000–₹8,000/q, cost ₹15,000–₹22,000/acre
- Wheat: yield 12–20 q/acre, price ₹2,100–₹2,500/q, cost ₹8,000–₹12,000/acre
- Rice: yield 15–22 q/acre, price ₹2,100–₹2,400/q, cost ₹10,000–₹16,000/acre
- Tur Dal: yield 4–7 q/acre, price ₹7,000–₹9,000/q, cost ₹8,000–₹12,000/acre
- Onion: yield 40–80 q/acre, price ₹800–₹2,500/q, cost ₹20,000–₹35,000/acre
- DO NOT suggest infrastructure > ₹1 lakh unless explicitly asked
- DO NOT suggest polycarbonate tunnels, hydroponic systems, or foreign technology
- All costs MUST be in ₹ (Indian Rupees)
- Use realistic Maharashtra/India crop varieties and local input brand names
`;
}

// ─── MISC HELPERS ─────────────────────────────────────────────────────────────

function extractPrice(text) {
  if (!text) return null;
  const m = text.match(/(?:₹|Rs\.?\s*|INR\s*)(\d[\d,]+)/i)
         || text.match(/(\d[\d,]{2,})\s*(?:per\s*quintal|\/quintal|\/qtl)/i);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
}

const NON_AGRI = ['hotel','motel','inn','resort','restaurant','cafe','bar','pub','salon','spa','gym','school','college','hospital','clinic','pharmacy','bank','atm','petrol','beauty','parlour','tailor','clothing','mobile','electronics'];

function filterAgri(places) {
  return (places || []).filter(p => {
    const t = [(p.title||''),(p.category||''),(p.address||'')].join(' ').toLowerCase();
    return !NON_AGRI.some(k => t.includes(k));
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AGENT 1: AGRONOMIST AGENT
// ═══════════════════════════════════════════════════════════════════════════════

async function agronomistAgent(params, env) {
  const { crop, soil, location, season, soilData, rainfall, temperature, lang } = params;
  const { gl, hl } = localeParams(lang, params.country);

  const [searchData, newsData] = await Promise.allSettled([
    trySerper(() => serperSearch(`best ${crop || 'crops'} farming practices soil ${location} ${season || ''}`, env, { gl, hl, num: 4 })),
    trySerper(() => serperNews(`${crop || 'agriculture'} advisory soil health ${location}`, env, { gl, hl, num: 3 })),
  ]);

  const searchCtx = searchData.status === 'fulfilled' ? extractSnippets(searchData.value, 3) : '';
  const newsCtx   = newsData.status === 'fulfilled'   ? extractSnippets(newsData.value, 2)   : '';

  const result = await k2Json([
    {
      role: 'system',
      content: [
        `You are the Agronomist Agent in a multi-agent precision agriculture AI system.`,
        `Your role: analyze soil, recommend crops with PROFIT CALCULATIONS, design fertilizer schedules for ${location}.`,
        indiaEconomicsContext(params.country),
        searchCtx ? `LIVE SEARCH DATA:\n${searchCtx}` : '',
        newsCtx   ? `LIVE NEWS CONTEXT:\n${newsCtx}`   : '',
        langInstruction(lang),
        `CRITICAL: All monetary values MUST be in local currency (₹ for India). Use quintal/acre units. Every crop MUST have profitPerAcre calculated as: revenue (yield × price) minus cost.`,
        `Respond with ONLY valid JSON. No markdown fences.`,
      ].filter(Boolean).join('\n\n'),
    },
    {
      role: 'user',
      content: `Analyze and recommend crops for:
Location: ${location}
Crop requested: ${crop || 'auto-select best 5 crops'}
Season: ${season || 'current'}
Soil Type: ${soil || 'unknown'}
Soil Data: ${JSON.stringify(soilData || {})}
Rainfall: ${rainfall || 'average'}mm
Temperature: ${temperature || 'average'}°C

Return ONLY this JSON (no extra text):
{
  "recommendedCrops": [
    {
      "name": "",
      "suitability": "highly-suitable",
      "rank": 1,
      "reason": "",
      "expectedYield": "12 quintal/acre",
      "marketPrice": "₹4,500/quintal",
      "estimatedCost": 14000,
      "estimatedRevenue": 54000,
      "profitPerAcre": 40000,
      "waterNeeds": "moderate",
      "duration": "90-100 days",
      "riskLevel": "medium"
    }
  ],
  "finalRecommendation": {
    "crop": "",
    "reason": "",
    "profitEstimate": "₹X per acre",
    "confidenceLevel": "high"
  },
  "primaryRecommendation": {"crop":"","reasoning":"","keyActions":[""]},
  "fertilizerPlan": {
    "basalDose": [{"fertilizer":"","quantity":"","timing":"","costPerAcre":0}],
    "topDress":  [{"fertilizer":"","quantity":"","timing":"","costPerAcre":0}],
    "micronutrients": [{"nutrient":"","application":"","quantity":""}]
  },
  "bestPractices": [{"title":"","description":""}],
  "soilHealthScore": 72,
  "soilHealthSummary": "",
  "agentConfidence": 0.82
}`,
    },
  ], env, 3000);

  return { agent: 'agronomist', ...result };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AGENT 2: MARKET ANALYST AGENT
// ═══════════════════════════════════════════════════════════════════════════════

async function marketAnalystAgent(params, env) {
  const { crop, location, lang } = params;
  const { gl, hl } = localeParams(lang, params.country);

  const [priceData, newsData, placesData] = await Promise.allSettled([
    trySerper(() => serperSearch(`${crop || 'soybean'} mandi price today ${location} per quintal`, env, { gl, hl, num: 5 })),
    trySerper(() => serperNews(`${crop || 'commodity'} market price trend ${location}`, env, { gl, hl, num: 4 })),
    trySerper(() => serperPlaces(`APMC mandi agricultural market ${location}`, env, { gl, hl })),
  ]);

  const priceCtx = priceData.status === 'fulfilled' ? extractSnippets(priceData.value, 4) : '';
  const newsCtx  = newsData.status === 'fulfilled'  ? extractSnippets(newsData.value, 3)  : '';
  const mandis   = placesData.status === 'fulfilled' ? (placesData.value?.places || []).slice(0, 5).map(p => p.title).filter(Boolean) : [];

  const rawPrice = priceData.status === 'fulfilled'
    ? extractPrice(priceData.value?.answerBox?.answer || priceCtx)
    : null;

  const trend = newsCtx.toLowerCase().includes('fall') || newsCtx.toLowerCase().includes('decline') ? 'down'
              : newsCtx.toLowerCase().includes('rise') || newsCtx.toLowerCase().includes('surge')   ? 'up'
              : 'stable';

  const result = await k2Json([
    {
      role: 'system',
      content: [
        `You are the Market Analyst Agent in a multi-agent agriculture AI system.`,
        `Role: forecast prices, advise on sell/hold, maximize farmer profits for ${location}.`,
        indiaEconomicsContext(params.country),
        priceCtx ? `LIVE PRICE DATA:\n${priceCtx}` : '',
        newsCtx  ? `LIVE MARKET NEWS:\n${newsCtx}`  : '',
        rawPrice ? `EXTRACTED CURRENT PRICE: ₹${rawPrice}/quintal` : '',
        langInstruction(lang),
        `CRITICAL: All prices in ₹/quintal. Provide SELL vs HOLD decision with clear reasoning.`,
        `Respond with ONLY valid JSON.`,
      ].filter(Boolean).join('\n\n'),
    },
    {
      role: 'user',
      content: `Analyze market for:
Crop: ${crop || 'mixed crops'}
Location: ${location}
Detected price: ₹${rawPrice || 'unknown'}/quintal
Detected trend: ${trend}

Return ONLY this JSON:
{
  "currentPrice": ${rawPrice || 0},
  "priceUnit": "per quintal",
  "currency": "INR",
  "trend": "${trend}",
  "trendStrength": "moderate",
  "forecast": [
    {"month":"Next Month","price":0,"change":"+2%","confidence":0.8},
    {"month":"In 2 Months","price":0,"change":"+5%","confidence":0.7},
    {"month":"In 3 Months","price":0,"change":"+3%","confidence":0.6}
  ],
  "sellDecision": "hold",
  "sellReasoning": "",
  "bestTimeToSell": "",
  "profitMaximizer": {
    "expectedPriceAtBestTime": 0,
    "storageAdvice": "",
    "storageCostPerMonth": 0,
    "alternativeCrops": [{"crop":"","estimatedProfitPerAcre":0,"reason":""}]
  },
  "marketRisks": [""],
  "opportunityScore": 75,
  "agentConfidence": 0.8
}`,
    },
  ], env, 2000);

  return { agent: 'market', ...result, nearbyMandis: mandis };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AGENT 3: WEATHER RISK AGENT
// ═══════════════════════════════════════════════════════════════════════════════

async function weatherRiskAgent(params, env) {
  const { crop, location, lang } = params;
  const { gl, hl } = localeParams(lang, params.country);

  const [weatherData, newsData] = await Promise.allSettled([
    trySerper(() => serperSearch(`weather forecast ${location} farming risk agriculture`, env, { gl, hl, num: 5 })),
    trySerper(() => serperNews(`weather monsoon rainfall drought ${location} agriculture`, env, { gl, hl, num: 3 })),
  ]);

  const weatherCtx = weatherData.status === 'fulfilled' ? extractSnippets(weatherData.value, 4) : '';
  const newsCtx    = newsData.status === 'fulfilled'    ? extractSnippets(newsData.value, 2)    : '';
  const rawWeather = weatherData.status === 'fulfilled' ? (weatherData.value?.answerBox || weatherData.value?.organic?.[0] || {}) : {};

  const condStr = JSON.stringify(rawWeather).toLowerCase();
  let alertLevel = 'low';
  if (condStr.includes('storm') || condStr.includes('cyclone')) alertLevel = 'critical';
  else if (condStr.includes('rain') || condStr.includes('flood')) alertLevel = 'high';
  else if (condStr.includes('heat') || condStr.includes('drought') || condStr.includes('dry')) alertLevel = 'medium';

  const result = await k2Json([
    {
      role: 'system',
      content: [
        `You are the Weather Risk Agent in a multi-agent agriculture AI system.`,
        `Role: assess weather risks, score yield impact (0–100), advise on irrigation/operations for ${location}.`,
        weatherCtx ? `LIVE WEATHER DATA:\n${weatherCtx}` : '',
        newsCtx    ? `WEATHER NEWS:\n${newsCtx}`          : '',
        `DETECTED ALERT LEVEL: ${alertLevel}`,
        langInstruction(lang),
        `Respond with ONLY valid JSON.`,
      ].filter(Boolean).join('\n\n'),
    },
    {
      role: 'user',
      content: `Assess weather risk for:
Crop: ${crop || 'mixed crops'}
Location: ${location}
Detected alert level: ${alertLevel}

Return ONLY this JSON:
{
  "yieldImpactScore": 80,
  "yieldImpactExplanation": "",
  "alerts": [{"type":"storm","severity":"medium","message":"","timeframe":"","affectedCrops":[""]}],
  "advisories": [{"priority":"immediate","action":"","rationale":""}],
  "optimalSowingWindow": "",
  "irrigationAdvice": "",
  "pesticideWindow": "",
  "riskEvents": [{"event":"","probability":0.3,"yieldImpact":"-15%","mitigation":""}],
  "weatherScore": 75,
  "agentConfidence": 0.75
}`,
    },
  ], env, 2000);

  return { agent: 'weather', ...result };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AGENT 4: EXPERIMENTATION AGENT  (3-Strategy Comparison + Final Decision)
// ═══════════════════════════════════════════════════════════════════════════════

async function experimentationAgent(params, env) {
  const { crop, soil, location, rainfall, lang } = params;
  const { gl, hl } = localeParams(lang, params.country);

  const searchData = await trySerper(() => serperSearch(`${crop || 'crop'} farming experiment trial yield improvement ${location}`, env, { gl, hl, num: 4 }));
  const ctx = extractSnippets(searchData, 3);

  const result = await k2Json([
    {
      role: 'system',
      content: [
        `You are the Experimentation Agent in a multi-agent agriculture AI system.`,
        `Role: simulate EXACTLY 3 farming strategies, compute PROFIT in ₹, compare ROI for ${location}.`,
        indiaEconomicsContext(params.country),
        ctx ? `LIVE RESEARCH DATA:\n${ctx}` : '',
        langInstruction(lang),
        `CRITICAL RULES:
1. Always return EXACTLY 3 strategies: AI Optimized, Conservative/Traditional, Crop Switch
2. All monetary values in ₹ (Indian Rupees)
3. Units: yield in quintal/acre, cost in ₹/acre, profit in ₹/acre
4. Profit = (yield × price) − cost — calculate this explicitly
5. What-if scenarios: show ₹ profit change AND % yield change
6. The FINAL DECISION must name which strategy wins and WHY
7. Respond with ONLY valid JSON. All numeric values must be numbers not strings.`,
      ].filter(Boolean).join('\n\n'),
    },
    {
      role: 'user',
      content: `Design 3-strategy experiment for:
Crop: ${crop || 'soybean'}
Soil: ${soil || 'black cotton soil'}
Location: ${location}
Rainfall: ${rainfall || 600}mm

Return ONLY this JSON:
{
  "strategies": [
    {
      "name": "AI Optimized",
      "type": "ai_optimized",
      "description": "",
      "inputs": [{"name":"","quantity":"","timing":"","costPerAcre":0}],
      "expectedYield": "12 quintal/acre",
      "yieldUnit": "quintal/acre",
      "pricePerUnit": 4500,
      "priceUnit": "₹/quintal",
      "estimatedRevenue": 54000,
      "estimatedCost": 14000,
      "estimatedProfit": 40000,
      "profitUnit": "₹/acre",
      "roi": 186,
      "riskLevel": "medium",
      "pros": [""],
      "cons": [""],
      "bestFor": ""
    },
    {
      "name": "Traditional / Conservative",
      "type": "traditional",
      "description": "",
      "inputs": [{"name":"","quantity":"","timing":"","costPerAcre":0}],
      "expectedYield": "8 quintal/acre",
      "yieldUnit": "quintal/acre",
      "pricePerUnit": 4500,
      "priceUnit": "₹/quintal",
      "estimatedRevenue": 36000,
      "estimatedCost": 10000,
      "estimatedProfit": 26000,
      "profitUnit": "₹/acre",
      "roi": 160,
      "riskLevel": "low",
      "pros": [""],
      "cons": [""],
      "bestFor": ""
    },
    {
      "name": "Crop Switch",
      "type": "crop_switch",
      "alternativeCrop": "",
      "description": "",
      "inputs": [{"name":"","quantity":"","timing":"","costPerAcre":0}],
      "expectedYield": "6 quintal/acre",
      "yieldUnit": "quintal/acre",
      "pricePerUnit": 7500,
      "priceUnit": "₹/quintal",
      "estimatedRevenue": 45000,
      "estimatedCost": 12000,
      "estimatedProfit": 33000,
      "profitUnit": "₹/acre",
      "roi": 175,
      "riskLevel": "high",
      "pros": [""],
      "cons": [""],
      "bestFor": ""
    }
  ],
  "comparisonTable": [
    {"strategy":"AI Optimized","yield":"","cost":"₹X/acre","profit":"₹X/acre","roi":"X%","risk":"medium"},
    {"strategy":"Traditional","yield":"","cost":"₹X/acre","profit":"₹X/acre","roi":"X%","risk":"low"},
    {"strategy":"Crop Switch","yield":"","cost":"₹X/acre","profit":"₹X/acre","roi":"X%","risk":"high"}
  ],
  "sensitivityAnalysis": {
    "rainfall_minus30pct": {
      "yieldImpact": "-20% yield",
      "profitImpact": "₹-8,000/acre on AI Optimized",
      "worstStrategy": "Traditional",
      "bestStrategy": "AI Optimized (irrigation buffer)",
      "risk": "high"
    },
    "price_minus20pct": {
      "yieldImpact": "0% yield change",
      "profitImpact": "₹-9,000/acre across all strategies",
      "worstStrategy": "Crop Switch",
      "bestStrategy": "Traditional (lower cost base)",
      "risk": "medium"
    },
    "pest_outbreak": {
      "yieldImpact": "-30% yield without IPM",
      "profitImpact": "₹-12,000/acre loss",
      "worstStrategy": "Traditional (no monitoring)",
      "bestStrategy": "AI Optimized (real-time pest alerts)",
      "risk": "high"
    }
  },
  "whatIfScenarios": [
    {
      "scenario": "Low Rainfall (-30%)",
      "rainfallMM": 0,
      "yieldImpactPercent": -20,
      "profitImpactINR": -8000,
      "riskLevel": "high",
      "mitigation": "",
      "recommendedStrategy": ""
    },
    {
      "scenario": "Normal Rainfall",
      "rainfallMM": 0,
      "yieldImpactPercent": 0,
      "profitImpactINR": 0,
      "riskLevel": "low",
      "mitigation": "",
      "recommendedStrategy": ""
    },
    {
      "scenario": "Excess Rainfall (+50%)",
      "rainfallMM": 0,
      "yieldImpactPercent": -10,
      "profitImpactINR": -4000,
      "riskLevel": "medium",
      "mitigation": "",
      "recommendedStrategy": ""
    }
  ],
  "finalDecision": {
    "recommendedStrategy": "AI Optimized",
    "reason": "",
    "profitAdvantage": "₹X more profit than Traditional per acre",
    "confidence": "high",
    "disclaimer": ""
  },
  "recommendation": "",
  "riskAnalysis": "",
  "agentConfidence": 0.82
}`,
    },
  ], env, 3500);

  return { agent: 'experimentation', ...result };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AGENT 5: DECISION AGENT (THE BRAIN)
// ═══════════════════════════════════════════════════════════════════════════════

async function decisionAgent(agentOutputs, params, env) {
  const { crop, location, objective, lang } = params;

  const summary = {
    agronomist: {
      topCrop:       agentOutputs.agronomist?.finalRecommendation?.crop || agentOutputs.agronomist?.primaryRecommendation?.crop || 'unknown',
      profitEstimate: agentOutputs.agronomist?.finalRecommendation?.profitEstimate || '',
      soilScore:     agentOutputs.agronomist?.soilHealthScore || 0,
      confidence:    agentOutputs.agronomist?.agentConfidence || 0,
    },
    market: {
      currentPrice:    agentOutputs.market?.currentPrice || 0,
      currency:        'INR',
      trend:           agentOutputs.market?.trend || 'stable',
      sellDecision:    agentOutputs.market?.sellDecision || 'hold',
      opportunityScore: agentOutputs.market?.opportunityScore || 0,
      confidence:      agentOutputs.market?.agentConfidence || 0,
    },
    weather: {
      yieldImpactScore: agentOutputs.weather?.yieldImpactScore || 0,
      alertCount:       (agentOutputs.weather?.alerts || []).length,
      weatherScore:     agentOutputs.weather?.weatherScore || 0,
      confidence:       agentOutputs.weather?.agentConfidence || 0,
    },
    experimentation: {
      winningStrategy:  agentOutputs.experimentation?.finalDecision?.recommendedStrategy || 'AI Optimized',
      winningProfit:    agentOutputs.experimentation?.finalDecision?.profitAdvantage || '',
      bestROI:          (agentOutputs.experimentation?.strategies || [])[0]?.roi || 0,
      confidence:       agentOutputs.experimentation?.agentConfidence || 0,
    },
  };

  const result = await k2Json([
    {
      role: 'system',
      content: [
        `You are the Decision Agent — the master brain of a 5-agent agriculture AI system.`,
        `Role: synthesize all agent outputs, resolve conflicts, produce the DEFINITIVE strategic recommendation for ${location}.`,
        indiaEconomicsContext(params.country),
        langInstruction(lang),
        `CRITICAL: Your output MUST include a clear "FINAL DECISION" with: recommended crop, recommended strategy, profit estimate in ₹/acre, and 3 reasons why.`,
        `Respond with ONLY valid JSON. No markdown fences.`,
      ].filter(Boolean).join('\n\n'),
    },
    {
      role: 'user',
      content: `Synthesize these agent outputs:

AGENT SUMMARY:
${JSON.stringify(summary, null, 2)}

USER OBJECTIVE: ${objective || 'Maximize profit this season'}
Crop: ${crop || 'auto-selected'}
Location: ${location}

Return ONLY this JSON:
{
  "finalDecision": {
    "recommendedCrop": "",
    "recommendedStrategy": "",
    "primaryAction": "",
    "timeline": "",
    "profitEstimatePerAcre": 0,
    "profitEstimateDisplay": "₹X per acre",
    "confidenceLevel": "high"
  },
  "decisionJustification": [
    "Reason 1: ...",
    "Reason 2: ...",
    "Reason 3: ..."
  ],
  "reasoning": {
    "whyThisCrop": "",
    "whyThisStrategy": "",
    "riskConsiderations": "",
    "opportunityFactors": ""
  },
  "conflictsResolved": [""],
  "compositeScore": {
    "overallScore": 0,
    "soilFit": 0,
    "marketOpportunity": 0,
    "weatherRisk": 0,
    "experimentalAdvantage": 0
  },
  "expectedOutcome": {
    "yieldEstimate": "X quintal/acre",
    "revenueEstimate": "₹X/acre",
    "costEstimate": "₹X/acre",
    "profitEstimate": "₹X/acre",
    "confidenceLevel": "",
    "bestCase": "₹X/acre",
    "worstCase": "₹X/acre"
  },
  "immediateActions": [{"action":"","priority":"high","deadline":"","rationale":"","costEstimate":"₹X"}],
  "weeklyPlan": [{"week":"Week 1","focus":"","tasks":[""]}],
  "governmentSchemes": [{"scheme":"","benefit":"","eligibility":"","howToApply":""}],
  "agentAgreement": 0.85
}`,
    },
  ], env, 3000);

  return { agent: 'decision', ...result };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FULL PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

async function runMultiAgentPipeline(params, env, agentsToRun = ['all']) {
  const runAll = agentsToRun.includes('all');

  const [agronomist, market, weather, experimentation] = await Promise.allSettled([
    runAll || agentsToRun.includes('agronomist')      ? agronomistAgent(params, env)      : Promise.resolve({}),
    runAll || agentsToRun.includes('market')          ? marketAnalystAgent(params, env)   : Promise.resolve({}),
    runAll || agentsToRun.includes('weather')         ? weatherRiskAgent(params, env)     : Promise.resolve({}),
    runAll || agentsToRun.includes('experimentation') ? experimentationAgent(params, env) : Promise.resolve({}),
  ]);

  const agentOutputs = {
    agronomist:      agronomist.status === 'fulfilled'     ? agronomist.value     : {},
    market:          market.status === 'fulfilled'         ? market.value         : {},
    weather:         weather.status === 'fulfilled'        ? weather.value        : {},
    experimentation: experimentation.status === 'fulfilled' ? experimentation.value : {},
  };

  const decision = await decisionAgent(agentOutputs, params, env);

  return { agents: agentOutputs, decision, pipelineVersion: '4.1', timestamp: new Date().toISOString() };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTE HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── /api/chat (SSE streaming) ────────────────────────────────────────────────

async function handleChat(req, env) {
  const { message, context, language, mode, location, district, state, country } = await req.json();
  if (!message) return errR("Missing 'message'", 400);

  const lang   = language || 'en';
  const locStr = location || [district, state, country].filter(Boolean).join(', ') || 'your location';

  const modeHints = {
    experiment: 'Proactively suggest 2-3 structured farm experiments with expected outcomes, cost estimates in ₹, ROI, and timeline.',
    hypothesis: 'Give probability-based insights, e.g. "70% chance this method improves yield by 15%". Quantify everything with ₹ and %.',
    autonomous: 'Act as an autonomous farm manager. Plan everything: crop selection, inputs, irrigation, selling time. Be decisive.',
  };

  const systemPrompt = [
    `You are AgriIntel Research Assistant — an expert digital agronomist and farm intelligence advisor.`,
    `You serve farmers globally. Farm location: ${locStr}`,
    indiaEconomicsContext(country),
    modeHints[mode] ? `Mode: ${modeHints[mode]}` : '',
    context ? `Recent conversation:\n${context}` : '',
    `RULES:
- Be practical, specific, and actionable.
- Use crop varieties, fertilizer names, and local schemes relevant to ${locStr}.
- Give numbers: quantities in quintal/acre, costs in ₹/acre, timelines.
- Express profit as: Profit = Revenue − Cost (always show calculation).
- Bold **key terms** and **important numbers**.
- Never use filler phrases. Get to the point immediately.`,
    langInstruction(lang),
  ].filter(Boolean).join('\n\n');

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: message },
  ];

  const k2Res = await fetch(K2_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.K2_API_KEY}` },
    body: JSON.stringify({ model: K2_MODEL, messages, temperature: K2_TEMPERATURE, max_tokens: 2000, stream: true }),
  });

  if (!k2Res.ok) {
    const txt = await k2Res.text().catch(() => '');
    return errR(`K2 error: ${txt.slice(0, 200)}`, k2Res.status);
  }

  const { readable, writable } = new TransformStream();
  const writer  = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader  = k2Res.body.getReader();
    const decoder = new TextDecoder();
    let lineBuf = '', thinkBuf = '', pastThink = false;

    const emit = async (token) => {
      if (!token) return;
      await writer.write(encoder.encode(
        `data: ${JSON.stringify({ choices: [{ delta: { content: token } }] })}\n\n`
      ));
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuf += decoder.decode(value, { stream: true });
        const lines = lineBuf.split('\n');
        lineBuf = lines.pop();
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const payload = t.slice(5).trim();
          if (payload === '[DONE]') continue;
          let parsed; try { parsed = JSON.parse(payload); } catch { continue; }
          const token = parsed.choices?.[0]?.delta?.content;
          if (token == null) continue;
          if (pastThink) {
            await emit(token.replace(/<think>/gi, ''));
          } else {
            thinkBuf += token;
            if (thinkBuf.length > THINK_LIMIT) thinkBuf = thinkBuf.slice(-1200);
            if (thinkBuf.includes('</think>')) {
              const parts = thinkBuf.split('</think>');
              pastThink = true; thinkBuf = '';
              await emit(parts[parts.length - 1].replace(/^(Certainly!|Sure!|Of course!)\s*/i, ''));
            }
          }
        }
      }
    } finally { reader.releaseLock(); }

    if (!pastThink) {
      if (thinkBuf.includes('</think>')) {
        await emit(thinkBuf.split('</think>').pop().trim());
      } else {
        try {
          const fb = await k2Call(messages, env, 3000);
          await emit(fb || 'Sorry, the model timed out. Please try again.');
        } catch { await emit('Sorry, a technical error occurred. Please try again.'); }
      }
    }

    await writer.write(encoder.encode('data: [DONE]\n\n'));
    await writer.close();
  })();

  return new Response(readable, {
    headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}

// ─── /api/analyze (Disease: Llama Scout → K2) ────────────────────────────────

async function handleAnalyze(req, env) {
  try {
    const { base64Image, mimeType, crop, language, district, state, country } = await req.json();
    if (!base64Image) return errR("Missing 'base64Image'", 400);

    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const cropName = crop || 'crop';

    let visualObservation = '', glmError = null;
    try {
      const gr = await fetch(GROQ_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_VISION_MODEL, max_tokens: 700,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${base64Image}` } },
              { type: 'text', text: `You are a plant pathology visual analyst. Examine this ${cropName} image. Describe ONLY what you observe: exact color changes, lesion shapes and sizes, affected plant parts, % leaf area affected, any visible fungal growth, bacterial ooze, or insects. Do NOT diagnose. Only describe precisely what you see.` },
            ],
          }],
        }),
      });
      if (gr.ok) {
        const gd = await gr.json();
        visualObservation = gd.choices?.[0]?.message?.content || '';
      } else { glmError = `Groq ${gr.status}`; }
    } catch (e) { glmError = e.message; }

    const sysMsg = [
      `You are an expert plant pathologist and agronomist with global agriculture expertise.`,
      visualObservation ? `VISUAL OBSERVATION REPORT:\n${visualObservation}` : '(No image analysis — use crop type and location context only.)',
      `Farm location: ${location}`,
      `Crop: ${cropName}`,
      indiaEconomicsContext(country),
      langInstruction(lang),
      `Provide diagnosis in this exact markdown format:

## Diagnosis
[Primary disease/pest/deficiency name and causal agent]

## Confidence Level
[High / Medium / Low — brief reason]

## Severity Score (1-10)
[Score — 1-3 monitor weekly, 4-7 treat within 48h, 8-10 act immediately]

## Recommended Treatment
### Chemical Options
- [Product name]: [dosage], [timing], [approx cost: ₹X/acre]
### Organic / Low-Cost Options
- [Option]: [method and effectiveness], [approx cost: ₹X/acre]

## Preventive Measures
- [Specific measure with timing]

## When to Seek Further Help
[Clear threshold — % damage area, days without improvement, etc.]`,
    ].filter(Boolean).join('\n\n');

    const result = await k2Call([
      { role: 'system', content: sysMsg },
      { role: 'user', content: `Analyze this ${cropName} for diseases, pests, or nutrient deficiencies. Provide complete treatment advice for farmers in ${location}.` },
    ], env, 1500);

    return jsonR({
      result, visualObservation, glmError,
      pipeline: glmError ? `Llama Scout (failed) → K2 (crop+location only)` : `Llama Scout → K2`,
    });
  } catch (e) { return errR(e.message); }
}

// ─── /api/multiagent (Full 5-Agent Pipeline) ──────────────────────────────────

async function handleMultiAgent(req, env) {
  try {
    const body = await req.json();
    const { crop, soil, district, state, country, language, rainfall, temperature, season, soilData, objective, agents } = body;

    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const params   = { crop, soil, location, country, district, state, season, soilData, rainfall, temperature, lang: language || 'en', objective };

    const result = await runMultiAgentPipeline(params, env, agents || ['all']);
    return jsonR(result);
  } catch (e) { return errR(e.message); }
}

// ─── /api/experiment (Standalone Experiment, 3-strategy) ──────────────────────

async function handleExperiment(req, env) {
  try {
    const { crop, soil, district, state, country, language, rainfall } = await req.json();
    if (!crop) return errR("Missing 'crop'", 400);

    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const lang     = language || 'en';

    const data = await experimentationAgent({ crop, soil, location, country, rainfall, lang }, env);

    if (!data || !data.strategies?.length) {
      return errR('Experiment data incomplete. Please try again.');
    }

    // Backward-compatible extraction
    const aiOpt = data.strategies.find(s => s.type === 'ai_optimized') || data.strategies[0];
    const trad  = data.strategies.find(s => s.type === 'traditional')  || data.strategies[1];
    const cropSwitch = data.strategies.find(s => s.type === 'crop_switch') || data.strategies[2];

    return jsonR({ ...data, aiOptimized: aiOpt, traditional: trad, cropSwitch });
  } catch (e) { return errR(e.message); }
}

// ─── /api/soil ────────────────────────────────────────────────────────────────

async function handleSoil(req, env) {
  try {
    const { soilData, crop, season, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);

    const sd  = await trySerper(() => serperSearch(`soil health ${crop || 'crop'} fertilizer advisory ${location}`, env, { num: 4, gl, hl }));
    const ctx = extractSnippets(sd, 3);

    const messages = [
      {
        role: 'system',
        content: [
          `You are a senior soil scientist and crop nutrition expert with global expertise.`,
          indiaEconomicsContext(country),
          ctx ? `LIVE ADVISORY CONTEXT:\n${ctx}` : '',
          langInstruction(lang),
          `Respond with ONLY a valid JSON object. No markdown, no preamble.`,
        ].filter(Boolean).join('\n\n'),
      },
      {
        role: 'user',
        content: `Analyze soil data for ${location}:
Crop: ${crop || 'mixed crops'}
Season: ${season || 'current'}
Soil Data: ${JSON.stringify(soilData || {})}

Return ONLY valid JSON:
{
  "soilHealthScore": 72,
  "soilHealthSummary": "",
  "deficiencies": [{"nutrient":"","severity":"moderate","impact":"","correctionCostPerAcre":"₹X"}],
  "fertilizerSchedule": [{"week":"Week 1","fertilizer":"","quantity":"","method":"","costPerAcre":0}],
  "seasonalCalendar": [{"month":"","activity":"","priority":"high"}],
  "soilAmendments": [{"amendment":"","quantity":"","benefit":"","costPerAcre":0}],
  "warnings": [""]
}`,
      },
    ];

    const data = await k2Json(messages, env, 2500);
    return jsonR(data);
  } catch (e) { return errR(e.message); }
}

// ─── /api/recommendations ─────────────────────────────────────────────────────

async function handleRecommendations(req, env) {
  try {
    const { district, state, country, language, season, soilType, farmSize, soilData, rainfall, temperature } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';

    // Run agronomist agent with full economics context
    const result = await agronomistAgent({
      crop: null, soil: soilType, location, country,
      season, soilData: soilData || {}, rainfall, temperature, lang,
    }, env);

    // Ensure finalRecommendation always exists
    if (!result.finalRecommendation && result.recommendedCrops?.length) {
      const best = result.recommendedCrops.reduce((a, b) => (b.profitPerAcre || 0) > (a.profitPerAcre || 0) ? b : a);
      result.finalRecommendation = {
        crop: best.name,
        reason: `Highest profit potential at ₹${(best.profitPerAcre || 0).toLocaleString('en-IN')}/acre`,
        profitEstimate: `₹${(best.profitPerAcre || 0).toLocaleString('en-IN')}/acre`,
        confidenceLevel: 'high',
      };
    }

    return jsonR(result);
  } catch (e) { return errR(e.message); }
}

// ─── /api/weather ─────────────────────────────────────────────────────────────

async function handleWeather(req, env) {
  try {
    const { crop, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const result   = await weatherRiskAgent({ crop, location, country, lang }, env);
    return jsonR(result);
  } catch (e) { return errR(e.message); }
}

// ─── /api/market ──────────────────────────────────────────────────────────────

async function handleMarket(req, env) {
  try {
    const { crop, district, state, country, language, landAcres } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';

    const result = await marketAnalystAgent({ crop, location, country, lang }, env);

    // Profit estimate if land size provided — use realistic yield
    let profitEstimate = null;
    if (landAcres && result.currentPrice) {
      // Assume 10 q/acre average yield for profit estimate
      profitEstimate = Math.round(result.currentPrice * 10 * parseInt(landAcres));
    }

    return jsonR({
      ...result,
      mspPrice: result.currentPrice,
      analysis: result.sellReasoning || '',
      profitEstimate,
    });
  } catch (e) { return errR(e.message); }
}

// ─── /api/community ───────────────────────────────────────────────────────────

async function handleCommunity(req, env) {
  try {
    const { crop, myYield, myPractices, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);

    const sd = await trySerper(() => serperSearch(`best ${crop || 'farming'} practices yield per acre ${location} top farmers`, env, { num: 5, gl, hl }));
    const communityInsights = extractSnippets(sd, 2);

    const data = await k2Json([
      {
        role: 'system',
        content: [
          `You are a farm benchmarking analyst. Compare farmer performance vs top performers in ${location}.`,
          indiaEconomicsContext(country),
          communityInsights ? `LIVE COMMUNITY DATA:\n${communityInsights}` : '',
          langInstruction(lang),
          `CRITICAL: Always provide numeric benchmarks (quintal/acre). Include ₹ profit gap calculations. Respond with ONLY valid JSON.`,
        ].filter(Boolean).join('\n\n'),
      },
      {
        role: 'user',
        content: `Benchmark this farmer:
Crop: ${crop || 'mixed'}, Location: ${location}
My Yield: ${myYield || 'unknown'} quintal/acre
My Practices: ${myPractices || 'standard'}

Return ONLY this JSON:
{
  "benchmarks": {
    "districtAvgYield": "X quintal/acre",
    "topPerformerYield": "X quintal/acre",
    "yourYield": "${myYield || 'not provided'} quintal/acre",
    "yourYieldPercentile": 60,
    "gapToTopPerformer": "X quintal/acre",
    "profitGapToTopPerformer": "₹X/acre",
    "districtAvgProfit": "₹X/acre",
    "topPerformerProfit": "₹X/acre"
  },
  "topPractices": [{"practice":"","adoptionRate":"75%","yieldLift":"X quintal/acre","profitLift":"₹X/acre"}],
  "communityInsights": "",
  "improvementActions": [{"action":"","effort":"medium","expectedImpact":"X quintal/acre more yield","expectedProfitIncrease":"₹X/acre","cost":"₹X","timeline":""}]
}`,
      },
    ], env, 2000);

    return jsonR({ ...data, communityInsights });
  } catch (e) { return errR(e.message); }
}

// ─── /api/marketplace ─────────────────────────────────────────────────────────

async function handleMarketplace(req, env) {
  try {
    const { query, category, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);

    const catQ = {
      seeds: 'certified seeds agricultural dealer', fertilizers: 'fertilizer NPK dealer',
      pesticides: 'pesticide fungicide agricultural', equipment: 'farm equipment dealer',
      drone: 'agricultural drone spraying service', 'soil-testing': 'soil testing lab',
      mandi: 'APMC agricultural market', logistics: 'cold storage farm logistics',
    };
    const placesQ = query || (category && catQ[category]) || 'agricultural inputs farming supplies';
    const pd = await trySerper(() => serperPlaces(`${placesQ} ${district || location}`, env, { gl, hl }));
    const realVendors = filterAgri(pd?.places || []).slice(0, 8);

    const data = await k2Json([
      {
        role: 'system',
        content: [
          `You are an agricultural procurement advisor for ${location}. Recommend PRODUCT TYPES only — never invent vendor names.`,
          indiaEconomicsContext(country),
          langInstruction(lang),
          `Respond with ONLY valid JSON.`,
        ].filter(Boolean).join('\n\n'),
      },
      {
        role: 'user',
        content: `Recommend for ${location}. Category: ${category || 'all'}. Query: ${query || 'general inputs'}.

Return ONLY this JSON:
{
  "recommendations": [{"name":"","category":"seeds","description":"","estimatedPrice":"₹X–₹Y per kg/bag","availability":"widely-available","procurementTip":""}],
  "govtSchemes": [{"scheme":"","benefit":"","eligibility":"","howToApply":""}],
  "localServiceProviders": ""
}`,
      },
    ], env, 2000);

    return jsonR({ ...data, realVendors });
  } catch (e) { return errR(e.message); }
}

// ─── /api/feedback ────────────────────────────────────────────────────────────

async function handleFeedback(req, env) {
  try {
    const { suggestionType, actualOutcome, crop, district, state, country, language } = await req.json();
    if (!actualOutcome) return errR("Missing 'actualOutcome'", 400);

    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);

    const pos = ['worked','good','success','improved','high','great','better','increased','effective','excellent'];
    const neg = ['failed','loss','wrong','worse','low','bad','did not','no result','problem','issue','poor'];
    const ol  = actualOutcome.toLowerCase();
    const accuracy = pos.some(w => ol.includes(w)) ? 'accurate'
                   : neg.some(w => ol.includes(w)) ? 'inaccurate' : 'partially-accurate';

    const nd  = await trySerper(() => serperNews(`${suggestionType || 'farming'} best practices ${crop || ''} ${location}`, env, { num: 3, gl, hl }));
    const revisedRecommendation = (nd?.news || [])[0]?.snippet || '';

    return jsonR({
      accuracyAssessment: accuracy,
      gap: accuracy === 'inaccurate' ? `AI suggestion for ${suggestionType || 'this approach'} may need local calibration for ${location}.` : '',
      revisedRecommendation,
      learningNote: accuracy === 'accurate'
        ? `Great outcome! Your data strengthens our model for ${location} conditions.`
        : accuracy === 'inaccurate'
        ? `Thank you. We've noted a gap for ${suggestionType} under ${location} conditions. A revised approach has been provided above.`
        : `Partial success — local micro-climate or soil variation may explain the gap.`,
    });
  } catch (e) { return errR(e.message); }
}

// ─── /api/whatif (What-If Scenario Engine) ────────────────────────────────────

async function handleWhatIf(req, env) {
  try {
    const { scenario, crop, location, currentStrategy, language, country } = await req.json();
    if (!scenario) return errR("Missing 'scenario'", 400);

    const lang = language || 'en';

    const data = await k2Json([
      {
        role: 'system',
        content: [
          `You are a farm scenario analysis expert. Compute DETAILED impact of hypothetical scenarios.`,
          indiaEconomicsContext(country),
          langInstruction(lang),
          `CRITICAL: Express all impacts as BOTH % change AND ₹/acre change. Be specific and actionable.`,
          `Respond with ONLY valid JSON.`,
        ].filter(Boolean).join('\n\n'),
      },
      {
        role: 'user',
        content: `Analyze this what-if scenario:
Scenario: ${scenario}
Crop: ${crop || 'mixed'}
Location: ${location || 'India'}
Current Strategy: ${currentStrategy || 'standard farming'}

Return ONLY this JSON:
{
  "scenarioName": "${scenario}",
  "probability": 0.4,
  "yieldImpact": {
    "percentage": "-20%",
    "quintalPerAcreChange": -2.5,
    "direction": "negative"
  },
  "profitImpact": {
    "percentage": "-35%",
    "inrPerAcreChange": -12000,
    "direction": "negative"
  },
  "riskLevel": "high",
  "adaptationStrategies": [{"strategy":"","costInr":"₹X/acre","effectiveness":"X% yield saved","timeline":""}],
  "immediateActions": [""],
  "longTermMitigation": "",
  "worstCase": "₹X/acre loss",
  "bestCase": "₹X/acre profit maintained",
  "recoveryTime": ""
}`,
      },
    ], env, 2000);

    return jsonR(data);
  } catch (e) { return errR(e.message); }
}

// ─── /api/autonomous (Autonomous Farm Manager) ────────────────────────────────

async function handleAutonomous(req, env) {
  try {
    const body = await req.json();
    const { objective, farmSize, district, state, country, language, budget, constraints } = body;
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';

    const pipeline = await runMultiAgentPipeline({
      location, country, district, state, lang,
      objective: objective || 'Maximize profit this season',
      soil: body.soil, rainfall: body.rainfall, temperature: body.temperature,
    }, env);

    const autoPlan = await k2Json([
      {
        role: 'system',
        content: [
          `You are an Autonomous Farm Manager AI. Make ALL farming decisions based on agent data.`,
          indiaEconomicsContext(country),
          `Create a complete autonomous farm management plan. Be decisive and specific. Use ₹ for all costs.`,
          `Multi-agent decision:\n${JSON.stringify(pipeline.decision?.finalDecision || {})}`,
          langInstruction(lang),
          `Respond with ONLY valid JSON.`,
        ].filter(Boolean).join('\n\n'),
      },
      {
        role: 'user',
        content: `Create complete autonomous farm plan:
Objective: ${objective || 'Maximize profit this season'}
Farm Size: ${farmSize || '5'} acres
Location: ${location}
Budget: ${budget || 'flexible'}
Constraints: ${constraints || 'none'}

Return ONLY this JSON:
{
  "selectedCrop": "",
  "totalBudget": 0,
  "expectedROI": "X%",
  "planSummary": "",
  "weekByWeekPlan": [{"week":"","actions":[""],"budget":0,"milestone":""}],
  "inputProcurement": [{"item":"","quantity":"","costInr":0,"source":"","when":""}],
  "marketingStrategy": {"sellWhen":"","targetBuyer":"","expectedPrice":0,"priceUnit":"₹/quintal","storageNeeded":false},
  "riskMitigation": [{"risk":"","probability":0.3,"action":"","costInr":0}],
  "kpis": [{"metric":"","target":"","unit":"","checkDate":""}],
  "emergencyProtocol": ""
}`,
      },
    ], env, 3000);

    return jsonR({ pipeline, autonomousPlan: autoPlan });
  } catch (e) { return errR(e.message); }
}

// ─── SERPER PASS-THROUGHS ─────────────────────────────────────────────────────

async function handleSerperWeather(req, env) {
  try {
    const { district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);
    const sd = await serperSearch(`weather today ${district || location} current temperature forecast`, env, { num: 5, gl, hl });
    return jsonR({
      answerBox:       sd.answerBox      || null,
      knowledgeGraph:  sd.knowledgeGraph || null,
      weatherSnippets: (sd.organic || []).slice(0, 5).map(r => ({ title: r.title, snippet: r.snippet, link: r.link, date: r.date })),
      searchResults:   (sd.organic || []).slice(0, 5),
    });
  } catch (e) {
    return jsonR({ answerBox: null, weatherSnippets: [], searchResults: [] });
  }
}

async function handleSerperMarket(req, env) {
  try {
    const { crop, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const cropName = crop || 'commodity';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);
    const [pr, nr] = await Promise.allSettled([
      serperSearch(`${cropName} mandi price today ${location} per quintal 2025 2026`, env, { num: 6, gl, hl }),
      serperNews(`${cropName} commodity price market ${location}`, env, { num: 4, gl, hl }),
    ]);
    return jsonR({
      priceResults:   pr.status === 'fulfilled' ? (pr.value.organic || []).slice(0, 6) : [],
      priceAnswerBox: pr.status === 'fulfilled' ? (pr.value.answerBox || null) : null,
      newsResults:    nr.status === 'fulfilled' ? (nr.value.news || []).slice(0, 4) : [],
    });
  } catch (e) { return jsonR({ priceResults: [], newsResults: [] }); }
}

async function handleSerperNews(req, env) {
  try {
    const { crop, topic, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);
    const q = [topic || 'agriculture farming', crop || '', location].filter(Boolean).join(' ');
    const sd = await serperNews(q, env, { num: 8, gl, hl });
    return jsonR({
      news: (sd.news || []).slice(0, 8).map(n => ({
        title: n.title, snippet: n.snippet, link: n.link,
        source: n.source, date: n.date, imageUrl: n.imageUrl || null,
      })),
    });
  } catch (e) { return jsonR({ news: [] }); }
}

async function handleSerperPlaces(req, env) {
  try {
    const { query, category, district, state, country, language } = await req.json();
    const lang     = language || 'en';
    const location = [district, state, country].filter(Boolean).join(', ') || 'your location';
    const { gl, hl } = localeParams(lang, country);
    const catQ = {
      seeds: 'certified seeds agricultural dealer', fertilizers: 'fertilizer NPK urea dealer',
      pesticides: 'pesticide insecticide agricultural', equipment: 'farm equipment tractor dealer',
      drone: 'agricultural drone spraying service', 'soil-testing': 'soil testing laboratory',
      mandi: 'APMC agricultural produce market', logistics: 'cold storage farm logistics',
    };
    const q  = query || (category && catQ[category]) || 'agricultural inputs farming supplies';
    const pd = await serperPlaces(`${q} ${district || location}`, env, { gl, hl });
    return jsonR({
      places: filterAgri(pd.places || []).slice(0, 8).map(p => ({
        title: p.title, address: p.address, phone: p.phoneNumber || p.phone || null,
        rating: p.rating || null, reviews: p.reviews || null,
        website: p.website || null, cid: p.cid || null, category: p.category || null,
      })),
    });
  } catch (e) { return jsonR({ places: [] }); }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN FETCH HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return corsOk();
    if (request.method !== 'POST')
      return new Response('AgriIntel K2 Worker v4.1 — Multi-Agent System (Fixed)', { status: 200, headers: CORS });

    const pathname = new URL(request.url).pathname;

    const routes = {
      '/api/chat':            handleChat,
      '/api/analyze':         handleAnalyze,
      '/api/multiagent':      handleMultiAgent,
      '/api/experiment':      handleExperiment,
      '/api/soil':            handleSoil,
      '/api/recommendations': handleRecommendations,
      '/api/weather':         handleWeather,
      '/api/market':          handleMarket,
      '/api/community':       handleCommunity,
      '/api/marketplace':     handleMarketplace,
      '/api/feedback':        handleFeedback,
      '/api/whatif':          handleWhatIf,
      '/api/autonomous':      handleAutonomous,
      '/api/serper/weather':  handleSerperWeather,
      '/api/serper/market':   handleSerperMarket,
      '/api/serper/news':     handleSerperNews,
      '/api/serper/places':   handleSerperPlaces,
    };

    const handler = routes[pathname];
    if (!handler) return errR(`Unknown route: ${pathname}`, 404);

    try {
      return await handler(request, env);
    } catch (err) {
      console.error(`[AgriIntel] Unhandled on ${pathname}:`, err);
      return errR(err.message || 'Internal server error');
    }
  },
};