import { NextFunction, Request, Response } from 'express';
import { AuthProxy } from '../proxies/auth.proxy';
import { RespostaAuth } from '../types';

export interface RequisicaoAutenticada extends Request {
  usuario?: any;
  token?: string;
}

const authProxy = new AuthProxy();

export const autenticado = async (
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authorization.replace('Bearer ', '');
    req.token = token;

    const resultado: RespostaAuth = await authProxy.obterUsuario(token);
    req.usuario = resultado.dados;

    next();
  } catch (erro: any) {
    return res.status(401).json({ erro: erro.message });
  }
};
