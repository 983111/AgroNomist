/**
 * AgriIntel K2 — Multi-Agent Intelligence Page
 * Full 5-agent pipeline: Agronomist + Market + Weather + Experimentation + Decision
 */

import { userPrefs, runMultiAgent, runAutonomous, runWhatIf } from '../services/api.js';

export function renderMultiAgent() {
  return `<main class="ml-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">5-Agent AI System</span>
        <h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Multi-Agent Intelligence</h2>
        <p class="text-sm text-outline mt-1">Agronomist + Market + Weather + Experimentation → Decision Agent synthesis</p>
      </div>

      <!-- Objective + Config -->
      <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8 border border-outline-variant/10">
        <h3 class="font-headline text-base font-bold text-primary mb-4">Mission Parameters</h3>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Objective (what do you want to achieve?)</label>
            <input id="ma-objective" type="text" value="Maximize profit this season"
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Maximize profit, Minimize risk, Best crop for 5 acres..."/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Primary Crop</label>
            <input id="ma-crop" type="text" value="${userPrefs.crop || ''}"
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Wheat, Corn, Soybean"/>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 mb-5">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Soil Type</label>
            <input id="ma-soil" type="text" placeholder="e.g. Clay, Sandy, Loam"
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Expected Rainfall (mm)</label>
            <input id="ma-rainfall" type="number" value="650"
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Temperature (°C avg)</label>
            <input id="ma-temp" type="number" value="25"
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Season</label>
            <input id="ma-season" type="text" placeholder="Season (e.g. Summer)" class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
          </div>
        </div>

        <!-- Agent selector -->
        <div class="mb-5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Agents to Deploy</p>
          <div class="flex gap-2 flex-wrap">
            ${[
              { id: 'agronomist',     label: 'Agronomist',     icon: 'grass' },
              { id: 'market',         label: 'Market Analyst',  icon: 'trending_up' },
              { id: 'weather',        label: 'Weather Risk',    icon: 'cloudy_snowing' },
              { id: 'experimentation',label: 'Experimentation', icon: 'biotech' },
            ].map(a => `
              <label class="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                <input type="checkbox" name="ma-agent" value="${a.id}" checked class="w-4 h-4 accent-primary rounded"/>
                <span class="material-symbols-outlined text-primary text-sm">${a.icon}</span>
                <span class="text-sm font-medium">${a.label}</span>
              </label>`).join('')}
          </div>
        </div>

        <div class="flex gap-3">
          <button id="run-multiagent" class="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg">
            <span class="material-symbols-outlined text-sm">account_tree</span>
            Run All Agents → Get Decision
          </button>
          <button id="run-autonomous" class="px-6 py-3 bg-secondary/10 text-secondary rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/15 transition-colors border border-secondary/20">
            <span class="material-symbols-outlined text-sm">smart_toy</span>
            Autonomous Mode
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div id="ma-loading" class="hidden">
        <div class="bg-surface-container-lowest p-8 rounded-2xl shadow-sm mb-8 border border-outline-variant/10">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <div>
              <p class="font-bold text-primary" id="ma-loading-stage">Deploying agents…</p>
              <p class="text-sm text-outline mt-0.5">Running parallel analysis across all specialized agents</p>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-3" id="ma-agent-status">
            ${[
              { id: 'agronomist',     label: 'Agronomist',     icon: 'grass' },
              { id: 'market',         label: 'Market Analyst',  icon: 'trending_up' },
              { id: 'weather',        label: 'Weather Risk',    icon: 'cloudy_snowing' },
              { id: 'experimentation',label: 'Experimentation', icon: 'biotech' },
            ].map(a => `
              <div id="status-${a.id}" class="p-4 bg-surface-container-low rounded-xl text-center">
                <span class="material-symbols-outlined text-outline text-2xl mb-2 block">${a.icon}</span>
                <p class="text-xs font-bold text-outline">${a.label}</p>
                <p class="text-[10px] text-outline mt-1">Waiting…</p>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Results -->
      <div id="ma-results" class="space-y-6"></div>

      <!-- What-If Engine -->
      <div class="mt-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-secondary">psychology</span>
          <h3 class="font-headline text-lg font-bold text-primary">What-If Engine</h3>
          <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">INSTANT ANALYSIS</span>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-8">
            <input id="whatif-scenario" type="text"
              placeholder="e.g. Rainfall drops 40%, Market crashes 25%, Pest outbreak, Frost in October..."
              class="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div class="col-span-4">
            <button id="run-whatif" class="w-full h-full py-3 bg-secondary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
              <span class="material-symbols-outlined text-sm">bolt</span> Analyze Scenario
            </button>
          </div>
        </div>
        <div class="flex gap-2 mt-3 flex-wrap">
          ${[
            'Rainfall drops 40%',
            'Market price crashes 30%',
            'Pest outbreak strikes',
            'Temperature rises 5°C',
            'Input costs double',
          ].map(s => `<button class="whatif-preset text-[11px] px-3 py-1.5 bg-surface-container rounded-lg hover:bg-secondary/10 hover:text-secondary transition-colors font-medium">${s}</button>`).join('')}
        </div>
        <div id="whatif-results" class="mt-4"></div>
      </div>
    </div>
  </main>`;
}

function skeleton(cls = 'h-12') {
  return `<div class="bg-surface-container-low rounded-xl animate-pulse ${cls}"></div>`;
}

function renderAgentCard(agentData, label, icon, color = 'primary') {
  if (!agentData || Object.keys(agentData).length === 0) {
    return `<div class="p-4 bg-surface-container-low rounded-2xl text-center text-outline text-sm">Agent data unavailable</div>`;
  }
  return `<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
    <div class="flex items-center gap-2 mb-3">
      <span class="material-symbols-outlined text-${color}">${icon}</span>
      <h4 class="font-headline text-sm font-bold text-primary">${label}</h4>
      ${agentData.agentConfidence ? `<span class="ml-auto text-[10px] font-bold text-outline">${Math.round(agentData.agentConfidence * 100)}% conf</span>` : ''}
    </div>
    <div class="text-xs text-on-surface-variant space-y-1">
      ${getAgentSummary(agentData, label)}
    </div>
  </div>`;
}

function getAgentSummary(data, label) {
  if (label.includes('Agronomist')) {
    const top = data.primaryRecommendation?.crop || data.recommendedCrops?.[0]?.name || '—';
    return `<p><span class="font-bold text-primary">Top Crop:</span> ${top}</p>
            <p><span class="font-bold">Soil Score:</span> ${data.soilHealthScore || '—'}/100</p>
            <p class="line-clamp-2">${data.primaryRecommendation?.reasoning || data.soilHealthSummary || ''}</p>`;
  }
  if (label.includes('Market')) {
    return `<p><span class="font-bold text-secondary">Price:</span> ${data.currentPrice ? `${data.currentPrice} ${data.priceUnit || '/unit'}` : '—'}</p>
            <p><span class="font-bold">Trend:</span> ${data.trend || '—'} (${data.trendStrength || ''})</p>
            <p><span class="font-bold">Decision:</span> ${data.sellDecision || '—'}</p>
            <p><span class="font-bold">Opportunity:</span> ${data.opportunityScore || '—'}/100</p>`;
  }
  if (label.includes('Weather')) {
    return `<p><span class="font-bold text-tertiary">Yield Impact:</span> ${data.yieldImpactScore || '—'}/100</p>
            <p><span class="font-bold">Alerts:</span> ${(data.alerts || []).length} active</p>
            <p class="line-clamp-2">${data.irrigationAdvice || ''}</p>`;
  }
  if (label.includes('Experiment')) {
    const best = data.strategies?.[0];
    return `<p><span class="font-bold text-secondary">Best Strategy:</span> ${best?.name || '—'}</p>
            <p><span class="font-bold">ROI:</span> ${best?.roi || '—'}%</p>
            <p><span class="font-bold">Risk:</span> ${best?.riskLevel || '—'}</p>`;
  }
  return '';
}

function renderDecisionPanel(decision) {
  if (!decision) return '';
  const fd = decision.finalDecision || {};
  const cs = decision.compositeScore || {};
  const eo = decision.expectedOutcome || {};

  const scoreBar = (label, val, color) => `
    <div>
      <div class="flex justify-between mb-1">
        <span class="text-[10px] font-bold uppercase tracking-wider text-white/70">${label}</span>
        <span class="text-[10px] font-bold text-white">${val}/100</span>
      </div>
      <div class="h-2 bg-white/20 rounded-full overflow-hidden">
        <div class="h-full bg-${color} rounded-full" style="width:${val}%"></div>
      </div>
    </div>`;

  return `
  <div class="bg-gradient-to-br from-primary to-primary-container text-white p-8 rounded-2xl shadow-xl">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-2xl" style="font-variation-settings:'FILL' 1">gavel</span>
      </div>
      <div>
        <span class="text-[10px] font-bold text-primary-fixed uppercase tracking-widest">Decision Agent — Final Verdict</span>
        <h3 class="font-headline text-xl font-bold">${fd.recommendedCrop || 'See below'}</h3>
      </div>
      <div class="ml-auto text-right">
        <p class="text-[10px] text-primary-fixed uppercase font-bold">Agent Agreement</p>
        <p class="font-headline text-3xl font-black">${Math.round((decision.agentAgreement || 0) * 100)}%</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-3">Composite Score</p>
        <div class="space-y-3">
          ${scoreBar('Soil Fit', cs.soilFit || 0, 'primary-fixed')}
          ${scoreBar('Market Opportunity', cs.marketOpportunity || 0, 'primary-fixed')}
          ${scoreBar('Weather Risk', cs.weatherRisk || 0, 'primary-fixed')}
          ${scoreBar('Experimental Advantage', cs.experimentalAdvantage || 0, 'primary-fixed')}
        </div>
      </div>
      <div class="space-y-4">
        <div class="p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Strategy</p>
          <p class="text-sm font-bold">${fd.recommendedStrategy || '—'}</p>
        </div>
        <div class="p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Primary Action</p>
          <p class="text-sm font-bold">${fd.primaryAction || '—'}</p>
        </div>
        <div class="p-4 bg-white/10 rounded-xl">
          <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Timeline</p>
          <p class="text-sm">${fd.timeline || '—'}</p>
        </div>
      </div>
    </div>

    ${decision.reasoning ? `
    <div class="mb-6 p-4 bg-white/10 rounded-xl">
      <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Why This Decision</p>
      <p class="text-sm leading-relaxed">${decision.reasoning.whyThisCrop || ''}</p>
      ${decision.reasoning.riskConsiderations ? `<p class="text-xs text-primary-fixed-dim mt-2">⚠️ ${decision.reasoning.riskConsiderations}</p>` : ''}
    </div>` : ''}

    ${eo.yieldEstimate ? `
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-4 bg-white/10 rounded-xl text-center">
        <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Yield Estimate</p>
        <p class="font-headline text-xl font-black">${eo.yieldEstimate}</p>
      </div>
      <div class="p-4 bg-white/10 rounded-xl text-center">
        <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Profit Estimate</p>
        <p class="font-headline text-xl font-black">${eo.profitEstimate || '—'}</p>
      </div>
      <div class="p-4 bg-white/10 rounded-xl text-center">
        <p class="text-[10px] font-bold text-primary-fixed uppercase mb-1">Confidence</p>
        <p class="font-headline text-xl font-black">${eo.confidenceLevel || '—'}</p>
      </div>
    </div>` : ''}

    ${decision.immediateActions?.length ? `
    <div class="mb-4">
      <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-3">Immediate Actions</p>
      <div class="space-y-2">
        ${decision.immediateActions.slice(0, 4).map(a => `
          <div class="flex items-start gap-3 p-3 bg-white/10 rounded-xl">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 ${a.priority === 'high' ? 'bg-error text-white' : 'bg-white/30 text-white'}">${a.priority === 'high' ? '!' : '→'}</span>
            <div>
              <p class="text-sm font-bold">${a.action}</p>
              <p class="text-xs text-primary-fixed-dim">${a.deadline || ''} — ${a.rationale || ''}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}
  </div>`;
}

function renderStrategyTable(strategies) {
  if (!strategies?.length) return '';
  return `
  <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
    <h3 class="font-headline text-lg font-bold text-primary mb-4">Strategy Comparison</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-primary text-white">
            <th class="text-left p-3 rounded-tl-xl font-bold">Strategy</th>
            <th class="text-center p-3 font-bold">Expected Yield</th>
            <th class="text-center p-3 font-bold">Est. Cost</th>
            <th class="text-center p-3 font-bold">Est. Profit</th>
            <th class="text-center p-3 font-bold">ROI %</th>
            <th class="text-center p-3 rounded-tr-xl font-bold">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${strategies.map((s, i) => {
            const riskColor = { low: 'text-primary', medium: 'text-tertiary', high: 'text-error' };
            return `
            <tr class="${i === 0 ? 'bg-primary-fixed/20 font-semibold' : 'hover:bg-surface-container-low'} transition-colors">
              <td class="p-3 rounded-l-xl">
                <div class="flex items-center gap-2">
                  ${i === 0 ? '<span class="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black">★</span>' : ''}
                  <span>${s.name}</span>
                </div>
              </td>
              <td class="p-3 text-center">${s.expectedYield || '—'}</td>
              <td class="p-3 text-center">${s.estimatedCost ? `${Number(s.estimatedCost).toLocaleString()}` : '—'}</td>
              <td class="p-3 text-center font-bold ${i === 0 ? 'text-primary' : ''}">${s.estimatedProfit ? `${Number(s.estimatedProfit).toLocaleString()}` : '—'}</td>
              <td class="p-3 text-center">${s.roi ? `${s.roi}%` : '—'}</td>
              <td class="p-3 text-center rounded-r-xl">
                <span class="text-xs font-bold ${riskColor[s.riskLevel] || 'text-outline'} uppercase">${s.riskLevel || '—'}</span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

export function initMultiAgent() {
  const runBtn  = document.getElementById('run-multiagent');
  const autoBtn = document.getElementById('run-autonomous');

  function getParams() {
    const selectedAgents = [...document.querySelectorAll('input[name="ma-agent"]:checked')].map(el => el.value);
    return {
      crop:      document.getElementById('ma-crop')?.value || userPrefs.crop,
      soil:      document.getElementById('ma-soil')?.value || '',
      rainfall:  parseFloat(document.getElementById('ma-rainfall')?.value) || 650,
      temperature: parseFloat(document.getElementById('ma-temp')?.value) || 25,
      season:    document.getElementById('ma-season')?.value || 'kharif',
      objective: document.getElementById('ma-objective')?.value || 'Maximize profit this season',
      agents:    selectedAgents.length ? selectedAgents : ['all'],
    };
  }

  function setAgentStatus(agentId, status, detail = '') {
    const el = document.getElementById(`status-${agentId}`);
    if (!el) return;
    const colors = {
      running:  'border-l-4 border-secondary bg-secondary/5',
      complete: 'border-l-4 border-primary bg-primary-fixed/20',
      error:    'border-l-4 border-error bg-error/5',
    };
    el.className = `p-4 ${colors[status] || 'bg-surface-container-low'} rounded-xl text-center transition-all`;
    const statusText = { running: 'Running…', complete: '✓ Done', error: '✗ Failed' };
    el.querySelector('p:last-child').textContent = statusText[status] || '';
    if (detail) el.querySelector('.material-symbols-outlined').style.color = status === 'complete' ? '#123b2a' : '';
  }

  async function runAgents() {
    const params  = getParams();
    const loading = document.getElementById('ma-loading');
    const results = document.getElementById('ma-results');
    const stage   = document.getElementById('ma-loading-stage');

    loading.classList.remove('hidden');
    results.innerHTML = '';
    runBtn.disabled = true;

    // Animate agent statuses
    const agents = ['agronomist', 'market', 'weather', 'experimentation'];
    agents.forEach(a => setAgentStatus(a, 'running'));
    stage.textContent = 'All 4 specialist agents running in parallel…';

    try {
      const data = await runMultiAgent(params);
      loading.classList.add('hidden');

      // Mark all complete
      agents.forEach(a => setAgentStatus(a, 'complete'));

      if (!data) {
        results.innerHTML = `<p class="text-error text-center p-8">No data returned. Please try again.</p>`;
        return;
      }

      const agentOutputs = data.agents || {};

      results.innerHTML = `
        <!-- Decision Panel (most prominent) -->
        ${renderDecisionPanel(data.decision)}

        <!-- 4 Agent Cards -->
        <div class="grid grid-cols-2 gap-4">
          ${renderAgentCard(agentOutputs.agronomist,     '🌱 Agronomist Agent',     'grass',         'primary')}
          ${renderAgentCard(agentOutputs.market,         '📈 Market Analyst Agent', 'trending_up',   'secondary')}
          ${renderAgentCard(agentOutputs.weather,        '🌦️ Weather Risk Agent',   'cloudy_snowing','tertiary')}
          ${renderAgentCard(agentOutputs.experimentation,'🔬 Experiment Agent',     'biotech',       'secondary')}
        </div>

        <!-- Strategy Comparison Table -->
        ${renderStrategyTable(agentOutputs.experimentation?.strategies)}

        <!-- Sensitivity Analysis -->
        ${agentOutputs.experimentation?.sensitivityAnalysis ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Sensitivity Analysis</h3>
          <div class="grid grid-cols-3 gap-4">
            ${Object.entries(agentOutputs.experimentation.sensitivityAnalysis).map(([key, val]) => {
              const riskColor = { low: 'border-primary/20 bg-primary-fixed/10', medium: 'border-tertiary/20 bg-tertiary-fixed/10', high: 'border-error/20 bg-error/5' };
              return `<div class="p-4 rounded-xl border ${riskColor[val?.risk] || 'border-outline-variant bg-surface-container-low'}">
                <p class="text-[10px] font-bold uppercase tracking-wider text-outline mb-2">${key.replace(/_/g, ' ')}</p>
                <p class="text-sm font-bold">${val?.yieldImpact || '—'}</p>
                <p class="text-xs text-on-surface-variant">${val?.profitImpact || ''}</p>
                <span class="text-[10px] font-bold uppercase ${val?.risk === 'high' ? 'text-error' : val?.risk === 'medium' ? 'text-tertiary' : 'text-primary'}">${val?.risk || ''} risk</span>
              </div>`;
            }).join('')}
          </div>
        </div>` : ''}

        <!-- Weekly Plan -->
        ${data.decision?.weeklyPlan?.length ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Week-by-Week Action Plan</h3>
          <div class="space-y-3">
            ${data.decision.weeklyPlan.slice(0, 6).map((w, i) => `
              <div class="flex gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-headline font-black text-sm flex-shrink-0">${i + 1}</div>
                <div>
                  <p class="font-bold text-primary">${w.week} — ${w.focus || ''}</p>
                  <ul class="mt-1 space-y-0.5">
                    ${(w.tasks || []).map(t => `<li class="text-xs text-on-surface-variant">→ ${t}</li>`).join('')}
                  </ul>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <!-- Government Schemes -->
        ${data.decision?.governmentSchemes?.length ? `
        <div class="bg-secondary/5 border border-secondary/20 p-6 rounded-2xl">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-secondary">account_balance</span>
            <h3 class="font-headline text-lg font-bold text-primary">Government Schemes & Subsidies</h3>
          </div>
          <div class="grid grid-cols-3 gap-4">
            ${data.decision.governmentSchemes.map(s => `
              <div class="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p class="font-bold text-sm text-secondary mb-1">${s.scheme}</p>
                <p class="text-xs text-on-surface-variant mb-2">${s.benefit}</p>
                <p class="text-xs text-outline">${s.howToApply || ''}</p>
              </div>`).join('')}
          </div>
        </div>` : ''}
      `;
    } catch (e) {
      loading.classList.add('hidden');
      agents.forEach(a => setAgentStatus(a, 'error'));
      results.innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    } finally {
      runBtn.disabled = false;
    }
  }

  async function runAutonomousMode() {
    const params  = getParams();
    const loading = document.getElementById('ma-loading');
    const results = document.getElementById('ma-results');
    const stage   = document.getElementById('ma-loading-stage');

    loading.classList.remove('hidden');
    results.innerHTML = '';
    stage.textContent = 'Autonomous Farm Manager planning entire season…';

    const agents = ['agronomist', 'market', 'weather', 'experimentation'];
    agents.forEach(a => setAgentStatus(a, 'running'));

    try {
      const data = await runAutonomous({ ...params, farmSize: userPrefs.farmSize || 5 });
      loading.classList.add('hidden');
      agents.forEach(a => setAgentStatus(a, 'complete'));

      const plan = data.autonomousPlan || {};
      results.innerHTML = `
        <div class="bg-gradient-to-br from-secondary to-secondary-container text-white p-8 rounded-2xl shadow-xl mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="material-symbols-outlined text-secondary-fixed text-3xl" style="font-variation-settings:'FILL' 1">smart_toy</span>
            <div>
              <span class="text-[10px] font-bold text-secondary-fixed uppercase tracking-widest">Autonomous Farm Manager</span>
              <h3 class="font-headline text-2xl font-bold">${plan.selectedCrop || 'Optimal Crop'} Season Plan</h3>
            </div>
            <div class="ml-auto text-right">
              <p class="text-[10px] text-secondary-fixed uppercase font-bold">Expected ROI</p>
              <p class="font-headline text-3xl font-black">${plan.expectedROI || '—'}</p>
            </div>
          </div>
          <p class="text-sm text-secondary-fixed-dim leading-relaxed mb-6">${plan.planSummary || ''}</p>
          ${plan.weekByWeekPlan?.length ? `
          <div class="space-y-3">
            <p class="text-[10px] font-bold text-secondary-fixed uppercase tracking-wider">Week-by-Week Autonomous Plan</p>
            ${plan.weekByWeekPlan.slice(0, 8).map(w => `
              <div class="p-4 bg-white/10 rounded-xl">
                <div class="flex justify-between items-start mb-2">
                  <p class="font-bold text-sm">${w.week}</p>
                  <span class="text-xs font-bold text-secondary-fixed">${w.budget ? `Budget: ${Number(w.budget).toLocaleString()}` : ''}</span>
                </div>
                <ul class="space-y-1">
                  ${(w.actions || []).map(a => `<li class="text-xs text-secondary-fixed-dim">→ ${a}</li>`).join('')}
                </ul>
                ${w.milestone ? `<p class="text-xs font-bold text-white mt-2">🎯 ${w.milestone}</p>` : ''}
              </div>`).join('')}
          </div>` : ''}
        </div>

        ${plan.marketingStrategy ? `
        <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
          <h3 class="font-headline text-lg font-bold text-primary mb-4">Marketing Strategy</h3>
          <div class="grid grid-cols-4 gap-4">
            <div class="p-4 bg-primary-fixed/20 rounded-xl"><p class="text-[10px] font-bold uppercase text-outline mb-1">Sell When</p><p class="font-bold text-primary">${plan.marketingStrategy.sellWhen || '—'}</p></div>
            <div class="p-4 bg-secondary-fixed/20 rounded-xl"><p class="text-[10px] font-bold uppercase text-outline mb-1">Target Buyer</p><p class="font-bold text-secondary">${plan.marketingStrategy.targetBuyer || '—'}</p></div>
            <div class="p-4 bg-surface-container-low rounded-xl"><p class="text-[10px] font-bold uppercase text-outline mb-1">Expected Price</p><p class="font-bold">${plan.marketingStrategy.expectedPrice ? `${Number(plan.marketingStrategy.expectedPrice).toLocaleString()}` : '—'}</p></div>
            <div class="p-4 bg-surface-container-low rounded-xl"><p class="text-[10px] font-bold uppercase text-outline mb-1">Storage Needed</p><p class="font-bold">${plan.marketingStrategy.storageNeeded ? 'Yes' : 'No'}</p></div>
          </div>
        </div>` : ''}
      `;
    } catch (e) {
      loading.classList.add('hidden');
      results.innerHTML = `<div class="py-12 text-center"><p class="text-error font-bold">Error: ${e.message}</p></div>`;
    }
  }

  // What-If Engine
  document.querySelectorAll('.whatif-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('whatif-scenario').value = btn.textContent;
    });
  });

  document.getElementById('run-whatif')?.addEventListener('click', async () => {
    const scenario = document.getElementById('whatif-scenario')?.value?.trim();
    if (!scenario) return;
    const btn = document.getElementById('run-whatif');
    const res = document.getElementById('whatif-results');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Analyzing…';
    res.innerHTML = `<div class="animate-pulse h-24 bg-surface-container-low rounded-xl mt-3"></div>`;

    try {
      const params = getParams();
      const data = await runWhatIf({ scenario, crop: params.crop });

      const riskColor = { high: 'border-error/30 bg-error/5 text-error', medium: 'border-tertiary/30 bg-tertiary-fixed/10 text-tertiary', low: 'border-primary/30 bg-primary-fixed/10 text-primary' };
      const rc = riskColor[data.riskLevel] || riskColor.medium;

      res.innerHTML = `
        <div class="mt-3 p-5 rounded-xl border ${rc}">
          <div class="flex items-center justify-between mb-3">
            <p class="font-bold">${data.scenarioName || scenario}</p>
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase">${data.riskLevel || '—'} risk</span>
              <span class="text-xs font-bold">${Math.round((data.probability || 0) * 100)}% probability</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="p-3 bg-white/50 rounded-lg"><p class="text-[10px] font-bold uppercase text-gray-500 mb-1">Yield Impact</p><p class="font-bold">${data.yieldImpact?.percentage || data.yieldImpact?.direction || '—'}</p></div>
            <div class="p-3 bg-white/50 rounded-lg"><p class="text-[10px] font-bold uppercase text-gray-500 mb-1">Profit Impact</p><p class="font-bold">${data.profitImpact?.percentage || data.profitImpact?.direction || '—'}</p></div>
          </div>
          ${data.adaptationStrategies?.length ? `
          <p class="text-xs font-bold uppercase text-gray-500 mb-2">Adaptation Strategies</p>
          <div class="space-y-1">
            ${data.adaptationStrategies.slice(0, 3).map(s => `<p class="text-xs">→ <strong>${s.strategy}</strong> (${s.effectiveness || ''}, ${s.cost || ''})</p>`).join('')}
          </div>` : ''}
          ${data.longTermMitigation ? `<p class="text-xs mt-3 font-medium">Long-term: ${data.longTermMitigation}</p>` : ''}
        </div>`;
    } catch (e) {
      res.innerHTML = `<p class="text-error text-sm mt-3">Error: ${e.message}</p>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-sm">bolt</span> Analyze Scenario';
    }
  });

  runBtn?.addEventListener('click', runAgents);
  autoBtn?.addEventListener('click', runAutonomousMode);
}
