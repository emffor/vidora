import { YouTubeAdapter } from '../adapters/youtube.adapter';
import { youtubeConfig } from '../config/youtube';
import { YouTubeSearchResponse, YouTubeVideoResponse } from '../types';
import { HttpClient } from '../utils/http-client';

export class YouTubeService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(youtubeConfig.baseURL, youtubeConfig.timeout);
  }

  async buscarVideos(query: string, pageToken?: string) {
    try {
      const params: Record<string, string> = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: youtubeConfig.maxResults.toString(),
        key: youtubeConfig.apiKey
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await this.client.get<YouTubeSearchResponse>('/search', params);
      return YouTubeAdapter.formatarResposta(response);
    } catch (erro: any) {
      if (erro.message.includes('403')) {
        throw new Error('API Key inválida ou quota excedida');
      }
      if (erro.message.includes('400')) {
        throw new Error('Parâmetros de busca inválidos');
      }
      throw new Error('Erro ao buscar vídeos no YouTube');
    }
  }

  async obterVideosPorIds(ids: string[]) {
    try {
      if (ids.length === 0) {
        return { videos: [] };
      }

      const params: Record<string, string> = {
        part: 'snippet',
        id: ids.join(','),
        key: youtubeConfig.apiKey
      };

      const response = await this.client.get<YouTubeVideoResponse>('/videos', params);

      return {
        videos: response.items.map(YouTubeAdapter.formatarVideoPorId)
      };
    } catch (erro: any) {
      if (erro.message.includes('403')) {
        throw new Error('API Key inválida ou quota excedida');
      }
      throw new Error('Erro ao obter vídeos do YouTube');
    }
  }
}