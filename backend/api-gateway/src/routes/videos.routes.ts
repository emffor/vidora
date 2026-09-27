import { Request, Response, Router } from 'express';
import { VideosProxy } from '../proxies/videos.proxy';

const router = Router();
const videosProxy = new VideosProxy();

router.get('/buscar', async (req: Request, res: Response) => {
  try {
    const { q, pageToken } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Parâmetro de busca (q) é obrigatório' 
      });
    }

    const resultado = await videosProxy.buscarVideos(q, pageToken as string);
    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(500).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

router.post('/ids', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ids deve ser um array'
      });
    }

    const resultado = await videosProxy.obterVideosPorIds(ids);
    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(500).json({
      sucesso: false,
      erro: erro.message
    });
  }
});

export default router;