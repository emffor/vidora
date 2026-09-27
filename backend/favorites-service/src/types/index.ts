export interface Favorito {
  id: number;
  video_id: string;
  usuario_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CriarFavoritoDTO {
  videoId: string;
  usuarioId: number;
}

export interface RespostaAPI<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}