export function renderResearch() {
  return `<main class="ml-64 pt-16 min-h-screen flex flex-col page-enter">
    <div class="flex flex-1 overflow-hidden">
      <!-- Experiment Sidebar -->
      <section class="w-80 bg-surface-container-low p-8 overflow-y-auto">
        <div class="space-y-8">
          <div>
            <h2 class="text-xs font-bold tracking-widest uppercase text-outline mb-6">Experiment Generator</h2>
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Crop Variant</label>
                <select class="w-full bg-surface-container-lowest border-none rounded-xl text-sm py-3 px-4 shadow-sm focus:ring-2 focus:ring-secondary/20">
                  <option>Cabernet Sauvignon (V-10)</option>
                  <option>Merlot (A-04)</option>
                  <option>Chardonnay (Heritage)</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Soil Composition</label>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-[10px] font-bold">Sandy Clay Loam</span>
                  <span class="px-3 py-1 bg-surface-container-high text-outline rounded-full text-[10px] font-bold">Volcanic Ash</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8 border-t border-outline-variant/20">
            <h3 class="text-xs font-bold tracking-widest uppercase text-outline mb-6">What-if Simulation</h3>
            <div class="space-y-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-semibold text-on-surface">Annual Rainfall</span>
                  <span class="text-xs font-mono text-secondary">650mm</span>
                </div>
                <div class="relative w-full h-1.5 bg-surface-variant rounded-full">
                  <div class="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-[#472d25] to-[#123b2a] rounded-full"></div>
                  <div class="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md"></div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl shadow-sm">
                <div class="flex items-center space-x-3">
                  <span class="material-symbols-outlined text-secondary">opacity</span>
                  <span class="text-xs font-semibold">Irrigation Pulse</span>
                </div>
                <div class="w-10 h-5 bg-primary-container rounded-full relative">
                  <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl shadow-sm">
                <div class="flex items-center space-x-3">
                  <span class="material-symbols-outlined text-tertiary">eco</span>
                  <span class="text-xs font-semibold">Nitrogen Cycle</span>
                </div>
                <div class="w-10 h-5 bg-surface-variant rounded-full relative">
                  <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <button class="w-full mt-4 py-4 bg-secondary text-on-secondary rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform">
            Run New Simulation
          </button>
        </div>
      </section>
      <!-- Chat Area -->
      <section class="flex-1 flex flex-col bg-surface relative overflow-hidden">
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo2HMAY0DBiBlf99yDXWih9gbYLCSEyKw3eTrr0GTPsE8ayKsekRgX_-1OLoE7zGmDf12Xnk6xisAmwxdiackvctG9Dm6jkTT2ia0wrY-NLhTpQFYJCxhZ_qfPCNRSl3s-7-KIegGTlh9DjaTuMU6jvtNPcUE9aQBeFm3wWNT9XO3Psni2BJ5TFWjiGbyqd4IfmDGRUrDGYsu1BoJp7sguFwUOurHyVb_cwfjxDB8-qzTvcYx6QMMANEFhPxTURP1meBYU3FQCTuc"/>
        </div>
        <div class="flex-1 overflow-y-auto p-12 space-y-8 relative z-10">
          <!-- AI Message -->
          <div class="flex items-start space-x-6 max-w-4xl">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-white text-xl">auto_awesome</span>
            </div>
            <div class="space-y-4">
              <div class="glass-panel p-8 rounded-2xl rounded-tl-none border border-white/40 shadow-sm">
                <p class="text-lg font-medium leading-relaxed text-on-surface">
                  Analysis complete for <span class="font-bold text-primary">Simulation_Alpha_9</span>. By adjusting the irrigation pulse to early morning cycles and maintaining a 650mm equivalent rainfall, we observe a <span class="text-secondary font-bold">14% increase</span> in Brix concentration potential.
                </p>
              </div>
              <!-- Hypothesis Results -->
              <div class="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/10">
                <div class="flex justify-between items-end mb-8">
                  <div>
                    <h3 class="font-headline text-3xl font-extrabold tracking-tighter text-primary">Yield Probability</h3>
                    <p class="text-xs font-mono uppercase tracking-widest text-outline">Projected Harvest: Oct 12-20</p>
                  </div>
                  <div class="text-right">
                    <span class="text-4xl font-black text-secondary">92.4<span class="text-xl">%</span></span>
                    <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Confidence Level</p>
                  </div>
                </div>
                <div class="relative h-48 w-full bg-surface-container-low rounded-xl flex items-end overflow-hidden px-8 pb-4">
                  <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <path d="M0 80 Q 100 80, 200 20 T 400 50" fill="none" stroke="#2b5bb5" stroke-linecap="round" stroke-width="4"></path>
                    <path d="M0 80 Q 100 80, 200 20 T 400 50 V 100 H 0 Z" fill="url(#grad1)" opacity="0.1"></path>
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#2b5bb5;stop-opacity:1"></stop>
                        <stop offset="100%" style="stop-color:#2b5bb5;stop-opacity:0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="flex justify-between w-full relative z-10">
                    <span class="text-[9px] font-bold text-outline">P0</span>
                    <span class="text-[9px] font-bold text-secondary">PEAK YIELD</span>
                    <span class="text-[9px] font-bold text-outline">P100</span>
                  </div>
                </div>
                <div class="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center">
                      <span class="material-symbols-outlined text-sm mr-2">help</span> Why this works
                    </h4>
                    <p class="text-sm text-on-surface-variant leading-relaxed">The synergy between the Sandy Clay Loam moisture retention and the targeted Nitrogen spike triggers a defensive metabolite response, enriching grape phenolics without sacrificing overall biomass.</p>
                  </div>
                  <div class="bg-secondary-container/10 p-4 rounded-xl border border-secondary-container/20">
                    <h4 class="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">AI Recommendation</h4>
                    <p class="text-xs text-on-secondary-container leading-tight">Apply the "High Stress" irrigation profile 48 hours prior to the heat window forecasted for Node_042.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- User Message -->
          <div class="flex justify-end w-full">
            <div class="bg-primary text-on-primary p-6 rounded-2xl rounded-tr-none shadow-lg max-w-xl">
              <p class="text-sm font-medium">Explain the impact of the soil pH being 0.5 points higher in the North Block.</p>
            </div>
          </div>
        </div>
        <!-- Input Field -->
        <div class="p-8 relative z-20">
          <div class="max-w-4xl mx-auto glass-panel p-2 rounded-2xl shadow-xl border border-white/60 flex items-center">
            <div class="flex space-x-1 px-4">
              <button class="p-2 text-outline hover:text-primary transition-colors">
                <span class="material-symbols-outlined">attachment</span>
              </button>
              <button class="p-2 text-outline hover:text-primary transition-colors">
                <span class="material-symbols-outlined">mic</span>
              </button>
            </div>
            <input class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 px-2 placeholder:text-outline/60" placeholder="Ask K2 about your crop cycles..." type="text"/>
            <button class="bg-primary text-on-primary h-12 w-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>`;
}
