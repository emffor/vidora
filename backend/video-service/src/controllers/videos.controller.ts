import { Request, Response } from 'express';
import { YouTubeService } from '../services/youtube.service';

export class VideosController {
  private youtubeService: YouTubeService;

  constructor() {
    this.youtubeService = new YouTubeService();
  }

  buscar = async (req: Request, res: Response) => {
    try {
      const { q, pageToken } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ 
          sucesso: false,
          erro: 'Parâmetro de busca (q) é obrigatório' 
        });
      }

      const resultado = await this.youtubeService.buscarVideos(
        q, 
        pageToken as string | undefined
      );

      return res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (erro: any) {
      return res.status(500).json({
        sucesso: false,
        erro: erro.message
      });
    }
  };

  obterPorIds = async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'ids deve ser um array'
        });
      }

      const resultado = await this.youtubeService.obterVideosPorIds(ids);

      return res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (erro: any) {
      return res.status(500).json({
        sucesso: false,
        erro: erro.message
      });
    }
  };
}