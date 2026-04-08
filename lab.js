import { Hono } from 'hono';
import { cors } from 'hono/cors';

/* ═══════════════════════════════════════════════════════════════════════════
   AGRONOMIST LAB ENGINE — lab-worker.js
   ─────────────────────────────────────────────────────────────────────────
   Standalone Cloudflare Worker for the Virtual Crop Simulator.
   Takes { crop, soil, district, rainfall } and prompts the K2 model to 
   generate a realistic agronomic JSON simulation for the frontend.
═══════════════════════════════════════════════════════════════════════════ */

const K2_MODEL = 'MBZUAI-IFM/K2-Think-v2';
const K2_API_URL = 'https://api.k2think.ai/v1/chat/completions';
const ALLOWED_ORIGIN = '*'; // Update to your production URL later

const app = new Hono();

// Enable CORS for frontend requests
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
          temperature: 0.1,
          top_p: 0.9,
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
   SIMULATION PROMPT GENERATOR
   Ensures the LLM outputs exactly what lab.js expects.
═══════════════════════════════════════════════════════════════════════════ */
function buildSimulationPrompt(crop, soil, district, rainfall) {
  return `
You are the AgroNomist Lab Simulator, an advanced agricultural AI engine.
Your task is to generate a realistic farming simulation comparing traditional methods vs. precision (AI-optimized) methods for a farmer in India.

USER PARAMETERS:
- Crop: ${crop}
- Soil Type: ${soil}
- District: ${district}, Maharashtra (India)
- Baseline Rainfall: ${rainfall}mm

INSTRUCTIONS:
1. Generate realistic yield expectations, costs (in INR), and profits per acre.
2. The "AI Optimized" method MUST show higher efficiency (e.g., reduced fertilizer costs through targeted application, higher yield via precise timing) compared to the "Traditional" control method.
3. Create a realistic schedule of inputs (fertilizers, pesticides, irrigation) for both methods.
4. Generate 3 "What-If" rainfall scenarios (e.g., Drought, Optimal, Excess Rain) and predict the yield impact.

OUTPUT FORMAT:
You MUST return ONLY valid JSON matching this exact structure. Do not include any markdown formatting like \`\`\`json or \`\`\`. Just raw JSON.

{
  "aiOptimized": {
    "expectedYield": "e.g., 14 Quintals/Acre",
    "confidenceInterval": "e.g., 92%",
    "estimatedCost": 16500,
    "estimatedProfit": 52000,
    "inputs": [
      { "name": "e.g., Neem Coated Urea", "quantity": "e.g., 45 kg", "timing": "e.g., Day 20 (Top Dressing)" }
    ]
  },
  "traditional": {
    "expectedYield": "e.g., 11 Quintals/Acre",
    "estimatedCost": 19000,
    "estimatedProfit": 38000,
    "inputs": [
      { "name": "e.g., Standard Urea", "quantity": "e.g., 100 kg", "timing": "e.g., Base Application" }
    ]
  },
  "whatIfScenarios": [
    { 
      "scenario": "Deficit Rainfall (-30%)", 
      "rainfallMM": [Number calculated from baseline], 
      "yieldImpact": "e.g., -25%", 
      "riskLevel": "high" // must be 'low', 'medium', or 'high'
    },
    { 
      "scenario": "Excess Rainfall (+40%)", 
      "rainfallMM": [Number calculated from baseline], 
      "yieldImpact": "e.g., -10%", 
      "riskLevel": "medium" 
    }
  ],
  "recommendation": "2-3 sentences of actionable advice based on this simulation. Emphasize K2's specific recommendations.",
  "riskAnalysis": "1 sentence summarizing the biggest local threat (e.g., pests or weather) for this crop in this district."
}
`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   /api/experiment API ROUTE
═══════════════════════════════════════════════════════════════════════════ */
app.post('/api/experiment', async (c) => {
  try {
    const body = await c.req.json();
    const { crop, soil, district, rainfall } = body;

    // Validate inputs
    if (!crop || !soil || !district || !rainfall) {
      return c.json({ error: 'Missing required parameters (crop, soil, district, rainfall).' }, 400);
    }

    const prompt = buildSimulationPrompt(crop, soil, district, rainfall);

    // Call the K2 Model using the robust helper
    const simulationData = await k2Json(prompt, c.env);

    return c.json(simulationData);

  } catch (err) {
    console.error("Lab Worker Error:", err);
    // Return a structured error that won't break the frontend's UI completely
    return c.json({ 
      error: err.message,
      recommendation: "Simulation failed to process due to a server error. Please try again or adjust your parameters."
    }, 500);
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH CHECK
═══════════════════════════════════════════════════════════════════════════ */
app.get('/health', (c) => c.json({ status: 'ok', service: 'agronomist-lab-engine' }));

export default app;