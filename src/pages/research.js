import { streamChat } from '../services/api.js';

export function renderResearch() {
  return `<main class="ml-64 pt-16 min-h-screen flex flex-col page-enter">
    <div class="flex flex-1 overflow-hidden" style="height: calc(100vh - 64px)">
      <!-- Config Sidebar -->
      <section class="w-72 bg-surface-container-low p-6 overflow-y-auto border-r border-outline-variant/20 flex-shrink-0">
        <div class="space-y-6">
          <div>
            <h2 class="text-xs font-bold tracking-widest uppercase text-outline mb-4">Configuration</h2>
            <div class="space-y-3">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Mode</label>
                <select id="chat-mode" class="w-full bg-surface-container-lowest border-none rounded-xl text-sm py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-primary/20">
                  <option value="default">General Advisor</option>
                  <option value="experiment">Experiment Generator</option>
                  <option value="hypothesis">Hypothesis Engine</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Language</label>
                <select id="chat-lang" class="w-full bg-surface-container-lowest border-none rounded-xl text-sm py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-primary/20">
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/20">
            <h3 class="text-xs font-bold tracking-widest uppercase text-outline mb-3">Quick Prompts</h3>
            <div class="space-y-2" id="quick-prompts">
              ${[
                'What fertilizer should I use for cotton in black soil?',
                'My soybean leaves are turning yellow. What disease?',
                'Best time to sell onion this season?',
                'How to apply for PM-KISAN loan?',
                'Tips to increase yield by 20%?',
                'Explain drip irrigation benefits',
              ].map(q => `<button class="quick-prompt w-full text-left px-3 py-2 bg-surface-container-lowest rounded-xl text-xs text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors leading-relaxed">${q}</button>`).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-outline-variant/20">
            <button id="clear-chat" class="w-full py-2.5 border border-outline-variant rounded-xl text-xs font-bold text-outline hover:bg-error/10 hover:text-error hover:border-error/20 transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">delete</span> Clear Chat
            </button>
          </div>
        </div>
      </section>

      <!-- Chat Area -->
      <section class="flex-1 flex flex-col bg-surface min-w-0">
        <div id="chat-messages" class="flex-1 overflow-y-auto p-8 space-y-6">
          <!-- Welcome -->
          <div class="flex items-start gap-4 max-w-3xl">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
              <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1">smart_toy</span>
            </div>
            <div class="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 max-w-2xl">
              <p class="text-sm leading-relaxed text-on-surface">
                Namaskar! 🌾 I'm <strong>K2 AgriIntel</strong>, your AI agriculture assistant. I can help you with:
              </p>
              <div class="mt-3 grid grid-cols-2 gap-2">
                ${[
                  ['coronavirus','Disease diagnosis'],
                  ['trending_up','Market prices'],
                  ['cloudy_snowing','Weather & risks'],
                  ['layers','Soil & fertilizers'],
                  ['biotech','Crop experiments'],
                  ['account_balance','Govt schemes'],
                ].map(([icon, label]) => `
                  <div class="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg">
                    <span class="material-symbols-outlined text-primary text-sm">${icon}</span>
                    <span class="text-xs font-medium text-on-surface-variant">${label}</span>
                  </div>`).join('')}
              </div>
              <p class="text-sm mt-3 text-on-surface">Ask me anything in English, Hindi, or Marathi!</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-outline-variant/20 bg-surface">
          <div class="max-w-3xl mx-auto flex items-end gap-3">
            <div class="flex-1 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <textarea id="chat-input"
                rows="1"
                class="w-full bg-transparent border-none resize-none text-sm py-3.5 px-4 placeholder:text-outline/60 focus:ring-0 max-h-32"
                placeholder="Ask about crops, weather, market prices, disease…"
              ></textarea>
            </div>
            <button id="send-btn" class="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md hover:opacity-90 active:scale-95 transition-all flex-shrink-0 disabled:opacity-40">
              <span class="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
          <p class="text-center text-[10px] text-outline mt-2">Powered by MBZUAI K2-Think-v2 • Press Enter to send</p>
        </div>
      </section>
    </div>
  </main>`;
}

export function initResearch() {
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  let history = [];
  let isStreaming = false;

  function addMessage(role, content, isStreaming = false) {
    const id = `msg-${Date.now()}`;
    const isUser = role === 'user';
    const html = `
      <div id="${id}" class="flex items-start gap-4 ${isUser ? 'justify-end' : ''} max-w-3xl ${isUser ? 'ml-auto' : ''}">
        ${!isUser ? `<div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
          <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1">smart_toy</span>
        </div>` : ''}
        <div class="${isUser
          ? 'bg-primary text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-xl'
          : 'bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 max-w-2xl flex-1'
        }">
          <div class="msg-content text-sm leading-relaxed ${isUser ? 'text-white' : 'text-on-surface'} whitespace-pre-wrap">${content}</div>
          ${isStreaming ? '<span class="inline-block w-1.5 h-4 bg-primary animate-pulse ml-1 align-middle"></span>' : ''}
        </div>
      </div>`;
    messagesEl.insertAdjacentHTML('beforeend', html);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  async function send() {
    const message = inputEl.value.trim();
    if (!message || isStreaming) return;
    isStreaming = true;
    sendBtn.disabled = true;
    inputEl.value = '';
    inputEl.style.height = 'auto';

    addMessage('user', message);
    const context = history.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    const aiId = addMessage('assistant', '', true);
    const aiEl = document.getElementById(aiId);
    const contentEl = aiEl?.querySelector('.msg-content');
    const cursorEl = aiEl?.querySelector('.animate-pulse');

    let fullText = '';
    try {
      const mode = document.getElementById('chat-mode')?.value || 'default';
      const lang = document.getElementById('chat-lang')?.value || 'en';
      const body = await streamChat(message, context, lang, mode);
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              if (contentEl) contentEl.textContent = fullText;
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          } catch {}
        }
      }
    } catch (e) {
      if (contentEl) contentEl.textContent = `Error: ${e.message}`;
    } finally {
      cursorEl?.remove();
      history.push({ role: 'user', content: message }, { role: 'assistant', content: fullText });
      isStreaming = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn?.addEventListener('click', send);
  inputEl?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  inputEl?.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 128) + 'px';
  });

  document.querySelectorAll('.quick-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.textContent;
      inputEl.focus();
    });
  });

  document.getElementById('clear-chat')?.addEventListener('click', () => {
    history = [];
    messagesEl.innerHTML = '';
  });
}
