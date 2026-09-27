import { HttpClient } from '../config/http-client';

const FAVORITOS_SERVICE_URL = process.env.FAVORITOS_SERVICE_URL || 'http://localhost:3003';

interface ErrorResponse {
  erro?: string;
}

export class FavoritosProxy {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(FAVORITOS_SERVICE_URL);
  }

  async adicionar(videoId: string, usuarioId: string, usuarioEmail: string, token: string) {
    try {
      const response = await fetch(`${FAVORITOS_SERVICE_URL}/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-usuario-id': usuarioId,
          'x-usuario-email': usuarioEmail
        },
        body: JSON.stringify({ videoId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ErrorResponse;
        throw new Error(errorData.erro || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao adicionar favorito');
    }
  }

  async remover(videoId: string, usuarioId: string, usuarioEmail: string, token: string) {
    try {
      const response = await fetch(`${FAVORITOS_SERVICE_URL}/api/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-usuario-id': usuarioId,
          'x-usuario-email': usuarioEmail
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ErrorResponse;
        throw new Error(errorData.erro || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao remover favorito');
    }
  }

  async listar(usuarioId: string, usuarioEmail: string, token: string) {
    try {
      const response = await fetch(`${FAVORITOS_SERVICE_URL}/api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-usuario-id': usuarioId,
          'x-usuario-email': usuarioEmail
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ErrorResponse;
        throw new Error(errorData.erro || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao listar favoritos');
    }
  }

  async verificar(videoId: string, usuarioId: string, usuarioEmail: string, token: string) {
    try {
      const response = await fetch(`${FAVORITOS_SERVICE_URL}/api/${videoId}/verificar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-usuario-id': usuarioId,
          'x-usuario-email': usuarioEmail
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ErrorResponse;
        throw new Error(errorData.erro || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao verificar favorito');
    }
  }
}