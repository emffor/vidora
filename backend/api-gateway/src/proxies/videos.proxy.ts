import { HttpClient } from '../config/http-client';

const VIDEOS_SERVICE_URL = process.env.VIDEOS_SERVICE_URL || 'http://localhost:3002';

export class VideosProxy {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(VIDEOS_SERVICE_URL);
  }

  async buscarVideos(query: string, pageToken?: string) {
    try {
      const params = new URLSearchParams({ q: query });
      if (pageToken) params.append('pageToken', pageToken);
      
      const url = `/api/buscar?${params.toString()}`;
      return await this.client.get(url);
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao buscar vídeos');
    }
  }

  async obterVideosPorIds(ids: string[]) {
    try {
      return await this.client.post('/api/ids', { ids });
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao obter vídeos por IDs');
    }
  }
}