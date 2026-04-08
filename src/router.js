export class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.navigate());
    if (!window.location.hash) window.location.hash = '#/';
  }
  navigate() {
    const hash = window.location.hash || '#/';
    const path = hash.replace('#', '') || '/';
    const route = this.routes.find(r => r.path === path) || this.routes[0];
    if (route) window.dispatchEvent(new CustomEvent('route-change', { detail: route }));
  }
  start() { this.navigate(); }
}

export function navigateTo(path) { window.location.hash = '#' + path; }
