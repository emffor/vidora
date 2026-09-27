import { NextFunction, Request, Response } from 'express';

export interface RequisicaoAutenticada extends Request {
  usuario?: {
    id: string;
    email: string;
  };
}

export const autenticado = (
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
) => {
  try {
    const usuarioHeader = req.headers['x-usuario-id'];
    const emailHeader = req.headers['x-usuario-email'];

    if (!usuarioHeader || !emailHeader) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Não autenticado' 
      });
    }

    req.usuario = {
      id: usuarioHeader as string,
      email: emailHeader as string
    };

    next();
  } catch (erro) {
    return res.status(401).json({ 
      sucesso: false,
      erro: 'Erro na autenticação' 
    });
  }
};