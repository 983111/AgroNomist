# AgriIntel K2 — Digital Agronomist Platform

> AI-powered precision agriculture intelligence platform built for Indian farmers. Combines the **MBZUAI K2-Think-v2** language model with **Serper.dev** real-time Google Search, News, and Places APIs to deliver actionable farm intelligence across weather, markets, soil, disease, and more.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [API Strategy — K2 vs Serper](#api-strategy--k2-vs-serper)
5. [Features](#features)
   - [Dashboard](#1-dashboard)
   - [Research — K2 Assistant](#2-research--k2-assistant)
   - [Lab — Crop Simulator](#3-lab--crop-simulator)
   - [Soil Analyzer](#4-soil-analyzer)
   - [Disease Detection](#5-disease-detection)
   - [Weather & Risk Intelligence](#6-weather--risk-intelligence)
   - [Market Intelligence](#7-market-intelligence)
   - [Farmer Network](#8-farmer-network)
   - [Marketplace & Services](#9-marketplace--services)
   - [Feedback Loop](#10-feedback-loop)
6. [Cloudflare Worker — Backend Routes](#cloudflare-worker--backend-routes)
7. [Environment Variables / Secrets](#environment-variables--secrets)
8. [Project Structure](#project-structure)
9. [Setup & Deployment](#setup--deployment)
10. [Localization](#localization)
11. [Design System](#design-system)

---

## Project Overview

AgriIntel K2 is a single-page web application targeted at farmers and agronomists in India (and globally). It acts as a **digital agronomist** — providing real-time weather risk alerts, live mandi (market) prices, AI-powered crop disease diagnosis from photos, soil intelligence, farm experiment simulations, and a farmer benchmarking network.

The platform is intentionally lightweight: no backend database, no authentication server. All intelligence is delivered via a **Cloudflare Worker** that routes requests to either the K2 AI model or Serper's Google Search API depending on the feature.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript (ES Modules), Vite 5 |
| Styling | Tailwind CSS v3 (CDN), custom Material Design 3 color tokens |
| Fonts / Icons | Google Fonts (Manrope, Inter), Material Symbols Outlined |
| Routing | Custom hash-based SPA router (`src/router.js`) |
| Backend | Cloudflare Workers (Edge runtime, zero cold start) |
| AI Model | MBZUAI K2-Think-v2 via `api.k2think.ai` |
| Real-time Data | Serper.dev (Google Search, News, Places APIs) |
| Deployment | Wrangler CLI (`wrangler deploy`) |

---

## Architecture

```
Browser (SPA)
    │
    │  POST /api/*
    ▼
Cloudflare Worker  (agriintel-worker.js)
    │
    ├── K2 API  (MBZUAI K2-Think-v2)
    │     Used for: Chat, Disease Analysis, Crop Experiment, Soil Intelligence
    │
    └── Serper.dev
          ├── /search   → Live weather, market prices, farming practices
          ├── /news     → Agriculture & commodity news
          └── /places   → Local agri vendors, mandis, soil labs
```

The frontend (`src/services/api.js`) is the single point of contact for all API calls. It injects the user's location and language into every request, so all responses are automatically localised.

---

## API Strategy — K2 vs Serper

A deliberate architectural decision was made to use each API only where it genuinely adds value:

### K2 API (MBZUAI K2-Think-v2) — Used for Deep Reasoning

K2 is a large reasoning model. It is **only used where structured thinking, domain expertise, or multimodal vision is required** and real-time data is secondary.

| Feature | Why K2 |
|---|---|
| **Research (Chat)** | Conversational, multi-turn farm advisory requiring agronomic reasoning, language switching (Hindi/Marathi/English), and contextual memory |
| **Disease Detection** | Requires vision (multimodal image input) + expert plant pathology knowledge to diagnose from a crop photo |
| **Lab (Crop Simulator)** | Needs structured comparison between AI-optimised vs traditional methods with cost/profit calculations and rainfall scenario modelling |
| **Soil Analyzer** | Requires expert agronomic reasoning to map district soil profiles to fertiliser schedules, seasonal calendars, and micronutrient plans |

K2 responses are always JSON (`response_format: json_object`) except for the streaming chat endpoint. All K2 outputs strip `<think>...</think>` reasoning blocks before returning to the frontend.

### Serper.dev — Used for Real-Time Data

Serper wraps Google Search, Google News, and Google Places. It is used for **everything that requires live, up-to-date, ground-truth data** that a static AI model cannot reliably provide.

| Feature | Serper Endpoint | What It Fetches |
|---|---|---|
| **Dashboard** weather | `/search` | Live temperature, humidity, conditions for the user's location |
| **Dashboard** market prices | `/search` + `/news` | Live mandi prices per quintal, commodity news |
| **Dashboard** agri news | `/news` | Latest agriculture and farming news |
| **Weather page** | `/search` + `/news` | Full weather details + weather-agriculture news |
| **Market page** | `/search` + `/news` + `/places` | Prices, market news, nearby APMC mandis |
| **Farmer Network** | `/search` | Top farming practices and yield benchmarks |
| **Marketplace** | `/places` + `/search` | Local agri vendors, seeds/fertilizer dealers, mandis |
| **Soil page** | `/news` + `/places` | Crop advisory news, nearby soil testing labs |
| **Feedback** | `/search` | Revised recommendation from current web sources |

---

## Features

### 1. Dashboard

**File:** `src/pages/dashboard.js`

The Dashboard is the home screen and aggregates live intelligence from multiple sources into a single view.

**Sections:**

- **Live Weather Banner** — Fetches current weather for the user's location using `getSerperWeather()`. Displays temperature, current conditions, and a forecast snippet pulled from Google's answer box. Updates on every page load and manual refresh.

- **KPI Cards** — Four summary cards showing: active weather alert count, live market price, yield impact score, and best selling window. These are populated as the underlying data loads.

- **Weather & Risk Intelligence** — Calls `getWeatherRisk()` which hits `/api/weather`. Returns rule-based alerts (flood, drought, heatwave, storm, frost) derived from live Serper weather data. Shows irrigation advice and timeframe for each alert.

- **Quick Actions** — Direct links to K2 Assistant (Research page) and Disease Scanner. Also shows a Market Intelligence shortcut card.

- **Live Market Prices** — Calls `getSerperMarket()` to fetch real-time mandi prices and commodity news from Google Search for the selected crop.

- **Agri News** — Calls `getSerperNews()` to display latest agriculture news headlines with sources and dates.

- **AI Market Forecast** — Calls `getMarketData()` which hits `/api/market`. Returns current price (extracted from Serper), a simple 3-month price projection, storage advice, and nearby mandi names.

**User controls:** Crop selector (14 crops), Refresh button, Location/Language settings via topbar.

---

### 2. Research — K2 Assistant

**File:** `src/pages/research.js`

A full-featured conversational AI chatbot powered exclusively by the K2-Think-v2 model.

**How it works:**

- The user types a question in English, Hindi, or Marathi. The message, a rolling window of the last 6 conversation turns (as context), selected language, and selected mode are sent to `/api/chat`.
- The Worker calls K2 with `stream: true` and pipes the response back as a Server-Sent Events (SSE) stream.
- The frontend reads the SSE stream chunk by chunk, stripping `<think>` blocks in real-time, and types the response into the chat bubble character by character.

**Three Chat Modes:**

| Mode | Behaviour |
|---|---|
| General Advisor | Default farm advisory — diseases, weather, schemes, prices, irrigation |
| Experiment Generator | Proactively suggests 2–3 structured experiments with cost estimates for any question |
| Hypothesis Engine | Gives probability-based insights, e.g. "70% chance this improves yield by 15%" |

**Quick Prompts** — Six pre-written prompts covering the most common farmer questions (fertilizer, disease, market timing, PM-KISAN loan, yield improvement, drip irrigation).

**Language Support** — The system prompt dynamically appends a language instruction (`langInstruction()`) so K2 responds entirely in the user's chosen language using vocabulary appropriate for farmers.

---

### 3. Lab — Crop Simulator

**File:** `src/pages/lab.js`

A virtual experiment simulator that compares AI-optimised farming methods against traditional methods for a configured crop and location.

**How it works:**

1. User selects crop, soil type, district, and expected rainfall (mm).
2. The Worker first fetches real agronomic context from Serper (`/search`) — best practices, yield data for that crop/location.
3. That real-world context is injected into the K2 prompt as grounding data.
4. K2 returns a structured JSON with two method comparisons and three rainfall scenarios.

**Output includes:**

- **AI Optimised Method** — Input schedule (fertilizer name, quantity, timing), expected yield, confidence interval, estimated cost/acre, estimated profit/acre.
- **Traditional Method** — Same fields for baseline comparison.
- **What-If Rainfall Scenarios** — Three scenarios (e.g. deficit, normal, excess) showing yield impact and risk level for each.
- **K2 Recommendation** — A plain-language conclusion and risk analysis.

---

### 4. Soil Analyzer

**File:** `src/pages/soil.js`

Provides soil profile analysis, fertilizer plans, and a seasonal activity calendar for a chosen district and crop.

**How it works:**

The page has three independent data loaders:

1. **Crop Intelligence News** (`getSerperNews()`) — Fetches Google News for soil/crop advisory articles relevant to the selected district. Loads on page open and refreshes when district changes.

2. **Nearby Soil Testing Labs** (`getSerperPlaces()` with `category: "soil-testing"`) — Finds ICAR-accredited and government soil testing labs near the selected district using Google Places. Shows name, rating, address, phone, and map link.

3. **AI Soil Analysis** (`getSoilIntelligence()`) — When the user clicks "Analyze Soil", the Worker fetches real soil/agronomy data from Serper as context, then passes it to K2 which returns:
   - Soil profile (type, pH range, organic carbon, major deficiencies, suitable crops)
   - Fertilizer plan (basal dose at sowing, top dressing schedule with timing, micronutrients)
   - Seasonal activity calendar (month-by-month activities and inputs)
   - Organic alternatives
   - District-specific insights

**Optional sensor data:** Users can expand the form to enter manual soil test readings (pH, N, P, K) which are sent to K2 for a personalised recommendation.

---

### 5. Disease Detection

**File:** `src/pages/disease.js`

An AI-powered crop disease scanner. The user uploads or photographs a diseased plant and K2 performs multimodal vision analysis.

**How it works:**

1. User selects or captures a crop image (file upload or camera).
2. The image is read as a base64 string in the browser.
3. The base64 data, MIME type, and crop name are sent to `/api/analyze`.
4. The Worker sends the image directly to K2 as a multimodal message (`image_url` content type with `data:` URI).
5. K2 responds with a structured markdown report.

**Output format (markdown parsed by frontend):**

```
## Diagnosis
## Confidence Level
## Severity Score (1-10)
## Recommended Treatment
   ### Chemical Options (with cost in local currency)
   ### Organic / Low-Cost Options
## Preventive Measures
## When to Seek Further Help
```

The three key metrics (Diagnosis, Confidence, Severity) are extracted via regex and displayed in highlight cards above the full report. Severity is colour-coded: 8–10 = red (immediate), 4–7 = yellow (48h), 1–3 = green (monitor).

---

### 6. Weather & Risk Intelligence

**File:** `src/pages/weather.js`

**Pure Serper — no K2.**

Provides a full-page weather intelligence view for the user's location.

**Data sources:**

- **Live Weather Banner** — `getSerperWeather()` fetches live temperature and conditions from Google's answer box for the location. Falls back gracefully if unavailable.
- **Weather & Agriculture News** — `getSerperNews()` with topic `"weather monsoon rainfall agriculture"` fetches the latest weather-related farm news.
- **AI Risk Analysis** — `getWeatherRisk()` hits `/api/weather` which runs two Serper calls (search + news), then applies rule-based logic:
  - Parses condition strings for keywords: `"rain"`, `"flood"`, `"storm"`, `"thunder"`, `"dry"`, `"drought"`
  - Parses temperature numerically for heatwave (>40°C) and frost (<5°C) detection
  - Derives `yieldImpactScore` (30–82) based on alert count and severity
  - Generates `advisories` mapped to `immediate` / `this-week` priorities

**Output sections:** Yield Impact Score gauge, Active Alerts list with icons, Action Advisories with priority badges, Optimal Sowing Window, Irrigation Advice.

---

### 7. Market Intelligence

**File:** `src/pages/market.js`

**Pure Serper — no K2.**

Comprehensive market price intelligence for any crop, enriched with news and nearby mandi data.

**Data sources:**

- **Live Market Data banner** — `getSerperMarket()` queries Google Search for `"[crop] market price today [location] per quintal"`. Returns the answer box price (when Google extracts it) plus organic search results linking to price sources.
- **Commodity Market News** — `getSerperNews()` filtered to market/price topics for the selected crop.
- **AI Market Analysis** — `getMarketData()` hits `/api/market`:
  - Runs Serper search + news + places (for nearby mandis)
  - Extracts a numeric price from the answer box or first snippet via regex (`₹` / `Rs.` pattern)
  - Builds a simple 3-month forecast as `livePrice × 1.01 / 1.03 / 1.05`
  - Returns Profit Maximizer with storage advice and best sell time
  - If `landAcres` is provided, estimates total profit

**Output sections:** MSP price, trend indicator, 3-Month Forecast grid, K2 Analysis text, Profit Maximizer panel, Nearby Mandis list, Alternative Crops suggestions.

---

### 8. Farmer Network

**File:** `src/pages/network.js`

**Pure Serper — no K2.**

Benchmarks the farmer's yield against district top performers and provides data-driven improvement actions.

**How it works:**

1. User enters district, crop, their own yield (quintal/acre), and current practices.
2. `/api/community` runs a Serper search for `"best [crop] farming practices yield per acre [location] top farmers"`.
3. The backend applies a static crop-to-yield lookup table (e.g. Soybean → 10–12 quintal/acre average) and calculates a yield percentile from the user's input.
4. `topPractices` are extracted directly from Serper search result titles and snippets with estimated adoption rates and yield lift percentages.
5. Three standard `improvementActions` (soil testing, drip irrigation, certified seeds) are returned with effort and expected impact.

**Output:** Benchmark comparison table, percentile progress bar, What Top Farmers Do panel, Recommended Improvement Actions grid.

---

### 9. Marketplace & Services

**File:** `src/pages/shop.js`

**Pure Serper — no K2.**

A procurement hub for local agri vendors, product recommendations, and government schemes.

**Categories:** Seeds, Fertilizers, Pesticides, Equipment, Drone Services, Soil Testing, Mandis/Market, Logistics.

**Data sources:**

- **Local Vendors** — `getSerperPlaces()` queries Google Places for real local agri businesses matching the selected category in the user's district. Non-agriculture results (hotels, restaurants, etc.) are filtered out server-side. Each vendor card shows name, rating, address, phone (with tap-to-call), and Google Maps link.

- **AI Product Recommendations** — `getMarketplace()` hits `/api/marketplace` which:
  - Runs Serper Places for real vendors
  - Runs Serper Search for product pricing
  - Returns a curated static product catalogue (by category) with realistic price ranges, availability status (`widely-available` / `limited` / `seasonal`), and procurement tips — all without calling K2

- **Government Schemes** — Three standard schemes (PM-KISAN, Soil Health Card, PMFBY Crop Insurance) are always included with application instructions.

- **Local Agriculture News** — `getSerperNews()` for latest farming and market news.

---

### 10. Feedback Loop

**File:** `src/pages/feedback.js`

**Pure Serper + rule-based — no K2.**

Allows farmers to log the real-world outcome of an AI suggestion, closing the accuracy feedback loop.

**How it works:**

1. User selects suggestion type (soil, market, disease, etc.), crop, district, pastes the original AI suggestion (optional), and describes the actual outcome.
2. `/api/feedback` runs a Serper search for current best practices related to that suggestion type and crop.
3. The outcome text is analysed with keyword matching:
   - Words like `"worked"`, `"good"`, `"success"`, `"improved"` → `"accurate"`
   - Words like `"failed"`, `"loss"`, `"wrong"`, `"worse"` → `"inaccurate"`
   - Everything else → `"partially-accurate"`
4. A revised recommendation is built from the first Serper search snippet.

**Output:** Accuracy badge (✅ / ⚠️ / ❌), Gap explanation, Likely Reasons list, Revised Recommendation from web, Learning Note.

The page also displays static season performance data (Kharif 2024, Rabi 2023-24, Kharif 2023) showing predicted vs actual yields as demonstration of the system's accuracy tracking capability.

---

## Cloudflare Worker — Backend Routes

All routes accept `POST` with `Content-Type: application/json`. All responses include full CORS headers.

| Route | AI Used | Description |
|---|---|---|
| `POST /api/chat` | **K2 (streaming)** | Multi-turn farm advisory chatbot. Returns SSE stream. |
| `POST /api/analyze` | **K2 (vision)** | Crop disease detection from base64 image. Returns markdown report. |
| `POST /api/experiment` | **K2 (JSON)** + Serper context | Virtual crop simulator comparing AI vs traditional methods. |
| `POST /api/soil` | **K2 (JSON)** + Serper context | Soil profile, fertiliser plan, seasonal calendar. |
| `POST /api/weather` | **Serper only** | Live weather + rule-based alert generation. |
| `POST /api/market` | **Serper only** | Live prices, 3-month forecast, profit estimator, mandis. |
| `POST /api/community` | **Serper only** | Farmer benchmarking, top practices from web search. |
| `POST /api/marketplace` | **Serper only** | Local vendor discovery + static product catalogue. |
| `POST /api/feedback` | **Serper only** | Outcome logging with keyword-based accuracy assessment. |
| `POST /api/serper/weather` | Serper `/search` | Raw live weather data (used by dashboard + weather page). |
| `POST /api/serper/market` | Serper `/search` + `/news` | Raw live price data + market news. |
| `POST /api/serper/news` | Serper `/news` | Agriculture news feed. |
| `POST /api/serper/places` | Serper `/places` | Local agri vendor search. |

### K2 API Integration Details

K2 is called via `POST https://api.k2think.ai/v1/chat/completions` with the `MBZUAI-IFM/K2-Think-v2` model.

- **Streaming (chat):** `stream: true`, response piped through a `TransformStream` that filters `<think>...</think>` reasoning blocks in real-time before forwarding SSE chunks to the browser.
- **JSON mode (structured data):** `response_format: { type: "json_object" }`. Response is parsed after stripping `<think>` blocks and markdown code fences. Falls back to regex extraction of `{...}` if standard parse fails.
- **Vision (disease):** Image passed as `image_url` content block with `data:[mimeType];base64,[data]` URI.
- `max_tokens` is set per endpoint: 1500 for chat, 1200 for disease, 2048 for experiment/soil.

### Serper API Integration Details

Serper is called via `POST https://google.serper.dev/{endpoint}`.

Three endpoints are used:

- **`/search`** — Returns organic results, answer box, knowledge graph. Used for weather, prices, farming practices, product info. Locale-aware via `gl` (country) and `hl` (language) parameters.
- **`/news`** — Returns news articles with title, snippet, source, date, imageUrl. Used for agriculture news feeds on all pages.
- **`/places`** — Returns local business listings with name, address, phone, rating, category, CID (Google Maps link). Used for vendor discovery and soil lab lookup. Non-agriculture businesses are filtered server-side.

Locale mapping (`gl` / `hl`) is done via a `LOCALE_MAP` object supporting: English, Hindi, Marathi, Spanish, French, Arabic, Bengali, Telugu, Tamil, Kannada, Gujarati, Punjabi.

---

## Environment Variables / Secrets

Set these via Wrangler before deploying:

```bash
wrangler secret put K2_API_KEY
wrangler secret put SERPER_API_KEY
```

| Secret | Description |
|---|---|
| `K2_API_KEY` | Bearer token for `api.k2think.ai` |
| `SERPER_API_KEY` | API key for `google.serper.dev` (set as `X-API-KEY` header) |

These are never exposed to the frontend. All API calls originate from the Cloudflare Worker edge runtime.

---

## Project Structure

```
agriintel-k2/
├── index.html                  # App shell — Tailwind CDN, font imports, <div id="app">
├── package.json                # Vite dev dependency only
├── vite.config.js              # Dev server on port 3000
├── agriintel-worker.js         # Cloudflare Worker — all backend logic
│
└── src/
    ├── main.js                 # App bootstrap, route-change handler, page assembly
    ├── router.js               # Hash-based SPA router
    ├── style.css               # Global styles, animation, scrollbar, prose overrides
    │
    ├── services/
    │   └── api.js              # All fetch calls, userPrefs store, locale injection
    │
    ├── components/
    │   ├── sidebar.js          # Left nav (10 items, active state, K2 CTA)
    │   ├── topbar.js           # Top bar (search, location badge, settings button)
    │   └── location-modal.js   # Settings modal (location, language, crop)
    │
    └── pages/
        ├── dashboard.js        # Home — weather, market, news, KPIs
        ├── research.js         # K2 chat assistant (streaming)
        ├── lab.js              # Crop experiment simulator
        ├── soil.js             # Soil analyzer + labs + news
        ├── disease.js          # Image-based disease detection
        ├── weather.js          # Weather risk + news
        ├── market.js           # Market prices + forecast
        ├── network.js          # Farmer benchmarking
        ├── shop.js             # Marketplace + vendor discovery
        └── feedback.js         # Outcome feedback loop
```

---

## Setup & Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server (http://localhost:3000)
npm run dev
```

The frontend makes API calls to the live Worker URL (`https://agriintel-worker.vishwajeetadkine705.workers.dev`) during development. No local backend is needed.

### Deploy the Cloudflare Worker

```bash
# Install Wrangler globally (if not already)
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Set API secrets
wrangler secret put K2_API_KEY
wrangler secret put SERPER_API_KEY

# Deploy the worker
wrangler deploy agriintel-worker.js
```

### Build & Preview Frontend

```bash
npm run build     # Vite production build → /dist
npm run preview   # Preview the build locally
```

The built `/dist` folder can be deployed to Cloudflare Pages, Vercel, Netlify, or any static host.

---

## Localization

The platform supports 9 languages with full locale routing:

| Code | Language | Google Locale |
|---|---|---|
| `en` | English | `gl:us, hl:en` |
| `hi` | Hindi | `gl:in, hl:hi` |
| `mr` | Marathi | `gl:in, hl:mr` |
| `es` | Spanish | `gl:es, hl:es` |
| `fr` | French | `gl:fr, hl:fr` |
| `sw` | Swahili | — |
| `ta` | Tamil | `gl:in, hl:ta` |
| `te` | Telugu | `gl:in, hl:te` |
| `ar` | Arabic | `gl:sa, hl:ar` |

Language preference is stored in `localStorage` via the `userPrefs` store in `src/services/api.js`. It is injected into every API call so that:
- K2 chat responds in the user's language
- Serper fetches news and search results in the correct regional locale
- Google Places returns local business names and addresses

---

## Design System

The UI uses a custom **Material Design 3** colour system implemented as Tailwind CSS tokens. All colours are defined in `tailwind.config` inside `index.html`.

Key design tokens:

| Token | Usage |
|---|---|
| `primary` (#123b2a) | Main brand colour, CTAs, active states |
| `secondary` (#2b5bb5) | Market/price data, badges |
| `tertiary` (#472d25) | Warnings, moderate severity alerts |
| `error` (#ba1a1a) | Critical alerts, disease severity |
| `surface-container-lowest` | Card backgrounds |
| `outline-variant` | Subtle borders |

Typography uses **Manrope** (headlines, numbers) and **Inter** (body, labels). Page transitions use a `fadeSlideIn` CSS animation (25ms, `page-enter` class applied to every `<main>`).
