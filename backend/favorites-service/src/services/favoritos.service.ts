import { FavoritosRepository } from '../repositories/favoritos.repository';
import { CriarFavoritoDTO } from '../types';

export class FavoritosService {
  private repository: FavoritosRepository;

  constructor() {
    this.repository = new FavoritosRepository();
  }

  async adicionar(dados: CriarFavoritoDTO) {
    const existente = await this.repository.buscarPorUsuarioEVideo(
      dados.usuarioId,
      dados.videoId
    );

    if (existente) {
      throw new Error('Vídeo já está nos favoritos');
    }

    return await this.repository.criar(dados);
  }

  async remover(usuarioId: number, videoId: string) {
    const existente = await this.repository.buscarPorUsuarioEVideo(usuarioId, videoId);

    if (!existente) {
      throw new Error('Favorito não encontrado');
    }

    await this.repository.remover(usuarioId, videoId);
    return { mensagem: 'Favorito removido com sucesso' };
  }

  async listar(usuarioId: number) {
    const favoritos = await this.repository.buscarPorUsuario(usuarioId);
    
    return {
      favoritos: favoritos.map(f => ({
        id: f.id,
        videoId: f.video_id,
        adicionadoEm: f.created_at
      })),
      total: favoritos.length
    };
  }

  async verificar(usuarioId: number, videoId: string) {
    const favorito = await this.repository.buscarPorUsuarioEVideo(usuarioId, videoId);
    return {
      favoritado: !!favorito,
      favoritoId: favorito?.id
    };
  }
}