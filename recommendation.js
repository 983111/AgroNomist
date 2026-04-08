import { Hono } from 'hono';
import { cors } from 'hono/cors';

/* ═══════════════════════════════════════════════════════════════════════════
   AGRONOMIST RECOMMENDATION ENGINE — recommendation-worker.js
   ─────────────────────────────────────────────────────────────────────────
   Standalone Cloudflare Worker for AI Agronomy Recommendations.
   Takes soil, weather, and farm data to generate a structured JSON plan.
═══════════════════════════════════════════════════════════════════════════ */

const K2_MODEL = 'MBZUAI-IFM/K2-Think-v2';
const K2_API_URL = 'https://api.k2think.ai/v1/chat/completions';
const ALLOWED_ORIGIN = '*'; // Update to your production frontend URL (e.g., Vercel/Netlify URL)

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

/* ═══════════════════════════════════════════════════════════════════════════
   K2 API HELPERS
═══════════════════════════════════════════════════════════════════════════ */
async function k2Json(prompt, env) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(K2_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.K2_API_KEY}`,
        },
        body: JSON.stringify({
          model: K2_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          top_p: 0.85,
        }),
      });

      if (!response.ok) {
        lastError = await response.text();
        if (response.status >= 500 || response.status === 429) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        throw new Error(`K2 Error: ${response.status} ${lastError}`);
      }

      const data = await response.json();
      let rawContent = data.choices?.[0]?.message?.content || '';

      // Strip <think> blocks and markdown
      rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
      rawContent = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

      try {
        return JSON.parse(rawContent);
      } catch (e) {
        // Fallback: extract JSON block if hallucinated text is around it
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error("Invalid output from AI");
      }
    } catch (err) {
      lastError = err.message;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error(`Failed after retries: ${lastError}`);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RECOMMENDATION PROMPT GENERATOR
═══════════════════════════════════════════════════════════════════════════ */
function buildRecommendationPrompt(params) {
  const { 
    district, state, country, season, soilType, farmSize, 
    soilData, rainfall, temperature, language 
  } = params;

  return `
You are the AgriIntel Precision Agronomist, an expert AI advising a farmer.
Based on the following localized environmental and soil data, generate a comprehensive, highly accurate farming recommendation plan.

FARM DATA:
- Location: ${district || 'Unknown'}, ${state || 'Unknown'}, ${country || 'India'}
- Season: ${season || 'Upcoming'}
- Farm Size: ${farmSize || 'Standard'} Acres
- Soil Type: ${soilType || 'Unknown'}
- Soil Health: pH ${soilData?.pH || 'N/A'}, Nitrogen (N) ${soilData?.nitrogen || 'N/A'}, Phosphorus (P) ${soilData?.phosphorus || 'N/A'}, Potassium (K) ${soilData?.potassium || 'N/A'}
- Climate Forecast: ${rainfall || 'N/A'}mm Rainfall, ${temperature || 'N/A'}°C Average Temperature

INSTRUCTIONS:
1. Recommend the top 2 most profitable and viable crops for these exact conditions.
2. Provide a specific soil treatment plan to fix any nutrient deficiencies (e.g., if pH is low, suggest lime; if N is low, suggest urea).
3. Provide an irrigation strategy based on the expected rainfall and temperature.
4. Identify 2 major localized risks (pests, weather, or market) and mitigation strategies.
5. If the requested language is not English (Requested: ${language || 'en'}), translate the user-facing text appropriately, but keep the JSON keys exactly as specified below.

OUTPUT FORMAT:
You MUST return ONLY valid JSON matching this exact structure. Do not include markdown code blocks (like \`\`\`json). Just the raw JSON object.

{
  "executiveSummary": "2-3 sentences summarizing the overall farm outlook and primary advice.",
  "recommendedCrops": [
    {
      "name": "e.g., Soybean",
      "confidence": "High",
      "expectedYieldPerAcre": "e.g., 10-12 Quintals",
      "reason": "Why this is perfect for the current soil and weather."
    },
    {
      "name": "e.g., Cotton",
      "confidence": "Medium",
      "expectedYieldPerAcre": "e.g., 8-10 Quintals",
      "reason": "..."
    }
  ],
  "soilTreatmentPlan": [
    {
      "issue": "e.g., Low Nitrogen",
      "action": "e.g., Apply Neem-Coated Urea",
      "dosage": "e.g., 45kg per Acre",
      "timing": "e.g., Base application before sowing"
    }
  ],
  "irrigationStrategy": "Specific advice based on the provided rainfall and soil type.",
  "riskAlerts": [
    {
      "risk": "e.g., Whitefly Infestation",
      "mitigation": "e.g., Install yellow sticky traps and spray Neem oil at early vegetative stage."
    }
  ]
}
`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   /api/recommendations ROUTE
═══════════════════════════════════════════════════════════════════════════ */
app.post('/api/recommendations', async (c) => {
  try {
    const body = await c.req.json();
    
    // Basic validation
    if (!body.state || !body.soilType) {
      return c.json({ error: 'State and Soil Type are required for an accurate recommendation.' }, 400);
    }

    const prompt = buildRecommendationPrompt(body);

    // Call the K2 Model using robust helper
    const recommendationData = await k2Json(prompt, c.env);

    return c.json(recommendationData);

  } catch (err) {
    console.error("Recommendation Worker Error:", err);
    return c.json({ 
      error: err.message,
      executiveSummary: "We encountered an issue analyzing your farm data. Please try again later.",
      recommendedCrops: [],
      soilTreatmentPlan: [],
      irrigationStrategy: "Data unavailable.",
      riskAlerts: []
    }, 500); // 500 status code but still returns safe JSON schema to prevent frontend crash
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH CHECK
═══════════════════════════════════════════════════════════════════════════ */
app.get('/health', (c) => c.json({ status: 'ok', service: 'ai-recommendation-engine' }));

export default app;