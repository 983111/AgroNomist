export function renderTopbar() {
  return `<header class="fixed top-0 right-0 left-64 h-16 bg-[#f8faf8]/60 backdrop-blur-xl z-40 flex items-center justify-between px-8 shadow-[0px_12px_32px_rgba(25,28,27,0.04)]">
    <div class="flex items-center gap-4">
      <div class="relative group">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727970]">search</span>
        <input class="pl-10 pr-4 py-2 bg-[#f2f4f2] border-none rounded-full w-64 focus:ring-2 focus:ring-[#123b2a]/20 text-sm font-body" placeholder="Analyze territory data..." type="text"/>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-4">
        <button class="w-10 h-10 flex items-center justify-center text-[#123b2a] rounded-full hover:bg-[#e1e3e1] transition-colors">
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <button class="w-10 h-10 flex items-center justify-center text-[#123b2a] rounded-full hover:bg-[#e1e3e1] transition-colors">
          <span class="material-symbols-outlined">settings</span>
        </button>
      </div>
      <div class="h-8 w-[1px] bg-[#c2c8be]"></div>
      <div class="flex items-center gap-3 cursor-pointer group">
        <div class="text-right">
          <p class="text-xs font-bold text-[#123b2a] leading-tight">Dr. Aris Thorne</p>
          <p class="text-[10px] text-[#727970] font-label uppercase tracking-wider">Lead Scientist</p>
        </div>
        <img alt="User Scientist Profile" class="w-10 h-10 rounded-full border-2 border-[#c1ecd4] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlLQoLwV0YM3S0s94qYmdZE-8QB5pzzp8-kiMo-lMTTiF4_oelb9P_t9wM5NiDCHxq89pwI_xfhnsJojl0r3v0S8Go0-rwqWie_qp3e7u5OIFlB8ZJZvWZjYnrnQ4hb07PrPzHE4j0MbY2TC48osePlHSCjsb4-nhcZS59ymmKmeIeolYRp0lvOpI-pXWotlYSR6zDDpH4OCc2zy2hzF8qojw9xmdcxK5gu6XovnytStYLteipgczusQ04FqhkOMKRmdSksOGbCpk"/>
      </div>
    </div>
  </header>`;
}
