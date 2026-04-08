export function renderDisease() {
  return `<main class="pl-64 pt-16 min-h-screen page-enter">
    <div class="p-8 max-w-[1440px] mx-auto">
      <div class="grid grid-cols-12 gap-8 items-start">
        <div class="col-span-12 lg:col-span-8 space-y-8">
          <div class="flex justify-between items-end">
            <div><span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary">Diagnostic Module</span><h2 class="font-headline text-4xl font-extrabold text-primary tracking-tight mt-1">Disease Detection</h2></div>
            <div class="flex space-x-2"><span class="inline-flex items-center px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full">LIVE SCANNER</span><span class="inline-flex items-center px-3 py-1 bg-surface-container-high text-outline text-[10px] font-bold rounded-full">AI MODEL: V4.2L</span></div>
          </div>
          <!-- Upload Zone -->
          <div class="group relative overflow-hidden bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-[2rem] p-12 flex flex-col items-center justify-center text-center transition-all hover:border-primary/50 hover:bg-surface-container-low min-h-[400px]">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
              <div class="w-20 h-20 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-4xl">upload_file</span></div>
              <h3 class="font-headline text-2xl font-bold text-primary mb-2">Upload or Drag &amp; Drop</h3>
              <p class="text-outline max-w-sm mb-8 font-medium">Capture a high-resolution image of the affected plant foliage for precision molecular analysis.</p>
              <div class="flex gap-4"><button class="px-8 py-3 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Browse Files</button><button class="px-8 py-3 bg-secondary-container text-on-secondary-container font-headline font-bold rounded-xl hover:shadow-secondary/20 transition-all active:scale-95">Open Camera</button></div>
            </div>
            <div class="absolute -bottom-12 -right-12 w-64 h-64 opacity-5 pointer-events-none"><span class="material-symbols-outlined text-[16rem]">potted_plant</span></div>
          </div>
          <!-- Analysis Results -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col border-l-4 border-error"><span class="font-label text-[10px] tracking-widest uppercase font-bold text-outline mb-4">Detected Disease</span><span class="font-headline text-2xl font-extrabold text-primary mb-1">Downy Mildew</span><span class="text-xs font-medium text-error flex items-center"><span class="material-symbols-outlined text-xs mr-1">warning</span> High Risk Detected</span></div>
            <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col border-l-4 border-secondary"><span class="font-label text-[10px] tracking-widest uppercase font-bold text-outline mb-4">Confidence Score</span><div class="flex items-baseline space-x-1"><span class="font-headline text-4xl font-black text-primary">94</span><span class="text-xl font-bold text-primary opacity-50">%</span></div><div class="mt-4 w-full bg-surface-container-high h-1 rounded-full overflow-hidden"><div class="bg-secondary h-full" style="width: 94%"></div></div></div>
            <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col border-l-4 border-tertiary"><span class="font-label text-[10px] tracking-widest uppercase font-bold text-outline mb-4">Severity Level</span><span class="font-headline text-2xl font-extrabold text-tertiary mb-1">Critical</span><span class="text-xs font-medium text-outline">Action required within 48h</span></div>
          </div>
          <!-- Treatment Plan -->
          <section class="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm">
            <div class="p-8 border-b border-surface-variant flex justify-between items-center">
              <div class="flex items-center space-x-3"><div class="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container"><span class="material-symbols-outlined">medical_services</span></div><h3 class="font-headline text-xl font-bold text-primary">AI Recommended Treatment</h3></div>
              <button class="text-secondary font-bold text-sm flex items-center hover:underline">Full Protocol <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span></button>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="flex gap-4"><div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs text-primary">01</div><div><p class="font-bold text-primary mb-1">Copper-based Fungicide Application</p><p class="text-sm text-outline leading-relaxed">Apply a dilute spray during early morning. Focus on lower leaf surfaces where sporulation is most active.</p></div></div>
                <div class="flex gap-4"><div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs text-primary">02</div><div><p class="font-bold text-primary mb-1">Canopy Thinning</p><p class="text-sm text-outline leading-relaxed">Increase airflow by selective pruning of non-productive vegetative shoots to reduce humidity levels.</p></div></div>
              </div>
              <div class="bg-surface-container-low rounded-2xl p-6">
                <h4 class="font-label text-[10px] tracking-widest uppercase font-bold text-outline mb-4">Marketplace Direct Links</h4>
                <div class="space-y-3">
                  <a class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:shadow-md transition-shadow group" href="#/shop"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-surface-variant rounded flex items-center justify-center"><span class="material-symbols-outlined text-primary">eco</span></div><div><p class="text-xs font-bold text-primary">Bio-Sulfur Organic Mix</p><p class="text-[10px] text-tertiary">Low Cost: $14.50</p></div></div><span class="material-symbols-outlined text-sm text-outline group-hover:text-primary">shopping_cart</span></a>
                  <a class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:shadow-md transition-shadow group" href="#/shop"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-surface-variant rounded flex items-center justify-center"><span class="material-symbols-outlined text-primary">precision_manufacturing</span></div><div><p class="text-xs font-bold text-primary">Nano-Nozzle Sprayer</p><p class="text-[10px] text-tertiary">Precision tool: $29.99</p></div></div><span class="material-symbols-outlined text-sm text-outline group-hover:text-primary">shopping_cart</span></a>
                </div>
              </div>
            </div>
          </section>
        </div>
        <!-- Right Sidebar -->
        <div class="col-span-12 lg:col-span-4 space-y-8">
          <div class="bg-surface-container-low rounded-[2rem] p-8">
            <div class="flex items-center justify-between mb-6"><h3 class="font-headline text-lg font-bold text-primary">History of Scans</h3><button class="material-symbols-outlined text-outline text-lg">history</button></div>
            <div class="space-y-4">
              <div class="flex items-center space-x-4 group cursor-pointer"><div class="relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm"><img alt="Vineyard Leaf" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYnYxde21W5Kf-6Hy7v4P1k--3PLJscxZ0Yt8B6zmGwsJL-g76wbbJ_fgqrB8ixvHrAAoNs1Pt3gz76ka94WbNUOd36u3e5BxtPdUuFWcoTfbmA-PPuJtAEFTxEPrORlBow5mlefUrFpb4zuqiBbxpexyUHShdnwCtJbG7-TWyjIMyrqwXZHMe-Bvknd0b_D0vSnFCDCoRW_Qgrkw5PLAxEZ4QdDFDYrpGdJmPxCWxCRpH5cLZhSrKnUyWG17gUMcK9JTcRzsKLk"/><div class="absolute inset-0 bg-primary/20 group-hover:opacity-0 transition-opacity"></div></div><div class="flex-1 border-b border-outline-variant/30 pb-4"><p class="text-sm font-bold text-primary">Black Rot Analysis</p><p class="text-[10px] text-outline font-medium">May 12, 2024 • Section C-4</p><div class="mt-1 flex items-center"><span class="w-2 h-2 rounded-full bg-error mr-2"></span><span class="text-[10px] font-bold text-error uppercase tracking-wider">Treated</span></div></div></div>
              <div class="flex items-center space-x-4 group cursor-pointer"><div class="relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm"><img alt="Healthy Leaf" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp00DReqHDO4mVGOdcFP4OeRH8sFr9MvCKDb36DQWrOeQKZa1yKJvmocjTiPz_hXznXz1qdF5thbM090TnkLdGhS77L2P27gpgT_V8wvbauR9yKpbb-Ixef7wAt37_FFhEc1hljHTOde4ne7_0RZzwPyrG5mXDVpM_yvIUnA0D47veG2RG4pjSQEQd7cNLXpn_PYlC3bLCnjhVNRXWXTrMhioQfAh7oU1jn9N1rbtQzmBwtnSLwAvnfs0aLIyVHla7syfTWl1n898"/><div class="absolute inset-0 bg-primary/20 group-hover:opacity-0 transition-opacity"></div></div><div class="flex-1 border-b border-outline-variant/30 pb-4"><p class="text-sm font-bold text-primary">Health Verification</p><p class="text-[10px] text-outline font-medium">May 08, 2024 • Section A-1</p><div class="mt-1 flex items-center"><span class="w-2 h-2 rounded-full bg-primary mr-2"></span><span class="text-[10px] font-bold text-primary uppercase tracking-wider">Healthy</span></div></div></div>
            </div>
            <button class="w-full mt-6 py-3 border border-outline-variant rounded-xl text-xs font-bold text-outline hover:bg-surface-variant transition-colors">View All Scan Records</button>
          </div>
          <!-- Regional Alerts -->
          <div class="glass-panel rounded-[2rem] p-8 border border-white shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div class="flex items-center space-x-2 text-secondary mb-4"><span class="material-symbols-outlined">hub</span><span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold">Network Intelligence</span></div>
            <h3 class="font-headline text-lg font-bold text-primary mb-4">Regional Alerts</h3>
            <p class="text-sm text-outline leading-relaxed mb-6">Local sensor network indicates rising humidity levels in the Napa Valley basin. High risk of <span class="font-bold text-primary">Powdery Mildew</span> for the next 72 hours.</p>
            <div class="space-y-4">
              <div class="p-4 bg-tertiary-fixed/30 rounded-2xl flex items-center space-x-3"><span class="material-symbols-outlined text-tertiary text-xl">air</span><div class="flex-1"><p class="text-xs font-bold text-tertiary">Wind Spore Migration</p><p class="text-[10px] text-on-tertiary-fixed-variant">Northwest flow detected</p></div></div>
              <div class="p-4 bg-primary-fixed/30 rounded-2xl flex items-center space-x-3"><span class="material-symbols-outlined text-primary text-xl">water_drop</span><div class="flex-1"><p class="text-xs font-bold text-primary">Humidity Spike</p><p class="text-[10px] text-on-primary-fixed-variant">88% relative saturation</p></div></div>
            </div>
          </div>
          <!-- Texture Card -->
          <div class="h-48 rounded-[2rem] overflow-hidden relative">
            <img alt="Aerial Vineyard" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSAPH1XME2S8m_CtZR-liNl1WggpHhR9FS2OopNqlKxO_A7PqzirT-U6y_c6eK_RO_sJmMDFUtS5ND7GGqU7t39LUYhE8JBzm-YrKI89KvKV4Y-lbHyraUiFqvMM55thsIqx4yJ3Apj3SyDlN41Fe5310G-gmfrI-aq95R7BiKNEUUPgtJNldwLNGO5pci2tiQoXzdc3GfqQj3r3uivDAikUCcAix1aX3yCxSR07WL9F-vwwLiGy-5HraFUze8RV-zXRTqNoXbj7s"/>
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6"><p class="text-white text-xs font-medium opacity-80 uppercase tracking-widest mb-1">Current Yield Forecast</p><p class="text-white text-2xl font-black font-headline">Premium Grade A</p></div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
