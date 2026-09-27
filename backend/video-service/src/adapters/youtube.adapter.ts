import { VideoFormatado, VideoItem, YouTubeSearchResponse } from '../types';

export class YouTubeAdapter {
  static formatarVideo(item: VideoItem): VideoFormatado {
    return {
      id: item.id.videoId,
      titulo: item.snippet.title,
      descricao: item.snippet.description,
      canal: item.snippet.channelTitle,
      canalId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails.high.url,
      publicadoEm: item.snippet.publishedAt
    };
  }

  static formatarResposta(resposta: YouTubeSearchResponse) {
    return {
      videos: resposta.items.map(this.formatarVideo),
      totalResultados: resposta.pageInfo.totalResults,
      proximaPagina: resposta.nextPageToken,
      paginaAnterior: resposta.prevPageToken
    };
  }

  static formatarVideoPorId(item: any): VideoFormatado {
    return {
      id: item.id,
      titulo: item.snippet.title,
      descricao: item.snippet.description,
      canal: item.snippet.channelTitle,
      canalId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails.high.url,
      publicadoEm: item.snippet.publishedAt
    };
  }
}