import './style.css';
import { Router } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderResearch } from './pages/research.js';
import { renderLab } from './pages/lab.js';
import { renderSoil } from './pages/soil.js';
import { renderDisease } from './pages/disease.js';
import { renderWeather } from './pages/weather.js';
import { renderMarket } from './pages/market.js';
import { renderNetwork } from './pages/network.js';
import { renderShop } from './pages/shop.js';
import { renderFeedback } from './pages/feedback.js';

const routes = [
  { path: '/', render: renderDashboard },
  { path: '/research', render: renderResearch },
  { path: '/lab', render: renderLab },
  { path: '/soil', render: renderSoil },
  { path: '/disease', render: renderDisease },
  { path: '/weather', render: renderWeather },
  { path: '/market', render: renderMarket },
  { path: '/network', render: renderNetwork },
  { path: '/shop', render: renderShop },
  { path: '/feedback', render: renderFeedback },
];

const app = document.getElementById('app');

function renderApp(route) {
  const pageContent = route.render();
  app.innerHTML = renderSidebar(route.path) + renderTopbar() + pageContent;
}

window.addEventListener('route-change', (e) => {
  renderApp(e.detail);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const router = new Router(routes);
router.start();
