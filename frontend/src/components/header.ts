import { router } from '../router/router';
import { authStore } from '../store/auth.store';

export class Header {
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
    this.render();
    
    authStore.subscribe(() => this.render());
  }

  private render(): void {
    const isAuth = authStore.isAuth();
    const usuario = authStore.getState().usuario;

    this.container.innerHTML = `
      <nav class="navbar">
        <div class="navbar-brand">
          <img src="/assets/vidora.png" alt="Vidora" class="navbar-logo" />
          <h1>Vidora</h1>
        </div>
        
        ${isAuth ? `
          <div class="navbar-menu">
            <a href="/" class="navbar-link ${router.getCurrentPath() === '/' ? 'active' : ''}">
              <img src="/assets/inicio.png" alt="Início" class="nav-icon" />
              Início
            </a>
            <a href="/favoritos" class="navbar-link ${router.getCurrentPath() === '/favoritos' ? 'active' : ''}">
              <img src="/assets/favoritos.png" alt="Favoritos" class="nav-icon" />
              Favoritos
            </a>
          </div>
          
          <div class="navbar-user">
            <span class="user-email">${usuario?.email}</span>
            <button class="btn btn-secondary" id="btn-logout">Sair</button>
          </div>
        ` : ''}
      </nav>
    `;

    if (isAuth) {
      this.attachEvents();
    }
  }

  private attachEvents(): void {
    const btnLogout = document.getElementById('btn-logout');
    
    btnLogout?.addEventListener('click', () => {
      authStore.logout();
      router.navigate('/login');
    });

    const links = this.container.querySelectorAll('.navbar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).getAttribute('href');
        if (href) router.navigate(href);
      });
    });
  }
}