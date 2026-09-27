import Database from '../config/database';
import { CriarFavoritoDTO, Favorito } from '../types';

export class FavoritosRepository {
  async criar(dados: CriarFavoritoDTO): Promise<Favorito> {
    const resultado = await Database.query(
      'INSERT INTO favoritos (video_id, usuario_id) VALUES ($1, $2) RETURNING *',
      [dados.videoId, dados.usuarioId]
    );
    return resultado.rows[0];
  }

  async buscarPorUsuario(usuarioId: number): Promise<Favorito[]> {
    const resultado = await Database.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1 ORDER BY created_at DESC',
      [usuarioId]
    );
    return resultado.rows;
  }

  async buscarPorUsuarioEVideo(usuarioId: number, videoId: string): Promise<Favorito | null> {
    const resultado = await Database.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1 AND video_id = $2',
      [usuarioId, videoId]
    );
    return resultado.rows[0] || null;
  }

  async remover(usuarioId: number, videoId: string): Promise<void> {
    await Database.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND video_id = $2',
      [usuarioId, videoId]
    );
  }

  async contarPorUsuario(usuarioId: number): Promise<number> {
    const resultado = await Database.query(
      'SELECT COUNT(*) as total FROM favoritos WHERE usuario_id = $1',
      [usuarioId]
    );
    return parseInt(resultado.rows[0].total);
  }
}