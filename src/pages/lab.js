export function renderLab() {
  return `<main class="ml-64 pt-24 px-8 pb-12 page-enter">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 flex justify-between items-end">
        <div>
          <span class="text-xs font-bold tracking-[0.2em] text-secondary uppercase mb-2 block">Experimental Protocol v4.2</span>
          <h2 class="text-4xl font-headline font-extrabold text-primary tracking-tight">Virtual Experiment Lab</h2>
        </div>
        <div class="flex gap-4">
          <button class="px-6 py-2 bg-surface-container-high text-primary font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-sm">download</span> Export Dataset
          </button>
          <button class="px-6 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
            <span class="material-symbols-outlined text-sm">play_arrow</span> Run Simulation
          </button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8">
        <!-- Comparative Methods -->
        <div class="col-span-12 grid grid-cols-3 gap-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline font-bold text-primary">Method A</h3>
              <span class="text-[10px] font-bold bg-primary-fixed px-2 py-1 rounded text-primary">AI OPTIMIZED</span>
            </div>
            <p class="text-xs text-outline mb-6">Variable rate fertigation coupled with precision sensor feedback loops.</p>
            <div class="space-y-4">
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Nitrogen Flux</span><span class="font-bold text-primary">12.4 mg/L</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-primary w-[75%]"></div></div>
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Soil Aeration</span><span class="font-bold text-primary">88%</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-primary w-[88%]"></div></div>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline font-bold text-primary">Method B</h3>
              <span class="text-[10px] font-bold bg-secondary-fixed px-2 py-1 rounded text-secondary">AGGRESSIVE GROWTH</span>
            </div>
            <p class="text-xs text-outline mb-6">Enhanced bio-stimulants with accelerated hydration cycles for rapid yield.</p>
            <div class="space-y-4">
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Nitrogen Flux</span><span class="font-bold text-secondary">18.9 mg/L</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-secondary w-[92%]"></div></div>
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Soil Aeration</span><span class="font-bold text-secondary">62%</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-secondary w-[62%]"></div></div>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group border border-outline-variant/20">
            <div class="absolute top-0 left-0 w-1 h-full bg-outline"></div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-headline font-bold text-primary">Traditional</h3>
              <span class="text-[10px] font-bold bg-surface-container-high px-2 py-1 rounded text-outline">CONTROL GROUP</span>
            </div>
            <p class="text-xs text-outline mb-6">Standard regional protocols based on historical seasonal averages.</p>
            <div class="space-y-4">
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Nitrogen Flux</span><span class="font-bold text-on-surface">10.1 mg/L</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-outline w-[50%]"></div></div>
              <div class="flex justify-between text-xs"><span class="text-on-surface-variant">Soil Aeration</span><span class="font-bold text-on-surface">74%</span></div>
              <div class="h-1 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-outline w-[74%]"></div></div>
            </div>
          </div>
        </div>
        <!-- Growth Simulation -->
        <div class="col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
          <h3 class="font-headline text-lg font-bold text-primary mb-8">Crop Growth Simulation</h3>
          <div class="relative h-64 w-full flex items-end justify-between px-4 pb-12">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span class="material-symbols-outlined text-[12rem]">query_stats</span>
            </div>
            <div class="flex flex-col items-center group"><div class="w-12 bg-primary/20 h-16 rounded-t-lg transition-all group-hover:bg-primary/40 relative"><div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] py-1 px-2 rounded">Day 10</div></div><span class="mt-4 text-[10px] font-bold text-outline">WEEK 1</span></div>
            <div class="flex flex-col items-center group"><div class="w-12 bg-primary/40 h-28 rounded-t-lg transition-all group-hover:bg-primary/60"></div><span class="mt-4 text-[10px] font-bold text-outline">WEEK 2</span></div>
            <div class="flex flex-col items-center group"><div class="w-12 bg-primary/60 h-40 rounded-t-lg transition-all group-hover:bg-primary/80"></div><span class="mt-4 text-[10px] font-bold text-outline">WEEK 3</span></div>
            <div class="flex flex-col items-center group relative"><div class="w-12 bg-secondary h-56 rounded-t-lg shadow-[0_-8px_16px_rgba(43,91,181,0.2)]"><div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-md border border-secondary/20 rounded-lg p-2 flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">eco</span><span class="text-[10px] font-black text-primary whitespace-nowrap">PEAK GROWTH</span></div></div><span class="mt-4 text-[10px] font-bold text-primary">WEEK 4</span></div>
            <div class="flex flex-col items-center group"><div class="w-12 bg-primary/70 h-48 rounded-t-lg transition-all group-hover:bg-primary/90"></div><span class="mt-4 text-[10px] font-bold text-outline">WEEK 5</span></div>
            <div class="flex flex-col items-center group"><div class="w-12 bg-primary/50 h-32 rounded-t-lg transition-all group-hover:bg-primary/70"></div><span class="mt-4 text-[10px] font-bold text-outline">WEEK 6</span></div>
          </div>
          <div class="mt-6 flex gap-12 border-t border-outline-variant/30 pt-6">
            <div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center"><span class="material-symbols-outlined text-primary text-xl">water_drop</span></div><div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Hydration Delta</p><p class="text-lg font-headline font-extrabold text-primary">+14.2%</p></div></div>
            <div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center"><span class="material-symbols-outlined text-secondary text-xl">wb_sunny</span></div><div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Luminous Efficacy</p><p class="text-lg font-headline font-extrabold text-primary">892 Lux</p></div></div>
          </div>
        </div>
        <!-- Yield Prediction -->
        <div class="col-span-4 flex flex-col gap-6">
          <div class="bg-primary text-white p-8 rounded-xl shadow-2xl relative overflow-hidden flex-1">
            <div class="absolute -right-8 -top-8 w-48 h-48 bg-primary-container rounded-full opacity-30"></div>
            <div class="relative z-10 h-full flex flex-col">
              <div class="mb-auto">
                <h3 class="font-headline text-xl font-bold mb-1">Yield Prediction</h3>
                <p class="text-white/60 text-xs">Based on simulated Method A parameters</p>
                <div class="mt-8"><span class="text-5xl font-headline font-black tracking-tighter">12.4</span><span class="text-xl font-bold ml-1 text-primary-fixed">MT/ha</span></div>
                <div class="mt-2 flex items-center gap-2"><span class="material-symbols-outlined text-primary-fixed text-sm">trending_up</span><span class="text-xs font-bold text-primary-fixed">+8% compared to region avg</span></div>
              </div>
              <div class="mt-12 bg-primary-container/40 p-4 rounded-lg backdrop-blur-sm">
                <div class="flex justify-between items-center mb-2"><span class="text-xs font-bold uppercase tracking-widest text-primary-fixed">Confidence Score</span><span class="text-lg font-black text-white">85%</span></div>
                <div class="w-full h-2 bg-primary/60 rounded-full overflow-hidden"><div class="h-full bg-primary-fixed w-[85%]"></div></div>
                <p class="mt-3 text-[10px] text-white/70 italic">Probability of achieving 12MT yield under optimal conditions.</p>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-xl">
            <div class="flex items-center justify-between mb-4"><h4 class="font-bold text-sm text-primary">Risk Percentage</h4><span class="material-symbols-outlined text-error text-sm">warning</span></div>
            <div class="flex items-end justify-between">
              <div><span class="text-3xl font-headline font-black text-error">12.4%</span><p class="text-[10px] text-outline font-bold uppercase mt-1">Simulated Failure Risk</p></div>
              <div class="text-right"><p class="text-xs text-on-surface-variant font-bold">Main Driver</p><p class="text-xs text-primary">Nutrient Scarcity</p></div>
            </div>
          </div>
        </div>
        <!-- Efficiency -->
        <div class="col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div class="flex items-center justify-between mb-8"><div><h3 class="font-headline text-lg font-bold text-primary">Input Efficiency</h3><p class="text-xs text-outline">Resource utilization across experiment lifecycle</p></div><button class="material-symbols-outlined text-outline">more_horiz</button></div>
          <div class="space-y-8">
            <div><div class="flex justify-between text-xs mb-2"><span class="font-bold text-on-surface-variant">Water Utilization</span><span class="text-primary font-black">94%</span></div><div class="h-3 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full" style="width: 94%;"></div></div></div>
            <div><div class="flex justify-between text-xs mb-2"><span class="font-bold text-on-surface-variant">Nitrogen Bioavailability</span><span class="text-primary font-black">78%</span></div><div class="h-3 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full" style="width: 78%;"></div></div></div>
            <div><div class="flex justify-between text-xs mb-2"><span class="font-bold text-on-surface-variant">Energy consumption</span><span class="text-primary font-black">42%</span></div><div class="h-3 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full opacity-60" style="width: 42%;"></div></div></div>
          </div>
        </div>
        <!-- Environmental Impact -->
        <div class="col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden">
          <h3 class="font-headline text-lg font-bold text-primary mb-2">Environmental Impact</h3>
          <p class="text-xs text-outline mb-8">Ecological footprint analysis per iteration</p>
          <div class="grid grid-cols-2 gap-6">
            <div class="p-4 bg-primary-fixed/20 rounded-lg"><span class="material-symbols-outlined text-primary mb-2">co2</span><p class="text-2xl font-headline font-black text-primary">-12%</p><p class="text-[10px] font-bold text-outline uppercase">Carbon Sequestration</p></div>
            <div class="p-4 bg-secondary-fixed/20 rounded-lg"><span class="material-symbols-outlined text-secondary mb-2">grass</span><p class="text-2xl font-headline font-black text-secondary">+28%</p><p class="text-[10px] font-bold text-outline uppercase">Biodiversity Gain</p></div>
            <div class="col-span-2 p-4 bg-tertiary-fixed/20 rounded-lg flex items-center justify-between"><div><span class="material-symbols-outlined text-tertiary mb-2">science</span><p class="text-xl font-headline font-black text-tertiary">Minimal</p><p class="text-[10px] font-bold text-outline uppercase">Chemical Leaching Risk</p></div><div class="h-16 w-32 bg-surface-container-lowest/50 rounded flex items-center justify-center italic text-[10px] text-tertiary">[SIMULATION STABLE]</div></div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
