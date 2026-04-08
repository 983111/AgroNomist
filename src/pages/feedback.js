export function renderFeedback() {
  return `<main class="ml-64 pt-24 px-8 pb-12 min-h-screen page-enter">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-12">
        <div>
          <span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary block mb-2">Continuous Learning System</span>
          <h2 class="font-headline text-5xl font-extrabold text-primary tracking-tight">Feedback Loop</h2>
          <p class="text-on-surface-variant text-lg mt-2 font-medium max-w-xl">Verify AI suggestions against real-world outcomes. Your data makes the model smarter for everyone.</p>
        </div>
        <div class="flex gap-3">
          <button class="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-sm">history</span> History
          </button>
          <button class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity">
            <span class="material-symbols-outlined text-sm">add</span> Log New Harvest
          </button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8">
        <!-- Intelligence Growth -->
        <div class="col-span-12 grid grid-cols-4 gap-4 mb-4">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-primary-fixed/20 rounded-full -mr-6 -mt-6 blur-xl"></div>
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">AI Accuracy</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-headline font-black text-primary">94.2</span>
              <span class="text-lg font-bold text-primary">%</span>
            </div>
            <div class="mt-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
              <span class="text-xs font-bold text-primary">+2.4% this season</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Verified Predictions</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-headline font-black text-primary">1,247</span>
            </div>
            <div class="mt-3 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div class="bg-primary h-full" style="width:78%"></div>
            </div>
            <p class="text-[10px] text-outline mt-1">78% success rate</p>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">User Contributions</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-headline font-black text-primary">3,842</span>
            </div>
            <div class="mt-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary text-sm">groups</span>
              <span class="text-xs font-bold text-secondary">From 847 farmers</span>
            </div>
          </div>
          <div class="bg-primary text-on-primary p-6 rounded-xl shadow-xl">
            <p class="text-[10px] font-bold text-primary-fixed uppercase tracking-wider mb-2">Model Version</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-headline font-black">K2 v4.2</span>
            </div>
            <p class="text-xs text-primary-fixed-dim mt-3">Last trained: 6 hours ago</p>
          </div>
        </div>
        <!-- Harvest Log Form -->
        <div class="col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary-container">edit_note</span>
            </div>
            <div>
              <h3 class="font-headline text-xl font-bold text-primary">Log Harvest Outcome</h3>
              <p class="text-xs text-outline">Compare AI prediction vs actual results</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Crop & Block</label>
                <select class="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-primary/20">
                  <option>Thompson Grapes - Block 7</option>
                  <option>Cabernet Sauvignon - Block 4</option>
                  <option>Pomegranate - Block 12</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Actual Yield (MT/ha)</label>
                <input class="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="e.g., 12.4" type="number"/>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Quality Grade</label>
                <div class="flex gap-2">
                  <button class="flex-1 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold">Grade A</button>
                  <button class="flex-1 py-3 bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors">Grade B</button>
                  <button class="flex-1 py-3 bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors">Grade C</button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Did you follow AI recommendations?</label>
                <div class="flex gap-2">
                  <button class="flex-1 py-3 bg-primary-fixed text-primary rounded-xl text-xs font-bold">Yes, fully</button>
                  <button class="flex-1 py-3 bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold">Partially</button>
                  <button class="flex-1 py-3 bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold">No</button>
                </div>
              </div>
            </div>
            <!-- AI vs Actual Comparison -->
            <div class="space-y-6">
              <div class="bg-surface-container-low p-6 rounded-xl">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-xs font-bold text-outline uppercase tracking-wider">AI Predicted</span>
                  <span class="text-xs font-bold text-outline uppercase tracking-wider">Actual</span>
                </div>
                <div class="space-y-6">
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-bold text-secondary">12.4 MT/ha</span>
                      <span class="text-sm font-bold text-primary">—</span>
                    </div>
                    <div class="h-2 bg-surface-variant rounded-full overflow-hidden relative">
                      <div class="absolute top-0 left-0 h-full bg-secondary/40 w-[75%]"></div>
                    </div>
                    <p class="text-[10px] text-outline mt-1">Yield Volume</p>
                  </div>
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-bold text-secondary">24.5°Bx</span>
                      <span class="text-sm font-bold text-primary">—</span>
                    </div>
                    <div class="h-2 bg-surface-variant rounded-full overflow-hidden relative">
                      <div class="absolute top-0 left-0 h-full bg-secondary/40 w-[82%]"></div>
                    </div>
                    <p class="text-[10px] text-outline mt-1">Sugar Content (Brix)</p>
                  </div>
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-bold text-secondary">Grade A</span>
                      <span class="text-sm font-bold text-primary">—</span>
                    </div>
                    <div class="h-2 bg-surface-variant rounded-full overflow-hidden relative">
                      <div class="absolute top-0 left-0 h-full bg-secondary/40 w-[90%]"></div>
                    </div>
                    <p class="text-[10px] text-outline mt-1">Quality Assessment</p>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Additional Notes</label>
                <textarea class="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 px-4 h-24 resize-none focus:ring-2 focus:ring-primary/20" placeholder="Any observations about weather impact, pest issues, etc..."></textarea>
              </div>
              <button class="w-full py-4 bg-primary text-on-primary rounded-xl font-headline font-bold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">upload</span> Submit Feedback to K2
              </button>
            </div>
          </div>
        </div>
        <!-- Performance Timeline -->
        <div class="col-span-4 space-y-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h3 class="font-headline text-lg font-bold text-primary mb-6">Performance Timeline</h3>
            <div class="space-y-6">
              ${[
                {season:'Kharif 2024',pred:'12.4',actual:'11.8',acc:'95.2',color:'primary'},
                {season:'Rabi 2023-24',pred:'10.2',actual:'10.8',acc:'94.1',color:'secondary'},
                {season:'Kharif 2023',pred:'9.8',actual:'8.4',acc:'85.7',color:'tertiary'},
              ].map(s => `
                <div class="p-4 bg-surface-container-low rounded-xl">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-${s.color} uppercase tracking-wider">${s.season}</span>
                    <span class="text-[10px] font-bold text-outline">${s.acc}% accuracy</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="bg-surface-container-lowest p-2 rounded-lg">
                      <p class="text-[10px] text-outline uppercase">Predicted</p>
                      <p class="text-sm font-headline font-black text-${s.color}">${s.pred}</p>
                    </div>
                    <div class="bg-surface-container-lowest p-2 rounded-lg">
                      <p class="text-[10px] text-outline uppercase">Actual</p>
                      <p class="text-sm font-headline font-black text-on-surface">${s.actual}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="glass-panel p-6 rounded-xl border border-white/40 shadow-xl relative overflow-hidden">
            <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-secondary">psychology</span>
                <span class="text-[10px] font-bold text-secondary uppercase tracking-widest">Model Insight</span>
              </div>
              <p class="text-sm text-on-surface leading-relaxed mb-4">Your feedback has improved K2's prediction accuracy by <span class="font-bold text-primary">+8.5%</span> over 3 seasons. The model has learned specific patterns for your micro-climate conditions.</p>
              <div class="flex gap-4 text-[10px]">
                <div class="flex items-center gap-1 text-primary font-bold"><span class="w-2 h-2 rounded-full bg-primary"></span> Your Farm</div>
                <div class="flex items-center gap-1 text-outline font-bold"><span class="w-2 h-2 rounded-full bg-outline"></span> Regional Avg</div>
              </div>
              <div class="h-20 flex items-end gap-1 mt-4">
                ${[40,45,55,48,60,65,58,72,68,78,82,85].map((v,i) => 
                  `<div class="flex-1 ${i >= 8 ? 'bg-primary' : 'bg-primary/30'} rounded-t-sm" style="height:${v}%"></div>`
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
