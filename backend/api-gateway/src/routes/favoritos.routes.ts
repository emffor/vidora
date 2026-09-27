import { Response, Router } from 'express';
import { autenticado, RequisicaoAutenticada } from '../middlewares/autenticado';
import { FavoritosProxy } from '../proxies/favoritos.proxy';

const router = Router();
const favoritosProxy = new FavoritosProxy();

router.post('/', autenticado, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'videoId é obrigatório' 
      });
    }

    if (!req.usuario?.id || !req.usuario?.email || !req.token) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Usuário não autenticado' 
      });
    }

    const resultado = await favoritosProxy.adicionar(
      videoId,
      req.usuario.id.toString(),
      req.usuario.email,
      req.token
    );

    return res.status(201).json(resultado);
  } catch (erro: any) {
    return res.status(400).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

router.delete('/:videoId', autenticado, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!req.usuario?.id || !req.usuario?.email || !req.token) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Usuário não autenticado' 
      });
    }

    const resultado = await favoritosProxy.remover(
      videoId,
      req.usuario.id.toString(),
      req.usuario.email,
      req.token
    );

    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(404).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

router.get('/', autenticado, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    if (!req.usuario?.id || !req.usuario?.email || !req.token) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Usuário não autenticado' 
      });
    }

    const resultado = await favoritosProxy.listar(
      req.usuario.id.toString(),
      req.usuario.email,
      req.token
    );

    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(500).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

router.get('/:videoId/verificar', autenticado, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!req.usuario?.id || !req.usuario?.email || !req.token) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Usuário não autenticado' 
      });
    }

    const resultado = await favoritosProxy.verificar(
      videoId,
      req.usuario.id.toString(),
      req.usuario.email,
      req.token
    );

    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(500).json({ 
      sucesso: false,
      erro: erro.message 
    });
  }
});

export default router;