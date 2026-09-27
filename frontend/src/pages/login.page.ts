import { Toast } from '../components/toast';
import { router } from '../router/router';
import { authStore } from '../store/auth.store';
import { Validator } from '../utils/validation';

export class LoginPage {
  private container: HTMLElement;
  private isLoginMode: boolean = true;

  constructor() {
    this.container = document.getElementById('main')!;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-logo">
            <img src="/assets/youtube.png" alt="Vidora" class="auth-logo-img" />
          </div>
          <h1 class="auth-title">Vidora</h1>
          <p class="auth-subtitle">Seus vídeos favoritos do YouTube</p>
          
          <div class="auth-tabs">
            <button 
              class="auth-tab ${this.isLoginMode ? 'active' : ''}" 
              id="tab-login"
            >
              Entrar
            </button>
            <button 
              class="auth-tab ${!this.isLoginMode ? 'active' : ''}" 
              id="tab-register"
            >
              Registrar
            </button>
          </div>

          <form id="auth-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                class="form-input" 
                placeholder="seu@email.com"
                required
              />
              <span class="form-error" id="email-error"></span>
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input 
                type="password" 
                id="senha" 
                class="form-input" 
                placeholder="Mínimo 6 caracteres"
                required
                minlength="6"
              />
              <span class="form-error" id="senha-error"></span>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btn-submit">
              ${this.isLoginMode ? 'Entrar' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents(): void {
    const form = document.getElementById('auth-form') as HTMLFormElement;
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    tabLogin?.addEventListener('click', () => {
      this.isLoginMode = true;
      this.render();
    });

    tabRegister?.addEventListener('click', () => {
      this.isLoginMode = false;
      this.render();
    });

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const senhaInput = document.getElementById('senha') as HTMLInputElement;
    const btnSubmit = document.getElementById('btn-submit') as HTMLButtonElement;

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    this.clearErrors();

    const errors = Validator.validateLoginForm(email, senha);

    if (Object.keys(errors).length > 0) {
      this.showErrors(errors);
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Carregando...';

    try {
      if (this.isLoginMode) {
        await authStore.login(email, senha);
        Toast.success('Login realizado com sucesso!');
      } else {
        await authStore.register(email, senha);
        Toast.success('Cadastro realizado com sucesso!');
      }
      
      router.navigate('/');
    } catch (error: any) {
      Toast.error(error.message || 'Erro ao processar requisição');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = this.isLoginMode ? 'Entrar' : 'Registrar';
    }
  }

  private showErrors(errors: { email?: string; senha?: string }): void {
    if (errors.email) {
      const emailError = document.getElementById('email-error');
      if (emailError) emailError.textContent = errors.email;
    }
    if (errors.senha) {
      const senhaError = document.getElementById('senha-error');
      if (senhaError) senhaError.textContent = errors.senha;
    }
  }

  private clearErrors(): void {
    const emailError = document.getElementById('email-error');
    const senhaError = document.getElementById('senha-error');
    if (emailError) emailError.textContent = '';
    if (senhaError) senhaError.textContent = '';
  }
}