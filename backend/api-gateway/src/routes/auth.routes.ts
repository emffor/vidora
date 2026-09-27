import { Request, Response, Router } from 'express';
import { autenticado, RequisicaoAutenticada } from '../middlewares/autenticado';
import { AuthProxy } from '../proxies/auth.proxy';

const router = Router();
const authProxy = new AuthProxy();

router.post('/registrar', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const resultado = await authProxy.registrar(email, senha);
    return res.status(201).json(resultado);
  } catch (erro: any) {
    return res.status(400).json({ erro: erro.message });
  }
});

router.post('/entrar', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const resultado = await authProxy.entrar(email, senha);
    return res.status(200).json(resultado);
  } catch (erro: any) {
    return res.status(401).json({ erro: erro.message });
  }
});

router.get('/usuario', autenticado, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    return res.status(200).json({ sucesso: true, dados: req.usuario });
  } catch (erro: any) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;