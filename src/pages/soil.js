export function renderSoil() {
  return `<main class="ml-64 mt-16 p-10 fallow-ground min-h-screen page-enter">
    <section class="mb-12 flex items-end justify-between">
      <div class="max-w-2xl">
        <h2 class="font-headline text-5xl font-extrabold tracking-tight text-primary leading-none mb-4">Soil Intelligence <span class="text-secondary">&amp; Analytics</span></h2>
        <p class="text-on-surface-variant text-lg leading-relaxed font-medium">Integrating hyperspectral soil analysis with predictive yield modeling for the Nashik vineyard corridor.</p>
      </div>
      <div class="flex items-center space-x-4 pb-2">
        <div class="text-right"><p class="font-label text-[10px] uppercase font-bold tracking-[0.2em] text-outline">Last Sensor Sync</p><p class="font-headline font-bold text-primary">04:12 PM IST</p></div>
        <div class="w-12 h-12 rounded-full border-2 border-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">sync</span></div>
      </div>
    </section>
    <div class="grid grid-cols-12 gap-8">
      <!-- Macronutrient Profile -->
      <div class="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(25,28,27,0.04)] relative overflow-hidden group">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-10">
            <div><h3 class="font-headline text-2xl font-bold text-primary">Macronutrient Profile</h3><p class="font-label text-xs uppercase tracking-widest text-outline font-bold mt-1">Chemical Composition Analysis</p></div>
            <div class="bg-primary-fixed px-4 py-2 rounded-xl"><span class="font-headline font-bold text-primary">Optimal pH: 6.8</span></div>
          </div>
          <div class="grid grid-cols-3 gap-12">
            <div class="space-y-4"><div class="flex items-center justify-between"><span class="font-headline font-black text-3xl text-primary">N</span><span class="text-xs font-bold text-on-surface-variant">42 mg/kg</span></div><div class="h-24 w-full bg-surface-container rounded-lg flex items-end overflow-hidden"><div class="w-full bg-primary h-[65%]"></div></div><p class="font-label text-[10px] uppercase font-bold tracking-widest text-primary">Nitrogen (Normal)</p></div>
            <div class="space-y-4"><div class="flex items-center justify-between"><span class="font-headline font-black text-3xl text-primary">P</span><span class="text-xs font-bold text-on-surface-variant">18 mg/kg</span></div><div class="h-24 w-full bg-surface-container rounded-lg flex items-end overflow-hidden"><div class="w-full bg-secondary h-[35%]"></div></div><p class="font-label text-[10px] uppercase font-bold tracking-widest text-secondary">Phosphorus (Low)</p></div>
            <div class="space-y-4"><div class="flex items-center justify-between"><span class="font-headline font-black text-3xl text-primary">K</span><span class="text-xs font-bold text-on-surface-variant">245 mg/kg</span></div><div class="h-24 w-full bg-surface-container rounded-lg flex items-end overflow-hidden"><div class="w-full bg-primary h-[85%]"></div></div><p class="font-label text-[10px] uppercase font-bold tracking-widest text-primary">Potassium (High)</p></div>
          </div>
          <div class="mt-12 p-6 bg-surface-container-low rounded-2xl border-l-4 border-secondary flex items-center space-x-6">
            <div class="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">lightbulb</span></div>
            <div><p class="text-sm font-semibold text-primary">AI Insight: Potassium saturation is above target.</p><p class="text-xs text-on-surface-variant mt-1">Reduce K-rich fertilization for the next 14-day cycle to maintain moisture retention.</p></div>
          </div>
        </div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
      <!-- Crop Recommendation -->
      <div class="col-span-12 lg:col-span-5 flex flex-col space-y-8">
        <div class="bg-primary p-8 rounded-[2rem] text-on-primary flex flex-col h-full relative overflow-hidden">
          <div class="relative z-10 h-full flex flex-col">
            <div class="mb-8"><div class="bg-on-primary/10 w-fit px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-4">India Context - Kharif 2024</div><h3 class="font-headline text-2xl font-bold">Crop Recommendation</h3></div>
            <div class="space-y-6 flex-1">
              <div class="flex items-center justify-between p-4 bg-on-primary/5 rounded-2xl hover:bg-on-primary/10 transition-colors">
                <div class="flex items-center space-x-4"><div class="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center"><span class="material-symbols-outlined">eco</span></div><div><p class="font-headline font-bold">Table Grapes (Thomson Seedless)</p><p class="text-xs text-on-primary/60">Match Probability: 98%</p></div></div>
                <span class="material-symbols-outlined text-primary-fixed">verified</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-on-primary/5 rounded-2xl hover:bg-on-primary/10 transition-colors">
                <div class="flex items-center space-x-4"><div class="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center"><span class="material-symbols-outlined">compost</span></div><div><p class="font-headline font-bold">Pomegranate (Bhagawa)</p><p class="text-xs text-on-primary/60">Match Probability: 84%</p></div></div>
                <span class="material-symbols-outlined opacity-50">arrow_forward_ios</span>
              </div>
            </div>
            <button class="mt-8 py-4 bg-on-primary text-primary rounded-xl font-headline font-bold text-sm uppercase tracking-widest hover:bg-primary-fixed transition-colors">Generate Full Report</button>
          </div>
          <div class="absolute bottom-0 right-0 w-48 h-48 translate-x-12 translate-y-12 opacity-20"><span class="material-symbols-outlined text-[160px]" style="font-variation-settings: 'FILL' 1;">model_training</span></div>
        </div>
      </div>
      <!-- Fertilizer Planner -->
      <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(25,28,27,0.04)]">
        <div class="flex justify-between items-center mb-8">
          <div><h3 class="font-headline text-2xl font-bold text-primary">Fertilizer Planner</h3><p class="font-label text-xs uppercase tracking-widest text-outline font-bold">Interactive Cost vs. Yield Optimizer</p></div>
          <div class="flex space-x-2"><div class="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-primary">Current View: Quarterly</div><div class="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-xs font-bold">Optimize Now</div></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div><div class="flex justify-between mb-2"><label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fertilizer Intensity (N-P-K)</label><span class="text-xs font-bold text-primary">High (85%)</span></div><div class="h-2 bg-surface-container rounded-full relative"><div class="absolute top-0 left-0 h-full w-[85%] bg-gradient-to-r from-[#472d25] to-[#123b2a] rounded-full"></div><div class="absolute top-1/2 left-[85%] -translate-y-1/2 w-4 h-4 bg-surface-container-lowest border-2 border-primary rounded-full shadow-md"></div></div></div>
            <div class="grid grid-cols-2 gap-6">
              <div class="p-6 bg-surface-container-low rounded-2xl text-center"><p class="text-xs font-bold text-outline uppercase tracking-tighter mb-1">Projected Cost</p><p class="text-2xl font-headline font-black text-primary">₹24,500<span class="text-sm font-medium">/acre</span></p></div>
              <div class="p-6 bg-secondary-fixed/30 rounded-2xl text-center border-2 border-secondary/20"><p class="text-xs font-bold text-secondary uppercase tracking-tighter mb-1">Estimated Yield</p><p class="text-2xl font-headline font-black text-secondary">+18.4%</p></div>
            </div>
          </div>
          <div class="h-64 flex items-end justify-between space-x-2 px-4">
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[40%]"></div>
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[55%]"></div>
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[45%]"></div>
            <div class="w-8 bg-primary rounded-t-lg h-[80%] relative"><div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] py-1 px-2 rounded whitespace-nowrap">Optimal Peak</div></div>
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[60%]"></div>
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[35%]"></div>
            <div class="w-8 bg-surface-container-high rounded-t-lg h-[50%]"></div>
          </div>
        </div>
      </div>
      <!-- Optimization Heatmap -->
      <div class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(25,28,27,0.04)] overflow-hidden flex flex-col">
        <div class="mb-6"><h3 class="font-headline text-xl font-bold text-primary">Optimization Heatmap</h3><p class="font-label text-xs uppercase tracking-widest text-outline font-bold">Nashik District Corridor</p></div>
        <div class="flex-1 relative rounded-2xl overflow-hidden bg-surface-container group min-h-[250px]">
          <img class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-nV1Q71V_j4jD37bMITuxyn7BKeu-VCuQvph9Z5vLusTclMwhg5iWYzdO3auVg0hAoNvgqKrF8-02BT5xRy4jf8XBFiVmumuADWPJoYkGexqJBmg7SgzIadJhbgpUt0tdbeWnX6xY26duZVjnmy4If_9lQtXyxOANDRio6MBYheqjpEmykwMLdhtq6NYcgPHiYFr3ClO3X5E3TrHce3glTr8AK-ys7CjuVU8FWgWmDRzx9UH4Wc2Pu_SwWOrguJV4ODxBAVHg92w"/>
          <div class="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/40 rounded-full blur-2xl"></div>
          <div class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-xl"></div>
          <div class="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/20 shadow-sm"><div class="flex items-center space-x-2"><div class="w-2 h-2 rounded-full bg-primary"></div><span class="text-[10px] font-bold text-primary uppercase">High Fertility</span></div></div>
          <div class="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur p-4 rounded-xl shadow-lg border border-outline-variant/10"><div class="flex justify-between items-center"><div><p class="text-[10px] font-bold text-outline uppercase tracking-wider">Active Sector</p><p class="text-sm font-headline font-bold text-primary">Niphad Subdivision</p></div><span class="material-symbols-outlined text-primary">info</span></div></div>
        </div>
      </div>
      <!-- Sensor Metadata -->
      <div class="col-span-12 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-6 border border-outline-variant/10 rounded-2xl flex items-center space-x-4"><span class="material-symbols-outlined text-outline">thermostat</span><div><p class="text-[10px] font-bold text-outline uppercase">Soil Temp</p><p class="text-lg font-headline font-bold text-primary">24.2° C</p></div></div>
        <div class="p-6 border border-outline-variant/10 rounded-2xl flex items-center space-x-4"><span class="material-symbols-outlined text-outline">opacity</span><div><p class="text-[10px] font-bold text-outline uppercase">Moisture</p><p class="text-lg font-headline font-bold text-primary">12.5% VWC</p></div></div>
        <div class="p-6 border border-outline-variant/10 rounded-2xl flex items-center space-x-4"><span class="material-symbols-outlined text-outline">bolt</span><div><p class="text-[10px] font-bold text-outline uppercase">EC Content</p><p class="text-lg font-headline font-bold text-primary">0.82 dS/m</p></div></div>
        <div class="p-6 border border-outline-variant/10 rounded-2xl flex items-center space-x-4"><span class="material-symbols-outlined text-outline">grain</span><div><p class="text-[10px] font-bold text-outline uppercase">Texture</p><p class="text-lg font-headline font-bold text-primary">Silty Loam</p></div></div>
      </div>
    </div>
  </main>
  <div class="fixed bottom-10 right-10 z-50"><button class="bg-primary text-on-primary w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform active:scale-95"><span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">add_chart</span><div class="absolute right-20 bg-primary text-on-primary px-4 py-2 rounded-xl font-headline font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">Run Soil Simulation</div></button></div>`;
}
