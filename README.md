# AgriIntel K2 — Digital Agronomist Platform

> **AI-powered precision agriculture intelligence platform built for Indian farmers.**  
> Combines **Llama Vision** (disease image analysis) → **MBZUAI K2-Think-v2** (agronomic reasoning) with **Serper.dev** real-time Google Search, News, and Places APIs to deliver actionable farm intelligence across weather, markets, soil, crop recommendations, disease diagnosis, and more.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [AI Pipeline — Llama Vision + K2](#4-ai-pipeline--llama-vision--k2)
5. [API Strategy — K2 vs Llama Vision vs Serper](#5-api-strategy--k2-vs-llama-vision-vs-serper)
6. [Features — Detailed Breakdown](#6-features--detailed-breakdown)
   - [6.1 Dashboard](#61-dashboard)
   - [6.2 Research — K2 Assistant](#62-research--k2-assistant)
   - [6.3 Lab — Crop Simulator](#63-lab--crop-simulator)
   - [6.4 AI Recommendations (Soil Page)](#64-ai-recommendations-soil-page)
   - [6.5 Disease Detection](#65-disease-detection)
   - [6.6 Weather & Risk Intelligence](#66-weather--risk-intelligence)
   - [6.7 Market Intelligence](#67-market-intelligence)
   - [6.8 Farmer Network](#68-farmer-network)
   - [6.9 Marketplace & Services](#69-marketplace--services)
   - [6.10 Feedback Loop](#610-feedback-loop)
7. [Cloudflare Worker — All Backend Routes](#7-cloudflare-worker--all-backend-routes)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [Localization System](#10-localization-system)
11. [Design System](#11-design-system)
12. [Environment Variables & Secrets](#12-environment-variables--secrets)
13. [Project File Structure](#13-project-file-structure)
14. [Setup & Deployment Guide](#14-setup--deployment-guide)
15. [Error Handling & Fallbacks](#15-error-handling--fallbacks)
16. [Performance Considerations](#16-performance-considerations)
17. [Security Architecture](#17-security-architecture)

---

## 1. Project Overview

AgriIntel K2 is a **single-page web application (SPA)** targeted at farmers and agronomists in India and globally. It acts as a **digital agronomist** — combining live internet data with AI reasoning to deliver:

- Real-time weather risk alerts and irrigation guidance
- Live mandi (market) commodity prices from Google Search
- **Two-stage AI crop disease diagnosis** — Llama Vision reads the image, K2 reasons about the diagnosis
- Soil profile analysis and fertilizer plans
- Farm experiment simulations comparing AI-optimised vs traditional methods
- Farmer benchmarking against district top performers
- Local agri-vendor discovery via Google Places

### Key Design Philosophy

The platform is intentionally **lightweight and edge-first**: no backend database, no authentication server. All intelligence is delivered through a **Cloudflare Worker** that routes requests to the appropriate AI or data service. The worker runs at Cloudflare's global edge, meaning zero cold starts and sub-100ms routing worldwide.

### Target Users

- Smallholder and medium-scale farmers in India (Kharif/Rabi seasons)
- Agricultural extension workers and agronomists
- Agri-input dealers and APMC market participants
- Farming cooperatives and FPOs (Farmer Producer Organisations)

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Vanilla JavaScript (ES Modules), Vite 5 | SPA framework-free for minimal bundle size |
| **Styling** | Tailwind CSS v3 (CDN) + Material Design 3 tokens | Utility-first CSS with custom color system |
| **Fonts** | Google Fonts: Manrope (headlines), Inter (body) | Professional, readable typography |
| **Icons** | Material Symbols Outlined (variable font) | Consistent icon system |
| **Routing** | Custom hash-based SPA router (`src/router.js`) | No framework dependency |
| **Backend** | Cloudflare Workers (Edge runtime) | Zero cold starts, global deployment |
| **Primary AI** | MBZUAI K2-Think-v2 via `api.k2think.ai` | Deep reasoning for all structured analysis |
| **Vision AI** | Llama Vision (multimodal) | First-stage image analysis for disease detection |
| **Live Data** | Serper.dev (Google Search, News, Places) | Real-time prices, weather, news, vendor discovery |
| **Deployment** | Wrangler CLI | Cloudflare edge deployment |
| **Build Tool** | Vite 5 | Dev server + production bundling |

---

## 3. Architecture Overview

```
╔══════════════════════════════════════════════════════════════════╗
║                    Browser (SPA)                                  ║
║  src/main.js → Router → Page Components → src/services/api.js   ║
╚══════════════════════════╦═══════════════════════════════════════╝
                           │ POST /api/* (JSON)
                           ▼
╔══════════════════════════════════════════════════════════════════╗
║           Cloudflare Worker  (agriintel-worker.js)               ║
║                    Edge Runtime — Zero Cold Start                 ║
║                                                                   ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │                    Route Switch                          │   ║
║   └──────┬──────────────────┬───────────────────────────────┘   ║
║          │                  │                                      ║
║          ▼                  ▼                                      ║
║   ┌─────────────┐   ┌──────────────────────────────────────┐    ║
║   │  Serper.dev  │   │          K2 API Routes               │    ║
║   │             │   │  ┌────────────────────────────────┐  │    ║
║   │  /search    │   │  │  /api/chat  (streaming SSE)    │  │    ║
║   │  /news      │   │  │  /api/soil  (JSON mode)        │  │    ║
║   │  /places    │   │  │  /api/experiment (JSON mode)   │  │    ║
║   │             │   │  │  /api/recommendations (JSON)   │  │    ║
║   └─────────────┘   │  └────────────────────────────────┘  │    ║
║                     │                                        │    ║
║                     │  ┌────────────────────────────────┐  │    ║
║                     │  │  Disease Detection Pipeline     │  │    ║
║                     │  │                                  │  │    ║
║                     │  │  Stage 1: Llama Vision           │  │    ║
║                     │  │   → Visual symptom observation   │  │    ║
║                     │  │        ↓                         │  │    ║
║                     │  │  Stage 2: K2-Think-v2            │  │    ║
║                     │  │   → Agronomic diagnosis +        │  │    ║
║                     │  │     treatment plan               │  │    ║
║                     │  └────────────────────────────────┘  │    ║
║                     └──────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════╝
```

### Data Flow Summary

1. **Frontend** (`src/services/api.js`) is the single point of contact for all API calls
2. Every request is automatically enriched with `district`, `state`, `country`, and `language` from `userPrefs`
3. The **Cloudflare Worker** receives the request and routes it to the appropriate handler
4. Handlers that need real-time data call **Serper.dev** first, then optionally inject the results as context into a **K2** prompt
5. Responses flow back to the frontend where page-specific `init*()` functions render them into the DOM

---

## 4. AI Pipeline — Llama Vision + K2

### Overview

The disease detection feature uses a **two-stage AI pipeline**. The stages are deliberately separated because vision models excel at describing what they see, while large reasoning models excel at interpreting those descriptions with domain expertise. Combining both gives better accuracy than either alone.

### Stage 1 — Llama Vision (Visual Observer)

**What it does:** Llama Vision receives the raw base64-encoded crop image and produces a detailed textual description of visible symptoms.

**Why Llama Vision for this stage:**
- Llama Vision is a multimodal model optimised for visual understanding
- It describes colors, textures, patterns, lesion shapes, affected area coverage, leaf morphology — the raw visual facts
- It does not need to know agronomy; its job is purely perceptual reporting

**Prompt strategy for Stage 1:**
```
You are a visual analysis assistant. Examine this crop image and describe in detail:
1. What you observe: colors, spots, lesions, patterns, textures
2. Which plant parts are affected (leaves, stem, fruit, roots)
3. The extent of damage (% leaf area, localised vs widespread)
4. Any visible insects, fungal growth, or discoloration patterns
Do NOT diagnose. Only describe what you visually observe.
```

**Output:** A detailed paragraph of visual observations, e.g.:
> "The leaf shows circular brown lesions with yellow halos, approximately 5-8mm diameter, clustered on the upper leaf surface. Lower leaves show more advanced necrosis. The stem appears healthy. Approximately 30% of visible leaf area is affected."

### Stage 2 — K2-Think-v2 (Agronomic Reasoner)

**What it does:** K2 receives the Llama Vision observation report (not the raw image) along with crop type, location, and season context, then applies agronomic reasoning to produce a structured diagnosis and treatment plan.

**Why K2 for this stage:**
- K2-Think-v2 is a large reasoning model that "thinks" before responding (the `<think>` blocks)
- It has deep knowledge of plant pathology, disease progression, chemical/organic treatments, Indian agricultural context, and government scheme eligibility
- Taking a text description as input (rather than the image directly) forces it to reason about symptoms rather than pattern-match on visual features alone

**Prompt strategy for Stage 2:**
```
You are an expert plant pathologist and agronomist.

Visual observation from image analysis:
[LLAMA_VISION_OUTPUT]

Crop: [crop_name]
Farm location: [district], [state], [country]
Season: [current_season]

Based on this visual observation, provide a structured diagnosis:
## Diagnosis
## Confidence Level
## Severity Score (1-10)
## Recommended Treatment
### Chemical Options (with approximate cost in local currency)
### Organic / Low-Cost Options
## Preventive Measures
## When to Seek Further Help
```

**Output:** Structured markdown report with all sections populated, severity-coded for urgency.

### Pipeline Execution in the Worker

```javascript
// Stage 1: Llama Vision
const llamaResponse = await fetch(LLAMA_VISION_URL, {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.LLAMA_API_KEY}` },
  body: JSON.stringify({
    model: 'llama-vision-latest',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
        { type: 'text', text: visualObserverPrompt }
      ]
    }]
  })
});
const visualObservation = await extractText(llamaResponse);

// Stage 2: K2 Reasoning (using the text output, not the image)
const k2Response = await k2([
  { role: 'system', content: agronomistSystemPrompt },
  { role: 'user', content: `Visual observation:\n${visualObservation}\n\nCrop: ${crop}\nLocation: ${location}` }
], env, { stream: false, maxTokens: 1200 });
```

### Fallback Strategy

If Llama Vision fails (API timeout, invalid image format, etc.):
- The worker logs the error and proceeds to Stage 2
- K2 is called with only crop name and location (no visual input)
- The response includes a `glmError` field so the frontend can display a warning
- The diagnosis is still useful but less specific — the frontend renders a yellow warning banner explaining this

### Error Transparency to Users

The frontend (`src/pages/disease.js`) renders three distinct UI states:
1. **Full pipeline success** — shows GLM observation collapsible section + K2 diagnosis
2. **Vision failed, K2 succeeded** — shows warning banner explaining vision stage failed, but still shows K2's best-effort diagnosis
3. **Both failed** — shows error message with retry option

---

## 5. API Strategy — K2 vs Llama Vision vs Serper

A deliberate architectural decision was made to use each API only where it genuinely adds value:

### K2-Think-v2 — Used for Deep Structured Reasoning

K2 is a large reasoning model with an explicit internal thinking process (exposed via `<think>` blocks that are stripped before returning to the client). It is **only used where structured analysis, domain expertise, or multi-step reasoning is required**.

| Feature | Why K2 | K2 Mode |
|---|---|---|
| **Research Chat** | Multi-turn advisory, language switching, contextual memory, mode-aware responses | Streaming SSE |
| **Disease Diagnosis (Stage 2)** | Interprets visual observations with plant pathology expertise, produces structured treatment plan | JSON (markdown output) |
| **Lab / Crop Simulator** | Structured comparison of AI vs traditional methods, rainfall scenario modelling, cost/profit calculations | JSON mode |
| **Soil Analyzer** | Maps soil profiles to fertiliser schedules, seasonal calendars, micronutrient plans | JSON mode |
| **AI Recommendations** | Crop suitability ranking based on soil+climate data, complete fertilizer plans | JSON mode |
| **Marketplace** | Product-type recommendations with procurement tips, government scheme info | JSON mode |

### Llama Vision — Used for Image Understanding

| Feature | Why Llama Vision | Usage |
|---|---|---|
| **Disease Detection (Stage 1)** | Multimodal model that can examine crop images and describe visible symptoms in detail before K2 reasons about them | Single call per analysis |

### Serper.dev — Used for Real-Time Live Data

Serper wraps Google Search, Google News, and Google Places. It is used for **everything that changes daily** and cannot be reliably provided by a static AI model.

| Feature | Serper Endpoints | What Is Fetched |
|---|---|---|
| Dashboard weather | `/search` | Live temperature, humidity, conditions for user's location |
| Dashboard market | `/search` + `/news` | Mandi prices per quintal, commodity news |
| Dashboard news | `/news` | Latest agriculture headlines |
| Weather page | `/search` + `/news` | Full weather + weather-agriculture news |
| Market page | `/search` + `/news` + `/places` | Prices, market news, nearby APMC mandis |
| Farmer Network | `/search` | Top farming practices and yield benchmarks |
| Marketplace | `/places` + `/search` | Local agri vendors, seeds/fertilizer dealers |
| Soil page (news) | `/news` | Crop advisory news for the district |
| Soil page (labs) | `/places` (soil-testing) | Nearby ICAR-accredited soil testing labs |
| Feedback Loop | `/search` | Current best practices for the suggestion type |

---

## 6. Features — Detailed Breakdown

### 6.1 Dashboard

**File:** `src/pages/dashboard.js`  
**Route:** `#/`  
**Data sources:** Serper (`/search`, `/news`) + K2 (`/api/weather`, `/api/market`)

The Dashboard is the home screen and aggregates intelligence from multiple parallel sources, all loading simultaneously via independent async functions.

#### How It Is Built

The page renders immediately with skeleton loaders in every section. Five async functions fire in parallel on `loadAll()`:

```javascript
function loadAll() {
  loadLiveWeather();    // Serper → answerBox → temperature display
  loadSerperMarket();   // Serper → price results + news grid
  loadNews();           // Serper → agriculture news feed
  loadWeather();        // POST /api/weather → K2 risk alerts
  loadMarket();         // POST /api/market → K2 forecast + profit
}
```

#### Live Weather Banner

Calls `getSerperWeather()` → `POST /api/serper/weather`. The worker queries Google Search for `"weather today [district], [country]"`. The response includes:
- `answerBox` — Google's extracted answer (temperature, conditions)
- `knowledgeGraph` — structured location data
- `weatherSnippets` — top organic results with weather data

The frontend applies two extraction functions:
- `extractTemperature(text)` — regex matches patterns like `25°C`, `77°F`, `25 degrees`
- `extractCondition(text)` — matches against a list of 20+ condition keywords

These extracted values populate the 4-column weather banner.

#### KPI Cards

Four summary cards are populated as the underlying data loads:
- **Weather Alerts** — count from `d.alerts.length`
- **Market Price** — `d.mspPrice` formatted as `₹XXXX`
- **Yield Impact** — `d.yieldImpactScore` as `XX/100`
- **Best Sell Window** — `d.profitMaximizer.bestTimeToSell`

#### Live Market Prices

`getSerperMarket()` fetches `"[crop] market price today [location] per quintal 2025 2026"`. Results include both an `answerBox` (when Google extracts a direct price) and organic search results linking to price sources like Agmarknet, Commodityonline, etc.

#### Agri News

`getSerperNews()` queries Google News for `"agriculture farming [crop] [location]"`. Returns articles with `title`, `snippet`, `source`, `date`, and `imageUrl`.

#### AI Market Forecast

`getMarketData()` → `POST /api/market`. The worker runs three Serper calls in parallel (search + news + places), extracts a numeric price via regex (`₹(\d[\d,]+)`), and builds a simple projection: `Month 1 = price × 1.02`, `Month 2 = price × 1.05`, `Month 3 = price × 1.03`.

#### User Controls

- **Crop selector** — 14 crops; changing it triggers `loadSerperMarket()` + `loadMarket()`
- **Refresh button** — fires all five loaders again
- **Location/Language settings** — modal updates `userPrefs` and dispatches `prefs-changed` event which triggers `loadAll()` via `window.addEventListener('prefs-changed', loadAll)`

---

### 6.2 Research — K2 Assistant

**File:** `src/pages/research.js`  
**Route:** `#/research`  
**Data sources:** K2 only (streaming)

A full-featured conversational AI chatbot with streaming responses, multi-language support, and three specialised modes.

#### How Streaming Works

1. User submits a message (click or Enter key)
2. Frontend calls `streamChat()` → `POST /api/chat` with `{ message, context, language, mode, location }`
3. The Cloudflare Worker calls K2 with `stream: true`
4. The worker wraps the K2 stream in a `TransformStream` that filters `<think>...</think>` blocks in real-time:

```javascript
// Worker streaming filter (simplified)
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Parse SSE chunks, detect <think> block boundaries,
  // suppress those tokens, forward clean tokens to browser
  if (inThink) {
    const ei = chunk.indexOf("</think>");
    if (ei !== -1) { inThink = false; chunk = chunk.slice(ei + 8); }
  } else {
    const si = chunk.indexOf("<think>");
    if (si !== -1) { out += chunk.slice(0, si); inThink = true; }
    else { out += chunk; }
  }
}
```

5. The browser reads the SSE stream via `response.body.getReader()`, decoding chunks and appending them to the message bubble character by character

#### Three Chat Modes

Mode is injected into the K2 system prompt via `modeHints`:

| Mode | System Prompt Addition | Use Case |
|---|---|---|
| **General Advisor** | Default farm advisory | Diseases, weather, schemes, prices |
| **Experiment Generator** | "Proactively suggest 2-3 structured experiments with expected outcomes and cost estimates" | Planning new methods |
| **Hypothesis Engine** | "Give probability-based insights e.g. '70% chance this method improves yield by 15%'" | Risk assessment |

#### Context Window Management

The last 6 conversation turns are formatted and injected into the system prompt:
```javascript
const context = history.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
```
This gives K2 conversational continuity without sending the entire history.

#### Language System

The `langInstruction(lang)` function appends to the system prompt:
```
IMPORTANT: Respond entirely in [Language Name]. Use simple vocabulary appropriate for farmers.
```
Supported: English, Hindi, Marathi, Spanish, French, Portuguese, Arabic, Bengali, Telugu, Tamil, Kannada, Gujarati, Punjabi.

#### Quick Prompts

Six pre-written prompts populate the input field on click, covering the most common farmer queries. These are HTML buttons that call `inputEl.value = btn.textContent`.

---

### 6.3 Lab — Crop Simulator

**File:** `src/pages/lab.js`  
**Route:** `#/lab`  
**Data sources:** Serper (`/search`) for context, then K2 (`/api/experiment`) for analysis

A virtual experiment simulator comparing AI-optimised farming methods against traditional methods.

#### How It Is Built

1. User configures: crop, soil type, district, expected rainfall
2. `POST /api/experiment` is called with these parameters
3. The worker first fetches real agronomic context from Serper:
   ```javascript
   const sd = await serper("/search", 
     searchPayload(`${crop} best farming practices yield ${location}`, { gl, hl, num: 4 })
   );
   context = extractSnippets(sd, 3);
   ```
4. This real-world context is injected into the K2 prompt as grounding data, preventing hallucination
5. K2 returns a structured JSON object

#### K2 JSON Schema for Experiments

```json
{
  "aiOptimized": {
    "inputs": [{ "name": string, "quantity": string, "timing": string }],
    "expectedYield": string,
    "confidenceInterval": string,
    "estimatedCost": number,
    "estimatedProfit": number
  },
  "traditional": {
    "inputs": [...],
    "expectedYield": string,
    "estimatedCost": number,
    "estimatedProfit": number
  },
  "whatIfScenarios": [
    { "scenario": string, "rainfallMM": number, "yieldImpact": string, "riskLevel": "low|medium|high" }
  ],
  "recommendation": string,
  "riskAnalysis": string
}
```

#### Rendering

The result page renders:
- **Side-by-side comparison** — AI vs Traditional cards with full input schedule tables
- **What-If Rainfall Scenarios** — three colored cards (green/yellow/red by risk level)
- **K2 Recommendation** — plain-language conclusion and risk analysis in a dark green banner

---

### 6.4 AI Recommendations (Soil Page)

**File:** `src/pages/soil.js`  
**Route:** `#/soil`  
**Data sources:** Serper (`/news`), K2 (`/api/recommendations`)

Provides crop recommendations, fertilizer plans, and best practices based on location and soil data.

#### Input Form

Two panels collect:
- **Location & Season**: State (27 Indian states), crop season (Kharif/Rabi/Zaid), soil type (12 types), farm size
- **Soil & Climate Data**: pH, N/P/K (kg/ha), annual rainfall (mm), average temperature (°C)

NPK bars update live as the user types, using `input` event listeners on the three number fields.

#### How Recommendations Are Generated

`POST /api/recommendations` sends all form data. The worker:
1. Fetches Serper context for `"best crops [season] [soilType] [location] agriculture advisory"`
2. Calls K2 with structured JSON schema for `recommendedCrops`, `fertilizerPlan`, `bestPractices`, `soilHealthSummary`

#### K2 JSON Schema for Recommendations

```json
{
  "recommendedCrops": [
    {
      "name": string,
      "suitability": "highly-suitable|suitable|moderate",
      "reason": string,
      "expectedYield": string,
      "marketPrice": string,
      "waterNeeds": string,
      "duration": string
    }
  ],
  "fertilizerPlan": {
    "basalDose": [{ "fertilizer": string, "quantity": string, "timing": string }],
    "topDress": [{ "fertilizer": string, "quantity": string, "timing": string }],
    "micronutrients": [{ "nutrient": string, "application": string, "quantity": string }]
  },
  "bestPractices": [{ "title": string, "description": string }],
  "soilHealthSummary": string
}
```

#### Rendered Output

- **Recommended Crops grid** — up to 6 crops with suitability badges, expected yield, market price, water needs, duration
- **Fertilizer Plan** — three columns: Basal Dose, Top Dressing, Micronutrients — each with fertilizer name, quantity, timing
- **Best Practices** — numbered grid with title + description
- **Soil Health Summary** — paragraph from K2

---

### 6.5 Disease Detection

**File:** `src/pages/disease.js`  
**Route:** `#/disease`  
**Data sources:** Llama Vision (Stage 1) + K2 (`/api/analyze`) (Stage 2)

This is the most technically complex feature. It uses a two-stage AI pipeline to diagnose crop diseases from photos.

#### Image Capture

Users can provide an image in two ways:
- **File upload** — `<input type="file" accept="image/*">` for gallery images
- **Camera capture** — `<input type="file" accept="image/*" capture="environment">` for direct camera, forcing the rear camera on mobile

The selected file is read with `FileReader.readAsDataURL()` and displayed as a preview. The base64 data URI is stored in the image's `src` attribute.

#### Sending the Image to the Worker

When the user clicks "Analyze":

```javascript
// Frontend: convert preview img src back to base64
const response = await fetch(img.src);
const blob = await response.blob();
const reader = new FileReader();
reader.onloadend = async () => {
  const base64 = reader.result.split(',')[1];  // strip data URI prefix
  const mimeType = blob.type;
  const crop = document.getElementById('disease-crop')?.value || '';
  const data = await analyzeDisease({ base64Image: base64, mimeType, crop });
  // render results
};
reader.readAsDataURL(blob);
```

#### Worker: Stage 1 — Llama Vision Call

```javascript
// agriintel-worker.js /api/analyze handler
async function handleAnalyze(req, env) {
  const { base64Image, mimeType, crop, language, location } = await req.json();

  // Stage 1: Llama Vision observes the image
  let visualObservation = '';
  let glmError = null;
  try {
    const llamaRes = await fetch(LLAMA_VISION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.LLAMA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-vision-latest',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            },
            {
              type: 'text',
              text: `You are a visual analysis expert. Carefully examine this ${crop || 'crop'} image and describe in technical detail: visible symptoms (color changes, lesions, spots, necrosis, wilting), affected plant parts, extent of damage, any visible pathogens or insects. Do NOT diagnose — only observe and describe what you see.`
            }
          ]
        }],
        max_tokens: 600
      })
    });
    const llamaData = await llamaRes.json();
    visualObservation = llamaData.choices?.[0]?.message?.content ?? '';
  } catch (e) {
    glmError = e.message;
    // Continue to Stage 2 without visual observation
  }

  // Stage 2: K2 applies agronomic reasoning
  const sys = `You are an expert plant pathologist and agronomist.
${visualObservation ? `Visual observation from image analysis:\n${visualObservation}\n\n` : ''}
${location ? `Farm location: ${location}.` : ''}
Provide diagnosis in structured markdown format:
## Diagnosis
## Confidence Level
## Severity Score (1-10)
## Recommended Treatment
### Chemical Options (with approximate cost in local currency)
### Organic / Low-Cost Options
## Preventive Measures
## When to Seek Further Help
${langInstruction(language)}`;

  const r = await k2([
    { role: 'system', content: sys },
    {
      role: 'user',
      content: `Analyze this ${crop || 'crop'} for diseases, pests, or nutrient deficiencies. Provide treatment advice suitable for local farmers.`
    }
  ], env, { stream: false, maxTokens: 1200 });

  const d = await r.json();
  const raw = d.choices?.[0]?.message?.content ?? '';

  return jsonResp({
    result: raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim(),
    visualObservation,
    glmError,
    pipeline: glmError
      ? 'Llama Vision (failed) → K2 (location+crop only)'
      : 'Llama Vision → K2'
  });
}
```

#### Loading Bar Animation

A two-stage loading animation reflects the pipeline:
```javascript
loadingStage.textContent = 'Stage 1: Llama Vision analysing image…';
loadingBar.style.width = '20%';

const stageTimer = setTimeout(() => {
  loadingStage.textContent = 'Stage 2: K2 applying agronomic reasoning…';
  loadingBar.style.width = '65%';
}, 3500);  // switches after ~3.5s when Llama typically completes
```

#### Parsing the Markdown Report

```javascript
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
```

These three values populate the KPI cards at the top of the results section.

#### Severity Color Coding

| Score | Color | Urgency | Action |
|---|---|---|---|
| 8–10 | Red (error) | Critical | Treat immediately |
| 4–7 | Yellow (tertiary) | Moderate | Act within 48 hours |
| 1–3 | Green (primary) | Low | Monitor weekly |

#### GLM Observation Section

The raw Llama Vision output is shown in a collapsible `<details>` element, so agronomists can inspect exactly what the vision model saw before K2 interpreted it. This is useful for calibrating expectations and understanding confidence.

---

### 6.6 Weather & Risk Intelligence

**File:** `src/pages/weather.js`  
**Route:** `#/weather`  
**Data sources:** Serper only (`/search`, `/news`) + rule-based worker logic

This page uses **no K2 calls** — all intelligence comes from live Serper data and deterministic rule-based logic in the worker.

#### Live Weather Fetching

`getSerperWeather()` queries `"weather today [district], [state], [country]"`. The `answerBox` in Google Search results typically contains structured weather data (temperature, conditions) for major cities. For smaller districts, the frontend extracts temperature from snippets using regex.

#### Rule-Based Alert Generation

The worker applies simple keyword and numeric rules to generate alerts — no AI required:

```javascript
const condStr = String(currentConditions.conditions || '').toLowerCase();
const tempStr = String(currentConditions.temperature || '');

if (condStr.includes('rain') || condStr.includes('storm') || condStr.includes('thunder')) {
  alerts.push({ type: 'storm', severity: 'medium', ... });
  score = 75;
} else if (condStr.includes('hot') || parseInt(tempStr) > 35) {
  alerts.push({ type: 'heatwave', severity: 'high', ... });
  score = 65;
} else if (condStr.includes('snow') || parseInt(tempStr) < 5) {
  alerts.push({ type: 'frost', severity: 'critical', ... });
  score = 60;
}
```

Alert types: `storm`, `heatwave`, `frost`, `drought`, `flood`, `pest-favorable`

#### Yield Impact Score

A single numeric score (0–100) is derived deterministically:
- 85+ = favorable conditions, no active alerts
- 75 = moderate alerts (storm risk)
- 65 = high severity (heatwave)
- 60 = critical severity (frost)
- Decrements by 5 per additional alert

#### Action Advisories

Pre-built advisories based on alert type:
- **immediate**: Drain fields if rain/storm detected
- **this-week**: Monitor for seasonal pests under current conditions

---

### 6.7 Market Intelligence

**File:** `src/pages/market.js`  
**Route:** `#/market`  
**Data sources:** Serper only (`/search`, `/news`, `/places`) + rule-based worker

This page uses **no K2 calls** — all market intelligence comes from live Google Search data and simple arithmetic.

#### Live Price Extraction

The worker queries `"[crop] market price today [location] per quintal 2025 2026"`. A regex extracts the price:

```javascript
const pm = priceContext.match(/(?:₹|Rs\.?\s*|USD?\s*)(\d[\d,]+)/i);
if (pm) livePrice = parseInt(pm[1].replace(/,/g, ''), 10);
```

If Google's answer box contains a direct price, that is preferred over snippet extraction.

#### 3-Month Forecast Algorithm

Simple multiplier-based projection:
```javascript
const basePrice = livePrice || 2500;
forecast = [
  { month: "Next Month",    price: Math.round(basePrice * 1.02) },
  { month: "In 2 Months",   price: Math.round(basePrice * 1.05) },
  { month: "In 3 Months",   price: Math.round(basePrice * 1.03) },
]
```

This is intentionally simple — it communicates the concept of price appreciation without making claims the system cannot support.

#### Trend Detection

```javascript
trend = newsContext.toLowerCase().includes('fall') ? 'down'
      : newsContext.toLowerCase().includes('rise') ? 'up'
      : 'stable';
```

#### Profit Estimation

If the user provides their farm size in acres:
```javascript
profitEstimate = Math.round(basePrice * 15 * parseInt(landAcres));
// Assumes ~15 quintal/acre average yield
```

#### Nearby Mandis via Google Places

```javascript
const pd = await serper("/places", { q: `agricultural market APMC mandi ${location}` });
mandis = (pd.places || []).slice(0, 5).map(p => p.title);
```

---

### 6.8 Farmer Network

**File:** `src/pages/network.js`  
**Route:** `#/network`  
**Data sources:** Serper (`/search`) only

Benchmarks a farmer's yield against district top performers and provides improvement actions.

#### How Benchmarking Works

1. User enters: district, crop, their yield (quintal/acre), current practices
2. Worker queries: `"best [crop] farming practices yield per acre [location] top farmers"`
3. Snippets from search results are used as `topPractices` source material
4. Static yield lookup table provides district context:
   ```javascript
   // Worker: static crop yield reference
   // Soybean: 10-12 quintal/acre, Cotton: 6-8, etc.
   ```
5. User percentile is estimated from their entered yield vs the reference

The `communityInsights` field contains a 200-character excerpt from the Serper snippets.

#### Improvement Actions

Three standard improvement actions are always returned with effort levels and expected impact:
- Soil testing and targeted fertilization (`medium` effort, `+5% yield`)
- Weather pattern monitoring (`low` effort, `-10% crop loss`)
- Drip irrigation (`high` effort, `+15% yield`)

---

### 6.9 Marketplace & Services

**File:** `src/pages/shop.js`  
**Route:** `#/shop`  
**Data sources:** Serper (`/places`, `/news`, `/search`) + K2 (`/api/marketplace`)

A procurement hub combining live Google Places vendor data with K2 product recommendations.

#### Category System

Nine categories with dedicated search terms:

| Category | Places Search Query |
|---|---|
| Seeds | `"certified seeds varieties agricultural seeds dealer"` |
| Fertilizers | `"fertilizer NPK urea DAP MOP dealer shop"` |
| Pesticides | `"pesticide insecticide fungicide herbicide agricultural dealer"` |
| Equipment | `"farm equipment tractor power tiller sprayer dealer rental"` |
| Drone Services | `"agricultural drone spraying service provider"` |
| Soil Testing | `"soil testing laboratory accredited ICAR"` |
| Mandis/Market | `"APMC agricultural produce market committee yard"` |
| Logistics | `"cold storage warehouse farm produce logistics transport"` |

#### Non-Agriculture Filtering

A critical filter prevents irrelevant results:
```javascript
const nonAgriKeywords = [
  'hotel', 'motel', 'inn', 'restaurant', 'cafe', 'bistro', 'bar', 'pub',
  'salon', 'spa', 'gym', 'fitness', 'school', 'college', 'hospital',
  'clinic', 'pharmacy', 'bank', 'atm'
];
const filtered = places.filter(p => {
  const text = [(p.title || ''), (p.category || '')].join(' ').toLowerCase();
  return !nonAgriKeywords.some(k => text.includes(k));
});
```

#### K2 Product Recommendations

K2 recommends **product types** (not store names) with realistic price ranges. The system prompt explicitly prevents hallucinating vendor names:
> "IMPORTANT: Do NOT suggest specific or real-world local store names. Only recommend TYPES of agricultural products."

Each recommendation includes:
- Category, description, estimated price range
- `availability`: `widely-available`, `limited`, or `seasonal`
- `procurementTip`: how to source it

#### Government Schemes

Three standard schemes are always included in K2's response:
- PM-KISAN (farmer income support)
- Soil Health Card (free soil testing)
- PMFBY Crop Insurance

---

### 6.10 Feedback Loop

**File:** `src/pages/feedback.js`  
**Route:** `#/feedback`  
**Data sources:** Serper (`/news`) + rule-based keyword analysis

Allows farmers to log real-world outcomes against AI suggestions, closing the accuracy feedback loop.

#### Accuracy Assessment

Pure keyword matching — no AI required:
```javascript
const positive = ['worked', 'good', 'success', 'improved', 'high', 'great'];
const negative = ['failed', 'loss', 'wrong', 'worse', 'low', 'bad'];

const text = String(actualOutcome).toLowerCase();
const isPositive = positive.some(w => text.includes(w));
const isNegative = negative.some(w => text.includes(w));

accuracyAssessment = isPositive ? 'accurate'
                   : isNegative ? 'inaccurate'
                   : 'partially-accurate';
```

#### Revised Recommendation

The worker fetches current best practices from Serper News for the suggestion type and crop, then returns the first relevant snippet as the revised recommendation.

#### Season Performance Display

Static demonstration data for three seasons (Kharif 2024, Rabi 2023-24, Kharif 2023) shows predicted vs actual yields with accuracy percentages. This is front-end only (no API call) and demonstrates the system's accuracy tracking concept.

---

## 7. Cloudflare Worker — All Backend Routes

All routes accept `POST` with `Content-Type: application/json`. Full CORS headers are included on all responses (`Access-Control-Allow-Origin: *`).

### Complete Route Table

| Route | AI Used | Description | Max Tokens |
|---|---|---|---|
| `POST /api/chat` | K2 (streaming SSE) | Multi-turn farm advisory. Filters `<think>` blocks in real-time | 1500 |
| `POST /api/analyze` | Llama Vision → K2 | Two-stage disease detection. Stage 1: visual observation; Stage 2: diagnosis + treatment | 600 + 1200 |
| `POST /api/experiment` | K2 (JSON) + Serper | Crop experiment simulation: AI vs traditional methods | 2048 |
| `POST /api/soil` | K2 (JSON) + Serper | Soil profile, fertilizer plan, seasonal calendar | 2048 |
| `POST /api/recommendations` | K2 (JSON) + Serper | Crop + fertilizer recommendations from soil/climate data | 3000 |
| `POST /api/weather` | Serper only | Live weather + rule-based alert generation | — |
| `POST /api/market` | Serper only | Live prices, 3-month forecast, profit estimator | — |
| `POST /api/community` | Serper only | Farmer benchmarking from web search practices | — |
| `POST /api/marketplace` | K2 (JSON) + Serper | Product recommendations + local vendor discovery | 2048 |
| `POST /api/feedback` | Serper + keyword analysis | Outcome logging with accuracy assessment | — |
| `POST /api/serper/weather` | Serper `/search` | Raw live weather data | — |
| `POST /api/serper/market` | Serper `/search` + `/news` | Raw live prices + market news | — |
| `POST /api/serper/news` | Serper `/news` | Agriculture news feed | — |
| `POST /api/serper/places` | Serper `/places` | Local agri vendor search with filtering | — |

### K2 Helper Functions

#### `k2(messages, env, options)` — Core K2 Caller

```javascript
async function k2(messages, env, { stream = false, json = false, maxTokens = 2048 } = {}) {
  const body = { model: K2_MODEL, messages, temperature: 0.7, max_tokens: maxTokens, stream };
  if (json) body.response_format = { type: 'json_object' };
  const r = await fetch(K2_URL, { method: 'POST', headers: { Authorization: `Bearer ${env.K2_API_KEY}` }, body: JSON.stringify(body) });
  return r;
}
```

#### `k2Json(messages, env, opts)` — JSON Response with Fallback

Calls K2, strips `<think>` blocks and markdown fences, then parses JSON. Falls back to regex extraction of `{...}` if standard parse fails. Returns `{}` if completely malformed, never throws.

#### `streamResponse(k2Res)` — SSE Stream Filter

Wraps K2's streaming response in a `TransformStream`. Reads SSE chunks line-by-line, buffers incomplete lines, detects `<think>` block start/end, and forwards only clean content tokens to the browser.

### Serper Helper Functions

#### `serper(endpoint, payload, env)` — Core Serper Caller

Calls `https://google.serper.dev/{endpoint}` with API key in `X-API-KEY` header.

#### `searchPayload(q, options)` — Search Payload Builder

Builds locale-aware search payloads with `gl` (country) and `hl` (language) parameters.

#### `extractSnippets(data, limit)` — Content Extractor

Extracts and joins the first `limit` organic result snippets into a single context string for K2 prompts.

### CORS Implementation

```javascript
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
// OPTIONS preflight
if (request.method === 'OPTIONS') return corsOk(); // 204 no content
```

---

## 8. Frontend Architecture

### SPA Router (`src/router.js`)

Hash-based routing — no server-side routing required:

```javascript
export class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.navigate());
    if (!window.location.hash) window.location.hash = '#/';
  }
  navigate() {
    const path = window.location.hash.replace('#', '') || '/';
    const route = this.routes.find(r => r.path === path) || this.routes[0];
    window.dispatchEvent(new CustomEvent('route-change', { detail: route }));
  }
}
```

### App Bootstrap (`src/main.js`)

On every `route-change` event:
1. Renders sidebar (with active state for current path)
2. Renders topbar (location badge from `userPrefs`)
3. Renders location modal HTML (hidden)
4. Renders page content via `route.render()`
5. Calls `route.init()` in `requestAnimationFrame` (ensures DOM is ready)
6. Calls `initLocationModal()` to attach settings modal handlers

### Page Module Pattern

Every page exports two functions:

```javascript
// render() — pure function, returns HTML string, no side effects
export function renderDashboard() {
  return `<main class="ml-64 mt-16 p-8 min-h-screen page-enter">...</main>`;
}

// init() — called after DOM insertion, attaches events, loads data
export function initDashboard() {
  const cropSel = document.getElementById('dash-crop');
  cropSel?.addEventListener('change', loadMarket);
  loadAll();
}
```

### User Preferences Store (`src/services/api.js`)

```javascript
export const userPrefs = {
  city: 'Nanded', district: 'Nanded', state: 'Maharashtra',
  country: 'India', language: 'en', crop: 'Soybean',
};

export function setPrefs(patch) {
  Object.assign(userPrefs, patch);
  localStorage.setItem('agriintel_prefs', JSON.stringify(userPrefs));
  window.dispatchEvent(new CustomEvent('prefs-changed', { detail: userPrefs }));
}

export function loadPrefs() {
  const saved = JSON.parse(localStorage.getItem('agriintel_prefs') || '{}');
  Object.assign(userPrefs, saved);
}
```

`prefs-changed` events are listened to on Dashboard and Weather pages to auto-reload data when the user changes location.

### API Service Layer

Every exported function in `src/services/api.js` wraps a `post()` call with locale injection:

```javascript
function withLocale(body) {
  return {
    district: userPrefs.district,
    state:    userPrefs.state,
    country:  userPrefs.country,
    language: userPrefs.language,
    ...body,   // caller's fields override defaults
  };
}
```

### Component Structure

| Component | File | Purpose |
|---|---|---|
| Sidebar | `src/components/sidebar.js` | Left nav, 10 items, active state, K2 CTA |
| Topbar | `src/components/topbar.js` | Search bar, location badge, language badge, notifications |
| Location Modal | `src/components/location-modal.js` | Settings modal — city/state/country/language/crop |

All components render pure HTML strings and are re-rendered on every route change (no virtual DOM, no diffing).

---

## 9. Data Flow Diagrams

### Disease Detection Full Flow

```
User uploads image
        │
        ▼
FileReader.readAsDataURL()
        │
        ▼ base64 + mimeType + crop
POST /api/analyze
        │
        ├──▶ Stage 1: Llama Vision API
        │         image → visual symptoms description
        │         └──▶ visualObservation (text)
        │                   │
        │                   ▼ (if fails → glmError = true)
        │
        └──▶ Stage 2: K2-Think-v2 API
                  (visualObservation + crop + location) → diagnosis
                  └──▶ markdown report
                            │
                            ▼
                  { result, visualObservation, glmError, pipeline }
                            │
                            ▼
                  Frontend: parseMarkdownBasic() → HTML
                  Frontend: extractInfo() → KPI cards
                  Frontend: show/hide GLM block + error banner
```

### Market Intelligence Flow

```
User selects crop
        │
        ├──▶ getSerperMarket()           POST /api/serper/market
        │         Serper /search → price results
        │         Serper /news  → market news
        │         └──▶ { priceResults, priceAnswerBox, newsResults }
        │
        ├──▶ getSerperNews(market)       POST /api/serper/news
        │         Serper /news → commodity news
        │
        └──▶ getMarketData()             POST /api/market
                  Serper /search → priceContext
                  Serper /news   → newsContext
                  Serper /places → mandis list
                  regex extract livePrice
                  calculate forecast × 1.02/1.05/1.03
                  └──▶ { mspPrice, trend, forecast, profitMaximizer, nearbyMandis }
```

---

## 10. Localization System

### Supported Languages

| Code | Language | Serper `gl` | Serper `hl` | K2 Instruction |
|---|---|---|---|---|
| `en` | English | `us` | `en` | (none — default) |
| `hi` | Hindi | `in` | `hi` | "Respond entirely in Hindi. Use simple vocabulary appropriate for farmers." |
| `mr` | Marathi | `in` | `mr` | "Respond entirely in Marathi..." |
| `es` | Spanish | `es` | `es` | "Respond entirely in Spanish..." |
| `fr` | French | `fr` | `fr` | "Respond entirely in French..." |
| `pt` | Portuguese | `br` | `pt` | "Respond entirely in Portuguese..." |
| `ar` | Arabic | `sa` | `ar` | "Respond entirely in Arabic..." |
| `bn` | Bengali | `bd` | `bn` | "Respond entirely in Bengali..." |
| `te` | Telugu | `in` | `te` | "Respond entirely in Telugu..." |
| `ta` | Tamil | `in` | `ta` | "Respond entirely in Tamil..." |
| `kn` | Kannada | `in` | `kn` | "Respond entirely in Kannada..." |
| `gu` | Gujarati | `in` | `gu` | "Respond entirely in Gujarati..." |
| `pa` | Punjabi | `in` | `pa` | "Respond entirely in Punjabi..." |

### How Locale Affects Each Service

- **K2 Chat/Soil/Experiment**: `langInstruction(lang)` appended to system prompt makes K2 respond entirely in the selected language
- **Serper Search/News**: `gl` + `hl` parameters localise results — Hindi users get Hindi news sources, Malayalam users get local results
- **Serper Places**: Business names and addresses returned in local script where available
- **UI labels**: Currently in English; language switching affects AI responses and search results only

### Language Storage

Language preference is stored in `userPrefs.language` and persisted to `localStorage`. It is injected into every API call via `withLocale()`.

---

## 11. Design System

### Color Palette (Material Design 3)

All colors defined as Tailwind CSS tokens in `index.html`'s `tailwind.config`:

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#123b2a` | Main brand, CTAs, active nav, headings |
| `primary-container` | `#2a5240` | Primary hover states, dark backgrounds |
| `on-primary` | `#ffffff` | Text on primary backgrounds |
| `primary-fixed` | `#c1ecd4` | Light primary backgrounds |
| `secondary` | `#2b5bb5` | Market/price data, badges, links |
| `secondary-container` | `#759efd` | Secondary hover states |
| `tertiary` | `#472d25` | Warnings, moderate severity alerts |
| `tertiary-fixed` | `#ffdbd0` | Light warning backgrounds |
| `error` | `#ba1a1a` | Critical alerts, high disease severity |
| `error-container` | `#ffdad6` | Light error backgrounds |
| `surface` | `#f8faf8` | Main page background |
| `surface-container-lowest` | `#ffffff` | Card backgrounds (highest contrast) |
| `surface-container-low` | `#f2f4f2` | Input backgrounds |
| `surface-container` | `#eceeec` | Secondary containers |
| `on-surface` | `#191c1b` | Primary text |
| `on-surface-variant` | `#424841` | Secondary text, labels |
| `outline` | `#727970` | Muted text, icon defaults |
| `outline-variant` | `#c2c8be` | Subtle borders, dividers |

### Typography

| Class | Font | Use |
|---|---|---|
| `font-headline` | Manrope 800/700/600 | Page titles, KPI numbers, card headings |
| `font-body` | Inter 400/500 | Body text, descriptions, snippets |
| `font-label` | Inter 600/700 | Labels, badges, navigation, buttons |

### Border Radius System

```
DEFAULT: 0.125rem  (2px — micro elements)
lg:      0.25rem   (4px)
xl:      0.5rem    (8px — inputs)
2xl:     1rem      (16px — medium cards)
3xl:     1.5rem    (24px — large panels)
full:    9999px    (pills, badges)
```

### Animation

Page transitions use a `fadeSlideIn` keyframe animation:
```css
.page-enter { animation: fadeSlideIn 0.25s ease-out both; }

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

The `page-enter` class is applied to every `<main>` element.

### Skeleton Loaders

All sections show skeleton loaders while data loads:
```javascript
function skeleton(n, cls = 'h-12') {
  return Array(n).fill(
    `<div class="bg-surface-container-low rounded-xl animate-pulse ${cls}"></div>`
  ).join('');
}
```

---

## 12. Environment Variables & Secrets

Set via Wrangler before deploying:

```bash
wrangler secret put K2_API_KEY
wrangler secret put SERPER_API_KEY
wrangler secret put LLAMA_API_KEY
```

| Secret | Service | Used By |
|---|---|---|
| `K2_API_KEY` | MBZUAI K2-Think-v2 at `api.k2think.ai` | All K2 routes |
| `SERPER_API_KEY` | Serper.dev at `google.serper.dev` | All Serper routes |
| `LLAMA_API_KEY` | Llama Vision API | `/api/analyze` Stage 1 |

**Security:** All API keys are stored as Cloudflare Worker secrets — they are never exposed to the frontend, never appear in JavaScript bundles, and are only accessible inside the Worker runtime via `env.KEY_NAME`.

---

## 13. Project File Structure

```
agriintel-k2/
│
├── index.html                    # App shell — Tailwind CDN, fonts, Tailwind config, <div id="app">
├── package.json                  # Vite dev dependency only (no runtime dependencies)
├── package-lock.json             # Lockfile
├── vite.config.js                # Dev server on port 3000, root: '.'
├── agriintel-worker.js           # Cloudflare Worker — ALL backend logic (single file)
│
└── src/
    │
    ├── main.js                   # App bootstrap — router init, route-change handler, page assembly
    ├── router.js                 # Hash-based SPA router class
    ├── style.css                 # Global styles: fonts, animations, scrollbar, prose overrides
    │
    ├── services/
    │   └── api.js                # All API fetch functions, userPrefs store, locale injection
    │
    ├── components/
    │   ├── sidebar.js            # Left nav — 10 items, active state calculation, K2 CTA button
    │   ├── topbar.js             # Top bar — search input, location badge, settings button
    │   └── location-modal.js    # Settings modal — location/language/crop inputs + save logic
    │
    └── pages/
        ├── dashboard.js          # Home — live weather, market, news, KPIs, AI forecast
        ├── research.js           # K2 chat — streaming SSE, modes, quick prompts
        ├── lab.js                # Crop experiment simulator — AI vs traditional comparison
        ├── soil.js               # AI recommendations — crop + fertilizer plans
        ├── disease.js            # Disease detection — Llama Vision + K2 two-stage pipeline
        ├── weather.js            # Weather risk — Serper data + rule-based alerts
        ├── market.js             # Market intelligence — live prices + AI forecast
        ├── network.js            # Farmer benchmarking — yield comparison
        ├── shop.js               # Marketplace — Google Places vendors + K2 recommendations
        └── feedback.js           # Feedback loop — outcome logging + accuracy assessment
```

---

## 14. Setup & Deployment Guide

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- Wrangler CLI
- K2 API key from `api.k2think.ai`
- Serper API key from `serper.dev`
- Llama Vision API key

### Local Development

```bash
# Clone and install
git clone <repo>
cd agriintel-k2
npm install

# Start Vite dev server at http://localhost:3000
npm run dev
```

The frontend makes API calls to the **live Worker URL** (`https://agriintel-worker.vishwajeetadkine705.workers.dev`) during development. No local backend server is needed.

### Deploy the Cloudflare Worker

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Set API secrets (you will be prompted to paste the values)
wrangler secret put K2_API_KEY
wrangler secret put SERPER_API_KEY
wrangler secret put LLAMA_API_KEY

# Deploy the worker
wrangler deploy agriintel-worker.js
```

After deployment, Wrangler will output your Worker URL. Update `WORKER_URL` in `src/services/api.js` with the new URL.

### Build & Deploy Frontend

```bash
# Production build → /dist folder
npm run build

# Preview production build locally
npm run preview
```

The `/dist` folder is a static site that can be deployed to:
- **Cloudflare Pages** — `wrangler pages deploy dist`
- **Vercel** — `vercel --prod`
- **Netlify** — drag `/dist` to Netlify dashboard
- Any static file host (GitHub Pages, S3 + CloudFront, etc.)

### Updating the Worker URL

After deploying your own Worker, update this line in `src/services/api.js`:

```javascript
const WORKER_URL = 'https://your-worker-name.your-subdomain.workers.dev';
```

---

## 15. Error Handling & Fallbacks

### Worker-Level Error Handling

```javascript
// All route handlers are wrapped in try/catch
try {
  switch (pathname) {
    case '/api/analyze': return handleAnalyze(request, env);
    // ...
  }
} catch (err) {
  console.error('Worker error:', err);
  return errResp(err.message || 'Internal server error');
}
```

### K2 JSON Parsing Fallback Chain

1. Standard `JSON.parse()` on stripped response
2. Regex extraction of `{...}` block if standard parse fails
3. Return `{}` as last resort (never throw to the client)

```javascript
try {
  return JSON.parse(raw);
} catch {
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch {}
  }
  return {};  // never crash the route
}
```

### Disease Detection Fallback

If Llama Vision fails, K2 is still called with location and crop context only:
```javascript
let visualObservation = '';
let glmError = null;
try {
  visualObservation = await callLlamaVision(base64Image, mimeType, crop);
} catch (e) {
  glmError = e.message;  // pass error to frontend for display
  // continue to K2 without visual context
}
```

### Frontend Error Display

Each page section has its own error state:
```javascript
} catch (e) {
  el.innerHTML = `<p class="text-sm text-error p-4">Error: ${e.message}</p>`;
}
```

Errors are scoped to individual sections — a weather API failure doesn't crash the entire dashboard.

### Serper Places Anti-Noise Filter

Non-agriculture results are filtered out both in `/api/marketplace` and `/api/serper/places`:
```javascript
const nonAgriKeywords = ['hotel', 'restaurant', 'cafe', /* ... */];
const filtered = places.filter(p => {
  const text = (p.title + ' ' + p.category).toLowerCase();
  return !nonAgriKeywords.some(k => text.includes(k));
});
```

---

## 16. Performance Considerations

### Parallel Data Loading

All dashboard sections load independently in parallel — no sequential waterfalls:
```javascript
// All five async calls fire simultaneously
loadLiveWeather();   // ~300ms (Serper)
loadSerperMarket();  // ~400ms (Serper × 2)
loadNews();          // ~300ms (Serper)
loadWeather();       // ~500ms (Serper + rule eval)
loadMarket();        // ~600ms (Serper × 3 + arithmetic)
```

Total time ≈ 600ms (slowest call), not 2100ms (sum of all).

### No Runtime Dependencies

The frontend has zero runtime JavaScript dependencies. Tailwind CSS is loaded from CDN. This keeps the production bundle under 50KB (excluding fonts).

### Cloudflare Edge

The Worker runs at Cloudflare's nearest edge node to the user — typically <50ms to the Worker, regardless of where K2 or Serper's servers are located.

### Skeleton-First Rendering

Pages render immediately with skeleton loaders. Data fills in as it arrives. Users see content within milliseconds of navigation, even over slow connections.

### Image Handling

Base64 images are transferred inline in the JSON request body. For typical crop photos (1-3MB), the base64 encoding adds ~33% overhead. The Worker streams large responses back rather than buffering.

---

## 17. Security Architecture

### API Key Protection

All API keys live exclusively in Cloudflare Worker secrets:
- They never appear in `index.html`, JavaScript bundles, or client-side code
- They are not accessible via browser DevTools, network inspection, or source code
- Cloudflare encrypts secrets at rest and in transit

### CORS Policy

The Worker allows requests from any origin (`*`) — appropriate for a public-facing SPA that can be self-hosted. Production deployments can restrict this to specific domains:
```javascript
// Restrict to specific domain in production
'Access-Control-Allow-Origin': 'https://yourdomain.com'
```

### Input Validation

Each handler validates required fields before calling external APIs:
```javascript
if (!message) return errResp("Missing 'message'", 400);
if (!crop) return errResp("Missing 'crop'", 400);
```

### No User Data Storage

The platform stores nothing server-side. User preferences are stored only in `localStorage` in the user's own browser. No user accounts, no databases, no PII at rest.

### Serper Place Filtering

The server-side filtering of non-agriculture places prevents the application from inadvertently surfacing irrelevant or potentially inappropriate business listings.

---

*Last updated: April 2026*  
*Model: MBZUAI K2-Think-v2 + Llama Vision*  
*Platform: Cloudflare Workers Edge Runtime*  
*Built for Indian farmers and the global agriculture community*
