export function renderShop() {
  return `<main class="ml-64 pt-24 px-8 pb-12 min-h-screen page-enter">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-12">
        <div>
          <span class="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-secondary block mb-2">Procurement Hub</span>
          <h2 class="font-headline text-5xl font-extrabold text-primary tracking-tight">Marketplace & Services</h2>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input class="pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl w-72 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search products & services..." type="text"/>
          </div>
          <button class="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center shadow-sm relative hover:bg-surface-container-low transition-colors">
            <span class="material-symbols-outlined text-primary">shopping_cart</span>
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </div>
      <!-- Categories -->
      <div class="flex gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
        ${['All Products', 'Fertilizers', 'Pesticides', 'Seeds', 'Equipment', 'Organic', 'Services'].map((cat, i) => 
          `<button class="${i === 0 ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'} px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors">${cat}</button>`
        ).join('')}
      </div>
      <!-- AI Recommended -->
      <section class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <span class="material-symbols-outlined text-secondary">auto_awesome</span>
          <h3 class="font-headline text-xl font-bold text-primary">AI-Recommended for Your Farm</h3>
          <span class="text-[10px] font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full">Based on soil & disease analysis</span>
        </div>
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div class="h-48 bg-surface-container relative overflow-hidden">
              <img alt="Bio-Sulfur Mix" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp00DReqHDO4mVGOdcFP4OeRH8sFr9MvCKDb36DQWrOeQKZa1yKJvmocjTiPz_hXznXz1qdF5thbM090TnkLdGhS77L2P27gpgT_V8wvbauR9yKpbb-Ixef7wAt37_FFhEc1hljHTOde4ne7_0RZzwPyrG5mXDVpM_yvIUnA0D47veG2RG4pjSQEQd7cNLXpn_PYlC3bLCnjhVNRXWXTrMhioQfAh7oU1jn9N1rbtQzmBwtnSLwAvnfs0aLIyVHla7syfTWl1n898"/>
              <div class="absolute top-3 left-3 bg-error text-on-error px-2 py-1 rounded text-[10px] font-bold">URGENT</div>
              <div class="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary">★ 4.8</div>
            </div>
            <div class="p-5">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Fungicide</p>
              <h4 class="font-bold text-primary mb-2">Bio-Sulfur Organic Mix</h4>
              <p class="text-[10px] text-outline mb-4 leading-relaxed">Recommended for Downy Mildew treatment detected in Block C-4</p>
              <div class="flex items-center justify-between">
                <div><span class="text-xl font-headline font-black text-primary">₹1,450</span><span class="text-xs text-outline ml-1">/5kg</span></div>
                <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Add to Cart</button>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div class="h-48 bg-surface-container relative overflow-hidden">
              <img alt="Nano Sprayer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSAPH1XME2S8m_CtZR-liNl1WggpHhR9FS2OopNqlKxO_A7PqzirT-U6y_c6eK_RO_sJmMDFUtS5ND7GGqU7t39LUYhE8JBzm-YrKI89KvKV4Y-lbHyraUiFqvMM55thsIqx4yJ3Apj3SyDlN41Fe5310G-gmfrI-aq95R7BiKNEUUPgtJNldwLNGO5pci2tiQoXzdc3GfqQj3r3uivDAikUCcAix1aX3yCxSR07WL9F-vwwLiGy-5HraFUze8RV-zXRTqNoXbj7s"/>
              <div class="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary">★ 4.6</div>
            </div>
            <div class="p-5">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Equipment</p>
              <h4 class="font-bold text-primary mb-2">Nano-Nozzle Precision Sprayer</h4>
              <p class="text-[10px] text-outline mb-4 leading-relaxed">Ultra-fine mist for targeted fungicide application</p>
              <div class="flex items-center justify-between">
                <div><span class="text-xl font-headline font-black text-primary">₹2,999</span></div>
                <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Add to Cart</button>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div class="h-48 bg-surface-container relative overflow-hidden">
              <img alt="DAP Fertilizer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYnYxde21W5Kf-6Hy7v4P1k--3PLJscxZ0Yt8B6zmGwsJL-g76wbbJ_fgqrB8ixvHrAAoNs1Pt3gz76ka94WbNUOd36u3e5BxtPdUuFWcoTfbmA-PPuJtAEFTxEPrORlBow5mlefUrFpb4zuqiBbxpexyUHShdnwCtJbG7-TWyjIMyrqwXZHMe-Bvknd0b_D0vSnFCDCoRW_Qgrkw5PLAxEZ4QdDFDYrpGdJmPxCWxCRpH5cLZhSrKnUyWG17gUMcK9JTcRzsKLk"/>
              <div class="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary">★ 4.5</div>
            </div>
            <div class="p-5">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Fertilizer</p>
              <h4 class="font-bold text-primary mb-2">DAP Phosphorus Booster</h4>
              <p class="text-[10px] text-outline mb-4 leading-relaxed">K2 detected low phosphorus levels in your soil profile</p>
              <div class="flex items-center justify-between">
                <div><span class="text-xl font-headline font-black text-primary">₹1,800</span><span class="text-xs text-outline ml-1">/50kg</span></div>
                <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Add to Cart</button>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div class="h-48 bg-surface-container relative overflow-hidden">
              <img alt="Drip Kit" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo2HMAY0DBiBlf99yDXWih9gbYLCSEyKw3eTrr0GTPsE8ayKsekRgX_-1OLoE7zGmDf12Xnk6xisAmwxdiackvctG9Dm6jkTT2ia0wrY-NLhTpQFYJCxhZ_qfPCNRSl3s-7-KIegGTlh9DjaTuMU6jvtNPcUE9aQBeFm3wWNT9XO3Psni2BJ5TFWjiGbyqd4IfmDGRUrDGYsu1BoJp7sguFwUOurHyVb_cwfjxDB8-qzTvcYx6QMMANEFhPxTURP1meBYU3FQCTuc"/>
              <div class="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold">BEST VALUE</div>
              <div class="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary">★ 4.9</div>
            </div>
            <div class="p-5">
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Irrigation</p>
              <h4 class="font-bold text-primary mb-2">Smart Drip Irrigation Kit</h4>
              <p class="text-[10px] text-outline mb-4 leading-relaxed">AI-compatible sensor-driven irrigation system</p>
              <div class="flex items-center justify-between">
                <div><span class="text-xl font-headline font-black text-primary">₹8,500</span><span class="text-xs text-outline ml-1">/acre</span></div>
                <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Services Section -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <span class="material-symbols-outlined text-tertiary">handyman</span>
          <h3 class="font-headline text-xl font-bold text-primary">Professional Services</h3>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><span class="material-symbols-outlined text-primary">agriculture</span></div>
              <div><h4 class="font-bold text-primary">Soil Testing Lab</h4><p class="text-[10px] text-outline">Certified NPK & Micronutrient Analysis</p></div>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed mb-4">NABL-accredited lab analysis with detailed report and K2-compatible data format.</p>
            <div class="flex items-center justify-between">
              <div><span class="text-lg font-headline font-black text-primary">₹450</span><span class="text-xs text-outline">/sample</span></div>
              <button class="px-4 py-2 bg-surface-container-high text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors">Book Now</button>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center"><span class="material-symbols-outlined text-secondary">flight</span></div>
              <div><h4 class="font-bold text-primary">Drone Crop Survey</h4><p class="text-[10px] text-outline">Multispectral Aerial Mapping</p></div>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed mb-4">High-resolution NDVI mapping with disease detection overlay and progress tracking.</p>
            <div class="flex items-center justify-between">
              <div><span class="text-lg font-headline font-black text-primary">₹2,200</span><span class="text-xs text-outline">/acre</span></div>
              <button class="px-4 py-2 bg-surface-container-high text-primary rounded-lg text-xs font-bold hover:bg-secondary hover:text-on-secondary transition-colors">Book Now</button>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-tertiary">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center"><span class="material-symbols-outlined text-tertiary">school</span></div>
              <div><h4 class="font-bold text-primary">Agri Expert Consult</h4><p class="text-[10px] text-outline">1-on-1 Video Consultation</p></div>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed mb-4">Connect with certified agronomists for personalized crop management advice.</p>
            <div class="flex items-center justify-between">
              <div><span class="text-lg font-headline font-black text-primary">₹299</span><span class="text-xs text-outline">/session</span></div>
              <button class="px-4 py-2 bg-surface-container-high text-primary rounded-lg text-xs font-bold hover:bg-tertiary hover:text-on-tertiary transition-colors">Book Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>`;
}
