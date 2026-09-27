import { Response } from 'express';
import { RequisicaoAutenticada } from '../middlewares/autenticado';
import { FavoritosService } from '../services/favoritos.service';

export class FavoritosController {
  private service: FavoritosService;

  constructor() {
    this.service = new FavoritosService();
  }

  adicionar = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const { videoId } = req.body;
      const usuarioId = Number(req.usuario?.id);

      if (!videoId) {
        return res.status(400).json({ 
          sucesso: false,
          erro: 'videoId é obrigatório' 
        });
      }

      const resultado = await this.service.adicionar({ videoId, usuarioId });
      return res.status(201).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(400).json({ 
        sucesso: false,
        erro: erro.message 
      });
    }
  };

  remover = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const { videoId } = req.params;
      const usuarioId = Number(req.usuario?.id);

      const resultado = await this.service.remover(usuarioId, videoId);
      return res.status(200).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(404).json({ 
        sucesso: false,
        erro: erro.message 
      });
    }
  };

  listar = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const usuarioId = Number(req.usuario?.id);
      const resultado = await this.service.listar(usuarioId);
      return res.status(200).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(500).json({ 
        sucesso: false,
        erro: erro.message 
      });
    }
  };

  verificar = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const { videoId } = req.params;
      const usuarioId = Number(req.usuario?.id);

      const resultado = await this.service.verificar(usuarioId, videoId);
      return res.status(200).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(500).json({ 
        sucesso: false,
        erro: erro.message 
      });
    }
  };
}