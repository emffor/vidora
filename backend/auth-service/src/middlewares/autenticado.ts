import { NextFunction, Request, Response } from 'express';
import { CargaToken } from '../types';
import { JWT } from '../utils/jwt';

export interface RequisicaoAutenticada extends Request {
  usuario?: CargaToken;
}

export const autenticado = (
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
    const carga = JWT.verificar(token);

    req.usuario = carga;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};