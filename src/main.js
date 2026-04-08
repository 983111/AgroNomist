import './style.css';
import { Router } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderResearch, initResearch } from './pages/research.js';
import { renderLab, initLab } from './pages/lab.js';
import { renderSoil, initSoil } from './pages/soil.js';
import { renderDisease, initDisease } from './pages/disease.js';
import { renderWeather, initWeather } from './pages/weather.js';
import { renderMarket, initMarket } from './pages/market.js';
import { renderNetwork, initNetwork } from './pages/network.js';
import { renderShop, initShop } from './pages/shop.js';
import { renderFeedback, initFeedback } from './pages/feedback.js';

const routes = [
  { path: '/',         render: renderDashboard, init: initDashboard },
  { path: '/research', render: renderResearch,  init: initResearch  },
  { path: '/lab',      render: renderLab,       init: initLab       },
  { path: '/soil',     render: renderSoil,      init: initSoil      },
  { path: '/disease',  render: renderDisease,   init: initDisease   },
  { path: '/weather',  render: renderWeather,   init: initWeather   },
  { path: '/market',   render: renderMarket,    init: initMarket    },
  { path: '/network',  render: renderNetwork,   init: initNetwork   },
  { path: '/shop',     render: renderShop,      init: initShop      },
  { path: '/feedback', render: renderFeedback,  init: initFeedback  },
];

const app = document.getElementById('app');

window.addEventListener('route-change', (e) => {
  const route = e.detail;
  app.innerHTML = renderSidebar(route.path) + renderTopbar() + route.render();
  // Init page interactivity after DOM is ready
  if (route.init) {
    requestAnimationFrame(() => route.init());
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const router = new Router(routes);
router.start();
