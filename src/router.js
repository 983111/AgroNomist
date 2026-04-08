// Simple hash-based SPA router
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.navigate());
    // Handle initial load
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
  }

  navigate() {
    const hash = window.location.hash || '#/';
    const path = hash.replace('#', '') || '/';
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
    if (route) {
      this.currentRoute = route;
      const event = new CustomEvent('route-change', { detail: route });
      window.dispatchEvent(event);
    }
  }

  start() {
    this.navigate();
  }
}

export function navigateTo(path) {
  window.location.hash = '#' + path;
}
