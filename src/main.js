import './style.css';
import { Router } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderLocationModal, initLocationModal } from './components/location-modal.js';
import { loadPrefs } from './services/api.js';
import { requireAuth, signOut, supabase } from './auth.js';

import { renderDashboard,      initDashboard      } from './pages/dashboard.js';
import { renderResearch,       initResearch       } from './pages/research.js';
import { renderLab,            initLab            } from './pages/lab.js';
import { renderRecommendations, initRecommendations } from './pages/soil.js';
import { renderDisease,        initDisease        } from './pages/disease.js';
import { renderWeather,        initWeather        } from './pages/weather.js';
import { renderMarket,         initMarket         } from './pages/market.js';
import { renderNetwork,        initNetwork        } from './pages/network.js';
import { renderShop,           initShop           } from './pages/shop.js';
import { renderFeedback,       initFeedback       } from './pages/feedback.js';
import { renderMultiAgent,     initMultiAgent     } from './pages/multiagent.js';

// ─── Auth Guard ───────────────────────────────────────────────────────────────

async function bootstrap() {
  // Check auth before loading app
  const authData = await requireAuth();
  if (!authData) return; // requireAuth redirects if not logged in

  // Load saved preferences (may be overridden by profile data from auth)
  loadPrefs();

  initApp(authData);
}

function initApp(authData) {
  const routes = [
    { path: '/',            render: renderDashboard,       init: initDashboard       },
    { path: '/multiagent',  render: renderMultiAgent,      init: initMultiAgent      },
    { path: '/research',    render: renderResearch,        init: initResearch        },
    { path: '/lab',         render: renderLab,             init: initLab             },
    { path: '/soil',        render: renderRecommendations, init: initRecommendations },
    { path: '/disease',     render: renderDisease,         init: initDisease         },
    { path: '/weather',     render: renderWeather,         init: initWeather         },
    { path: '/market',      render: renderMarket,          init: initMarket          },
    { path: '/network',     render: renderNetwork,         init: initNetwork         },
    { path: '/shop',        render: renderShop,            init: initShop            },
    { path: '/feedback',    render: renderFeedback,        init: initFeedback        },
  ];

  const app = document.getElementById('app');

  function initMobileLayout() {
    const sidebar = document.getElementById('app-sidebar');
    const openBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    if (!sidebar || !openBtn || !overlay) return;

    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
    const openSidebar  = () => { sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden'); document.body.classList.add('overflow-hidden'); };
    const closeSidebar = () => { if (!isDesktop()) { sidebar.classList.add('-translate-x-full'); } overlay.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); };

    openBtn.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSidebar));
    window.addEventListener('resize', closeSidebar);
  }

  function initSignOut() {
    document.getElementById('signout-btn')?.addEventListener('click', async () => {
      if (confirm('Sign out of AgriIntel?')) await signOut();
    });
  }

  window.addEventListener('route-change', (e) => {
    const route = e.detail;
    app.innerHTML =
      renderSidebar(route.path) +
      renderTopbar(authData?.profile) +
      renderLocationModal() +
      route.render();

    requestAnimationFrame(() => {
      initMobileLayout();
      if (route.init) route.init();
      initLocationModal();
      initSignOut();
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const router = new Router(routes);
  router.start();

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = '/auth.html';
    }
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

bootstrap();
