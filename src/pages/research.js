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
                Namaskar! 🌾 I'm <strong>AgriIntel Research Assistant</strong>, your AI agriculture advisor. I can help you with:
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
          <p class="text-center text-[10px] text-outline mt-2">Powered by AgriIntel AI • Press Enter to send</p>
        </div>
      </section>
    </div>

    <style>
      /* ── Chat message markdown rendering ── */
      .chat-md h1 { font-size: 1.1rem; font-weight: 800; color: #123b2a; margin: 1rem 0 0.4rem; font-family: 'Manrope', sans-serif; }
      .chat-md h2 { font-size: 0.95rem; font-weight: 700; color: #123b2a; margin: 0.9rem 0 0.35rem; font-family: 'Manrope', sans-serif; border-bottom: 1px solid #c2c8be; padding-bottom: 0.2rem; }
      .chat-md h3 { font-size: 0.85rem; font-weight: 700; color: #2b5bb5; margin: 0.7rem 0 0.25rem; font-family: 'Manrope', sans-serif; }
      .chat-md h4 { font-size: 0.8rem; font-weight: 700; color: #472d25; margin: 0.6rem 0 0.2rem; }
      .chat-md p  { font-size: 0.875rem; line-height: 1.7; color: #191c1b; margin: 0.4rem 0; }
      .chat-md ul { list-style: none; margin: 0.4rem 0 0.4rem 0; padding: 0; }
      .chat-md ul li { font-size: 0.875rem; line-height: 1.65; color: #191c1b; padding: 0.2rem 0 0.2rem 1.4rem; position: relative; }
      .chat-md ul li::before { content: '▸'; position: absolute; left: 0.2rem; color: #3f6653; font-size: 0.7rem; top: 0.35rem; }
      .chat-md ol { list-style: none; margin: 0.4rem 0; padding: 0; counter-reset: chat-counter; }
      .chat-md ol li { font-size: 0.875rem; line-height: 1.65; color: #191c1b; padding: 0.2rem 0 0.2rem 1.8rem; position: relative; counter-increment: chat-counter; }
      .chat-md ol li::before { content: counter(chat-counter); position: absolute; left: 0; top: 0.2rem; width: 1.3rem; height: 1.3rem; background: #123b2a; color: #fff; border-radius: 50%; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
      .chat-md strong { font-weight: 700; color: #123b2a; }
      .chat-md em { font-style: italic; color: #424841; }
      .chat-md code { background: #eceeec; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem; font-family: monospace; color: #2b5bb5; }
      .chat-md pre { background: #191c1b; color: #c1ecd4; padding: 1rem; border-radius: 12px; overflow-x: auto; font-size: 0.8rem; margin: 0.6rem 0; }
      .chat-md pre code { background: none; color: inherit; padding: 0; }
      .chat-md blockquote { border-left: 3px solid #3f6653; margin: 0.6rem 0; padding: 0.4rem 0 0.4rem 1rem; background: #f2f4f2; border-radius: 0 8px 8px 0; }
      .chat-md blockquote p { color: #424841; font-style: italic; margin: 0; }
      .chat-md table { width: 100%; border-collapse: collapse; margin: 0.6rem 0; font-size: 0.8rem; }
      .chat-md table th { background: #123b2a; color: #fff; padding: 0.5rem 0.75rem; text-align: left; font-weight: 700; }
      .chat-md table td { padding: 0.4rem 0.75rem; border-bottom: 1px solid #e1e3e1; }
      .chat-md table tr:nth-child(even) td { background: #f8faf8; }
      .chat-md hr { border: none; border-top: 1px solid #c2c8be; margin: 0.8rem 0; }
      .chat-md .tag-pill { display: inline-block; background: #c1ecd4; color: #002114; border-radius: 9999px; padding: 0.1rem 0.55rem; font-size: 0.7rem; font-weight: 700; margin: 0.1rem; }
    </style>
  </main>`;
}

// ─── Markdown → HTML renderer ────────────────────────────────────────────────
// Converts markdown text to clean, beautiful HTML with NO asterisks visible.

function renderMarkdown(raw) {
  if (!raw) return '';

  let md = raw
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Strip any stray asterisks used purely as bullet substitutes at line start
    .replace(/^\*\s+/gm, '- ');

  const lines = md.split('\n');
  const html  = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(escHtml(lines[i]));
        i++;
      }
      html.push(`<pre><code>${code.join('\n')}</code></pre>`);
      i++;
      continue;
    }

    // Headings
    const h4 = line.match(/^####\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h4) { html.push(`<h4>${inlineRender(h4[1])}</h4>`); i++; continue; }
    if (h3) { html.push(`<h3>${inlineRender(h3[1])}</h3>`); i++; continue; }
    if (h2) { html.push(`<h2>${inlineRender(h2[1])}</h2>`); i++; continue; }
    if (h1) { html.push(`<h1>${inlineRender(h1[1])}</h1>`); i++; continue; }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { html.push('<hr>'); i++; continue; }

    // Blockquote
    if (line.startsWith('> ')) {
      const bqLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        bqLines.push(inlineRender(lines[i].slice(2)));
        i++;
      }
      html.push(`<blockquote><p>${bqLines.join('<br>')}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (/^(\s*[-+*])\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\s*[-+*])\s+/.test(lines[i])) {
        items.push(`<li>${inlineRender(lines[i].replace(/^\s*[-+*]\s+/, ''))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inlineRender(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\|?[\s\-:]+\|/)) {
      const headerCells = line.split('|').map(c => c.trim()).filter(Boolean);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
        rows.push(`<tr>${cells.map(c => `<td>${inlineRender(c)}</td>`).join('')}</tr>`);
        i++;
      }
      html.push(`<table><thead><tr>${headerCells.map(c => `<th>${inlineRender(c)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') { i++; continue; }

    // Paragraph
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('- ') && !lines[i].startsWith('* ') && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith('> ') && !lines[i].startsWith('```') && !lines[i].includes('|')) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) html.push(`<p>${inlineRender(paraLines.join(' '))}</p>`);
  }

  return `<div class="chat-md">${html.join('')}</div>`;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function inlineRender(text) {
  return escHtml(text)
    // Bold+italic  ***text***
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold  **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic  *text* or _text_
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-secondary underline">$1</a>')
    // Emoji-tagged pills like [High Risk] or {Kharif}
    .replace(/\[([^\]]{1,40})\]/g, '<span class="tag-pill">$1</span>');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initResearch() {
  const messagesEl = document.getElementById('chat-messages');
  const inputEl    = document.getElementById('chat-input');
  const sendBtn    = document.getElementById('send-btn');
  let history      = [];
  let isStreaming  = false;

  function addMessage(role, contentHtml, streaming = false) {
    const id    = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const isUser = role === 'user';
    const html   = `
      <div id="${id}" class="flex items-start gap-4 ${isUser ? 'justify-end' : ''} max-w-3xl ${isUser ? 'ml-auto' : ''}">
        ${!isUser ? `<div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
          <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1">smart_toy</span>
        </div>` : ''}
        <div class="${isUser
          ? 'bg-primary text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-xl'
          : 'bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 max-w-2xl flex-1 min-w-0'
        }">
          <div class="msg-content ${isUser ? 'text-sm text-white leading-relaxed' : 'text-sm leading-relaxed'}">${isUser ? escHtml(contentHtml) : contentHtml}</div>
          ${streaming ? '<span id="cursor-' + id + '" class="inline-block w-1.5 h-4 bg-primary animate-pulse ml-1 align-middle rounded-sm"></span>' : ''}
        </div>
      </div>`;
    messagesEl.insertAdjacentHTML('beforeend', html);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  async function send() {
    const message = inputEl.value.trim();
    if (!message || isStreaming) return;
    isStreaming    = true;
    sendBtn.disabled = true;
    inputEl.value  = '';
    inputEl.style.height = 'auto';

    addMessage('user', message);
    const context = history.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    const aiId    = addMessage('assistant', '<span class="text-outline text-xs italic">Thinking…</span>', true);
    const contentEl = document.querySelector(`#${aiId} .msg-content`);
    const cursorEl  = document.getElementById(`cursor-${aiId}`);

    let rawText  = '';

    try {
      const mode = document.getElementById('chat-mode')?.value || 'default';
      const lang = document.getElementById('chat-lang')?.value || 'en';
      const body = await streamChat(message, context, lang, mode);
      const reader  = body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

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
            const delta  = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              rawText += delta;
              if (contentEl) contentEl.innerHTML = renderMarkdown(rawText);
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          } catch {}
        }
      }

      // Final render — ensure complete markdown is rendered
      if (contentEl && rawText) contentEl.innerHTML = renderMarkdown(rawText);

    } catch (e) {
      if (contentEl) contentEl.innerHTML = `<p class="text-error text-sm font-semibold">Error: ${escHtml(e.message)}</p>`;
    } finally {
      cursorEl?.remove();
      history.push({ role: 'user', content: message }, { role: 'assistant', content: rawText });
      isStreaming      = false;
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
    // Keep only the welcome message (first child)
    const msgs = messagesEl.children;
    while (msgs.length > 1) messagesEl.removeChild(msgs[msgs.length - 1]);
  });
}
